import logo from './logo.svg';
import './App.css';
import GetAuth from './GetAuth';
import RefineRecs from './RefineRecs';
import GetFeaturesFromUserTracks from './GetFeaturesFromUserTracks';
import DefaultBody from './DefaultBody';

function App() {
  return (
    <div className="bg-teal-200 dark:bg-slate-800 mx-12 font-sans">
      <header className="">
        Playlist Generator
      </header>
      <header className="bg-teal-200">
        <GetAuth />
        <GetFeaturesFromUserTracks />
        <RefineRecs />
      </header>
      <div className="bg-teal-100"> 
        <DefaultBody />
      </div>
    </div>
  );
}

export default App;
