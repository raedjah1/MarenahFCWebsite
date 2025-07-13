import './News.css';

const upcomingMatches = [
  {
    id: 1,
    title: 'MARENAH FC vs REAL MADRID',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'CHAMPIONS LEAGUE'
  },
  {
    id: 2,
    title: 'MARENAH FC vs FC BARCELONA',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'FRIENDLY'
  },
  {
    id: 3,
    title: 'MARENAH FC vs MANCHESTER UNITED',
    image: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'CHAMPIONS LEAGUE'
  },
  {
    id: 4,
    title: 'MARENAH FC vs LIVERPOOL',
    image: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'FRIENDLY'
  },
  {
    id: 5,
    title: 'MARENAH FC vs BAYERN MUNICH',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'CHAMPIONS LEAGUE'
  },
  {
    id: 6,
    title: 'MARENAH FC vs PSG',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'FRIENDLY'
  }
];

export const News = () => {
  return (
    <section className="news-section">
      <div className="container">
        <h2 className="news-title">UPCOMING MATCHES</h2>
        <p className="news-subtitle">MARK YOUR CALENDAR</p>
        
        <div className="news-grid">
          {upcomingMatches.map((match) => (
            <div key={match.id} className="news-card">
              <div className="news-image" style={{ backgroundImage: `url(${match.image})` }}>
                <div className="news-category">{match.category}</div>
              </div>
              <div className="news-content">
                <h3>{match.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}; 