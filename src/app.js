const express = require('express');
const healthzRoute = require('./Routes/healthzroute');
const fileRoute = require('./Routes/fileroute');
const app = express();
const { sequelize } = require('./Entities');

app.use(express.json());

app.use('/healthz', healthzRoute);
app.use('/v1/file', fileRoute);

if (process.env.NODE_ENV !== 'test') {
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
}

sequelize
  .sync()
  .then(() => {
    console.log('Database connected and synced');
  })
  .catch((err) => {
    console.log('Error connecting to the database');
  });
app.use((req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  console.log('Error:', 'Invalid URL');
  res.status(404).send();
});
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Error:', 'Invalid JSON detected in the request body');
    return res.status(400).send();
  }
  next(err);
});

module.exports = app;

