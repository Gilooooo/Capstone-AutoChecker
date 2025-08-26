
import React, { useState } from 'react';

const ImageUpload = ({ onImageSelect }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    setSelectedImage(imageFile);
    onImageSelect(imageFile);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {selectedImage && (
        <div>
          <p>Selected Image:</p>
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Selected Image"
            style={{ maxWidth: '100%' }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
