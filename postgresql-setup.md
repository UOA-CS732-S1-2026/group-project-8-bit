# PostgreSQL Setup

This project uses PostgreSQL for authentication and persistent player saves.

## 1. Install PostgreSQL

### macOS

```bash
brew install postgresql@16
brew services start postgresql@16
```

If `createdb` or `psql` is not found after installation, add PostgreSQL to your shell path:

```bash
export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"
```

You can also use Postgres.app instead of Homebrew. Install and launch Postgres.app, then ensure `psql` and `createdb` are available in your shell.

### Windows

Install PostgreSQL using the official Windows installer. During installation:

1. Install PostgreSQL Server and command line tools.
2. Set a password for the default `postgres` role, or remember the custom role you create.
3. Keep the default port as `5432` unless you intentionally changed it.

After installation, make sure PostgreSQL's `bin` folder is available in PowerShell or Command Prompt. A common path is:

```text
C:\Program Files\PostgreSQL\16\bin
```

If `psql` or `createdb` is not found, either:

1. Add that folder to your system `PATH`, or
2. Run the commands with the full executable path.

## 2. Create the local database

Create the project database:

### macOS / Linux

```bash
createdb oracle_of_lost_knowledge
```

### Windows PowerShell

```powershell
createdb oracle_of_lost_knowledge
```

If that does not work because `createdb` is not on your `PATH`, run:

```powershell
& "C:\Program Files\PostgreSQL\16\bin\createdb.exe" oracle_of_lost_knowledge
```

If your local PostgreSQL role is not `postgres`, use your actual local role name in the connection string.

To inspect the available roles and databases:

### macOS / Linux

```bash
psql -d postgres -c '\du'
psql -d postgres -c '\l'
```

### Windows PowerShell

```powershell
psql -d postgres -c "\du"
psql -d postgres -c "\l"
```

## 3. Configure DATABASE_URL

Create a local env file from the committed example:

### macOS / Linux

```bash
cp .env.example .env.local
```

### Windows PowerShell

```powershell
Copy-Item .env.example .env.local
```

Then edit `.env.local`:

```env
DATABASE_URL=postgresql://your_pg_user@localhost:5432/oracle_of_lost_knowledge
```

Examples:

```env
DATABASE_URL=postgresql://LITC@localhost:5432/oracle_of_lost_knowledge
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/oracle_of_lost_knowledge
```

If your PostgreSQL server uses a different port, replace `5432` with the correct port.

## 4. Install project dependencies

### macOS / Linux

```bash
npm install
```

### Windows PowerShell

```powershell
npm install
```

## 5. Initialize the schema

### macOS / Linux

```bash
npm run db:setup
```

### Windows PowerShell

```powershell
npm run db:setup
```

Expected result:

```bash
Database schema applied successfully.
```

## 6. Start the app

### macOS / Linux

```bash
npm run dev
```

### Windows PowerShell

```powershell
npm run dev
```

Open:

```text
http://localhost:3000
```

## 7. Test the auth flow

1. Go to `/register`
2. Create an account
3. Confirm redirect to `/game/mainHub`
4. Log out
5. Log in again at `/login`

## 8. Optional verification

```bash
npm run lint
npm run build -- --webpack
```

If the schema was changed locally and your old database still exists, recreate the local database before re-testing auth.

## Troubleshooting

### `role "postgres" does not exist`

Your local PostgreSQL role is not `postgres`. Update `.env.local` to use your real local role.

### `ECONNREFUSED` on `localhost:5432`

PostgreSQL is not running yet. Start it with Homebrew or Postgres.app.

On Windows, confirm the PostgreSQL service is running in Services or start it from the PostgreSQL tools menu.

### Schema does not match an older local DB

If you previously initialized an older version of the schema, recreate the local database:

### macOS / Linux

```bash
dropdb oracle_of_lost_knowledge
createdb oracle_of_lost_knowledge
npm run db:setup
```

### Windows PowerShell

```powershell
dropdb oracle_of_lost_knowledge
createdb oracle_of_lost_knowledge
npm run db:setup
```
