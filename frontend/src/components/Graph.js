import React from "react";
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';
import {Grid, Col, Row} from 'react-bootstrap';
import LoadingImage from '../images/loading.gif'

class Graph extends React.Component {

  // prevent re-rendering component multiple times, otherwise you will encounter problems with recharts
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.graphdata !== this.props.graphdata;
  }

  render() {
    const data = this.props.graphdata;
    const error = this.props.error;
    const loading = this.props.loading;

    const modified_data = Object.keys(data).map((key,index) => { // transfer data object to list
      const new_item = {
        year: key,
        emissions: data[key]
      }
      return new_item;
    }).filter(item => {
      return !isNaN(item["year"]) && item["emissions"] ? true : false // filter emission data
    })

    let unit;
    if (this.props.percapita) {
      unit = "metric tons of CO2 per capita";
    } else {
      unit = "kt of CO2";
    }

    let text;
    if (loading) {
      text = (<img src={LoadingImage} width="150" height="150" alt="loading"/>)
    }
    else if (error) {
      text = (
        <div className="alert alert-warning" role="alert">
          {error}
        </div>)
      }
      else if ((modified_data.length === 0)) {
        text = (
          <div className="alert alert-warning" role="alert">
            There is no data available for this selection!
          </div>)
        }

        let show;
        if (modified_data.length > 0) { // if data exists
          show = (
            <Row className="show-grid">
              <Col md={12} align="center">
                <h4 className="">
                  <strong>Unit</strong>: {unit}
                </h4>
                <LineChart width={800} height={350} data={modified_data} margin={{left: 30, bottom: 50}}>
                  <XAxis name="year" dataKey="year"/>
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip/>
                  <Line dot={true} stroke="#8884d8" strokeWidth={2} name="emissions" type="linear" dataKey="emissions" />
                </LineChart>
              </Col>
            </Row>)

          } else {
            show = (
              <Row className="show-grid">
                <Col md={4}></Col>
                <Col md={4} align="center">
                  {text}
                </Col>
                <Col md={4}></Col>
              </Row>
            )
          }

          return (
            <Grid>
              {show}
            </Grid>
          );
        }
      }

      export default Graph;
