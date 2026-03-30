import {
    BASE_ACCOUNT,
    BASE_AUTO_TRANSACTION,
    BASE_TRANSACTION,
    FULL_ACCOUNT,
    FULL_AUTO_TRANSACTION,
    FULL_TRANSACTION,
} from "~~/test-utils/constants/finance";
import { type Method, TestBuilder } from "~~/test-utils/playwright/builders/base";
import {
    ACCOUNT_BAD_REQUEST_TEST_CASES,
    ACCOUNT_BAD_TITLE_TEST_CASES,
    ACCOUNT_VALID_REQUEST_TEST_CASES,
    ACCOUNT_VALID_TITLE_TEST_CASES,
    AUTO_TRANSACTION_BAD_REQUEST_TEST_CASES,
    AUTO_TRANSACTION_VALID_REQUEST_TEST_CASES,
    TRANSACTION_BAD_REQUEST_TEST_CASES,
    TRANSACTION_VALID_REQUEST_TEST_CASES,
} from "~~/test-utils/playwright/test-tables/finance";

export function makeAccountTestBuilder(method: Method) {
    return new TestBuilder({
        fixtureProvider: async ({ db, userId }) => {
            const [account] = await db.financeAccount.insert(1, userId ? { userId } : undefined);
            return {
                id: account.id,
                data: account,
                basePath: "/api/finance/accounts",
                fullPath: `/api/finance/accounts/${account.id}`,
                postDatabaseOverrides: { balance: 0 },
                putDatabaseOverrides: { balance: 0, currency: account.currency },
            };
        },
        baseData: BASE_ACCOUNT,
        fullData: FULL_ACCOUNT,
        badPost: ACCOUNT_BAD_REQUEST_TEST_CASES,
        badPut: ACCOUNT_BAD_TITLE_TEST_CASES,
        validPost: ACCOUNT_VALID_REQUEST_TEST_CASES,
        validPut: ACCOUNT_VALID_TITLE_TEST_CASES,
        fixtureName: "financeAccount",
        method,
    });
}

export function makeAutoTransactionTestBuilder(method: Method) {
    return new TestBuilder({
        fixtureProvider: async options => {
            const { db, userId, count = 1 } = options;
            const [account] = await db.financeAccount.insert(1, userId ? { userId } : undefined);
            const [category] = await db.financeCategory.insert(1, { accountId: account.id });
            const [autoTransaction, ...rest] = await db.financeAutoTransaction.insert(count as 1, {
                accountId: account.id,
                categoryId: category.id,
            });
            return {
                id: autoTransaction.id,
                parentId: account.id,
                data: count > 1 ? [autoTransaction, ...rest] : autoTransaction,
                basePath: `/api/finance/accounts/${account.id}/auto-transactions`,
                fullPath: `/api/finance/accounts/${account.id}/auto-transactions/${autoTransaction.id}`,
                postDatabaseOverrides: { accountId: account.id, category: undefined, categoryId: category.id },
                putDatabaseOverrides: { accountId: account.id, category: undefined, categoryId: category.id },
                putRequestOverrides: { category: { name: category.displayName, icon: category.icon } },
                postRequestOverrides: { category: { name: category.displayName, icon: category.icon } },
                getDatabaseOverrides: {
                    category: { name: category.displayName, icon: category.icon, id: category.id },
                    categoryId: undefined,
                },
            };
        },
        baseData: BASE_AUTO_TRANSACTION,
        fullData: FULL_AUTO_TRANSACTION,
        badPost: AUTO_TRANSACTION_BAD_REQUEST_TEST_CASES,
        badPut: AUTO_TRANSACTION_BAD_REQUEST_TEST_CASES,
        validPost: AUTO_TRANSACTION_VALID_REQUEST_TEST_CASES,
        validPut: AUTO_TRANSACTION_VALID_REQUEST_TEST_CASES,
        fixtureName: "financeAutoTransaction",
        parentFixtureName: "financeAccount",
        method,
    });
}

export function makeTransactionTestBuilder(method: Method) {
    return new TestBuilder({
        fixtureProvider: async options => {
            const { db, userId, count = 1 } = options;
            const [account] = await db.financeAccount.insert(1, userId ? { userId } : undefined);
            const [category] = await db.financeCategory.insert(1, { accountId: account.id });
            const [transaction, ...rest] = await db.financeTransaction.insert(count as 1, {
                accountId: account.id,
                categoryId: category.id,
                amount: 0,
            });
            return {
                id: transaction.id,
                parentId: account.id,
                data: count > 1 ? [transaction, ...rest] : transaction,
                basePath: `/api/finance/accounts/${account.id}/transactions`,
                fullPath: `/api/finance/accounts/${account.id}/transactions/${transaction.id}`,
                postDatabaseOverrides: { accountId: account.id, category: undefined, categoryId: category.id },
                putDatabaseOverrides: { accountId: account.id, category: undefined, categoryId: category.id },
                putRequestOverrides: { category: { name: category.displayName, icon: category.icon } },
                postRequestOverrides: { category: { name: category.displayName, icon: category.icon } },
                getDatabaseOverrides: {
                    category: { name: category.displayName, icon: category.icon, id: category.id },
                    categoryId: undefined,
                },
            };
        },
        baseData: BASE_TRANSACTION,
        fullData: FULL_TRANSACTION,
        badPost: TRANSACTION_BAD_REQUEST_TEST_CASES,
        badPut: TRANSACTION_BAD_REQUEST_TEST_CASES,
        validPost: TRANSACTION_VALID_REQUEST_TEST_CASES,
        validPut: TRANSACTION_VALID_REQUEST_TEST_CASES,
        fixtureName: "financeTransaction",
        parentFixtureName: "financeAccount",
        method,
    });
}
