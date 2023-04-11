const multer = require('multer');
const { credentials } = require('../config');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const uploadPdf = (file, id) => {
  console.log('hello');
  const params = {
    Bucket: credentials.bucketName,
    Key: file.originalname,
    Body: file.buffer,
    ACL: 'public-read-write',
  };

  s3.upload(params, async (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log('file uploaded successfully', data.Location);
    }
  });
};

const storage = multer.memoryStorage({
  destination: (req, file, callback) => {
    // callback(null, "Resources/uploads");
    callback(null, '');
  },

  filename: (req, file, callback) => {
    callback(null, file.originalname.replace(/\s+/g, '_'));
  },
});
const upload = multer({ storage }).single('file');

module.exports = { upload, uploadPdf };
