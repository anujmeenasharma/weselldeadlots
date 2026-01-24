"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import ProductCard from './ProductCard';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ProductCarousel = ({ products }) => {
    if (!products || products.length === 0) {
        return <div className="text-center w-full py-10">Loading products...</div>;
    }

    return (
        <div className="w-full relative px-4 sm:px-10">
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={20}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                breakpoints={{
                    640: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                    },
                    768: {
                        slidesPerView: 3,
                        spaceBetween: 30,
                    },
                    1024: {
                        slidesPerView: 4,
                        spaceBetween: 40,
                    },
                }}
                className="w-full py-10 px-2"
            >
                {products.map((edge) => (
                    <SwiperSlide key={edge.node.id} className="flex justify-center pb-10">
                        <ProductCard product={edge.node} />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom Styles for Swiper Navigation if needed, or rely on default */}
            <style jsx global>{`
        .swiper-button-next, .swiper-button-prev {
            color: #000;
            background: white;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }
        .swiper-button-next:after, .swiper-button-prev:after {
            font-size: 18px;
            font-weight: bold;
        }
        .swiper-pagination-bullet-active {
            background-color: #000;
        }
      `}</style>
        </div>
    );
};

export default ProductCarousel;