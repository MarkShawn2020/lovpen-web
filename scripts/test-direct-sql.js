const { drizzle } = require('drizzle-orm/pglite');
const { sql } = require('drizzle-orm');
const { PGlite } = require('@electric-sql/pglite');

async function testDirectSQL() {
  const client = new PGlite('./local.db');
  const db = drizzle(client);

  console.log('Testing direct SQL insert...');

  try {
    // Clear existing data
    await db.execute(sql`DELETE FROM waitlist`);
    
    // Test simple insert
    const result = await db.execute(sql`
      INSERT INTO waitlist (email, name, source) 
      VALUES ('direct-test@example.com', 'Direct Test User', 'direct-test')
      RETURNING *
    `);

    console.log('Insert result:', result.rows[0]);
  } catch (error) {
    console.error('Direct SQL test failed:', error);
  } finally {
    await client.close();
  }
}

testDirectSQL().catch(console.error);
