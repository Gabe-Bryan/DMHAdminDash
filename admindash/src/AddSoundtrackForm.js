import React, {useState} from "react";
import { Form, Input, DatePicker, Radio } from "antd";

function AddSoundtrackForm() {
    const [game, setGame] = useState(2);

    const onChange = (e) => {
        setGame(e.target.value);
    }

    return (
        <Form layout = 'inline'>
            <Form.Item label = 'Title' name = 'title'>
                <Input/>
            </Form.Item>
            <Form.Item label = 'Release Date' name = 'release date'>
                <DatePicker picker = 'month'/>
            </Form.Item>
            <Form.Item label = 'Game' name = 'game'>
                <Radio.Group onChange={onChange} value={game}>
                    <Radio value={1}>Destiny 1</Radio>
                    <Radio value={2}>Destiny 2</Radio>
                </Radio.Group>
            </Form.Item>
        </Form>
    )
}

export default AddSoundtrackForm