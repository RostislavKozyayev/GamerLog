import { Link, useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="notfound-container">
            <div className="notfound-code">404</div>
            <h1>Уровень не найден</h1>
            <p>
                Похоже, эта страница осталась в невышедшем DLC или была удалена.
                Вернитесь на главную карту или загляните в каталог игр.
            </p>

            <div className="notfound-actions">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="notfound-back-btn"
                >
                    ← Назад
                </button>
                <Link to="/" className="reset-main-btn">
                    На главную
                </Link>
                <Link to="/catalog" className="notfound-catalog-btn">
                    В каталог
                </Link>
            </div>
        </div>
    );
}
