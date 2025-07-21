const { drizzle } = require('drizzle-orm/pglite');
const { sql } = require('drizzle-orm');
const { PGlite } = require('@electric-sql/pglite');

async function debugDatabase() {
  const client = new PGlite('./local.db');
  const db = drizzle(client);

  console.log('Checking database status...');

  try {
    // Check if waitlist table exists
    const result = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'waitlist'
      );
    `);
    
    console.log('Waitlist table exists:', result.rows[0].exists);

    // If table exists, check its structure
    if (result.rows[0].exists) {
      const columns = await db.execute(sql`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = 'waitlist'
        ORDER BY ordinal_position;
      `);
      
      console.log('Table structure:');
      columns.rows.forEach((col) => {
        console.log(`  ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
      });

      // Try to count records
      const count = await db.execute(sql`SELECT COUNT(*) as count FROM waitlist`);
      console.log('Record count:', count.rows[0].count);
    }
  } catch (error) {
    console.error('Database check failed:', error);
  } finally {
    await client.close();
  }
}

debugDatabase().catch(console.error);
