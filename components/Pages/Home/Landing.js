import Image from "next/image"
import Link from "next/link"

const Landing = () => {
    return (
        <div className="h-screen w-full relative overflow-hidden">
            <video className="h-full w-full absolute object-cover" src="/videos/home.mp4" autoPlay loop muted playsInline></video>
            <div className="h-screen w-full absolute bg-black/60"></div>

            {/* Hero Content */}
            <div className="w-full absolute text-white px-6 md:px-12 lg:px-22 top-[25vh] md:top-[30vh] space-y-6 md:space-y-10">
                <h1 className="text-4xl md:text-6xl lg:text-8xl w-full md:w-[80%] lg:w-[60%] leading-tight">
                    Unbeatable Prices on Quality Surplus Inventory
                </h1>
                <p className="w-full md:w-[70%] lg:w-[45%] text-base md:text-lg opacity-90">
                    We Sell Dead Lots is your trusted wholesale supplier in UAE for quality overstock, surplus, and discontinued products. From electronics to household and industrial supplies, we offer unbeatable prices on branded stock. Discover bulk deals, save more, and shop confidently with reliable dead stock suppliers in UAE.
                </p>
            </div>

            {/* Bottom Bar Info */}
            <div className="w-full absolute flex flex-col md:flex-row items-center justify-between text-white px-6 md:px-12 lg:px-22 bottom-10 left-0 gap-4 md:gap-0">
                <p className="w-full md:w-[30%] text-center md:text-left text-sm md:text-base">
                    We specialize in giving unsold inventory a second life
                </p>
                <p className="w-full md:w-[40%] flex justify-center text-sm md:text-base font-semibold tracking-wider">
                    UNBEATABLE PRICING
                </p>
                <div className="w-full md:w-[30%] flex justify-center md:justify-end">
                    <span className="h-[1px] rounded-full bg-white w-[50%] md:w-[70%] inline-block"></span>
                </div>
            </div>

            {/* Explore Button */}
            <Link href="#categories" className="absolute top-1/2 right-4 md:right-12 lg:right-24 -translate-y-1/2 hidden md:block hover:scale-105 transition-transform duration-300">
                <Image
                    className="w-24 h-24 md:w-48 md:h-48 lg:w-[300px] lg:h-[300px]"
                    src="/icons/explore.svg"
                    height={300}
                    width={300}
                    alt="Explore"
                />
            </Link>
        </div>
    )
}

export default Landing