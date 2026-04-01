"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import ProductCard from './ProductCard';
import { useState, useEffect } from 'react';
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ProductCarousel = ({ products }) => {
    const [swiperRef, setSwiperRef] = useState(null);
    const [inventoryMap, setInventoryMap] = useState({});

    useEffect(() => {
        if (!products || products.length === 0) return;
        const variantIds = products
            .map(e => e.node?.variants?.edges?.[0]?.node?.id?.split('/').pop())
            .filter(Boolean);
        if (variantIds.length === 0) return;
        fetch('/api/inventory/batch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ variantIds }),
        })
            .then(r => r.json())
            .then(data => setInventoryMap(data.quantities || {}))
            .catch(() => {});
    }, [products]);

    if (!products || products.length === 0) {
        return <div className="text-center w-full py-10">Loading products...</div>;
    }

    return (
        <div className="w-full relative md:px-10 group">
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
                slidesPerView={1}
                centeredSlides={false}
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
                {products.map((edge) => {
                    const variantId = edge.node?.variants?.edges?.[0]?.node?.id?.split('/').pop();
                    const qty = variantId ? inventoryMap[variantId] : undefined;
                    return (
                        <SwiperSlide key={edge.node.id} className="flex justify-center pb-10 px-2">
                            <ProductCard product={edge.node} exactQuantity={qty ?? null} />
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </div>
    );
};

export default ProductCarousel;