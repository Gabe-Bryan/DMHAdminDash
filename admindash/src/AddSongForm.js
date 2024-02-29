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
    getVideoDuration,
} from "./APICalls";
import { CloseOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { YearPicker } = DatePicker;

const onFinish = async (values, _id, refreshFunction, setOpen, resetFields) => {
    notification.info({
        message: "Waiting on response from the server",
        placement: "top",
        duration: 3
    });
    let sourcesArray = [];
    if (values.sources) {
        let regex = /youtu(?:.*\/v\/|.*v\=|\.be\/)([A-Za-z0-9_\-]{11})/
        for (const source of values.sources) {
            if (source.video_id) {
                source.video_id = source.video_id.match(regex) ? source.video_id.match(regex)[1] : source.video_id;
                source.duration = await getVideoDuration(source.video_id);
                //Replace this jank error solution at some point (we want all errors to be displayed together)
                if (source.duration.error) {
                    notification.error({
                        message: <div style={{ color: "white" }}>{source.duration.error}</div>,
                        style: {
                            backgroundColor: "#CA3C25",
                        },
                        placement: "top",
                        duration: 3,
                    });
                    throw new Error(source.duration.error);
                }
            }
            const changedSource = {
                video_id: source.video_id,
                source_type: source.source_type,
                intensity: source.intensity,
                add_layers: source.add_layers,
                track_number: parseInt(source.track_number) ? parseInt(source.track_number) : undefined,
                is_official: source.is_official,
                version_title: source.version_title,
                soundtrack_id: source.soundtrack_id ? source.soundtrack_id : undefined,
                duration: source.duration
            };
            if (source.intensity === "None") {
                delete changedSource.intensity;
            }
            if (source.add_layers === "None") {
                delete changedSource.add_layers;
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
                release_year: values.release_year === undefined ? undefined : values.release_year.format("YYYY"),
                implementation_year: values.implementation_year === undefined ? undefined : values.implementation_year.format("YYYY"),
                destination: values.destination,
                faction: values.faction,
            },
            sourcesArray
        );
    } else {
        console.log("sending post request...", _id);
        response = await addNewSongTitleSimple(
            values.song_title,
            {
                lead_composer: values.lead_composer,
                other_credits: values.other_credits,
                game: values.game,
                release_year: values.release_year === undefined ? undefined : values.release_year.format("YYYY"),
                implementation_year: values.implementation_year === undefined ? undefined : values.implementation_year.format("YYYY"),
                destination: values.destination,
                faction: values.faction,
            },
            sourcesArray,
        );
    }
    console.log(response);
    if (!response.errors) {
        notification.success({ message: "Song patch/post successful!", duration: 3 });
        refreshFunction();
        setOpen(false);
        if (!_id) {
            resetFields();
        }
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
            style: {
                backgroundColor: "#CA3C25",
            },
            placement: "top",
            duration: 3,
        });
        throw new Error('Schema validation failed');
    }
};

const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
};

