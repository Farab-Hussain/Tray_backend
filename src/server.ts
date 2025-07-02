import express, { RequestHandler } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import { verifyToken } from './middlewares/authMiddleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/api/protected', verifyToken as RequestHandler, (req, res) =>  {
  const user = (req as any).user as { role?: string } | undefined;
  res.json({ msg: `Authenticated as ${user?.role}` });
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
