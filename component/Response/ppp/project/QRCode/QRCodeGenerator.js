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