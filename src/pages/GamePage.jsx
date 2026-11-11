import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GameStatusSelector from '../components/GameStatusSelector';

export default function GamePage({ gamesData }) {
    const { gameId } = useParams();
    const { user, userLibrary, setGameCategory } = useAuth();
    const game = gamesData.find((g) => g.id === gameId);

    if (!game) {
        return <Navigate to="/404" replace />;
    }

    const rawGameDate = game?.releaseDate;
    const gameDateObj = new Date(rawGameDate);
    const formattedGameDate = new Intl.DateTimeFormat('ru-RU', { dateStyle: 'long' }).format(gameDateObj);

    const now = new Date();
    const currentYearDate = now.toISOString().split('T')[0];
    const releaseStatus = currentYearDate >= game.releaseDate;

    const getCover = (fileName) => {
        return new URL(`../assets/covers/${fileName}`, import.meta.url).href;
    };
    return (
        <div className="gamepage-container">
            <img src={getCover(game?.imageUrl)} alt={game?.title} />

            <div className="gameinfo-container">
                <h3 className="game-title">{game?.title}</h3>

                <div>
                    {typeof game?.metacriticScore === 'number' && (
                        <span className="score-element">Рейтинг по Metacritic: ⭐ {game?.metacriticScore}</span>
                    )}
                    <span className="release-status-element">{releaseStatus ? '🟢 Вышла' : '🔴 Не вышла'}</span>
                </div>

                {/* Кнопка добавления в категории библиотеки (только на странице игры) */}
                <GameStatusSelector
                    isAuth={Boolean(user)}
                    currentStatus={userLibrary[game.id] || null}
                    onStatusChange={(newCategory) => setGameCategory(game.id, newCategory)}
                />

                <div className="genres-wrapper">
                    {game?.genres.map((genre, index) => (
                        <span key={index} className="genre-badge">
                            {genre}
                        </span>
                    ))}
                </div>

                <p className="game-description">{game?.description}</p>
                <p className="game-date">Дата выпуска: <span>{formattedGameDate}</span></p>
                <p className="game-developer">Разработчик: <span>{game?.developer}</span></p>
            </div>
        </div>
    );
}
