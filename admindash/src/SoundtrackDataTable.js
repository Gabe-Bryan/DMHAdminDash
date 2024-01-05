import React from "react"
import {useState} from "react"
import {Table, Button, Input, Space} from "antd"
import AddSoundtrackForm from './AddSoundtrackForm'
import {getAllSoundtracks, deleteSoundtrackRequest} from "./APICalls";

let data = await getAllSoundtracks()

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

// function sortStringMetaKey(key) {
//     return function(a, b) {
//         if  ( 
//             a['meta_data'][key] === null       || 
//             a['meta_data'][key] === undefined  ||
//             b['meta_data'][key] === null       ||
//             b['meta_data'][key] === undefined
//         ) return ''
        
//         let strA = a['meta_data'][key].toString(),
//             strB = b['meta_data'][key].toString()
        
//         return strA.localeCompare(strB)
//     }
// }

async function deleteSoundtrack(_id, dataCopy, setFunction) {
    console.log('delete soundtrack, id:',_id)
    let apiKey = prompt("Please enter the api key to confirm soundtrack deletion", "")
    if (apiKey == null) {
        console.log(`user cancelled deletion of id ${_id}`)
    } else {
        let res = await deleteSoundtrackRequest(_id, apiKey)
        if (res.errors)
            console.log('incorrect api key. please check and try again')
        else {
            //dataCopy = dataCopy.filter( item => item._id !== _id)
            data = await getAllSoundtracks()
            dataCopy = [...data]
            setFunction(dataCopy)
            console.log(`success! item id ${_id} removed from database.`)
            //console.log(dataCopy)
        }
    }
}

function SoundtrackDataTable() {

    let [filteredData, setFilteredData] = useState(data)

    let cols = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            sorter: sortStringKey('title'),
            defaultSortOrder: 'ascend'
        },
        {
            title: 'Game',
            dataIndex: ['game'],
            key: 'game',
            sorter: sortStringKey('game')
        },
        {
            title: 'Release Date',
            dataIndex: ['release_date'],
            key: 'release_year',
            sorter: sortStringKey('release_date')
        },
        {
            title: 'Action',
            dataIndex: '',
            key: 'action',
            render: (text, record, index) => (
                <Space size='middle'>
                    
                    <Button onClick={ () => { deleteSoundtrack(record._id, filteredData, setFilteredData) } }>
                        delete
                    </Button>
                </Space>
            ),
        },
    ]

    function filterDataTable(evt) {
        let filterString = evt.target.value
        filteredData = data.filter( (obj) => {
            if (
                obj.title.toLowerCase().includes(filterString.toLowerCase())
            ) return true
            
            return false
        })
        // console.log(filterString, filteredData)
        setFilteredData(filteredData)
    }

    return (
        <>
        <div style={{textAlign: 'center', margin: '2em'}}>
            <h2 style={{textAlign: 'left'}}>Soundtracks:</h2>
            <div style={{textAlign: 'left', margin: '1em'}}>
                <AddSoundtrackForm/>
            </div>
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
        </div>
        </>
    )
}

export default SoundtrackDataTable