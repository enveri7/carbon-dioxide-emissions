import React, { Component } from 'react';
import './App.css';
import Selection from "./components/Selection";
import Graph from "./components/Graph";

class App extends Component {

  state = {
    countries: [], // Available countries
    graphdata: {}, // Graph data
    countrycode: "FIN", // FIN data will be fetched when opening app for the first time
    percapita: false, // Get graph data per capita
    loading: true, // Is app loading
    error: "" // Error message
  }

  // Get data from restapi
  componentDidMount() {
    this.getCountries();
    this.getEmissionsByCountry(this.state.countrycode);
  }

  // Get emission data by country
  getEmissionsByCountry = () => {
    fetch("http://localhost:8080/emissions/" + this.state.countrycode)
    .then((response, err) => {
      if (response.ok) {
        return response;
      } else {
        throw err;
      }
    })
    .then(data => data.json())
    .then(graphdata => {
      this.setState({graphdata, error: ""}, () => {
        if (this.state.loading) {
          this.setState({loading: false});
        }
      });
    }).catch(err => {
      this.setState({graphdata: {}, error: "Could not fetch data."}, () => {
        if (this.state.loading) {
          this.setState({loading: false});
        }
      });
    });
  }

  // Get emission data per capita
  getEmissionsPerCapita = () => {
    fetch("http://localhost:8080/emissions/" + this.state.countrycode + "/percapita")
    .then((response, err) => {
      if (response.ok) {
        return response;
      } else {
        throw err;
      }
    })
    .then(data => data.json())
    .then(graphdata => {
      this.setState({graphdata, error: ""});
    }).catch(err => {
      this.setState({graphdata: {}, error: "Could not fetch data."});
    });

  }

  // Get all available countries
  getCountries = () => {
    this.setState({error: ""});
    fetch("http://localhost:8080/countries/")
    .then((response, err) => {
      if (response.ok) {
        return response;
      } else {
        throw err;
      }
    })
    .then(data => data.json())
    .then(countries => {
      countries.sort(function(a,b) {return (a["Country Name"] > b["Country Name"]) ? 1 : ((b["Country Name"] > a["Country Name"]) ? -1 : 0);} );
      this.setState({countries});
    }).catch(err => {});
  }

  updateGraphData = () => {
    if (this.state.percapita) {
      this.getEmissionsPerCapita();
    } else {
      this.getEmissionsByCountry();
    }
  }

  selectionChange = (countrycode) => {
    this.setState({countrycode}, this.updateGraphData);
  }

  percapitaChange = (value) => {
    this.setState({percapita: value}, this.updateGraphData);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h2>
            CO2 emissions
          </h2>
        </header>
        <Selection countrycode={this.state.countrycode} countries={this.state.countries} percapitaChange={this.percapitaChange} selectionChange={this.selectionChange}/>
        <Graph error={this.state.error} loading={this.state.loading} percapita={this.state.percapita} graphdata={this.state.graphdata} />
      </div>
    );
  }
}

export default App;
