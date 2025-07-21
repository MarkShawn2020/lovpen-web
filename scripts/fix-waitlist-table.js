const { drizzle } = require('drizzle-orm/pglite');
const { sql } = require('drizzle-orm');
const { PGlite } = require('@electric-sql/pglite');

async function fixWaitlistTable() {
  const client = new PGlite('./local.db');
  const db = drizzle(client);

  console.log('Fixing waitlist table...');

  try {
    // Drop the existing table and recreate it properly
    await db.execute(sql`DROP TABLE IF EXISTS "waitlist"`);

    // Create table with explicit column defaults
    await db.execute(sql`
      CREATE TABLE "waitlist" (
        "id" serial PRIMARY KEY,
        "email" varchar(255) NOT NULL,
        "name" varchar(100) NOT NULL,
        "company" varchar(100),
        "use_case" varchar(500),
        "source" varchar(50) NOT NULL,
        "status" varchar(20) NOT NULL DEFAULT 'pending',
        "priority" integer DEFAULT 0,
        "notes" text,
        "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "reviewed_at" timestamp,
        "reviewed_by" integer
      )
    `);

    console.log('Table recreated successfully!');

    // Test insert
    await db.execute(sql`
      INSERT INTO "waitlist" (email, name, source) 
      VALUES ('test@example.com', 'Test User', 'test')
    `);

    console.log('Test insert successful!');

    // Check the record
    const result = await db.execute(sql`SELECT * FROM "waitlist"`);
    console.log('Inserted record:', result.rows[0]);
  } catch (error) {
    console.error('Fix failed:', error);
  } finally {
    await client.close();
  }
}

fixWaitlistTable().catch(console.error);
