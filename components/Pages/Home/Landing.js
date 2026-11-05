import Image from "next/image"
import Link from "@/components/AppLink";
import { fileUrl, imageAlt, imageUrl } from "@/sanity/lib/image";
import { safeHref } from "@/sanity/lib/links";

// Hero content comes from the Sanity "Hero" section.
const Landing = ({ section = {} }) => {
    const videoSrc = safeHref(fileUrl(section.backgroundVideo) || section.backgroundVideoUrl);
    const backgroundSrc = imageUrl(section.backgroundImage, { width: 1920 });
    const exploreSrc = imageUrl(section.exploreImage, { width: 400 });
    const exploreHref = safeHref(section.exploreLink);

    return (
        <div className="h-screen w-full relative overflow-hidden">
            {videoSrc ? (
                <video className="h-full w-full absolute object-cover scale-180 md:scale-100" src={videoSrc} poster={backgroundSrc || undefined} autoPlay loop muted playsInline></video>
            ) : backgroundSrc ? (
                <Image className="object-cover" src={backgroundSrc} alt={imageAlt(section.backgroundImage)} fill priority sizes="100vw" />
            ) : null}
            <div className="h-screen w-full absolute bg-black/60"></div>

            {/* Hero Content */}
            <div className="w-full absolute text-white px-6 md:px-[5vw] lg:px-[5vw] top-[25vh] md:top-[30vh] space-y-6 md:space-y-[3vw]">
                {section.heading && (
                    <h1 className="text-4xl md:text-[6vw] lg:text-[4.5vw] w-full md:w-[80vw] lg:w-[60vw] leading-tight">
                        {section.heading}
                    </h1>
                )}
                {section.description && (
                    <p className="w-full md:w-[70vw] lg:w-[45vw] text-base md:text-[1.8vw] lg:text-[1.2vw] opacity-90">
                        {section.description}
                    </p>
                )}
            </div>

            {/* Bottom Bar Info */}
            <div className="w-full absolute flex flex-col md:flex-row items-center justify-between text-white px-6 md:px-[5vw] lg:px-[5vw] bottom-10 start-0 gap-4 md:gap-0">
                <p className="w-full md:w-[30vw] text-center md:text-left text-sm md:text-[1.4vw] lg:text-[1vw]">
                    {section.bottomLeftText}
                </p>
                <p className="w-full md:w-[40vw] flex justify-center text-sm md:text-[1.6vw] lg:text-[1.1vw] font-semibold tracking-wider">
                    {section.badgeText}
                </p>
                <div className="w-full md:w-[30vw] flex justify-center md:justify-end">
                    {section.showDivider !== false && (
                        <span className="h-[1px] rounded-full bg-white w-[50%] md:w-[15vw] inline-block"></span>
                    )}
                </div>
            </div>

            {/* Explore Button */}
            {exploreSrc && exploreHref && (
                <Link href={exploreHref} className="absolute top-1/2 end-4 md:end-[5vw] lg:end-[5vw] -translate-y-1/2 hidden md:block hover:scale-105 transition-transform duration-300">
                    <Image
                        className="w-24 h-24 md:w-[16vw] md:h-[16vw] lg:w-[12vw] lg:h-[12vw]"
                        src={exploreSrc}
                        height={300}
                        width={300}
                        alt={imageAlt(section.exploreImage, "Explore")}
                    />
                </Link>
            )}
        </div>
    )
}

export default Landing
