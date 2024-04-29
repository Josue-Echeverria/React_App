import React, { useState } from 'react';

function NavButton(props) {
  const [hover, setHover] = useState(false);

  const style = {
    backgroundColor: hover ? 'grey' : 'white',
    color: hover ? 'white' : 'grey',
    border: 'none',
    padding: '0.5em',
    cursor: 'pointer'
  };

  return (
    <button
      style={style}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {props.title}
    </button>
  );
}

export default NavButton;
