
// Please Enter the file Name in quotes seperated by commas 
// eg :- const xmlFiles = ['firstxml.xml', 'firstxml_copy.xml'];
// Please Note that the files must be present in the same folder as this script.js file 

const xmlFiles = ['firstxml.xml', 'firstxml_copy.xml'];

// Please Enter Required Parent Name Below
// Please be careful it is CASE SENSETIVE
// You can give multiple parents and it's respective children
// eg:-  
//  const parentName = [
//   'FirstParent',
//   'SecondParent',
//   'remain'
// ];

const parentName = [

  'remain',
  'remain',
  'remain'

];

// Please Enter Required Childrens in  quotes seperated by commas
// eg:-  const children = [
//   ["First","Parent", "Children"],
//   ["Second","Parent", "multiple" , "Children"],
//   ["lie","freedom", "powder"],
// ];
// Please be careful it is CASE SENSETIVE

const children = [

  ["lie","freedom", "powder"],
  ["test","freedom", "powder"],
  ["run","freedom", "powder"],

];



const xmlTool = async (parentNames , childrens ) => {

parentNames.map((parentName , index) => {
  const children = childrens[index];

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
  
  if(sheetNumber == 2 || sheetNumber == 420) {
    header.push({id: 'empty', title: ''});
    header.push({id: 'empty', title: ''});
  }

  if(sheetNumber === 420){

    header.push( {id: `pName-${sheetNumber}`, title: `Truth Table`});
    children.map((child, index) => {
    
      const newHeader = {
        id: `${index}-${sheetNumber}`,
        title : `${children[index]}`
      }
      header.push(newHeader);
    });
  }else{
    header.push( {id: `pName-${sheetNumber}`, title: `${parentName}`});
    children.map((child, index) => {
    
      const newHeader = {
        id: `${index}-${sheetNumber}`,
        title : `${children[index]}`
      }
      header.push(newHeader);
    });
}
};

makeHeader(1);
makeHeader(2);
makeHeader(420);


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



// const firstValues = getAllValuesOfKey(parsedData[0], parentName)[0].sort((a, b) => {
//   // Handle cases where the "name" key is empty
//   const nameA = a[`${children[0]}`]? a[`${children[0]}`] : '';
//   const nameB = b[`${children[0]}`] ? b[`${children[0]}`] : '';
  
//   if (nameA < nameB) {
//     return -1;
//   }
//   if (nameA > nameB) {
//     return 1;
//   }
  
//   // If names are the same, sort by age
//   if(children[1]){
//     if (a[`${children[1]}`] < b[`${children[1]}`]) {
//       return -1;
//     }else{
//       return 1;
//     }
//   }
// });

// // console.log("first ", firstValues);
// const secondValues = getAllValuesOfKey(parsedData[1], parentName)[0].sort((a, b) => {
//   // Handle cases where the "name" key is empty
//   const nameA = a[`${children[0]}`]? a[`${children[0]}`] : '';
//   const nameB = b[`${children[0]}`] ? b[`${children[0]}`] : '';
  
//   if (nameA < nameB) {
//     return -1;
//   }
//   if (nameA > nameB) {
//     return 1;
//   }
  
//   // If names are the same, sort by age
//   if(children[1]){
//     if (a[`${children[1]}`] < b[`${children[1]}`]) {
//       return -1;
//     }else{
//       return 1;
//     }
//   }
// });








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
});

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
      const truthObject = {

      }
      let combinedObject = { ...obj1, ...obj2 };
      combinedFoundValues.push(combinedObject);
    }
  }
});

console.log("combined", combinedFoundValues);



// Function to add dynamic keys
const addDynamicKeys = (data) => {
  // Iterate through each object in the array
  data.forEach(obj => {
    // Get all keys ending with '-1'
    const keys = Object.keys(obj).filter(key => key.endsWith('-1'));

    // Iterate through keys and add corresponding dynamic keys
    keys.forEach(key => {
      const index = key.split('-')[0];
      const value1 = obj[key];
      const value2 = obj[`${index}-2`];
      const dynamicKey = `${index}-420`;

      // Add the dynamic key with true or false based on the condition
      obj[dynamicKey] = value1 === value2;
    });
  });

  return data;
}

const truthTableCombined = addDynamicKeys(combinedFoundValues);
const truthTableMissing0_1 = addDynamicKeys(missingValues0_1);
const truthTableMissing0_2 = addDynamicKeys(missingValues0_2);



const newRecords = [
  ...truthTableMissing0_1,
  ...truthTableMissing0_2,
  ...truthTableCombined,
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
  },
  {},
  {}
];


const csvWriter = createCsvWriter({
    path: `output/${fileName}`,
    header: header,
});
 
csvWriter.writeRecords(newRecords)      
    .then(() => {
        console.log(`...Done. You can view the file in "output" folder with filename:- ${fileName}.csv`);
    });

});

}


 xmlTool(parentName, children)