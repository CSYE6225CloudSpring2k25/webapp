const express = require('express');
const { HealthCheck } = require('../Entities');
const logger = require('../logger');
const statsd = require('../metrics');
const router = express.Router();

router.head('/', (req, res) => {
  logger.warn('Unsupported HEAD /healthz');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.status(405).send();
});

router.get('/', async (req, res) => {
  const start = Date.now();
  logger.info('GET /healthz request received');
  statsd.increment('api.healthz.count');

  if (req.headers['content-length'] && parseInt(req.headers['content-length'], 10) > 0) {
    logger.warn('Content-Length not allowed in GET /healthz');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    return res.status(400).send();
  }
  if (Object.keys(req.query).length > 0 || Object.keys(req.params).length > 0) {
    logger.warn('Query or path parameters not allowed in GET /healthz', { query: req.query, params: req.params });
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    return res.status(400).send();
  }

  try {
    const dbStart = Date.now();
    const record = await HealthCheck.create({ datetime: new Date() });
    statsd.timing('db.query', Date.now() - dbStart);

    if (record) {
      logger.info('Health check successful');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.status(200).send();
    }
  } catch (err) {
    logger.error('Error in GET /healthz', { error: err.message, stack: err.stack });
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.status(503).send();
  }
  statsd.timing('api.healthz.time', Date.now() - start);
});
 
router.all('/', (req, res) => {
  logger.warn(`Unsupported ${req.method} /healthz`);
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.status(405).send();
});

module.exports = router;
