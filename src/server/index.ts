import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { pool } from './db.ts';
import dotenv from 'dotenv';

// Lade Umgebungsvariablen
dotenv.config();

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

app.use(cors());
app.use(express.json());

// Helper function to safely log system events
async function logSystemEvent(message: string, type: 'info' | 'warning' | 'error', userId?: string) {
  try {
    // If userId is provided, check if it exists in the admins table
    if (userId) {
      const [adminRows] = await pool.execute(
        'SELECT id FROM admins WHERE id = ?',
        [userId]
      );

      // Only include user_id if the user exists
      if ((adminRows as any[]).length > 0) {
        await pool.execute(`
          INSERT INTO system_logs (id, type, message, user_id)
          VALUES (UUID(), ?, ?, ?)
        `, [type, message, userId]);
        return;
      }
    }
    
    // Log without user_id
    await pool.execute(`
      INSERT INTO system_logs (id, type, message)
      VALUES (UUID(), ?, ?)
    `, [type, message]);
  } catch (error) {
    console.error('Error logging system event:', error);
  }
}

// Authentication middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      console.error('JWT verification error:', err);
      return res.status(403).json({ message: 'Invalid token' });
    }
    
    if (!user || !user.id) {
      console.error('Invalid user object in token:', user);
      return res.status(403).json({ message: 'Invalid user in token' });
    }
    
    console.log('Authenticated user ID:', user.id);
    req.user = user;
    next();
  });
};

// Public endpoints

