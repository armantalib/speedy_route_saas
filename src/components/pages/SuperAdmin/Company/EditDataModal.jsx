import React, { useEffect, useState } from "react";
import { Modal, Input, Upload, Button, Form, Select, message } from "antd";
import { UploadOutlined, InboxOutlined } from "@ant-design/icons";
import { CircularProgress } from "@mui/material";
import "./AddDriverModal.css";
import { dataGet_, dataPut } from "../../../utils/myAxios"; // ✅ use PUT for updating

const { Dragger } = Upload;

const EditDataModal = ({ visible, onCancel, onClose, dataFill }) => {
  const [form] = Form.useForm();
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState([])

  // ✅ Pre-fill form when modal opens or dataFill changes
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

  useEffect(() => {
    if (dataFill) {
      form.setFieldsValue({
        name: dataFill?.company_name || "",
        user: dataFill?.user?._id || "",
        plan: dataFill?.plan || "",
      });
    }
  }, [dataFill, form]);

  const handleFinish = async (values) => {
    try {
      setLoader(true);
      const endPoint = `company/s-admin/${dataFill?._id}`; // ✅ Update endpoint
      const endPoint2 = `users/update-user/admin/${values?.user}`;
      const updatedData = {
        company_name: values?.name,
        user: values?.user,
        plan: values?.plan,
      };

      const response = await dataPut(endPoint, updatedData);
      const response2 = await dataPut(endPoint2, {company:dataFill?._id});

      if (response?.data?.success) {
        message.success("Data updated successfully!");
        onClose();
      } else {
        message.error("Failed to update driver");
      }
    } catch (error) {
      console.error(error);
      message.error("Error while updating driver");
    } finally {
      setLoader(false);
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={520}
      className="add-driver-modal"
      destroyOnClose
    >
      <div className="modal-header">
        <div className="icon-circle">
          <UploadOutlined />
        </div>
        <h2>Edit Company</h2>
        <p>Update driver details below.</p>
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
            {loader ? <CircularProgress size={18} className="text_white" /> : "Update"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default EditDataModal;
