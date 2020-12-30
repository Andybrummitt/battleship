const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000

app.use(express.static('public'));
app.use(express.json());

//  ERROR HANDLING
app.use((req, res, next) => {
  const err = new Error('Not found');
  err.status = 404;  
  next(err);
})

app.use((err, req, res, next) => {
  err.message = err.message || 'Internal Server Error';
  err.status = err.status  || 500;
  res.json(err);
})

app.listen(PORT, () => {
  console.log(`Example app listening at ${PORT}`)
})