import { Link } from 'react-router-dom';
import logo from '../assets/icons/gamerlog-logo.svg';

export default function Footer() {
    return (
        <footer>
            <section className="about-section">
                <img src={logo} alt="Логотип компании" className="logo-img" width="140" height="60" />
                <p>
                    Твой ультимативный проводник в мир игр.
                    Огромная библиотека и удобный просмотр на любом устройстве.
                </p>
            </section>

            <section className="nav-section">
                <h2>Навигация</h2>
                <Link to="/" className="nav-link">Главная</Link>
                <Link to="/catalog" className="nav-link">Каталог</Link>
                <Link to="/library" className="nav-link">Моя библиотека</Link>
                <Link to="/profile" className="nav-link">Личный кабинет</Link>
            </section>

            <section className="popular-genres-section">
                <h2>Популярные жанры</h2>
                <Link to="/catalog?genre=Action" className="nav-link" onClick={() => window.scrollTo(0, 0)}>
                    Action
                </Link>
                <Link to="/catalog?genre=Adventure" className="nav-link" onClick={() => window.scrollTo(0, 0)}>
                    Adventure
                </Link>
                <Link to="/catalog?genre=RPG" className="nav-link" onClick={() => window.scrollTo(0, 0)}>
                    RPG
                </Link>
            </section>

            <section className="support-section">
                <h2>Поддержка</h2>
                <div>
                    <p>По всем вопросам</p>
                    <a>rossttiislav@gmail.com</a>
                </div>

                <div>
                    <p>Наш Telegram-канал</p>
                    <a>@gamerlog</a>
                </div>

                <div>
                    <p>Приложение для Android</p>
                    <a>Google Play</a>
                </div>

            </section>

            <section className="copyright-section">
                <hr />
                <p>&copy; 2026 GamerLog. Все права защищены.</p>
            </section>
        </footer>
    )
}