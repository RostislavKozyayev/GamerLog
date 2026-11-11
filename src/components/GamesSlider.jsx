import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import GameCard from './GameCard';

export default function GamesSlider({ title, gamesData }) {

    // Кнопки < и > для слайдера
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    return (
        <section className="games-slider-wrapper">

            <div className="group-container">
                <h1>{title}</h1>

                <button ref={prevRef} className="slider-btn prev-btn user-select-none">&lt;</button>
                <button ref={nextRef} className="slider-btn next-btn user-select-none">&gt;</button>
            </div>

            <Swiper
                modules={[Navigation]}
                spaceBetween={20}
                slidesPerView="auto"
                slidesPerGroupAuto={true}
                watchSlidesProgress={true}
                speed={400}
                navigation={{
                    prevEl: prevRef.current,
                    nextEl: nextRef.current,
                }}
                onBeforeInit={(swiper) => {
                    swiper.params.navigation.prevEl = prevRef.current;
                    swiper.params.navigation.nextEl = nextRef.current;
                }}
                className="games-slider-track"
            >
                {gamesData.map((game) => (
                    <SwiperSlide key={game.id} style={{ width: 'auto' }}>
                        <GameCard game={game} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    )
}