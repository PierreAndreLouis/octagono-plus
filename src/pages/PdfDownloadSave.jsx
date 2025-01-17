import React from "react";

function PdfDownloadSave() {
  return <div>PdfDownloadSave</div>;
}

export default PdfDownloadSave;

// import React, { useRef } from "react";
// import html2pdf from "html2pdf.js";

// const PdfDownloadSave = () => {
//   const contentRef = useRef(); // Crée une référence pour l'élément

//   const generatePDF = () => {
//     const element = contentRef.current; // Cible l'élément avec useRef
//     html2pdf().from(element).save("export.pdf");
//   };

//   return (
//     <div>
//       <div ref={contentRef}>
//         <h1>Mon contenu à exporter</h1>
//         <p>Voici un exemple de texte dans le PDF.</p>
//       </div>
//       <button onClick={generatePDF}>Exporter en PDF</button>
//     </div>
//   );
// };

// export default PdfDownloadSave;

// // export default PdfDownloadSave
