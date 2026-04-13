import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

import { sendMessage, stopBot } from './bot.js';
import db, { initDB } from './src/db.js';
import { requireApiToken, requireDashboardAuth, generateJwt } from './src/auth.js';

// Setup ES Module filename/dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize SQLite schema and default admin
initDB();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

// -------------------------------------------------------------
// BOT API ENDPOINTS
// -------------------------------------------------------------

// Route to send a message via the Playwright bot -> Requires API Token!
app.get('/api/message', requireApiToken, async (req: Request, res: Response) => {
  const webSearchParam = req.query.websearch === 'true'; 
  const messageParam = req.query.message ? String(req.query.message) : undefined;
  const plainTextParam = req.query.plainText !== 'false';
  
  const user = (req as any).apiUser;
  const token = (req as any).apiToken;

  const result = await sendMessage(undefined, messageParam, webSearchParam, plainTextParam);
  
  // Log the request
  const logId = crypto.randomUUID();
  try {
    db.prepare('INSERT INTO request_logs (id, user_id, token, request_params, response_data, status) VALUES (?, ?, ?, ?, ?, ?)').run(
      logId,
      user.id,
      token,
      JSON.stringify({ message: messageParam, webSearch: webSearchParam, plainText: plainTextParam }),
      JSON.stringify(result),
      result.status
    );
  } catch (err) {
    console.error('Failed to log request:', err);
  }

  res.json(result);
});

// Route to stop all Playwright bots -> Requires Dashboard Admin Authentication!
app.get('/api/stop', requireDashboardAuth, async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can stop all bots' });
  }
  const result = await stopBot();
  res.json(result);
});

// -------------------------------------------------------------
// DASHBOARD API ENDPOINTS (Authentication & Management)
// -------------------------------------------------------------

// Login to dashboard
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as any;
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = generateJwt(user);
  res.cookie('admin_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 24 * 60 * 60 * 1000 });
  res.json({ message: 'Login successful', user: { id: user.id, username: user.username, role: user.role } });
});

// Logout
app.post('/api/auth/logout', (req: Request, res: Response) => {
  res.clearCookie('admin_token');
  res.json({ message: 'Logged out' });
});

// Get context containing user info
app.get('/api/auth/me', requireDashboardAuth, (req: Request, res: Response) => {
  res.json({ user: (req as any).user });
});

// -----------------------------
// Tokens Management
// -----------------------------

// View tokens
app.get('/api/tokens', requireDashboardAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  if (user.role === 'admin') {
    // Admin sees all tokens
    const tokens = db.prepare('SELECT tokens.*, users.username FROM tokens JOIN users ON tokens.user_id = users.id').all();
    return res.json(tokens);
  } else {
    // User sees own tokens
    const tokens = db.prepare('SELECT * FROM tokens WHERE user_id = ?').all(user.id);
    return res.json(tokens);
  }
});

// Generate new token
app.post('/api/tokens', requireDashboardAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { user_id, expires_at } = req.body;
  
  // Only admins can generate tokens for *other* users
  const targetUserId = (user.role === 'admin' && user_id) ? user_id : user.id;

  const id = crypto.randomUUID();
  const tokenString = 'sk_inv_' + crypto.randomBytes(24).toString('hex');
  
  db.prepare('INSERT INTO tokens (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)').run(
    id, targetUserId, tokenString, expires_at || null
  );

  res.json({ message: 'Token generated', token: tokenString });
});

// Revoke a token
app.delete('/api/tokens/:id', requireDashboardAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const tokenId = req.params.id;

  const tokenInfo = db.prepare('SELECT user_id FROM tokens WHERE id = ?').get(tokenId) as any;
  if (!tokenInfo) return res.status(404).json({ error: 'Token not found' });

  if (user.role !== 'admin' && tokenInfo.user_id !== user.id) {
    return res.status(403).json({ error: 'Unauthorized to delete this token' });
  }

  // Soft delete or status update
  db.prepare("UPDATE tokens SET status = 'revoked' WHERE id = ?").run(tokenId);
  res.json({ message: 'Token revoked successfully' });
});

// -----------------------------
// Request Logs Management
// -----------------------------

// View logs
app.get('/api/logs', requireDashboardAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  if (user.role === 'admin') {
    // Admin sees all logs
    const logs = db.prepare(`
      SELECT request_logs.*, users.username 
      FROM request_logs 
      JOIN users ON request_logs.user_id = users.id 
      ORDER BY request_logs.created_at DESC
    `).all();
    return res.json(logs);
  } else {
    // User sees own logs
    const logs = db.prepare(`
      SELECT * 
      FROM request_logs 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `).all(user.id);
    return res.json(logs);
  }
});

// -----------------------------
// Users Management (Admin Only)
// -----------------------------

app.get('/api/admin/users', requireDashboardAuth, (req: Request, res: Response) => {
  if ((req as any).user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  const users = db.prepare('SELECT id, username, role, created_at FROM users').all();
  res.json(users);
});

app.post('/api/admin/users', requireDashboardAuth, (req: Request, res: Response) => {
  if ((req as any).user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  const { username, password, role } = req.body;

  if (!username || !password) return res.status(400).json({ error: 'Missing username or password' });

  try {
    const hash = bcrypt.hashSync(password, 10);
    const id = crypto.randomUUID();
    db.prepare('INSERT INTO users (id, username, password_hash, role) VALUES (?, ?, ?, ?)').run(id, username, hash, role || 'user');
    res.json({ message: 'User created' });
  } catch (err: any) {
    res.status(400).json({ error: 'Username probably already exists' });
  }
});

app.patch('/api/admin/users/:id', requireDashboardAuth, (req: Request, res: Response) => {
  if ((req as any).user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  const { id } = req.params;
  const { username, password, role } = req.body;

  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as any;
    if (!user) return res.status(404).json({ error: 'User not found' });

    let query = 'UPDATE users SET ';
    const params: any[] = [];
    const updates: string[] = [];

    if (username) {
      updates.push('username = ?');
      params.push(username);
    }
    if (role) {
      updates.push('role = ?');
      params.push(role);
    }
    if (password) {
      const hash = bcrypt.hashSync(password, 10);
      updates.push('password_hash = ?');
      params.push(hash);
    }

    if (updates.length === 0) return res.json({ message: 'No changes provided' });

    query += updates.join(', ') + ' WHERE id = ?';
    params.push(id);

    db.prepare(query).run(...params);
    res.json({ message: 'User updated successfully' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/users/:id', requireDashboardAuth, (req: Request, res: Response) => {
  if ((req as any).user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  const { id } = req.params;

  // Prevent self-deletion
  if (id === (req as any).user.id) {
    return res.status(400).json({ error: 'Cannot delete your own account' });
  }

  db.prepare('DELETE FROM users WHERE id = ?').run(id);
  res.json({ message: 'User deleted successfully' });
});

// -------------------------------------------------------------
// FRONTEND SERVING
// -------------------------------------------------------------

// Serve the compiled react frontend
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Fallback all unspecified routes to React Router
app.get(/.*/, (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

app.listen(port, () => {
  console.log(`REST API listening on port ${port}`);
});
