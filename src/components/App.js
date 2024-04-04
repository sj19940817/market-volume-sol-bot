import "./App.css";
import Nav from "./Nav";
import Auto from "./Auto";
import Table from "./Table";
import Token from "./Token";
import "bootstrap/dist/css/bootstrap.min.css";
import Manual from "./Manual";
import Position from "./Position";

function App() {
  return (
    <div className="App">
      <Nav />
      <Token />
      <div style={{ display: "flex", justifyCcontent: "left" }}>
        <Auto />
        <Manual />
        <Position />
      </div>
      <Table />
    </div>
  );
}

export default App;
