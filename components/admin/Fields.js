"use client";

import { useId, useState } from "react";
import { ArrowDown, ArrowUp, ChevronDown, Copy, Eye, EyeOff, GripVertical, Plus, Trash2, X } from "lucide-react";
import { SECTION_TYPES, SECTION_TYPE_LIST } from "@/lib/admin/config";
import { newKey } from "@/lib/admin/richtext";
import { imageUrl } from "@/sanity/lib/image";
import Icon from "./Icon";
import { ImageField, VideoField } from "./MediaFields";
import { LinkEditor, LinkField } from "./LinkField";
import { RichTextField } from "./RichTextField";
import { SeoField } from "./SeoField";
import { Button, FieldShell, IconButton, Modal, Toggle, errorInputClass, inputClass, useEditor } from "./ui";

// ---------- helpers ----------
const join = (base, name) => (base ? `${base}.${name}` : name);

function withDefaults(fields, base = {}) {
  const out = { ...base };
  for (const f of fields || []) if (f.default !== undefined && out[f.name] === undefined) out[f.name] = f.default;
  return out;
}

/** Deep copy with fresh _keys, used by "Duplicate". */
function rekey(value) {
  if (Array.isArray(value)) return value.map(rekey);
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = k === "_key" ? newKey() : rekey(v);
    return out;
  }
  return value;
}

