import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { connectDB } from './lib/db.js';
import authRoutes from './routes/auth.js';
import ticketRoutes from "./routes/tickets.js";
import ticketsRoutes from "./routes/tickets.js";



// 1. create express app
const app = express();

// 2. middlewares
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(helmet());
app.use(pinoHttp());

// 3. routes
app.use("/api/auth", authRoutes);

// health endpoints
app.get('/healthz', (_req, res) => res.json({ status: 'ok' }));
app.get('/readyz', (_req, res) => res.json({ status: 'ready' }));

// 4. connect DB and start server
const PORT = Number(process.env.PORT || 8080);
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/helpdesk";

connectDB(MONGO_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 API listening on http://localhost:${PORT}`);
  });
});


// after auth routes
app.use("/api/tickets", ticketRoutes);
app.use("/api/tickets", ticketsRoutes);