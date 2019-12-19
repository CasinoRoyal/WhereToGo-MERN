import React, { useRef, useState, useEffect } from 'react';

import Button from './Button';
import './ImageUpload.css';

const ImageUpload = props => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isValid, setIsValid] = useState(null);

  const filePickerRef = useRef();

  useEffect(() => {
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = () => setImageUrl(fileReader.result);
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = (e) => {
    let fileUser;
    let valid;
    if(e.target.files && e.target.files.length === 1) {
      fileUser = e.target.files[0];
      setFile(fileUser);
      setIsValid(true);
      valid = true;
    } else {
      setIsValid(false);
      valid = false
    }
    
    props.onInput(props.id, fileUser, valid)
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };
  return (
    <div className="form-control">
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: 'none' }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && 'center'}`}>
        <div className="image-upload__preview">
          {imageUrl && <img src={imageUrl} alt="Preview" />}
          {!imageUrl && <p>Choose a pic</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>PICK IMAGE</Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
