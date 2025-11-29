import React from 'react';

const ActionButtons = ({
  isDisabled,
  onCalculateTax = () => {},
  onReset = () => {},
  onPayTax = () => {},
  ...props
}) => {
  return (
    <>
      <div>
        <button
          type='button'
          disabled={isDisabled}
          onClick={onCalculateTax}
          className='box__button mr-3'
        >
          <span className='glyphicon glyphicon-arrow-right mr-2'></span>
          Calculate tax
        </button>
        <button
          disabled={isDisabled}
          onClick={onPayTax}
          type='submit'
          tabIndex={props.tabIndex}
          className='box__button mr-3'
        >
          <span className='glyphicon glyphicon-arrow-right mr-2'></span>
          Pay Tax
        </button>
        <button
          type='button'
          disabled={isDisabled}
          onClick={onReset}
          className='box__button'
        >
          <span className='glyphicon glyphicon-arrow-right mr-2'></span>
          Reset
        </button>
      </div>
    </>
  );
};

export default ActionButtons;
