import React from "react";
import {Checkbox, Col, Grid, Row, FormControl} from 'react-bootstrap';

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
      <Grid>
        <Row className="show-grid">
          <Col md={4}>
          </Col>
          <Col md={4} align="center">
            <form>
              <FormControl className="select-list" onChange={this.handleSelectionChange} componentClass="select" placeholder="select">
                {countries && Object.keys(countries).map(key => (
                  <option key={key} index={key} value={countries[key]["Country Code"]}>{countries[key]["Country Name"]}</option>
                ))}
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
