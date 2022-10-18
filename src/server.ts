import express from 'express';

const app = express();

app.get('/', (request, response) => response.json({
  message: 'My serve express, Hello John Doe!',
}));

app.listen(3333, () => {
  console.log('Back-end started in 3333 port!');
});
