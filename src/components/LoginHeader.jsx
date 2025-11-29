import React from 'react';
import EmblemofIndia from '../assets/Emblem_of_India.svg';
const LoginHeader = () => {
  return (
    <header className="login-header d-flex">
      <img width="80" height="80" src={EmblemofIndia} alt="emblem logo" />
      <div className="login-header__right">
        <h1 className="hindi">सड़क परिवहन और राजमार्ग मंत्रालय</h1>
        <h1 className="english">MINISTRY OF ROAD TRANSPORT & HIGHWAY</h1>
        <div className="d-flex login-header__desc">
          <p>भारत सरकार</p>
          <p>Government of India</p>
        </div>
      </div>
    </header>
  );
};

export default LoginHeader;
