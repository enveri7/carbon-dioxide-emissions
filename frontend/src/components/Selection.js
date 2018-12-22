import React from "react";

class Selection extends React.Component {

  handleSelectionChange = (e) => {
    console.log(e.target.value);
    this.props.selectionChange(e.target.value);
  };

  handlePercapitaChange = (e) => {
    console.log(e.target.checked);
    this.props.percapitaChange(e.target.checked);
  };

  render() {
    const countries = this.props.countries;
    return (
      <div>
        <form>
          <select onChange={this.handleSelectionChange}>
            {countries && Object.keys(countries).map(key => (
              <option key={key} index={key} value={countries[key]["Country Code"]}>{countries[key]["Country Name"]}</option>
            ))}
          </select>
          <br/>
          <label>
            <input type="checkbox" name="lname" onChange={this.handlePercapitaChange}/>
            Per capita
          </label>
        </form>
      </div>
    );
  }
}

export default Selection;
