import React from "react"
import {useState} from "react"
import {Table, Button, Input, Space} from "antd"

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

function editSoundtrack(_id) {
    console.log('edit song, id:',_id)
}

function deleteSoundtrack(_id) {
    console.log('delete song, id:',_id)
}

function addSoundtrack() {
    console.log('add soundtrack stuff goes here')
}

let data = await fetch('http://localhost:5000/music/soundtracks').then( res => res.json() ).catch( () => [] )

let cols = [
    {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        sorter: sortStringKey('title'),
        defaultSortOrder: 'ascend',
    },
    {
        title: 'Lead Composer',
        dataIndex: ['meta_data','lead_composer'],
        key: 'lead_composer',
        sorter: sortStringMetaKey('lead_composer')
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
                <Button onClick={ () => { editSoundtrack(record._id) } }>
                    edit
                </Button>
                <Button onClick={ () => { deleteSoundtrack(record._id) } }>
                    delete
                </Button>
            </Space>
        ),
    },
]

function SoundtrackDataTable() {

    let [filteredData, setFilteredData] = useState(data)

    function filterDataTable(evt) {
        let filterString = evt.target.value
        filteredData = data.filter( (obj) => {
            if (obj.title.includes(filterString)) return true
            return false
        })
        console.log(filterString, filteredData)
        setFilteredData(filteredData)
    }

    return (
        <>
        <div style={{textAlign: 'center', margin: '3em'}}>
            <h1 style={{textAlign: 'left'}}>Soundtrack Dashboard:</h1>
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
            
            <Button style={{width: '11em'}} onClick={addSoundtrack} block>Add Soundtrack</Button>
        </div>
        </>
    )
}

export default SoundtrackDataTable