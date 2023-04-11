const XLSX = require('xlsx');
const workbook = XLSX.readFile('./Resources/Output.xlsx', {
  cellFormula: true,
  type: 'binary',
  cellDates: true,
  cellStyles: true,
});

const worksheet = workbook.Sheets['JP-M'];

const lastCol = XLSX.utils.decode_range(worksheet['!ref']).e.c;

let Year = {};
for (let i = 1; i <= lastCol; i++) {
  const yearOfCol =
    worksheet[XLSX.utils.encode_cell({ r: 0, c: i })].v.split('-')[1];
  const cellOfCol =
    worksheet[XLSX.utils.encode_cell({ r: 0, c: i })].v.split('-')[0];

  if (!isNaN(yearOfCol)) {
    if (!Year.hasOwnProperty(yearOfCol)) {
      Year[yearOfCol] = [];
    }
    Year[yearOfCol].push(`${cellOfCol}-${yearOfCol}`);
  }
}

console.log(Year);

// const XLSX = require('xlsx');
// const workbook = XLSX.readFile('./Resources/Output.xlsx', {
//   cellFormula: true,
//   type: 'binary',
//   cellDates: true,
//   cellStyles: true,
// });

// const worksheet = workbook.Sheets['JP-M'];
// const lastCol = XLSX.utils.decode_range(worksheet['!ref']).e.c;

// // Extract the year and column headers from the worksheet
// let Year = {};
// for (let i = 1; i <= lastCol; i++) {
//   const header = worksheet[XLSX.utils.encode_cell({ r: 0, c: i })].v.replace(
//     '-',
//     '',
//   );
//   const yearOfCol = header.slice(-2);
//   const cellOfCol = header.slice(0, -2);

//   if (!isNaN(yearOfCol)) {
//     if (!Year.hasOwnProperty(yearOfCol)) {
//       Year[yearOfCol] = [];
//     }
//     Year[yearOfCol].push(header);
//   }
// }

// // Loop through each year and sum the columns
// for (const [year, cols] of Object.entries(Year)) {
//   let total = 0;
//   for (const col of cols) {
//     // Get the column data as an array of cells
//     const colIndex = XLSX.utils.decode_col(col.replace(/-\d{2}$/, ''));
//     const range = XLSX.utils.decode_range(worksheet['!ref']);
//     const colData = [];
//     for (let row = range.s.r + 1; row <= range.e.r; row++) {
//       const address = XLSX.utils.encode_cell({ r: row, c: colIndex });
//       const cell = worksheet[address];
//       if (cell) {
//         if (cell.t === 's') {
//           colData.push(cell.v);
//         } else if (cell.w && !isNaN(cell.w)) {
//           colData.push(parseFloat(cell.w));
//         } else {
//           colData.push(0);
//         }
//       } else {
//         colData.push(0);
//       }
//     }

//     // Sum the column data and add it to the total for this year
//     const colTotal = colData.reduce((acc, val) => acc + val, 0);
//     total += colTotal;
//   }

//   console.log(`Total for ${year}: ${total}`);
// }
// console.log(Year);

// const XLSX = require('xlsx');
// const workbook = XLSX.readFile('./Resources/Output.xlsx', {
//   cellFormula: true,
//   type: 'binary',
//   cellDates: true,
//   cellStyles: true,
// });

// const worksheet = workbook.Sheets['JP-M'];
// const lastCol = XLSX.utils.decode_range(worksheet['!ref']).e.c;

// // Extract the year and column headers from the worksheet
// let Year = {};
// for (let i = 1; i <= lastCol; i++) {
//   const header = worksheet[XLSX.utils.encode_cell({ r: 0, c: i })].v;
//   const yearMatch = header.match(/(\d+)$/);
//   if (yearMatch) {
//     const year = yearMatch[1];
//     if (!Year.hasOwnProperty(year)) {
//       Year[year] = [];
//     }
//     Year[year].push(header);
//   }
// }

// // Loop through each year and sum the columns
// for (const [year, cols] of Object.entries(Year)) {
//   let total = 0;
//   const lastCol = XLSX.utils.decode_range(worksheet['!ref']).e.c;
//   for (const col of cols) {
//     // Get the column data as an array of cells
//     const colIndex = XLSX.utils.decode_col(col.replace(/\d+$/, ''));
//     const range = XLSX.utils.decode_range(worksheet['!ref']);
//     const colData = [];
//     for (let row = 2; row <= lastCol; row++) {
//       const address = XLSX.utils.encode_cell({ r: row, c: colIndex });
//       //   const cell = ;
//       console.log(address);

//       // colData.push(cell.v);
//       // console.log(colData);
//     }

//     // Sum the column data and add it to the total for this year
//     const colTotal = colData.reduce((acc, val) => acc + val, 0);
//     total += colTotal;
//   }

//   console.log(`Total for ${year}: ${total}`);
// }

// const headers = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0];
// let offshoreResources = [];
// let nonOffshoreResources = [];

