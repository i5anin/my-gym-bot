import {Bot, Context, Keyboard} from "grammy";
import type {InlineKeyboardMarkup} from "grammy/types";

/**
 * Допустимые шаги заполнения формы записи на интенсив.
 */
type LeadStep =
    | "idle"
    | "name"
    | "phone"
    | "email"
    | "questions";

/**
 * Полные данные заявки.
 */
interface LeadFormData {
    name: string;
    phone: string;
    email: string;
    questions?: string;
}

/**
 * Состояние заполнения формы для конкретного пользователя.
 */
interface LeadState {
    step: LeadStep;
    data: Partial<LeadFormData>;
    cardMessageId?: number;
}

const managerChatId = Number(process.env.MANAGER_CHAT_ID);
const userStates = new Map<number, LeadState>();

const noQuestionsKeyboard = new Keyboard()
    .text("нет")
    .oneTime()
    .resized();

const cancelInlineKeyboard: InlineKeyboardMarkup = {
    inline_keyboard: [[{text: "Отменить", callback_data: "cancel_form"}]],
};

/**
 * Извлекает chatId из контекста, если он является числом.
 */
function getChatId(ctx: Context): number | null {
    const chatId = ctx.chat?.id;
    return typeof chatId === "number" ? chatId : null;
}

/**
 * Возвращает или инициализирует состояние лида для заданного чата.
 */
function ensureState(chatId: number): LeadState {
    let state = userStates.get(chatId);
    if (!state) {
        state = {
            step: "idle",
            data: {},
        };
        userStates.set(chatId, state);
    }
    return state;
}

/**
 * Полностью сбрасывает состояние лида для заданного чата.
 */
function resetState(chatId: number): void {
    userStates.delete(chatId);
}

/**
 * Базовая валидация телефонного номера.
 * Оставляет только цифры и проверяет допустимую длину.
 */
function isValidPhone(text: string): boolean {
    const digits = text.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 20;
}

/**
 * Простейшая валидация email с использованием регулярного выражения.
 */
function isValidEmail(text: string): boolean {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(text);
}

function getStepLabel(step: LeadStep): string {
    switch (step) {
        case "idle":
            return "ожидание начала";
        case "name":
            return "ввод имени";
        case "phone":
            return "ввод телефона";
        case "email":
            return "ввод email";
        case "questions":
            return "вопросы и пожелания";
        default:
            return "неизвестный шаг";
    }
}

function renderLeadCard(state: LeadState): string {
    const {data, step} = state;

    const lines: string[] = [
        "<b>ЗАЯВКА НА ИНТЕНСИВ</b>",
        "",
    ];

    if (data.name) {
        lines.push(`Имя: <b>${data.name}</b>`);
    }

    if (data.phone) {
        lines.push(`Телефон: <b>${data.phone}</b>`);
    }

    if (data.email) {
        lines.push(`Email: <b>${data.email}</b>`);
    }

    if (data.questions) {
        lines.push(`Вопросы/пожелания: <b>${data.questions}</b>`);
    }

    if (lines[lines.length - 1] !== "") {
        lines.push("");
    }

    lines.push(`Текущий шаг: <i>${getStepLabel(step)}</i>`);

    const content = lines.join("\n");
    return `<blockquote>${content}</blockquote>`;
}

function buildIntroMessage(state: LeadState): string {
    const intro = "<b>Я помогу записаться на интенсив</b>\n";
    const footer = "<i>в любой момент вы можете отменить заполнение</i>.";
    const card = renderLeadCard(state);

    return `${intro}\n${card}\n${footer}`;
}

async function updateLeadCard(
    ctx: Context,
    chatId: number,
    state: LeadState,
): Promise<void> {
    if (!state.cardMessageId) {
        return;
    }

    const text = buildIntroMessage(state);

    try {
        await ctx.api.editMessageText(chatId, state.cardMessageId, text, {
            parse_mode: "HTML",
            reply_markup: cancelInlineKeyboard,
        });
    } catch {
        // намеренно игнорируется, чтобы не ломать основной поток обработки
    }
}

