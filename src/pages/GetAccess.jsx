import React, { useState } from 'react';
import { getAcessApi } from '../utils/api';
import { useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import copy from 'copy-to-clipboard';

const GetAccess = () => {
  const [otp, setOtp] = useState('');
  const params = useParams();
  const [_, setCookie] = useCookies();
  const [isLoading, setIsLoading] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const [success, setSuccess] = useState(false);
  const onGetAccessHandler = async () => {
    setIsLoading(true);
    const { data, error } = await getAcessApi(params.id);
    if (data) {
      setCookie('pageAccessToken', data.pageAccessToken, { path: '/' });
      setOtp(data.otp);
      setSuccess(true);
    } else {
      setIsInvalid(true);
      setSuccess(false);
    }
    setIsLoading(false);
  };

  const onCopyHandler = (text) => {
    if (text) {
      copy(text);
    }
  };

  return (
    <div>
      <br />
      <br />
      <br />
      <div className='container'>
        {!isLoading && (
          <div className='d-flex j-center a-center'>
            <button
              className='btn-primary btn-lg'
              onClick={onGetAccessHandler}
              disabled={isLoading}
            >
              Get access
            </button>
            <br />
          </div>
        )}
        {isLoading && <></>}
        {!isLoading && !isInvalid && success && (
          <>
            <br />
            <br />
            <p className='text-info text-center'>
              <b>
                <span className='text-danger mr-3'>
                  <u>Note</u>
                  <sup>*</sup>
                </span>{' '}
                Please copy the access code & send to the admin.
              </b>
            </p>
          </>
        )}
        {!isLoading && !isInvalid && otp && (
          <>
            <br />
            <h4 className='text-center'>
              <span className='text-danger'>ACCESS CODE </span> : {otp}{' '}
              <button
                onClick={() => onCopyHandler(otp)}
                data-toggle='tooltip'
                data-placement='top'
                title='Copy otp'
                className='btn btn-sm ml-3'
              >
                <svg
                  width='24'
                  height='24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    fill-rule='evenodd'
                    clip-rule='evenodd'
                    d='M2 9a7 7 0 0 1 7-7h8a1 1 0 1 1 0 2H9a5 5 0 0 0-5 5v8a1 1 0 1 1-2 0V9z'
                    fill='#0C6090'
                  />
                  <path
                    fill-rule='evenodd'
                    clip-rule='evenodd'
                    d='M6 11a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v6a5 5 0 0 1-5 5h-6a5 5 0 0 1-5-5v-6zm5-3a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3h-6z'
                    fill='#0C6090'
                  />
                </svg>
              </button>
            </h4>
          </>
        )}
        {!isLoading && isInvalid && (
          <>
            <br />
            <br />
            <h4 className='text-center'>Link Expired</h4>
          </>
        )}
      </div>
    </div>
  );
};

export default GetAccess;
