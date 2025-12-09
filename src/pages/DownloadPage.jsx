// If axios is missing, run: npm install axios
import React, { useState } from 'react';
import AutoDownloadPdf from '../components/AutoDownloadPdf';
import { downloadBillPdf } from '../utils/downloadBillPdf';

const DownloadPage = () => {
  const [billId, setBillId] = useState('example-id');
  const [status, setStatus] = useState('');

  const handleManualDownload = async () => {
    setStatus('Preparing download…');
    const result = await downloadBillPdf(billId);

    if (result.ok) {
      setStatus(`Download started (${result.filename})`);
    } else {
      console.error(result.error);
      setStatus('Download failed');
    }
  };

  return (
    <div className='container mt-4'>
      <h1>Bill PDF Download Demo</h1>
      <p className='text-muted'>Run "npm install axios" if axios is missing.</p>

      <section className='mb-4'>
        <h2>Manual download</h2>
        <p>Enter a bill ID and click the button to trigger a manual download.</p>
        <div className='form-group'>
          <label htmlFor='bill-id-input'>Bill ID</label>
          <input
            id='bill-id-input'
            type='text'
            className='form-control'
            value={billId}
            onChange={(e) => setBillId(e.target.value)}
            placeholder='Enter bill ID'
          />
        </div>
        <button type='button' className='btn btn-primary mt-2' onClick={handleManualDownload}>
          Download bill PDF
        </button>
        {status && <p className='mt-2'>{status}</p>}
      </section>

      <section>
        <h2>Automatic download on mount</h2>
        <p>
          The component below starts downloading as soon as it mounts without navigating away
          from the page.
        </p>
        <AutoDownloadPdf id={billId} />
      </section>
    </div>
  );
};

export default DownloadPage;
