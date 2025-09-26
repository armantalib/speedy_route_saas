import React, { useState } from "react";
import { Modal, Input, Upload, Button, Form, Select } from "antd";
import { UploadOutlined, InboxOutlined } from "@ant-design/icons";
import "./AddDriverModal.css";
import { dataPost } from "../../utils/myAxios";
import { CircularProgress } from '@mui/material'

const { Dragger } = Upload;

const AddDriverModal = ({ visible, onCancel, onClose }) => {
  const [form] = Form.useForm();
  const [loader, setLoader] = useState(false)

  const handleFinish = async (values) => {
    setLoader(true)
    console.log("Driver added:", values);
    const endPoint = `users/signup/driver`;
    let data1 = {
      name: values?.name,
      email: values?.email,
      password: values?.password,
      licenseNumber: values?.licenseNumber,
      tags: values?.tags,
      phone: values?.phone,
      licenseFile: '',
    }
    const response = await dataPost(endPoint, data1)

    setLoader(false)
    onClose();
    // form.resetFields();
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
        <h2>Add New Driver</h2>
        <p>Sorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>

      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <div className="form-grid">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input placeholder="John" />
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
          <Form.Item name="licenseNumber" label="License Number">
            <Input />
          </Form.Item>
          <Form.Item name="tags" label="Tags">
            <Select placeholder="Full-time">
              <Select.Option value="full-time">Full-time</Select.Option>
              <Select.Option value="part-time">Part-time</Select.Option>
              <Select.Option value="contractor">Contractor</Select.Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item name="licenseFile" label="Driver License PDF (Optional)">
          <Dragger
            name="file"
            multiple={false}
            maxCount={1}
            accept=".png,.pdf"
            beforeUpload={() => false}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Drop your document here, or <span className="browse">browse</span>
            </p>
            <p className="ant-upload-hint">PNG, Max size: 5MB</p>
          </Dragger>
        </Form.Item>

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
