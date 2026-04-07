const DATABASE_URL_MISSING_MESSAGE =
  "Server setup is incomplete. Add DATABASE_URL to .env.local and run npm run db:setup.";
const DATABASE_CONNECTION_REFUSED_MESSAGE =
  "Cannot connect to PostgreSQL on localhost:5432. Start PostgreSQL and run npm run db:setup.";
const DATABASE_AUTH_FAILED_MESSAGE =
  "PostgreSQL rejected the username or password in DATABASE_URL.";
const DATABASE_NOT_FOUND_MESSAGE =
  "The PostgreSQL database in DATABASE_URL does not exist yet. Create it and rerun npm run db:setup.";

export function getDatabaseUrl() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(DATABASE_URL_MISSING_MESSAGE);
  }

  return connectionString;
}

export function getConfigurationErrorMessage(error: unknown) {
  if (
    error instanceof Error &&
    error.message === DATABASE_URL_MISSING_MESSAGE
  ) {
    return DATABASE_URL_MISSING_MESSAGE;
  }

  const code =
    error && typeof error === "object" && "code" in error
      ? String(error.code)
      : null;

  if (code === "ECONNREFUSED") {
    return DATABASE_CONNECTION_REFUSED_MESSAGE;
  }

  if (code === "28P01") {
    return DATABASE_AUTH_FAILED_MESSAGE;
  }

  if (code === "3D000") {
    return DATABASE_NOT_FOUND_MESSAGE;
  }

  return null;
}
