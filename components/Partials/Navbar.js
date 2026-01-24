import Image from "next/image"
import Link from "next/link"
import { CiSearch } from "react-icons/ci";

const Navbar = () => {
  return (
    <div className="h-[8vh] w-[90%] fixed top-5 left-1/2 -translate-x-1/2 flex items-center justify-between px-10 rounded-full drop-shadow-sm bg-white z-50">
      <Link href="/" className="brandLogo">
        <Image src="/brand.png" height={80} width={80} alt="brand logo" />
      </Link>
      <div className="flex gap-10 items-center">
        {[
          { name: "Categories", href: "/categories" },
          { name: "Blogs", href: "/blogs" },
          { name: "Contact us", href: "/contact" }
        ].map((item, index) => (
          <Link className="text-lg" key={index} href={item.href} >{item.name}</Link>
        ))}
        <Link href="https://hashim8803-wbds.odoo.com/get-a-free-valuation-dead-lots" className="bg-primary text-white px-6 py-2 rounded-full">Sell with us</Link>
      </div>
      <div>
        <span className="text-2xl"><CiSearch /></span>
      </div>
    </div>
  )
}

export default Navbar