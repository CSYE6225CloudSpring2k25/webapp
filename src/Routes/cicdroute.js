const express = require('express');
const { HealthCheck } = require('../Entities');
const logger = require('../logger');
const statsd = require('../metrics');
const router = express.Router();

router.head('/', (req, res) => {
  logger.warn('Unsupported HEAD /cicd');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.status(405).send();
});

router.get('/', async (req, res) => {
  const start = Date.now();
  logger.info('GET /cicd request received');
  statsd.increment('api.cicd.count');

  if (req.headers['content-length'] && parseInt(req.headers['content-length'], 10) > 0) {
    logger.warn('Content-Length not allowed in GET /cicd');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    return res.status(400).send();
  }
  if (Object.keys(req.query).length > 0 || Object.keys(req.params).length > 0) {
    logger.warn('Query or path parameters not allowed in GET /cicd', { query: req.query, params: req.params });
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
      logger.info('Health check successful via /cicd');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.status(200).send();
    }
  } catch (err) {
    logger.error('Error in GET /cicd', { error: err.message, stack: err.stack });
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.status(503).send();
  }
  statsd.timing('api.cicd.time', Date.now() - start);
});

router.all('/', (req, res) => {
  logger.warn(`Unsupported ${req.method} /cicd`);
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.status(405).send();
});

module.exports = router;