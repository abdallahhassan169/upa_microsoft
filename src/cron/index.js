import cron from "node-cron";
import { externalDb, sourceDb } from "../dbConfig.js";
import { productsCron } from "../products/index.js";

// Run daily at 2:00 AM
export const runCron = () => cron.schedule("2 21 * * *", productsCron);
