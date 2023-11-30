import React from "react";
import {Table, Button, Layout, Input, Space} from "antd";
const { Header, Footer, Sider, Content } = Layout

let cols = [
    {
        title: 'Index',
        dataIndex: 'key',
        key: 'key'
    },
    {
        title: 'Title',
        dataIndex: 'title',
        key: 'title'
    },
    {
        title: 'Game',
        dataIndex: 'game',
        key: 'game'
    }
]

let fakeData = []
for (let i = 1; i < 100; i++) {
    fakeData.push({
        key: `${i}`,
        title: `Song ${i}`,
        game: `Destiny ${i%2===0?'1':'2'}`
    })
}

let data = [],
    uriGet = 'https://localhost:5500/music/songs',
    apiFetch = fetch(uriGet).then(response=>console.log(response.json()));

console.log(apiFetch)

const headerStyle = {
    color: '#fff',
    fontSize: '30px',
    justifyContent: 'left',
}

function Test() {
    return (
        <Layout>
            
            <Header style={headerStyle}>
                <Space direction="vertical" style={{display: 'block'}}>
                    <Input placeholder="Filter" />
                </Space>
            </Header>

            <Layout>
                <Space direction='horizontal' style={{display: 'flex'}}>
                    <Content>
                        <Table
                            bordered
                            pagination={false}
                            virtual scroll={{ x: 1, y: 500 }}
                            dataSource={fakeData}
                            columns={cols}
                        />
                    </Content>
                </Space>

                <Sider>
                    <Space direction="vertical" style={{display: 'flex'}}>
                        <Button block>Add Song</Button>
                        <Button block>Edit song</Button>
                    </Space>
                </Sider>

            </Layout>

            <Footer>
            </Footer>
            
        </Layout>
    )
}

export default Test