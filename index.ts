import express from 'express';
import type { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Hello world route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello World' });
});

app.listen(port, () => {
  console.log(`REST API listening on port ${port}`);
});
