import React, { PropTypes, Component, useRef } from 'react'


export const UploadFile = () => {
    const inputRef = useRef(null);
    const handleClick = () => {
      inputRef.current.click();
    };
    const handleFileChange = (event) => {
        const fileObj = event.target.files && event.target.files[0];
        if (!fileObj) {
          return;
        }
        console.log('Selected file:', fileObj);
        event.target.value = null; 
      };


    return <div id="uploadFile" onClick={handleClick} >
        <i class="fa-solid fa-plus"></i>
        <input
        style={{ display: 'none' }}
        ref={inputRef}
        type="file"
        onChange={handleFileChange}
      />
      <img id="imgSRC" style = {{display:"none"}}/>
    </div>
  };
  