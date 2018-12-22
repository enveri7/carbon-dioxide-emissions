const emissions = require("../data/json/emissions.json");
const population = require("../data/json/population.json");

const router = function(app) {
  app.get("/", function(req, res) {
    res.status(200).send("Welcome to our restful API");
  });

  // Get all countries
  app.get("/countries", (req, res) => {
    const countries = emissions.map(data => {
      const returnObject = {
        "Country Name": data["Country Name"],
        "Country Code": data["Country Code"]
      };
      return returnObject;
    });

    if (countries.length > 0) {
      res.status(200).send(countries);
    } else {
      res.status(404).send();
    }
  });

  // Get emiissions by country
  app.get("/emissions/:countrycode", (req, res) => {
    const country_code = req.params.countrycode;

    const country_emissions = emissions.filter(data => {
      return data["Country Code"].toLowerCase() == country_code.toLowerCase()
        ? true
        : false;
    });

    if (country_emissions.length == 1) {
      res.status(200).send(country_emissions[0]);
    } else {
      res.status(404).send();
    }
  });

  // Get emissions by country per capita
  app.get("/emissions/:countrycode/percapita", (req, res) => {
    const country_code = req.params.countrycode;

    const country_emissions = emissions.filter(data => {
      return data["Country Code"].toLowerCase() == country_code.toLowerCase()
        ? true
        : false;
    });

    const country_population = population.filter(data => {
      return data["Country Code"].toLowerCase() == country_code.toLowerCase()
        ? true
        : false;
    });

    if (country_emissions.length == 1 && country_population.length == 1) {
      const emissions_per_capita = calculateEmissionsPerCapita(
        country_emissions[0],
        country_population[0]
      );
      res.status(200).send(emissions_per_capita);
    } else {
      res.status(404).send();
    }
  });
};

function calculateEmissionsPerCapita(country_emissions, country_population) {
  const current_year = new Date().getFullYear();

  let country_emissions_percapita = {
    "Country Name": country_emissions["Country Name"],
    "Country Code": country_emissions["Country Code"],
    "Country Indicator": "CO2 emissions per capita (metric tons)"
  };

  for (let i = 1960; i <= current_year; i++) {
    let yearly_emissions = country_emissions[i.toString()];
    let yearly_population = country_population[i.toString()];

    if (yearly_emissions && yearly_population) {
      let yearly_emissions_percapita = (
        (yearly_emissions * 1000) /
        yearly_population
      ).toFixed(3);
      country_emissions_percapita[i.toString()] = yearly_emissions_percapita;
    } else {
    }
  }
  return country_emissions_percapita;
}

module.exports = router;
