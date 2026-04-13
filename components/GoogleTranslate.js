"use client";

import { useEffect } from "react";

const GoogleTranslate = () => {
  useEffect(() => {
    // Inject custom CSS to hide the Google Translate widget and iframe
    if (!document.getElementById("google-translate-css")) {
      const style = document.createElement("style");
      style.id = "google-translate-css";
      style.innerHTML = `
        /* Hide the Google Translate widget */
        .skiptranslate.goog-te-gadget {
            display: none !important;
        }
        /* Hide the top iframe banner */
        body {
            top: 0 !important;
        }
        .goog-te-banner-frame.skiptranslate {
            display: none !important;
            visibility: hidden !important;
        }
        .goog-tooltip {
            display: none !important;
        }
        .goog-tooltip:hover {
            display: none !important;
        }
        .goog-text-highlight {
            background-color: transparent !important;
            border: none !important; 
            box-shadow: none !important;
        }
      `;
      document.head.appendChild(style);
    }

    if (!document.querySelector("#google-translate-script")) {
      window.googleTranslateElementInit = () => {
        if (window.google && window.google.translate) {
            new window.google.translate.TranslateElement(
            { 
                pageLanguage: "en", 
                includedLanguages: "ar,en",
                autoDisplay: false 
            },
            "google_translate_element"
            );
        }
      };

      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return <div id="google_translate_element" style={{ display: "none" }}></div>;
};

export default GoogleTranslate;
