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
      return !isNaN(item["year"]) && item["emissions"] ? true : false
    })

    let graphtitle;
    if (this.props.percapita) {
      graphtitle = "CO2 emissions (metric tons per capita)";
    } else {
      graphtitle = "CO2 emissions (kt)";
    }
    return (
      <Grid>
        <Row className="show-grid">
          <Col md={2}>
          </Col>
          <Col md={8} align="center">
            <div>
              <h2 className="">
                {graphtitle}
              </h2>
            </div>
            <LineChart width={800} height={400} data={modified_data}
              margin={{top: 10, right: 30, left: 30, bottom: 20}}>
              <XAxis name="year" dataKey="year" interval={4} />
              <YAxis />
              <CartesianGrid strokeDasharray="3" />
              <Tooltip/>
              <Line name="emissions" type="linear" dataKey="emissions" />
            </LineChart>
          </Col>
          <Col md={2}>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Graph;
