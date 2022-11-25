/* eslint-disable no-console */

import express from 'express';
import 'dotenv/config';
import routes from '@routes/routes';
import connectDB from '@database/database';

const PORT = Number(String(process.env.APP_PORT));
const HOST = process.env.APP_NAME;

const app = express();

connectDB();

app.use(express.json());
app.use('/api', routes);

app.listen(PORT, HOST, () => {
  console.log(`Back-end started in ${PORT} port! 👈️`);
});
