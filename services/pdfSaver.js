const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'Resources/uploads');
  },

  filename: (req, file, callback) => {
    callback(null, file.originalname.replace(/\s+/g, '_'));
  },
});
const upload = multer({ storage }).single('file');
module.exports = { upload };
