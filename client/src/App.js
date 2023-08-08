import logo from './logo.svg';
import './App.css';
import GetAuth from './GetAuth';
import DisplayRecs from './DisplayRecs';
import RefineRecs from './RefineRecs';
import GetFeaturesFromUserTracks from './GetFeaturesFromUserTracks';

function App() {
  return (
    <div class="bg-teal-200 dark:bg-slate-800 ">
      <header class="inline-flex items-center justify-center p-2">
        <GetAuth />
        <GetFeaturesFromUserTracks />
        <DisplayRecs />
        <RefineRecs />
      </header>
    </div>
  );
}

export default App;
