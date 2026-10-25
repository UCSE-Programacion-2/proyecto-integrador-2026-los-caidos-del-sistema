import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__brand">
          <h3>
            BALBI <span>HOME</span>
          </h3>
          <p>¡El hogar de tus sueños!</p>
        </div>

        <div className="footer__info">
          <h4>Información</h4>
          <ul>
            <li>📍 Belgrano 970, S.S. de Jujuy</li>
            <li>🕐 Lun a Sáb de 9 a 21hs</li>
          </ul>
        </div>

        <div className="footer__social">
          <h4>Seguinos</h4>
          <ul>
            <li>
              <a
                href="https://www.instagram.com/balbihome_jujuy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://www.facebook.com/share/18gMqwsBkf/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <p>© 2026 Balbi Home. Todos los derechos reservados.</p>
        <Link to="/" className="footer__inicio">
          Volver al inicio
        </Link>
      </div>
    </footer>
  );
}

export default Footer;