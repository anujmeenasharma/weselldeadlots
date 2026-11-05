"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, RefreshCw, Trash2, Upload, Video } from "lucide-react";
import { fileUrl, imageUrl } from "@/sanity/lib/image";
import { Button, FieldShell, inputClass } from "./ui";

export async function uploadToSanity(file, kind) {
  const body = new FormData();
  body.append("file", file);
  body.append("kind", kind);
  const res = await fetch("/api/admin/upload", { method: "POST", body });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || "Upload failed.");
  return json;
}

function useUpload(kind, onDone) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const run = async (file) => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      onDone(await uploadToSanity(file, kind));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  return { busy, error, run };
}

function DropZone({ accept, busy, onFile, children }) {
  const inputRef = useRef(null);
  const [over, setOver] = useState(false);
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        onFile(e.dataTransfer.files?.[0]);
      }}
      onClick={() => !busy && inputRef.current?.click()}
      className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition ${
        over ? "border-[#1392f9] bg-sky-50" : "border-slate-300 bg-slate-50 hover:border-slate-400"
      }`}
    >
      {busy ? <Loader2 className="h-6 w-6 animate-spin text-[#1392f9]" /> : children}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          onFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
}

/** Picture field: upload / replace / remove, plus alt text. */
export function ImageField({ field, value, onChange, error, compact = false }) {
  const replaceRef = useRef(null);
  const src = imageUrl(value, { width: 640 });
  const { busy, error: uploadError, run } = useUpload("image", (asset) => {
    onChange({ _type: "image", ...(value?._key ? { _key: value._key } : {}), alt: value?.alt, caption: value?.caption, asset: { _type: "reference", _ref: asset._id } });
  });

  return (
    <FieldShell label={field.label} help={field.help} error={error || uploadError}>
      {src ? (
        <div className={`flex gap-4 ${compact ? "flex-row items-start" : "flex-col sm:flex-row sm:items-start"}`}>
          <div className={`relative overflow-hidden rounded-lg border border-slate-200 bg-[repeating-conic-gradient(#f1f5f9_0%_25%,#fff_0%_50%)] bg-[length:16px_16px] ${compact ? "h-20 w-28" : "h-36 w-full sm:w-56"} shrink-0`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="h-full w-full object-contain" />
            {busy && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                <Loader2 className="h-6 w-6 animate-spin text-[#1392f9]" />
              </div>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <input
              className={inputClass}
              placeholder="Describe the picture (for Google & screen readers)"
              value={value?.alt || ""}
              onChange={(e) => onChange({ ...value, alt: e.target.value })}
            />
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => replaceRef.current?.click()} disabled={busy}>
                <RefreshCw className="h-4 w-4" /> Replace
              </Button>
              <Button size="sm" variant="dangerGhost" onClick={() => onChange(undefined)} disabled={busy}>
                <Trash2 className="h-4 w-4" /> Remove
              </Button>
            </div>
            <input
              ref={replaceRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                run(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
          </div>
        </div>
      ) : (
        <DropZone accept="image/*" busy={busy} onFile={run}>
          <ImagePlus className="h-7 w-7 text-slate-400" />
          <p className="text-sm font-semibold text-slate-700">Click to choose a picture</p>
          <p className="text-xs text-slate-500">or drag it here · JPG, PNG, WebP, SVG</p>
        </DropZone>
      )}
    </FieldShell>
  );
}

/** Video upload field. */
export function VideoField({ field, value, onChange, error }) {
  const src = fileUrl(value);
  const { busy, error: uploadError, run } = useUpload("file", (asset) =>
    onChange({ _type: "file", asset: { _type: "reference", _ref: asset._id } }),
  );
  const replaceRef = useRef(null);

  return (
    <FieldShell label={field.label} help={field.help} error={error || uploadError}>
      {src ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <video src={src} className="h-36 w-full rounded-lg bg-black object-cover sm:w-64" muted controls playsInline />
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => replaceRef.current?.click()} disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Replace video
            </Button>
            <Button size="sm" variant="dangerGhost" onClick={() => onChange(undefined)} disabled={busy}>
              <Trash2 className="h-4 w-4" /> Remove
            </Button>
            <input
              ref={replaceRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              className="hidden"
              onChange={(e) => {
                run(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
          </div>
        </div>
      ) : (
        <DropZone accept="video/mp4,video/webm,video/quicktime" busy={busy} onFile={run}>
          <Video className="h-7 w-7 text-slate-400" />
          <p className="text-sm font-semibold text-slate-700">Click to upload a video</p>
          <p className="text-xs text-slate-500">MP4 or WebM, up to 100 MB</p>
        </DropZone>
      )}
    </FieldShell>
  );
}
