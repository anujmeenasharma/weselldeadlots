"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, Check, ExternalLink, Loader2, MonitorSmartphone, PanelRightClose, Trash2 } from "lucide-react";
import { DOCUMENTS, previewPathFor } from "@/lib/admin/config";
import { validateDocument } from "@/lib/admin/validate";
import { setIn } from "@/lib/admin/paths";
import { deleteDocument, saveDocument } from "@/app/admin/actions";
import Icon from "./Icon";
import { FieldList } from "./Fields";
import { Button, EditorContext, Modal } from "./ui";

export default function DocumentEditor({ type, initialDoc, posts = [], sitePaths = [], siteUrl, backHref }) {
  const config = DOCUMENTS[type];
  const router = useRouter();
  const [doc, setDoc] = useState(initialDoc);
  const [rev, setRev] = useState(initialDoc?._rev);
  const [dirty, setDirty] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null); // { kind: "ok" | "error", text }
  const [tab, setTab] = useState(config.tabs[0].id);
  const [showPreview, setShowPreview] = useState(false);
  const [previewNonce, setPreviewNonce] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [saving, startSaving] = useTransition();
  const [deleting, startDeleting] = useTransition();
  const statusTimer = useRef(null);

  const previewPath = previewPathFor(type, doc);
  const title = config.collection ? doc?.[config.titleField] || `Untitled ${config.label.toLowerCase()}` : config.label;

  const onFieldChange = useCallback((name, value) => {
    setDoc((d) => setIn(d, name, value));
    setDirty(true);
  }, []);

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    const handler = (e) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const flash = (kind, text) => {
    setStatus({ kind, text });
    clearTimeout(statusTimer.current);
    if (kind === "ok") statusTimer.current = setTimeout(() => setStatus(null), 4000);
  };

  const tabOfField = (fieldName) => config.tabs.find((t) => t.fields.some((f) => f.name === fieldName))?.id;

  const showErrors = (list) => {
    const map = Object.fromEntries(list.map((e) => [e.path, e.message]));
    setErrors(map);
    const firstTab = tabOfField(list[0]?.path.split(".")[0]);
    if (firstTab) setTab(firstTab);
  };

  const save = () => {
    const local = validateDocument(type, doc);
    if (local.length) {
      showErrors(local);
      flash("error", `Please fix ${local.length === 1 ? "1 field" : `${local.length} fields`} marked in red.`);
      return;
    }
    setErrors({});
    startSaving(async () => {
      const result = await saveDocument({ id: doc._id, type, rev, data: doc });
      if (result?.ok) {
        setRev(result.rev);
        setDirty(false);
        setPreviewNonce((n) => n + 1);
        flash("ok", "Published — your changes are live on the website.");
        router.refresh();
      } else {
        if (result?.errors?.length) showErrors(result.errors);
        flash("error", result?.error || "Saving failed.");
      }
    });
  };

  // Ctrl/Cmd + S publishes.
  const saveRef = useRef(save);
  useEffect(() => {
    saveRef.current = save;
  });
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveRef.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const remove = () =>
    startDeleting(async () => {
      const result = await deleteDocument({ id: doc._id, type });
      if (result?.ok) {
        setDirty(false);
        router.push(backHref);
        router.refresh();
      } else {
        setConfirmDelete(false);
        flash("error", result?.error || "Deleting failed.");
      }
    });

  const context = useMemo(() => ({ errors, posts, sitePaths, siteUrl }), [errors, posts, sitePaths, siteUrl]);
  const activeTab = config.tabs.find((t) => t.id === tab) || config.tabs[0];
  const errorTabs = new Set(Object.keys(errors).map((p) => tabOfField(p.split(".")[0])));
  const docForFields = useMemo(() => ({ ...doc, __previewPath: previewPath }), [doc, previewPath]);

  return (
    <EditorContext.Provider value={context}>
      <div className="flex min-h-screen flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex flex-wrap items-center gap-3 px-4 py-3 md:px-8">
            {backHref && (
              <Link href={backHref} className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100" aria-label="Back">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-lg font-bold text-slate-900 md:text-xl">{title}</h1>
              <p className="text-xs font-medium">
                {dirty ? (
                  <span className="text-amber-600">● Unpublished changes</span>
                ) : (
                  <span className="text-emerald-600">✓ Everything is published</span>
                )}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {config.collection && (
                <Button variant="dangerGhost" onClick={() => setConfirmDelete(true)}>
                  <Trash2 className="h-4 w-4" /> <span className="hidden sm:inline">Delete</span>
                </Button>
              )}
              {previewPath && (
                <>
                  <Button className="hidden lg:inline-flex" onClick={() => setShowPreview(!showPreview)}>
                    {showPreview ? <PanelRightClose className="h-4 w-4" /> : <MonitorSmartphone className="h-4 w-4" />}
                    {showPreview ? "Hide preview" : "Show preview"}
                  </Button>
                  <a href={previewPath} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
                    <ExternalLink className="h-4 w-4" /> <span className="hidden sm:inline">View page</span>
                  </a>
                </>
              )}
              <Button variant="primary" onClick={save} disabled={saving || !dirty} title="Ctrl + S">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                {saving ? "Publishing…" : "Publish changes"}
              </Button>
            </div>
          </div>

          {config.tabs.length > 1 && (
            <nav className="flex gap-1 overflow-x-auto px-4 md:px-8" aria-label="Sections">
              {config.tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`relative inline-flex shrink-0 items-center gap-2 border-b-2 px-3 pb-2.5 pt-1 text-sm font-semibold transition ${
                    tab === t.id ? "border-[#1392f9] text-[#1392f9]" : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Icon name={t.icon} />
                  {t.label}
                  {errorTabs.has(t.id) && <span className="h-2 w-2 rounded-full bg-red-500" aria-label="has errors" />}
                </button>
              ))}
            </nav>
          )}
        </header>

        {status && (
          <div
            role="status"
            className={`mx-4 mt-4 flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium md:mx-8 ${
              status.kind === "ok" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"
            }`}
          >
            {status.kind === "ok" ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            {status.text}
          </div>
        )}

        <div className="flex flex-1">
          <main className={`flex-1 px-4 py-6 md:px-8 ${showPreview ? "lg:max-w-[52%]" : ""}`}>
            <div className="mx-auto max-w-3xl">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
                <FieldList key={activeTab.id} fields={activeTab.fields} value={doc} onFieldChange={onFieldChange} basePath="" doc={docForFields} />
              </div>
              <p className="mt-4 text-center text-xs text-slate-400">Tip: press Ctrl + S to publish.</p>
            </div>
          </main>
          {showPreview && previewPath && (
            <aside className="sticky top-[7.5rem] hidden h-[calc(100vh-7.5rem)] flex-1 border-l border-slate-200 bg-slate-100 p-3 lg:block">
              <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center gap-2 border-b border-slate-200 px-3 py-2 text-xs text-slate-500">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                  <span className="truncate">{previewPath}</span>
                  <span className="ml-auto">{dirty ? "Publish to see your latest changes" : "Live"}</span>
                </div>
                <iframe key={previewNonce} title="Website preview" src={`${previewPath}${previewPath.includes("?") ? "&" : "?"}_preview=${previewNonce}`} className="h-full w-full border-0" />
              </div>
            </aside>
          )}
        </div>
      </div>

      <Modal open={confirmDelete} onClose={() => setConfirmDelete(false)} title={`Delete “${title}”?`}>
        <p className="text-sm text-slate-600">It will be removed from the website straight away. This can&apos;t be undone here.</p>
        <div className="mt-5 flex justify-end gap-2">
          <Button onClick={() => setConfirmDelete(false)}>Cancel</Button>
          <Button variant="danger" onClick={remove} disabled={deleting}>
            {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />} Delete
          </Button>
        </div>
      </Modal>
    </EditorContext.Provider>
  );
}
