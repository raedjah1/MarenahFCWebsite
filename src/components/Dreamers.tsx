import { Link } from 'react-router-dom';
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
  return (
    <section className="players-section">
      <div className="container">
        <h2 className="players-title">OUR PLAYERS</h2>
        <p className="players-subtitle">CAPTURING THE MOMENTS</p>
        
        <div className="players-carousel-container">
          <div className="players-carousel">
            {actionImages.map((item) => (
              <div key={item.id} className="action-card">
                <div className="action-image-container">
                  <img src={item.image} alt="Player in action" className="action-img" />
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