import DisplayRecs from './-DisplayRecs';
import './App.css';
import GetAuth from './GetAuth';
//import RefineRecs from './RefineRecs';
import ParseUserInput from './ParseUserInput'
import SendToServer from './SendToServer';
import { useSelector } from 'react-redux';

function App() {
  const showFeatures = useSelector((state) => state.globalStates.featuresValue);

  return (
    <div className="bg-npurple dark:bg-slate-800 mx-12 font-sans">
      <header className="">
        Playlist Generator
      </header>
      <header className="bg-npurple">
        <GetAuth />
        <ParseUserInput />
      </header>
      <div className="bg-npurple"> 
        {showFeatures ? <SendToServer /> : null}
        <DisplayRecs />
      </div>
    </div>
  );
}

export default App;
