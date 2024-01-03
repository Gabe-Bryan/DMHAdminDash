import React, { useState } from "react";
import {Button,Input,Space,ConfigProvider,theme,Form,DatePicker,Radio,Card,notification,Modal} from "antd";
import { Content } from "antd/es/layout/layout";
import {getSongs,getSong, getAllSongs,addNewSongTitleSimple,addNewSongURL} from "./APICalls";
import { CloseOutlined } from "@ant-design/icons";

const { YearPicker } = DatePicker;

const onFinish = async (values) => {
  notification.info({
    message: "Waiting on response from the server",
    placement: "top",
  });
  let sourcesArray = [];
  if (values.sources) {
    for (const source of values.sources) {
      sourcesArray.push({
        video_id: source.video_id,
        source_type: source.source_type,
        alt_theme: source.alt_theme,
        official_title: source.official_title,
      });
    }
  }

  const addNewSong = await addNewSongTitleSimple(
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
  if (!addNewSong.errors) {
    notification.success("Song was added to Database");
  } else {
    notification.error({
      message: <div style={{ color: "#7458e2" }}>{addNewSong.errors}</div>,

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

function SongForm({ open, onFinish, onCancel, isEdit = false, contents = []}) {
  const [form] = Form.useForm();
  console.log(contents);
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
            await onFinish(values);
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
              name="time_related_controls"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              initialValues = {contents}
              autoComplete="off"
            >
              <Form.Item
                label="Song Title"
                name="song_title"
                rules={[
                  {
                    required: true,
                    message: "Please input your Song Title!",
                  },
                ]}
              >
                <Content>
                  <Space.Compact style={{ width: "100%" }}>
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
                    message: "Please input your Lead Composer!",
                  },
                ]}
              >
                <Content>
                  <Space.Compact style={{ width: "100%" }}>
                    <Input placeholder="Lead Composer" />
                  </Space.Compact>
                </Content>
              </Form.Item>

              <Space.Compact style={{ width: "100%" }}>
                <Form.Item
                  name="release_year"
                  label="Year Of Song Released"
                  {...config}
                >
                  <YearPicker />
                </Form.Item>
                <Form.Item
                  name="game"
                  label="Game"
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

              <div style={{ width: "80%" }}>
                <SourceForm />
              </div>
              
                
                  
                    <Form.Item
                      label="API Key"
                      name="api_key"
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
function AddSongForm({isEdit = false, _id = undefined}) {
  const [open, setOpen] = useState(false);
  const [contents, setContents] = useState([]);
  const openForm = async () =>
  {
    if (isEdit && _id) {
      const values = await getSong(_id);
      const newContents =  {song_title: 'A song'};
      setContents(newContents);
    } else{
      console.log(_id);
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
        {isEdit ? 'edit' : 'New Song'}
      </Button>
      <SongForm
        open={open}
        onFinish={onFinish}
        contents = {contents}
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
                      mesage: "Please enter a video id"
                    }
                  ]}
                >
                  <Input></Input>
                </Form.Item>
                <Form.Item
                  label="Source Type"
                  name={[field.name, "source_type"]}
                  rules = {[
                    {
                      required: true,
                      mesage: "Please enter a source type"
                    }
                  ]}
                >
                  <Input></Input>
                </Form.Item>
                <Form.Item
                  label="Alternative Theme"
                  name={[field.name, "alt_theme"]}
                >
                  <Input></Input>
                </Form.Item>
                <Form.Item
                  label="Official Title"
                  name={[field.name, "official_title"]}
                >
                  <Input></Input>
                </Form.Item>
                <center>
                  <CloseOutlined onClick={() => remove(field.name)} />
                </center>
              </Space>
            ))}

            <Button type="default" onClick={add}>
              Add New Source
            </Button>
          </div>
        )}
      </Form.List>
    </Card>
  );
}

export default AddSongForm;
