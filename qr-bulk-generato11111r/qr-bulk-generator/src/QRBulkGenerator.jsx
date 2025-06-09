import React, { useState } from "react";
import { QRCode } from "react-qrcode-logo";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { createRoot } from "react-dom/client";
import { Card, CardContent, Input, Button, Textarea, Label } from "./components/ui";

export default function QRBulkGenerator() {
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
      const container = document.createElement("div");
      document.body.appendChild(container);

      const qrInstance = (
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

      await new Promise((resolve) => {
        const root = createRoot(container);
        root.render(qrInstance);
        setTimeout(() => {
          const svg = container.querySelector("svg");
          const serializer = new XMLSerializer();
          const svgString = serializer.serializeToString(svg);
          zip.file(`qr_${i + 1}.svg`, svgString);

          const image = new Image();
          image.src = "data:image/svg+xml;base64," + btoa(svgString);
          image.onload = () => {
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(image, 0, 0);
            canvas.toBlob((blob) => {
              zip.file(`qr_${i + 1}.png`, blob);
              document.body.removeChild(container);
              resolve();
            });
          };
        }, 100);
      });
    }

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "qr_codes.zip");
    });
  };

  return (
    <div className="p-6 grid gap-4 max-w-3xl mx-auto">
      <Card>
        <CardContent className="grid gap-4 p-4">
          <Label>نصوص QR (كل سطر QR منفصل)</Label>
          <Textarea
            rows={6}
            value={textList}
            onChange={(e) => setTextList(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>لون QR</Label>
              <Input
                type="color"
                value={qrColor}
                onChange={(e) => setQrColor(e.target.value)}
              />
            </div>
            <div>
              <Label>لون الخلفية</Label>
              <Input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
              />
            </div>
            <div>
              <Label>الحجم</Label>
              <Input
                type="number"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
              />
            </div>
            <div>
              <Label>شعار بالوسط (اختياري)</Label>
              <Input type="file" onChange={(e) => setLogo(e.target.files[0])} />
            </div>
          </div>
          <Button onClick={generateQRZip}>توليد QR بصيغة SVG و PNG</Button>
        </CardContent>
      </Card>
    </div>
  );
}