import React from "react";
import {Button, Layout, Input, Space, ConfigProvider,theme} from "antd";
import { Content } from "antd/es/layout/layout";



function AddSongForm(){
    const [buttonName] = React.useState(false)
    function enterButton (buttonName){
        console.log(buttonName)
        console.log("function enterButton is working")
        
    }
    
    function newSource (){
        console.log()
        console.log("function newSource is working")
        
    }
    return( 
       
        <ConfigProvider
    theme={{
      token: {
        // Seed Token
        colorPrimary: '#7458e2',
        // Alias Token
        colorBgContainer: '#fbf3ff',
        algorithm: theme.compactAlgorithm,
      },
    }}>
        <Content>
            <Space.Compact style={{width:'100%'}}>
            <Input placeholder="Song Title" />
            </Space.Compact>
        </Content>
        <Content>
            <Space.Compact style={{width:'100%'}}>
            <Input placeholder="Lead Composer" />
            </Space.Compact>
        </Content>
        <Button ghost onClick={()=>newSource}>Add New Source</Button>
        <Button ghost onClick={()=>enterButton('song')}>Enter Song and Sources Into Database</Button>
        </ConfigProvider>
    )
}
export default AddSongForm