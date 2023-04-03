const config = require('../config');

//To fetch All
const getAllPO = async () => {
  const params = {
    TableName: 'podetails',
  };
  const po = await config.dynamodb.scan(params).promise();
  return po;
};

//To Sort all data
const sortAll = (data) => {
  let po;
  var allData = data.Items.map(function (Item) {
    console.log(Item);
    po = {
      ponumber: Item.ponumber.S,
      date: Item.date.S,
      details: Item.details.L,
      poname: Item.poname.S,
      projectName: Item.projectName.S,
      filename: Item.filename.S,
    };
    return po;
  });
  return allData;
};
//To Sort the data into json
const sortData = (data) => {
  let details = data.Item.details.L.map(function (listdata) {
    if (listdata.M.raisedAmount !== undefined) {
      const record = {
        description: listdata.M.description.S,
        amount: listdata.M.amount.S,
        raisedAmount: listdata.M.raisedAmount.S,
        dmrNo: listdata.M.dmrNo.S,
        date: listdata.M.date.S,
      };
      //console.log(record);
      return record;
    } else {
      const record = {
        description: listdata.M.description.S,
        amount: listdata.M.amount.S,
        raisedAmount: '',
        dmrNo: '',
        date: '',
      };
      return record;
    }
  });
  let po = {
    ponumber: data.Item.ponumber.S,
    date: data.Item.date.S,
    details: details,
    poname: data.Item.poname.S,
    projectName: data.Item.projectName.S,
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
  return data;
};

//To get Data from DB
// const getAllData = () => {
//   const values = {
//     TableName: config.podetails,
//   };
//   const data = config.dynamodb.scan(values).promise();
//   return JSON.stringify(data);
// };

const scanTable = async () => {
  const params = {
    TableName: config.podetails,
  };
  const scanResults = [];
  do {
    items = await config.dynamodb.scan(params).promise();
    items.Items.forEach((item) => scanResults.push(item));
  } while (typeof items.LastEvaluatedKey !== 'undefined');
  return scanResults;
};
//To post Data into DB
const insert = (data) => {
  var itemslist = data.details.items.map(function (item) {
    var record = {
      M: {
        description: { S: item.po_description },
        amount: { S: item.amount },
        date: { S: item.date },
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
      poname: { S: data.details.poname },
      projectName: { S: data.details.projectName },
      filename: { S: data.details.filename },
    },
  };

  config.dynamodb.putItem(params, (err) => {
    if (err) {
      console.error('Unable to add po details', err);
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
        date: { S: item.date },
      },
    };
    return record;
  });

  const param = {
    TableName: config.podetails,
    Key: {
      ponumber: { S: id },
    },
    UpdateExpression: 'SET #X = :X',
    ExpressionAttributeValues: {
      ':X': { L: itemslist },
    },
    ExpressionAttributeNames: {
      '#X': 'details',
    },
  };

  config.dynamodb.updateItem(param, function (err, data) {
    if (err) console.log(err);
  });
};

module.exports = {
  getData,
  insert,
  updateData,
  sortData,
  scanTable,
  getAllPO,
  sortAll,
};
