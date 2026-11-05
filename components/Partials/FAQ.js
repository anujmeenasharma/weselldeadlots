"use client";
import { useState, useRef } from "react";
import { Plus, Minus } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import JsonLd from "@/components/sanity/JsonLd";

const FAQItem = ({ faq, isOpen, toggle }) => {
    const contentRef = useRef(null);

    useGSAP(() => {
        if (isOpen) {
            gsap.to(contentRef.current, {
                height: "auto",
                opacity: 1,
                marginTop: 8,
                duration: 0.5,
                ease: "back.inOut",
            });
        } else {
            gsap.to(contentRef.current, {
                height: 0,
                opacity: 0,
                marginTop: 0,
                duration: 0.5,
                ease: "back.inOut",
            });
        }
    }, [isOpen]);

    return (
        <div className="border-b border-gray-700 pb-4 cursor-pointer">
            <button
                className="w-full flex justify-between items-center cursor-pointer text-left py-2 focus:outline-none"
                onClick={toggle}
            >
                <span className="text-lg font-medium text-black">{faq.question}</span>
                {isOpen ? (
                    <Minus className="text-gray-400" size={20} />
                ) : (
                    <Plus className="text-gray-400" size={20} />
                )}
            </button>
            <div
                ref={contentRef}
                className="overflow-hidden h-0 opacity-0"
            >
                <p className="text-gray-500 leading-relaxed text-sm whitespace-pre-line">
                    {faq.answer}
                </p>
            </div>
        </div>
    );
};

// Questions, answers and heading come from the Sanity "FAQ" section.
const FAQ = ({ section }) => {
    const [openIndex, setOpenIndex] = useState(null);
    const faqs = (section?.items || []).filter((f) => f && !f.hidden && f.question);

    if (!section || section.hidden || faqs.length === 0) return null;

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    return (
        <div className="w-full mt-12 pb-4 px-6 md:px-12 lg:px-20">
            {section.enableSchema !== false && <JsonLd data={jsonLd} />}
            {section.heading && <h3 className="text-2xl font-semibold mb-6">{section.heading}</h3>}
            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <FAQItem
                        key={faq._key || index}
                        faq={faq}
                        isOpen={openIndex === index}
                        toggle={() => toggleFAQ(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default FAQ;
