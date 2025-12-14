import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { Bot, Context } from "grammy";
import { config } from "dotenv";
import { registerCommands } from "@/commands/workout.commands";

config();

@Injectable()
export class BotService implements OnModuleInit, OnModuleDestroy {
    private readonly bot: Bot<Context>;
    private launchTimestamp?: Date;

    constructor() {
        const token = process.env.BOT_TOKEN;
        if (!token) throw new Error("BOT_TOKEN не найден в .env");
        this.bot = new Bot<Context>(token);
    }

    async onModuleInit(): Promise<void> {
        this.launchTimestamp = new Date();

        await registerCommands(this.bot);

        const ts = this.launchTimestamp.toISOString();

        this.bot.start({
            onStart: (botInfo) => {
                // eslint-disable-next-line no-console
                console.log(`Бот запущен (grammy). launchedAt=${ts}, username=@${botInfo.username}`);
            },
        });
    }

    async onModuleDestroy(): Promise<void> {
        await this.bot.stop();
    }
}
