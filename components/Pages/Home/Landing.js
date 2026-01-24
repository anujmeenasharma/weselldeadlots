import Image from "next/image"
import Link from "next/link"

const Landing = () => {
  return (
    <div className="h-screen w-full relative">
        <video className="h-full w-full absolute object-cover" src="/videos/home.mp4" autoPlay loop muted></video>
        <div className="h-screen w-full absolute bg-black/60"></div>
        <div className="w-full absolute text-white px-22 top-[30vh] space-y-10">
            <h1 className="text-8xl w-[50%]">Unbeatable Prices on Quality Surplus Inventory</h1>
            <p className="w-[45%] text-lg">We Sell Dead Lots is your trusted wholesale supplier in UAE for quality overstock, surplus, and discontinued products. From electronics to household and industrial supplies, we offer unbeatable prices on branded stock. Discover bulk deals, save more, and shop confidently with reliable dead stock suppliers in UAE.</p>
        </div>
        <div className="w-full absolute flex items-center justify-between text-white px-22 bottom-10 left-0">
            <p className="w-[30%]">We specialize in giving unsold inventory a second life</p>
            <p className="w-[40%] flex justify-center">UNBEATABLE PRICING</p>
            <div className="w-[30%] flex justify-end">
                <span className="h-[1px] rounded-full bg-white w-[70%] inline-block"></span>
            </div>
        </div>
        <Link href="#">
            <Image className="absolute top-1/2 right-24 -translate-y-1/2" src="/icons/explore.svg" height={300} width={300} alt="image" />
        </Link>
    </div>
  )
}

export default Landing