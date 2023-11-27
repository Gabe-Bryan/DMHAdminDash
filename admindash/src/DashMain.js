import './DashMain.css'
import {Table, Button, Layout, Input, Space} from "antd";
const { Header, Sider, Content } = Layout

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

// Generate fake test data
for (let i = 1; i < 100; i++) {
    data.push({
        key: `${i}`,
        title: `Song ${i}`,
        game: `Destiny ${i%2===0?'1':'2'}`
    })
}



function DashMain() {
    return (
        <div id='container'>
            
            <Header class="headerStyle">
                <Space direction="vertical" style={{display: 'flex'}}>
                    <h1>Admin Dashboard</h1>
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
                    <Space direction="vertical" style={{display: 'block'}}>
                        <Button class='btnDash' block>Add Song</Button>
                        <Button class='btnDash' block>Edit song</Button>
                    </Space>
                </Sider>

                
            </Layout>
            
        </div>
    )
}

export default DashMain