// npm install axios (if not already installed)
import React, { useState } from "react";
import AutoDownloadBill from "../components/AutoDownloadBill";
import { downloadBillPdf } from "../utils/downloadBillPdf";

const SAMPLE_ID = "69368b7b684539e08eb01077";

/**
 * Simple page that demonstrates manual and optional auto-download of a bill PDF.
 */
const DownloadPage = () => {
  const [manualStatus, setManualStatus] = useState("");
  const [autoEnabled, setAutoEnabled] = useState(false);

  const handleManualDownload = async () => {
    setManualStatus("Preparing download...");
    const result = await downloadBillPdf({ id: SAMPLE_ID });
    if (result.ok) {
      setManualStatus(`Download started: ${result.filename}`);
    } else {
      setManualStatus(`Download failed: ${result.error}`);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>PDF Download Demo</h2>

      <section style={{ marginBottom: 24 }}>
        <h3>Manual download</h3>
        <button onClick={handleManualDownload}>Download Bill (manual)</button>
        <p>{manualStatus}</p>
      </section>

      <section>
        <h3>Auto-download</h3>
        <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            checked={autoEnabled}
            onChange={(e) => setAutoEnabled(e.target.checked)}
          />
          Enable auto-download on mount
        </label>
        {autoEnabled && <AutoDownloadBill id={SAMPLE_ID} />}
      </section>
    </div>
  );
};

export default DownloadPage;
