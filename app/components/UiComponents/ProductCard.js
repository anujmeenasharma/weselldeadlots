import Image from "next/image"
import Link from "next/link"
import { FaWhatsapp } from "react-icons/fa";


const ProductCard = () => {
  return (
    <div className="h-fit w-[20vw] drop-shadow-xl bg-white rounded-2xl overflow-hidden p-4">
      <div className="h-[25vh] w-full rounded-xl overflow-hidden">
        <Image src="/images/testimage.webp" height={500} width={500} alt="product image" className="h-full w-full object-cover" />
      </div>
      <div className="space-y-3 pt-5 pb-3">
        <h1 className="font-semibold">Rolife ROBOTIME Orpheus Steam Punk Music Box Kit</h1>
        <div className="flex flex-wrap gap-2">
            {["hello", "no", "anymore", "collegue", "hemesphere"].map((item, index)=>(
                <span key={index} className="px-4 py-1 bg-blue-100 text-blue-400 text-xs rounded-full">{item}</span>
            ))}
        </div>
        <div className="flex justify-between items-center">
            <p className="text-sm font-medium">Dhs. <span className="text-lg font-bold">10.0</span> AED</p>
            <Link href="#" className="bg-primary text-white px-4 py-2 font-medium text-sm rounded-lg flex items-center gap-2 w-fit"><FaWhatsapp /> Whatsapp us</Link>
        </div>
        </div>
    </div>
  )
}

export default ProductCard