/**
 * Формирует ссылку на пользователя для менеджера.
 */
function buildUserLink(ctx: Context): string {
    const from = ctx.from;
    if (!from) {
        return "неизвестный пользователь";
    }

    const baseName = `${from.first_name ?? ""} ${from.last_name ?? ""}`.trim();
    const usernamePart = from.username ? ` (@${from.username})` : "";
    const visibleName = (baseName + usernamePart).trim() || "пользователь";

    const link = from.username
        ? `https://t.me/${from.username}`
        : `tg://user?id=${from.id}`;

    return `${visibleName} — ${link}`;
}

/**
 * Формирует текстовое резюме заявки для передачи менеджеру.
 */
function buildLeadSummary(ctx: Context, data: LeadFormData): string {
    const userLink = buildUserLink(ctx);

    return [
        "Новая заявка на интенсив",
        "",
        `Клиент: <b>${userLink}</b>`,
        "",
        `Имя: <b>${data.name}</b>`,
        `Телефон: <b>${data.phone}</b>`,
        `Email: <b>${data.email}</b>`,
        `Вопросы/пожелания: <b>${data.questions ?? "-"}</b>`,
    ].join("\n");
}

/**
 * Завершает оформление заявки:
 * - проверяет наличие обязательных полей,
 * - формирует резюме,
 * - отправляет подтверждение пользователю,
 * - пересылает данные менеджеру (если настроен MANAGER_CHAT_ID),
 * - сбрасывает состояние и снимает клавиатуру.
 */
async function finalizeLead(
    ctx: Context,
    chatId: number,
    state: LeadState,
): Promise<void> {
    const data = state.data;

    if (!data.name || !data.phone || !data.email) {
        await ctx.reply(
            "<b>Не удалось завершить заявку</b> <i>(не все обязательные поля заполнены)</i>.",
            {
                reply_markup: {remove_keyboard: true},
                parse_mode: "HTML",
            },
        );
        return;
    }

    const fullData: LeadFormData = {
        name: data.name,
        phone: data.phone,
        email: data.email,
        questions: data.questions,
    };

    const summary = buildLeadSummary(ctx, fullData);

    await ctx.reply(
        "<b>Спасибо</b>\n<i>вы записались, менеджер свяжется с вами в ближайшее время</i>.",
        {
            reply_markup: {remove_keyboard: true},
            parse_mode: "HTML",
        },
    );

    if (Number.isFinite(managerChatId)) {
        try {
            await ctx.api.sendMessage(managerChatId as number, summary, {
                parse_mode: "HTML",
            });
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error("[LEAD] Не удалось отправить заявку менеджеру", {
                managerChatId,
                error,
            });

            if (process.env.NODE_ENV === "development") {
                await ctx.reply(
                    "<b>Предупреждение</b>\n" +
                    "<i>не удалось доставить заявку менеджеру возможно, неверный MANAGER_CHAT_ID или бот не писал в этот чат</i>.",
                    {parse_mode: "HTML"},
                );
            }
        }
    } else {
        await ctx.reply(
            "<b>Отправка менеджеру не настроена</b> <code>MANAGER_CHAT_ID не задан</code>.",
            {
                parse_mode: "HTML",
            },
        );
    }

    resetState(chatId);
}

/**
 * Регистрирует все команды и обработчики сообщений Telegram-бота.
 */
