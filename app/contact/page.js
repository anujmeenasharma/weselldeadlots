import FAQ from "@/components/Partials/FAQ";

const page = () => {
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

                <form className="space-y-10 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="[Your name/company name]"
                                className="w-full bg-transparent border-b border-gray-600 py-3 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
                            />
                        </div>
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="[Email]"
                                className="w-full bg-transparent border-b border-gray-600 py-3 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="relative">
                            <input
                                type="tel"
                                placeholder="[Phone]"
                                className="w-full bg-transparent border-b border-gray-600 py-3 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
                            />
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="[Subject]"
                                className="w-full bg-transparent border-b border-gray-600 py-3 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
                            />
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            className="bg-primary hover:bg-blue-600 text-white font-medium py-3 px-12 rounded-md transition-all duration-300 shadow-lg text-lg"
                        >
                            Submit
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