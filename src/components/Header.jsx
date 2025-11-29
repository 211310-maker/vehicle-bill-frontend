import React from 'react';
import checkpost from '../assets/checkpost-logo.png';
import emblemLogo from '../assets/emblem-logo.png';
import eVahanLogo from '../assets/e-vahan-logo.png';
import { Link } from 'react-router-dom';
import { LOCAL_STORAGE_KEY } from '../constants';
import { useHistory } from 'react-router-dom';
const Header = () => {
  const history = useHistory();
  const isLoggedIn = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
  const onLogoutHandler = (e) => {
    if (isLoggedIn.role === 'admin') {
      localStorage.clear(LOCAL_STORAGE_KEY);
      history.push('/admin/login');
    } else {
      localStorage.clear(LOCAL_STORAGE_KEY);
      history.push('/login');
    }
  };
  return (
    <header className='header'>
      <div className='header__top d-flex a-center'>
        <div className='row w-100'>
          <div className='col-sm-6'></div>
          <div className='col-sm-5'>
            <ul>
              <li>
                <span className='glyphicon glyphicon-home'></span> Home
              </li>
              <li>
                <span className='glyphicon glyphicon-arrow-down'></span> Skip
                main content
              </li>
              <li>
                <span className='glyphicon glyphicon-arrow-down'></span> Skip
                navigation
              </li>
              <li>
                A<sup>+</sup>
              </li>
              <li>A</li>
              <li>
                A<sup>-</sup>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className='header__main'>
        <div className='d-flex'>
          <div className=''>
            <img width='162' height='53' src={checkpost} alt='checkpost' />
          </div>
          <div className='d-flex j-center a-center'>
            <div className='d-flex'>
              <img width='80' height='65' src={emblemLogo} alt='emblem logo' />
              <div className='text-center'>
                <h1 className='mt-2 mb-0'>
                  MINISTRY OF ROAD TRANSPORT AND HIGHWAYS
                </h1>
                <p>Government of India</p>
              </div>
            </div>
          </div>
          <div className=''>
            <img width='247' height='78' src={eVahanLogo} alt='e-vahan' />
          </div>
        </div>
      </div>
      <div className='header__menu'>
        <nav className='navbar navbar-expand-lg navbar-light bg-light mb-0'>
          <div className='collapse navbar-collapse' id='navbarSupportedContent'>
            <ul className='navbar-nav mr-auto'>
              <li className='nav-item active'>
                <Link className='nav-link text-white' to='/'>
                  <span className='glyphicon glyphicon-home'></span> Home
                </Link>
              </li>

              <li className='nav-item dropdown'>
                <a
                  className='nav-link dropdown-toggle text-white'
                  href='#'
                  id='navbarDropdown'
                  role='button'
                  data-toggle='dropdown'
                  aria-expanded='false'
                >
                  <span className='glyphicon glyphicon-user'></span> Border tax
                  Payment
                </a>
                <div className='dropdown-menu' aria-labelledby='navbarDropdown'>
                  <a className='dropdown-item' href='#'>
                    <span className='glyphicon glyphicon-arrow-right mr-2'></span>
                    Tax Payment
                  </a>
                  <a className='dropdown-item' href='#'>
                    <span className='glyphicon glyphicon-arrow-right mr-2'></span>
                    Checking Pending Transactions
                  </a>
                  <a className='dropdown-item' href='#'>
                    <span className='glyphicon glyphicon-arrow-right mr-2'></span>
                    Reverifying Failed Transaction
                  </a>
                </div>
              </li>
              <li className='nav-item active'>
                <Link className='nav-link text-white' to='/reports'>
                  <span className='glyphicon glyphicon-arrow-right mr-2'></span>
                  All receipt
                </Link>
              </li>
              {/* <li className='nav-item dropdown'>
                <a
                  className='nav-link dropdown-toggle text-white'
                  href='#'
                  id='navbarDropdown1'
                  role='button'
                  data-toggle='dropdown'
                  aria-expanded='false'
                >
                  <span className='glyphicon glyphicon-print'></span> Print
                  payment receipt
                </a>
                <div
                  className='dropdown-menu'
                  aria-labelledby='navbarDropdown1'
                >
                  <Link className='dropdown-item' to='/reports'>
                    <span className='glyphicon glyphicon-arrow-right mr-2'></span>
                    All receipt
                  </Link>
                </div>
              </li> */}
              {isLoggedIn.role === 'admin' && (
                <li className='nav-item dropdown'>
                  <a
                    className='nav-link dropdown-toggle text-white'
                    href='#'
                    id='navbarDropdown2'
                    role='button'
                    data-toggle='dropdown'
                    aria-expanded='false'
                  >
                    <span className='glyphicon glyphicon-asterisk'></span> Admin
                  </a>
                  <div
                    className='dropdown-menu'
                    aria-labelledby='navbarDropdown2'
                  >
                    <Link className='dropdown-item' to='/admin/users'>
                      <span className='glyphicon glyphicon-arrow-right mr-2'></span>
                      All users
                    </Link>
                    <Link className='dropdown-item' to='/admin/create-user'>
                      <span className='glyphicon glyphicon-arrow-right mr-2'></span>
                      Create user
                    </Link>
                  </div>
                </li>
              )}

              {isLoggedIn && (
                <li className='nav-item'>
                  <a className='nav-link text-white' onClick={onLogoutHandler}>
                    <span className='glyphicon glyphicon-log-out'></span> logout
                  </a>
                </li>
              )}
            </ul>
            {isLoggedIn && (
              <ul className='navbar-nav ml-auto' style={{ float: 'right' }}>
                <li className='nav-item'>
                  <a className='nav-link text-white'>
                    <span className='glyphicon glyphicon-user'></span>{' '}
                    {isLoggedIn?.username}
                  </a>
                </li>
              </ul>
            )}
          </div>
        </nav>
      </div>
      <div className='header__desc'>
        <marquee
          behavior='alternate'
          scrollamount='3'
          width='100%'
          direction='left'
        >
          Validity of the receipt by sending sms{' '}
          <font color='#ff83dc'>
            {' '}
            VAHAN &lt;STATE CODE&gt; CP &lt;VEHICLE NO&gt;{' '}
          </font>{' '}
          to 7738299899 (e.g.{' '}
          <font color='#ff83dc'> VAHAN XX CP XXXXXXXXXX </font> )
        </marquee>
      </div>
    </header>
  );
};

export default Header;
