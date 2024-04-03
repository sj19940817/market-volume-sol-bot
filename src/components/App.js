import './App.css';
import Nav from './Nav';
import Setting from './Setting';
import Table from './Table';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <Nav />
      <Setting />      
      <Table />
    </div>
  );
}

export default App;
