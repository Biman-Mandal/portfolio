import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";

function readEnvFile(file) {
  if (!fs.existsSync(file)) return {};

  return Object.fromEntries(
    fs
      .readFileSync(file, "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const index = line.indexOf("=");
        return [line.slice(0, index), line.slice(index + 1).replace(/^["']|["']$/g, "")];
      })
  );
}

const root = process.cwd();
const env = {
  ...readEnvFile(path.join(root, ".env")),
  ...readEnvFile(path.join(root, ".env.local")),
  ...process.env
};

const schema = fs.readFileSync(path.join(root, "database", "schema.sql"), "utf8");
const connection = await mysql.createConnection({
  host: env.MYSQL_HOST || "localhost",
  port: Number(env.MYSQL_PORT || 3306),
  user: env.MYSQL_USER || "root",
  password: env.MYSQL_PASSWORD || "",
  multipleStatements: true
});

await connection.query(schema);
await connection.end();

console.log("Database schema and seed data installed.");
