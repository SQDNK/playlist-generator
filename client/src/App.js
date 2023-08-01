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
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
