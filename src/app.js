const express = require('express');
const healthzRoute = require('./Routes/healthzroute');
const app = express();
const { sequelize } = require('./Entities');

app.use(express.json());

app.use('/healthz', healthzRoute);
app.disable('x-powered-by');

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

