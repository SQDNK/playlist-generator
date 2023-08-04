import logo from './logo.svg';
import './App.css';
import GetAuth from './GetAuth';
import DisplayRecs from './DisplayRecs';
import RefineRecs from './RefineRecs';
import GetFeaturesFromUserTracks from './GetFeaturesFromUserTracks';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <GetAuth />
        <GetFeaturesFromUserTracks />
        <DisplayRecs />
        <RefineRecs />
      </header>
    </div>
  );
}

export default App;
