import { CogIcon, MenuIcon, BlockElementIcon, HomeIcon, EnvelopeIcon, UploadIcon, ComposeIcon, DocumentsIcon, EditIcon } from "./icons";

const singleton = (S, type, title, icon) =>
  S.listItem()
    .title(title)
    .id(type)
    .icon(icon)
    .child(S.document().schemaType(type).documentId(type).title(title));

/** Studio sidebar, organised for non-technical editors. */
export const structure = (S) =>
  S.list()
    .title("Website content")
    .items([
      singleton(S, "siteSettings", "Website Settings", CogIcon),
      singleton(S, "navigation", "Navigation", MenuIcon),
      singleton(S, "footer", "Footer", BlockElementIcon),
      S.divider(),
      singleton(S, "homePage", "Homepage", HomeIcon),
      singleton(S, "contactPage", "Contact Page", EnvelopeIcon),
      singleton(S, "sellPage", "Sell With Us Page", UploadIcon),
      singleton(S, "blogSettings", "Blog Page Settings", ComposeIcon),
      S.divider(),
      S.documentTypeListItem("page").title("Pages").icon(DocumentsIcon),
      S.documentTypeListItem("blogPost").title("Blog Posts").icon(EditIcon),
    ]);
