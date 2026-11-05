/**
 * Converts Sanity Portable Text <-> a simple, readable text format for the admin editor.
 *
 *   ## Heading            ### Smaller heading      #### Small heading
 *   - bullet point        1. numbered point        > quote
 *   **bold**   *italic*   __underline__   [link text](https://example.com)
 *   ![alt text](image:image-abc123-800x600-jpg)   ← picture already in the text
 *
 * Every non-empty line becomes its own paragraph / list item.
 */

export const newKey = () => Math.random().toString(36).slice(2, 12);

// ---------- Portable Text -> text ----------
function spansToText(block) {
  const linkDefs = new Map((block.markDefs || []).map((d) => [d._key, d]));
  return (block.children || [])
    .map((span) => {
      let text = span.text || "";
      if (!text) return "";
      const marks = span.marks || [];
      if (marks.includes("strong")) text = `**${text}**`;
      if (marks.includes("em")) text = `*${text}*`;
      if (marks.includes("underline")) text = `__${text}__`;
      const linkKey = marks.find((m) => linkDefs.has(m));
      if (linkKey) text = `[${text}](${linkDefs.get(linkKey).href || ""})`;
      return text;
    })
    .join("");
}

export function portableTextToText(blocks) {
  if (!Array.isArray(blocks)) return "";
  const lines = [];
  let numberCounter = 0;
  blocks.forEach((block, index) => {
    if (block._type === "image") {
      lines.push(`![${block.alt || ""}](image:${block.asset?._ref || ""})`);
      numberCounter = 0;
      return;
    }
    if (block._type !== "block") return;
    const text = spansToText(block);
    let line;
    if (block.listItem === "bullet") line = `- ${text}`;
    else if (block.listItem === "number") line = `${++numberCounter}. ${text}`;
    else if (block.style === "h2") line = `## ${text}`;
    else if (block.style === "h3") line = `### ${text}`;
    else if (block.style === "h4") line = `#### ${text}`;
    else if (block.style === "blockquote") line = `> ${text}`;
    else line = text;
    if (block.listItem !== "number") numberCounter = 0;

    // Keep list items tight; separate everything else with a blank line for readability.
    const prev = blocks[index - 1];
    const sameList = prev && prev.listItem && prev.listItem === block.listItem;
    if (lines.length && !sameList) lines.push("");
    lines.push(line);
  });
  return lines.join("\n");
}

// ---------- text -> Portable Text ----------
const INLINE_RE = /(\*\*[^*]+\*\*|__[^_]+__|\*[^*\s][^*]*\*|\[[^\]]+\]\([^)\s]+\))/g;

function parseInline(text) {
  const children = [];
  const markDefs = [];
  const push = (t, marks = []) => t && children.push({ _type: "span", _key: newKey(), text: t, marks });

  let last = 0;
  for (const match of text.matchAll(INLINE_RE)) {
    push(text.slice(last, match.index));
    const token = match[0];
    if (token.startsWith("**")) push(token.slice(2, -2), ["strong"]);
    else if (token.startsWith("__")) push(token.slice(2, -2), ["underline"]);
    else if (token.startsWith("[")) {
      const [, label, href] = token.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
      const key = newKey();
      markDefs.push({ _type: "link", _key: key, href });
      push(label, [key]);
    } else push(token.slice(1, -1), ["em"]);
    last = match.index + token.length;
  }
  push(text.slice(last));
  if (!children.length) children.push({ _type: "span", _key: newKey(), text: "", marks: [] });
  return { children, markDefs };
}

export function textToPortableText(text) {
  const blocks = [];
  for (const raw of String(text || "").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;

    const image = line.match(/^!\[([^\]]*)\]\(image:([^)]+)\)$/);
    if (image) {
      if (image[2]) blocks.push({ _type: "image", _key: newKey(), alt: image[1], asset: { _type: "reference", _ref: image[2] } });
      continue;
    }

    let style = "normal";
    let listItem;
    let content = line;
    let m;
    if ((m = line.match(/^(#{2,4})\s+(.*)$/))) {
      style = `h${m[1].length}`;
      content = m[2];
    } else if ((m = line.match(/^>\s?(.*)$/))) {
      style = "blockquote";
      content = m[1];
    } else if ((m = line.match(/^[-•*]\s+(.*)$/))) {
      listItem = "bullet";
      content = m[1];
    } else if ((m = line.match(/^\d+[.)]\s+(.*)$/))) {
      listItem = "number";
      content = m[1];
    }

    const { children, markDefs } = parseInline(content);
    blocks.push({
      _type: "block",
      _key: newKey(),
      style,
      markDefs,
      children,
      ...(listItem ? { listItem, level: 1 } : {}),
    });
  }
  return blocks;
}
