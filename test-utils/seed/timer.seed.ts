import { Beat } from "#shared/timer/enums/beat.enum";
import { arr, int, maybe } from "@@/test-utils/helpers/data";
import { test } from "~~/test-utils/playwright";

const timerTitles = ["Core Workout", "Cardio Burst", "Stretch & Mobility", "Upper Body Strength", "Lower Body Power"];
const intervalTitles = [
    ["Plank", "Russian Twists", "Bicycle Crunches", "Leg Raises", "Mountain Climbers", "Flutter Kicks", "Side Plank"],
    ["Jumping Jacks", "High Knees", "Butt Kicks", "Fast Feet", "Sprint in Place"],
    ["Arm Circles", "Hip Circles", "Hamstring Stretch", "Quad Stretch", "Cat-Cow Stretch", "Shoulder Stretch"],
    ["Push-Ups", "Dips", "Pike Push-Ups", "Diamond Push-Ups", "Handstand Hold", "Chin-Ups"],
    ["Squats", "Jump Squats", "Lunges", "Bulgarian Split Squats", "Glute Bridges", "Step-Ups", "Calf Raises"],
];

test("insert timer test data", async ({ db }) => {
    for (let i = 0; i < timerTitles.length; i++) {
        const [timer] = await db.timer.insert(1, {
            title: timerTitles[i],
        });

        for (let j = 0; j < intervalTitles[i]!.length; j++) {
            const seed = 10 * i + j;
            await db.timerInterval.insert(1, {
                timerId: timer.id,
                title: intervalTitles[i]![j],
                repeatCount: int({ min: 1, max: 5, seed }),
                duration: int({ min: 10, max: 60, seed }) * 1000,
                preparationTime: int({ min: 0, max: 60, seed }) * 1000,
                beatPattern: maybe(() => arr(Object.values(Beat), { length: int({ min: 2, max: 30, seed }) }), {
                    seed,
                    odds: 0.2,
                }),
            });
        }
    }
});
