import { Link } from 'react-router-dom';
import './Dreamers.css';

const players = [
  // Goalkeeper
  {
    id: 1,
    name: 'ALIOUNE',
    surname: 'DIENG',
    image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    position: 'Goalkeeper',
    number: 1
  },
  // Defenders
  {
    id: 2,
    name: 'MAMADOU',
    surname: 'FALL',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    position: 'Centre-Back',
    number: 4
  },
  {
    id: 3,
    name: 'IBRAHIMA',
    surname: 'SARR',
    image: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    position: 'Right-Back',
    number: 2
  },
  {
    id: 4,
    name: 'SEYDOU',
    surname: 'KANE',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    position: 'Left-Back',
    number: 3
  },
  {
    id: 5,
    name: 'YOUSSOU',
    surname: 'NDOUR',
    image: 'https://images.unsplash.com/photo-1566577134316-0b9040ca6ee2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    position: 'Centre-Back',
    number: 5
  },
  // Midfielders  
  {
    id: 6,
    name: 'LAMINE',
    surname: 'GUEYE',
    image: 'https://images.unsplash.com/photo-1609347318972-09c5d1bac725?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    position: 'Central Midfielder',
    number: 8
  },
  {
    id: 7,
    name: 'CHEIKH',
    surname: 'BA',
    image: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    position: 'Attacking Midfielder',
    number: 10
  },
  {
    id: 8,
    name: 'MOUSTAPHA',
    surname: 'DIALLO',
    image: 'https://images.unsplash.com/photo-1615840287214-7ff58936c4cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    position: 'Defensive Midfielder',
    number: 6
  },
  {
    id: 9,
    name: 'OUSMANE',
    surname: 'NDIAYE',
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    position: 'Right Midfielder',
    number: 7
  },
  // Forwards
  {
    id: 10,
    name: 'MOUSSA',
    surname: 'DIOUF',
    image: 'https://images.unsplash.com/photo-1605570258112-6ba5e62e8ee7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    position: 'Striker',
    number: 9
  },
  {
    id: 11,
    name: 'MALICK',
    surname: 'FAYE',
    image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    position: 'Left Winger',
    number: 11
  }
];

export const Dreamers = () => {
  return (
    <section className="players-section">
      <div className="container">
        <h2 className="players-title">OUR PLAYERS</h2>
        <p className="players-subtitle">MEET THE MARENAH FC SQUAD</p>
        
        <div className="players-carousel-container">
          <div className="players-carousel">
            {players.map((player) => (
              <div key={player.id} className="player-card">
                <div className="player-image" style={{ backgroundImage: `url(${player.image})` }}>
                  <div className="player-number">{player.number}</div>
                  <div className="player-overlay">
                    <h3>{player.name}</h3>
                    <h4>{player.surname}</h4>
                    <p>{player.position}</p>
                  </div>
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