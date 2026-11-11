import { Link } from 'react-router-dom';

export default function GameCard({ game }) {

    const getCover = (fileName) => {
        return new URL(`../assets/covers/${fileName}`, import.meta.url).href;
    };
    return (
        <article className="card user-select-none">
            <Link to={`/games/${game.id}`}>
                <div className="image-container">
                    <img src={getCover(game?.imageUrl)} alt={game?.title} width="70" />
                    <div className="shadow-overlay"></div>

                    {typeof game?.metacriticScore === "number" && (
                        <span className="score-element">⭐ {game?.metacriticScore}</span>
                    )}
                </div>

                <div className="card-content">
                    <h3 className="game-title truncated-text">{game?.title}</h3>

                    <div className="genres-wrapper">
                        {game?.genres.map((genre, index) => (
                            <span key={index} className="genre-badge">
                                {genre}
                            </span>
                        ))}
                    </div>

                    <span className="game-credits truncated-text">{game?.releaseDate.slice(0, 4)} &middot; {game?.developer}</span>
                </div>
            </Link>

        </article>
    )
}