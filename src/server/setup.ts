import { pool } from './db.ts';
import bcrypt from 'bcryptjs';

async function setupDatabase() {
  const connection = await pool.getConnection();
  
  try {
    // Start transaction
    await connection.beginTransaction();

    // Drop existing tables in reverse order to avoid foreign key constraints
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
    await connection.execute('DROP TABLE IF EXISTS system_logs');
    await connection.execute('DROP TABLE IF EXISTS articles');
    await connection.execute('DROP TABLE IF EXISTS categories');
    await connection.execute('DROP TABLE IF EXISTS settings');
    await connection.execute('DROP TABLE IF EXISTS admins');
    await connection.execute('SET FOREIGN_KEY_CHECKS = 1');

    console.log('✓ Cleaned up existing tables');

    // Create admins table with UUID as CHAR(36)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS admins (
        id CHAR(36) PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP NULL
      )
    `);

    console.log('✓ Admins table created successfully');

    // Create default admin user with explicit UUID
    const [adminUuidResult] = await connection.execute('SELECT UUID() as uuid');
    const adminId = (adminUuidResult as any[])[0].uuid;
    const hashedPassword = await bcrypt.hash('Cytooxien2025!', 10);
    
    await connection.execute(
      'INSERT INTO admins (id, username, password, email) VALUES (?, ?, ?, ?)',
      [adminId, 'cytooxien_admin', hashedPassword, 'admin@cytooxien.de']
    );

    console.log('✓ Default admin user created');
    console.log('  Username: cytooxien_admin');
    console.log('  Password: Cytooxien2025!');
    console.log('  Email: admin@cytooxien.de');

    // Create settings table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS settings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        maintenance_mode BOOLEAN DEFAULT FALSE,
        maintenance_message TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        updated_by CHAR(36),
        FOREIGN KEY (updated_by) REFERENCES admins(id) ON DELETE SET NULL
      )
    `);

    console.log('✓ Settings table created successfully');

    // Initialize settings
    await connection.execute(
      'INSERT INTO settings (maintenance_mode, maintenance_message, updated_by) VALUES (?, ?, ?)',
      [false, 'Site is under maintenance. Please check back later.', adminId]
    );

    console.log('✓ Settings initialized successfully');

    // Create categories table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id CHAR(36) PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log('✓ Categories table created successfully');

    // Create articles table with proper foreign key references
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS articles (
        id CHAR(36) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        category VARCHAR(100) NOT NULL,
        author_id CHAR(36) NOT NULL,
        status ENUM('draft', 'published') DEFAULT 'draft',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES admins(id) ON DELETE CASCADE,
        FOREIGN KEY (category) REFERENCES categories(name) ON DELETE CASCADE
      )
    `);

    console.log('✓ Articles table created successfully');

    // Create system_logs table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS system_logs (
        id CHAR(36) PRIMARY KEY,
        type ENUM('info', 'warning', 'error') DEFAULT 'info',
        message TEXT NOT NULL,
        details TEXT,
        user_id CHAR(36),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES admins(id) ON DELETE SET NULL
      )
    `);

    console.log('✓ System logs table created successfully');

    // Create updates table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS updates (
        id CHAR(36) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        author_id CHAR(36) NOT NULL,
        status ENUM('draft', 'published') DEFAULT 'draft',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES admins(id) ON DELETE CASCADE
      )
    `);

    console.log('✓ Updates table created successfully');

    // Insert default categories with UUIDs
    const defaultCategories = [
      ['getting-started', 'Basic guides for new players'],
      ['farming', 'Advanced farming techniques'],
      ['economy', 'Trading and market information'],
      ['automation', 'Automation and redstone guides'],
      ['rules', 'Server rules and guidelines']
    ];

    for (const [name, description] of defaultCategories) {
      const [categoryUuidResult] = await connection.execute('SELECT UUID() as uuid');
      const categoryId = (categoryUuidResult as any[])[0].uuid;
      
      await connection.execute(
        'INSERT INTO categories (id, name, description) VALUES (?, ?, ?)',
        [categoryId, name, description]
      );
    }

    console.log('✓ Default categories created successfully');

    // Insert test articles
    const testArticles = [
      {
        title: 'Welcome to Cactus Tycoon',
        content: '# Welcome to Cactus Tycoon\n\nThis is your guide to getting started with cactus farming...',
        category: 'getting-started',
        status: 'published'
      },
      {
        title: 'Basic Farming Guide',
        content: '# Basic Farming Guide\n\nLearn the fundamentals of cactus farming...',
        category: 'farming',
        status: 'published'
      }
    ];

    for (const article of testArticles) {
      const [articleUuidResult] = await connection.execute('SELECT UUID() as uuid');
      const articleId = (articleUuidResult as any[])[0].uuid;
      
      await connection.execute(
        'INSERT INTO articles (id, title, content, category, author_id, status) VALUES (?, ?, ?, ?, ?, ?)',
        [articleId, article.title, article.content, article.category, adminId, article.status]
      );
    }

    console.log('✓ Test articles created successfully');

    // Commit all changes
    await connection.commit();

    console.log('\nDatabase setup completed successfully! 🎉');
    console.log('\nYou can now start the server and login with:');
    console.log('Username: cytooxien_admin');
    console.log('Password: Cytooxien2025!');
    console.log('Email: admin@cytooxien.de');

  } catch (error) {
    // Rollback on error
    await connection.rollback();
    console.error('Error setting up database:', error);
    throw error;
  } finally {
    connection.release();
    await pool.end();
  }
}

setupDatabase();