const move = (arr, from, to) => {
  if (to < 0 || to >= arr.length || from === to) return arr;
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

const slugify = (s) =>
  String(s || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);

function hasErrorUnder(errors, path) {
  return Object.keys(errors).some((p) => p === path || p.startsWith(`${path}.`));
}

// ---------- simple inputs ----------
function TextInput({ field, value, onChange, path, multiline }) {
  const { errors, sitePaths } = useEditor();
  const id = useId();
  const error = errors[path];
  const cls = `${inputClass} ${error ? errorInputClass : ""}`;
  return (
    <FieldShell label={field.label} help={field.help} error={error} htmlFor={id}>
      {multiline ? (
        <textarea id={id} rows={field.rows || 3} className={cls} value={value || ""} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <>
          <input
            id={id}
            type={field.type === "email" ? "email" : field.type === "url" ? "url" : "text"}
            className={cls}
            list={field.suggestions ? `${id}-list` : undefined}
            placeholder={field.type === "url" ? "https://" : field.placeholder}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
          />
          {field.suggestions && (
            <datalist id={`${id}-list`}>
              {[...new Set([...field.suggestions, ...sitePaths])].map((p) => (
                <option key={p} value={p} />
              ))}
            </datalist>
          )}
        </>
      )}
    </FieldShell>
  );
}

function NumberInput({ field, value, onChange, path }) {
  const { errors } = useEditor();
  const id = useId();
  return (
    <FieldShell label={field.label} help={field.help} error={errors[path]} htmlFor={id}>
      <input
        id={id}
        type="number"
        min={field.min}
        max={field.max}
        className={`${inputClass} max-w-[10rem] ${errors[path] ? errorInputClass : ""}`}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
      />
    </FieldShell>
  );
}

function ChoiceInput({ field, value, onChange, path }) {
  const { errors } = useEditor();
  const current = value ?? field.default ?? "";
  if (field.options.length <= 3) {
    return (
      <FieldShell label={field.label} help={field.help} error={errors[path]}>
        <div className="inline-flex flex-wrap rounded-lg border border-slate-300 bg-slate-50 p-0.5 text-sm">
          {field.options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              className={`rounded-md px-3 py-1.5 font-medium transition ${current === o.value ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </FieldShell>
    );
  }
  return (
    <FieldShell label={field.label} help={field.help} error={errors[path]}>
      <select className={`${inputClass} max-w-xs`} value={current} onChange={(e) => onChange(e.target.value || undefined)}>
        <option value="">— Choose —</option>
        {field.options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

function TagsInput({ field, value, onChange, path }) {
  const { errors } = useEditor();
  const [draft, setDraft] = useState("");
  const tags = value || [];
  const add = () => {
    const t = draft.trim().replace(/,$/, "");
    if (t && !tags.includes(t)) onChange([...tags, t]);
    setDraft("");
  };
  return (
    <FieldShell label={field.label} help={field.help || "Type and press Enter to add."} error={errors[path]}>
      <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2 py-1.5 shadow-sm focus-within:border-[#1392f9] focus-within:ring-2 focus-within:ring-[#1392f9]/20">
        {tags.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 rounded-md bg-sky-50 px-2 py-1 text-sm font-medium text-sky-800">
            {tag}
            <button type="button" aria-label={`Remove ${tag}`} onClick={() => onChange(tags.filter((x) => x !== tag))} className="text-sky-600 hover:text-sky-900">
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}
        <input
          className="min-w-[8rem] flex-1 border-0 bg-transparent px-1 py-1 text-[15px] focus:outline-none"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add();
            } else if (e.key === "Backspace" && !draft && tags.length) onChange(tags.slice(0, -1));
          }}
          onBlur={add}
          placeholder={tags.length ? "" : "Add…"}
        />
      </div>
    </FieldShell>
  );
}

function StringListInput({ field, value, onChange }) {
  const list = value || [];
  return (
    <FieldShell label={field.label} help={field.help}>
      <div className="space-y-2">
        {list.map((item, i) => (
          <div key={i} className="flex items-center gap-1">
            <input className={inputClass} value={item} onChange={(e) => onChange(list.map((x, j) => (j === i ? e.target.value : x)))} />
            <IconButton label="Move up" disabled={i === 0} onClick={() => onChange(move(list, i, i - 1))}>
              <ArrowUp className="h-4 w-4" />
            </IconButton>
            <IconButton label="Move down" disabled={i === list.length - 1} onClick={() => onChange(move(list, i, i + 1))}>
              <ArrowDown className="h-4 w-4" />
            </IconButton>
            <IconButton label="Remove" onClick={() => onChange(list.filter((_, j) => j !== i))} className="hover:text-red-600">
              <Trash2 className="h-4 w-4" />
            </IconButton>
          </div>
        ))}
        <Button size="sm" onClick={() => onChange([...list, ""])}>
          <Plus className="h-4 w-4" /> Add {field.itemLabel || "item"}
        </Button>
      </div>
    </FieldShell>
  );
}

function DateInput({ field, value, onChange, path, withTime }) {
  const { errors } = useEditor();
  const id = useId();
  let local = value || "";
  if (withTime && value) {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) local = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  }
  return (
    <FieldShell label={field.label} help={field.help} error={errors[path]} htmlFor={id}>
      <input
        id={id}
        type={withTime ? "datetime-local" : "date"}
        className={`${inputClass} max-w-xs`}
        value={local}
        onChange={(e) => onChange(e.target.value ? (withTime ? new Date(e.target.value).toISOString() : e.target.value) : undefined)}
      />
    </FieldShell>
  );
}

function ColorInput({ field, value, onChange, path }) {
  const { errors } = useEditor();
  return (
    <FieldShell label={field.label} help={field.help} error={errors[path]}>
      <div className="flex items-center gap-3">
        <input type="color" aria-label={field.label} className="h-10 w-14 cursor-pointer rounded-lg border border-slate-300 bg-white p-1" value={/^#[0-9a-f]{6}$/i.test(value || "") ? value : "#1392f9"} onChange={(e) => onChange(e.target.value)} />
        <input className={`${inputClass} max-w-[9rem] font-mono ${errors[path] ? errorInputClass : ""}`} value={value || ""} placeholder="#1392f9" onChange={(e) => onChange(e.target.value)} />
      </div>
    </FieldShell>
  );
}

function SlugInput({ field, value, onChange, path, doc }) {
  const { errors, siteUrl } = useEditor();
  const current = value?.current || "";
  const host = (siteUrl || "").replace(/^https?:\/\//, "");
  return (
    <FieldShell label={field.label} help={field.help || "Lowercase letters, numbers and dashes."} error={errors[path]}>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className={`flex flex-1 items-center overflow-hidden rounded-lg border bg-white shadow-sm focus-within:ring-2 focus-within:ring-[#1392f9]/20 ${errors[path] ? "border-red-400" : "border-slate-300 focus-within:border-[#1392f9]"}`}>
          <span className="whitespace-nowrap bg-slate-50 px-3 py-2 text-sm text-slate-500">{host}{field.prefix || "/"}</span>
          <input className="w-full border-0 px-2 py-2 text-[15px] focus:outline-none" value={current} onChange={(e) => onChange({ _type: "slug", current: e.target.value.toLowerCase().replace(/\s+/g, "-") })} />
        </div>
        {field.source && (
          <Button size="md" onClick={() => onChange({ _type: "slug", current: slugify(doc?.[field.source]) })}>
            Make from name
          </Button>
        )}
      </div>
    </FieldShell>
  );
}

function PostPicker({ field, value, onChange, doc }) {
  const { posts } = useEditor();
  const selected = new Set((value || []).map((r) => r._ref));
  const options = posts.filter((p) => p._id !== doc?._id);
  const toggle = (id) => {
    if (selected.has(id)) onChange((value || []).filter((r) => r._ref !== id));
    else onChange([...(value || []), { _type: "reference", _ref: id, _key: newKey() }]);
  };
  return (
    <FieldShell label={field.label} help="Shown under the article. Pick up to 6.">
      {options.length === 0 ? (
        <p className="text-sm text-slate-500">No other articles yet.</p>
      ) : (
        <div className="max-h-64 space-y-1 overflow-y-auto rounded-lg border border-slate-200 p-2">
          {options.map((p) => (
            <label key={p._id} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 hover:bg-slate-50">
              <input type="checkbox" checked={selected.has(p._id)} disabled={!selected.has(p._id) && selected.size >= 6} onChange={() => toggle(p._id)} />
              <span className="text-sm text-slate-800">{p.title}</span>
            </label>
          ))}
        </div>
      )}
    </FieldShell>
  );
}

// ---------- groups ----------
function GroupInput({ field, value, onChange, path, doc }) {
  const set = (name, v) => onChange({ ...(field._type ? { _type: field._type } : {}), ...(value || {}), [name]: v });
  const body = <FieldList fields={field.fields} value={value} onFieldChange={set} basePath={path} doc={doc} />;
  if (!field.label) return body;
  return (
    <fieldset className="rounded-xl border border-slate-200 p-4">
      <legend className="px-1 text-sm font-bold text-slate-800">{field.label}</legend>
      {field.help && <p className="mb-3 text-[13px] text-slate-500">{field.help}</p>}
      {body}
    </fieldset>
  );
}

// ---------- repeatable items ----------
function ItemCard({ title, subtitle, thumb, hidden, open, onToggle, error, actions, children, dragProps }) {
  return (
    <div className={`rounded-xl border bg-white shadow-sm transition ${error ? "border-red-300" : "border-slate-200"} ${hidden ? "opacity-70" : ""}`}>
      <div className="flex items-center gap-2 px-2 py-2" {...dragProps}>
        <span className="cursor-grab text-slate-300 hover:text-slate-500" title="Drag to reorder">
          <GripVertical className="h-4 w-4" />
        </span>
        <button type="button" onClick={onToggle} className="flex min-w-0 flex-1 items-center gap-3 text-left">
          {thumb}
          <span className="min-w-0">
            <span className="block truncate text-[15px] font-semibold text-slate-900">{title}</span>
            {subtitle && <span className="block truncate text-xs text-slate-500">{subtitle}</span>}
          </span>
          {hidden && <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">Hidden</span>}
          {error && <span className="shrink-0 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">Needs attention</span>}
        </button>
        <div className="flex shrink-0 items-center">{actions}</div>
        <IconButton label={open ? "Collapse" : "Edit"} onClick={onToggle}>
          <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
        </IconButton>
      </div>
      {open && <div className="space-y-5 border-t border-slate-100 px-4 py-4">{children}</div>}
    </div>
  );
}

function useDragList(list, onChange) {
  const [dragIndex, setDragIndex] = useState(null);
  const props = (index) => ({
    draggable: true,
    onDragStart: (e) => {
      // Only start dragging from the card header, not from inputs inside it.
      if (e.target.closest("input,textarea,select")) return e.preventDefault();
      setDragIndex(index);
      e.dataTransfer.effectAllowed = "move";
    },
    onDragOver: (e) => dragIndex !== null && e.preventDefault(),
    onDrop: (e) => {
      e.preventDefault();
      if (dragIndex !== null) onChange(move(list, dragIndex, index));
      setDragIndex(null);
    },
    onDragEnd: () => setDragIndex(null),
  });
  return props;
}

function RowActions({ index, length, onMove, item, hasHidden, onHide, onDuplicate, onDelete }) {
  const [confirming, setConfirming] = useState(false);
  if (confirming) {
    return (
      <span className="flex items-center gap-1 text-sm">
        <span className="text-slate-600">Delete?</span>
        <Button size="sm" variant="danger" onClick={onDelete}>Yes</Button>
        <Button size="sm" variant="ghost" onClick={() => setConfirming(false)}>No</Button>
      </span>
    );
  }
  return (
    <>
      <IconButton label="Move up" disabled={index === 0} onClick={() => onMove(index - 1)}>
        <ArrowUp className="h-4 w-4" />
      </IconButton>
      <IconButton label="Move down" disabled={index === length - 1} onClick={() => onMove(index + 1)}>
        <ArrowDown className="h-4 w-4" />
      </IconButton>
      {hasHidden && (
        <IconButton label={item.hidden ? "Show on website" : "Hide from website"} onClick={onHide}>
          {item.hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </IconButton>
      )}
      <IconButton label="Duplicate" onClick={onDuplicate}>
        <Copy className="h-4 w-4" />
      </IconButton>
      <IconButton label="Delete" onClick={() => setConfirming(true)} className="hover:text-red-600">
        <Trash2 className="h-4 w-4" />
      </IconButton>
    </>
  );
}

function Thumb({ image }) {
  const src = imageUrl(image, { width: 96, height: 96 });
  if (!src) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" className="h-10 w-10 shrink-0 rounded-md bg-slate-100 object-cover" />;
}

function ItemsInput({ field, value, onChange, path, doc }) {
  const { errors } = useEditor();
  const list = value || [];
  const [openKey, setOpenKey] = useState(null);
  const dragProps = useDragList(list, onChange);
  const isLink = field.itemType === "link" || field.linkFields;
  const hasHidden = isLink || (field.fields || []).some((f) => f.name === "hidden");

  const updateItem = (key, next) => onChange(list.map((it) => (it._key === key ? next : it)));
  const add = () => {
    const key = newKey();
    const base = { _key: key, _type: field.itemType };
    const item = isLink ? { ...base, linkType: "internal", label: "", path: "" } : withDefaults(field.fields, base);
    onChange([...list, item]);
    setOpenKey(key);
  };

  return (
    <FieldShell label={field.label} help={field.help} error={errors[path]}>
      <div className="space-y-2">
        {list.map((item, index) => {
          const itemPath = `${path}.${item._key}`;
          const title =
            (field.titleField && item[field.titleField]) || (field.bareImage && item.alt) || `New ${field.itemLabel || "item"}`;
          const subtitle = isLink ? (item.linkType === "external" ? item.url : item.path) : field.bareImage ? null : undefined;
          const thumbImage = field.imageField === "_self" ? item : field.imageField ? item[field.imageField] : null;
          const set = (name, v) => updateItem(item._key, { ...item, [name]: v });
          return (
            <ItemCard
              key={item._key}
              title={title}
              subtitle={subtitle}
              thumb={thumbImage ? <Thumb image={thumbImage} /> : null}
              hidden={item.hidden}
              open={openKey === item._key}
              onToggle={() => setOpenKey(openKey === item._key ? null : item._key)}
              error={hasErrorUnder(errors, itemPath)}
              dragProps={dragProps(index)}
              actions={
                <RowActions
                  index={index}
                  length={list.length}
                  item={item}
                  hasHidden={hasHidden}
                  onMove={(to) => onChange(move(list, index, to))}
                  onHide={() => set("hidden", !item.hidden)}
                  onDuplicate={() => onChange([...list.slice(0, index + 1), rekey(item), ...list.slice(index + 1)])}
                  onDelete={() => onChange(list.filter((it) => it._key !== item._key))}
                />
              }
            >
              {field.bareImage ? (
                <ImageField field={{ label: "Picture" }} value={item} onChange={(img) => updateItem(item._key, img ? { ...img, _key: item._key, _type: "image" } : item)} />
              ) : (
                <>
                  {isLink && <LinkEditor value={item} onChange={(next) => updateItem(item._key, { ...next, _key: item._key, _type: item._type })} path={itemPath} />}
                  {field.fields?.length > 0 && <FieldList fields={field.fields} value={item} onFieldChange={set} basePath={itemPath} doc={doc} />}
                </>
              )}
            </ItemCard>
          );
        })}
        {list.length === 0 && <p className="rounded-lg border border-dashed border-slate-300 px-4 py-5 text-center text-sm text-slate-500">Nothing here yet.</p>}
        <Button size="sm" onClick={add}>
          <Plus className="h-4 w-4" /> Add {field.itemLabel || "item"}
        </Button>
      </div>
    </FieldShell>
  );
}

// ---------- page sections ----------
function SectionsInput({ value, onChange, path, doc }) {
  const { errors } = useEditor();
  const list = value || [];
  const [openKey, setOpenKey] = useState(null);
  const [adding, setAdding] = useState(null); // index to insert at
  const dragProps = useDragList(list, onChange);

  const insert = (type) => {
    const def = SECTION_TYPES[type];
    const key = newKey();
    const section = withDefaults(def.fields, { _key: key, _type: type, hidden: false });
    const at = adding ?? list.length;
    onChange([...list.slice(0, at), section, ...list.slice(at)]);
    setAdding(null);
    setOpenKey(key);
  };

  return (
    <div className="space-y-3">
      {list.length === 0 && (
        <div className="rounded-xl border-2 border-dashed border-slate-300 px-6 py-10 text-center">
          <p className="font-semibold text-slate-800">This page has no sections yet</p>
          <p className="mt-1 text-sm text-slate-500">Add a banner, text, pictures, FAQs and more.</p>
        </div>
      )}
      {list.map((section, index) => {
        const def = SECTION_TYPES[section._type];
        const sectionPath = `${path}.${section._key}`;
        if (!def) return null;
        const heading = def.titleField ? section[def.titleField] : null;
        return (
          <ItemCard
            key={section._key}
            title={
              <span className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-sky-50 text-[#1392f9]">
                  <Icon name={def.icon} />
                </span>
                {def.label}
              </span>
            }
            subtitle={heading ? <span className="ml-9">“{heading}”</span> : null}
            hidden={section.hidden}
            open={openKey === section._key}
            onToggle={() => setOpenKey(openKey === section._key ? null : section._key)}
            error={hasErrorUnder(errors, sectionPath)}
            dragProps={dragProps(index)}
            actions={
              <RowActions
                index={index}
                length={list.length}
                item={section}
                hasHidden
                onMove={(to) => onChange(move(list, index, to))}
                onHide={() => onChange(list.map((s) => (s._key === section._key ? { ...s, hidden: !s.hidden } : s)))}
                onDuplicate={() => onChange([...list.slice(0, index + 1), rekey(section), ...list.slice(index + 1)])}
                onDelete={() => onChange(list.filter((s) => s._key !== section._key))}
              />
            }
          >
            <p className="-mt-1 text-[13px] text-slate-500">{def.description}</p>
            <FieldList
              fields={def.fields.filter((f) => f.name !== "hidden")}
              value={section}
              onFieldChange={(name, v) => onChange(list.map((s) => (s._key === section._key ? { ...s, [name]: v } : s)))}
              basePath={sectionPath}
              doc={doc}
            />
          </ItemCard>
        );
      })}
      <Button variant="primary" onClick={() => setAdding(list.length)}>
        <Plus className="h-4 w-4" /> Add a section
      </Button>

      <Modal open={adding !== null} onClose={() => setAdding(null)} title="Add a section" wide>
        <div className="grid gap-2 sm:grid-cols-2">
          {SECTION_TYPE_LIST.map((s) => (
            <button
              key={s.type}
              type="button"
              onClick={() => insert(s.type)}
              className="flex items-start gap-3 rounded-xl border border-slate-200 p-3 text-left transition hover:border-[#1392f9] hover:bg-sky-50/50"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-[#1392f9]">
                <Icon name={s.icon} className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-semibold text-slate-900">{s.label}</span>
                <span className="block text-[13px] leading-snug text-slate-500">{s.description}</span>
              </span>
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
}

// ---------- renderer ----------
export function FieldRenderer({ field, value, onChange, path, doc }) {
  const { errors } = useEditor();
  switch (field.type) {
    case "text":
    case "url":
    case "email":
      return <TextInput field={field} value={value} onChange={onChange} path={path} />;
    case "textarea":
      return <TextInput field={field} value={value} onChange={onChange} path={path} multiline />;
    case "number":
      return <NumberInput field={field} value={value} onChange={onChange} path={path} />;
    case "toggle":
      return <Toggle id={path} checked={value ?? field.default ?? false} onChange={onChange} label={field.label} help={field.help} />;
    case "choice":
      return <ChoiceInput field={field} value={value} onChange={onChange} path={path} />;
    case "tags":
      return <TagsInput field={field} value={value} onChange={onChange} path={path} />;
    case "list":
      return <StringListInput field={field} value={value} onChange={onChange} path={path} />;
    case "date":
      return <DateInput field={field} value={value} onChange={onChange} path={path} />;
    case "datetime":
      return <DateInput field={field} value={value} onChange={onChange} path={path} withTime />;
    case "color":
      return <ColorInput field={field} value={value} onChange={onChange} path={path} />;
    case "slug":
      return <SlugInput field={field} value={value} onChange={onChange} path={path} doc={doc} />;
    case "image":
      return <ImageField field={field} value={value} onChange={onChange} error={errors[path]} />;
    case "video":
      return <VideoField field={field} value={value} onChange={onChange} error={errors[path]} />;
    case "link":
      return <LinkField field={field} value={value} onChange={onChange} path={path} />;
    case "richText":
      return <RichTextField field={field} value={value} onChange={onChange} error={errors[path]} />;
    case "group":
      return <GroupInput field={field} value={value} onChange={onChange} path={path} doc={doc} />;
    case "items":
      return <ItemsInput field={field} value={value} onChange={onChange} path={path} doc={doc} />;
    case "sections":
      return <SectionsInput value={value} onChange={onChange} path={path} doc={doc} />;
    case "seo":
      return (
        <SeoField
          value={value}
          onChange={onChange}
          path={path}
          isDefault={field.isDefault}
          docTitle={doc?.title || doc?.heroTitle || doc?.heading}
          pagePath={doc?.__previewPath}
        />
      );
    case "postPicker":
      return <PostPicker field={field} value={value} onChange={onChange} doc={doc} />;
    default:
      return null;
  }
}

/** Renders a list of fields; rarely-used ones are tucked under "More settings". */
export function FieldList({ fields, value, onFieldChange, basePath, doc }) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const normal = fields.filter((f) => !f.advanced);
  const advanced = fields.filter((f) => f.advanced);
  const render = (f) => (
    <FieldRenderer key={f.name} field={f} value={value?.[f.name]} onChange={(v) => onFieldChange(f.name, v)} path={join(basePath, f.name)} doc={doc} />
  );
  return (
    <div className="space-y-5">
      {normal.map(render)}
      {advanced.length > 0 && (
        <div>
          <button type="button" onClick={() => setShowAdvanced(!showAdvanced)} className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-800">
            <ChevronDown className={`h-4 w-4 transition ${showAdvanced ? "rotate-180" : ""}`} /> More settings
          </button>
          {showAdvanced && <div className="mt-4 space-y-5">{advanced.map(render)}</div>}
        </div>
      )}
    </div>
  );
}
