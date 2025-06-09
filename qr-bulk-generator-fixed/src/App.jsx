import React, { useState } from "react";
import { QRCode } from "react-qrcode-logo";
import { saveAs } from "file-saver";
import JSZip from "jszip";

export default function App() {
  const [textList, setTextList] = useState("");
  const [qrColor, setQrColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [logo, setLogo] = useState(null);
  const [size, setSize] = useState(200);

  const generateQRZip = async () => {
    const zip = new JSZip();
    const items = textList.split("\n").filter((t) => t.trim() !== "");

    for (const [i, text] of items.entries()) {
      const canvas = document.createElement("canvas");
      const qrDiv = document.createElement("div");
      document.body.appendChild(qrDiv);

      const qr = (
        <QRCode
          value={text}
          size={size}
          bgColor={bgColor}
          fgColor={qrColor}
          logoImage={logo ? URL.createObjectURL(logo) : undefined}
          eyeRadius={10}
          qrStyle="dots"
          logoWidth={40}
          removeQrCodeBehindLogo={true}
        />
      );

      const { render } = await import("react-dom");
      render(qr, qrDiv);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const svg = qrDiv.querySelector("svg");
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svg);
      zip.file(`qr_${i + 1}.svg`, svgString);

      const image = new Image();
      image.src = "data:image/svg+xml;base64," + btoa(svgString);
      await new Promise((res) => (image.onload = res));

      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0);

      const blob = await new Promise((res) => canvas.toBlob(res));
      zip.file(`qr_${i + 1}.png`, blob);

      document.body.removeChild(qrDiv);
    }

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "qr_codes.zip");
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>QR Bulk Generator</h2>
      <textarea
        rows="6"
        value={textList}
        onChange={(e) => setTextList(e.target.value)}
        placeholder="Enter one QR code content per line"
      />
      <br />
      <label>QR Color:</label>
      <input type="color" value={qrColor} onChange={(e) => setQrColor(e.target.value)} />
      <br />
      <label>Background Color:</label>
      <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
      <br />
      <label>Size:</label>
      <input type="number" value={size} onChange={(e) => setSize(Number(e.target.value))} />
      <br />
      <label>Logo:</label>
      <input type="file" onChange={(e) => setLogo(e.target.files[0])} />
      <br />
      <button onClick={generateQRZip}>Generate QR ZIP</button>
    </div>
  );
}