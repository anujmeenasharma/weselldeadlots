"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import ProductCard from './ProductCard';
import { useState } from 'react';
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ProductCarousel = ({ products }) => {
    const [swiperRef, setSwiperRef] = useState(null);

    if (!products || products.length === 0) {
        return <div className="text-center w-full py-10">Loading products...</div>;
    }

    return (
        <div className="w-full relative sm:px-10 group">
            <button
                onClick={() => swiperRef?.slidePrev()}
                className="hidden md:block absolute -left-10 top-1/2 -translate-y-1/2 z-10 p-2 cursor-pointer hover:scale-110 transition-transform text-gray-800"
                aria-label="Previous slide"
            >
                <BsArrowLeft className="w-8 h-8 md:w-10 md:h-10" />
            </button>

            <button
                onClick={() => swiperRef?.slideNext()}
                className="hidden md:block absolute -right-10 top-1/2 -translate-y-1/2 z-10 p-2 cursor-pointer hover:scale-110 transition-transform text-gray-800"
                aria-label="Next slide"
            >
                <BsArrowRight className="w-8 h-8 md:w-10 md:h-10" />
            </button>

            <Swiper
                onSwiper={setSwiperRef}
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={15}
                slidesPerView={1.2}
                centeredSlides={true}
                loop={true}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                breakpoints={{
                    640: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                        centeredSlides: false,
                    },
                    768: {
                        slidesPerView: 3,
                        spaceBetween: 30,
                        centeredSlides: false,
                    },
                    1024: {
                        slidesPerView: 4.1,
                        spaceBetween: 40,
                        centeredSlides: false,
                    },
                }}
                className="w-full py-10 px-2"
            >
                {products.map((edge) => (
                    <SwiperSlide key={edge.node.id} className="flex justify-center pb-10 px-2">
                        <ProductCard product={edge.node} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default ProductCarousel;