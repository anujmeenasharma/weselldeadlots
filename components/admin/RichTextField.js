"use client";

import { useRef, useState } from "react";
import { Bold, Heading2, Heading3, ImagePlus, Italic, Link2, List, ListOrdered, Loader2, Quote, Underline, Eye, PencilLine } from "lucide-react";
import { portableTextToText, textToPortableText } from "@/lib/admin/richtext";
import { imageUrl } from "@/sanity/lib/image";
import { uploadToSanity } from "./MediaFields";
import { FieldShell, Modal, Button, inputClass } from "./ui";

const TOOLS = [
  { id: "h2", icon: Heading2, label: "Big heading" },
  { id: "h3", icon: Heading3, label: "Small heading" },
  { id: "bold", icon: Bold, label: "Bold" },
  { id: "italic", icon: Italic, label: "Italic" },
  { id: "underline", icon: Underline, label: "Underline" },
  { id: "bullet", icon: List, label: "Bullet list" },
  { id: "number", icon: ListOrdered, label: "Numbered list" },
  { id: "quote", icon: Quote, label: "Quote" },
  { id: "link", icon: Link2, label: "Link" },
  { id: "image", icon: ImagePlus, label: "Insert picture" },
];

function renderSpans(block) {
  const defs = new Map((block.markDefs || []).map((d) => [d._key, d]));
  return block.children.map((span) => {
    let node = span.text;
    const marks = span.marks || [];
    if (marks.includes("strong")) node = <strong>{node}</strong>;
    if (marks.includes("em")) node = <em>{node}</em>;
    if (marks.includes("underline")) node = <u>{node}</u>;
    const link = marks.map((m) => defs.get(m)).find(Boolean);
    if (link) node = <a className="text-[#1392f9] underline">{node}</a>;
    return <span key={span._key}>{node}</span>;
  });
}

/** Read-only formatted preview of the text, so editors see what visitors will see. */
function Preview({ blocks }) {
  if (!blocks.length) return <p className="text-slate-400">Nothing written yet.</p>;
  const out = [];
  let list = null;
  blocks.forEach((b) => {
    if (b.listItem) {
      if (!list || list.type !== b.listItem) {
        list = { type: b.listItem, items: [] };
        out.push(list);
      }
      list.items.push(b);
      return;
    }
    list = null;
    out.push(b);
  });
  return (
    <div className="space-y-3 text-slate-700">
      {out.map((b, i) => {
        if (b.items) {
          const Tag = b.type === "number" ? "ol" : "ul";
          return (
            <Tag key={i} className={`ml-6 space-y-1 ${b.type === "number" ? "list-decimal" : "list-disc"}`}>
              {b.items.map((it) => (
                <li key={it._key}>{renderSpans(it)}</li>
              ))}
            </Tag>
          );
        }
        if (b._type === "image") {
          const src = imageUrl(b, { width: 600 });
          // eslint-disable-next-line @next/next/no-img-element
          return src ? <img key={b._key} src={src} alt={b.alt || ""} className="max-h-48 rounded-lg" /> : null;
        }
        if (b.style === "h2") return <h2 key={b._key} className="text-2xl font-bold text-slate-900">{renderSpans(b)}</h2>;
        if (b.style === "h3") return <h3 key={b._key} className="text-xl font-bold text-slate-900">{renderSpans(b)}</h3>;
        if (b.style === "h4") return <h4 key={b._key} className="text-lg font-bold text-slate-900">{renderSpans(b)}</h4>;
        if (b.style === "blockquote") return <blockquote key={b._key} className="border-l-4 border-slate-300 pl-3 italic">{renderSpans(b)}</blockquote>;
        return <p key={b._key}>{renderSpans(b)}</p>;
      })}
    </div>
  );
}

/**
 * Simple formatted-text editor. Toolbar buttons insert easy markers (## for headings,
 * - for bullets, **bold**…), and the Preview tab shows the formatted result.
 */