// Get settings
app.get('/api/settings', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT maintenance_mode, maintenance_message FROM settings LIMIT 1');
    res.json({
      maintenanceMode: (rows as any[])[0]?.maintenance_mode === 1,
      maintenanceMessage: (rows as any[])[0]?.maintenance_message || '',
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all published articles
app.get('/api/articles', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        id,
        title,
        category,
        LEFT(content, 200) as excerpt,
        DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') as lastModified,
        status
      FROM articles
      WHERE status = 'published'
      ORDER BY updated_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get articles by category
app.get('/api/articles/category/:category', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        id,
        title,
        category,
        LEFT(content, 200) as excerpt,
        DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') as lastModified
      FROM articles
      WHERE category = ? AND status = 'published'
      ORDER BY updated_at DESC
    `, [req.params.category]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching category articles:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get single article with related articles
app.get('/api/articles/:id', async (req, res) => {
  try {
    // Get main article
    const [articleRows] = await pool.execute(`
      SELECT 
        a.id,
        a.title,
        a.content,
        a.category,
        DATE_FORMAT(a.updated_at, '%Y-%m-%d %H:%i:%s') as lastModified,
        COALESCE(adm.username, 'Unknown') as author
      FROM articles a
      LEFT JOIN admins adm ON a.author_id = adm.id
      WHERE a.id = ? AND a.status = 'published'
    `, [req.params.id]);

    if ((articleRows as any[]).length === 0) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const article = (articleRows as any[])[0];

    // Get related articles
    const [relatedRows] = await pool.execute(`
      SELECT 
        id,
        title,
        category
      FROM articles
      WHERE category = ? 
        AND id != ? 
        AND status = 'published'
      ORDER BY updated_at DESC
      LIMIT 3
    `, [article.category, article.id]);

    res.json({
      ...article,
      relatedArticles: relatedRows,
    });
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get categories (public)
app.get('/api/categories', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT id, name, description FROM categories ORDER BY name');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all articles
app.get('/api/articles', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, title, category, created_at, updated_at, status FROM articles'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ message: 'Error fetching articles' });
  }
});

// Get latest updates (public endpoint)
app.get('/api/updates', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT u.id, u.title, u.content, u.created_at, u.updated_at, a.username as author
      FROM updates u
      JOIN admins a ON u.author_id = a.id
      WHERE u.status = 'published'
      ORDER BY u.created_at DESC
      LIMIT 5
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching updates:', error);
    res.status(500).json({ message: 'Error fetching updates' });
  }
});

// Get update by ID (public endpoint)
app.get('/api/updates/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT u.id, u.title, u.content, u.created_at, u.updated_at, a.username as author
      FROM updates u
      JOIN admins a ON u.author_id = a.id
      WHERE u.id = ? AND u.status = 'published'
    `, [req.params.id]);
    
    if ((rows as any[]).length === 0) {
      return res.status(404).json({ message: 'Update not found' });
    }

    res.json((rows as any[])[0]);
  } catch (error) {
    console.error('Error fetching update:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get article by ID
app.get('/api/articles/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        a.id,
        a.title,
        a.content,
        a.category,
        DATE_FORMAT(a.updated_at, '%Y-%m-%d %H:%i:%s') as lastModified,
        COALESCE(adm.username, 'Unknown') as author
      FROM articles a
      LEFT JOIN admins adm ON a.author_id = adm.id
      WHERE a.id = ?
    `, [req.params.id]);
    
    if ((rows as any[]).length === 0) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json((rows as any[])[0]);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin endpoints

// Login
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await pool.execute(
      'SELECT * FROM admins WHERE username = ?',
      [username]
    );

    const admin = (rows as any[])[0];

    if (!admin || !bcrypt.compareSync(password, admin.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    await pool.execute(
      'UPDATE admins SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
      [admin.id]
    );

    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Log successful login
    await logSystemEvent('Successful login', 'info', admin.id);

    res.json({
      token,
      user: {
        id: admin.id,
        username: admin.username,
        role: 'admin',
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Register
app.post('/api/auth/register', async (req, res) => {
  // Registrierung deaktiviert - nur Admin-Zugang erlaubt
  return res.status(403).json({ 
    message: 'Die Registrierung ist deaktiviert. Bitte kontaktiere den Administrator für einen Zugang.' 
  });
});

// Get admin settings
app.get('/api/admin/settings', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT maintenance_mode, maintenance_message FROM settings LIMIT 1');
    res.json({
      maintenanceMode: (rows as any[])[0]?.maintenance_mode === 1,
      maintenanceMessage: (rows as any[])[0]?.maintenance_message || '',
    });
  } catch (error) {
    console.error('Error fetching admin settings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update settings
app.put('/api/admin/settings', authenticateToken, async (req, res) => {
  const { maintenanceMode, maintenanceMessage } = req.body;
  const userId = (req.user as any).id;

  try {
    // First check if the user exists in the admins table
    const [adminRows] = await pool.execute(`
      SELECT id FROM admins WHERE id = ?
    `, [userId]);

    // If user doesn't exist in admins table, use NULL for updated_by
    const updatedBy = Array.isArray(adminRows) && adminRows.length > 0 ? userId : null;

    await pool.execute(`
      UPDATE settings 
      SET maintenance_mode = ?, maintenance_message = ?, updated_by = ?
      WHERE id = 1
    `, [maintenanceMode ? 1 : 0, maintenanceMessage, updatedBy]);

    // Log settings update
    await logSystemEvent('Settings updated', 'info', userId);

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get admin profile
app.get('/api/admin/profile', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT username, email FROM admins WHERE id = ?',
      [(req.user as any).id]
    );
    res.json((rows as any[])[0]);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update admin profile
app.put('/api/admin/profile', authenticateToken, async (req, res) => {
  const { username, email } = req.body;

  try {
    await pool.execute(
      'UPDATE admins SET username = ?, email = ? WHERE id = ?',
      [username, email, (req.user as any).id]
    );

    // Log profile update
    await logSystemEvent('Profile updated', 'info', (req.user as any).id);

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Change password
app.put('/api/admin/change-password', authenticateToken, async (req, res) => {
  const { current, new: newPassword } = req.body;

  try {
    const [rows] = await pool.execute(
      'SELECT password FROM admins WHERE id = ?',
      [(req.user as any).id]
    );

    const admin = (rows as any[])[0];

    if (!bcrypt.compareSync(current, admin.password)) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.execute(
      'UPDATE admins SET password = ? WHERE id = ?',
      [hashedPassword, (req.user as any).id]
    );

    // Log password change
    await logSystemEvent('Password changed', 'info', (req.user as any).id);

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get admin categories
app.get('/api/admin/categories', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM categories ORDER BY name');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create category
app.post('/api/admin/categories', authenticateToken, async (req, res) => {
  const { name, description } = req.body;

  try {
    const [result] = await pool.execute(
      'INSERT INTO categories (id, name, description) VALUES (UUID(), ?, ?)',
      [name, description]
    );

    // Log category creation
    await logSystemEvent(`Created category: ${name}`, 'info', (req.user as any).id);

    res.status(201).json({
      id: (result as any).insertId,
      name,
      description,
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update category
app.put('/api/admin/categories/:id', authenticateToken, async (req, res) => {
  const { name, description } = req.body;

  try {
    await pool.execute(
      'UPDATE categories SET name = ?, description = ? WHERE id = ?',
      [name, description, req.params.id]
    );

    // Log category update
    await logSystemEvent(`Updated category: ${name}`, 'info', (req.user as any).id);

    res.json({ message: 'Category updated successfully' });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete category
app.delete('/api/admin/categories/:id', authenticateToken, async (req, res) => {
  try {
    // Get category name for logging
    const [categoryRows] = await pool.execute(
      'SELECT name FROM categories WHERE id = ?',
      [req.params.id]
    );
    const categoryName = (categoryRows as any[])[0]?.name;

    await pool.execute('DELETE FROM categories WHERE id = ?', [req.params.id]);

    // Log category deletion
    await logSystemEvent(`Deleted category: ${categoryName}`, 'warning', (req.user as any).id);

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get admin article
app.get('/api/admin/articles/:id', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        a.*,
        adm.username as author
      FROM articles a
      JOIN admins adm ON a.author_id = adm.id
      WHERE a.id = ?
    `, [req.params.id]);
    
    if ((rows as any[]).length === 0) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json((rows as any[])[0]);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all articles
app.get('/api/admin/articles', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        a.id,
        a.title,
        a.category,
        a.status,
        DATE_FORMAT(a.updated_at, '%Y-%m-%d %H:%i:%s') as lastModified,
        IFNULL(adm.username, 'Unknown') as author
      FROM articles a
      LEFT JOIN admins adm ON a.author_id = adm.id
      ORDER BY a.updated_at DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error('Error fetching all articles:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create article
app.post('/api/admin/articles', authenticateToken, async (req, res) => {
  const { title, content, category, status } = req.body;
  const authorId = (req.user as any).id;

  try {
    // First check if the author exists in the admins table
    const [adminRows] = await pool.execute(
      'SELECT id FROM admins WHERE id = ?',
      [authorId]
    );

    if ((adminRows as any[]).length === 0) {
      return res.status(400).json({ 
        message: 'Author ID not found in admins table. Please login again.' 
      });
    }

    const [result] = await pool.execute(`
      INSERT INTO articles (id, title, content, category, author_id, status)
      VALUES (UUID(), ?, ?, ?, ?, ?)
    `, [title, content, category, authorId, status]);

    // Log article creation
    await logSystemEvent(`Created article: ${title}`, 'info', authorId);

    res.status(201).json({
      id: (result as any).insertId,
      message: 'Article created successfully',
    });
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update article
app.put('/api/admin/articles/:id', authenticateToken, async (req, res) => {
  const { title, content, category, status } = req.body;

  try {
    await pool.execute(`
      UPDATE articles
      SET title = ?, content = ?, category = ?, status = ?
      WHERE id = ?
    `, [title, content, category, status, req.params.id]);

    // Log article update
    await logSystemEvent(`Updated article: ${title}`, 'info', (req.user as any).id);

    res.json({ message: 'Article updated successfully' });
  } catch (error) {
    console.error('Error updating article:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete article
app.delete('/api/admin/articles/:id', authenticateToken, async (req, res) => {
  try {
    // Get article title for logging
    const [articleRows] = await pool.execute(
      'SELECT title FROM articles WHERE id = ?',
      [req.params.id]
    );
    const articleTitle = (articleRows as any[])[0]?.title;

    await pool.execute('DELETE FROM articles WHERE id = ?', [req.params.id]);

    // Log article deletion
    await logSystemEvent(`Deleted article: ${articleTitle}`, 'warning', (req.user as any).id);

    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get dashboard stats
app.get('/api/admin/stats', authenticateToken, async (req, res) => {
  try {
    const [totalArticles] = await pool.execute(
      'SELECT COUNT(*) as count FROM articles'
    );
    const [articlesThisMonth] = await pool.execute(`
      SELECT COUNT(*) as count
      FROM articles
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
    `);
    const [activeEditors] = await pool.execute(`
      SELECT COUNT(DISTINCT author_id) as count
      FROM articles
      WHERE updated_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
    `);

    res.json({
      totalArticles: (totalArticles as any[])[0].count,
      totalViews: 12500, // Placeholder - implement view tracking
      activeEditors: (activeEditors as any[])[0].count,
      articlesThisMonth: (articlesThisMonth as any[])[0].count,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get recent articles
app.get('/api/admin/articles/recent', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        a.id,
        a.title,
        a.category,
        a.status,
        DATE_FORMAT(a.updated_at, '%Y-%m-%d %H:%i:%s') as lastModified,
        IFNULL(adm.username, 'Unknown') as author
      FROM articles a
      LEFT JOIN admins adm ON a.author_id = adm.id
      ORDER BY a.updated_at DESC
      LIMIT 10
    `);

    res.json(rows);
  } catch (error) {
    console.error('Error fetching recent articles:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get system logs
app.get('/api/admin/logs', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        l.id,
        l.type,
        l.message,
        l.details,
        DATE_FORMAT(l.created_at, '%Y-%m-%d %H:%i:%s') as timestamp,
        l.user_id,
        a.username
      FROM system_logs l
      JOIN admins a ON l.user_id = a.id
      ORDER BY l.created_at DESC
      LIMIT 50
    `);

    res.json(rows);
  } catch (error) {
    console.error('Error fetching system logs:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin article endpoints
app.get('/api/admin/articles', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        a.id, 
        a.title, 
        a.category, 
        a.status,
        a.created_at,
        a.updated_at,
        COALESCE(adm.username, 'Unknown') as author
      FROM articles a
      LEFT JOIN admins adm ON a.author_id = adm.id
      ORDER BY a.updated_at DESC
    `);
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching admin articles:', error);
    res.status(500).json({ message: 'Error fetching articles' });
  }
});

// Admin updates endpoints
app.get('/api/admin/updates', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        u.id, 
        u.title, 
        u.status,
        u.created_at,
        u.updated_at,
        COALESCE(adm.username, 'Unknown') as author
      FROM updates u
      LEFT JOIN admins adm ON u.author_id = adm.id
      ORDER BY u.updated_at DESC
    `);
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching admin updates:', error);
    res.status(500).json({ message: 'Error fetching updates' });
  }
});

app.get('/api/admin/updates/:id', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        u.id, 
        u.title, 
        u.content,
        u.status,
        u.created_at,
        u.updated_at,
        u.author_id,
        COALESCE(adm.username, 'Unknown') as author
      FROM updates u
      LEFT JOIN admins adm ON u.author_id = adm.id
      WHERE u.id = ?
    `, [req.params.id]);
    
    if ((rows as any[]).length === 0) {
      return res.status(404).json({ message: 'Update not found' });
    }
    
    res.json((rows as any[])[0]);
  } catch (error) {
    console.error('Error fetching update:', error);
    res.status(500).json({ message: 'Error fetching update' });
  }
});

app.post('/api/admin/updates', authenticateToken, async (req, res) => {
  const { title, content, status } = req.body;
  const userId = (req.user as any).id;
  
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }
  
  try {
    // Generate UUID for the new update
    const [uuidResult] = await pool.execute('SELECT UUID() as uuid');
    const updateId = (uuidResult as any[])[0].uuid;
    
    await pool.execute(`
      INSERT INTO updates (id, title, content, author_id, status)
      VALUES (?, ?, ?, ?, ?)
    `, [updateId, title, content, userId, status || 'draft']);
    
    await logSystemEvent(`Update created: ${title}`, 'info', userId);
    
    res.status(201).json({ 
      id: updateId,
      message: 'Update created successfully' 
    });
  } catch (error) {
    console.error('Error creating update:', error);
    res.status(500).json({ message: 'Error creating update' });
  }
});

app.put('/api/admin/updates/:id', authenticateToken, async (req, res) => {
  const { title, content, status } = req.body;
  const userId = (req.user as any).id;
  const updateId = req.params.id;
  
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }
  
  try {
    // Check if update exists
    const [updateRows] = await pool.execute(
      'SELECT id FROM updates WHERE id = ?',
      [updateId]
    );
    
    if ((updateRows as any[]).length === 0) {
      return res.status(404).json({ message: 'Update not found' });
    }
    
    await pool.execute(`
      UPDATE updates
      SET title = ?, content = ?, status = ?, author_id = ?
      WHERE id = ?
    `, [title, content, status, userId, updateId]);
    
    await logSystemEvent(`Update modified: ${title}`, 'info', userId);
    
    res.json({ message: 'Update updated successfully' });
  } catch (error) {
    console.error('Error updating update:', error);
    res.status(500).json({ message: 'Error updating update' });
  }
});

app.delete('/api/admin/updates/:id', authenticateToken, async (req, res) => {
  const userId = (req.user as any).id;
  const updateId = req.params.id;
  
  try {
    // Get update title for logging
    const [updateRows] = await pool.execute(
      'SELECT title FROM updates WHERE id = ?',
      [updateId]
    );
    
    if ((updateRows as any[]).length === 0) {
      return res.status(404).json({ message: 'Update not found' });
    }
    
    const updateTitle = (updateRows as any[])[0].title;
    
    await pool.execute(
      'DELETE FROM updates WHERE id = ?',
      [updateId]
    );
    
    await logSystemEvent(`Update deleted: ${updateTitle}`, 'info', userId);
    
    res.json({ message: 'Update deleted successfully' });
  } catch (error) {
    console.error('Error deleting update:', error);
    res.status(500).json({ message: 'Error deleting update' });
  }
});

// Get article by ID for editing
app.get('/api/admin/articles/:id/edit', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        a.id,
        a.title,
        a.content,
        a.category,
        a.status,
        a.created_at,
        a.updated_at,
        COALESCE(adm.username, 'Unknown') as author
      FROM articles a
      LEFT JOIN admins adm ON a.author_id = adm.id
      WHERE a.id = ?
    `, [req.params.id]);
    
    if ((rows as any[]).length === 0) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json((rows as any[])[0]);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get player count
app.get('/api/player-count', async (req, res) => {
  try {
    // Simulierte Spielerzahl - hier könnte später eine echte Verbindung zum Spielserver erfolgen
    const onlinePlayers = Math.floor(Math.random() * 150) + 50; // Zufällige Zahl zwischen 50 und 200
    const maxPlayers = 500;
    
    res.json({
      online: onlinePlayers,
      max: maxPlayers,
      percentage: Math.round((onlinePlayers / maxPlayers) * 100)
    });
  } catch (error) {
    console.error('Error fetching player count:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin Users API
// Get all users
app.get('/api/admin/users', authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.execute(`
      SELECT id, username, email, role, created_at, last_login 
      FROM users 
      ORDER BY username
    `);
    
    // Passwörter niemals an Frontend senden
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a single user
app.get('/api/admin/users/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [users] = await pool.execute(`
      SELECT id, username, email, role, created_at, last_login 
      FROM users 
      WHERE id = ?
    `, [id]);
    
    if (Array.isArray(users) && users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(users[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new user
app.post('/api/admin/users', authenticateToken, async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    // Validierung
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email and password are required' });
    }
    
    // Überprüfen, ob Benutzer bereits existiert
    const [existingUsers] = await pool.execute('SELECT id FROM users WHERE username = ? OR email = ?', [username, email]);
    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      return res.status(409).json({ message: 'Username or email already exists' });
    }
    
    // Passwort hashen
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Benutzer in Datenbank speichern
    const [result] = await pool.execute(`
      INSERT INTO users (username, email, password, role, created_at) 
      VALUES (?, ?, ?, ?, NOW())
    `, [username, email, hashedPassword, role || 'editor']);
    
    const id = result.insertId;
    
    res.status(201).json({ 
      id, 
      username, 
      email, 
      role: role || 'editor' 
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update user
app.put('/api/admin/users/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, role, password } = req.body;
    
    // Überprüfen, ob Benutzer existiert
    const [users] = await pool.execute('SELECT id FROM users WHERE id = ?', [id]);
    if (Array.isArray(users) && users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Wenn ein neues Passwort gesetzt wird, dieses hashen
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    
    // Update-Felder und -Werte erstellen
    const updateFields = [];
    const updateValues = [];
    
    if (username) {
      updateFields.push('username = ?');
      updateValues.push(username);
    }
    
    if (email) {
      updateFields.push('email = ?');
      updateValues.push(email);
    }
    
    if (role) {
      updateFields.push('role = ?');
      updateValues.push(role);
    }
    
    if (hashedPassword) {
      updateFields.push('password = ?');
      updateValues.push(hashedPassword);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }
    
    // ID für WHERE-Klausel hinzufügen
    updateValues.push(id);
    
    // Update ausführen
    await pool.execute(`
      UPDATE users 
      SET ${updateFields.join(', ')} 
      WHERE id = ?
    `, updateValues);
    
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete user
app.delete('/api/admin/users/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Überprüfen, ob der Benutzer existiert
    const [users] = await pool.execute('SELECT id FROM users WHERE id = ?', [id]);
    if (Array.isArray(users) && users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Benutzer löschen
    await pool.execute('DELETE FROM users WHERE id = ?', [id]);
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3001;

// Nur starten, wenn nicht in Vercel-Umgebung
if (process.env.VERCEL_ENV === undefined) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Für Vercel Serverless Functions
export default app;