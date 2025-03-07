import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { pool } from './db.ts';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

// Lade Umgebungsvariablen
dotenv.config();

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const USE_MOCK_DATA = process.env.NODE_ENV === 'production' || process.env.USE_MOCK_DATA === 'true';

app.use(cors());
app.use(express.json());

// Mock-Daten für Entwicklung und Fallback
const mockData = {
  settings: {
    maintenanceMode: false,
    maintenanceMessage: 'Das System wird gerade gewartet. Bitte versuchen Sie es später erneut.'
  },
  statistics: {
    articles: 42,
    categories: 8,
    users: 15,
    views: 2340
  },
  users: [
    {
      id: '1',
      username: 'admin',
      email: 'admin@cytooxien.de',
      role: 'admin',
      isMainAdmin: true,
      createdAt: '2023-01-01T12:00:00Z',
      lastLogin: '2023-05-20T15:30:00Z'
    },
    {
      id: '2',
      username: 'editor',
      email: 'editor@cytooxien.de',
      role: 'editor',
      isMainAdmin: false,
      createdAt: '2023-02-15T10:00:00Z',
      lastLogin: '2023-05-19T09:45:00Z'
    }
  ],
  articles: [
    {
      id: '1',
      title: 'Willkommen bei Cytooxien',
      content: '<p>Dies ist ein Beispielartikel für das Wiki.</p>',
      category: 'Allgemein',
      author: 'admin',
      lastModified: '2023-05-15T10:30:00Z',
      status: 'published'
    },
    {
      id: '2',
      title: 'Server-Regeln',
      content: '<p>Hier sind die Server-Regeln...</p>',
      category: 'Regeln',
      author: 'admin',
      lastModified: '2023-05-10T14:20:00Z',
      status: 'published'
    }
  ],
  categories: [
    { id: '1', name: 'Allgemein', description: 'Allgemeine Informationen' },
    { id: '2', name: 'Regeln', description: 'Server-Regeln und Richtlinien' },
    { id: '3', name: 'Spielmechaniken', description: 'Erklärungen zu Spielmechaniken' }
  ],
  updates: [
    {
      id: '1',
      title: 'Neue Wiki-Features',
      content: '<p>Wir haben neue Features im Wiki hinzugefügt!</p>',
      created_at: '2023-05-18T10:00:00Z',
      updated_at: '2023-05-18T10:00:00Z',
      author: 'admin'
    },
    {
      id: '2',
      title: 'Server-Update',
      content: '<p>Der Server wurde auf die neueste Version aktualisiert.</p>',
      created_at: '2023-05-15T14:30:00Z',
      updated_at: '2023-05-15T14:30:00Z',
      author: 'admin'
    }
  ]
};

// Helper function to safely log system events
async function logSystemEvent(message: string, type: 'info' | 'warning' | 'error', userId?: string) {
  if (USE_MOCK_DATA) {
    console.log(`[MOCK] Logging ${type}: ${message}${userId ? ` (User: ${userId})` : ''}`);
    return;
  }

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

// Error handler middleware
const handleErrors = (fn: Function) => async (req: any, res: any) => {
  try {
    await fn(req, res);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      message: 'Internal server error', 
      error: process.env.NODE_ENV === 'development' ? String(error) : undefined 
    });
  }
};

// PUBLIC ENDPOINTS

// Get settings
app.get('/api/settings', handleErrors(async (req: any, res: any) => {
  if (USE_MOCK_DATA) {
    return res.json(mockData.settings);
  }

  const [rows] = await pool.execute('SELECT maintenance_mode, maintenance_message FROM settings LIMIT 1');
  
  if ((rows as any[]).length === 0) {
    return res.json({ maintenanceMode: false, maintenanceMessage: '' });
  }
  
  res.json({
    maintenanceMode: (rows as any[])[0]?.maintenance_mode === 1,
    maintenanceMessage: (rows as any[])[0]?.maintenance_message || '',
  });
}));

// Get all published articles
app.get('/api/articles', handleErrors(async (req: any, res: any) => {
  if (USE_MOCK_DATA) {
    return res.json(mockData.articles);
  }

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
}));

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
app.get('/api/updates', handleErrors(async (req: any, res: any) => {
  if (USE_MOCK_DATA) {
    return res.json(mockData.updates);
  }

  const [rows] = await pool.execute(`
    SELECT u.id, u.title, u.content, u.created_at, u.updated_at, a.username as author
    FROM updates u
    JOIN admins a ON u.author_id = a.id
    WHERE u.status = 'published'
    ORDER BY u.created_at DESC
    LIMIT 5
  `);
  res.json(rows);
}));

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

