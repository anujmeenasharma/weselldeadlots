"use client";

import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
const EMAILJS_SERVICE_ID  = "service_2yccege";
const EMAILJS_TEMPLATE_ID = "template_dqjpndk";
const EMAILJS_PUBLIC_KEY  = "Z4NuZtjUt3KVkg70w";

const STOCK_CATEGORIES = [
  "Electronics",
  "Clothing & Apparel",
  "Footwear",
  "Furniture & Home Decor",
  "Toys & Games",
  "Sports & Fitness",
  "Beauty & Personal Care",
  "Books & Stationery",
  "Automotive Parts",
  "Food & Beverages",
  "Industrial Equipment",
  "Other",
];

const CURRENCIES = ["AED", "USD", "EUR", "GBP", "INR", "SAR", "QAR", "KWD"];

const COUNTRIES_STATES = {
  "United Arab Emirates": ["Abu Dhabi", "Dubai", "Sharjah", "Ajman", "Umm Al Quwain", "Ras Al Khaimah", "Fujairah"],
  "United States": ["California", "New York", "Texas", "Florida", "Illinois"],
  "India": ["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Gujarat"],
  "United Kingdom": ["England", "Scotland", "Wales", "Northern Ireland"],
  "Saudi Arabia": ["Riyadh", "Jeddah", "Mecca", "Medina", "Dammam"],
  "Qatar": ["Doha", "Al Rayyan", "Al Wakrah", "Al Khor"],
  "Kuwait": ["Kuwait City", "Hawalli", "Ahmadi", "Jahra"],
};

