import React, {useState} from "react";
import { Form, Input, DatePicker, Radio, Button } from "antd";
import { addNewSoundtrack } from "./APICalls";

function AddSoundtrackForm() {
    const [game, setGame] = useState(2);

    const onChange = (e) => {
        setGame(e.target.value);
    }

    const submitSoundtrack = async (values) => {
        console.log(values);
        const response = await addNewSoundtrack(values.title, values.release_date.format('DD-MM-YYYY'), values.game, values.api_key);
        console.log('submitted',response);
    }

    return (
        <>
        <Form layout = 'inline' onFinish = {submitSoundtrack}>
            <Form.Item label = 'Title' name = 'title' required>
                <Input/>
            </Form.Item>
            <Form.Item label = 'Release Date' name = 'release_date' required>
                <DatePicker picker = 'month'/>
            </Form.Item>
            <Form.Item label = 'Game' name = 'game' required>
                <Radio.Group onChange={onChange} value={game}>
                    <Radio value={1}>Destiny 1</Radio>
                    <Radio value={2}>Destiny 2</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item label = 'API Key' name = 'api_key' required>
                <Input />
            </Form.Item>
            <Button htmlType="submit" >Submit</Button>
        </Form>
        
        </>
    )
}

export default AddSoundtrackForm