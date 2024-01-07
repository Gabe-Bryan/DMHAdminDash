import AddSoundtrackForm from './AddSoundtrackForm';
import SoundtrackFormButton from './AddSoundtrackForm';
import './App.css';
import SongDataTable from './SongDataTable';
import SoundtrackDataTable from './SoundtrackDataTable';
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
