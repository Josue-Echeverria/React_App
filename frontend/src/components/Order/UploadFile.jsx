import React, { useRef, useState  } from 'react'

const ALLOWEDTYPES = ['image/jpeg', 'image/jpg', 'image/png']

export const UploadFile = (props) => {
  // Create a ref for the file input element
  const inputRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  
  // Define a function to simulate a click on the file input element
  const handleClick = () => {
    inputRef.current.click();
  };

  /**
   * @param {event} event
   * 
   * @description Function called when the client uploads a file
   *  
   * @returns undefined
   */
  const handleFileChange = (event) => {
    // Get the first file from the file list (the file uploaded)
    const fileObj = event.target.files && event.target.files[0];
    if (!fileObj) 
      return;

    // Check if the file type is allowed
    if (!ALLOWEDTYPES.includes(fileObj.type)) {
      setImageSrc();
      document.querySelector(`#plusIcon${props.fileName}`).style.display = "flex"
      alert("Solo se permiten imagenes en formato .jpeg, .png, .jpg");
      return;
    }
    
    const reader = new FileReader();
    // Define the onload event for the FileReader
    reader.onloadend = (e) => {
      // Shows the image
      setImageSrc(e.target.result);
    };

    //  When the read operation is finished, the readyState becomes DONE, and the loadend is triggered
    reader.readAsDataURL(fileObj);
    document.querySelector(`#plusIcon${props.fileName}`).style.display = "none"
    // Reset the value of the file input element
    event.target.value = null; 
  };


  return <div id="uploadFile" className="imgDiv" onClick={handleClick} >
    <i class="fa-solid fa-plus" id={`plusIcon${props.fileName}`}></i>
    <input style={{ display: 'none' }} ref={inputRef} type="file" onChange={handleFileChange}/>
    {imageSrc && <img src={imageSrc} id={props.fileName} alt="Uploaded" />}
  </div>
  };
  