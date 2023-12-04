import React from "react"
import {Table, Button, Input, Space} from "antd"

function sortStringKey(key) {
    return function(a, b) {
        return a[key].localeCompare(b[key])
    }
}

function editSong(_id) {
    console.log('edit song, id:',_id)
}

function deleteSong(_id) {
    console.log('delete song, id:',_id)
}

function addSong() {
    console.log('ADD SONG PANEL?')
}

// let fakeData = []
// for (let i = 1; i < 100; i++) {
//     fakeData.push({
//         key: `${i}`,
//         title: `Song ${i}`,
//         game: `Destiny ${i%2===0?'1':'2'}`
//     })
// }

let data = await fetch('http://localhost:5000/music/songs').then( res => res.json() ).catch( () => [] )

let cols = [
    {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        sorter: sortStringKey('title')
    },
    {
        title: 'Lead Composer',
        dataIndex: 'lead_composer',
        key: 'lead_composer',
        sorter: sortStringKey('lead_composer')
    },
    {
        title: 'Soundtrack ID',
        dataIndex: 'soundtrack_id',
        key: 'soundtrack_id',
        // sorter: undefined
    },
    {
        title: 'Game',
        dataIndex: 'game',
        key: 'game',
        // sorter: undefined
    },
    {
        title: 'Release Year',
        dataIndex: 'release_year',
        key: 'release_year',
        // sorter: undefined
    },
    {
        title: 'Action',
        dataIndex: '',
        key: 'action',
        render: (text, record, index) => (
            <Space size='middle'>
                <Button onClick={ () => { editSong(record._id) } }>
                    edit
                </Button>
                <Button onClick={ () => { deleteSong(record._id) } }>
                    delete
                </Button>
            </Space>
        ),
    },
]

function SongDataTable() {
    return (
        <div style={{textAlign: 'center', margin: '3em'}}>
            <center><h1>Admin Dashboard</h1></center>    
            <Input placeholder="Filter"/>
            
                <Table
                    bordered
                    pagination={false}
                    virtual
                    scroll={{ x: 1, y: 500 }}
                    dataSource={data}
                    columns={cols}
                    rowKey="_id"
                />
            
            <Button style={{width: '11em'}} onClick={addSong} block>Add Song</Button>
        </div>
    )
}

export default SongDataTable