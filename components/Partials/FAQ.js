"use client";
import { useState, useRef } from "react";
import { Plus, Minus } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const faqs = [
    {
        question: "What types of products do you offer?",
        answer: "We specialize in a wide range of dead lots, surplus, and overstock products, including electrical materials, electronic components, industrial hardware, and power tools.\nOur products are sourced from trusted international suppliers and are available for wholesale and bulk buyers."
    },
    {
        question: "Where are you located?",
        answer: "Our company is based in Sharjah, United Arab Emirates (UAE), and we supply products across the UAE."
    },
    {
        question: "Do you offer bulk discounts for large orders?",
        answer: "Yes, we offer special pricing for bulk and wholesale orders.\nFor inquiries, please contact us via WhatsApp at +971 55 274 8974 or email us at sales@weselldeadlots.com."
    },
    {
        question: "Are your products original and certified?",
        answer: "Yes. We supply genuine, high-quality products. Many of our electrical and hardware items meet recognized international quality standards, depending on the product category and supplier."
    },
    {
        question: "Do you deliver outside of the UAE?",
        answer: "Yes, we offer international shipping.\nShipping charges and delivery timelines vary by destination. Please contact us for a custom shipping quote."
    },
    {
        question: "How long does delivery take within the UAE?",
        answer: "For in-stock items, delivery within the UAE typically takes 1–3 business days.\nBulk or special orders may take slightly longer, depending on availability."
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept multiple secure payment methods, including:\n• Bank Transfers\n• Cash on Delivery (within UAE, for select orders)\n• Credit/Debit Cards\n• Other secure payment options (details provided upon invoice)"
    },
    {
        question: "Can I return or exchange a product?",
        answer: "Yes, we follow a Returns & Refunds Policy:\n• Products must be returned within 10 days of delivery\n• Items must be unused and in original packaging\n• Certain custom orders and specialized electrical components may be non-returnable\nPlease refer to our full Returns Policy for complete details."
    },
    {
        question: "How can I contact you for urgent inquiries?",
        answer: "For urgent inquiries, you can contact us via:\n• WhatsApp: +971 55 274 8974\n• Email: sales@weselldeadlots.com\n• Visit our office in Sharjah, UAE"
    },
    {
        question: "Do you offer warranty on your products?",
        answer: "Some products may include a manufacturer’s warranty, depending on the product and supplier.\nWarranty terms vary by category, so we recommend confirming details with our sales team at the time of order."
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
                <p className="text-gray-500 leading-relaxed text-sm whitespace-pre-line">
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
        <div className="w-full mt-12 pb-4 px-6 md:px-12 lg:px-20">
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
