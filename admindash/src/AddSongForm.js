import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Space,
  ConfigProvider,
  theme,
  Form,
  DatePicker,
  Radio,
  Card,
  notification,
  Modal,
  Select,
  Checkbox,
} from "antd";
import { Content } from "antd/es/layout/layout";
import {
  getSongs,
  getSong,
  editSong,
  getAllSongs,
  addNewSongTitleSimple,
  addNewSongURL,
  getAllSoundtracks,
} from "./APICalls";
import { CloseOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { YearPicker } = DatePicker;

const onFinish = async (values, _id, refreshFunction, setOpen) => {
  notification.info({
    message: "Waiting on response from the server",
    placement: "top",
  });
  let sourcesArray = [];
  if (values.sources) {
    for (const source of values.sources) {
      console.log(source)
      console.log(source.intensity)
      const changedSource = {
        video_id: source.video_id,
        source_type: source.source_type,
        intensity: source.intensity,
        track_number: parseInt(source.track_number) ? parseInt(source.track_number):undefined ,
        is_official: source.is_official,
        soundtrack_id: source.soundtrack_id? source.soundtrack_id:undefined
      };
      if (source.intensity === "None") {
        delete changedSource.intensity;
      } 
      console.log(changedSource)
      sourcesArray.push(changedSource);
    }
  }

  let response;
  if (_id) {
    console.log("submitting patch...");

    response = await editSong(
      _id,
      values.song_title,
      {
        lead_composer: values.lead_composer,
        other_credits: values.other_credits,
        game: values.game,
        release_year: values.release_year.format("YYYY"),
        destination: values.destination,
        faction: values.faction,
      },
      sourcesArray,
      values.api_key
    );
  } else {
    console.log("sending post request...", _id);
    response = await addNewSongTitleSimple(
      values.song_title,
      {
        lead_composer: values.lead_composer,
        other_credits: values.other_credits,
        game: values.game,
        release_year: values.release_year.format("YYYY"),
        destination: values.destination,
        faction: values.faction,
      },
      sourcesArray,
      values.api_key
    );
  }
  console.log(response);
  if (!response.errors) {
    notification.success({ message: "Song patch/post successful!" });
    refreshFunction();
    setOpen(false);
  } else {
    console.log("an error was caught");
    let errorString = "";
    for (let error of response.errors) {
      let newError = "";
      for (let key of Object.keys(error)) {
        newError += key + ": " + error[key] + ", ";
      }
      newError = newError.slice(0, -2);
      if (errorString.length === 0) {
        errorString += "\n";
      }
      errorString += newError;
    }
    notification.error({
      message: <div style={{ color: "white" }}>{errorString}</div>,
      // message: 'hello there, failure',
      style: {
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

function SongForm({
  open,
  setOpen,
  onFinish,
  onCancel,
  refreshFunction,
  contents = {},
  _id = undefined,
  soundtrackData,
  values,
  songObject
}) {
  const [form] = Form.useForm();
  // useEffect(() => {
  //   // form.setFields([{name : ['song_title'], value : 'a song'}]);
  //   console.log(form.getFieldValue());
  // });
  const [buttonName] = React.useState(false);
  const soundtrackCopy = [...soundtrackData];
  const soundtrackOptions = [{value:false,label:"Select a soundtrack"},
    ...new Set(
      soundtrackCopy.map((item) => ({ value: item._id, label: item.title }))
    ),
  ];

  const currentTheme = lightMode;
  console.log(contents)
  return (
    <Modal
      open={open}
      width={"100%"}
      okText="Send Music To Database"
      cancelText="Cancel"
      onCancel={() => onCancel(form)}
      onOk={async () => {
        form
          .validateFields()
          .then(async (values) => {
            form.resetFields();
            await onFinish(values, _id, refreshFunction, setOpen);
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
              initialValues={contents}
              autoComplete="off"
            >
              <Form.Item
                label="Song Title"
                name="song_title"
                valuePropName="value"
                rules={[
                  {
                    required: true,
                    message: "Please input your Song Title!",
                  },
                ]}
              >
                <Input placeholder="Song Title" />
              </Form.Item>
              <Form.Item
                label="Lead Composer"
                name="lead_composer"
                valuePropName="value"
                rules={[
                  {
                    required: true,
                    message: "Please input your Lead Composer!",
                  },
                ]}
              >
                <Input placeholder="Lead Composer" />
              </Form.Item>

              <Form.Item
                label="Other Credits"
                name="other_credits"
                valuePropName="value"
              >
                <Input placeholder="Other Credits" disabled></Input>
              </Form.Item>

              <Space.Compact style={{ width: "100%" }}>
                <Form.Item
                  name="release_year"
                  label="Year Of Song Released"
                  valuePropName="value"
                  {...config}
                >
                  <YearPicker />
                </Form.Item>
                <Form.Item
                  name="game"
                  label="Game"
                  valuePropName="value"
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
                <Form.Item
                  name="destination"
                  label="Destination"
                  valuePropName="value"
                >
                  <Input placeholder="Destination"></Input>
                </Form.Item>
                <Form.Item name="faction" label="Faction" valuePropName="value">
                  <Input placeholder="Faction"></Input>
                </Form.Item>
              </Space.Compact>

              <Space
                direction="vertical"
                size="large"
                style={{ display: "flex" }}
              >
                <div style={{ width: "90%" }}>
                  <SourceForm soundtrackOptions={soundtrackOptions} songObject={songObject} />
                </div>

                <Form.Item
                  label="API Key"
                  name="api_key"
                  valuePropName="value"
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
function AddSongForm({ edit_id = undefined, refreshFunction, soundtrackData, songObject }) {
  
  

  const [open, setOpen] = useState(false);
  const [contents, setContents] = useState({});
  const openForm = async () => {
    if (edit_id) {
      const values = songObject
      setContents({
        song_title: values.title,
        lead_composer: values.meta_data.lead_composer,
        other_credits: values.meta_data.other_credits,
        game: values.meta_data.game,
        release_year: dayjs(values.meta_data.release_year, "YYYY"),
        sources: values.sources,
        destination: values.meta_data.destination,
        faction: values.meta_data.faction,
      });
    } else {
      console.log(edit_id);
    }
    setOpen(true);
  };
  return (
    <div>
      <Button type="primary" onClick={openForm}>
        {edit_id ? "edit" : "New Song"}
      </Button>
      <SongForm
        open={open}
        setOpen={setOpen}
        onFinish={onFinish}
        contents={contents}
        _id={edit_id}
        refreshFunction={refreshFunction}
        soundtrackData={soundtrackData}
        onCancel={(form) => {
          form.resetFields();
          setOpen(false);
        }}
        songObject={songObject}
      />
    </div>
  );
}

function SourceForm({ soundtrackOptions, songObject }) {
  
  function getSongSources(songObject) {
    let sourceList = []
    songObject.sources.forEach((source)=>{sourceList.push(source.soundtrack_id)})
    return sourceList
  }

  
  
  const handleChange=(value,e)=> {
    console.log("value is : ", value);
    console.log("e : ", e);
    // // form.setFieldsValue({
    // //   [e, "intensity"]: value
    // });
    
}
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
      <Form.List name="sources" >
        {(fields, { add, remove }) => (
          <Space style={{ rowGap: 32 }} direction="vertical">
            {fields.map((field) => (
              <Card key={field.key}>
                <center align="right">
                  <CloseOutlined onClick={() => remove(field.name)} />
                </center>
                <Space>
                  <Form.Item
                    label="Video Id"
                    name={[field.name, "video_id"]}
                    rules={[
                      {
                        required: true,
                        message: "Please enter a video id",
                      },
                    ]}
                  >
                    <Input></Input>
                  </Form.Item>
                  <Form.Item
                    label="Source Type"
                    name={[field.name, "source_type"]}
                  >
                    <Select placeholder="Youtube">
                      <Select.Option value="Youtube">Youtube</Select.Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label="Track number"
                    name={[field.name, "track_number"]}
                  >
                    <Input></Input>
                  </Form.Item>

                  <Form.Item label="Intensity" name={[field.name, "intensity"]} initialValue={"None"} noStyle> 
                  
                    
                      <Select onChange={(value,name)=>handleChange(value,field.name)}>
                        <Select.Option value="None">
                          Select an Intensity
                        </Select.Option>
                        <Select.Option value="Ambient">Ambient</Select.Option>
                        <Select.Option value="Tension">Tension</Select.Option>
                        <Select.Option value="Action">Action</Select.Option>
                        <Select.Option value="High Action">
                          High Action
                        </Select.Option>
                        <Select.Option value="Heavy Action">
                          Heavy Action
                        </Select.Option>
                        <Select.Option value="Light Action">
                          Light Action
                        </Select.Option>
                      </Select>
                  
                  </Form.Item>
                </Space>

                <Form.Item
                  label="Is it an official release"
                  name={[field.name, "is_official"]}
                  valuePropName="checked"
                >
                  <Checkbox></Checkbox>
                </Form.Item>

                <Form.Item label="Soundtrack" name={[field.name, "soundtrack_id"]} noStyle initialValue={false} >
                  
                    <Select
                      // mode="multiple"
                      options={soundtrackOptions}
                      //value={soundtrackOptions.value}
                    
                      onChange={(value,name)=>handleChange(value,field.name)}
                    >
                    

                    </Select>
                  
                </Form.Item>
              </Card>
            ))}

            <Button
              type="default"
              onClick={() => {
                add({ source_type: "Youtube" });
              }}
            >
              Add New Source
            </Button>
          </Space>
        )}
      </Form.List>
    </Card>
  );
}

export default AddSongForm;
