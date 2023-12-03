import React from "react"
import {Table, Button, Input} from "antd"

function sortStringKey(key) {
    return function(a, b) {
        return a[key].localeCompare(b[key])
    }
}

function editSong(id) {
    alert(`song id: ${id}`)
}

function addSong() {
    alert('ADD SONG PANEL?')
}

let cols = [
    {
        title: 'id',
        dataIndex: '_id',
        key: '_id',
        // render: item=>`... ${item.substring(item.length-4,item.length)}`
        sorter: sortStringKey('_id')
    },
    {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        sorter: sortStringKey('title')
    },
    // {
    //     title: 'Release Date',
    //     dataIndex: 'release_date',
    //     key: 'release_date',

    //     sorter: sortStringKey('release_date')
    // },
    {
        
    }
]

// let fakeData = []
// for (let i = 1; i < 100; i++) {
//     fakeData.push({
//         key: `${i}`,
//         title: `Song ${i}`,
//         game: `Destiny ${i%2===0?'1':'2'}`
//     })
// }

let data = await fetch('http://localhost:5000/music/soundtracks').then( res => res.json() ).catch(()=>[])

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