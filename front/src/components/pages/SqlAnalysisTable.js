import React from "react";
import {
  ComposedChart, Bar, XAxis, YAxis, Tooltip,
  Legend, CartesianGrid, PieChart, Pie, Text
} from 'recharts';
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import { config } from '../../config';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

const useStyles = theme => ({
  button: {
    marginLeft: 8,
  },
});

class SqlAnalysisTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [],
      joinedTables: [],
      value: ""
    };
  }

  componentDidMount() {
    const tableId = this.props.table.id;
    this.fetchColumns(tableId);
    this.fetchJoinedTables(tableId);
  }

  fetchColumns(tableId) {
    const url = `${config.API_URL}/tables/${tableId}/columns`;
    axios.get(url).then((res) => {
      console.log(res.data);
      this.setState({ columns: res.data.data });
    });
  }

  fetchJoinedTables(tableId) {
    const url = `${config.API_URL}/tables/${tableId}/joined_tables`;
    axios.get(url).then((res) => {
      console.log(res.data);
      this.setState({ joinedTables: res.data.data });
    });
  }

  createData(name, count) {
    return { name, count };
  }

  fetchColumnRows() {
    return this.state.columns.map((c) => this.createData(c.name, c.access_num));
  }

  fetchJoinedTableRows() {
    return this.state.joinedTables.map((t) => this.createData(t.joined_table_name, t.count));
  }

  handleChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  }

  handleClick = () => {
    const columnName = this.state.value;
    if (columnName.length === 0) return;
    this.createColumn(columnName);
  }

  createColumn = (columnName) => {
    const { table } = this.props;
    const url = `${config.API_URL}/columns`;
    axios.post(url, {
      name: columnName,
      table_id: table.id
    })
    .then(function (res) {
      console.log(res.data);
      window.location.reload();
    })
  }

  deleteTalbe = () => {
    const { table } = this.props;
    const url = `${config.API_URL}/tables/${table.id}`;
    axios.delete(url).then(res => {        
      console.log(res.data);  
      window.location.reload();   
   })
  }

  deleteColumn = (columnNameId) => {
    const url = `${config.API_URL}/columns/${columnNameId}`;
    axios.delete(url).then(res => {        
      console.log(res.data);  
      window.location.reload();   
   })
  }

  pieChartLabel = ({ name, value, cx, x, y }) => {
    const textAnchor = x > cx ? "start" : "end";
    return (
      <>
        <Text x={x} y={y} textAnchor={textAnchor} fill="#ae8dbc">
          {name}
        </Text>
        <Text
          x={x}
          y={y}
          dominantBaseline="hanging"
          textAnchor={textAnchor}
          fill="#ae8dbc"
        >
          {value}
        </Text>
      </>
    );
  }

  createMethodsChartData = (table) => {
    return [
      {
        index: 0,
        name: 'SELECT',
        value: table.select_count,
      },
      {
        index: 1,
        name: 'INSERT',
        value: table.insert_count,
      },
      {
        index: 2,
        name: 'UPDATE',
        value: table.update_count,
      },
      {
        index: 3,
        name: 'DELETE',
        value: table.delete_count,
      }
    ]
  }

  render() {
  const { classes, table } = this.props;
  const columnRows = this.fetchColumnRows();
  const joinedTableRows = this.fetchJoinedTableRows();
  const methodsChartData = this.createMethodsChartData(table);

  return (
      <Grid container key={table.id}>
        <Grid item xs={12}>
          <Box my={3}>
            <Divider variant="middle" />
          </Box>
          <Box m={2}>
            <Typography variant="h4" gutterBottom>
            テーブル名 [ {table.name} ]
          </Typography>
          </Box>
        </Grid>
        <Grid item xs={5}>
          <Box m={3}>
            <Box m={2}>
              <TextField
                id="standard-basic"
                label="新規カラム"
                value={this.state.value}
                onChange={this.handleChange}
              />
              <Button
                className={classes.button}
                variant="contained"
                onClick={() => this.handleClick(table.id)}
              >追加</Button>
              <Button
                className={classes.button}
                variant="outlined"
                color="secondary"
                onClick={() => this.deleteTalbe()}
              >テーブル削除</Button>
            </Box>
            <Box m={2}>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>カラム名</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.columns.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() => this.deleteColumn(row.id)}
                        >削除</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            </Box>

          </Box>
        </Grid>

        <Grid item xs={7}>
          <Box m={2}>
            <Typography variant="h5" gutterBottom>
              WHERE句で使用されたカラム別アクセス数
            </Typography>
            <ComposedChart　　//グラフ全体のサイズや位置、データを指定。場合によってmarginで上下左右の位置を指定する必要あり。
              width={550}  //グラフ全体の幅を指定
              height={280}  //グラフ全体の高さを指定
              layout="vertical" //グラフのX軸とY軸を入れ替え
              data={columnRows}   //Array型のデータを指定
              margin={{top: 20, right: 20, left: 20, bottom: 0}}
            >
              <XAxis  //X軸に関する設定
                type="number" //データタイプをnumberに変更。デフォルトではcategoryになっている
                domain={['dataMin - 100', 'dataMax + 0']} //軸の表示領域を指定
              />
              <YAxis //Y軸に関する設定
                type="category" //データタイプをcategoryに変更
                dataKey="name"  //Array型のデータの、Y軸に表示したい値のキーを指定
              />
              <Tooltip />
              <CartesianGrid  //グラフのグリッドを指定
                stroke="#f5f5f5"  //グリッド線の色を指定
              /> 
              <Bar
                dataKey="count"
                barSize={20}
                stroke="rgba(34, 80, 162, 0.2)"
                fillOpacity={1}
                fill="#c3cfa9"
              />
            </ComposedChart>
          </Box>
        </Grid>

        <Grid item xs={5}>
          <Box m={2}>
            <Typography variant="h5" gutterBottom>
              メソッド別テーブルへのアクセス数
            </Typography>
            <PieChart width={730} height={300}>
              <Pie data={methodsChartData} dataKey="value" cx="200" cy="50%" outerRadius={100} fill="#ae8dbc" label={this.pieChartLabel} isAnimationActive={false}/>
            </PieChart>
          </Box>
        </Grid>

        <Grid item xs={7}>
          <Box m={2}>
            <Typography variant="h5" gutterBottom>
              テーブル別Joinした回数
            </Typography>
            <ComposedChart　　//グラフ全体のサイズや位置、データを指定。場合によってmarginで上下左右の位置を指定する必要あり。
              width={550}  //グラフ全体の幅を指定
              height={280}  //グラフ全体の高さを指定
              layout="vertical" //グラフのX軸とY軸を入れ替え
              data={joinedTableRows}   //Array型のデータを指定
              margin={{top: 20, right: 20, left: 20, bottom: 0}}
            >
              <XAxis  //X軸に関する設定
                type="number" //データタイプをnumberに変更。デフォルトではcategoryになっている
                domain={['dataMin - 100', 'dataMax + 0']} //軸の表示領域を指定
              />
              <YAxis //Y軸に関する設定
                type="category" //データタイプをcategoryに変更
                dataKey="name"  //Array型のデータの、Y軸に表示したい値のキーを指定
              />
              <Tooltip />
              <CartesianGrid  //グラフのグリッドを指定
                stroke="#f5f5f5"  //グリッド線の色を指定
              /> 
              <Bar
                dataKey="count"
                barSize={20}
                stroke="rgba(34, 80, 162, 0.2)"
                fillOpacity={1}
                fill="#b1d7e4"
              />
            </ComposedChart>
          </Box>
        </Grid>

      </Grid>
  );
  }
};

export default withStyles(useStyles)(SqlAnalysisTable);
