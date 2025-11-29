import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Loader from '../components/Loader';
import { getAllBillsApi, getAllUsersApi } from '../utils/api';
import { formatDate } from '../utils/helper';
import { fields, LOCAL_STORAGE_KEY } from '../constants';
import config from '../config/env';
const BASE_URL = config['API_BASE_URL'];
const Bills = () => {
  const isLoggedIn = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
  const [filter, setFilter] = useState({
    state: '',
  });
  const [initialLoading, setInitialLoading] = useState(true);
  const [bills, setBills] = useState([]);
  const [query, setQuery] = useState('');
  const [totalBillAmount, setTotalBillAmount] = useState('');
  const [users, setUsers] = useState([]);

  const onChangeHandler = async (e) => {
    const x = { ...filter, [e.target.name]: e.target.value };
    setFilter((old) => ({ ...old, [e.target.name]: e.target.value }));
    const searchParams = new URLSearchParams();

    Object.keys(x).forEach((key) => {
      if (x[key]) {
        searchParams.set(key, x[key]);
      }
    });
    setQuery(searchParams.toString());
  };

  const onSearchHandler = async () => {
    setInitialLoading(true);
    await loadData(query);
  };
  const onResetHandler = async () => {
    setInitialLoading(true);
    const isLoggedIn = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    loadData(`createdBy=${isLoggedIn._id}`);
  };

  const loadData = async (params) => {
    const { data, error } = await getAllBillsApi(params);
    setInitialLoading(false);
    if (data.success) {
      let amount = 0;
      data.bills.forEach((e) => {
        amount += +e.totalAmount;
      });
      setTotalBillAmount(amount);
      console.log(data.bills);
      setBills(data.bills);
    } else {
    }
  };

  const loadAllUsers = async () => {
    const { data, error } = await getAllUsersApi();
    if (data) {
      setUsers(data.users);
    } else {
      alert(error.message);
    }
  };

  useEffect(() => {
    loadData(`createdBy=${isLoggedIn._id}`);
    if (isLoggedIn.role === 'admin') {
      loadAllUsers();
    }
  }, []);
  return (
    <>
      <Header />
      <div className='text-center'>
        <p className='login-heading mt-4'>
          <b>Bills</b>
        </p>
        <br />
        <p className=' mt-4'>
          <b>Total Bills : {bills.length}</b>
          <br />
          <b>Total Amount : {totalBillAmount}</b>
        </p>
      </div>
      <div className='container-fluid mt-5'>
        {initialLoading && (
          <div className='text-center'>
            <Loader />
          </div>
        )}

        {!initialLoading && (
          <>
            {isLoggedIn.role === 'admin' && (
              <div className='text-center d-flex j-center a-center'>
                <div>
                  <b>User :</b>
                  <select
                    className='mr-2'
                    name='createdBy'
                    value={filter.createdBy}
                    onChange={onChangeHandler}
                  >
                    <option value=''>Select User</option>
                    {users.map((user) => {
                      return <option value={user._id}>{user.username}</option>;
                    })}
                  </select>
                </div>
                <div>
                  <b>State :</b>
                  <select
                    className='mr-2'
                    name='state'
                    value={filter.state}
                    onChange={onChangeHandler}
                  >
                    <option value=''>Select State</option>
                    {fields.allState.map((state) => {
                      return <option value={state.value}>{state.name}</option>;
                    })}
                  </select>
                </div>
                <button
                  className='btn-primary ml-2 mr-2'
                  onClick={onSearchHandler}
                >
                  search
                </button>
                <button className=' btn-danger' onClick={onResetHandler}>
                  Reset
                </button>
              </div>
            )}
            <br />
            <table className='table table-striped'>
              <thead className='thead-light'>
                <tr>
                  <th scope='col'>Receipt No</th>
                  <th scope='col'>Vehicle Category</th>
                  <th scope='col'>Regis No.</th>
                  <th scope='col'>Name</th>
                  <th scope='col'>State</th>
                  <th scope='col'>Receipt State</th>
                  <th scope='col'>Tax Period</th>
                  <th scope='col'>Tax From Date</th>
                  <th scope='col'>Tax To Date</th>
                  <th scope='col'>Mobile No.</th>
                  <th scope='col'>User Charges</th>
                  <th scope='col'>Tax Amount</th>
                </tr>
              </thead>

              <tbody>
                {bills.length == 0 && (
                  <tr>
                    <td className='text-center' colSpan='12'>
                      <h3>No data</h3>
                    </td>
                  </tr>
                )}
                {bills.map((bill, i) => {
                  return (
                    <tr key={bill._id}>
                      <td>
                        <a
                          target='_blank'
                          href={`${BASE_URL}/bill/${bill._id}/pdf`}
                        >
                          {bill.receiptNo}
                        </a>
                      </td>
                      <td scope='row'>{bill.vehicleClass}</td>
                      <td>{bill.vehicleNo}</td>
                      <td>{bill.ownerName}</td>
                      <td>{bill.fromState}</td>
                      <td>{bill.state}</td>
                      <td scope='row'>{bill.taxMode}</td>
                      <td>{formatDate(bill.taxFromDate, false)}</td>
                      <td>{formatDate(bill.taxUptoDate, false)}</td>
                      <td scope='row'>{bill.mobileNo}</td>
                      <td scope='row'>-</td>
                      <td scope='row'>{bill.totalAmount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
        <br />
        <br />
      </div>
    </>
  );
};

export default Bills;
