import express from 'express';

const PORT = 3000;
const HOST = '0.0.0.0';

const app = express();

app.get('/', (request, response) => response.json({
  message: 'My serve express, Hello John Doe!',
}));

app.listen(PORT, HOST, () => {
  console.log('Back-end started in 3000 port!');
});
