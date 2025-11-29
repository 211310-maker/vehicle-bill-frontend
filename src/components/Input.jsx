import React from 'react';

const Input = ({ label, value, onChange, name, ...props }) => {
  return (
    <div className='form__control'>
      <label className='form__label d-block w-100 text-left' htmlFor={name}>
        {label}
        <sup>*</sup>
      </label>
      <input
        value={value}
        onChange={onChange}
        {...props}
        id={name}
        name={name}
      />
    </div>
  );
};

export default Input;
