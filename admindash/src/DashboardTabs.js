import React from 'react'
import { Tabs } from 'antd'

import SongDataTable from './SongDataTable';
import SoundtrackDataTable from './SoundtrackDataTable';

const onChange = (key) => {
  //console.log(key);
};

const items = [
  {
    key: '1',
    label: 'Songs',
    children: (<SongDataTable />)
  },
  {
    key: '2',
    label: 'Soundtracks',
    children: (<SoundtrackDataTable />)
  }
];
const DashboardTabs = () => <Tabs defaultActiveKey="1" items={items} onChange={onChange} />;

export default DashboardTabs