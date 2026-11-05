"use client";
import { useEffect, useRef, useState } from "react";
import { whatsappChatUrl } from "@/lib/whatsapp";

const WHATSAPP_PATH =
  "M16 .396C7.164.396 0 7.56 0 16.396c0 2.894.77 5.716 2.23 8.17L.065 32l7.588-2.142a15.93 15.93 0 0 0 8.347 2.393c8.836 0 16-7.164 16-16S24.836.396 16 .396zm0 29.244c-2.515 0-4.98-.675-7.13-1.952l-.51-.302-4.502 1.27 1.2-4.38-.332-.536a13.938 13.938 0 0 1-2.118-7.344c0-7.72 6.28-14 14-14s14 6.28 14 14-6.28 14-14 14zm7.683-10.617c-.42-.21-2.49-1.23-2.877-1.372-.387-.14-.67-.21-.953.21-.282.42-1.093 1.372-1.34 1.655-.246.282-.492.317-.912.106-.42-.21-1.775-.654-3.383-2.086-1.25-1.116-2.093-2.49-2.338-2.91-.246-.42-.026-.646.184-.856.19-.19.42-.492.63-.738.21-.246.28-.42.42-.702.14-.282.07-.527-.035-.738-.106-.21-.953-2.296-1.305-3.146-.343-.822-.692-.71-.953-.723l-.812-.015c-.282 0-.738.105-1.123.527-.387.42-1.477 1.444-1.477 3.518 0 2.073 1.512 4.077 1.723 4.36.21.282 2.976 4.547 7.21 6.376 1.007.435 1.793.695 2.405.89 1.01.322 1.93.276 2.657.168.81-.12 2.49-1.017 2.84-2.002.352-.984.352-1.828.246-2.002-.105-.174-.387-.282-.807-.492z";

function WhatsAppIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" className={className} aria-hidden="true">
      <path d={WHATSAPP_PATH} />
    </svg>
  );
}

/**
 * Floating WhatsApp button. On computers, clicking it opens a small card with a QR code (a chat with
 * the business number, or the WhatsApp channel if one is set in Website basics) so visitors can scan
 * it with their phone. On phones it opens the chat directly.
 */
export default function WhatsAppButton({ number, message, qr }) {
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 1500); // show after 1.5 sec

    return () => clearTimeout(timer);
  }, []);

  // Close the card on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => panelRef.current && !panelRef.current.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Number and message come from Website Settings; no number and no QR = no button.
  const chatHref = whatsappChatUrl(number, message);
  const isChannel = qr?.kind === "channel";
  if (!show || (!chatHref && !qr)) return null;

  const button = (
    <>
      {/* Pulse Background */}
      <span className="absolute left-0 top-0 inline-flex h-14 w-14 rounded-full bg-green-400 opacity-75 animate-ping"></span>

      {/* Main Button */}
      <div className="relative flex items-center justify-center h-14 w-14 rounded-full bg-green-500 shadow-lg transition-transform duration-300 group-hover:scale-110 text-white">
        <WhatsAppIcon className="w-7 h-7" />
      </div>
    </>
  );

  if (!qr) {
    return (
      <a href={chatHref} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 group">
        {button}
      </a>
    );
  }

  return (
    <div ref={panelRef} className="fixed bottom-6 right-6 z-50">
      {open && (
        <div
          role="dialog"
          aria-label={qr.label}
          className="absolute bottom-[4.5rem] right-0 w-64 rounded-2xl bg-white p-4 text-center shadow-2xl ring-1 ring-black/5"
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="absolute right-2 top-2 h-7 w-7 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            ×
          </button>
          <p className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-900">
            <WhatsAppIcon className="h-4 w-4 text-green-500" />
            {qr.label}
          </p>
          <p className="mt-1 hidden text-xs text-gray-500 md:block">Scan with your phone camera</p>
          <span
            className="mx-auto mt-3 hidden h-44 w-44 md:block [&>svg]:h-full [&>svg]:w-full"
            dangerouslySetInnerHTML={{ __html: qr.svg }}
          />
          <div className="mt-3 flex flex-col gap-2">
            {isChannel && (
              <a
                href={qr.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-green-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-600"
              >
                Follow the channel
              </a>
            )}
            {chatHref && (
              <a
                href={chatHref}
                target="_blank"
                rel="noopener noreferrer"
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  isChannel ? "border border-green-500 text-green-700 hover:bg-green-50" : "bg-green-500 text-white hover:bg-green-600"
                }`}
              >
                {isChannel ? "Chat with us" : "Open WhatsApp chat"}
              </a>
            )}
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => {
          // Phones can't scan their own screen — go straight to the chat.
          if (!isChannel && chatHref && window.matchMedia("(max-width: 767px)").matches) {
            window.open(chatHref, "_blank", "noopener,noreferrer");
            return;
          }
          setOpen((o) => !o);
        }} aria-expanded={open} aria-label="WhatsApp" className="relative block h-14 w-14 p-0 group">
        {button}
      </button>
    </div>
  );
}
