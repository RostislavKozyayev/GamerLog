import FeaturedGamesSlider from '../components/FeaturedGamesSlider.jsx';
import GamesSlider from "../components/GamesSlider.jsx";

export default function Home({ gamesData }) {

    // Текущие избранные 5 игр для главного слайдера
    const currentFeaturedGamesImgUrls = [
        "https://www.cgmagonline.com/wp-content/uploads/2026/06/splatoon-raiders-hands-on-preview-chaotic-gameplay-a-fresh-location-and-friendly-3534.jpg",
        "https://images.squarespace-cdn.com/content/v1/55ef0e29e4b099e22cdc9eea/e9179722-5e0f-4844-91a2-50b01aac14bd/Schr%C3%B6dinger%27s+Call.jpg",
        "https://static0.hardcoregamerimages.com/wordpress/wp-content/uploads/2026/05/mina-hollower-feature.jpg",
        "https://images.stopgame.ru/news/2026/04/29/jjXK8I45.jpg",
        "https://cdn.3dnews.ru/assets/external/illustrations/2026/04/08/1139665/2.jpg"
    ];

    const currentFeaturedGamesId = [
        'splatoon-raiders',
        'schrodingers-call',
        'mina-the-hollower',
        'phonopolis',
        'forza-horizon-6'
    ];
    const currentFeaturedGames = [];

    for (const gameId of currentFeaturedGamesId) {
        currentFeaturedGames.push(gamesData.find(game => game.id === gameId));
    }


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