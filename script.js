
// Please Enter the file Name in quotes seperated by commas 
// eg :- const xmlFiles = ['firstxml.xml', 'firstxml_copy.xml'];
// Please Note that the files must be present in the same folder as this script.js file 

const xmlFiles = ['firstxml.xml', 'firstxml_copy.xml'];

// Please Enter Required Parent Name Below
// Please be careful it is CASE SENSETIVE

const parentName = 'remain';

// Please Enter Required Childrens in  quotes seperated by commas
// eg:-  const children = ['lie',"freedom", "powder"];
// Please be careful it is CASE SENSETIVE
const children = ['lie',"freedom", ];





const fileName = `${parentName}_${children[0]}.csv`


const childrenLength = children.length;
const header = [];
const records = [];


const fs = require('fs');
const xml2js = require('xml2js');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;


const parser = new xml2js.Parser({
  explicitArray: false,
});


const parsedData = [];

xmlFiles.forEach((file) => {
  const xmlData = fs.readFileSync(file, 'utf-8');
  parser.parseString(xmlData, (err, result) => {
    if (err) {
      console.error('Error parsing XML:', err);
    } else {
      parsedData.push(result);
    }
  });
});

const getAllValuesOfKey = (jsonData, key) => {
  // Create an empty array to store the values of the key.
  const values = [];

  // Recursively search for the key in the JSON data and add its values to the array.
  const searchForKey = (jsonData) => {
    for (const nestedKey in jsonData) {
      const nestedValue = jsonData[nestedKey];
      if (nestedKey === key) {
        values.push(nestedValue);
      } else if (typeof nestedValue === 'object') {
        searchForKey(nestedValue);
      }
    }
  }

  // Start the recursive search.
  searchForKey(jsonData);

  // Return the array of values.
  return values;
}



const makeHeader = (sheetNumber) => {
  if(sheetNumber == 2) {
    header.push({id: 'empty', title: ''});
    header.push({id: 'empty', title: ''});
  }
  header.push( {id: `pName-${sheetNumber}`, title: `${parentName}`});
  children.map((child, index) => {
  
    const newHeader = {
      id: `${index}-${sheetNumber}`,
      title : `${children[index]}`
    }
    header.push(newHeader);
  });
};

makeHeader(1);
makeHeader(2);


const makeRecord = (parentInstance, sheetNumber, secondInstance, secondSheet) => {
  const newRecord = {};
  if (typeof (parentInstance) === typeof {}){
    newRecord[`pName-${sheetNumber}`] = parentName;
  }else {
    newRecord[`pName-${sheetNumber}`] = parentInstance;
  }
  
  children.map((child , index) => {
    newRecord[`${index}-${sheetNumber}`] = parentInstance[child] ? parentInstance[child] : "NOT FOUND"
  })

  records.push(newRecord)

  const secondRecord = {}

  if (typeof (secondInstance) === typeof {}){
    secondRecord[`pName-${secondSheet}`] = parentName;
  }else {
    secondRecord[`pName-${secondSheet}`] = secondInstance;
  }

  children.map((child , index) => {
    secondRecord[`${index}-${secondSheet}`] = secondInstance[child] ? secondInstance[child] : "NOT FOUND" ;
  })

  records.push(secondRecord)
};

const firstValues = getAllValuesOfKey(parsedData[0], parentName).sort((a, b) => {
  // Handle cases where the "name" key is empty
  const nameA = a[`${children[0]}`]? a[`${children[0]}`] : '';
  const nameB = b[`${children[0]}`] ? b[`${children[0]}`] : '';
  
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  
  // If names are the same, sort by age
  if(children[1]){
    if (a[`${children[1]}`] < b[`${children[1]}`]) {
      return -1;
    }else{
      return 1;
    }
  }
});

// console.log("first ", firstValues);
const secondValues = getAllValuesOfKey(parsedData[1], parentName).sort((a, b) => {
  // Handle cases where the "name" key is empty
  const nameA = a[`${children[0]}`]? a[`${children[0]}`] : '';
  const nameB = b[`${children[0]}`] ? b[`${children[0]}`] : '';
  
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  
  // If names are the same, sort by age
  if(children[1]){
    if (a[`${children[1]}`] < b[`${children[1]}`]) {
      return -1;
    }else{
      return 1;
    }
  }
});;

const firstLength = firstValues.length
const secondLength = secondValues.length

if(firstLength > secondLength) {
    firstValues.map((parentInstance, index) => {
    const secondInstance = secondValues[index] ? secondValues[index] : "NOT FOUND"
      makeRecord(parentInstance, 1, secondInstance, 2);
  })
}else {
    secondValues.map((parentInstance, index) => {
    const secondInstance = firstValues[index] ? firstValues[index] : "NOT FOUND"
      makeRecord(secondInstance, 1, parentInstance, 2);
  })
}

// const groupedRecords = {};

// // Group records by pName and sheet number
// records.forEach(record => {
//   const keys = Object.keys(record);
//   const sheetNumber = keys.find(key => key.startsWith('0-'));
//   if (sheetNumber) {
//     const pName = record[`pName-${sheetNumber.split('-')[1]}`];
//     if (!groupedRecords[pName]) {
//       groupedRecords[pName] = [];
//     }
//     groupedRecords[pName].push(record);
//   }
// });

// const finalObjects = [];

