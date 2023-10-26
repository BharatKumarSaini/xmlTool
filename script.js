
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
const children = ['lie',"freedom", "powder"];



const fileName = `${parentName}_${children[0]}.csv`

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
  header.push( {id: `pName-${sheetNumber}`, title: 'PNAME'});
  children.map((child, index) => {
  
    const newHeader = {
      id: `${index}-${sheetNumber}`,
      title : `${index}C`
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


  if (typeof (secondInstance) === typeof {}){
    newRecord[`pName-${secondSheet}`] = parentName;
  }else {
    newRecord[`pName-${secondSheet}`] = secondInstance;
  }

  children.map((child , index) => {
    newRecord[`${index}-${secondSheet}`] = secondInstance[child] ? secondInstance[child] : "NOT FOUND" ;
  })

  records.push(newRecord)
};

const firstValues = getAllValuesOfKey(parsedData[0], parentName);
const secondValues = getAllValuesOfKey(parsedData[1], parentName);

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

const csvWriter = createCsvWriter({
    path: `output/${fileName}`,
    header: header,
});
 
csvWriter.writeRecords(records)      
    .then(() => {
        console.log(`...Done. You can view the file in "output" folder with filename:- ${fileName}.csv`);
    });
