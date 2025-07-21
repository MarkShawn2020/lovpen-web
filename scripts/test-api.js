const { db } = require('../src/lib/DB.ts');
const { waitlistSchema } = require('../src/models/Schema.ts');

async function testApi() {
  console.log('Testing database operations...');

  try {
    // Test direct insert
    console.log('Attempting direct insert...');
    const result = await db
      .insert(waitlistSchema)
      .values({
        email: 'test@example.com',
        name: 'Test User',
        source: 'test',
        status: 'pending',
      })
      .returning();

    console.log('Insert successful:', result[0]);

    // Test count query 
    const { count } = await import('drizzle-orm');
    const countResult = await db
      .select({ count: count() })
      .from(waitlistSchema);

    console.log('Count query result:', countResult[0]);
  } catch (error) {
    console.error('API test failed:', error);
  }
}

testApi().catch(console.error);
