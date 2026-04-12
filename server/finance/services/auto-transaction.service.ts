import type { LoggerService } from "#server/core/services/logger.service";
import AutoTransactionRepository from "#server/finance/repositories/auto-transaction.repository";
import TransactionRepository from "#server/finance/repositories/transaction.repository";
import AccountService from "#server/finance/services/account.service";
import CategoryService from "#server/finance/services/category.service";
import { tryCatch } from "#shared/core/utils/result.util";
import type { PostAutoTransaction, PutAutoTransaction } from "#shared/finance/validators/auto-transaction.validator";
import { CalendarDate, today } from "@internationalized/date";
import NotFoundError from "~~/server/core/errors/not-found.error";
import AccountRepository from "~~/server/finance/repositories/account.repository";

export default class AutoTransactionService {
    static readonly deps = [
        AutoTransactionRepository,
        AccountRepository,
        CategoryService,
        AccountService,
        TransactionRepository,
    ];

    constructor(
        private readonly autoTransactionRepository: AutoTransactionRepository,
        private readonly accountRepository: AccountRepository,
        private readonly categoryService: CategoryService,
        private readonly accountService: AccountService,
        private readonly transactionRepository: TransactionRepository,
        private readonly logger: LoggerService,
    ) {}

    public async setDeletedStatus(id: string, userId: string, accountId: string, isDeleted: boolean) {
        const operation = isDeleted ? "delete" : "undelete";

        const exists = await this.accountRepository.hasSubResource(id, userId, accountId, "financeAutoTransaction");
        if (!exists) {
            const logMessage = `Auto-transaction with id ${id} does not exist on account with id ${accountId} of user ${userId}.`;
            throw new NotFoundError("The requested account does not exist.", logMessage);
        }

        const rowCount = await this.autoTransactionRepository[operation]({ id, userId });
        if (rowCount === 0) {
            const logMessage = `Unable to ${operation} auto-transaction with id ${id} and user id ${userId}.`;
            throw new NotFoundError("The requested account does not exist.", logMessage);
        }
    }

    /* c8 ignore start */
    public async getList(userId: string, accountId: string) {
        return this.autoTransactionRepository.findByUserAndAccountId(userId, accountId);
    }
    /* c8 ignore stop */

    public async update(id: string, userId: string, accountId: string, autoTransaction: PutAutoTransaction) {
        return this.autoTransactionRepository.transaction(async tx => {
            await this.accountService.getUserAccount(userId, accountId, tx);

            const { category, ...newAutoTransaction } = autoTransaction;
            const categoryId = await this.categoryService.upsert(userId, accountId, category, tx);
            const result = await this.autoTransactionRepository.update(
                id,
                userId,
                accountId,
                { ...newAutoTransaction, categoryId },
                tx,
            );

            if (!result) {
                const logMessage = `Unable to update auto-transaction ${id} on account with id ${accountId} for user with id ${userId}.`;
                throw new NotFoundError(
                    "The requested auto-transaction does not exist on the given account.",
                    logMessage,
                );
            }

            return result;
        });
    }

    public async create(userId: string, accountId: string, autoTransaction: PostAutoTransaction) {
        return this.autoTransactionRepository.transaction(async tx => {
            await this.accountService.getUserAccount(userId, accountId, tx);
            const { category, ...newAutoTransaction } = autoTransaction;
            const categoryId = await this.categoryService.upsert(userId, accountId, category, tx);
            return await this.autoTransactionRepository.create(accountId, { ...newAutoTransaction, categoryId }, tx);
        });
    }

    public async execute(userId: string, accountId: string, tz: string) {
        await tryCatch(
            this.autoTransactionRepository.transaction(async tx => {
                const autoTransactions = await this.autoTransactionRepository.findByUserAndAccountId(
                    userId,
                    accountId,
                    tx,
                );
                const now = today(tz);
                const promises = [];
                for (const autoTransaction of autoTransactions) {
                    const [year, month, day] = autoTransaction.lastExec.split("-").map(Number);
                    if (!year || !month || !day) {
                        this.logger.warn(
                            `Unable to parse lastExec (${autoTransaction.lastExec}) of autoTransaction with ID ${autoTransaction.id}.`,
                        );
                        continue;
                    }

                    let prevExec = new CalendarDate(year, month, day);

                    while (true) {
                        const nextExec = prevExec
                            .add({
                                months: autoTransaction.execInterval,
                            })
                            .set({ day: autoTransaction.execOn });

                        if (now.compare(nextExec) < 0) {
                            promises.push(
                                this.autoTransactionRepository.update(
                                    autoTransaction.id,
                                    userId,
                                    accountId,
                                    {
                                        ...autoTransaction,
                                        categoryId: autoTransaction.category.id,
                                        lastExec: prevExec.toString(),
                                    },
                                    tx,
                                ),
                            );
                            break;
                        }
                        const transaction = {
                            createdAt: nextExec.toDate(tz),
                            amount: autoTransaction.amount,
                            reference: autoTransaction.reference,
                            categoryId: autoTransaction.category.id,
                        };
                        prevExec = nextExec;
                        promises.push(this.transactionRepository.create(accountId, transaction, tx));
                    }
                }
                await Promise.all(promises);
            }),
        );
    }
}
