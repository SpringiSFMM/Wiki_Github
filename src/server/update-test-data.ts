import { pool } from './db';

async function updateTestData() {
  const connection = await pool.getConnection();
  
  try {
    // Start transaction
    await connection.beginTransaction();

    // Get admin ID
    const [adminResult] = await connection.execute('SELECT id FROM admins LIMIT 1');
    const adminId = (adminResult as any[])[0].id;

    // Update mit HTML-Formatierung hinzufügen
    const [updateUuidResult] = await connection.execute('SELECT UUID() as uuid');
    const updateId = (updateUuidResult as any[])[0].uuid;
    
    const htmlContent = 'Wir haben neue Funktionen hinzugefügt, darunter <strong>formatierte Texte</strong> und <em>hervorgehobene Inhalte</em>. Die Formatierung macht die Updates übersichtlicher und ansprechender.';
    
    await connection.execute(
      'INSERT INTO updates (id, title, content, author_id, status) VALUES (?, ?, ?, ?, ?)',
      [updateId, 'Neue Formatierungsoptionen', htmlContent, adminId, 'published']
    );

    console.log('✓ HTML-formatiertes Update erstellt');

    // Commit all changes
    await connection.commit();

    console.log('\nTest-Update mit HTML-Formatierung erfolgreich hinzugefügt! 🎉');

  } catch (error) {
    // Rollback on error
    await connection.rollback();
    console.error('Error updating test data:', error);
    throw error;
  } finally {
    connection.release();
    await pool.end();
  }
}

// Run the function
updateTestData().catch(console.error);
