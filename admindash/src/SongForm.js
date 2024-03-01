import React, { useState} from "react";
import {
    Button, Input, Space,
    ConfigProvider, theme,
    Form, DatePicker, Radio,
    notification, Modal, Select
} from "antd";
import {
    editSong,
    addNewSongTitleSimple,
    getVideoDuration,
    getTags
} from "./APICalls";
import dayjs from "dayjs";
import { SourceForm } from "./SourceForm";

const { YearPicker } = DatePicker;

const tags = [];

const onFinish = async (values, _id, refreshFunction, setOpen, resetFields) => {
    const notifKey = 'submission'
    // notification.info();
    notification.info({
        key: notifKey,
        message: "Waiting on response from the server", duration: 3
    })

    //process all sources if they exist
    //extracts video id from a url
    let sourcesArray = await processSources(values.sources);
    
    const metaData = {
        lead_composer: values.lead_composer,
        game: values.game,
        release_year: values.release_year === undefined ? undefined : values.release_year.format("YYYY"),
        implementation_year: values.implementation_year === undefined ? undefined : values.implementation_year.format("YYYY"),
        destination: values.destination,
        faction: values.faction,
    };

    console.log("sources:", sourcesArray);
    let response;
    if (_id) {
        //Submit an edit
        response = await editSong( _id, values.song_title, metaData, sourcesArray);
    } else {
        //Submit a post
        response = await addNewSongTitleSimple(values.song_title, metaData, sourcesArray);
    }


    if (!response.errors) {
        notification.success({ key: notifKey, message: "Song patch/post successful!", duration: 3 });
        refreshFunction();
        setOpen(false);
        if (!_id) {
            resetFields();
        }
    } else {
        console.error("A song form submission error was caught!!! :(");
        let errorString = "";
        for (let error of response.errors) {
            let newError = "";
            for (let key of Object.keys(error)) {
                newError += key + ": " + error[key] + ", ";
            }
            newError = newError.slice(0, -2);
            if (errorString.length !== 0) {
                errorString += "\n";
            }
            errorString += newError;
        }
        notification.error({
            key: notifKey,
            message: <div style={{ color: "white" }}>{errorString}</div>,
            style: {
                backgroundColor: "#CA3C25",
            },
            duration: 3,
        });
        throw new Error('Schema validation failed');
    }
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

function SongForm({
    open, setOpen,
    onFinish, onCancel, refreshFunction,
    contents = {},
    _id = undefined, songObject, soundtrackData,
}) {
    const [form] = Form.useForm();
    const soundtrackCopy = [...soundtrackData];
    const soundtrackOptions = [{ value: false, label: "Select a soundtrack" },
    ...new Set(
        soundtrackCopy.map((item) => ({ value: item._id, label: item.title }))
    ),
    ];
    // const [subNotif, subNotifHolder] = notification.useNotification();

    const currentTheme = lightMode;
    return (
        <Modal
            open={open}
            width={"50%"}
            okText="Submit"
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
                {/* {subNotifHolder} */}
                <ConfigProvider theme={currentTheme}>
                    <Form
                        form={form}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 12 }}
                        onFinishFailed={(errorInfo) => console.log("Failed:", errorInfo)}
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
                            <Input placeholder="Track group title"  />
                        </Form.Item>
                        <Form.Item
                        label="Composers"
                        name="lead_composer"
                        valuePropName="value"
                        >
                            <Input placeholder="Composers" />
                        </Form.Item>
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
                        >
                            <YearPicker />
                        </Form.Item>
                    
                        <Form.Item
                            name="implementation_year"
                            label="Add-to-game Year"
                            valuePropName="value"
                            {...config}
                        >
                            <YearPicker />
                        </Form.Item>

                        <Form.Item
                            name="game"
                            label="Game"
                            valuePropName="value"
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
                            <Input placeholder="Destination" ></Input>
                        </Form.Item>

                        <Form.Item name="faction" label="Faction" valuePropName="value">
                            <Input placeholder="Faction" ></Input>
                        </Form.Item>

                        <Form.Item name="tags" label="Tags" valuePropName="value">
                            <Select mode = 'tags' options = {tags}/>
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
function SongFormButton({ edit_id = undefined, refreshFunction, soundtrackData, songObject }) {

    const [open, setOpen] = useState(false);
    const [contents, setContents] = useState({});
    const openForm = async () => {
        if (edit_id) {
            const values = songObject;
            setContents({
                song_title: values.title,
                lead_composer: values.meta_data.lead_composer,
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



const processSources = async (sources) => {
    let sourcesArray = [];
    if (sources) {
        let regex = /youtu(?:.*\/v\/|.*v\=|\.be\/)([A-Za-z0-9_\-]{11})/
        for (const source of sources) {
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
            sourcesArray.push(changedSource);
        }
    }
    return sourcesArray;
}

export default SongFormButton;