// ADMIN ENDPOINTS

// Get admin statistics
app.get('/api/admin/stats', authenticateToken, handleErrors(async (req: any, res: any) => {
  if (USE_MOCK_DATA) {
    return res.json(mockData.statistics);
  }

  const [articleRows] = await pool.execute('SELECT COUNT(*) as count FROM articles');
  const [categoryRows] = await pool.execute('SELECT COUNT(*) as count FROM categories');
  const [userRows] = await pool.execute('SELECT COUNT(*) as count FROM admins');
  const [viewRows] = await pool.execute('SELECT SUM(view_count) as total FROM articles');

  res.json({
    articles: (articleRows as any[])[0].count,
    categories: (categoryRows as any[])[0].count,
    users: (userRows as any[])[0].count,
    views: (viewRows as any[])[0].total || 0
  });
}));

// Get recent articles for admin dashboard
app.get('/api/admin/articles/recent', authenticateToken, handleErrors(async (req: any, res: any) => {
  if (USE_MOCK_DATA) {
    return res.json(mockData.articles);
  }

  const [rows] = await pool.execute(`
    SELECT 
      a.id, 
      a.title, 
      a.category, 
      a.status,
      DATE_FORMAT(a.updated_at, '%Y-%m-%d %H:%i:%s') as lastModified,
      adm.username as author
    FROM articles a
    LEFT JOIN admins adm ON a.author_id = adm.id
    ORDER BY a.updated_at DESC
    LIMIT 10
  `);
  res.json(rows);
}));

// Get admin profile
app.get('/api/admin/profile', authenticateToken, handleErrors(async (req: any, res: any) => {
  if (USE_MOCK_DATA) {
    const user = mockData.users.find(u => u.id === req.user.id) || mockData.users[0];
    return res.json(user);
  }

  const [rows] = await pool.execute(`
    SELECT id, username, email, role, created_at, last_login 
    FROM admins 
    WHERE id = ?
  `, [req.user.id]);
  
  if ((rows as any[]).length === 0) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  res.json((rows as any[])[0]);
}));

// Update settings
app.put('/api/admin/settings', authenticateToken, handleErrors(async (req: any, res: any) => {
  const { maintenanceMode, maintenanceMessage } = req.body;
  
  if (USE_MOCK_DATA) {
    mockData.settings.maintenanceMode = maintenanceMode;
    mockData.settings.maintenanceMessage = maintenanceMessage || '';
    return res.json({ success: true });
  }

  await pool.execute(
    'UPDATE settings SET maintenance_mode = ?, maintenance_message = ?',
    [maintenanceMode ? 1 : 0, maintenanceMessage || '']
  );
  
  await logSystemEvent(
    `Settings updated: Maintenance Mode ${maintenanceMode ? 'Enabled' : 'Disabled'}`, 
    'info', 
    req.user.id
  );
  
  res.json({ success: true });
}));

// Get all users (admin only)
app.get('/api/admin/users', authenticateToken, handleErrors(async (req: any, res: any) => {
  if (USE_MOCK_DATA) {
    return res.json(mockData.users);
  }

  const [rows] = await pool.execute(`
    SELECT 
      id, 
      username, 
      email, 
      role, 
      is_main_admin as isMainAdmin,
      DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as createdAt,
      DATE_FORMAT(last_login, '%Y-%m-%d %H:%i:%s') as lastLogin
    FROM admins
    ORDER BY username
  `);
  res.json(rows);
}));

