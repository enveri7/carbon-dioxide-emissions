const csv = require("csvtojson");
var fs = require("fs");

fs.readdir("./data/csv/", (err, files) => {
  files.forEach(file => {
    if (file.includes("API_EN.ATM.CO2E") && !file.includes("Metadata")) {
      let JsonFilePath = "./data/json/emissions.json";
      let csvFilePath = `./data/csv/${file}`
      createJSONfileFromCSVfile(csvFilePath, JsonFilePath);
    } else if (file.includes("API_SP.POP.TOTL") && !file.includes("Metadata")) {
      let JsonFilePath = "./data/json/population.json";
      let csvFilePath = `./data/csv/${file}`
      createJSONfileFromCSVfile(csvFilePath, JsonFilePath);
    }
  });
})

function createJSONfileFromCSVfile(CSVfilePath, jsonFilePath) {
  csv()
    .fromFile(CSVfilePath)
    .then(jsonObj => {
      console.log(jsonObj);
      const dataString = JSON.stringify(jsonObj);
      fs.writeFile(jsonFilePath, dataString, err => {
        if (err) throw err;
        console.log("The file has been saved!");
      });
    });
}
