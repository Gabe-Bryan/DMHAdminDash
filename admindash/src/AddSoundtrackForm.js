import React, {useState} from "react";
import { Form, Input, DatePicker, Radio, Button, Modal, notification} from "antd";
import { addNewSoundtrack } from "./APICalls";

function SoundtrackForm({open, onCancel, onFinish}) {
    const [game, setGame] = useState(2);
    const [form] = Form.useForm();

    const onChange = (e) => {
        setGame(e.target.value);
    }

    
    const reqRules = [{
        required: true,
        message: 'Please complete field.'
    }];

    return (
        <Modal
            open={open}
            width={"100%"}
            okText="Submit"
            cancelText="Cancel"
            onCancel={onCancel}
            onOk={async () => {
            form
                .validateFields()
                .then(async (values) => {
                    await onFinish(values);
                })
                .catch((info) => {
                console.log("Validate Failed:", info);
                });
            }}
        >
            <Form form = {form} layout = 'inline'>
                <Form.Item label = 'Title' name = 'title' rules = {reqRules}>
                    <Input/>
                </Form.Item>
                <Form.Item label = 'Release Date' name = 'release_date' rules = {reqRules}>
                    <DatePicker picker = 'month'/>
                </Form.Item>
                <Form.Item label = 'Game' name = 'game' rules = {reqRules}>
                    <Radio.Group onChange={onChange} value={game}>
                        <Radio value={1}>Destiny 1</Radio>
                        <Radio value={2}>Destiny 2</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label = 'API Key' name = 'api_key' rules = {reqRules}>
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    )
}

function AddSoundtrackForm () {
    const [open, setOpen] = useState(false);
    const submitSoundtrack = async (values) => {
        console.log(values);
        const response = await addNewSoundtrack(values.title, values.release_date.format('DD-MM-YYYY'), values.game, values.api_key);
        console.log('submitted',response);
        if (!response.errors) {setOpen(false);}
        else {
            notification.error({
                message: "Title is already in use!",
                placement: "top",
                duration: 3
            });
        }
    }
    return (
        <div>
          <Button
            type="primary"
            onClick={() => {
              setOpen(true);
            }}
          >
            New Soundtrack
          </Button>
          <SoundtrackForm
            open={open}
            onFinish = {submitSoundtrack}
            onCancel={() => {
              setOpen(false);
            }}
          />
        </div>
      );
}

export default AddSoundtrackForm