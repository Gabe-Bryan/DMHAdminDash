import React, { useState, useEffect } from "react";
import {Button,Input,Space,ConfigProvider,theme,Form,DatePicker,Radio,Card,notification,Modal,Select} from "antd";
import { Content } from "antd/es/layout/layout";
import {getSongs,getSong, editSong, getAllSongs,addNewSongTitleSimple,addNewSongURL} from "./APICalls";
import { CloseOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';

const { YearPicker } = DatePicker;

const onFinish = async (values, _id) => {
  notification.info({
    message: "Waiting on response from the server",
    placement: "top",
  });
  let sourcesArray = [];
  if (values.sources) {
    for (const source of values.sources) {
      const changedSource={
        video_id: source.video_id,
        source_type: source.source_type,
        intensity:source.intensity,
        official_title: source.official_title,
      }
      if(source.intensity==="None"){
        delete changedSource.intensity
      }
      sourcesArray.push(changedSource)
    }
  }

  let response;
  if (_id) {
    console.log('submitting patch...');
    response = await editSong(
      _id,
      values.song_title,
      '',
      {
        lead_composer: values.lead_composer,
        game: values.game,
        release_year: values.release_year.format("YYYY"),
      },
      sourcesArray,
      values.api_key
    );
  } else {
    console.log('sending post request...', _id)
    response = await addNewSongTitleSimple(
      values.song_title,
      '',
      {
        lead_composer: values.lead_composer,
        game: values.game,
        release_year: values.release_year.format("YYYY"),
      },
      sourcesArray,
      values.api_key
    );
  }
  
  if (!response.errors) {
    notification.success({message: "Song was submitted to Database"});
  } else {
    notification.error({
      message: <div style={{ color: "#7458e2" }}>{response.errors}</div>,

      style: {
        color: "#7458e2",
        backgroundColor: "#CA3C25",
      },
      placement: "top",
      duration: 0,
    });
  }
};

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const config = {
  rules: [
    {
      type: "object",
      required: true,
      message: "Please select time!",
    },
  ],
};

const lightMode = {
  token: {
    colorText: "#7458e2",
    // Seed Token
    colorPrimary: "#7458e2",
    // Alias Token
    colorBgContainer: "#fbf3ff",
    algorithm: theme.compactAlgorithm,
  },
};
const customDarkTheme = {
  token: {
    // Seed Token
    colorPrimary: "#7458e2",
    // Alias Token
    colorBgContainer: "#fbf3ff",
    algorithm: theme.darkAlgorithm,
  },
};

function SongForm({ open, onFinish, onCancel, contents = {}, _id = undefined}) {
  const [form] = Form.useForm();
  // useEffect(() => {
  //   // form.setFields([{name : ['song_title'], value : 'a song'}]);
  //   console.log(form.getFieldValue());
  // });
  const [buttonName] = React.useState(false);

  const currentTheme = lightMode;
  return (
    <Modal
      open={open}
      width={"100%"}
      okText="Send Music To Database"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={async () => {
        form
          .validateFields()
          .then(async (values) => {
            form.resetFields();
            await onFinish(values, _id);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <div>
        <Card
          title="Song Form"
          headStyle={{ backgroundColor: "#E8D8E6", color: "#7458e2" }}
          bodyStyle={{ backgroundColor: "#E8D8E6" }}
          bordered={false}
        >
          <ConfigProvider theme={currentTheme}>
            <Form
              form={form}
              // onFinish={(values) => onFinish(values, _id)}
              onFinishFailed={onFinishFailed}
              initialValues = {contents}
              autoComplete="off"
            >
              <Form.Item
                label="Song Title"
                name="song_title"
                valuePropName = "value"
                rules={[
                  {
                    required: true,
                    message: "Please input your Song Title!",
                  },
                ]}
              >
                    <Input placeholder="Song Title"/>
              </Form.Item>
              <Form.Item
                label="Lead Composer"
                name="lead_composer"
                valuePropName = "value"
                rules={[
                  {
                    required: true,
                    message: "Please input your Lead Composer!",
                  },
                ]}
              >
                    <Input placeholder="Lead Composer" />
              </Form.Item>

              <Space.Compact style={{ width: "100%" }}>
                <Form.Item
                  name="release_year"
                  label="Year Of Song Released"
                  valuePropName = "value"
                  {...config}
                >
                  
                    <YearPicker />
                  
                </Form.Item>
                <Form.Item
                  name="game"
                  label="Game"
                  valuePropName = "value"
                  rules={[
                    {
                      required: true,
                      message: "Please input the Game!",
                    },
                  ]}
                >
                    <Radio.Group>
                      <Radio value="1">Destiny 1</Radio>
                      <Radio value="2">Destiny 2</Radio>
                    </Radio.Group>
                  
                </Form.Item>
              </Space.Compact>
              <Space direction="vertical" size="large" style={{ display: 'flex' }}>

              <div style={{ width: "90%" }}>
                <SourceForm />
              </div>
              
                
                  
                    <Form.Item
                      label="API Key"
                      name="api_key"
                      valuePropName = "value"
                      rules={[
                        {
                          required: true,
                          message: "Please input the key!",
                        },
                      ]}
                    >
                        <Input placeholder="key" />
                    </Form.Item>
                  </Space>
                
              
            </Form>
          </ConfigProvider>
        </Card>
      </div>
    </Modal>
  );
}

//using creating a modal that has all of he functionality
function AddSongForm({edit_id = undefined}) {
  const [open, setOpen] = useState(false);
  const [contents, setContents] = useState({});
  const openForm = async () =>
  {
    if (edit_id) {
      const values = await getSong(edit_id);
      
      console.log(values);
      setContents({song_title: values.title,
                  lead_composer: values.meta_data.lead_composer,
                  game: values.meta_data.game,
                  release_year: dayjs(values.meta_data.release_year, 'YYYY'),
                  sources: values.sources});
    } else{
      console.log(edit_id);
    }
    setOpen(true);
  }
  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          openForm();
        }}
      >
        {edit_id ? 'edit' : 'New Song'}
      </Button>
      <SongForm
        open={open}
        onFinish={onFinish}
        contents = {contents}
        _id = {edit_id}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </div>
  );
}

function SourceForm() {
  return (
    <Card
      title="Sources"
      headStyle={{
        backgroundColor: "#E8D8E6",
        color: "#7458e2",
        borderColor: "#E8D8E6",
      }}
      bodyStyle={{ backgroundColor: "#E8D8E6", borderColor: "#E8D8E6" }}
      bordered={false}
    >
      <Form.List name="sources">
        {(fields, { add, remove }) => (
          <div style={{ display: "flex", flexDirection: "column", rowGap: 16 }}>
            {fields.map((field) => (
              <Space key={field.key}>
                <Form.Item
                  label="Video Id"
                  name={[field.name, "video_id"]}
                  rules = {[
                    {
                      required: true,
                      message: "Please enter a video id"
                    }
                  ]}
                >
                    <Input></Input>
                </Form.Item>
                <Form.Item
                  label="Source Type"
                  name={[field.name, "source_type"]}
                  // rules = {[
                  //   {
                  //     required: true,
                  //     mesage: "Please enter a source type"
                  //   }
                  // ]}
                >
                    <Select placeholder="Youtube">
                      <Select.Option value="Youtube">Youtube</Select.Option>
                    </Select>
                </Form.Item>
                <div>
                <Form.Item
                  label="Intensity"
                  name={[field.name, "intensity"]}
                >
                  <Content>
                    <Select defaultValue={"None"}>
                      <Select.Option value="None">Select an Intensity</Select.Option>
                      <Select.Option value="Ambient">Ambient</Select.Option>
                      <Select.Option value="Tension">Tension</Select.Option>
                      <Select.Option value="Action">Action</Select.Option>
                      <Select.Option value="High Action">High Action</Select.Option>
                      <Select.Option value="Heavy Action">Heavy Action</Select.Option>
                      <Select.Option value="Light Action">Light Action</Select.Option>
                      
                    </Select>
                  </Content>
                </Form.Item>
                </div>
                <Form.Item
                  label="Alternate Title"
                  name={[field.name, "alternate_title"]}
                >
                  <Content>
                    <Input></Input>
                  </Content>
                </Form.Item>
                <center>
                  <CloseOutlined onClick={() => remove(field.name)} />
                </center>
              </Space>
            ))}

            <Button type="default" onClick={() => {add({source_type:"Youtube"})}}>
              Add New Source
            </Button>
          </div>
        )}
      </Form.List>
    </Card>
  );
}

export default AddSongForm;
