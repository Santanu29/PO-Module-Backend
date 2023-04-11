var xlsx = require('xlsx');
const xls_insert = (data) => {
  var wb = xlsx.readFile('./Resources/Output.xlsx', {
    cellFormula: true,
    type: 'binary',
    cellDates: true,
    cellStyles: true,
  });
  var sheetname = wb.SheetNames;

  var ws = wb.Sheets['JP-M'];
  var xls = xlsx.utils.sheet_to_json(ws);

  const secondWorksheetData = data;

  const mergedDataMap = new Map();

  // [firstWorksheetData, secondWorksheetData].forEach((worksheetData) => {
  [xls, secondWorksheetData].forEach((worksheetData) => {
    worksheetData.forEach((row) => {
      const Resource = row['Resource'];
      if (mergedDataMap.has(Resource)) {
        const existingRow = mergedDataMap.get(Resource);
        mergedDataMap.set(Resource, Object.assign(existingRow, row));
      } else {
        mergedDataMap.set(Resource, row);
      }
    });
  });
  const mergedData = Array.from(mergedDataMap.values());

  var newWs = xlsx.utils.json_to_sheet(mergedData);
  var newwb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(newwb, newWs, 'JP-M');

  sheetname.map((sheet) => {
    if (sheet !== 'JP-M') {
      var ws = wb.Sheets[sheet];
      xlsx.utils.book_append_sheet(newwb, ws, sheet);
    }
  });
  xlsx.writeFile(newwb, './Resources/Output.xlsx');
  xlsxUInsert();
};

const dataUpdate = (offshoreTotal, onsiteTotal, YearOffShore, YearOnShore) => {
  console.log('Data Update', offshoreTotal, onsiteTotal);
  const workbook2 = xlsx.readFile('./Resources/Output.xlsx', {
    cellFormula: true,
    type: 'binary',
    cellDates: true,
    cellStyles: true,
  });

  console.log('Year Off Shore', YearOffShore);
  console.log('Year On Site', YearOnShore);

  var sheetname = workbook2.SheetNames;
  const sheetName2 = 'JP-EV';
  const cellAddressOffShore = 'C2';
  const cellAddressOnSite = 'C3';

  const worksheet2 = workbook2.Sheets[sheetName2];

  worksheet2[cellAddressOffShore].v = offshoreTotal;
  worksheet2[cellAddressOnSite].v = onsiteTotal;

  const newWorkbook = xlsx.utils.book_new();
  // worksheet2.E2 = { f: '=SUM(C2*3260)', t: 'n', w: 'JPY' };

  const range = xlsx.utils.decode_range(worksheet2['!ref']);

  // count the number of rows in the range
  const rowCount = range.e.r - range.s.r + 1;
  console.log(rowCount, 'Row Count');
  const headers = xlsx.utils.sheet_to_json(worksheet2, { header: 1 })[0];
  const consumptionsColumnIndex = headers.indexOf('Consumption (JPY)');
  // Loop through the rows and generate the object for the corresponding cell in the "Consumptions" column
  for (let row = 1; row <= rowCount; row++) {
    // Start from row 1 (skip header row)

    const cell = xlsx.utils.encode_cell({ r: row, c: consumptionsColumnIndex });
    const formula = `="JPY"&" "&SUM(C${row + 1}*(REPLACE(D${row + 1},1,4,0)))`;

    worksheet2[cell] = {
      t: 'n',
      f: formula,
    };
  }

  xlsx.utils.book_append_sheet(newWorkbook, worksheet2, sheetName2);

  sheetname.map((sheet) => {
    if (sheet !== 'JP-EV') {
      var ws = workbook2.Sheets[sheet];
      xlsx.utils.book_append_sheet(newWorkbook, ws, sheet);
    }
  });

  xlsx.writeFile(newWorkbook, './Resources/Output.xlsx');
};

const xlsxUInsert = () => {
  const workbook = xlsx.readFile('./Resources/Output.xlsx', {
    cellFormula: true,
    type: 'binary',
    cellDates: true,
    cellStyles: true,
  });

  const sheetName = workbook.SheetNames[0];
  // console.log(sheetName);
  const worksheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(worksheet);
  // console.log(sheetName);

  let offshoreSum = {};
  let onsiteSum = {};

  for (let row of data) {
    for (let i = 2; i < Object.keys(row).length; i++) {
      const colName = Object.keys(row)[i];
      const cellValue = row[colName];
      const cellValueNum = Number(cellValue);

      // Check the value of the cell in the second column (column B)
      const offshore = row['Ofshore'];
      if (offshore === 'Y') {
        if (colName in offshoreSum) {
          offshoreSum[colName] += cellValueNum || 0;
        } else {
          offshoreSum[colName] = cellValueNum || 0;
        }
      } else if (offshore === 'N') {
        if (colName in onsiteSum) {
          onsiteSum[colName] += cellValueNum || 0;
        } else {
          onsiteSum[colName] = cellValueNum || 0;
        }
      }
    }
  }

  const offshoreTotal = Object.values(offshoreSum).reduce(
    (total, value) => total + value,
    0,
  );

  const onsiteTotal = Object.values(onsiteSum).reduce(
    (total, value) => total + value,
    0,
  );

  //Calculation Offshore Monthly Sum
  const YearOffShore = {};
  let month = Object.keys(offshoreSum);
  month.forEach((month) => {
    let year = month.split('-')[1];
    if (!isNaN(year)) {
      if (!YearOffShore.hasOwnProperty(year)) {
        YearOffShore[year] = [];
      }
      YearOffShore[year].push(`${offshoreSum[month]}`);
    }
  });
  //Yearly offsore
  for (const key in YearOffShore) {
    const sum = YearOffShore[key].reduce(
      (acc, val) => acc + parseFloat(val),
      0,
    );
    YearOffShore[key] = sum;
  }
  console.log(YearOffShore);

  //Calculation Offshore Monthly Sum
  const YearOnShore = {};
  let monthOnShore = Object.keys(onsiteSum);
  monthOnShore.forEach((monthOnShore) => {
    let year = monthOnShore.split('-')[1];
    if (!isNaN(year)) {
      if (!YearOnShore.hasOwnProperty(year)) {
        YearOnShore[year] = [];
      }
      YearOnShore[year].push(`${onsiteSum[monthOnShore]}`);
    }
  });
  //Yearly offsore
  for (const key in YearOnShore) {
    const sum = YearOnShore[key].reduce((acc, val) => acc + parseFloat(val), 0);
    YearOnShore[key] = sum;
  }
  console.log(YearOnShore);

  // console.log(`Offshore sum: ${JSON.stringify(offshoreSum)}`);
  // console.log(`Onsite sum: ${JSON.stringify(onsiteSum)}`);

  // console.log('Offshore total sum:', offshoreTotal);
  // console.log('Onsite total sum:', onsiteTotal);

  dataUpdate(offshoreTotal, onsiteTotal, YearOffShore, YearOnShore);

  //UPDATE EXCEL DATA
};
const xldownload = () => {
  var wb = xlsx.readFile('./Resources/Output.xlsx');
  return wb;
};

module.exports = { xls_insert, xldownload, xlsxUInsert };