const AsteriskIcon = () => (
  <svg
    className="w-3 h-3"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid meet"
    viewBox="0 0 12 12"
    fill="none"
  >
    <g clipPath="url(#clip0)">
      <path d="M6 1.875V10.125" stroke="#ED4337" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.25 3.75L9.75 8.25" stroke="#ED4337" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.25 8.25L9.75 3.75" stroke="#ED4337" strokeLinecap="round" strokeLinejoin="round" />
    </g>
    <defs>
      <clipPath id="clip0">
        <rect width="12" height="12" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const ChevronDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M16.25 7.5L10 13.75L3.75 7.5" stroke="#78C93D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function CustomSelect({ placeholder, options, value, onChange, compact = false, disabled = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className={`relative ${compact ? "w-fit" : "w-full"}`}>
      <button
        type="button"
        onClick={() => !disabled && setOpen((p) => !p)}
        disabled={disabled}
        className={`flex items-center justify-between border-b border-[#C5C5C5] bg-transparent text-left font-medium pb-2 pt-1 focus:outline-none transition-opacity ${compact ? "pr-7 whitespace-nowrap" : "w-full pr-6"} ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
        style={{ fontSize: "clamp(11px, 1.17vw, 16px)" }}
      >
        <span className={value ? "text-[#4F4F4F]" : "text-[#D1D1D1]"}>
          {value || placeholder}
        </span>
        <span className="ml-2 flex-shrink-0">
          <ChevronDown />
        </span>
      </button>

      {open && !disabled && (
        <ul className="absolute top-full left-0 right-0 z-[1000] mt-2 max-h-[40vh] overflow-y-auto rounded-xl bg-white shadow-[0px_25px_15px_0px_rgba(0,0,0,0.05),0px_11px_11px_0px_rgba(0,0,0,0.09),0px_3px_6px_0px_rgba(0,0,0,0.10)] py-3 px-3 overscroll-contain min-w-max">
          {options.map((opt) => (
            <li
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`cursor-pointer border-b border-[#C5C5C5] py-3 last:border-b-0 font-medium hover:text-[#78C93D] hover:font-bold text-[#262626] flex justify-between items-center gap-3 ${value === opt ? "text-[#78C93D]" : ""}`}
              style={{ fontSize: "clamp(11px, 1.17vw, 16px)" }}
            >
              {opt}
              {value === opt && <span className="text-[#78C93D] font-bold">✓</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const SUBMIT_STATES = {
  idle:    { label: "Submit",       bg: "bg-[#1392f9] hover:bg-[#0d7dd4]" },
  loading: { label: "Sending...",   bg: "bg-[#1392f9] opacity-70 cursor-not-allowed" },
  success: { label: "Sent! ✓",     bg: "bg-[#78C93D] cursor-default" },
  error:   { label: "Failed. Retry", bg: "bg-[#ED4337] hover:bg-[#c73428]" },
};

export default function SellWithUs() {
  const [form, setForm] = useState({
    companyFunction: "",
    mobileNumber:    "",
    email:           "",
    stockCategory:   "",
    costCurrency:    "AED",
    costPrice:       "",
    askCurrency:     "AED",
    askPrice:        "",
    country:         "",
    state:           "",
  });

  const [submitState, setSubmitState] = useState("idle");

  const stateOptions = form.country ? (COUNTRIES_STATES[form.country] || []) : [];

  const set = (key) => (val) =>
    setForm((prev) => {
      const next = { ...prev, [key]: val };
      if (key === "country") next.state = "";
      return next;
    });

  const handleInput = (key) => (e) => {
    let val = e.target.value;
    if (key === "mobileNumber") {
      val = val.replace(/[^0-9+\-() ]/g, "");
    } else if (key === "costPrice" || key === "askPrice") {
      val = val.replace(/[^0-9.]/g, "");
      const parts = val.split(".");
      if (parts.length > 2) {
        val = parts[0] + "." + parts.slice(1).join("");
      }
    }
    set(key)(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitState === "loading" || submitState === "success") return;

    setSubmitState("loading");

    const templateParams = {
      company_function: form.companyFunction || "—",
      mobile_number:    form.mobileNumber    || "—",
      email:            form.email           || "—",
      stock_category:   form.stockCategory   || "—",
      cost_currency:    form.costCurrency,
      cost_price:       form.costPrice       || "—",
      ask_currency:     form.askCurrency,
      ask_price:        form.askPrice        || "—",
      country:          form.country         || "—",
      state:            form.state           || "—",
    };

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      setSubmitState("success");

      setTimeout(() => {
        setForm({
          companyFunction: "",
          mobileNumber:    "",
          email:           "",
          stockCategory:   "",
          costCurrency:    "AED",
          costPrice:       "",
          askCurrency:     "AED",
          askPrice:        "",
          country:         "",
          state:           "",
        });
        setSubmitState("idle");
      }, 3000);

    } catch (err) {
      console.error("EmailJS error:", err);
      setSubmitState("error");
      setTimeout(() => setSubmitState("idle"), 4000);
    }
  };

  const btn = SUBMIT_STATES[submitState];

  return (
    <div className="min-h-screen font-[Montserrat,sans-serif]" style={{ fontFamily: "'Montserrat', sans-serif" }}>

      {/* ── HERO HEADER ── */}
      <section
        className="w-full flex flex-col items-start justify-end gap-4 px-[3vw] pb-8"
        style={{
          height: "50vh",
          background:
            "linear-gradient(0deg, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.80) 100%), url('/Assets/Images/Step-1.webp') lightgray 50% / cover no-repeat",
        }}
      >
        <p className="text-white font-normal" style={{ fontSize: "clamp(12px, 1.2vw, 18px)" }}>
          Fill out the form below, and our team will provide a valuation within 24–48 hours.
        </p>
        <h1 className="text-white font-light leading-[110%]" style={{ fontSize: "clamp(28px, 3.45vw, 64px)" }}>
          Sell With Us
        </h1>
      </section>

      {/* ── FORM ── */}
      <form
        onSubmit={handleSubmit}
        className="relative flex flex-col gap-12 px-[6vw] py-[10vh] bg-white"
      >
        {/* 1. Company function */}
        <div className="relative w-full flex flex-col gap-4">
          <span className="absolute -top-5 left-0"><AsteriskIcon /></span>
          <label className="text-[#4F4F4F] font-medium" style={{ fontSize: "clamp(13px, 1.695vw, 22px)" }}>
            Your company is a?
          </label>
          <input
            type="text"
            value={form.companyFunction}
            onChange={handleInput("companyFunction")}
            placeholder="[Enter your company function]"
            required
            className="w-full border-0 border-b border-[#C5C5C5] bg-transparent text-[#4F4F4F] placeholder-[#D1D1D1] font-medium focus:outline-none pb-2"
            style={{ fontSize: "clamp(11px, 1.17vw, 16px)" }}
          />
        </div>

        {/* 2. Mobile + Email */}
        <div className="flex gap-[5rem] flex-wrap sm:flex-nowrap">
          <div className="relative flex flex-col gap-4 w-full sm:w-1/2">
            <span className="absolute -top-5 left-0"><AsteriskIcon /></span>
            <label className="text-[#4F4F4F] font-medium" style={{ fontSize: "clamp(13px, 1.695vw, 22px)" }}>
              Mobile Number
            </label>
            <input
              type="tel"
              inputMode="tel"
              value={form.mobileNumber}
              onChange={handleInput("mobileNumber")}
              placeholder="[Mobile Number]"
              required
              className="border-0 border-b border-[#C5C5C5] bg-transparent text-[#4F4F4F] placeholder-[#D1D1D1] font-medium focus:outline-none pb-2"
              style={{ fontSize: "clamp(11px, 1.17vw, 16px)" }}
            />
          </div>

          <div className="relative flex flex-col gap-4 w-full sm:w-1/2">
            <span className="absolute -top-5 left-0"><AsteriskIcon /></span>
            <label className="text-[#4F4F4F] font-medium" style={{ fontSize: "clamp(13px, 1.695vw, 22px)" }}>
              Email ID
            </label>
            <input
              type="email"
              value={form.email}
              onChange={handleInput("email")}
              placeholder="[Email ID]"
              required
              className="border-0 border-b border-[#C5C5C5] bg-transparent text-[#4F4F4F] placeholder-[#D1D1D1] font-medium focus:outline-none pb-2"
              style={{ fontSize: "clamp(11px, 1.17vw, 16px)" }}
            />
          </div>
        </div>

        {/* 3. Stock Category */}
        <div className="flex flex-col gap-4 w-full">
          <label className="text-[#4F4F4F] font-medium" style={{ fontSize: "clamp(13px, 1.695vw, 22px)" }}>
            What kind of dead stock do you want?
          </label>
          <CustomSelect
            placeholder="[ Select category of your dead stock ]"
            options={STOCK_CATEGORIES}
            value={form.stockCategory}
            onChange={set("stockCategory")}
          />
        </div>

        {/* 4. Cost + Asking Price */}
        <div className="flex gap-[5rem] flex-wrap sm:flex-nowrap">
          <div className="flex flex-col gap-4 w-full sm:w-1/2">
            <label className="text-[#4F4F4F] font-medium" style={{ fontSize: "clamp(13px, 1.695vw, 22px)" }}>
              Cost Price
            </label>
            <div className="flex items-center">
              <div className="mr-2">
                <CustomSelect
                  placeholder="AED"
                  options={CURRENCIES}
                  value={form.costCurrency}
                  onChange={set("costCurrency")}
                  compact
                />
              </div>
              <input
                type="text"
                inputMode="decimal"
                value={form.costPrice}
                onChange={handleInput("costPrice")}
                className="flex-1 border-0 border-b border-[#C5C5C5] bg-transparent text-[#4F4F4F] placeholder-[#D1D1D1] font-medium focus:outline-none pb-2"
                style={{ fontSize: "clamp(11px, 1.17vw, 16px)" }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 w-full sm:w-1/2">
            <label className="text-[#4F4F4F] font-medium" style={{ fontSize: "clamp(13px, 1.695vw, 22px)" }}>
              Asking Price
            </label>
            <div className="flex items-center">
              <div className="mr-2">
                <CustomSelect
                  placeholder="AED"
                  options={CURRENCIES}
                  value={form.askCurrency}
                  onChange={set("askCurrency")}
                  compact
                />
              </div>
              <input
                type="text"
                inputMode="decimal"
                value={form.askPrice}
                onChange={handleInput("askPrice")}
                className="flex-1 border-0 border-b border-[#C5C5C5] bg-transparent text-[#4F4F4F] placeholder-[#D1D1D1] font-medium focus:outline-none pb-2"
                style={{ fontSize: "clamp(11px, 1.17vw, 16px)" }}
              />
            </div>
          </div>
        </div>

        {/* 5. Country + State */}
        <div className="flex gap-[5rem] flex-wrap sm:flex-nowrap">
          <div className="flex flex-col gap-4 w-full sm:w-1/2">
            <label className="text-[#4F4F4F] font-medium" style={{ fontSize: "clamp(13px, 1.695vw, 22px)" }}>
              Country
            </label>
            <CustomSelect
              placeholder="[ Select Country ]"
              options={Object.keys(COUNTRIES_STATES)}
              value={form.country}
              onChange={set("country")}
            />
          </div>

          <div className="flex flex-col gap-4 w-full sm:w-1/2">
            <label className="text-[#4F4F4F] font-medium" style={{ fontSize: "clamp(13px, 1.695vw, 22px)" }}>
              State
            </label>
            <CustomSelect
              placeholder={form.country ? "[ Select State ]" : "[ Select Country first ]"}
              options={stateOptions}
              value={form.state}
              onChange={set("state")}
              disabled={!form.country}
            />
          </div>
        </div>

        {/* 6. Submit */}
        <div className="w-full text-right bg-white pt-4">
          <button
            type="submit"
            disabled={submitState === "loading" || submitState === "success"}
            className={`text-white font-medium rounded-xl transition-all duration-300 ${btn.bg}`}
            style={{
              padding: "2.5vh 4vw",
              fontSize: "clamp(14px, 1.6vw, 26px)",
            }}
          >
            {btn.label}
          </button>
        </div>

      </form>
    </div>
  );
}