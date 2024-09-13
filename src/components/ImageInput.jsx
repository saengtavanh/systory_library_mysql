import React, { useEffect, useRef, useState } from "react";
import "./FileInput.css";

const ImageInput = (props) => {
  const inputRef = useRef();

  const [selectedImage, setSelectedImage] = useState(null);
  // console.log("iiioio",selectedImage);
  useEffect(() => {
    if (props.initialImage) {
      for (let [key, value] of props.initialImage.entries()) {
        // console.log(key, value);
        setSelectedImage(value);
      }
      
    }
  }, [props.initialImage]);

  // Handle the change event when a file is selected
  const handleOnChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const image = event.target.files[0];
      setSelectedImage(image);
      const formData = new FormData();
      const blob = new Blob([image], { type: image.type });
      formData.append("image", blob, image.name);
      props.onChangeImage(formData);
    }
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  function removePicture() {
    setSelectedImage(null);
    props.onRemoveImage(null);
  }

  return (
    <div>
      {/* Hidden file input element */}
      <input
        type="file"
        ref={inputRef}
        onChange={handleOnChange}
        style={{ display: "none" }}
        accept=".png, .jpg, .gif"
      />

      {/* Button to trigger the file input dialog */}
      <button className="file-btn" onClick={onChooseFile}>
        <i className="fa-solid fa-cloud-arrow-up"></i> Upload Image
      </button>

      {selectedImage && (
        <div className="selected-file">
          <p>{selectedImage.name}</p>

          <button onClick={() => removePicture()}>
            <i className="fa-solid fa-trash-can"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageInput;
