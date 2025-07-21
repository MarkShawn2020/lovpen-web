const { drizzle } = require('drizzle-orm/pglite');
const { sql } = require('drizzle-orm');
const { PGlite } = require('@electric-sql/pglite');

async function migrateWaitlist() {
  const client = new PGlite('./local.db');
  const db = drizzle(client);

  console.log('Applying waitlist table migration...');

  try {
    // Drop existing table if exists
    await db.execute(sql`DROP TABLE IF EXISTS "waitlist"`);

    // Create new waitlist table with proper structure
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "waitlist" (
        "id" serial PRIMARY KEY NOT NULL,
        "email" varchar(255) NOT NULL,
        "name" varchar(100) NOT NULL,
        "company" varchar(100),
        "use_case" varchar(500),
        "source" varchar(50) NOT NULL,
        "status" varchar(20) DEFAULT 'pending' NOT NULL,
        "priority" integer DEFAULT 0,
        "notes" text,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL,
        "reviewed_at" timestamp,
        "reviewed_by" integer
      )
    `);

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await client.close();
  }
}

migrateWaitlist().catch(console.error);
