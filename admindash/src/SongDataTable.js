import React from "react"
import {useState} from "react"
import {Table, Button, Input, Space} from "antd"
import AddSongForm from "./AddSongForm"
import { getAllSongs, deleteSongRequest } from "./APICalls"

function sortStringKey(key) {
    return function(a, b) {
        if  ( 
                a[key] === null       || 
                a[key] === undefined  ||
                b[key] === null       ||
                b[key] === undefined
            ) return ''
        
        let strA = a[key].toString(),
            strB = b[key].toString()

        return strA.localeCompare(strB)
    }
}

function sortStringMetaKey(key) {
    return function(a, b) {
        if  ( 
            a['meta_data'][key] === null       || 
            a['meta_data'][key] === undefined  ||
            b['meta_data'][key] === null       ||
            b['meta_data'][key] === undefined
        ) return ''
        
        let strA = a['meta_data'][key].toString(),
            strB = b['meta_data'][key].toString()
        
        return strA.localeCompare(strB)
    }
}

function editSong(_id) {
    console.log('edit song, id:',_id)
}

function deleteSong(_id) {
    console.log('delete song, id:',_id)
    let apiKey = prompt("Please enter the api key to confirm song deletion", "")
    if (apiKey == null) {
        console.log(`user cancelled deletion of id ${_id}`)
    } else {
        deleteSongRequest(_id, apiKey)
    }
}



function addSong() {
    console.log('addsong stuff goes here')
}



// let fakeData = []
// for (let i = 1; i < 100; i++) {
//     fakeData.push({
//         key: `${i}`,
//         title: `Song ${i}`,
//         game: `Destiny ${i%2===0?'1':'2'}`
//     })
// }


let data = await getAllSongs();
console.log(data)

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
        title: 'Soundtrack ID',
        dataIndex: 'soundtrack_id',
        key: 'soundtrack_id',
        sorter: sortStringKey('soundtrack_id')
    },
    {
        title: 'Game',
        dataIndex: ['meta_data','game'],
        key: 'game',
        sorter: sortStringMetaKey('game')
    },
    {
        title: 'Release Year',
        dataIndex: ['meta_data','release_year'],
        key: 'release_year',
        sorter: sortStringMetaKey('release_year')
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

    let [filteredData, setFilteredData] = useState(data)

    function filterDataTable(evt) {
        let filterString = evt.target.value
        filteredData = data.filter( (obj) => {
            if (
                    obj.title.toLowerCase().includes(filterString.toLowerCase())
            ) return true

            return false
        })
        //console.log(filterString, filteredData)
        setFilteredData(filteredData)
    }

    return (
        <>
        <div style={{textAlign: 'center', margin: '3em'}}>
            <h1 style={{textAlign: 'left'}}>Song Dashboard:</h1>
            <Input onChange={filterDataTable} placeholder="Filter by title"/>
            
                <Table
                    bordered
                    pagination={false}
                    virtual
                    scroll={{ x: 1, y: 500 }}
                    dataSource={[...filteredData]}
                    columns={cols}
                    rowKey="_id"
                />
            <br/>
            <AddSongForm/>
        </div>
        </>
    )
}

export default SongDataTable