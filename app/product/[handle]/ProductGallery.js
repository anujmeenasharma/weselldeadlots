
"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductGallery({ images, title }) {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    if (!images || images.length === 0) return null;

    return (
        <div className="product-gallery space-y-4">
            {/* Main Slider */}
            <div className="relative group rounded-3xl overflow-hidden bg-gray-100 border border-gray-200 aspect-square">
                <Swiper
                    spaceBetween={10}
                    navigation={{
                        nextEl: '.swiper-button-next-custom',
                        prevEl: '.swiper-button-prev-custom',
                    }}
                    thumbs={{ swiper: thumbsSwiper }}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className="h-full w-full"
                >
                    {images.map((img, idx) => (
                        <SwiperSlide key={idx} className="relative h-full w-full flex items-center justify-center bg-white">
                            <Image
                                src={img.url}
                                alt={img.altText || `${title} - Image ${idx + 1}`}
                                fill
                                className="object-contain p-4"
                                priority={idx === 0}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Custom Navigation Buttons */}
                <button className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0">
                    <ChevronLeft className="w-6 h-6 text-black" />
                </button>
                <button className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0">
                    <ChevronRight className="w-6 h-6 text-black" />
                </button>
            </div>

            {/* Thumbs Slider */}
            {images.length > 1 && (
                <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={10}
                    slidesPerView={4}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className="thumbs-swiper h-24 sm:h-32"
                >
                    {images.map((img, idx) => (
                        <SwiperSlide key={idx} className="cursor-pointer rounded-xl overflow-hidden border-2 border-transparent transition-colors hover:border-black/10 [&.swiper-slide-thumb-active]:border-black bg-gray-50">
                            <div className="relative w-full h-full">
                                <Image
                                    src={img.url}
                                    alt={`Thumbnail ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </div>
    );
}