export async function registerCommands(bot: Bot<Context>): Promise<void> {
    bot.command("start", async (ctx) => {
        const chatId = getChatId(ctx);
        if (!chatId) return;

        const state = ensureState(chatId);
        state.step = "name";
        state.data = {};

        const message = await ctx.reply(buildIntroMessage(state), {
            parse_mode: "HTML",
            reply_markup: cancelInlineKeyboard,
        });

        state.cardMessageId = message.message_id;

        await ctx.reply(
            "<b>Как к вам обращаться</b>\n<i>имя и, при желании, фамилия</i>?",
            {parse_mode: "HTML"},
        );
    });

    bot.command("cancel", async (ctx) => {
        const chatId = getChatId(ctx);
        if (!chatId) return;

        if (userStates.has(chatId)) {
            resetState(chatId);
            await ctx.reply(
                "<b>Заполнение заявки отменено</b>\n<i>(если захотите продолжить, отправьте /start)</i>.",
                {
                    reply_markup: {remove_keyboard: true},
                    parse_mode: "HTML",
                },
            );
        } else {
            await ctx.reply(
                "<b>Сейчас нет активной заявки</b> <i>(для начала заполнения используйте /start)</i>.",
                {
                    reply_markup: {remove_keyboard: true},
                    parse_mode: "HTML",
                },
            );
        }
    });

    bot.callbackQuery("cancel_form", async (ctx) => {
        const chatId = getChatId(ctx);
        if (!chatId) {
            await ctx.answerCallbackQuery();
            return;
        }

        const hadState = userStates.has(chatId);
        resetState(chatId);

        await ctx.editMessageText(
            "<b>Заполнение заявки отменено</b> <i>(если захотите продолжить, отправьте /start)</i>.",
            {parse_mode: "HTML"},
        );

        await ctx.answerCallbackQuery({
            text: hadState ? "Заявка отменена" : "Активной заявки не было",
            show_alert: false,
        });
    });

    bot.on("message:text", async (ctx) => {
        const chatId = getChatId(ctx);
        if (!chatId) return;

        const state = userStates.get(chatId);
        const rawText = ctx.message.text ?? "";
        const text = rawText.trim();
        const lower = text.toLowerCase();

        if (!state || state.step === "idle") {
            if (lower === "привет") {
                await ctx.reply(
                    "<b>Привет</b> <i>(для записи на интенсив отправьте /start)</i>.",
                    {parse_mode: "HTML"},
                );
                return;
            }

            await ctx.reply(
                "<b>Чтобы записаться на интенсив</b> <i>(отправьте команду /start)</i>.",
                {parse_mode: "HTML"},
            );
            return;
        }

        switch (state.step) {
            case "name": {
                state.data.name = text;
                state.step = "phone";

                await updateLeadCard(ctx, chatId, state);

                await ctx.reply(
                    "<b>Укажите номер телефона</b>\n<i>например, <code>+7 900 000-00-00</code></i>.",
                    {
                        reply_markup: {remove_keyboard: true},
                        parse_mode: "HTML",
                    },
                );
                break;
            }
            case "phone": {
                if (!isValidPhone(text)) {
                    await ctx.reply(
                        "<b>Похоже, номер телефона некорректен</b> <i>(повторите, пожалуйста, ещё раз)</i>.",
                        {parse_mode: "HTML"},
                    );
                    break;
                }

                state.data.phone = text;
                state.step = "email";

                await updateLeadCard(ctx, chatId, state);

                await ctx.reply(
                    "<b>Укажите электронную почту</b>\n<i>в формате <code>name@example.com</code></i>.",
                    {parse_mode: "HTML"},
                );
                break;
            }
            case "email": {
                if (!isValidEmail(text)) {
                    await ctx.reply(
                        "<b>Похоже, email некорректен</b> <i>(введите корректный адрес почты)</i>.",
                        {parse_mode: "HTML"},
                    );
                    break;
                }

                state.data.email = text;
                state.step = "questions";

                await updateLeadCard(ctx, chatId, state);

                await ctx.reply(
                    "<b>Добавьте вопросы или пожелания</b>\n<i>или нажмите «нет», если их нет</i>.",
                    {
                        reply_markup: noQuestionsKeyboard,
                        parse_mode: "HTML",
                    },
                );
                break;
            }
            case "questions": {
                if (lower !== "нет") {
                    state.data.questions = text;
                }

                state.step = "idle";

                await updateLeadCard(ctx, chatId, state);
                await finalizeLead(ctx, chatId, state);
                break;
            }
        }
    });
}
