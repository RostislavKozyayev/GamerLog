import FeaturedGamesSlider from '../components/FeaturedGamesSlider.jsx';
import GamesSlider from "../components/GamesSlider.jsx";

export default function Home({ gamesData }) {

    // Текущие избранные 5 игр для главного слайдера
    const coverFiles = import.meta.glob('../assets/slides/*', { eager: true, import: 'default' });

    const getSlide = (id) => {
        const match = Object.keys(coverFiles).find((path) => path.includes(`/${id}.`));
        return match ? coverFiles[match] : '';
    };

    const currentFeaturedGamesId = [
        'splatoon-raiders',
        'schrodingers-call',
        'mina-the-hollower',
        'phonopolis',
        'forza-horizon-6'
    ];

    const currentFeaturedGamesImgUrls = currentFeaturedGamesId.map(id => getSlide(id));

    const currentFeaturedGames = currentFeaturedGamesId
        .map(gameId => gamesData.find(game => game.id === gameId))
        .filter(Boolean);


    // Дата для фильтра игр в слайдерах
    const now = new Date();
    const currentYearDate = now.toISOString().split('T')[0]; // 2026-10-30
    const lastYearDate = new Date(now.setFullYear(now.getFullYear() - 1)).toISOString().split('T')[0]; // 2025-10-30


    const popularGamesData = gamesData.filter(game => game.releaseDate <= lastYearDate);
    popularGamesData.sort((a, b) => b.metacriticScore - a.metacriticScore);

    const releaseGamesData = gamesData.filter(game => game.releaseDate >= lastYearDate && game.releaseDate <= currentYearDate);
    releaseGamesData.sort((a, b) => b.releaseDate?.localeCompare(a.releaseDate));

    const announcementGamesData = gamesData.filter(game => game.releaseDate >= currentYearDate);
    announcementGamesData.sort((a, b) => a.releaseDate?.localeCompare(b.releaseDate));

    return (
        <div className="homepage-layout">
            <FeaturedGamesSlider gamesData={currentFeaturedGames} gameSlideUrl={currentFeaturedGamesImgUrls} />

            <GamesSlider title={"Популярные игры"} gamesData={popularGamesData} />
            <GamesSlider title={"Новинки"} gamesData={releaseGamesData} />
            <GamesSlider title={"Анонсы игр"} gamesData={announcementGamesData} />
        </div>
    );
}