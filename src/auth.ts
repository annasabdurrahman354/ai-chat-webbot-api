import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import db from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-in-prod';

export function requireDashboardAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.admin_token;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized access to dashboard API' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    (req as any).user = decoded; // { id, username, role }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired JWT session' });
  }
}

export function requireApiToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const queryToken = req.query.token;
  let token: string | undefined = typeof queryToken === 'string' ? queryToken : undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'Missing API Token in request' });
  }

  const tokenRecord = db.prepare('SELECT user_id, status, expires_at FROM tokens WHERE token = ?').get(token) as any;
  if (!tokenRecord || tokenRecord.status !== 'active') {
    return res.status(401).json({ error: 'Invalid or inactive API Token' });
  }

  if (tokenRecord.expires_at && new Date(tokenRecord.expires_at) < new Date()) {
    return res.status(401).json({ error: 'API Token has expired' });
  }

  const userRecord = db.prepare('SELECT id, username, role FROM users WHERE id = ?').get(tokenRecord.user_id) as any;
  if (!userRecord) {
    return res.status(401).json({ error: 'User for this token not found' });
  }

  (req as any).apiUser = userRecord;
  next();
}

export function generateJwt(user: any) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}