export function RichTextField({ field, value, onChange, error }) {
  const [text, setText] = useState(() => portableTextToText(value));
  const [mode, setMode] = useState("write");
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("https://");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const ref = useRef(null);
  const fileRef = useRef(null);
  const selection = useRef({ start: 0, end: 0 });

  const update = (next) => {
    setText(next);
    onChange(textToPortableText(next));
  };

  const remember = () => {
    const el = ref.current;
    if (el) selection.current = { start: el.selectionStart, end: el.selectionEnd };
  };

  const replaceSelection = (fn) => {
    const { start, end } = selection.current;
    const selected = text.slice(start, end);
    const { insert, cursor } = fn(selected);
    const next = text.slice(0, start) + insert + text.slice(end);
    update(next);
    requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      el.focus();
      const pos = start + (cursor ?? insert.length);
      el.setSelectionRange(pos, pos);
    });
  };

  const wrap = (marker, placeholder) => {
    remember();
    replaceSelection((sel) => {
      const inner = sel || placeholder;
      return { insert: `${marker}${inner}${marker}` };
    });
  };

  const prefixLines = (prefix) => {
    remember();
    const { start, end } = selection.current;
    const lineStart = text.lastIndexOf("\n", start - 1) + 1;
    const lineEndIdx = text.indexOf("\n", end);
    const lineEnd = lineEndIdx === -1 ? text.length : lineEndIdx;
    const lines = text.slice(lineStart, lineEnd).split("\n");
    const stripped = lines.map((l) => l.replace(/^(#{2,4}\s+|>\s?|[-•*]\s+|\d+[.)]\s+)/, ""));
    const allHave = lines.every((l) => (typeof prefix === "function" ? /^\d+[.)]\s/.test(l) : l.startsWith(prefix)));
    const nextLines = allHave ? stripped : stripped.map((l, i) => (typeof prefix === "function" ? prefix(i) : prefix) + l);
    update(text.slice(0, lineStart) + nextLines.join("\n") + text.slice(lineEnd));
    requestAnimationFrame(() => ref.current?.focus());
  };

  const insertLink = () => {
    const url = linkUrl.trim();
    setLinkOpen(false);
    if (!url || url === "https://") return;
    replaceSelection((sel) => ({ insert: `[${sel || "link text"}](${url})` }));
  };

  const insertImage = async (file) => {
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const asset = await uploadToSanity(file, "image");
      replaceSelection(() => ({ insert: `\n![${file.name.replace(/\.[^.]+$/, "")}](image:${asset._id})\n` }));
    } catch (e) {
      setUploadError(e.message);
    } finally {
      setUploading(false);
    }
  };

  const runTool = (id) => {
    switch (id) {
      case "h2": return prefixLines("## ");
      case "h3": return prefixLines("### ");
      case "bold": return wrap("**", "bold text");
      case "italic": return wrap("*", "italic text");
      case "underline": return wrap("__", "underlined text");
      case "bullet": return prefixLines("- ");
      case "number": return prefixLines((i) => `${i + 1}. `);
      case "quote": return prefixLines("> ");
      case "link":
        remember();
        setLinkUrl("https://");
        return setLinkOpen(true);
      case "image":
        remember();
        return fileRef.current?.click();
      default:
    }
  };

  return (
    <FieldShell label={field.label} help={field.help} error={error || uploadError}>
      <div className="overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm focus-within:border-[#1392f9] focus-within:ring-2 focus-within:ring-[#1392f9]/20">
        <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50 px-2 py-1.5">
          {mode === "write" &&
            TOOLS.map((tool) => {
              const ToolIcon = tool.id === "image" && uploading ? Loader2 : tool.icon;
              return (
                <button
                  key={tool.id}
                  type="button"
                  title={tool.label}
                  aria-label={tool.label}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => runTool(tool.id)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm"
                >
                  <ToolIcon className={`h-4 w-4 ${ToolIcon === Loader2 ? "animate-spin" : ""}`} />
                </button>
              );
            })}
          <div className="ml-auto inline-flex rounded-lg bg-slate-200/70 p-0.5 text-xs font-semibold">
            <button type="button" onClick={() => setMode("write")} className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 ${mode === "write" ? "bg-white shadow-sm" : "text-slate-500"}`}>
              <PencilLine className="h-3.5 w-3.5" /> Write
            </button>
            <button type="button" onClick={() => setMode("preview")} className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 ${mode === "preview" ? "bg-white shadow-sm" : "text-slate-500"}`}>
              <Eye className="h-3.5 w-3.5" /> Preview
            </button>
          </div>
        </div>
        {mode === "write" ? (
          <textarea
            ref={ref}
            value={text}
            onChange={(e) => update(e.target.value)}
            onSelect={remember}
            onKeyUp={remember}
            onClick={remember}
            rows={field.tall ? 18 : 8}
            className="block w-full resize-y border-0 px-4 py-3 font-mono text-[14px] leading-relaxed text-slate-800 focus:outline-none"
            placeholder="Start writing… Each line becomes a paragraph."
          />
        ) : (
          <div className="min-h-[10rem] px-4 py-3">
            <Preview blocks={textToPortableText(text)} />
          </div>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { insertImage(e.target.files?.[0]); e.target.value = ""; }} />
      <Modal open={linkOpen} onClose={() => setLinkOpen(false)} title="Add a link">
        <p className="mb-2 text-sm text-slate-600">Where should the selected text link to?</p>
        <input autoFocus className={inputClass} value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && insertLink()} />
        <p className="mt-1 text-xs text-slate-500">A full address (https://…) or a page on this site (/contact).</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button onClick={() => setLinkOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={insertLink}>Add link</Button>
        </div>
      </Modal>
    </FieldShell>
  );
}