// Create user (admin only)
app.post('/api/admin/users', authenticateToken, handleErrors(async (req: any, res: any) => {
  const { username, email, password, role } = req.body;
  
  if (USE_MOCK_DATA) {
    const newUser = {
      id: String(mockData.users.length + 1),
      username,
      email,
      role,
      isMainAdmin: false,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    mockData.users.push(newUser);
    return res.status(201).json(newUser);
  }

  // Check if user exists
  const [existingUsers] = await pool.execute(
    'SELECT id FROM admins WHERE username = ? OR email = ?',
    [username, email]
  );
  
  if ((existingUsers as any[]).length > 0) {
    return res.status(400).json({ message: 'Username or email already exists' });
  }
  
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  // Create user
  const userId = uuidv4();
  await pool.execute(`
    INSERT INTO admins (id, username, email, password, role, created_at)
    VALUES (?, ?, ?, ?, ?, NOW())
  `, [userId, username, email, hashedPassword, role]);
  
  await logSystemEvent(`User created: ${username}`, 'info', req.user.id);
  
  // Return created user
  const [userRows] = await pool.execute(
    'SELECT id, username, email, role FROM admins WHERE id = ?',
    [userId]
  );
  
  res.status(201).json((userRows as any[])[0]);
}));

// Update user (admin only)
app.put('/api/admin/users/:id', authenticateToken, handleErrors(async (req: any, res: any) => {
  const { id } = req.params;
  const { username, email, password, role } = req.body;
  
  if (USE_MOCK_DATA) {
    const userIndex = mockData.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Don't allow changing main admin role
    if (mockData.users[userIndex].isMainAdmin && role !== 'admin') {
      return res.status(400).json({ message: 'Cannot change role of main admin' });
    }
    
    mockData.users[userIndex] = {
      ...mockData.users[userIndex],
      username: username || mockData.users[userIndex].username,
      email: email || mockData.users[userIndex].email,
      role: role || mockData.users[userIndex].role
    };
    
    return res.json(mockData.users[userIndex]);
  }

  // Check if user exists
  const [userRows] = await pool.execute(
    'SELECT id, is_main_admin FROM admins WHERE id = ?',
    [id]
  );
  
  if ((userRows as any[]).length === 0) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  const user = (userRows as any[])[0];
  
  // Don't allow changing main admin role
  if (user.is_main_admin === 1 && role !== 'admin') {
    return res.status(400).json({ message: 'Cannot change role of main admin' });
  }
  
  // Update user
  const updates = [];
  const values = [];
  
  if (username) {
    updates.push('username = ?');
    values.push(username);
  }
  
  if (email) {
    updates.push('email = ?');
    values.push(email);
  }
  
  if (role) {
    updates.push('role = ?');
    values.push(role);
  }
  
  if (password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    updates.push('password = ?');
    values.push(hashedPassword);
  }
  
  if (updates.length === 0) {
    return res.status(400).json({ message: 'No fields to update' });
  }
  
  values.push(id);
  
  await pool.execute(
    `UPDATE admins SET ${updates.join(', ')} WHERE id = ?`,
    values
  );
  
  await logSystemEvent(`User updated: ${username || id}`, 'info', req.user.id);
  
  // Return updated user
  const [updatedRows] = await pool.execute(
    'SELECT id, username, email, role FROM admins WHERE id = ?',
    [id]
  );
  
  res.json((updatedRows as any[])[0]);
}));

// Delete user (admin only)
app.delete('/api/admin/users/:id', authenticateToken, handleErrors(async (req: any, res: any) => {
  const { id } = req.params;
  
  if (USE_MOCK_DATA) {
    const userIndex = mockData.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (mockData.users[userIndex].isMainAdmin) {
      return res.status(400).json({ message: 'Cannot delete main admin' });
    }
    
    mockData.users.splice(userIndex, 1);
    return res.json({ success: true });
  }

  // Check if user exists and is not main admin
  const [userRows] = await pool.execute(
    'SELECT id, username, is_main_admin FROM admins WHERE id = ?',
    [id]
  );
  
  if ((userRows as any[]).length === 0) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  const user = (userRows as any[])[0];
  
  if (user.is_main_admin === 1) {
    return res.status(400).json({ message: 'Cannot delete main admin' });
  }
  
  // Delete user
  await pool.execute('DELETE FROM admins WHERE id = ?', [id]);
  
  await logSystemEvent(`User deleted: ${user.username}`, 'info', req.user.id);
  
  res.json({ success: true });
}));

// Login endpoint
app.post('/api/login', handleErrors(async (req: any, res: any) => {
  const { username, password } = req.body;
  
  if (USE_MOCK_DATA) {
    // For demo in mock mode, allow login with admin/admin
    if (username === 'admin' && password === 'admin') {
      const user = mockData.users.find(u => u.username === 'admin');
      if (user) {
        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        return res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
      }
    }
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  
  // Check if user exists
  const [rows] = await pool.execute(
    'SELECT id, username, password, role FROM admins WHERE username = ?',
    [username]
  );
  
  if ((rows as any[]).length === 0) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  const user = (rows as any[])[0];
  
  // Verify password
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  // Update last login time
  await pool.execute(
    'UPDATE admins SET last_login = NOW() WHERE id = ?',
    [user.id]
  );
  
  // Generate token
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  await logSystemEvent(`User logged in: ${username}`, 'info', user.id);
  
  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role
    }
  });
}));

// Catch-all route for API endpoints not defined above
app.all('/api/*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// Start the server if not in Vercel environment
if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel serverless function
export default app;