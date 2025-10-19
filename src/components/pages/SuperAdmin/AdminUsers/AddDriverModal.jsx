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
    const endPoint = `users/signup/admin`;
    let data1 = {
      name: values?.name,
      email: values?.email,
      password: values?.password,
      licenseNumber: '',
      tags: '',
      phone: values?.phone,
      licenseFile: '',
    }
    const res = await dataPost(endPoint, data1)
    if (res?.data.success) {
      let user = res?.data?.user;
      registerCompany(values, user)
    } else {
      message.error(res?.data?.message)
    }
    // form.resetFields();
  };

  const registerCompany = async (data, user) => {
    try {
      let data1 = {
        userId: user?._id,
        company_name: data?.company,
      }
      const endPoint = 'company/create'
      const res = await dataPost(endPoint, data1);

      if (res?.data.success) {
        message.success("Register Successful")
        setLoader(false)
        onClose();
      } else {
        message.error(res?.data?.message)
      }
    } catch (error) {
      message.error("Invalid credentials")
      console.log(error);
    } finally {

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
        <h2>Add New Client</h2>
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

          <Form.Item name="company" label="Company Name" rules={[{ required: true }]}>
            <Input placeholder="Please enter company name" />
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
