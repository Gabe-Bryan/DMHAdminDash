import React from "react";
import {Button, Layout, Input, Space, ConfigProvider, theme,Form, DatePicker,Radio, Card, notification} from "antd";
import { Content } from "antd/es/layout/layout";
import { getSongs, getAllSongs, addNewSongTitleSimple, addNewSongURL } from './APICalls';
import {CloseOutlined} from '@ant-design/icons';
const { YearPicker } = DatePicker;
const onFinish = async (values) => {
  let sourcesArray=[]
  if (values.sources){
  for (const source of values.sources){
    sourcesArray.push({video_id:source.video_id,source_type:source.source_type,alt_theme:source.alt_theme,official_title:source.official_title});
  }
}
  //console.log('Success:', values);
  //console.log([values.song_title,null,{lead_composer:values.lead_composer, game:values.game, release_year:values.release_year.format("YYYY")},values.api_key])
  //getAllSongs();
  //console.log(sourcesArray)
  const addNewSong= await addNewSongTitleSimple(values.song_title,null,{lead_composer:values.lead_composer, game:values.game, release_year:values.release_year.format("YYYY")},sourcesArray,values.api_key)
  if(!addNewSong.error){
    notification.success("Song was added to Database")
  }else{
    notification.error({
      message:<div style={{ color: '#7458e2' }}>{addNewSong.error}</div>,
      
      style: {
        color:'#7458e2',
        backgroundColor:"#CA3C25"
      },
      placement:"top",
      duration:0
    })
  }
  
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
function AddSongForm(){

 
    const [buttonName] = React.useState(false)

    const customDarkTheme={
        token: {
            
            // Seed Token
            colorPrimary: '#7458e2',
            // Alias Token
            colorBgContainer: '#fbf3ff',
            algorithm: theme.darkAlgorithm,
          },
    };
    
    
    
    const currentTheme=lightMode
    return( 
      <div>
        <Card title="Song Form"     headStyle={{ backgroundColor: '#E8D8E6', color: '#7458e2' }} bodyStyle={{ backgroundColor: '#E8D8E6' }} bordered={false}>
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
        
            <Space.Compact style={{width:'100%'}}>
              <Form.Item name="release_year" label="Year Of Song Released" {...config}>
                <YearPicker />
              </Form.Item>
              <Form.Item name="game" label="Game"
        rules={[
        {
          required: true,
          message: 'Please input the Game!',
        },]}>
          
          <Radio.Group>
            <Radio value="1">Destiny 1</Radio>
            <Radio value="2">Destiny 2</Radio>
          </Radio.Group>
        </Form.Item>
            </Space.Compact>
        

        <div style={{width:"80%"}}>
        <SourceForm/>
        <Content>
            <Space>
        <Form.Item
      label="API Key"
      name="api_key"
      rules={[
        {
          required: true,
          message: 'Please input the key!',
        },]}>
        
            <Input placeholder="key" />
           
        </Form.Item>
        </Space>
        </Content>
        <Space>
        
        {/* <Button type="default" onClick={()=>newSource} >Add New Source</Button> */}
        <Button htmlType="submit" >Enter Song and Sources Into Database</Button>
        </Space>
        </div>
        </Form>
        </ConfigProvider>
        </Card>
        </div>
    )
}


function SourceForm () {
  return (
  
  <Card title = 'Sources'  headStyle={{ backgroundColor: '#E8D8E6', color: '#7458e2' , borderColor: '#E8D8E6'}} bodyStyle={{ backgroundColor: '#E8D8E6', borderColor: '#E8D8E6'}} bordered={false} > 
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