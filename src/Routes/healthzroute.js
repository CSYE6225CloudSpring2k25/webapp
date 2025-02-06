const express = require('express');
const { HealthCheck } = require('../Entities');
const router = express.Router();

router.get('/', async (req, res) => {
  if (req.headers['content-length'] && parseInt(req.headers['content-length'], 10) > 0) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    return res.status(400).send();
  }
  if (Object.keys(req.query).length > 0 || Object.keys(req.params).length > 0) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    return res.status(400).send();
  }

  try {
    const record = await HealthCheck.create({ datetime: new Date() });
    if (record) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.status(200).send();
    }
  } catch (err) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.status(503).send();
  }
});
 
router.all('/', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.status(405).send();
});

module.exports = router;