const config = {
    rules: [
        {
            type: "object",
            required: false,
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

let inputStyle = {
    // width: "20rem",
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
    const soundtrackOptions = [{ value: false, label: "Select a soundtrack" },
    ...new Set(
        soundtrackCopy.map((item) => ({ value: item._id, label: item.title }))
    ),
    ];

    const currentTheme = lightMode;
    return (
        <Modal
            open={open}
            width={"50%"}
            okText="Send Music To Database"
            cancelText="Cancel"
            onCancel={() => onCancel(form)}
            onOk={async () => {
                form
                    .validateFields()
                    .then(async (values) => {
                        await onFinish(values, _id, refreshFunction, setOpen, form.resetFields);
                    })
                    .catch((info) => {
                        console.log("Validate Failed:", info);
                    });
            }}
        >
            <div>

                <ConfigProvider theme={currentTheme}>
                    <Form
                        form={form}
                        // onFinish={(values) => onFinish(values, _id)}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 12 }}
                        // style={{maxWidth: "100%"}}

                        onFinishFailed={onFinishFailed}
                        initialValues={contents}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Track group title"
                            name="song_title"
                            valuePropName="value"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your Song Title!",
                                },
                            ]}
                        >
                            <Input placeholder="Track group title" style={inputStyle} />
                        </Form.Item>
                        <Form.Item
                            label="Composers"
                            name="lead_composer"
                            valuePropName="value"
                        // rules={[
                        // 	{
                        // 		required: true,
                        // 		message: "Please input your Composers!",
                        // 	},
                        // ]}
                        >
                            <Input placeholder="Composers" style={inputStyle} />
                        </Form.Item>

                        <Form.Item
                            label="Other Credits"
                            name="other_credits"
                            valuePropName="value"
                        >
                            <Input placeholder="Other Credits" disabled style={inputStyle} ></Input>
                        </Form.Item>

                        {/* <Space.Compact style={{ width: "100%" }}> */}
                        <Form.Item
                            name="release_year"
                            label="Release Year"
                            valuePropName="value"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select the Release Year!",
                                }
                            ]}
                        // {...config}
                        >
                            <YearPicker />
                        </Form.Item>
                        <Form.Item

                            name="implementation_year"
                            label="Add-to-game Year"
                            valuePropName="value"
                            {...config}
                        >
                            <YearPicker disabled />
                        </Form.Item>
                        {/* </Space.Compact> */}
                        <Form.Item
                            name="game"
                            label="Game"
                            valuePropName="value"
                        // rules={[
                        // 	{
                        // 		required: true,
                        // 		message: "Please input the Game!",
                        // 	},
                        // ]}

                        >
                            <Radio.Group>
                                <Radio value="1">Destiny 1</Radio>
                                <Radio value="2">Destiny 2</Radio>
                                <Radio value="0" checked>Other</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                            name="destination"
                            label="Destination"
                            valuePropName="value"
                        >
                            <Input placeholder="Destination" style={inputStyle} ></Input>
                        </Form.Item>
                        <Form.Item name="faction" label="Faction" valuePropName="value">
                            <Input placeholder="Faction" style={inputStyle} ></Input>
                        </Form.Item>


                        <Space
                            direction="vertical"
                            size="large"
                            style={{ display: "flex" }}
                        >
                            <div style={{ width: "90%" }}>
                                <SourceForm soundtrackOptions={soundtrackOptions} songObject={songObject} />
                            </div>
                        </Space>
                    </Form>
                </ConfigProvider>
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
            const values = songObject;
            setContents({
                song_title: values.title,
                lead_composer: values.meta_data.lead_composer,
                other_credits: values.meta_data.other_credits,
                game: values.meta_data.game,
                release_year: values.meta_data.release_year === undefined ? undefined : dayjs(values.meta_data.release_year, "YYYY"),
                implementation_year: values.meta_data.implementation_year === undefined ? undefined : dayjs(values.meta_data.implementation_year, "YYYY"),
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
        songObject.sources.forEach((source) => { sourceList.push(source.soundtrack_id) })
        return sourceList
    }



    const handleChange = (value, e) => {
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
            <center>
                <Form.List name="sources" style={{ border: "solid 1rem lime", width: "900px" }}>
                    {(fields, { add, remove }) => (
                        <Space style={{ rowGap: 32 }} direction="vertical">
                            {fields.map((field) => (
                                <Card key={field.key}>
                                    <center align="right">
                                        <CloseOutlined onClick={() => remove(field.name)} />
                                    </center>
                                    {/* <Space> */}
                                    <Form.Item
                                        label="video id/url"
                                        name={[field.name, "video_id"]}
                                    >
                                        <Input style={inputStyle} ></Input>
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
                                        <Input style={inputStyle} ></Input>
                                    </Form.Item>


                                    <Form.Item label="Intensity" name={[field.name, "intensity"]}>


                                        <Select onChange={(value, name) => handleChange(value, field.name)} mode="multiple" placeholder="Select an Intensity">
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
                                            <Select.Option value="Soundtrack Edition">
                                                Soundtrack Edition
                                            </Select.Option>
                                            <Select.Option value="Game Version">
                                                Game Version
                                            </Select.Option>
                                        </Select>

                                    </Form.Item>
                                    <Form.Item label="Additional Layers" name={[field.name, "add_layers"]}>
                                        <Select onChange={(value, name) => handleChange(value, field.name)} mode="multiple" placeholder="Select additional layers">
                                            <Select.Option value="+Action Layer">+Action Layer</Select.Option>
                                            <Select.Option value="+High Action Layer">+High Action Layer</Select.Option>
                                            <Select.Option value="+Heavy Action Layer">+Heavy Action Layer</Select.Option>
                                        </Select>
                                    </Form.Item>
                                    <Space>
                                        <Form.Item
                                            label="Alternate Version Title"
                                            name={[field.name, "version_title"]}
                                        >
                                            <Input></Input>
                                        </Form.Item>
                                        <Form.Item
                                            label="Is it an official release"
                                            name={[field.name, "is_official"]}
                                            valuePropName="checked"
                                        >
                                            <Checkbox></Checkbox>
                                        </Form.Item>
                                    </Space>


                                    <Form.Item label="Soundtrack" name={[field.name, "soundtrack_id"]} initialValue={false} required>

                                        <Select
                                            // mode="multiple"
                                            options={soundtrackOptions}
                                            //value={soundtrackOptions.value}

                                            onChange={(value, name) => handleChange(value, field.name)}
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
            </center>
        </Card >
    );
}

export default AddSongForm;
