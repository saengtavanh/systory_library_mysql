import React, { useRef, useState, useEffect } from "react";
import "./FileInput.css";

const FileInput = (props) => {
  const inputRef = useRef();
  const [selectedFile, setSelectedFile] = useState([]);

  useEffect(() => {
    if (props.initialFiles) {
      let files = [];
      for (let [key, file] of props.initialFiles.entries()) {
        files.push(file);
      }
      setSelectedFile(files);
    }
  }, [props.initialFiles]);

  // Handle the change event when a file is selected
  const handleOnChange = (event) => {
    const filesArray = Array.from(event.target.files);
    let updatedFiles = "";
    if (selectedFile.length === 0) {
      updatedFiles = [...filesArray];
    } else {
      updatedFiles = [...selectedFile, ...filesArray];
    }
    setSelectedFile(updatedFiles);
    const formData = new FormData();
    for (let file of updatedFiles) {
      const blob = new Blob([file], { type: file.type });
      formData.append("files", blob, file.name);
    }
    props.onChangeFile(formData);
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  function removeFile(index) {
    let updatedFiles = [
      ...selectedFile.filter((item) => selectedFile.indexOf(item) != index),
    ];
    setSelectedFile(updatedFiles);
    const formData = new FormData();
    for (let file of updatedFiles) {
      const blob = new Blob([file], { type: file.type });
      formData.append("files", blob, file.name);
    }
    props.onRemoveFile(formData);
  }

  return (
    <div>
      {/* Hidden file input element */}
      <input
        type="file"
        ref={inputRef}
        onChange={handleOnChange}
        style={{ display: "none" }}
        multiple
      />

      {/* Button to trigger the file input dialog */}
      <button className="file-btn" onClick={onChooseFile}>
        <i className="fa-solid fa-cloud-arrow-up"></i> Upload File
      </button>

      {selectedFile &&
        selectedFile.length > 0 &&
        selectedFile.map((file, index) => (
          <div key={index + file.name} className="selected-file">
            <p>{file.name}</p>

            <button onClick={() => removeFile(index)}>
              <i className="fa-solid fa-trash-can"></i>
            </button>
          </div>
        ))}
    </div>
  );
};

export default FileInput;
