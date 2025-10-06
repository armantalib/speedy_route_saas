import React, { useState, useEffect } from "react";
import { Modal, Input, Upload, Button, Form, Select } from "antd";
import { UploadOutlined, InboxOutlined } from "@ant-design/icons";
import "./AddDriverModal.css";
import { dataGet_, dataPost } from "../../../utils/myAxios";
import { CircularProgress } from '@mui/material'

const { Dragger } = Upload;

const AddDriverModal = ({ visible, onCancel, onClose }) => {
  const [form] = Form.useForm();
  const [loader, setLoader] = useState(false)
  const [data, setData] = useState([])


  useEffect(() => {
    getUsers();
  }, [])



  const getUsers = async () => {
    const endPoint = `users/s-admin/clients/all/0`;
    const response = await dataGet_(endPoint, {});
    if (response?.data?.success) {
      setData(response?.data?.data)
    }
  }

  const handleFinish = async (values) => {
    setLoader(true)
    console.log("Driver added:", values);
    const endPoint = `company/create`;
    let data1 = {
      company_name: values?.name,
      user: values?.user,
      plan: values?.plan,
    }
    const response = await dataPost(endPoint, data1)
    

    setLoader(false)
    onClose();
    form.resetFields();
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
        <h2>Add New Company</h2>
        <p>Sorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>

      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <div className="form-grid">
          <Form.Item name="name" label="Company Name" rules={[{ required: true }]}>
            <Input placeholder="John"
            />
          </Form.Item>
          <Form.Item name="plan" label="Plan">
            <Select placeholder="Select Plan">
              <Select.Option value="trial">Trial</Select.Option>
              <Select.Option value="pro">Pro</Select.Option>
              <Select.Option value="enterprise">Enterprise</Select.Option>
              <Select.Option value="basic">Basic</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="user" label="User">
            <Select placeholder="Select User">
              {data.map((item, index) => (
                <Select.Option value={item?._id}>{item?.name}</Select.Option>
              ))}
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
