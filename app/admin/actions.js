"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { assertAdmin, signIn, signOut } from "@/lib/admin/auth";
import { getWriteClient } from "@/lib/admin/sanityWrite";
import { DOCUMENTS, SINGLETONS, documentFields } from "@/lib/admin/config";
import { validateDocument } from "@/lib/admin/validate";
import { clean } from "@/lib/admin/paths";

export async function loginAction(_prev, formData) {
  const result = await signIn(formData.get("password"));
  if (result.error) return { error: result.error };
  redirect("/admin");
}

export async function logoutAction() {
  await signOut();
  redirect("/admin/login");
}

function refreshWebsite() {
  // Every Sanity query on the website is tagged "sanity" — expire them so changes show immediately.
  updateTag("sanity");
  revalidatePath("/sitemap.xml");
}

const ID_RE = /^[a-zA-Z0-9._-]+$/;

function assertEditable(type, id) {
  if (!DOCUMENTS[type]) throw new Error("Unknown content type.");
  if (!id || !ID_RE.test(id) || id.startsWith("drafts.")) throw new Error("Invalid document id.");
  if (SINGLETONS.includes(type) && id !== type) throw new Error("Invalid document id.");
}

/**
 * Save and publish a document. Uses the revision id to avoid overwriting changes someone else
 * made (e.g. in Sanity Studio) after this page was opened.
 */
export async function saveDocument({ id, type, rev, data }) {
  try {
    await assertAdmin();
    assertEditable(type, id);

    // Only fields the admin panel knows about are written; system fields are never accepted.
    const fields = documentFields(type).map((f) => f.name);
    const values = {};
    for (const name of fields) values[name] = clean(data?.[name]);

    const errors = validateDocument(type, values);
    if (errors.length) return { error: "Some fields need attention.", errors };

    const client = getWriteClient();

    if (type === "page" || type === "blogPost") {
      const slug = values.slug?.current;
      const taken = await client.fetch(`count(*[_type == $type && slug.current == $slug && _id != $id && !(_id in path("drafts.**"))])`, {
        type,
        slug,
        id,
      });
      if (taken) return { error: "Another page already uses this web address.", errors: [{ path: "slug", message: "Already used — pick another" }] };
    }

    const set = {};
    const unset = [];
    for (const name of fields) {
      if (values[name] === undefined) unset.push(name);
      else set[name] = values[name];
    }

    const existing = await client.getDocument(id);
    let result;
    if (!existing) {
      result = await client.create({ _id: id, _type: type, ...set });
    } else {
      if (existing._type !== type) throw new Error("Document type mismatch.");
      let patch = client.patch(id).set(set);
      if (unset.length) patch = patch.unset(unset);
      if (rev) patch = patch.ifRevisionId(rev);
      result = await patch.commit({ autoGenerateArrayKeys: true });
    }

    refreshWebsite();
    return { ok: true, rev: result._rev, updatedAt: result._updatedAt };
  } catch (error) {
    if (error?.statusCode === 409) {
      return { error: "Someone else changed this since you opened it. Reload the page to see their changes, then edit again." };
    }
    console.error("[admin] save failed:", error);
    return { error: error?.message || "Saving failed. Please try again." };
  }
}

export async function createDocument(type) {
  await assertAdmin();
  const config = DOCUMENTS[type];
  if (!config?.collection) throw new Error("Unknown content type.");
  const client = getWriteClient();
  const base = config.newDocument();

  // Give the new document a unique, valid web address.
  const prefix = type === "page" ? "new-page" : "new-article";
  let slug = prefix;
  for (let i = 2; await client.fetch(`count(*[_type == $type && slug.current == $slug])`, { type, slug }); i++) slug = `${prefix}-${i}`;

  const id = `${type}-${crypto.randomUUID()}`;
  await client.create({ _id: id, ...base, slug: { _type: "slug", current: slug }, ...(type === "page" ? { status: "hidden" } : {}) });
  redirect(`/admin/${type === "page" ? "pages" : "articles"}/${id}`);
}

export async function deleteDocument({ id, type }) {
  try {
    await assertAdmin();
    assertEditable(type, id);
    if (!DOCUMENTS[type].collection) throw new Error("This can't be deleted.");
    const client = getWriteClient();
    await client.transaction().delete(id).delete(`drafts.${id}`).commit();
    refreshWebsite();
    return { ok: true };
  } catch (error) {
    console.error("[admin] delete failed:", error);
    return { error: error?.message || "Deleting failed." };
  }
}
