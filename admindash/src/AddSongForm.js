import React from "react";
import {Button, Layout, Input, Space, ConfigProvider, theme,Form, Card} from "antd";
import { Content } from "antd/es/layout/layout";
import { getSongs, getAllSongs, addNewSongTitleSimple, addNewSongURL } from './APICalls';
import {CloseOutlined} from '@ant-design/icons';

const onFinish = (values) => {
  //console.log('Success:', values);
  //sconsole.log({title:values.song_title, soundtrack_id:null, meta_data: {lead_composer:values.lead_composer}, api_key:values.api_key})
  //getAllSongs();
  //console.log(values);
  console.log({lead_composer:values.lead_composer, game:1, release_year:2021})
  console.log(addNewSongTitleSimple(values.song_title,null,{lead_composer:values.lead_composer, game:1, release_year:2021},values.api_key))
};
const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};
function AddSongForm(){
    
    const [buttonName] = React.useState(false)
    
    
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
           <Form 
           onFinish={onFinish}
           onFinishFailed={onFinishFailed}
           autoComplete="off"
  >
    <Form.Item
      label="Song Title"
      name="song_title"
      rules={[
        {
          required: true,
          message: 'Please input your Song Title!',
        },
      ]}
    >
        <Content>
            <Space.Compact style={{width:'100%'}}>
            <Input placeholder="Song Title" />
            </Space.Compact>
        </Content>
        </Form.Item>
        <Form.Item
      label="Lead Composer"
      name="lead_composer"
      rules={[
        {
          required: true,
          message: 'Please input your Lead Composer!',
        },
      ]}
    >
        <Content>
            <Space.Compact style={{width:'100%'}}>
            <Input placeholder="Lead Composer" />
            </Space.Compact>
        </Content>
        </Form.Item>
        <Form.Item
      label="API Key"
      name="api_key"
      rules={[
        {
          required: true,
          message: 'Please input the key!',
        },
      ]}
    >
        <Content>
            <Space.Compact style={{width:'100%'}}>
            <Input placeholder="key" />
            </Space.Compact>
        </Content>
        </Form.Item>
        <div style={{width:"80%"}}>
        <Space>
        <Button type="default" onClick={()=>newSource} >Add New Source</Button>
        <Button htmlType="submit" >Enter Song and Sources Into Database</Button>
        </Space>
        </div>
        <SourceForm/>
        </Form>
        </ConfigProvider>
    )
}


function SourceForm () {
  return (
  
  <Card title = 'Sources'>
    <Form.List name = 'sources'>
      {(fields, {add, remove}) => (
        <div style={{ display: 'flex', flexDirection: 'column', rowGap: 16 }}>
          {fields.map((field) => (
            <Space key = {field.key}>

              <Form.Item required label = 'Video Id' name = {[field.name, 'video_id']}>
                <Input ></Input>
              </Form.Item>
              <Form.Item required label = 'Source Type' name = {[field.name, 'source_type']}>
                <Input ></Input>
              </Form.Item>
              <Form.Item label = 'Alternative Theme' name = {[field.name, 'alt_theme']}>
                <Input ></Input>
              </Form.Item>
              <Form.Item label = 'Official Title' name = {[field.name, 'official_title']}>
                <Input ></Input>
              </Form.Item>
              <center>
                <CloseOutlined onClick = {() => remove(field.name)}/>
              </center>
            </Space>
          ))}

          
          <Button type="default" onClick={add} >Add New Source</Button>
        </div>)
        
      }
    </Form.List>
  </Card>
  )
}

export default AddSongForm