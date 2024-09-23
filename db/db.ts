import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite/next";

const expo = openDatabaseSync("routify.db", { enableChangeListener: true });
const db = drizzle(expo);

export default db;
