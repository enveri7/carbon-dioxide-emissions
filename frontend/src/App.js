import React, { Component } from 'react';
import './App.css';
import Selection from "./components/Selection";
import Graph from "./components/Graph";

class App extends Component {

  state = {
    countries: [],
    graphdata: {},
    countrycode: "FIN",
    percapita: false
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
      this.setState({graphdata});
    });
  }

  getEmissionsPerCapita = () => {
    fetch("http://localhost:8080/emissions/" + this.state.countrycode +"/percapita")
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
    });
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
      this.setState({countries});
    });
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
          <p>
            CO2 emissions
          </p>
        </header>
        <Selection countries={this.state.countries} percapitaChange={this.percapitaChange} selectionChange={this.selectionChange}/>
        <Graph percapita={this.state.percapita} graphdata={this.state.graphdata} />
      </div>
    );
  }
}

export default App;
