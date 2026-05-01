import type { Page } from "@playwright/test";
import BasePage from "~~/test-utils/playwright/pages/base.page";

const LOCATORS = {
    // ACCOUNT UPSERT FORM
    accountTitleInput: "finance-upsert-title-input",
    accountCurrencySelect: "finance-upsert-currency-select",
    accountCurrencyOptions: "finance-upsert-currency-select-option",

    // TRANSACTION UPSERT FORM
    transactionAmountInput: "finance-transaction-upsert-amount-input",
    transactionCategoryInput: "finance-transaction-upsert-category-input",
    transactionReferenceInput: "finance-transaction-upsert-reference-input",

    // AUTO TRANSACTION UPSERT FORM
    autoTransactionAmountInput: "finance-auto-transaction-upsert-amount-input",
    autoTransactionCategoryInput: "finance-auto-transaction-upsert-category-input",
    autoTransactionReferenceInput: "finance-auto-transaction-upsert-reference-input",
    autoTransactionExecIntervalInput: "finance-auto-transaction-upsert-exec-interval-input",
    autoTransactionExecOnInput: "finance-auto-transaction-upsert-exec-on-input",

    // CATEGORY ICON
    categorySelect: "finance-category-icon-select-button",
    categoryOptions: "finance-category-icon-select-option",

    // CONTROL ELEMENTS
    accountMenu: "finance-account-control-menu",
    accountMenuOption: "finance-account-menu-option",
    editAccountButton: "finance-account-edit-account-button",
    createAccountButton: "finance-account-create-account-button",
    deleteAccountButton: "finance-account-delete-account-button",
    tabs: "finance-tab",

    // ACCOUNT TAB
    transactionCreateButton: "finance-transaction-create-button",
    transactionEditButtons: "finance-transaction-edit-button",
    transactionDeleteButtons: "finance-transaction-delete-button",

    autoTransactionMenuButton: "finance-auto-transaction-menu-button",
    autoTransactionCreateButton: "finance-auto-transaction-create-button",
    autoTransactionEditButtons: "finance-auto-transaction-edit-button",
    autoTransactionDeleteButtons: "finance-auto-transaction-delete-button",

    filterMenuButton: "finance-filter-menu-button",
    filterReferenceInput: "finance-filter-reference-input",
    filterCategorySelect: "finance-filter-category-select",
    filterDateRangePicker: "finance-filter-date-range-picker",

    balanceChart: "finance-account-balance-chart",
    transactionCards: "finance-transaction-card",

    // BUDGETS TAB
    expensePieChart: "finance-expense-pie-chart",
    categoryBudgetCards: "finance-category-budget-progress-card",
    previousExpensesChart: "finance-previous-expenses-chart",

    // BILLS TAB
    remainingBillsCards: "finance-remaining-bills-card",
    paidBillsCards: "finance-paid-bills-card",
};

export default class TimerPage extends BasePage<typeof LOCATORS> {
    constructor(page: Page) {
        super(page, LOCATORS, "/finance");
    }

    async completeAccountUpsertForm({ title = "New Account", currency = "Euro" } = {}) {
        await this.fill("accountTitleInput", title);
        await this.click("accountCurrencySelect");
        await this.page.keyboard.type(currency);
        await this.click("accountCurrencyOptions", { nth: 0 });
        await this.click("upsertSubmit");
    }
}
