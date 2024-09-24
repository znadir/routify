import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./utils/schema.ts",
	out: "./drizzle",
	dialect: "sqlite",
	driver: "expo",
});
