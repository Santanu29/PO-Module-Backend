// Entry Point of Api
const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors');

const service = require('./services/purchaseQueries');
const xlService = require('./services/xls_edit.js');
const upload = require('./services/pdfSaver.js');

const port = process.env.PORT || 9000;
app.use(express.json());
app.use(cors());

app.post('/uploadfile', upload.upload, (req, res) => {
  try {
    if (req.file) {
      upload.uploadPdf(req.file);
      return res.sendStatus(200);
    }
  } catch (err) {
    console.error(err);
    return res.sendStatus(500).json({ err: 'something went wrong' });
  }
});

//To get all items
app.get('/getAllItems', async (req, res) => {
  const data = await service.getAllPO();
  if (Object.keys(data).length !== 0) {
    const newData = service.sortAll(data);
    res.send(newData);
  } else res.sendStatus(404);
});

// To get items
app.get('/getdetails/:id', async (req, res) => {
  const id = req.params.id;
  const data = await service.getData(id);
  if (Object.keys(data).length !== 0) {
    const newData = service.sortData(data);
    res.send(newData);
  } else res.sendStatus(404);
});

// To post details
app.post('/poDetails', (req, res) => {
  const data = req.body;
  service.insert(data);
  res.send('inserted');
});

// To Update Details
app.patch('/poDetails/:id', (req, res) => {
  const id = req.params.id;
  const data = req.body;
  //console.log(data);
  service.updateData(id, data);
  res.send('inserted');
});

// To post Details for excel file data
app.post('/xlData', (req, res) => {
  const data = req.body;
  xlService.xls_insert(data);
  res.send('inserted');
});
//To Get Xls download
app.get('/xlData', (req, res) => {
  const data = xlService.xldownload();
  res.send(data);
});

app.get('/dbFile/:filename', (req, res, next) => {
  const fileName = req.params.filename;
  console.log(req.params);
  res.download(`./Resources/uploads/${fileName}`);
});

app.listen(port, () => console.log(`App Running on port ${port}!`));
