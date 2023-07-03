import './App.css';
import GetAuth from './GetAuth';
import UseUserInput from './UseUserInput';
import DisplayRecs from './DisplayRecs';
import RefineRecs from './RefineRecs';

function App() {

  // **TODO: use react routers? 
  return (
    <div className="App">
      <GetAuth />
      <UseUserInput />
      <DisplayRecs />
      <RefineRecs />
    </div>
  );
}

export default App;
