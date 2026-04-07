import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "pg";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, "..");
const schemaPath = path.join(__dirname, "..", "db", "schema.sql");
const schemaSql = await readFile(schemaPath, "utf8");

function parseEnvFile(contents) {
  for (const rawLine of contents.split(/\r?\n/u)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();

    if (!key || process.env[key]) {
      continue;
    }

    process.env[key] = value.replace(/^['"]|['"]$/g, "");
  }
}

async function loadEnvFiles() {
  const envPaths = [
    path.join(projectRoot, ".env.local"),
    path.join(projectRoot, ".env"),
  ];

  for (const envPath of envPaths) {
    try {
      const contents = await readFile(envPath, "utf8");
      parseEnvFile(contents);
    } catch (error) {
      const code = error && typeof error === "object" ? error.code : undefined;

      if (code !== "ENOENT") {
        throw error;
      }
    }
  }
}

await loadEnvFiles();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const client = new Client({
  connectionString,
});

try {
  await client.connect();
  await client.query(schemaSql);
  console.log("Database schema applied successfully.");
} catch (error) {
  console.error("Failed to apply database schema.");
  console.error(error);
  process.exitCode = 1;
} finally {
  await client.end();
}
