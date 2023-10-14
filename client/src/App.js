import './App.css';
import GetAuth from './GetAuth';
//import RefineRecs from './RefineRecs';
import ParseUserInput from './ParseUserInput'
import DefaultBody from './ReduxDependentLayout';
import SendToServer from './SendToServer';

function App() {
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
        <DefaultBody />
      </div>
    </div>
  );
}

export default App;
