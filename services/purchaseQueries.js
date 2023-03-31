const config = require("../config");

//To Sort the data into json
const sortData = (data) => {
  let details = data.Item.details.L.map(function (listdata) {
    if (listdata.M.raisedAmount !== undefined) {
      const record = {
        description: listdata.M.description.S,
        amount: listdata.M.amount.S,
        raisedAmount: listdata.M.raisedAmount.S,
        dmrNo: listdata.M.dmrNo.S,
      };
      //console.log(record);
      return record;
    } else {
      const record = {
        description: listdata.M.description.S,
        amount: listdata.M.amount.S,
        raisedAmount: "",
        dmrNo: "",
      };
      return record;
    }
  });
  let po = {
    ponumber: data.Item.ponumber.S,
    date: data.Item.date.S,
    details: details,
    filename: data.Item.filename.S,
  };
  return po;
};

//To get Data from DB
const getData = async (id) => {
  const values = {
    TableName: config.podetails,
    Key: {
      ponumber: { S: id },
    },
  };
  const data = await config.dynamodb.getItem(values).promise();
  console.log(data);
  return data;
};

//To post Data into DB
const insert = (data) => {
  var itemslist = data.details.items.map(function (item) {
    var record = {
      M: {
        description: { S: item.po_description },
        amount: { S: item.amount },
      },
    };
    return record;
  });
  const params = {
    TableName: config.podetails,
    Item: {
      ponumber: { S: data.details.po_id },
      details: { L: itemslist },
      date: { S: data.details.date },
      filename: { S: data.details.filename },
    },
  };
  config.dynamodb.putItem(params, (err) => {
    if (err) {
      console.error("Unable to add po details", err);
    }
  });
};

//To Update data in DB
const updateData = (id, data) => {
  var itemslist = data.map(function (item) {
    var record = {
      M: {
        description: { S: item.description },
        amount: { S: item.amount },
        dmrNo: { S: item.dmrNo },
        raisedAmount: { S: item.raisedAmount },
      },
    };
    return record;
  });

  const param = {
    TableName: config.podetails,
    Key: {
      ponumber: { S: id },
    },
    UpdateExpression: "SET #X = :X",
    ExpressionAttributeValues: {
      ":X": { L: itemslist },
    },
    ExpressionAttributeNames: {
      "#X": "details",
    },
  };

  config.dynamodb.updateItem(param, function (err, data) {
    if (err) console.log(err);
  });
};

module.exports = { getData, insert, updateData, sortData };
