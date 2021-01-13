import React from "react";
import GenericTemplate from "../templates/GenericTemplate";
import axios from 'axios';
import SqlAnalysisTable from './SqlAnalysisTable';
import { config } from '../../config';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

class SqlAnalysisPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tables: [],
      value: ""
    };
  }

  componentDidMount() {
    const url = `${config.API_URL}/tables`;
    axios.get(url).then((res) => {
      console.log(res.data);
      this.setState({ tables: res.data.data });
    });
  }

  handleChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  }

  handleClick = () => {
    const tableName = this.state.value;
    if (tableName.length === 0) return;
    this.createTable(tableName);
  }

  createTable = (tableName) => {
    const url = `${config.API_URL}/tables`;
    axios.post(url, {
      name: tableName
    })
    .then(function (res) {
      console.log(res.data);
      window.location.reload();
    })
  }

  render() {
  const tables = this.state.tables;

  return (
    <GenericTemplate>
      <Box m={1}>
        <TextField
          id="outlined-basic"
          label="新規テーブル"
          variant="outlined"
          value={this.state.value}
          onChange={this.handleChange}
        />
        <Button
          style={{margin: 8}}
          variant="contained"
          onClick={this.handleClick}
        >追加</Button>
      </Box>
    
      {tables.map((table) => (
        <SqlAnalysisTable
          key={table.id}
          table={table}
        />
      ))}
    
    </GenericTemplate>
  );
  }
};

export default SqlAnalysisPage;
