const request = require('request');
const unzip = require('unzip');
var fs = require("fs");

try {
  // Move old files to separate folder
  fs.rename('./data/csv/', `./data/old/${new Date()}`, (err) => {
    if (err) {
      if (err.code === 'ENOENT') {
        console.log('./data/csv/ not found, cannot rename.');
      } else {
        throw err;
      }
    } else {
      console.log(`folder /data/csv/ moved to /data/old/${new Date()}`);
    }

    // Create new csv folder
    fs.mkdir('./data/csv/', { recursive: true }, (err) => {
      if (err) throw err;

      // Get population data from worldbank and unzip it to /data/csv/new folder
      request('http://api.worldbank.org/v2/en/indicator/SP.POP.TOTL?downloadformat=csv').pipe(unzip.Extract({ path: './data/csv/' }));

      // Get emissions data from worldbank and unzip it to /data/csv/new folder
      request('http://api.worldbank.org/v2/en/indicator/EN.ATM.CO2E.KT?downloadformat=csv').pipe(unzip.Extract({ path: './data/csv/' }));
      console.log("/data/csv folder created and files are unzipped in it.")
    });

  });
} catch (error) {
  console.log(error);
}
