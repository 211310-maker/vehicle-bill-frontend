// npm install axios (if not already installed)
import React, { useEffect, useState } from "react";
import { downloadBillPdf } from "../utils/downloadBillPdf";

/**
 * Component that automatically downloads a bill PDF on mount.
 * Shows a simple status message and provides a manual retry button on failure.
 */
const AutoDownloadBill = ({ id, fullUrl, token }) => {
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    async function startDownload() {
      setStatus("preparing");
      setErrorMessage("");
      const result = await downloadBillPdf({
        id,
        fullUrl,
        token,
        fallbackFilename: id ? `bill-${id}.pdf` : "bill.pdf",
      });

      if (!mounted) return;

      if (result.ok) {
        setStatus("started");
      } else {
        setStatus("failed");
        setErrorMessage(result.error);
      }
    }

    startDownload();

    return () => {
      mounted = false;
    };
  }, [id, fullUrl, token]);

  const handleRetry = async () => {
    setStatus("preparing");
    setErrorMessage("");
    const result = await downloadBillPdf({
      id,
      fullUrl,
      token,
      fallbackFilename: id ? `bill-${id}.pdf` : "bill.pdf",
    });
    if (result.ok) {
      setStatus("started");
    } else {
      setStatus("failed");
      setErrorMessage(result.error);
    }
  };

  return (
    <div style={{ marginTop: 12 }}>
      <p>
        {status === "preparing" && "Preparing download..."}
        {status === "started" && "Download started"}
        {status === "failed" && `Download failed: ${errorMessage}`}
        {status === "idle" && "Waiting to start..."}
      </p>
      {status === "failed" && (
        <button onClick={handleRetry}>Download manually</button>
      )}
    </div>
  );
};

export default AutoDownloadBill;
