import React, {useState} from "react";
import { Form, Input, DatePicker, Radio, Button, Modal, notification} from "antd";
import { addNewSoundtrack, getSoundtrack, editSoundtrack} from "./APICalls";
import dayjs from 'dayjs';

function SoundtrackForm({open, onCancel, onFinish, contents}) {
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
            width={"50%"}
            okText="Submit"
            cancelText="Cancel"
            onCancel={() => onCancel(form)}
            onOk={async () => {
            form
                .validateFields()
                .then(async (values) => {
                    await onFinish(values, form);
                })
                .catch((info) => {
                console.log("Validate Failed:", info);
                });
            }}
        >
            <Form form = {form} layout = 'inline' initialValues={contents}>
                <Form.Item label = 'Title' name = 'title' rules = {reqRules}>
                    <Input/>
                </Form.Item>
                <Form.Item label = 'Release Date' name = 'release_date' rules = {reqRules}>
                    <DatePicker format = 'MM-DD-YYYY'/>
                </Form.Item>
                <Form.Item label = 'Game' name = 'game' rules = {reqRules}>
                    <Radio.Group onChange={onChange} value={game}>
                        <Radio value={1}>Destiny 1</Radio>
                        <Radio value={2}>Destiny 2</Radio>
                    </Radio.Group>
                </Form.Item>
            </Form>
        </Modal>
    )
}

function AddSoundtrackForm ({edit_id = undefined, refreshFunction}) {
    const [open, setOpen] = useState(false);
    const [contents, setContents] = useState({});
    const submitSoundtrack = async (values, form) => {
        console.log(values);
        let response;
        if (edit_id){
            response = await editSoundtrack(edit_id, values.title, values.game, values.release_date.format('MM-DD-YYYY'));
        }
        else {
            response = await addNewSoundtrack(values.title, values.release_date.format('MM-DD-YYYY'), values.game);
        }
        console.log('submitted',response);
        if (!response.error) {
            notification.success({
                message: "Successfully updated soundtracks",
                placement: 'top',
                duration: 3
            })
            setOpen(false);
            if (!edit_id)
                form.resetFields();
            refreshFunction();
        }
        else {
            notification.error({
                message: "Title is already in use!",
                placement: "top",
                duration: 3
            });
        }
    }

    const openForm = async () => {
        if (edit_id) {
            console.log('getting soundtrack...');
            const values = await getSoundtrack(edit_id);
            console.log(values);
            setContents({title: values.title, game: values.game,
                         release_date:  dayjs(values.release_date, 'MM-DD-YYYY')});
        }
        console.log(edit_id);
        setOpen(true);
    }

    return (
        <div>
          <Button
            type="primary"
            onClick={openForm}
          >
            {edit_id ? "edit" : "New Soundtrack"}
          </Button>
          <SoundtrackForm
            open={open}
            onFinish = {submitSoundtrack}
            onCancel={(form) => {
                form.resetFields();
                setOpen(false);
            }}
            contents = {contents}

          />
        </div>
      );
}

export default AddSoundtrackForm