import React from "react"
import {Table, Button, Input, Space} from "antd"
import AddSongForm from "./AddSongForm"

function sortStringKey(key) {
    return function(a, b) {
        return a[key].localeCompare(b[key])
    }
}

function sortStringMetaKey(key) {
    return function(a, b) {
        return a['meta_data'][key].localeCompare(b['meta_data'][key])
    }
}

function editSong(_id) {
    console.log('edit song, id:',_id)
}

function deleteSong(_id) {
    console.log('delete song, id:',_id)
}

function addSong() {
    console.log('addsong stuff goes here')
}

function filterDataTable(evt) {
    let filterString = evt.target.value
    filteredData = data.filter( (obj) => {
        if (obj.title.includes(filterString)) return true
        return false
    })
    console.log(filterString, filteredData)
}

// let fakeData = []
// for (let i = 1; i < 100; i++) {
//     fakeData.push({
//         key: `${i}`,
//         title: `Song ${i}`,
//         game: `Destiny ${i%2===0?'1':'2'}`
//     })
// }

let data = await fetch('http://localhost:5000/music/songs').then( res => res.json() ).catch( () => [] ),
    filteredData = Array.from(data)

let cols = [
    {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        sorter: sortStringKey('title'),
        defaultSortOrder: 'ascend',
        filters: [{text: 'test',value:'test'}],
        onFilter: (value, record)=>(record.title.includes(value))
    },
    {
        title: 'Lead Composer',
        dataIndex: ['meta_data','lead_composer'],
        key: 'lead_composer',
        sorter: sortStringMetaKey('lead_composer')
    },
    {
        title: 'Soundtrack ID',
        dataIndex: 'soundtrack_id',
        key: 'soundtrack_id',
        // sorter: sortStringKey('soundtrack_id')
    },
    {
        title: 'Game',
        dataIndex: ['meta_data','game'],
        key: 'game',
        // sorter: undefined
    },
    {
        title: 'Release Year',
        dataIndex: ['meta_data','release_year'],
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
        <>
        <div style={{textAlign: 'center', margin: '3em'}}>
            <h1 style={{textAlign: 'left'}}>Song Dashboard:</h1>
            <Input onChange={filterDataTable} placeholder="Filter"/>
            
                <Table
                    bordered
                    pagination={false}
                    virtual
                    scroll={{ x: 1, y: 500 }}
                    dataSource={[...filteredData]}
                    columns={cols}
                    rowKey="_id"
                />
            
            <Button style={{width: '11em'}} onClick={addSong} block>Add Song</Button>
        </div>
        </>
    )
}

export default SongDataTable