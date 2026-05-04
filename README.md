# CS732 Project - Team 8-Bit

![Team 8-Bit logo](./8-Bit.png)

## Overview

This repository contains Team 8-Bit's CS732 group project, **Last Answer**: a browser-based fantasy quiz RPG built with Next.js, React, TypeScript, Tailwind CSS, Zustand, PostgreSQL, and Vitest.

Players can register or log in, start a story-mode adventure, explore game locations, save and load progress, and fight turn-based quiz battles where correct answers drive combat outcomes. The project also includes an arcade entry point for quick play.

## Features

- Account registration, login, logout, and session handling
- PostgreSQL-backed persistent player saves with save/load slots
- Story mode with tavern, forest, monolith, quest, and ending scenes
- Turn-based quiz battle system with health, items, support effects, timers, combo tracking, and battle feedback
- Local fallback quiz questions for repeatable gameplay
- Responsive game UI, music controllers, settings panel, and animated scene transitions
- Unit tests for core battle logic, player state, authentication helpers, save slots, and stores

## Project Structure

```text
.
|-- README.md
|-- 8-Bit.png
|-- package.json
|-- postgresql-setup.md
`-- last-answer/
    |-- db/schema.sql
    |-- scripts/setup-db.mjs
    |-- src/
    |-- package.json
    |-- .env
    `-- .env.local
```

The runnable application is under `last-answer/`. The root `package.json` includes convenience scripts for common commands, but setup and database initialization should be run from `last-answer`.

## Environment Files

The `.env` and `.env.local` files are submitted separately through **"Project - Private info / API key / etc submission"**.

After cloning or opening the project, place those submitted files here:

```text
last-answer/.env
last-answer/.env.local
```

Do not place them at the repository root. The app and database setup script read environment variables from the `last-answer` folder. At minimum, the project expects `DATABASE_URL` to point to a PostgreSQL database.

## Requirements

- Node.js and npm
- PostgreSQL running locally or an accessible PostgreSQL database
- The submitted `.env` and `.env.local` files placed under `last-answer/`

## Setup

From the repository root:

```bash
cd last-answer
npm install
```

## Run The Project

From `last-answer/`:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

You can also run the development server from the repository root after dependencies are installed:

```bash
npm run dev
```

You can also played the deployed game in vercel

```text
https://group-project-8-bit.vercel.app/
```

## Test And Check

From `last-answer/`:

```bash
npm run test
npm run lint
npm run build
```

The main automated test suite uses Vitest. Tests are colocated with the implementation files under `last-answer/src`.

## Team Members

- Mingjie Jiang _(mjia237@aucklanduni.ac.nz)_
- Francis Lee _(tli174@aucklanduni.ac.nz)_
- Leo Mo-yung _(xmu745@aucklanduni.ac.nz)_
- Yushun Shi _(yshi675@aucklanduni.ac.nz)_
- Xuan Zeng _(xzen317@aucklanduni.ac.nz)_
- Zhongwei Zhang _(zahz885@aucklanduni.ac.nz)_
