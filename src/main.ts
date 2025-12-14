// ⚙️ Загрузка переменных окружения ДО запуска NestJS
import './shared/config/env'; // 👈 ОБЯЗАТЕЛЬНО ДО AppModule

// 🏗️ Импорт фабрики Nest-приложения
import { NestFactory } from '@nestjs/core';

// 📦 Главный модуль приложения (бот)
import { AppModule } from './app/app.module';
import { colorize, tColor } from '@/shared/utils/colorize';
import {loadEnv} from "@/app/config/env.loader";

loadEnv(); // ✅ вызывает и загружает .env-файл


// 🚀 Асинхронная точка входа
async function bootstrap() {
  // 🏁 Инициализация NestJS-приложения с AppModule
  const app = await NestFactory.create(AppModule);

  // 🖨️ Лог: информация о запуске бота
  console.log(
    `${colorize('[ENV]', tColor.c)} NODE_ENV: ${colorize(process.env.NODE_ENV ?? 'undefined', tColor.y)}`,
  );
  console.log(
    `${colorize('[AUTH]', tColor.m)} TOKEN: ${process.env.BOT_TOKEN?.slice(0, 8)}...`,
  );

  // 🌐 Запуск HTTP-сервера на указанном порту (по умолчанию 3000)
  await app.listen(Number(process.env.PORT) || 3000);
}

// ▶️ Старт приложения
bootstrap().catch((err) => {
  console.error('❌ Ошибка запуска приложения:', err);
  process.exit(1); // Завершаем процесс с ошибкой
});
