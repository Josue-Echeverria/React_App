import React, { useRef, useState  } from 'react'

const ALLOWEDTYPES = ['image/jpeg', 'image/jpg', 'image/png']

export const UploadFile = (props) => {
  const inputRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const handleClick = () => {
    inputRef.current.click();
  };
  const handleFileChange = (event) => {
    const fileObj = event.target.files && event.target.files[0];
    if (!fileObj) 
      return;
    
    if (!ALLOWEDTYPES.includes(fileObj.type)) {
      setImageSrc();
      document.querySelector(`#plusIcon${props.fileName}`).style.display = "flex"
      alert("Solo se permiten imagenes en formato .jpeg, .png, .jpg");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target.result);
    };
    reader.readAsDataURL(fileObj);
    document.querySelector(`#plusIcon${props.fileName}`).style.display = "none"
    event.target.value = null; 
  };


  return <div id="uploadFile" onClick={handleClick} >
    <i class="fa-solid fa-plus" id={`plusIcon${props.fileName}`}></i>
    <input style={{ display: 'none' }} ref={inputRef} type="file" onChange={handleFileChange}/>
    {imageSrc && <img src={imageSrc} id={props.fileName} alt="Uploaded Image" />}
  </div>
  };
  