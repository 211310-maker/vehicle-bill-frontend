import React from 'react';

const Loader = (props) => {
  return (
    <>
      <div className={`lds-ring ${props.className}`}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </>
  );
};

export default Loader;
