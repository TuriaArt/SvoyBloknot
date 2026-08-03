# SvoyBloknot — архитектура

> См. также [PHILOSOPHY.md](PHILOSOPHY.md) (зачем) и [ROADMAP.md](ROADMAP.md) (что дальше).

## Происхождение

SvoyBloknot — форк [siyuan-note/siyuan](https://github.com/siyuan-note/siyuan) (AGPL-3.0-or-later), созданный через GitHub Fork (не пустой репозиторий с нуля — сохранена настоящая связь с апстримом). Локально репозиторий лежит в `E:\SiYuan-Tu` (папка исторически называется по рабочему названию форка, GitHub-репозиторий — `TuriaArt/SvoyBloknot`).

Структура (унаследована от SiYuan как есть, не меняется этим форком):

- `kernel/` — ядро на Go: хранение блоков, полнотекстовый поиск, HTTP API, Хранилище секретов, синхронизация, агентские/AI-функции.
- `app/` — фронтенд (TypeScript/webpack) + обёртка Electron для десктопа.

## Двойная роль

Один и тот же собранный экземпляр SvoyBloknot используется одновременно:

1. как обычный личный блокнот (открывается напрямую, со своим интерфейсом);
2. как бэкенд памяти [SvoyAgent](https://github.com/TuriaArt/Meridian-Tu) — история диалогов и память ИИ-агента хранятся как заметки через тот же кернел-API.

Это не два инстанса — один и тот же workspace, два способа с ним взаимодействовать.

## Что изменено относительно апстрима и почему

Все патчи — минимальные, точечные, не трогают API ядра (`kernel/api/`) и API плагинов (`app/src/plugin/`), поэтому существующие плагины и темы SiYuan остаются совместимыми без изменений.

| Файл | Что изменено | Зачем |
|---|---|---|
| `kernel/conf/account.go` | `DisplayVIP: true` → `false` | Иконка "не подписан" в панели не показывается по умолчанию |
| `kernel/model/conf.go` | `IsPaidUser()` → всегда `true` | Разблокирует сторонние провайдеры синхронизации на уровне ядра |
| `app/src/util/needSubscribe.ts` | `needSubscribe()` → всегда `false`, `isPaidUser()` → всегда `true` | То же самое на уровне фронтенда — без этого UI всё равно показывал бы блокировку, даже если ядро уже разрешает |
| `app/src/config/tabs/syncUi.ts` | убран ярлык "Pro-функция" из описания S3/WebDAV/локального провайдера | Ярлык вводил в заблуждение — функция уже не платная |
| `kernel/model/updater.go` | `CheckUpdate()` — no-op | Не даёт апстриму предложить "обновиться" на официальную сборку поверх патчей форка |
| `kernel/model/cloud_service.go` | `refreshCheckDownloadInstallPkg()` — no-op | Тот же смысл — отключает фоновую автозагрузку официальных пакетов |
| `app/package.json`, `app/electron-builder.yml`, `app/electron/main.js` | `productName`/`appId`/имя ярлыка/заголовки окон → SvoyBloknot | Бренд; внутренние идентификаторы (имя бинарника ядра, код) не переименовывались |

Почему именно эти файлы и не больше — см. рассуждение в [PHILOSOPHY.md](PHILOSOPHY.md): убираем ровно один искусственный барьер (подписку), не переписываем остальное.

## Обновление форка

Автообновление отключено намеренно (см. таблицу выше). Процесс обновления — ручной:

1. `git fetch upstream && git merge upstream/master` (или rebase) — подтянуть новую версию SiYuan.
2. Проверить, что патчи из таблицы выше всё ещё применяются (конфликты возможны, если апстрим поменял те же файлы).
3. Пересобрать (см. ниже).

## Сборка

```bash
# Ядро (Go) — имя бинарника фиксировано, его ждёт app/electron/main.js
cd kernel && CGO_ENABLED=1 go build -tags "fts5 sqlcipher" -ldflags "-s -w" -o ../app/kernel/SiYuan-Kernel.exe .

# Фронтенд + упаковка в установщик (Electron + electron-builder, NSIS для Windows)
cd app
pnpm install
pnpm run build   # webpack: app/mobile/desktop/export
pnpm run dist    # electron-builder → app/build/svoybloknot-<версия>-win.exe
```

Иконка приложения — `app/src/assets/icon.ico` (плюс полный набор в `app/src-tauri`-подобной структуре нет, это Electron, не Tauri — иконки только в `app/src/assets/`). На момент написания используется стоковая иконка SiYuan — своя ещё не подставлена (см. [ROADMAP.md](ROADMAP.md)).
