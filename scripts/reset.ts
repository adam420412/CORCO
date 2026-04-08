import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "../db/schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});
const db = drizzle(pool, { schema });

const main = async () => {
  try {
    console.log("Resetting CORCO database...");

    await db.delete(schema.studentAssignments);
    await db.delete(schema.bookings);
    await db.delete(schema.messages);
    await db.delete(schema.teacherStudents);
    await db.delete(schema.challengeProgress);
    await db.delete(schema.challengeOptions);
    await db.delete(schema.challenges);
    await db.delete(schema.lessons);
    await db.delete(schema.units);
    await db.delete(schema.userProgress);
    await db.delete(schema.courses);
    await db.delete(schema.userSubscription);

    console.log("Reset finished successfully!");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to reset the database");
  }
};

main();
