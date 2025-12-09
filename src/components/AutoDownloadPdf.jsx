// If axios is missing, run: npm install axios
import React, { useEffect, useState } from 'react';
import { downloadBillPdf } from '../utils/downloadBillPdf';

const AutoDownloadPdf = ({ id, baseUrl, token }) => {
  const [status, setStatus] = useState('Preparing download…');

  useEffect(() => {
    let isMounted = true;

    const initiateDownload = async () => {
      try {
        const result = await downloadBillPdf(id, { baseUrl, token });
        if (!isMounted) return;

        if (result.ok) {
          setStatus('Download started');
        } else {
          console.error(result.error);
          setStatus('Download failed');
        }
      } catch (error) {
        console.error('Automatic PDF download failed', error);
        if (isMounted) {
          setStatus('Download failed');
        }
      }
    };

    initiateDownload();

    return () => {
      isMounted = false;
    };
  }, [id, baseUrl, token]);

  return <p>{status}</p>;
};

export default AutoDownloadPdf;
