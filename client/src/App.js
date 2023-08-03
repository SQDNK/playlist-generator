import logo from './logo.svg';
import './App.css';
import GetAuth from './GetAuth';
import UseUserInput from './UseUserInput';
import DisplayRecs from './DisplayRecs';
import RefineRecs from './RefineRecs';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <GetAuth />
        <UseUserInput />
        <DisplayRecs />
        <RefineRecs />
      </header>
    </div>
  );
}

export default App;
