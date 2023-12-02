import React from "react";
import {Table, Button, Layout, Input, Space} from "antd";
const { Header, Footer, Content } = Layout

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

let data = await fetch('http://localhost:5000/music/songs').then( res => res.json() ).catch(()=>[])

let styleHFS = {backgroundColor: '#ddd'},
    styleBtn = {width: '11em'}

function Test() {
    return (
        <div>
            <center><h1>Admin Dashboard</h1></center>    
        
            <Layout style={{margin: '1fr'}}>
                <Input placeholder="Filter"/>
                
                <Layout>
                    <Space direction='horizontal'>
                            <Table
                                style={{margin: '1em'}}
                                bordered
                                pagination={false}
                                virtual scroll={{ x: 1, y: 500 }}
                                dataSource={data}
                                columns={cols}
                                rowKey="_id"
                            />
                    </Space>
                </Layout>

                <Button style={styleBtn} onClick={addSong} block>Add Song</Button>
                
            </Layout>
        </div>
    )
}

export default Test