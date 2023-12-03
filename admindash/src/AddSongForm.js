import React from "react";
import {Button, Layout, Input, Space, ConfigProvider, theme,Form, DatePicker,Radio} from "antd";
import { Content } from "antd/es/layout/layout";
import { getSongs, getAllSongs, addNewSongTitleSimple, addNewSongURL } from './APICalls';
const { YearPicker } = DatePicker;

const onFinish = (values) => {
  console.log()
 
  //console.log('Success:', values);
  //sconsole.log({title:values.song_title, soundtrack_id:null, meta_data: {lead_composer:values.lead_composer}, api_key:values.api_key})
  //getAllSongs();
  console.log({lead_composer:values.lead_composer, game:values.game, release_year:values.release_year.format("YYYY")})
  console.log(addNewSongTitleSimple(values.song_title,null,{lead_composer:values.lead_composer, game:values.game, release_year:values.release_year.format("YYYY")},values.api_key))
  //console.log(addNewSongTitleSimple(null,null,{lead_composer:values.lead_composer, game:1, release_year:2021},values.api_key))
};
const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};
const config = {
  rules: [
    {
      type: 'object',
      required: true,
      message: 'Please select time!',
    },
  ],
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
            algorithm: theme.darkAlgorithm,
          },
    };
    
    const lightMode={
        
            token: {
            colorText: '#7458e2',
               // Seed Token
            colorPrimary: '#7458e2',
            // Alias Token
            colorBgContainer: '#fbf3ff',
            algorithm: theme.compactAlgorithm,
            
            },
    }
    
    const currentTheme=lightMode
    return( 
        
        <ConfigProvider theme={currentTheme}>
           <Form 
           name="time_related_controls"
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
        },]}>
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
        },]}>
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
        },]}>
        <Content>
            <Space.Compact style={{width:'100%'}}>
            <Input placeholder="key" />
            </Space.Compact>
        </Content>
        </Form.Item>
       
        <Content>
            <Space.Compact style={{width:'100%'}}>
              <Form.Item name="release_year" label="Year Of Song Released" {...config}>
                <YearPicker />
              </Form.Item>
            </Space.Compact>
        </Content>
        <Form.Item name="game" label="Game">
      <Radio.Group>
        <Radio value="1">Destiny 1</Radio>
        <Radio value="2">Destiny 2</Radio>
      </Radio.Group>
    </Form.Item>
        <div style={{width:"80%"}}>
        <Space>
        <Button type="default" onClick={()=>newSource} >Add New Source</Button>
        <Button htmlType="submit" >Enter Song and Sources Into Database</Button>
        </Space>
        </div>
        </Form>
        </ConfigProvider>
    )
}
export default AddSongForm