import BasePage from "@e2e/pages/base.page";
import type { Page } from "@playwright/test";

const LOCATORS = {
    // TIMER FORM
    titleInput: "timer-upsert-title-input",
    submitButton: "timer-upsert-submit-button",

    // TIMER FORM - INTERVAL
    legends: "interval-legend",
    formErrors: "timer-upsert-form-errors-alert",
    duplicateButtons: "interval-duplicate-button",
    moveUpButtons: "interval-move-up-button",
    moveDownButtons: "interval-move-down-button",
    deleteButtons: "interval-delete-button",
    typeSelect: "interval-type-select",
    typeOptions: "interval-type-option",
    repetitionsInputs: "interval-repetitions-input",
    intervalTitleInputs: "interval-title-input",
    durationInputs: "interval-duration-input",
    beatPatternInputs: "interval-beat-pattern-input",

    // TIMER LIST
    listItemTitles: "timer-list-item-title",
    listItemLengths: "timer-list-item-length",
    listItemPlayButtons: "timer-list-item-play-button",
    listItemEditButtons: "timer-list-item-edit-button",
    listItemDeleteButtons: "timer-list-item-delete-button",
    createButton: "timer-create-button",

    // TIMER PLAYBACK
    remainingTime: "timer-remaining-time",
    remainingIntervalTime: "timer-remaining-interval-time",
    activeRound: "timer-active-round",
    resetButton: "timer-controls-reset-button",
    playButton: "timer-controls-play-button",
    pauseButton: "timer-controls-pause-button",
    beatIndicator: "timer-beat-indicator",
    title: "timer-title",
    intervalTitle: "interval-title",
};

type Interval = { title?: string; duration?: number; repeatCount?: number; type?: number };

export default class TimerPage extends BasePage<typeof LOCATORS> {
    constructor(page: Page) {
        super(page, LOCATORS, "/timer");
    }

    async createTimer(data: { title: string; intervals?: Interval[] }, submit = true) {
        const { title, intervals = [] } = data;
        await this.fill("titleInput", title);
        await this.duplicateNthInterval(0, intervals.length - 1);
        for (const [index, interval] of intervals.entries()) {
            await this.fillNthInterval(index, interval);
        }
        if (submit) await this.click("submitButton");
    }

    async duplicateNthInterval(n: number, times: number) {
        await this.focus("intervalTitleInputs", { nth: n });
        for (let i = 0; i < times; i++) {
            await this.click("duplicateButtons", { nth: n });
        }
    }

    async fillNthInterval(n: number, data: Interval) {
        if (data.title) await this.fill("intervalTitleInputs", data.title, { nth: n });
        if (data.duration) await this.fill("durationInputs", data.duration.toString(), { nth: n });
        if (data.repeatCount) await this.fill("repetitionsInputs", data.repeatCount.toString(), { nth: n });
        if (data.type) {
            await this.click("typeSelect", { nth: n });
            await this.click("typeOptions", { nth: data.type });
        }
    }
}
