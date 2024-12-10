import "./App.css";
import { useEffect, useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import dancingGIf from './assets/dancing-happy-dance.gif';


function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);

  const handleFileUpload = async (event) => {
    setLoading(true);
    setError("");

    try {
      if (!file || file.type !== "application/pdf") {
        setError("Please upload a valid PDF document.");
        setLoading(false);
        return;
      }

      // Read the uploaded PDF file
      const fileData = await file.arrayBuffer();

      // Load the PDF with pdf-lib
      const pdfDoc = await PDFDocument.load(fileData);
      const totalPages = pdfDoc.getPageCount();

      const zip = new JSZip(); // Initialize ZIP archive

      // Loop through each page and create a separate PDF
      for (let i = 0; i < totalPages; i++) {
        const singlePagePdf = await PDFDocument.create();
        const [page] = await singlePagePdf.copyPages(pdfDoc, [i]);
        singlePagePdf.addPage(page);

        // Serialize the page to Uint8Array
        const pdfBytes = await singlePagePdf.save();

        // Add the individual PDF to the ZIP archive
        zip.file(`page-${i + 1}.pdf`, pdfBytes);
      }

      // Generate the ZIP file
      const zipBlob = await zip.generateAsync({ type: "blob" });

      // Use file-saver to download the ZIP archive
      saveAs(zipBlob, "exported_pages.zip");
    } catch (err) {
      console.error(err);
      setError("An error occurred while processing the PDF.");
    } finally {
      setLoading(false);
      setFile(null);
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    console.log('selectedFile', selectedFile);

    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      alert("Please select a valid PDF file.");
    }
  };

  return (
    <div className="bg-gray-50 h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h1 className="text-3xl font-semibold text-center text-gray-700 mb-6">
          Upload PDF Document
        </h1>

        {/* File Upload Section */}
        <div className="flex flex-col items-center justify-center">
          <label htmlFor="pdf-upload" className="w-20 h-20 flex items-center justify-center bg-blue-200 hover:bg-blue-300 text-gray-600 font-semibold rounded-lg cursor-pointer shadow-md transition-all duration-300">
            {/* File Upload Icon */}
            {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13l4-4m0 0l4 4m-4-4v12M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z"></path>
            </svg> */}

            <span className="text-3xl">😬</span>

            <input
              type="file"
              id="pdf-upload"
              className="hidden"
              accept="application/pdf"
              onChange={handleFileChange}
            />
          </label>
          <span className="mt-3 text-gray-600 text-sm">ფაილის ასარჩევად დააჭირეთ კბილებს</span>
        </div>

        {/* Process Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleFileUpload}
            className={`px-6 py-2 rounded-lg transition-all duration-300 ${file ? 'bg-indigo-500 hover:bg-indigo-600 text-white' : 'bg-gray-300 cursor-not-allowed'}`}
            style={{ opacity: file ? 1 : 0.6 }}
            disabled={!file}
          >
            { file ? (
              <span>წკაპ წკაპ და წევიდა</span>
            ) : (
              <span>აარჩიე ახლა მალე ნუ დამტანჯე</span>
            )}
          </button>
        </div>

        { loading && (
          <div className="flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-xl font-semibold text-gray-700 mt-2 mb-2">მუშავდება...</h1>
              <h2 className="text-xl font-semibold text-gray-700 mt-2 mb-2">დნცკ დნცკ დნცკ</h2>
              <img className="rounded" src={dancingGIf} alt="Processing..." />
            </div>
          </div>
        )}
      </div>
    </div>
  )

  // return (
  //   <div className="app">
  //     <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
  //       <h1>ანას სახელობის PDF-uploader-ი და ექსპორტერი</h1>
  //       <input type="file" accept="application/pdf" onChange={handleFileUpload} />
  //       {loading && <p>Processing your PDF...</p>}
  //       {error && <p style={{ color: "red" }}>{error}</p>}
  //     </div>
  //   </div>
  // );
}

export default App;