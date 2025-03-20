const express = require('express');
const { File } = require('../Entities');
const AWS = require('aws-sdk');
const multer = require('multer');
const router = express.Router();

const s3 = new AWS.S3();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('profilePic'), (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: 'Invalid field name. Use "profilePic" as the key' });
  }
  next(err);
}, async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'profilePic required' });
  const fileName = req.file.originalname;
  const s3Key = `${Date.now()}-${fileName}`;
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: s3Key,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };
  try {
    const { Location } = await s3.upload(params).promise();
    const file = await File.create({ file_name: fileName, url: Location });
    res.status(201).json({
      file_name: file.file_name,
      id: file.id,
      url: file.url,
      upload_date: file.upload_date.toISOString().split('T')[0]
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  if (Object.keys(req.query).length > 0) {
    return res.status(400).json({ error: 'query parameters not allowed' });
  }
  const file = await File.findByPk(req.params.id);
  if (!file) return res.status(404).json({ error: 'File not found' });
  res.status(200).json({
    file_name: file.file_name,
    id: file.id,
    url: file.url,
    upload_date: file.upload_date.toISOString().split('T')[0]
  });
});

router.delete('/:id', async (req, res) => {
  if (Object.keys(req.query).length > 0) {
    return res.status(400).json({ error: 'query parameters not allowed' });
  }
  const file = await File.findByPk(req.params.id);
  if (!file) return res.status(404).json({ error: 'File not found' });
    const s3Key = decodeURIComponent(file.url.replace(`https://${process.env.S3_BUCKET}.s3.amazonaws.com/`, ''));
    const params = { Bucket: process.env.S3_BUCKET, Key: s3Key };
    const deleteResult = await s3.deleteObject(params).promise();
    await file.destroy();
  res.status(204).send();
});

// Block unsupported methods for /v1/file
router.get('/', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.status(400).send();
  });
  
  router.delete('/', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.status(400).send();
  });
  
  router.head('/', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.status(405).send();
  });
  
  router.options('/', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.status(405).send();
  });
  
  router.patch('/', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.status(405).send();
  });
  
  router.put('/', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.status(405).send();
  });
  
  // Block unsupported methods for /v1/file/{id}
  router.head('/:id', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.status(405).send();
  });
  
  router.options('/:id', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.status(405).send();
  });
  
  router.patch('/:id', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.status(405).send();
  });
  
  router.put('/:id', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.status(405).send();
  });
  
  router.post('/:id', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.status(405).send();
  });

module.exports = router;