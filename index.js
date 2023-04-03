// Entry Point of Api
require("dotenv").config();
const express = require("express");
const service = require("./services/purchaseQueries");
const xlService = require("./services/xls_edit.js");
const upload = require("./services/pdfSaver.js");
const app = express();
const port = 9000;
const cors = require("cors");

app.use(express.json());

module.exports = app.use(
  cors({
    origin: "http://43.205.78.249:3000/",
  })
);

// To Upload File for PO Orders
app.post("/uploadFile", (req, res) => {
  upload.upload(req, res, (err) => {
    if (err) {
      return res.sendStatus(500);
    }
    return res.sendStatus(200);
  });
});

// To get items

app.get("/getdetails/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await service.getData(id);
    console.log(data);
    if (Object.keys(data).length !== 0) {
      const newData = service.sortData(data);
      res.send(newData);
    } else res.sendStatus(404);
  } catch (e) {
    res.send(e);
  }
});

// To post details
app.post("/poDetails", (req, res) => {
  data = req.body;
  service.insert(data);

  res.send("inserted");
});

// To Update Details
app.patch("/poDetails/:id", (req, res) => {
  const id = req.params.id;
  const data = req.body;
  service.updateData(id, data);
  res.send("inserted");
});

// To post Details for excel file data
app.post("/xlData", (req, res) => {
  data = req.body;
  xlService.xls_insert(data);
  res.send("inserted");
});
//To Get Xls download
app.get("/xlData", (req, res) => {
  const data = xlService.xldownload();
  res.send(data);
});

app.get("/dbFile/:filename", (req, res, next) => {
  const fileName = req.params.filename;
  console.log(req.params);
  res.download(`./Resources/uploads/${fileName}`);
});

app.listen(port, () => console.log(`App Running on port ${port}!`));
