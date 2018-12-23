import React from "react";
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';
import {Grid, Col, Row} from 'react-bootstrap';

class Graph extends React.Component {

  render() {
    const data = this.props.graphdata;
    const modified_data = Object.keys(data).map((key,index) => {
      const new_item = {
        year: key,
        emissions: data[key]
      }
      return new_item;
    }).filter(item => {
      return !isNaN(item["year"]) && item["emissions"] ? true : false // we filter emission data out of original data
    })

    console.log(modified_data);

    let graphtitle;
    if (this.props.percapita) {
      graphtitle = "CO2 emissions (metric tons per capita)";
    } else if (modified_data.length === 0) {
      graphtitle = "";
    } else {
      graphtitle = "CO2 emissions (kt)";
    }

    let graph;
    if (modified_data.length > 0) {
      graph = (
        <Row className="show-grid">
          <Col md={12} align="center">
            <h2 className="">
              {graphtitle}
            </h2>
            <LineChart width={800} height={350} data={modified_data} margin={{left: 30}}>
              <XAxis name="year" dataKey="year" interval={4} />
              <YAxis />
              <CartesianGrid strokeDasharray="3" />
              <Tooltip/>
              <Line name="emissions" type="linear" dataKey="emissions" />
            </LineChart>
          </Col>
        </Row>)
      } else {
        graph = (
          <Row className="show-grid">
            <Col md={4}></Col>
            <Col md={4} align="center">
              <div className="alert alert-warning" role="alert">
                There is no data available for this selection!
              </div>
            </Col>
            <Col md={4}></Col>
          </Row>
        )
      }
      return (
        <Grid>
          {graph}
        </Grid>
      );
    }
  }

  export default Graph;
