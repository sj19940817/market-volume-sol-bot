import "./App.css";
import Nav from "./Nav/Nav";
import Auto from "./Auto/Auto";
import Table from "./Table";
import Token from "./Token/Token";
import "bootstrap/dist/css/bootstrap.min.css";
import Manual from "./Manual/Manual";
import Position from "./Position/Position";
import { useState } from "react";

function App() {
  const [tokenaddress, setTokenAddress] = useState(
    "HLptm5e6rTgh4EKgDpYFrnRHbjpkMyVdEeREEa2G7rf9"
  );
  const [fetchCount, setFetchCount] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [closelist, setCloseList] = useState([]);

  return (
    <div className="App">
      <Nav />
      <Token tokenaddress={tokenaddress} setTokenAddress={setTokenAddress} />
      <div style={{ display: "flex", justifyCcontent: "left" }}>
        <Auto tokenaddress={tokenaddress} setFetchCount={setFetchCount} />
        <Manual tokenaddress={tokenaddress} setFetchCount={setFetchCount} />
        <Position
          tableData={tableData}
          tokenaddress={tokenaddress}
          setFetchCount={setFetchCount}
        />
      </div>
      <Table
        tokenaddress={tokenaddress}
        tableData={tableData}
        setTableData={setTableData}
        closelist={closelist}
        setCloseList={setCloseList}
        fetchCount={fetchCount}
      />
    </div>
  );
}

export default App;
