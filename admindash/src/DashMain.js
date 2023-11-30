import React from "react";
import {Table, Button, Layout, Input, Space} from "antd";
const { Header, Footer, Sider, Content } = Layout

function sortStringKey(key) {
    return function(a, b) {
        return a[key].localeCompare(b[key])
    }
}

let cols = [
    {
        title: 'id (last 4)',
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
    {
        title: 'Release Date',
        dataIndex: 'release_date',
        key: 'release_date',
        // render: item=>item.substring(0,10)
        sorter: sortStringKey('release_date')
    },
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

let styleHFS = {backgroundColor: '#ddd'},
    styleBtn = {width: '11em'},
    styleFilter = {paddingRight: '2em'}


function Test() {
    return (
        <div>
            <center><h1>Admin Dashboard</h1></center>    
        
            <Layout>
                <Header style={styleHFS}>
                    <Input placeholder="Filter"/>
                </Header>
                
                <Layout>
                    <Space direction='horizontal'>
                        <Content style={styleHFS}>
                            <Table
                                style={{paddingLeft: '3em'}}
                                bordered
                                pagination={false}
                                virtual scroll={{ x: 1, y: 500 }}
                                dataSource={data}
                                columns={cols}
                                rowKey="_id"
                            />
                        </Content>
                    </Space>

                    <Sider style={styleHFS}>
                        <Space direction="vertical">
                            <Button style={styleBtn} block>Add Song</Button>
                            <Button style={styleBtn} block>Edit song</Button>
                        </Space>
                    </Sider>

                </Layout>

                <Footer style={styleHFS}>
                </Footer>
                
            </Layout>
        </div>
    )
}

export default Test