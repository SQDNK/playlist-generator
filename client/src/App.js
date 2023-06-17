import './App.css';
import DisplayRecs from './DisplayRecs';
import GetAuth from './GetAuth';

function App() {

  // **TODO: use react routers? 
  return (
    <div className="App">
      <GetAuth />
      <DisplayRecs />
    </div>
  );
}

export default App;
