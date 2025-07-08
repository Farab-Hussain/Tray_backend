import express, { RequestHandler } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import { verifyToken } from './middlewares/authMiddleware';
import { logger, limiter } from './middlewares/authMiddleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(logger);
app.use(limiter);
app.use('/api/auth', authRoutes);

app.get('/api/protected', verifyToken as RequestHandler, (req, res) =>  {
  const user = (req as any).user as { role?: string } | undefined;
  res.json({ msg: `Authenticated as ${user?.role}` });
});

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send(`Something broke! ${err.message}`);
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
