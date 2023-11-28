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

let data = []

for (let i = 1; i < 100; i++) {
    data.push({
        key: `${i}`,
        title: `Song ${i}`,
        game: `Destiny ${i%2===0?'1':'2'}`
    })
}

const headerStyle = {
    color: '#fff',
    fontSize: '30px',
}

function Test() {
    return (
        <Layout>
            
            <Header style={headerStyle}>
                <Space direction="vertical" style={{display: 'flex'}}>
                    <Input placeholder="Filter" />
                </Space>
            </Header>

            <Layout>
                <Space direction='horizontal' style={{display: 'flex'}}>
                    <Content>
                        <Table
                            bordered
                            pagination={false}
                            virtual scroll={{ x: 1, y: 400 }}
                            dataSource={data}
                            columns={cols}
                        />
                    </Content>
                </Space>

                <Sider vertical>
                    <Space direction="vertical" style={{display: 'flex'}}>
                        <Button block>Add Song</Button>
                        <Button block>Edit song</Button>
                    </Space>
                </Sider>

                
            </Layout>
            
        </Layout>
    )
}

export default Test