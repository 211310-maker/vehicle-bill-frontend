import React, { useState } from 'react';
import { fields } from '../constants';
import Select from 'react-select';
import Header from '../components/Header';
import {
  changeStatusApi,
  deleteUserApi,
  addMoreAccessStateApi,
} from '../utils/api';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import Loader from '../components/Loader';
const EditUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const history = useHistory();
  const location = useLocation();
  const { user } = location.state;
  const [accessState, setAccessState] = useState(
    user.accessState.map((e) => ({ label: e, value: e, name: e }))
  );

  const onSaveHandler = async () => {
    if (accessState.length === 0) {
      window.alert('Please select at least one state');
      return;
    }
    setIsLoading(true);
    const { error, data } = await addMoreAccessStateApi({
      id,
      accessState: [...new Set(accessState.map((e) => e.name))],
    });
    setIsLoading(false);
    if (data) {
      history.goBack();
    } else {
      alert(error.message);
    }
  };
  const statusHandler = async () => {
    setIsLoading(true);
    const { data, error } = await changeStatusApi(id);
    setIsLoading(false);
    if (data) {
      history.goBack();
    } else {
      alert(error.message);
    }
  };

  const deleteHandler = async () => {
    if (window.confirm('Are you sure')) {
      setIsLoading(true);
      const { error, data } = await deleteUserApi(id);
      setIsLoading(false);
      console.log(data);
      if (error) {
        alert(error.message);
      } else {
        if (data.success) {
          history.goBack();
        }
      }
    }
  };

  return (
    <>
      <Header />
      {isLoading && (
        <div className='container text-center'>
          <Loader />
        </div>
      )}
      {!isLoading && (
        <div className='container text-center'>
          <br />
          <div
            className='d-flex'
            style={{
              justifyContent: 'space-between',
              width: 250,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            <div>
              <h3>Status</h3>
              <button
                disabled={isLoading}
                onClick={statusHandler}
                className={`mr-1 btn-lg ${
                  user && user.isBlocked ? 'btn-danger' : 'btn-success'
                }`}
              >
                {user && user.isBlocked ? 'Block' : 'Active'}
              </button>
            </div>
            <div>
              <h3>Delete user</h3>
              <button
                disabled={isLoading}
                onClick={deleteHandler}
                className={`mr-1 btn-lg ${'btn-danger'}`}
              >
                Delete
              </button>
            </div>
          </div>
          <br />
          <br />
          <div style={{ width: 450, marginLeft: 'auto', marginRight: 'auto' }}>
            <Select
              isMulti={true}
              value={accessState}
              onChange={setAccessState}
              options={fields.allState}
              className=''
              placeholder='Select access state'
            />
            <br />
            <br />

            <button
              disabled={isLoading}
              onClick={onSaveHandler}
              className={`mr-1 btn-lg ${'btn-primary'}`}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EditUser;
