import React from "react";
import {Checkbox, Col, Grid, Row, FormControl} from 'react-bootstrap';

class Selection extends React.Component {

  handleSelectionChange = (e) => {
    this.props.selectionChange(e.target.value);
  };

  handlePercapitaChange = (e) => {
    this.props.percapitaChange(e.target.checked);
  };

  render() {
    const countries = this.props.countries;
    const selected = this.props.countrycode;
    // Country options for select list
    const list = Object.keys(countries).map(key => (
        <option key={key} value={countries[key]["Country Code"]}>{countries[key]["Country Name"]}</option>
      ))

    return (
      <Grid>
        <Row className="show-grid">
          <Col md={4}>
          </Col>
          <Col md={4} align="center">
            <form>
              <FormControl value={selected} className="select-list" onChange={this.handleSelectionChange} componentClass="select" placeholder="select">
                {list}
              </FormControl>
              <Checkbox className="pull-left" onChange={this.handlePercapitaChange}>
                Per capita
              </Checkbox>
            </form>
          </Col>
          <Col md={4}>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Selection;
