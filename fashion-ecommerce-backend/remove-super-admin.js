const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'fashion_ecommerce',
  user: 'postgres',
  password: 'postgres'
});

async function removeSuperAdmin() {
  try {
    console.log('Connecting to database...');
    
    // Delete all admin profiles
    const result = await pool.query('DELETE FROM admin_profiles');
    
    console.log(`Deleted ${result.rowCount} admin profile(s)`);
    
    // Reset the sequence if it exists
    try {
      await pool.query('ALTER SEQUENCE admin_profiles_id_seq RESTART WITH 1');
      console.log('Reset admin_profiles sequence');
    } catch (err) {
      console.log('Sequence reset not needed or failed:', err.message);
    }
    
    console.log('Super admin removed successfully!');
    console.log('You can now create a new super admin using the setup endpoint.');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

removeSuperAdmin();
