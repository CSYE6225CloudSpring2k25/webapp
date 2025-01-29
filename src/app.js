const express = require('express');
const healthzRoute = require('./Routes/healthzroute');
const app = express();
const { sequelize } = require('./Entities');

app.use(express.json());

app.use('/healthz', healthzRoute);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

sequelize
  .sync()
  .then(() => {
    console.log('Database connected and synced');
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err);
  });
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Error:', 'Invalid JSON detected in the request body');
    return res.status(400).send();
  }
  next(err);
});

