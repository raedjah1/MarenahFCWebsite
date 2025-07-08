import './Dreamers.css';

const players = [
  {
    id: 1,
    name: 'MOHAMMED',
    surname: 'KUDUS',
    image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    position: 'Midfielder'
  },
  {
    id: 2,
    name: 'KATHRINE',
    surname: 'KUHN',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    position: 'Forward'
  },
  {
    id: 3,
    name: 'MIKKEL',
    surname: 'DAMSGAARD',
    image: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    position: 'Winger'
  },
  {
    id: 4,
    name: 'LOUISA',
    surname: 'ESSUMAN',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    position: 'Defender'
  }
];

export const Dreamers = () => {
  return (
    <section className="dreamers-section">
      <div className="container">
        <h2 className="dreamers-title">OUR DREAMERS</h2>
        <p className="dreamers-subtitle">GET INSPIRED BY OUR STORY</p>
        
        <div className="dreamers-grid">
          {players.map((player) => (
            <div key={player.id} className="dreamer-card">
              <div className="dreamer-image" style={{ backgroundImage: `url(${player.image})` }}>
                <div className="dreamer-overlay">
                  <h3>{player.name}</h3>
                  <h4>{player.surname}</h4>
                  <p>{player.position}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}; 