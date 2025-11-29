import React, { useEffect, useState } from 'react';
import LoginHeader from '../components/LoginHeader';
import { loginApi } from '../utils/api';
import { LOCAL_STORAGE_KEY } from '../constants';
import { useHistory } from 'react-router';

const Login = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const payLoad = {
      password,
      username,
      role: 'admin',
    };
    if (!payLoad.username || !payLoad.password) {
      alert('Please fill all fields');
      return;
    }
    const { data, error } = await loginApi(payLoad);
    setIsLoading(false);
    if (data) {
      // successfully loggedin
      if (data.success) {
        if (data.user.role === 'admin') {
          // set data to local storage
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.user));
          setUsername('');
          setPassword('');
          history.push('/');
        }
      } else {
        alert('Invalid credentials');
        return;
      }
    } else {
      alert(error.message);
    }
  };

  useEffect(() => {
    const userInfo = localStorage.getItem(LOCAL_STORAGE_KEY);
    console.log(userInfo);
    if (userInfo) {
      history.push('/');
    }
  }, []);

  return (
    <>
      <LoginHeader />
      <div className='text-center'>
        <p className='login-heading'>
          <b>VEHICLE TAX PAYMENT</b>
        </p>
      </div>
      <div className='box box--login mt-4'>
        <div className='box__heading d-flex a-center j-center py-2'>
          Login Here
        </div>
        <br />
        <br />
        <form onSubmit={onSubmitHandler} className='form'>
          <div className='form__control'>
            <label className='form__label' htmlFor='username'>
              User Name
            </label>
            <input
              required
              disabled={isLoading}
              value={username}
              onChange={(e) => setUsername(e.target.value.trim())}
              className='form__input no-capital-input'
              type='text'
              id='username'
            />
          </div>
          <div className='form__control'>
            <label className='form__label' htmlFor='password'>
              Password
            </label>
            <input
              required
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='form__input no-capital-input'
              type='password'
              id='password'
            />
          </div>
          <button disabled={isLoading} className='form__submit'>
            Login
          </button>
        </form>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
      <br />
      <br />
      <footer className='footer d-flex j-center a-center p-3'>
        All Rights Reserved &copy;
      </footer>
    </>
  );
};

export default Login;
