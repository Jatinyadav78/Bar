// // QRCodeGenerator.js
// import React, { useEffect, useState } from 'react';
// import { QRCode } from 'react-qrcode-logo';

// const QRCodeGenerator = ({permitNumber}) => {
//   const [qrValue, setQrValue] = useState('')

//   const jsonData = {
//     url: `${process.env.NEXT_PUBLIC_QR_URL }/status/${permitNumber}`,
//     name: 'abhishekJha',
//     status: 'approved'
//   };
//   useEffect(()=>{
//     setQrValue(JSON.stringify(jsonData));
//   },[])
  

//   return (
//     <div>
//      {qrValue && <QRCode
//         value={qrValue}
//         size={160}
//       // logoImage="https://upload.wikimedia.org/wikipedia/commons/7/70/Logo_of_Flipkart.png"
//       // logoWidth={50}
//       />}
//     </div>
//   );
// };

// export default QRCodeGenerator;


//this is the updated file 


import React, { useEffect, useState } from 'react';
import { QRCode } from 'react-qrcode-logo';

const QRCodeGenerator = ({permitNumber}) => {
  const [qrValue, setQrValue] = useState('')

  // Instead of creating a JSON object with multiple properties,
  useEffect(()=>{
    const directUrl = `${process.env.NEXT_PUBLIC_QR_URL}status/${permitNumber}`;
    setQrValue(directUrl);
  },[])
  
  return (
    <div>
     {qrValue && <QRCode
        value={qrValue}
        size={160}
      />}
    </div>
  );
};

export default QRCodeGenerator;

