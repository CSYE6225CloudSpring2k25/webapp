const express = require('express');
const { File } = require('../Entities');
const AWS = require('aws-sdk');
const multer = require('multer');
const router = express.Router();
const logger = require('../logger');
const statsd = require('../metrics');

const s3 = new AWS.S3();
const upload = multer({ storage: multer.memoryStorage() });

router.head('/', (req, res) => {
  logger.warn('Unsupported HEAD /v1/file');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.status(405).send();
});

router.post('/', upload.single('profilePic'), (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    logger.warn('Multer error in POST /v1/file', { error: err.message });
    return res.status(400).json({ error: 'Invalid field name. Use "profilePic" as the key' });
  }
  next(err);
}, async (req, res) => {
  const start = Date.now();
  logger.info('POST /v1/file request received');
  statsd.increment('api.post_file.count');

  if (Object.keys(req.query).length > 0) {
    logger.warn('Query parameters not allowed in POST /v1/file', { query: req.query });
    return res.status(400).json({ error: 'query parameters not allowed' });
  }
  if (!req.file) {
    logger.warn('Missing profilePic in POST /v1/file');
    return res.status(400).json({ error: 'profilePic required' });
  }

  const fileName = req.file.originalname;
  const s3Key = `${Date.now()}-${fileName}`;
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: s3Key,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };
  try {
    const s3Start = Date.now();
    const { Location } = await s3.upload(params).promise();
    statsd.timing('s3.upload', Date.now() - s3Start);

    const dbStart = Date.now();
    const file = await File.create({ file_name: fileName, url: Location });
    statsd.timing('db.query', Date.now() - dbStart);

    logger.info(`File uploaded: ${file.id}`, { s3Key, url: Location });
    res.status(201).json({
      file_name: file.file_name,
      id: file.id,
      url: file.url,
      upload_date: file.upload_date.toISOString().split('T')[0]
    });
  } catch (error) {
    logger.error('Error in POST /v1/file', { error: error.message, stack: error.stack });
    res.status(400).json({ error: error.message });
  }
  statsd.timing('api.post_file.time', Date.now() - start);
});

router.head('/:id', (req, res) => {
  logger.warn(`Unsupported HEAD /v1/file/${req.params.id}`);
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.status(405).send();
});

router.get('/:id', async (req, res) => {
  const start = Date.now();
  logger.info(`GET /v1/file/${req.params.id} request received`);
  statsd.increment('api.get_file.count');

  if (Object.keys(req.query).length > 0) {
    logger.warn('Query parameters not allowed in GET /v1/file/:id', { query: req.query });
    return res.status(400).json({ error: 'query parameters not allowed' });
  }
  try {
    const dbStart = Date.now();
    const file = await File.findByPk(req.params.id);
    statsd.timing('db.query', Date.now() - dbStart);

    if (!file) {
        logger.warn(`File not found: ${req.params.id}`);
        return res.status(404).json({ error: 'File not found' });
    }

    res.status(200).json({
      file_name: file.file_name,
      id: file.id,
      url: file.url,
      upload_date: file.upload_date.toISOString().split('T')[0]
    });
  } catch (error) {
    logger.error('Error in GET /v1/file/:id', { error: error.message, stack: error.stack });
    res.status(400).json({ error: 'Failed to retrieve file', details: error.message });
  }
  statsd.timing('api.get_file.time', Date.now() - start);
});

router.delete('/:id', async (req, res) => {
  const start = Date.now();
  logger.info(`DELETE /v1/file/${req.params.id} request received`);
  statsd.increment('api.delete_file.count');

  if (Object.keys(req.query).length > 0) {
    logger.warn('Query parameters not allowed in DELETE /v1/file/:id', { query: req.query });
    return res.status(400).json({ error: 'query parameters not allowed' });
  }

  try {
    const dbStart = Date.now();
    const file = await File.findByPk(req.params.id);
    statsd.timing('db.query', Date.now() - dbStart);

    if (!file) {
      logger.warn(`File not found: ${req.params.id}`);
      return res.status(404).json({ error: 'File not found' });
    }

    const s3Key = decodeURIComponent(file.url.replace(`https://${process.env.S3_BUCKET}.s3.amazonaws.com/`, ''));
    const s3Start = Date.now();
    const params = { Bucket: process.env.S3_BUCKET, Key: s3Key };
    const deleteResult = await s3.deleteObject(params).promise();
    statsd.timing('s3.delete', Date.now() - s3Start);

    await file.destroy();
    logger.info(`File deleted: ${req.params.id}`, { s3Key });
    res.status(204).send();
  } catch (error) {
    logger.error('Error in DELETE /v1/file/:id', { error: error.message, stack: error.stack });
    res.status(400).json({ error: 'Failed to delete file', details: error.message });
  }
  statsd.timing('api.delete_file.time', Date.now() - start);
});

// Block unsupported methods for /v1/file
router.get('/', (req, res) => {
    logger.warn('Unsupported GET /v1/file');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.status(400).send();
  });
  
  router.delete('/', (req, res) => {
    logger.warn('Unsupported DELETE /v1/file');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.status(400).send();
  });
  
  router.options('/', (req, res) => {
    logger.warn('Unsupported OPTIONS /v1/file');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.status(405).send();
  });
  
  router.patch('/', (req, res) => {
    logger.warn('Unsupported PATCH /v1/file');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.status(405).send();
  });
  
  router.put('/', (req, res) => {
    logger.warn('Unsupported PUT /v1/file');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.status(405).send();
  });
  
  // Block unsupported methods for /v1/file/{id}
  
  router.options('/:id', (req, res) => {
    logger.warn(`Unsupported OPTIONS /v1/file/${req.params.id}`);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.status(405).send();
  });
  
  router.patch('/:id', (req, res) => {
    logger.warn(`Unsupported PATCH /v1/file/${req.params.id}`);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.status(405).send();
  });
  
  router.put('/:id', (req, res) => {
    logger.warn(`Unsupported PUT /v1/file/${req.params.id}`);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.status(405).send();
  });
  
  router.post('/:id', (req, res) => {
    logger.warn(`Unsupported POST /v1/file/${req.params.id}`);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.status(405).send();
  });

module.exports = router;