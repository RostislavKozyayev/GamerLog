import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import FeaturedGameSlide from './FeaturedGameSlide';

export default function FeaturedGamesSlider({ gamesData, gameSlideUrl }) {

    // Кнопки < и > для слайдера
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    return (
        <section>
            <div className="featured-games-slider-wrapper">

                <Swiper
                    modules={[Navigation, Autoplay, Pagination]}
                    spaceBetween={0}
                    slidesPerView={1}
                    speed={400}
                    loop={true}
                    watchSlidesProgress={true}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false
                    }}
                    pagination={{
                        el: ".featured-games-slider-progressbar",
                        clickable: true,
                        bulletClass: "custom-bullet",
                        bulletActiveClass: "custom-bullet-active"
                    }}
                    navigation={{
                        prevEl: prevRef.current,
                        nextEl: nextRef.current,
                    }}
                    onBeforeInit={(swiper) => {
                        swiper.params.navigation.prevEl = prevRef.current;
                        swiper.params.navigation.nextEl = nextRef.current;
                    }}
                    className="featured-games-slider"
                >
                    <button ref={prevRef} className="slider-btn prev-btn user-select-none">&lt;</button>
                    <button ref={nextRef} className="slider-btn next-btn user-select-none">&gt;</button>

                    {gamesData.map((game, index) => (
                        <SwiperSlide key={game.id} style={{ width: 'auto' }}>
                            <FeaturedGameSlide game={game} gameSlideUrl={gameSlideUrl[index]} />
                        </SwiperSlide>
                    ))}
                </Swiper >
            </div>

            <div className="featured-games-slider-progressbar"></div>
        </section>
    )
}