"use client";
import { useState, useRef } from "react";
import { Plus, Minus } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const faqs = [
    {
        question: "What types of products do you offer?",
        answer: "We offer a wide variety of surplus inventory, liquidation pallets, and dead lots across multiple categories including electronics, clothing, and home goods."
    },
    {
        question: "Where are you located?",
        answer: "We are located in Sharjah, United Arab Emirates. You can visit our warehouse to view lots in person by appointment."
    },
    {
        question: "Do you offer bulk discounts for large orders?",
        answer: "Yes, we offer competitive pricing on bulk orders. Please contact our sales team for detailed quotes on large volume purchases."
    },
    {
        question: "Are your products original and certified?",
        answer: "Yes, we guarantee the authenticity of our products. All stock is sourced from reputable retailers and manufacturers."
    }
];

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
                <p className="text-gray-500 leading-relaxed text-sm">
                    {faq.answer}
                </p>
            </div>
        </div>
    );
};

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="w-full mt-12 pb-4 px-20">
            <h3 className="text-2xl font-semibold mb-6">FAQs</h3>
            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <FAQItem
                        key={index}
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
