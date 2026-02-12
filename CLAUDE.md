# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev              # Run with hot reload
bun start            # Run in production
bun x tsc --noEmit   # Type-check (strict mode, no test framework)
bunx prisma generate # Regenerate Prisma client (auto-runs on bun install)
bunx prisma migrate dev --name <name>  # Create new migration
```

**System dependencies for local dev (macOS):**
```bash
brew install ffmpeg imagemagick libreoffice pandoc calibre inkscape graphicsmagick vips libheif libjxl potrace assimp dasel
pip install markitdown
```

## Architecture

Telegram bot for file format conversion. Built with **Grammy** (bot framework), **Prisma** (PostgreSQL ORM), and **Bun** runtime.

### Conversion Flow

1. User sends file → `src/handlers/document.ts` extracts file info from any media type (document, photo, audio, video, voice, sticker)
2. `getSmartTargets()` in `src/converters/main.ts` returns available target formats, with curated popular formats first per category
3. File metadata stored in-memory via `src/services/pendingConversions.ts` (10-min TTL, base-36 IDs to fit Telegram's 64-byte callback data limit)
4. User picks format → `src/handlers/convert.ts` enqueues job in `src/services/queue.ts` (concurrency-limited, default 5)
5. Bot downloads file → runs converter CLI tool → uploads result as reply to original message → deletes progress message

### Converter System (`src/converters/`)

22 modules wrapping CLI tools (ffmpeg, imagemagick, libreoffice, pandoc, calibre, inkscape, etc.). Each exports:
- `properties`: `{ from/to }` format mappings grouped by category
- `convert()`: async function that shells out via `child_process.execFile`

`src/converters/main.ts` is the orchestrator — registers all converters, resolves format pairs (earlier converter wins for duplicates), and implements smart format sorting with `popularFormats` per category.

### Key Patterns

- **Callback data prefixes**: `lang:` (language selection), `p:` (pagination), `c:` (conversion)
- **Translations** (`src/utils/translations.ts`): Type-safe i18n for 4 languages (en, ru, uz, uz_cyrillic). Static entries are objects, dynamic ones are functions returning objects. Access via `ctx.translations.*`
- **Auth middleware** (`src/middlewares/auth.ts`): Loads/creates user from DB, sets `ctx.user` and `ctx.translations`. Enforces `/start` for unregistered users
- **Rate limiting** (`src/services/rateLimit.ts`): Monthly per-user quota checked against DB count
- **All messages use HTML parse mode** for Telegram formatting

### Environment Variables

Required: `BOT_TOKEN`, `BOT_USERNAME`, `DATABASE_URL`, `OWNER_IDS` (comma-separated)
Optional: `MAX_CONCURRENT_CONVERSIONS` (default 5), `MONTHLY_CONVERSION_LIMIT` (default 100), `TEMP_DIR` (default /tmp/convertx)

### Prisma

- Schema: `prisma/schema.prisma` — `User` and `Conversion` models
- Generated client output: `src/generated/prisma`
- Uses `@prisma/adapter-pg` (PostgreSQL adapter)
