import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";

// Utility: draw cropped image on canvas and return a Blob
async function getCroppedBlob(imageSrc, pixelCrop) {
  const image = await new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = imageSrc;
  });

  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d");

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.92);
  });
}

function ImageCropModal({ imageSrc, productName, onClose, onCropDone }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [saving, setSaving] = useState(false);
  const [aspect, setAspect] = useState(1); // default square

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    setSaving(true);
    try {
      const blob = await getCroppedBlob(imageSrc, croppedAreaPixels);
      onCropDone(blob);
    } catch (e) {
      console.error("Crop failed:", e);
      alert("❌ Crop failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const aspects = [
    { label: "1:1", value: 1 },
    { label: "4:3", value: 4 / 3 },
    { label: "16:9", value: 16 / 9 },
    { label: "3:4", value: 3 / 4 },
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "var(--surface, #1a1a2e)",
          borderRadius: "20px",
          border: "1px solid rgba(255,215,0,0.2)",
          boxShadow: "0 25px 80px rgba(0,0,0,0.6)",
          width: "100%",
          maxWidth: "600px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: "1.2rem" }}>✂️ Crop Image</h2>
            <p style={{ margin: "4px 0 0", opacity: 0.5, fontSize: "0.8rem" }}>
              {productName}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "none",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              fontSize: "1.1rem",
              cursor: "pointer",
              color: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        {/* Aspect ratio selector */}
        <div
          style={{
            padding: "12px 24px",
            display: "flex",
            gap: "8px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {aspects.map((a) => (
            <button
              key={a.label}
              onClick={() => setAspect(a.value)}
              style={{
                padding: "6px 14px",
                borderRadius: "20px",
                border: `1px solid ${aspect === a.value ? "var(--accent, #ffd700)" : "rgba(255,255,255,0.15)"}`,
                background:
                  aspect === a.value
                    ? "rgba(255,215,0,0.15)"
                    : "rgba(255,255,255,0.04)",
                color:
                  aspect === a.value ? "var(--accent, #ffd700)" : "inherit",
                cursor: "pointer",
                fontWeight: aspect === a.value ? "700" : "400",
                fontSize: "0.82rem",
                transition: "all 0.2s",
              }}
            >
              {a.label}
            </button>
          ))}
          <span style={{ opacity: 0.4, fontSize: "0.8rem", alignSelf: "center", marginLeft: "auto" }}>
            Scroll to zoom
          </span>
        </div>

        {/* Crop area */}
        <div style={{ position: "relative", width: "100%", height: "360px", background: "#000" }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            style={{
              containerStyle: { borderRadius: "0" },
            }}
          />
        </div>

        {/* Zoom slider */}
        <div style={{ padding: "16px 24px", display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ opacity: 0.5, fontSize: "0.8rem" }}>🔍 Zoom</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            style={{ flex: 1, accentColor: "var(--accent, #ffd700)" }}
          />
        </div>

        {/* Footer buttons */}
        <div
          style={{
            padding: "16px 24px",
            display: "flex",
            gap: "12px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.05)",
              color: "inherit",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="premium-button"
            style={{ flex: 2 }}
          >
            {saving ? "⌛ Saving..." : "✅ Apply Crop & Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImageCropModal;
