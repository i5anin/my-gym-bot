// 📦 Импорт dotenv для загрузки переменных окружения
import * as dotenv from 'dotenv';
import { colorize, tColor } from '@/shared/utils/colorize'; // адаптируй путь при необходимости

// 📂 Импорт функции existsSync для проверки наличия файлов
import { existsSync } from 'fs';

// 🛠️ Тип конфигурации для NestJS ConfigModule
import { ConfigModuleOptions } from '@nestjs/config';

// ─────────────────────────────────────────────────────────────
// 🟢 Шаг 1 — загружаем основной .env (он должен содержать только NODE_ENV)
dotenv.config({ path: '.env' });

// 🧭 Получаем значение NODE_ENV (development / docker / production)
const NODE_ENV = process.env.NODE_ENV;

// ❗ Если NODE_ENV не задан — останавливаем выполнение
if (!NODE_ENV) {
  console.error('❌ NODE_ENV не задан в .env');
  process.exit(1); // 💥 Завершаем процесс с ошибкой
}

// ─────────────────────────────────────────────────────────────
// 🧾 Выбираем соответствующий файл окружения на основе NODE_ENV
let envFile = '';

switch (NODE_ENV) {
  case 'development':
    envFile = '.env.dev'; // 🛠️ Настройки для локальной разработки
    break;
  case 'docker':
    envFile = '.env.docker'; // 🐳 Настройки для запуска в Docker
    break;
  case 'production':
    envFile = '.env.prod'; // 🚀 Настройки для продакшена
    break;
  default:
    console.error(`❌ NODE_ENV "${NODE_ENV}" не поддерживается.`);
    process.exit(1); // 💥 Завершаем выполнение при некорректном NODE_ENV
}

// ─────────────────────────────────────────────────────────────
// 📁 Проверяем наличие нужного файла .env.[env]
if (!existsSync(envFile)) {
  console.error(`❌ Файл ${envFile} не найден.`);
  process.exit(1); // 💥 Прерываем запуск, если конфиг не найден
}

// 🟢 Шаг 2 — загружаем переменные из соответствующего env-файла
dotenv.config({ path: envFile });

// ✅ Выводим в консоль, какой конфигурационный файл был загружен
console.log(`${colorize('[ENV]', tColor.g)} Загружено окружение: .env.dev`);

// ─────────────────────────────────────────────────────────────
// 📤 Экспорт конфигурации для использования в ConfigModule
export const configModuleOptions: ConfigModuleOptions = {
  isGlobal: true, // 🌍 Конфигурация доступна глобально во всём приложении
  envFilePath: envFile, // 📎 Путь к конкретному .env-файлу
};
