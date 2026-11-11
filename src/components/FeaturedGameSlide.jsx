import { Link } from 'react-router-dom';

export default function FeaturedGameSlide({ game, gameSlideUrl }) {
    return (
        <article className="slide-inner">
            <Link to={`/games/${game.id}`}>
                <img src={gameSlideUrl} alt={game?.title} width={1520} />
                <div className="shadow-overlay"></div>

                <div className="slide-content">
                    {typeof game?.metacriticScore === "number" && (
                        <span className="score-element">Рейтинг по Metacritic: ⭐ {game?.metacriticScore}</span>
                    )}

                    <h3 className="game-title">{game?.title}</h3>

                    <p className="game-description">{game?.description}</p>

                    <div className="genres-wrapper">
                        {game?.genres.map((genre, index) => (
                            <span key={index} className="genre-badge">
                                {genre}
                            </span>
                        ))}
                    </div>

                    <span className="game-credits">{game?.releaseDate.slice(0, 4)} &middot; {game?.developer}</span>
                </div>
            </Link>

        </article>
    )
}