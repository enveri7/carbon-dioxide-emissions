import React, { Component } from 'react';
import './App.css';
import Selection from "./components/Selection";
import Graph from "./components/Graph";

class App extends Component {

  state = {
    countries: [],
    graphdata: {},
    countrycode: "FIN", // FIN data will be shown first
    percapita: false,
    loading: true
  }

  componentDidMount() {
    this.getCountries();
    this.getEmissionsByCountry(this.state.countrycode);
  }

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
      this.setState({graphdata}, () => {
        if (this.state.loading) {
          this.setState({loading: false});
        }
      });
    }).catch(err => {
    });
  }

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
      this.setState({graphdata});
    }).catch(err => {
    });;
  }

  getCountries = () => {
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
    }).catch(err => {
    });;
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
        <Graph loading={this.state.loading} percapita={this.state.percapita} graphdata={this.state.graphdata} />
      </div>
    );
  }
}

export default App;