// Object.keys(groupedRecords).forEach(pName => {
//   const sheet1Objects = groupedRecords[pName].filter(record => record['0-1']);
//   const sheet2Objects = groupedRecords[pName].filter(record => record['0-2']);

//   sheet1Objects.forEach(sheet1Obj => {
//     const correspondingSheet2Obj = sheet2Objects.find(sheet2Obj => sheet2Obj['0-2'] === sheet1Obj['0-1']);
//     if (correspondingSheet2Obj) {
//       // Matching objects
//       const finalObject = {
//         'pName-1': sheet1Obj['pName-1'],
//         '0-1': sheet1Obj['0-1'],
//         '1-1': sheet1Obj['1-1'],
//         '2-1': sheet1Obj['2-1'],
//         'pName-2': correspondingSheet2Obj['pName-2'],
//         '0-2': correspondingSheet2Obj['0-2'],
//         '1-2': correspondingSheet2Obj['1-2'],
//         '2-2': correspondingSheet2Obj['2-2']
//       };
//       finalObjects.push(finalObject);
//     } else {
//       // Non-matching object in sheet2
//       const nonMatchingObject = {
//         'pName-1': 'NOT FOUND',
//         '0-1': 'NOT FOUND',
//         '1-1': 'NOT FOUND',
//         '2-1': 'NOT FOUND',
//         'pName-2': sheet1Obj['pName-1'],
//         '0-2': sheet1Obj['0-1'],
//         '1-2': sheet1Obj['1-1'],
//         '2-2': sheet1Obj['2-1']
//       };
//       finalObjects.push(nonMatchingObject);
//     }
//   });

//   sheet2Objects.forEach(sheet2Obj => {
//     const correspondingSheet1Obj = sheet1Objects.find(sheet1Obj => sheet1Obj['0-1'] === sheet2Obj['0-2']);
//     if (!correspondingSheet1Obj) {
//       // Non-matching object in sheet1
//       const nonMatchingObject = {
//         'pName-1': sheet2Obj['pName-2'],
//         '0-1': sheet2Obj['0-2'],
//         '1-1': sheet2Obj['1-2'],
//         '2-1': sheet2Obj['2-2'],
//         'pName-2': 'NOT FOUND',
//         '0-2': 'NOT FOUND',
//         '1-2': 'NOT FOUND',
//         '2-2': 'NOT FOUND'
//       };
//       finalObjects.push(nonMatchingObject);
//     }
//   });
// });

// // console.log( "groupedRecords",finalObjects);
// console.log("groupedRecords", groupedRecords);


const objectsWith0_1 = records.filter(obj => '0-1' in obj);
const objectsWith0_2 = records.filter(obj => '0-2' in obj);

const foundValues = []
const combinedFoundValues = []
const missingValues0_1 = [];
const missingValues0_2 = [];

objectsWith0_1.forEach(obj1 => {
  if (obj1['0-1'] !== 'NOT FOUND') {
    const found = objectsWith0_2.some(obj2 => obj2['0-2'] === obj1['0-1']);
    if (!found) {
      const newObj = Object.fromEntries(
        Object.keys(obj1).map(str => [str.replace(/-1/g, "-2"), "NOT FOUND"])
      );
      missingValues0_2.push({ 
        ...newObj ,
        ...obj1 , 
      });
    }else{
      foundValues.push(obj1);
    }
  }
});

objectsWith0_2.forEach(obj2 => {
  if (obj2['0-2'] !== 'NOT FOUND') {
    const found = objectsWith0_1.some(obj1 => obj1['0-1'] === obj2['0-2']);
    if (!found) {
      const newObj = Object.fromEntries(
        Object.keys(obj2).map(str => [str.replace(/-2/g, "-1"), "NOT FOUND"])
      );
      missingValues0_1.push({ 
        ...newObj ,
        ...obj2 , 
      });
    }else{
      foundValues.push(obj2);
    }
  }
});


foundValues.map(obj1 => {
  if (obj1['0-1']) {
    let obj2 = foundValues.find(obj => obj['0-2'] === obj1['0-1']);
    if (obj2) {
      let combinedObject = { ...obj1, ...obj2 };
      combinedFoundValues.push(combinedObject);
    }
  }
});


const newRecords = [
  ...missingValues0_1,
  ...missingValues0_2,
  ...combinedFoundValues,
  {},
  {},
  {
    'pName-1': 'Common Occurrence in both shets',
    '0-1': `${combinedFoundValues.length}`
  },
  {
    'pName-1': 'Sheet 1 Occurrence that are not present in Sheet 2',
    '0-1': `${missingValues0_2.length}`
  },
  {
    'pName-1': 'Total Occurrence in Sheet 1',
    '0-1': `${missingValues0_2.length + combinedFoundValues.length}`
  },
  {
    'pName-1': 'Sheet 2 Occurrence that are not present in Sheet 1',
    '0-1': `${missingValues0_1.length}`
  },
  {
    'pName-1': 'Total Occurrence in Sheet 2',
    '0-1': `${missingValues0_1.length + combinedFoundValues.length}`
  }
];


const csvWriter = createCsvWriter({
    path: `output/${fileName}`,
    header: header,
});
 
csvWriter.writeRecords(newRecords)      
    .then(() => {
        console.log(`...Done. You can view the file in "output" folder with filename:- ${fileName}.csv`);
    });
