import React, { useState } from "react";
import { FaEnvelope, FaClock, FaUpload } from "react-icons/fa";
// import "./ProfileSettings.css";

export default function ProfileComp() {
  const [preview, setPreview] = useState(null);
  const [bio, setBio] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="profile-wrapper">
      {/* Header */}
      <div className="profile-header">
        <div>
          <h2 className="title">Personal info</h2>
          <p className="subtitle">
            Update your photo and personal details here.
          </p>
        </div>

        <div className="header-buttons">
          <button className="btn btn-cancel">Cancel</button>
          <button className="btn btn-save">Save</button>
        </div>
      </div>

      {/* Form */}
      <form className="profile-form">
        {/* Name */}
        <div className="form-row">
          <div className="form-group">
            <label>Name</label>
            <input type="text" placeholder="Oliva" />
          </div>
          <div className="form-group">
            <label>&nbsp;</label>
            <input type="text" placeholder="Rhye" />
          </div>
        </div>

        {/* Email */}
        <div className="form-group">
          <label>Email address</label>
          <div className="input-icon">
            <FaEnvelope />
            <input type="email" placeholder="olivia@xyz.com" />
          </div>
        </div>

    

        {/* Role */}
        <div className="form-group">
          <label>Role</label>
          <input type="text" placeholder="Admin" />
        </div>

        {/* Country */}
        <div className="form-group">
          <label>Country</label>
          <select>
            <option>Australia 🇦🇺</option>
            <option>United States 🇺🇸</option>
            <option>United Kingdom 🇬🇧</option>
            <option>Pakistan 🇵🇰</option>
          </select>
        </div>

        {/* Timezone */}
        <div className="form-group">
          <label>Timezone</label>
          <div className="input-icon">
            <FaClock />
            <select>
              <option>Pacific Standard Time (PST) UTC−08:00</option>
              <option>Greenwich Mean Time (GMT) UTC+00:00</option>
              <option>Pakistan Standard Time (PKT) UTC+05:00</option>
            </select>
          </div>
        </div>

        {/* Bio */}
        <div className="form-group">
          <label>Bio</label>
          <p className="helper-text">Write a short introduction.</p>
          <textarea
            rows="4"
            placeholder="Lorem Ipsum..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <div className="char-count">
            {275 - bio.length} characters left
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="form-footer">
          <button className="btn btn-cancel">Cancel</button>
          <button className="btn btn-save">Save</button>
        </div>
      </form>
    </div>
  );
}
