// WhatsApp links shared by the floating button and the homepage QR code.

/** Number used by the "Whatsapp us" buttons on product cards and product pages. */
export const PRODUCT_WHATSAPP_NUMBER = "+971552748974";

/** https://wa.me/<digits>?text=… or null when no number is set. */
export function whatsappChatUrl(number, message) {
  const digits = String(number || "").replace(/[^0-9]/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}

/**
 * What the QR code opens: the WhatsApp channel if one is set in Website basics,
 * otherwise a chat with the business number.
 */
export function whatsappQrTarget(settings) {
  const channel = /^https:\/\//i.test(settings?.whatsappChannelUrl || "") ? settings.whatsappChannelUrl : null;
  const url = channel || whatsappChatUrl(settings?.whatsappNumber, settings?.whatsappMessage);
  if (!url) return null;
  return {
    url,
    kind: channel ? "channel" : "chat",
    label: settings?.whatsappChannelLabel || (channel ? "Follow us on WhatsApp" : "Chat with us on WhatsApp"),
  };
}
