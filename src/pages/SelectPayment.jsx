import React from 'react';
import SBI from '../assets/sbi.png';
import COLLECT from '../assets/collect.png';
import SBI1 from '../assets/SBI1.png';
import SBI2 from '../assets/State-bank-of-Mysore.png';
import wallet1 from '../assets/wallet-blue.png';
import wallet2 from '../assets/wallet-red.png';
import wallet3 from '../assets/wallet.png';
import ffIcon from '../assets/fast-forward.png';
import { useHistory, useLocation } from 'react-router';
const SelectPayment = () => {
  const history = useHistory();
  const location = useLocation();
  const onCompletePayment = (e) => {
    e.preventDefault();
    history.push('/confirm-payment', {
      formData: {
        ...location.state.formData,
      },
    });
  };
  return (
    <>
      <div className='container bank'>
        <div className='row'>
          <div className='col-sm-8'>
            <img src={SBI} alt='' />
          </div>
          <div className='col-sm-4'>
            <img src={COLLECT} className='mt-3' alt='' />
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-6 p-1'>
            <div className='bank__top'>NET BANKING</div>
          </div>
          <div className='col-sm-6 p-1'>
            <div className='bank__top'>CARD PAYMENT</div>
          </div>
        </div>
        <div className='row bank__content'>
          <div className='col-sm-6 px-2'>
            <div
              style={{ cursor: 'pointer' }}
              onClick={onCompletePayment}
              className='d-flex bank__card bank__card-1'
            >
              <img src={SBI1} alt='' />
              <p style={{ width: '80%' }}> Bank Charges : Nill</p>
              <img
                style={{ height: 20, width: 20, marginRight: 20 }}
                src={ffIcon}
                alt=''
              />
            </div>
            <div className='d-flex bank__card bank__card-2 mt-2'>
              <img src={SBI2} alt='' />
              <p> Bank Charges : Nill</p>
            </div>
            <div className='d-flex bank__card bank__card-2 bank__card-3 mt-2'>
              <img src={SBI2} alt='' />
              <p> Bank Charges : Nill</p>
            </div>
            <div className='d-flex bank__card bank__card-2 mt-2'>
              <img src={SBI2} alt='' />
              <p> Bank Charges : Nill</p>
            </div>
            <div className='d-flex bank__card bank__card-2 mt-2'>
              <img src={SBI2} alt='' />
              <p> Bank Charges : Nill</p>
            </div>
            <div className='d-flex bank__card bank__card-2 bank__card-last mt-2'>
              <p className='text1'>
                Other Bank <span>Internet Banking</span>
              </p>
              <p className='text2'> Bank Charges : 5.0</p>
            </div>
          </div>
          {/* // right form */}
          <div className='col-sm-6 px-1'>
            <div className='d-flex bank__card bank__card-2 mt-2 pl-3 bank__card-other '>
              <p style={{ color: '#ea5d1c' }} className='mb-0'>
                <b>
                  This Payment mode is not available between 23:00H IST and
                  00:30H IST
                </b>
              </p>
            </div>
            <div className='d-flex bank__card bank__card-2 mt-2 pl-3 bank__card-other '>
              <div className='d-flex left'>
                <img src={wallet1} alt='' />
                <div className=''>
                  <p className='text1 mb-0 ml-3'>
                    <b>State Bank</b>
                  </p>
                  <p className='text2 mb-0 ml-3'>ATM-cum-Debit-Card</p>
                </div>
              </div>
              <p className='text3'> Bank Charges : Nill</p>
            </div>
            <div className='d-flex bank__card bank__card-2 bank__card-other-2 mt-2 pl-3 bank__card-other '>
              <div className='d-flex left'>
                <img src={wallet3} alt='' />
                <p className='mb-0 mt-3 ml-2'>
                  Other Bank <span>Debit Cards</span>
                </p>
              </div>
              <p className='text3'> Bank Charges : 10.0</p>
            </div>
            <div className='d-flex bank__card bank__card-2  mt-2 pl-3 bank__card-other '>
              <div className='d-flex left'>
                <img src={wallet2} alt='' />
                <p className='text1 mt-3 ml-3' style={{ color: 'red' }}>
                  <b>Credit Card</b>
                </p>
              </div>
              <p className='text3'> Bank Charges : 1.8</p>
            </div>
            <div className='bank__top mt-3'>OTHER PAYMENT METHOD</div>
            <div className='d-flex bank__card bank__card-2 mt-2 pl-3 bank__card-other '>
              <p style={{ color: '#ea5d1c' }} className='mb-0'>
                <b>This Payment mode is not available</b>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SelectPayment;
