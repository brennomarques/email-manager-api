import express from 'express';
import 'dotenv/config';

const PORT = Number(String(process.env.HOST_PORT));
const HOST = process.env.HOST_NAME;

const app = express();

app.get('/', (request, response) => response.json({
  message: 'My serve express, Hello John Doe!',
}));

app.listen(PORT, HOST, () => {
  console.log(`Back-end started in ${PORT} port! 👈️`);
});