// for (let i = 2; i <= worksheet['!ref'].split(':')[1].match(/\d+/g)[0]; i++) {
//   const isOffshore = worksheet[`B${i}`].v;
//   if (isOffshore === 'Y') {
//     offshoreResources.push(worksheet[`A${i}`].v);
//   } else if (isOffshore === 'N') {
//     nonOffshoreResources.push(worksheet[`A${i}`].v);
//   }
// }

// const groups = {
//   2022: {},
//   2021: {},
//   2020: {},
//   // Add more years as needed
// };

// for (let i = 0; i <= worksheet['!ref'].split(':')[1].match(/\w+\d+$/)[1]; i++) {
//   const year =
//     worksheet[XLSX.utils.encode_cell({ r: 0, c: i })].v.split('-')[1];

//   for (const resource of offshoreResources) {
//     let totalHours = 0;
//     for (
//       let j = i;
//       j <= worksheet['!ref'].split(':')[1].match(/\w+\d+$/)[1];
//       j++
//     ) {
//       const cellValue =
//         worksheet[XLSX.utils.encode_cell({ r: getRowIndex(resource), c: j })];
//       if (cellValue) {
//         totalHours += cellValue.v;
//       }
//     }

//     if (!groups[year][resource]) {
//       groups[year][resource] = totalHours;
//     } else {
//       groups[year][resource] += totalHours;
//     }
//   }

//   for (const resource of nonOffshoreResources) {
//     let totalHours = 0;
//     for (
//       let j = i;
//       j <= worksheet['!ref'].split(':')[1].match(/\w+\d+$/)[1];
//       j++
//     ) {
//       const cellValue =
//         worksheet[XLSX.utils.encode_cell({ r: getRowIndex(resource), c: j })];
//       if (cellValue) {
//         totalHours += cellValue.v;
//       }
//     }

//     if (!groups[year][resource]) {
//       groups[year][resource] = totalHours;
//     } else {
//       groups[year][resource] += totalHours;
//     }
//   }
// }

// function getRowIndex(resource) {
//   for (let i = 2; i <= worksheet['!ref'].split(':')[1].match(/\d+/g)[0]; i++) {
//     if (worksheet[`A${i}`].v === resource) {
//       return i;
//     }
//   }
// }
// const test1 = () => {
//   for (
//     let i = 1;
//     i <= worksheet['!ref'].split(':')[1].match(/\w+\d+$/)[1];
//     i++
//   ) {
//     const year =
//       worksheet[XLSX.utils.encode_cell({ r: 0, c: i })].v.split('-')[1];
//     console.log(year);
//     for (const resource of offshoreResources) {
//       let totalHours = 0;
//       for (
//         let j = i;
//         j <= worksheet['!ref'].split(':')[1].match(/\w+\d+$/)[1];
//         j++
//       ) {
//         const cellValue =
//           worksheet[XLSX.utils.encode_cell({ r: getRowIndex(resource), c: j })];
//         if (cellValue) {
//           totalHours += cellValue.v;
//         }
//       }

//       if (!groups[year][resource]) {
//         groups[year][resource] = totalHours;
//       } else {
//         groups[year][resource] += totalHours;
//       }
//     }
//   }
// };
// const test = () => {
//   const workbook = XLSX.readFile('./Resources/Output.xlsx', {
//     cellFormula: true,
//     type: 'binary',
//     cellDates: true,
//     cellStyles: true,
//   });

//   const worksheet = workbook.Sheets['JP-M'];

//   const valueD3 =
//     worksheet[XLSX.utils.encode_cell({ r: 0, c: 3 })].v.split('-')[1];

//   const test = valueD3;
//   const lastRow = worksheet['!ref'].split(':')[1];

//   //   console.log(`The value of D3 is ${valueD3}`);
//   //   console.log(`The worksheet has ${lastRow} rows`);

//   const lastCell = worksheet['!ref'].split(':')[1];
//   const lastCol = lastCell.match(/^[A-Z]+/)[0];
//   const lastRowNum = parseInt(lastCell.match(/\d+$/)[0]);
//   const lastColNum = XLSX.utils.decode_col(lastCol);
//   const totalRows = lastRowNum;
//   //   console.log(` ${totalRows} rows ${lastColNum + 1} columns`);

//   let Year = {};
//   for (let i = 1; i <= lastCol; i++) {
//     const yearOfCol = parseInt(
//       worksheet[XLSX.utils.encode_cell({ r: 0, c: i })].v.split('-')[1],
//     );
//     console.log(`Col number A${i + 1} Year is ${yearOfCol}`);
//   }

//   for (let i = 1; i <= lastCol; i++) {
//     const yearOfCol = parseInt(
//       worksheet[XLSX.utils.encode_cell({ r: 0, c: i })].v.split('-')[1],
//     );

//     if (!isNaN(yearOfCol)) {
//       if (!Year.hasOwnProperty(yearOfCol)) {
//         Year[yearOfCol] = [];
//       }
//       Year[yearOfCol].push(i);
//     }
//   }

//   console.log(Year, 'Year');
// };

// console.log(test(), 'u');
