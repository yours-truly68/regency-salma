import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.post('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/auth', authRoutes);

// Consistent error handling
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use((_err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(_err);
  res.status(_err.status || 500).json({
    error: {
      message: _err.message || 'Internal Server Error',
    },
  });
});

export default app;

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
