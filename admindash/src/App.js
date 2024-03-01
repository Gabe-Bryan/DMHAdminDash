import './App.css';
import DashboardTabs from './DashboardTabs';

function App() {

    return (
      <>
      {/* <SongDataTable/>
      <SoundtrackDataTable/> */}
      
      <div style={{margin: '0em 2em'}}>
        <h1>[Destiny Music Hub] -- Admin Dashboard: </h1>
        <DashboardTabs />
      </div>
      </>
    )
  
}

export default App;
