import React, { useEffect, useState } from "react";
import { Modal, Input, Upload, Button, Form, Select, message } from "antd";
import { UploadOutlined, InboxOutlined } from "@ant-design/icons";
import { CircularProgress } from "@mui/material";
import "./AddDriverModal.css";
import { dataPut } from "../../../utils/myAxios"; // ✅ use PUT for updating

const { Dragger } = Upload;

const EditDataModal = ({ visible, onCancel, onClose, dataFill }) => {
  const [form] = Form.useForm();
  const [loader, setLoader] = useState(false);

  // ✅ Pre-fill form when modal opens or dataFill changes
  useEffect(() => {
    if (dataFill) {
      form.setFieldsValue({
        name: dataFill?.name || "",
        email: dataFill?.email || "",
        phone: dataFill?.phone || "",
        status: dataFill?.status || "",
      });
    }
  }, [dataFill, form]);

  const handleFinish = async (values) => {
    try {
      setLoader(true);
      const endPoint = `users/update-user/admin/${dataFill?._id}`; // ✅ Update endpoint

      const updatedData = {
        name: values?.name,
        email: values?.email,
        phone: values?.phone,
        status:values?.status
      };

      const response = await dataPut(endPoint, updatedData);

      if (response?.data?.success) {
        message.success("Record updated successfully!");
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
        <h2>Edit Client</h2>
        <p>Update driver details below.</p>
      </div>

      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <div className="form-grid">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input placeholder="John" />
          </Form.Item>

          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input placeholder="john@email.com" />
          </Form.Item>



          <Form.Item name="phone" label="Phone Number">
            <Input placeholder="+1 (___) ___-____" />
          </Form.Item>

          <Form.Item name="status" label="Status">
            <Select placeholder="Select status">
              <Select.Option value="online">Active</Select.Option>
              <Select.Option value="deactivated">Deactivate</Select.Option>
              {/* <Select.Option value="contractor">Contractor</Select.Option> */}
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
