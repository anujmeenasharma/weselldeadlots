"use client"
import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Landing from "@/components/Pages/Home/Landing"
import TodaysDeals from "@/components/Pages/Home/TodaysDeals"
import ExploreAllLots from "@/components/Pages/Home/ExploreAllLots"
import Category from "@/components/Pages/Home/Category"

gsap.registerPlugin(ScrollTrigger)

const page = () => {
  const contRef = useRef(null)
  const boxRef = useRef(null)

  useGSAP(() => {
    gsap.fromTo(
      boxRef.current,
      {
        y: "-50vh",
        borderRadius: "0px"
      },
      {
        y: "50vh",
        borderRadius: "40px",
        ease: "none",
        scrollTrigger: {
          trigger: contRef.current,
          scrub: true,
        },
      }
    )
  }, [])

  return (
    <div>
      <div 
        className="h-screen w-full relative overflow-hidden"
        ref={contRef}
      >
        <div className="h-full w-full relative" ref={boxRef}>
          <Landing />
        </div>
      </div>
      <TodaysDeals />
      <Category />
      <ExploreAllLots />
    </div>
  )
}

export default page