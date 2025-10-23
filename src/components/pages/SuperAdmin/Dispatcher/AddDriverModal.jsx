import React, { useState } from "react";
import { Modal, Input, Upload, Button, Form, Select, message } from "antd";
import { UploadOutlined, InboxOutlined } from "@ant-design/icons";
import "./AddDriverModal.css";
import { dataPost } from "../../../utils/myAxios";
import { CircularProgress } from '@mui/material'

const { Dragger } = Upload;

const AddDriverModal = ({ visible, onCancel, onClose }) => {
  const [form] = Form.useForm();
  const [loader, setLoader] = useState(false)

  const handleFinish = async (values) => {
    setLoader(true)
    console.log("Driver added:", values);
    const endPoint = `users/signup/driver/dispatcher`;
    let data1 = {
      name: values?.name,
      email: values?.email,
      password: values?.password,
      licenseNumber: '',
      tags: '',
      phone: values?.phone,
      licenseFile: '',
      dispatcherAccess: values?.dispatcherAccess,
      isAppAllow: false
    }
    const response = await dataPost(endPoint, data1)
    setLoader(false)
    if (response?.data?.success) {
      onClose();
    form.resetFields();
    } else {
      message.error(response?.data?.message)
    }


  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}

      width={520}
      className="add-driver-modal"
    >
      <div className="modal-header">
        <div className="icon-circle">
          <UploadOutlined />
        </div>
        <h2>Add New Dispatcher</h2>
        <p>Sorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>

      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <div className="form-grid">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input placeholder="John"
            />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input placeholder="John@email.com" />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <Input placeholder="********" />
          </Form.Item>
          <Form.Item name="phone" label="Phone Number">
            <Input placeholder="+1 (___) ___-____" />
          </Form.Item>

          <Form.Item name="dispatcherAccess" label="Access" rules={[{ required: true }]}>
            <Select placeholder="Please select">
              <Select.Option value={'limited'}>Limited Access</Select.Option>
              <Select.Option value={'full'}>Full Access</Select.Option>
            </Select>
          </Form.Item>


        </div>



        <div className="form-footer">
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit">
            {loader ?
              <CircularProgress size={18} className='text_white' /> :

              'Add'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddDriverModal;
