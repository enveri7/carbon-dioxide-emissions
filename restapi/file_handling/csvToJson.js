// TODO cron task and remove first useless rows from csv file ja muut turhat rivit csv seasta

const csv = require("csvtojson");
var fs = require("fs");

const testFolder = './data/csv/';

fs.readdir(testFolder, (err, files) => {
  files.forEach(file => {
    console.log(file);
  });
})

let csvFilePath = "./data/csv/API_SP.POP.TOTL_DS2_en_csv_v2_10224786.csv";
let JsonFilePath = "./data/json/population.json";

createJSONfileFromCSVfile(csvFilePath, JsonFilePath);

csvFilePath = "./data/csv/API_EN.ATM.CO2E.KT_DS2_en_csv_v2_10224872.csv";
JsonFilePath = "./data/json/emissions.json";

createJSONfileFromCSVfile(csvFilePath, JsonFilePath);

function createJSONfileFromCSVfile(CSVfilePath, jsonFilePath) {
  csv()
    .fromFile(CSVfilePath)
    .then(jsonObj => {
      console.log(jsonObj);
      const dataString = JSON.stringify(jsonObj);
      fs.writeFile(jsonFilePath, dataString, err => {
        if (err) throw err;
        console.log("The " + jsonFilePath + " has been saved!");
      });
    });
}
