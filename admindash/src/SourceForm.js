import { 
    Button, Input, Space,
    Form, Card, Select,
    Checkbox,
} from "antd";

import { CloseOutlined } from "@ant-design/icons";


export function SourceForm({ soundtrackOptions }) {
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
                // borderColor: "#E8D8E6",
            }}
            bodyStyle={{ 
                backgroundColor: "#E8D8E6", 
                // borderColor: "#E8D8E6" 
            }}
            bordered={false}
            // style={{padding: "auto"}}
        >
            <center>
                <Form.List name="sources" style={{ border: "solid 1rem lime", width: "90%"}}>
                    {(fields, { add, remove }) => (
                        <div>
                            {fields.map((field) => (
                                <Card key={field.key} style = {{width: "80%", marginBottom: "2rem" }}>
                                    <div align="right">
                                        <CloseOutlined onClick={() => remove(field.name)} />
                                    </div>
                                    {/* <Space> */}
                                    <Form.Item
                                        label="video id/url"
                                        name={[field.name, "video_id"]}
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
                        </div>
                    )}
                </Form.List>
            </center>
        </Card >
    );
}