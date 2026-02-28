"use client";
import React, { useState, useRef } from "react";
import emailjs from '@emailjs/browser';
import FAQ from "@/components/Partials/FAQ";

const page = () => {
    const formRef = useRef();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errors, setErrors] = useState({});

    const sendEmail = (e) => {
        e.preventDefault();
        setErrors({});
        setSuccessMessage("");

        const form = formRef.current;
        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const phone = form.phone.value.trim();
        const subject = form.subject.value.trim();

        let isValid = true;
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!name) {
            newErrors.name = 'Name is required';
            isValid = false;
        }
        if (!email || !emailRegex.test(email)) {
            newErrors.email = 'Valid email is required';
            isValid = false;
        }
        if (!phone || phone.length < 10) {
            newErrors.phone = 'Valid phone number is required';
            isValid = false;
        }
        if (!subject) {
            newErrors.subject = 'Subject is required';
            isValid = false;
        }

        if (isValid) {
            setIsSubmitting(true);

            emailjs.sendForm('service_g9cmvsh', 'template_hi0h0e2', form, '0yTBGAnIk1udmtLLn')
                .then(() => {
                    setSuccessMessage('Message sent successfully!');
                    form.reset();
                    setTimeout(() => setSuccessMessage(""), 5000);
                })
                .catch((error) => {
                    setErrors({ general: 'Error sending message. Please try again later.' });
                    console.error('Email send error:', error);
                })
                .finally(() => {
                    setIsSubmitting(false);
                });
        } else {
            setErrors(newErrors);
        }
    };

    return (
        <>
            <div className="w-full min-h-screen flex flex-col md:flex-row border">
                <div className="w-full md:w-1/2 p-8 md:p-16 lg:p-24 flex flex-col justify-center bg-white">
                    <h1 className="text-5xl md:text-7xl font-light mb-6 text-black tracking-wide">
                        Let's get<br />in touch
                    </h1>

                    <p className="text-gray-600 text-lg mb-12 max-w-md">
                        Great! We're excited to hear from you and let's start something special together. contact us for inquiry
                    </p>

                    <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-sm border border-gray-100 relative bg-gray-100">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14436.337651086552!2d55.4883495!3d25.3184976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5f4007323871%3A0xe53fa045862d85d7!2sSharjah%2C%20United%20Arab%20Emirates!5e0!3m2!1sen!2suk!4v1709123456789!5m2!1sen!2suk"
                            className="absolute inset-0 w-full h-full border-0"
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
                <div className="w-full md:w-1/2 bg-[#1a1a1a] p-8 md:p-16 lg:p-24 flex flex-col justify-center text-white">
                    <h2 className="text-4xl font-normal mb-12 text-white">Say Hello!</h2>

                    {errors.general && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-md text-red-500 text-sm">
                            {errors.general}
                        </div>
                    )}
                    {successMessage && (
                        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-md text-green-500 text-sm">
                            {successMessage}
                        </div>
                    )}

                    <form ref={formRef} onSubmit={sendEmail} className="space-y-10 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="relative flex flex-col gap-2">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="[Your name/company name]"
                                    className={`w-full bg-transparent border-b py-3 text-gray-300 placeholder-gray-500 focus:outline-none transition-colors ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-white'}`}
                                />
                                {errors.name && <small className="text-red-500 text-xs">{errors.name}</small>}
                            </div>
                            <div className="relative flex flex-col gap-2">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="[Email]"
                                    className={`w-full bg-transparent border-b py-3 text-gray-300 placeholder-gray-500 focus:outline-none transition-colors ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-white'}`}
                                />
                                {errors.email && <small className="text-red-500 text-xs">{errors.email}</small>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="relative flex flex-col gap-2">
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="[Phone]"
                                    className={`w-full bg-transparent border-b py-3 text-gray-300 placeholder-gray-500 focus:outline-none transition-colors ${errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-white'}`}
                                />
                                {errors.phone && <small className="text-red-500 text-xs">{errors.phone}</small>}
                            </div>
                            <div className="relative flex flex-col gap-2">
                                <input
                                    type="text"
                                    name="subject"
                                    placeholder="[Subject]"
                                    className={`w-full bg-transparent border-b py-3 text-gray-300 placeholder-gray-500 focus:outline-none transition-colors ${errors.subject ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-white'}`}
                                />
                                {errors.subject && <small className="text-red-500 text-xs">{errors.subject}</small>}
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-primary hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-12 rounded-md transition-all duration-300 shadow-lg text-lg"
                            >
                                {isSubmitting ? 'Sending...' : 'Submit'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <FAQ />
        </>
    )
}

export default page