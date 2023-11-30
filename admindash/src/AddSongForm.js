import React from "react";
import {Button, Layout, Input, Space, ConfigProvider, theme} from "antd";
import { Content } from "antd/es/layout/layout";

const { getDesignToken, useToken } = theme;

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
    

    const customDarkTheme={
        token: {
            
            // Seed Token
            colorPrimary: '#7458e2',
            // Alias Token
            colorBgContainer: '#fbf3ff',
            ghost:true,
          },
    };
    
    const lightMode={
        
            token: {
            colorText: '#7458e2',
               // Seed Token
            colorPrimary: '#7458e2',
            // Alias Token
            colorBgContainer: '#fbf3ff',
            },
    }
    
    const currentTheme=lightMode
    return( 
        
        <ConfigProvider theme={currentTheme}>
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
        <div style={{width:"80%"}}>
        <Space>
        <Button type="default" onClick={()=>newSource} >Add New Source</Button>
        <Button onClick={()=>enterButton('song')} >Enter Song and Sources Into Database</Button>
        </Space>
        </div>
        </ConfigProvider>
    )
}
export default AddSongForm