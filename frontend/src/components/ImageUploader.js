import React from 'react';

const ImageUploader = ({ label, onChange }) => (
  <div className="image-uploader">
    <label>{label}</label>
    <input type="file" accept="image/*" onChange={onChange} />
  </div>
);

export default ImageUploader;
