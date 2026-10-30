# Путеводитель: training-bot

Автономная инструкция: достаточно этой папки, исходников и перечисленных защищённых копий. История чатов и центральный каталог не требуются.

[Восстановление](RECOVERY.md) · [Карта файлов и зависимостей](PROJECT_MAP.json)

## Назначение

По [README.md](README.md): Система сбора, анализа и отправки различных метрик и статистики по работникам предприятия через Telegram.

Обнаруженные языки: JavaScript, PowerShell, TypeScript.

## Порядок чтения

1. Локальные AGENTS.md / CLAUDE.md и документы ниже.
2. Манифесты: версии среды, зависимости, команды.
3. Кандидаты точек входа; фактический запуск проверить по манифесту.
4. PROJECT_MAP.json: imports_local от источника к импортируемому файлу; входящие рёбра — потребители модуля.
5. RECOVERY.md: независимые данные, восстановление среды, запуск и критерии приёмки.

- [architecture.mmd](architecture.mmd)
- [README.md](README.md)
- [src/architecture.mmd](src/architecture.mmd)

## Манифесты

- [package.json](package.json)

## Кандидаты точек входа

- [src/main.ts](src/main.ts)

## Основные файлы по локальным импортам

| Файл | Входящих импортов |
|---|---:|
| [src/features/trainings/domain/training.name.ts](src/features/trainings/domain/training.name.ts) | 4 |
| [src/features/trainings/domain/training.entity.ts](src/features/trainings/domain/training.entity.ts) | 2 |
| [src/shared/config/env.ts](src/shared/config/env.ts) | 1 |
| [src/app/app.module.ts](src/app/app.module.ts) | 1 |
| [src/app/bot/bot.service.ts](src/app/bot/bot.service.ts) | 1 |
| [src/repositories/workout-session.repository.ts](src/repositories/workout-session.repository.ts) | 1 |
| [src/repositories/workout.repository.ts](src/repositories/workout.repository.ts) | 1 |
| [src/shared/api/axios.instance.ts](src/shared/api/axios.instance.ts) | 1 |
| [src/features/trainings/domain/training.count.ts](src/features/trainings/domain/training.count.ts) | 1 |
| [src/features/trainings/application/training-use-cases.service.ts](src/features/trainings/application/training-use-cases.service.ts) | 1 |
| [src/features/trainings/infrastructure/training.repository.ts](src/features/trainings/infrastructure/training.repository.ts) | 1 |
| [src/features/trainings/infrastructure/json-file.storage.ts](src/features/trainings/infrastructure/json-file.storage.ts) | 1 |

## Проверки


## Чтение карты без специальных плагинов

PROJECT_MAP.json — UTF-8 JSON: nodes и edges. Пути файлов относительные. contains обозначает наличие файла; imports_local — статически распознанный импорт; declares_dependency — объявление пакета в манифесте. evidence содержит источник и, где доступно, строку. Карта не исполняет код.

Статус исходного анализа: static-scan-complete; ограничений чтения: 0. Исходный снимок: 2026-10-30T14:47:11.360Z.

После изменения кода перечитайте затронутые файлы: карта является снимком. Отсутствие ребра не доказывает отсутствие зависимости.
