import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import Header from '../components/Header';
import { fields, LOCAL_STORAGE_KEY } from '../constants';

const Index = () => {
  const history = useHistory();
  const [stateName, setStateName] = useState('');
  const [serviceName, setServiceName] = useState('');

  const [states, setStates] = useState([]);
  const onGoHandler = () => {
    if (!stateName || stateName === '-1') {
      alert('Please select state name');
      return;
    }
    if (!serviceName || serviceName === '-1') {
      alert('please select service name');
      return;
    }
    history.push(`/${stateName}`);
  };

  useEffect(() => {
    const isLoggedIn = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    if (isLoggedIn) {
      const accessStates = isLoggedIn.accessState;
      const allowedStates = fields.allState.filter((e) => {
        return accessStates.includes(e.name);
      });
      if (allowedStates.length > 0) {
        setStates(allowedStates);
      }
      // else {
      //   setStates(fields.allState);
      // }
    }
  }, []);

  return (
    <>
      <Header />
      <div className='text-center'>
        <p className='login-heading mt-4'>
          <b>BORDER TAX PAYMENT</b>
        </p>
      </div>
      <div className='box box--main'>
        <div className='box__heading--blue'>
          Select State Name for the Tax Payment
        </div>
        <form className='service-type mt-4'>
          <div className='row'>
            <div className='col-sm-6'>
              <div className='form__control'>
                <label
                  className='form__label d-block w-100 text-left'
                  htmlFor='stateName'
                >
                  Select Visiting State Name
                </label>
                <select
                  tabIndex='1'
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  name='stateName'
                  id='stateName'
                >
                  <option value={''}>--SELECT STATE--</option>
                  {states.map((state) => {
                    return (
                      <option key={state.name} value={state.code}>
                        {state.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div className='col-sm-6'>
              <div className='form__control'>
                <label
                  className='form__label d-block w-100 text-left'
                  htmlFor='serviceName'
                >
                  Service Name
                </label>
                <select
                  tabIndex='2'
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  name='serviceName'
                  id='serviceName'
                >
                  <option value={''}>--Select Service Type--</option>
                  <option value='VEHICLE TAX COLLECTION (OTHER STATE)'>
                    VEHICLE TAX COLLECTION (OTHER STATE)
                  </option>
                </select>
              </div>
            </div>
          </div>
        </form>
        <div className='text-center'>
          <button type='button' onClick={onGoHandler} className='box__button'>
            <span className='glyphicon glyphicon-arrow-right mr-2'></span>
            Go
          </button>
        </div>
        <br />
      </div>
      {/* <!-- steps --> */}
      <div className='box box--main'>
        <div className='box__heading--blue'>
          Follow these steps to initiate tax payment...
        </div>
        <ul className='box__steps mt-2'>
          <li className='box__step'>
            Select the state where you want to go from{' '}
            <span>'Select State'</span> combo box.
          </li>
          <li className='box__step'>
            Click <span>'Go'</span> button to open the vehicle details form
            <ul className='box__steps-1'>
              <li className='box__step-1'>
                Select <span>'VEHICLE TAX COLLECTION ( OTHER STATE ) '</span> in
                case you do not have NCR permit.
              </li>
              <li className='box__step-1'>
                Select <span>'VEHICLE TAX COLLECTION ( NCR ) '</span> in case
                you have NCR permit.
              </li>
            </ul>
          </li>
          <li className='box__step'>
            Enter <span>'vehicle No.'</span> and click <span>'Get Details</span>{' '}
            button to fill the details.
          </li>
          <li className='box__step'>
            Fill rest of the fields which are not filled automatically.
          </li>
          <li className='box__step'>
            In case fields are not filled automatically then enter the details
            manually.
          </li>
          <li className='box__step'>
            Click <span>'Calculate Tax'</span> button to calculate the tax
            according to state notification
          </li>
          <li className='box__step'>It opens the payment gateway of VAHAN</li>
          <li className='box__step'>
            Choose payment gateway and click on <span>'Continue'</span> button.
          </li>
          <li className='box__step'>And then follow the screen to pay tax.</li>
          <li className='box__step'>
            After paying the tax bank will redirect to the checkpost
            application.
          </li>
          <li className='box__step'>
            In case payment is success Checkpost application will generate the
            success receipt.
          </li>
          <li className='box__step'>Print the receipt</li>
        </ul>
      </div>
      <br />
      <br />
      <br />
      <br />
    </>
  );
};

export default Index;
