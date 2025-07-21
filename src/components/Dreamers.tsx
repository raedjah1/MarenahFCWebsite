
import { useTranslation } from 'react-i18next';
import './Dreamers.css';
import actionImage1 from '../assets/images/action_image_4.JPG';
import actionImage2 from '../assets/images/action_image_2.JPG';
import actionImage3 from '../assets/images/action_image3.JPG';
import actionImage4 from '../assets/images/action_image_3.JPG';

const actionImages = [
  {
    id: 1,
    image: actionImage1
  },
  {
    id: 2,
    image: actionImage2
  },
  {
    id: 3,
    image: actionImage3
  },
  {
    id: 4,
    image: actionImage4
  }
];

export const Dreamers = () => {
  const { t } = useTranslation();
  
  return (
    <section className="players-section">
      <div className="container">
        <h2 className="players-title">{t('players.title')}</h2>
        <p className="players-subtitle">{t('players.subtitle')}</p>
        
        <div className="players-carousel-container">
          <div className="players-carousel">
            {actionImages.map((item) => (
              <div key={item.id} className="action-card">
                <div className="action-image-container">
                  <img src={item.image} alt={t('players.alt_text')} className="action-img" />
                </div>
              </div>
            ))}
          </div>
          
          {/* Navigation arrows */}
          <button className="carousel-nav prev" onClick={(e) => {
            const carousel = e.currentTarget.parentElement?.querySelector('.players-carousel') as HTMLElement;
            if (carousel) {
              carousel.scrollBy({ left: -300, behavior: 'smooth' });
            }
          }}>
            <i className="fas fa-chevron-left"></i>
          </button>
          
          <button className="carousel-nav next" onClick={(e) => {
            const carousel = e.currentTarget.parentElement?.querySelector('.players-carousel') as HTMLElement;
            if (carousel) {
              carousel.scrollBy({ left: 300, behavior: 'smooth' });
            }
          }}>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </section>
  );
}; 