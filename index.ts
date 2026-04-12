import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import { sendMessage, stopBot } from './bot.js';

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Hello world route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello World' });
});

// Route to send a message via the Playwright bot
app.get('/api/message', async (req: Request, res: Response) => {
  const webSearchParam = req.query.websearch === 'true'; // parse boolean
  const messageParam = req.query.message ? String(req.query.message) : undefined;
  
  // default to true unless explicitly set to false
  const plainTextParam = req.query.plainText !== 'false';
  
  const result = await sendMessage(undefined, messageParam, webSearchParam, plainTextParam);
  res.json(result);
});

// Route to stop the Playwright bot
app.get('/api/stop', async (req: Request, res: Response) => {
  const result = await stopBot();
  res.json(result);
});

app.listen(port, () => {
  console.log(`REST API listening on port ${port}`);
});
