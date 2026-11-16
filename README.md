# 📌 Телеграм-бот для сбора данных сотрудников  

**ЦКП:** Запись тренировок через личного Telegram-бота с последующим обращением к тренировочным данным.

[![wakatime](https://wakatime.com/badge/github/i5anin/telegram-bot__pf-forum.svg)](https://wakatime.com/badge/github/i5anin/telegram-bot__pf-forum)  

Система сбора, анализа и отправки различных метрик и статистики по работникам предприятия через Telegram.

---

## 📂 Структура проекта
```
📦 src
├── 🟪 app
│   ├── 📂 bot
│   │   ├── 📜 bot.launcher.ts
│   │   ├── 📜 bot.module.ts
│   │   └── 📜 bot.service.ts
│   │
│   ├── 📂 config
│   │   ├── 📜 bot.config.ts
│   │   └── 📜 env.loader.ts
│   │
│   └── 📜 app.module.ts
│
├── 🟫 entities
│   └── 📂 commands
│       └── 📂 dtos
│           └── 📜 command.dto.ts
│
├── 🟧 features
│   ├── 📂 commands
│   │   ├── 📜 lead-form.commands.ts
│   │   ├── 📜 handleHelpCommand.ts
│   │   └── 📜 handlers-map.ts
│   │
│   └── 📂 notifications
│       └── 📂 metrics
│           ├── 📜 index.ts
│           └── 📜 metricsNotificationDirector.ts
│
├── 🟥 shared
│   ├── 🟡 api — ⭐ Модули взаимодействия с сервером
│   │   ├── 📜 axios.instance.ts
│   │   └── 📜 commands.api.ts
│   │
│   ├── 📂 base
│   │   ├── 📜 handleDocsCommand.ts
│   │   └── 📜 handleHelpCommand.ts
│   │
│   ├── 📂 config
│   │   └── 📜 env.ts
│   │
│   ├── 📂 lib
│   │   └── 📂 console
│   │       └── 📜 colorize.ts
│   │
│   └── 📂 types
│       └── 📜 telegraf.context.ts
│
├── 📜 main.ts
└── 📃 startup.ps1
```

---

## 📊 Статистика проекта

- 📄 **Всего файлов**: 21
- 📜 **Всего строк кода**: 494


### 📁 Количество файлов и строк (`src`):
  - .ts: 20 файлов, 479 строк
  - .ps1: 1 файлов, 15 строк

### 📊 Топ-5 длинных файлов (`src`):
- 🔍 lead-form.commands.ts — 104 строк
- 🔍 env.ts — 62 строк
- 🔍 env.loader.ts — 49 строк
- 🔍 colorize.ts — 42 строк
- 🔍 handlers-map.ts — 36 строк


