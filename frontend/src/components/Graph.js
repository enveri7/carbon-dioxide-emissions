import React from "react";
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

class Graph extends React.Component {

  render() {
    const data = this.props.graphdata;
    const modified_data = Object.keys(data).map((key,index) => {
      const new_item = {
        name: key,
        emissions: data[key]
      }
      return new_item;
    }).filter(item => {
      return !isNaN(item["name"]) && item["emissions"] ? true : false
    })

    return (
      <div>
        <LineChart width={850} height={500} data={modified_data}
          margin={{top: 20, right: 30, left: 20, bottom: 30}}>
          <XAxis dataKey="name" interval={4} />
          <YAxis />
          <CartesianGrid strokeDasharray="3" />
          <Tooltip/>
          <Legend />
          <Line type="linear" dataKey="emissions" />
        </LineChart>
      </div>
    );
  }
}

export default Graph;
