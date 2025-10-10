import React, { useEffect, useState } from "react";
import { Modal, Input, Upload, Button, Form, Select, message } from "antd";
import { UploadOutlined, InboxOutlined } from "@ant-design/icons";
import { CircularProgress } from "@mui/material";
import "./AddDriverModal.css";
import { dataPut } from "../../utils/myAxios"; // ✅ use PUT for updating

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
        licenseNumber: dataFill?.licenseNumber || "",
        tags: dataFill?.tags || "",
        isAppAllow: dataFill?.isAppAllow || "",
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
        licenseNumber: values?.licenseNumber,
        tags: values?.tags,
        phone: values?.phone,
        isAppAllow: values?.isAppAllow,
      };

      const response = await dataPut(endPoint, updatedData);

      if (response?.data?.success) {
        message.success("Driver updated successfully!");
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
        <h2>Edit Driver</h2>
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

          <Form.Item name="licenseNumber" label="License Number">
            <Input placeholder="DL123456" />
          </Form.Item>

          <Form.Item name="tags" label="Tags">
            <Select placeholder="Select type">
              <Select.Option value="full-time">Full-time</Select.Option>
              <Select.Option value="part-time">Part-time</Select.Option>
              <Select.Option value="contractor">Contractor</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="isAppAllow" label="App Access">
            <Select placeholder="Allow Access">
              <Select.Option value={true}>Allow Access</Select.Option>
              <Select.Option value={false}>No Allow</Select.Option>
            </Select>
          </Form.Item>
        </div>

        {/* <Form.Item name="licenseFile" label="Driver License PDF (Optional)">
          <Dragger
            name="file"
            multiple={false}
            maxCount={1}
            accept=".png,.pdf"
            beforeUpload={() => false} // prevent auto upload
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Drop your document here, or <span className="browse">browse</span>
            </p>
            <p className="ant-upload-hint">PNG or PDF, Max size: 5MB</p>
          </Dragger>
        </Form.Item> */}

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
