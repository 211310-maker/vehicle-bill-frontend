import React, { useState } from 'react';
import Header from '../components/Header';
import { createTempUserApi, provideAccessApi } from '../utils/api';
import copy from 'copy-to-clipboard';
import { fields } from '../constants';
import Select from 'react-select';

const Admin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [accessLink, setAccessLink] = useState();
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [tempUserId, setTempUserId] = useState('');
  const [accessState, setAccessState] = useState([]);
  const [creds, setCreds] = useState({
    username: '',
    password: '',
  });

  // IMPORTANT: set this env var in frontend build config (Render dashboard)
  // e.g. REACT_APP_API_BASE_URL=https://vehicle-bill-backend-1.onrender.com
  const API_BASE = (process.env.REACT_APP_API_BASE_URL || '').replace(/\/$/, '') || window.location.origin;

  const createNewTempUserHandler = async () => {
    setIsLoading(true);
    const { data, error } = await createTempUserApi();
    setIsLoading(false);
    if (data) {
      if (data.success) {
        console.log(data);

        // data.url is expected to be the backend endpoint path (e.g. /app/register/<token>/get-access)
        // Build an absolute URL that points to the backend (NOT the frontend).
        const abs = data.url.startsWith('http')
          ? data.url
          : `${API_BASE}${data.url}`;

        setAccessLink(abs);
        setTempUserId(data.tempUser._id);
        setCreds({
          username: '',
          password: '',
        });
        setOtp('');
        setPassword('');
      }
    } else {
      alert(error.message);
    }
  };

  const provideAccessHandler = async () => {
    setIsLoading(true);
    if (!otp || !password || !username) {
      alert('Please fill all fields');
      setIsLoading(false);
      return;
    }
    const { data, error } = await provideAccessApi({
      otp,
      password,
      tempUserId,
      username,
      accessState:
        accessState.length > 0 ? accessState.map((e) => e.name) : accessState,
    });
    setIsLoading(false);
    if (data) {
      if (data.success) {
        setCreds({
          username,
          password,
        });
        setAccessLink('');
        setOtp('');
        setPassword('');
        setUsername('');
        setAccessState([]);
      }
    } else {
      alert(error.message);
    }
  };

  const onCopyHandler = (text) => {
    if (text) {
      copy(text);
      alert('Copied to clipboard');
    }
  };

  const onOpenAccessLink = () => {
    if (!accessLink) return;
    // open in new tab so SPA routing doesn't intercept
    window.open(accessLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <Header />
      <div className='text-center'>
        <p className='login-heading mt-4'>
          <b>Create User</b>
        </p>
      </div>
      <div className='container mt-4'>
        <button
          disabled={isLoading}
          onClick={createNewTempUserHandler}
          className='btn-primary'
        >
          Create new User{' '}
          <span className='ml-2 glyphicon glyphicon-plus'></span>
        </button>
        <br />
        <br />
        {accessLink && (
          <div style={{ width: '80%', overflowWrap: 'break-word' }}>
            {/* Show as link that opens the backend route in a new tab */}
            <a href={accessLink} target='_blank' rel='noopener noreferrer'>
              {accessLink}
            </a>

            <button
              onClick={() => onCopyHandler(accessLink)}
              data-toggle='tooltip'
              data-placement='top'
              title='Copy access link'
              className='btn btn-sm ml-3'
              style={{ marginLeft: 8 }}
            >
              Copy
            </button>

            <button
              onClick={onOpenAccessLink}
              data-toggle='tooltip'
              data-placement='top'
              title='Open access link'
              className='btn btn-sm ml-1'
              style={{ marginLeft: 8 }}
            >
              Open
            </button>
          </div>
        )}
        <hr />
        <div className='text-center'>
          <p className='login-heading mt-4'>
            <b>Give Access</b>
          </p>
        </div>

        {/* ... rest stays unchanged ... */}
        <div className='form__control'>
          <label className='form__label d-block w-100 text-left' htmlFor='otp'>
            Enter Otp<sup>*</sup>
          </label>
          <input
            inputMode='text'
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className='form__input w-100'
            type='text'
            id='otp'
            name='otp'
          />
        </div>

        <div className='form__control'>
          <label
            className='form__label d-block w-100 text-left'
            htmlFor='password'
          >
            Enter username<sup>*</sup>
          </label>
          <input
            inputMode='text'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className='form__input w-100'
            type='text'
            id='username'
            name='username'
          />
        </div>

        <div className='form__control'>
          <label
            className='form__label d-block w-100 text-left'
            htmlFor='password'
          >
            Enter Password<sup>*</sup>
          </label>
          <input
            inputMode='text'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='form__input w-100'
            type='text'
            id='password'
            name='password'
          />
        </div>
        <div className='form__control text-left'>
          <label className='form__label text-left' htmlFor='state'>
            Select State
          </label>
          <Select
            isMulti={true}
            value={accessState}
            onChange={setAccessState}
            options={fields.allState}
            className=''
            placeholder='Select access state'
          />
        </div>
        <br />
        <button onClick={provideAccessHandler} className='btn-success'>
          provide access
        </button>

        <br />
        <br />
        <p>
          Generated Username : <u>{creds.username}</u>
        </p>
        <p>Password : {creds.password}</p>
        {creds.username && creds.password && (
          <button
            onClick={() => onCopyHandler(`${creds.username} ${creds.password}`)}
            data-toggle='tooltip'
            data-placement='top'
            title='Copy username and password'
          >
            Copy username & password{' '}
          </button>
        )}
      </div>
    </>
  );
};

export default Admin;
