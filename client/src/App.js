import logo from './logo.svg';
import './App.css';
import GetAuth from './GetAuth';
import RefineRecs from './RefineRecs';
import GetFeaturesFromUserTracks from './GetFeaturesFromUserTracks';
import DefaultBody from './DefaultBody';

function App() {
  return (
    <>
      <div className="bg-teal-200 dark:bg-slate-800 ">
        <header className="inline-flex items-center justify-center p-2">
          <GetAuth />
          <GetFeaturesFromUserTracks />
          <RefineRecs />
        </header>
      </div>
      <div className="bg-teal-100"> 
        <DefaultBody />
      </div>
    </>
  );
}

export default App;
