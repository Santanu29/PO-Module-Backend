const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 9000;
const service = require('./services/purchaseQueries');
const xlService = require('./services/xls_edit.js');
const upload = require('./services/pdfSaver.js');

app.use(express.json());
app.use(cors());

// Error handling middleware
// app.use((err, req, res) => {
//   console.error(err.stack);
//   res.sendStatus(500).send('Something went wrong!');
// });

// Upload file for PO orders
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

// Get all PO items
app.get('/getAllItems', async (req, res) => {
  try {
    const data = await service.getAllPO();
    if (Object.keys(data).length !== 0) {
      const newData = service.sortAll(data);
      res.send(newData);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.log(err, 'GetAllItem Function');
  }
});

// Get details of a specific PO item
app.get('/getdetails/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const data = await service.getData(id);
    if (Object.keys(data).length !== 0) {
      const newData = service.sortData(data);
      res.send(newData);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.log(err, 'Getdetails Function');
  }
});

// Insert a new PO item
app.post('/poDetails', async (req, res) => {
  try {
    const data = req.body;
    service.insert(data);
    res.send('Inserted successfully');
  } catch (err) {
    console.log(err, 'Podetails Function');
  }
});

// Update details of a specific PO item
app.patch('/poDetails/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    service.updateData(id, data);
    res.send('Updated successfully.');
  } catch (err) {
    console.log(err, 'podetails Function');
  }
});

// Merge EV data with an Excel file
app.post('/xlData', async (req, res) => {
  try {
    const data = req.body;
    xlService.xls_insert(data);
    res.send('EV Data inserted successfully.');
  } catch (err) {
    console.log(err);
  }
});

// Download Excel file
app.get('/xlData', async (req, res) => {
  try {
    const data = xlService.xldownload();
    res.send(data);
  } catch (err) {
    console.log(err);
  }
});

// Download a file from the server
app.get('/dbFile/:filename', (req, res) => {
  try {
    const fileName = req.params.filename;
    res.download(`./Resources/uploads/${fileName}`);
  } catch (err) {
    console.log(err);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`App running on port ${port}!`);
});
