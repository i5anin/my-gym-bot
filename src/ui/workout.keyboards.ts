import { InlineKeyboard } from "grammy";
import type { WorkoutSplit } from "@/domain/workout.types";

export const SplitCallbackPrefix = "split:" as const;

export function splitKeyboard(): InlineKeyboard {
    return new InlineKeyboard()
        .text("1. Спина", `${SplitCallbackPrefix}back_traps`).text("Шраги", `${SplitCallbackPrefix}back_traps`).row()
        .text("2. Грудь", `${SplitCallbackPrefix}chest_calves`).text("Икры", `${SplitCallbackPrefix}chest_calves`).row()
        .text("3. Становая", `${SplitCallbackPrefix}deadlift`).row()
        .text("4. Плечи", `${SplitCallbackPrefix}shoulders_abs`).text("Пресс", `${SplitCallbackPrefix}shoulders_abs`).row()
        .text("5. Ноги верх", `${SplitCallbackPrefix}legs`).text("Ноги низ", `${SplitCallbackPrefix}legs`).row()
        .text("6. Бицепс", `${SplitCallbackPrefix}arms`).text("Трицепс", `${SplitCallbackPrefix}arms`);
}

export function controlKeyboard(): InlineKeyboard {
    return new InlineKeyboard().text("Готово", "workout:done").text("Отменить", "workout:cancel");
}

export function isSplitCallback(data: string): data is `${typeof SplitCallbackPrefix}${WorkoutSplit}` {
    return data.startsWith(SplitCallbackPrefix);
}

export function parseSplitCallback(data: `${typeof SplitCallbackPrefix}${WorkoutSplit}`): WorkoutSplit {
    return data.slice(SplitCallbackPrefix.length) as WorkoutSplit;
}
