import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Loader from '../components/Loader';
import { getAllUsersApi, changeStatusApi, deleteUserApi } from '../utils/api';
import { useHistory } from 'react-router-dom';

const Admin = () => {
  const history = useHistory();
  const [initialLoading, setInitialLoading] = useState(true);
  const [users, setUsers] = useState([]);

  const loadData = async () => {
    setInitialLoading(true);
    const { data, error } = await getAllUsersApi();
    setInitialLoading(false);
    if (data) {
      setUsers(data.users);
    } else {
      alert(error.message);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <Header />
      <div className='text-center'>
        <p className='login-heading mt-4'>
          <b>Users</b>
        </p>
      </div>
      <div className='container mt-5'>
        <div className='text-center'>{initialLoading && <Loader />}</div>
        {!initialLoading && users.length > 0 && (
          <table className='table table-striped'>
            <thead className='thead-dark'>
              <tr>
                <th scope='col'>#</th>
                <th scope='col'>Username</th>
                <th scope='col'>password</th>
                <th scope='col'>Bill count</th>
                <th scope='col'>Created at</th>
                <th scope='col'>Status</th>
                <th scope='col'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => {
                return (
                  <tr key={user._id}>
                    <th scope='row'>{i + 1}</th>
                    <td>{user.username}</td>
                    <td>{user.password}</td>
                    <td scope='row'>{user.createdBy}</td>
                    <td>{new Date(user.createdAt).toLocaleString()}</td>
                    <td>{user.isBlocked ? 'Blocked' : 'Active'}</td>

                    <td>
                      <button
                        className='btn-primary'
                        onClick={() => {
                          console.log('clicked');
                          history.push(`/admin/edit-user/${user._id}`, {
                            user,
                          });
                        }}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {!initialLoading && users.length === 0 && (
          <>
            <div className='container text-center'>
              <h3>No Users found</h3>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Admin;
