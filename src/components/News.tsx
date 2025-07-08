import './News.css';

const newsArticles = [
  {
    id: 1,
    title: 'WINNING THE FUTURE: WHAT THE TALENTED LEADERS—YET',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'YOUTH DEVELOPMENT'
  },
  {
    id: 2,
    title: 'Real Madrid leaving FC Copenhagen and Brighton Dream',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'TRANSFERS'
  },
  {
    id: 3,
    title: 'ALEKSANDER DONALDSEN DUFIN FC to FC 1001',
    image: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'MATCH REPORT'
  },
  {
    id: 4,
    title: 'Fc Barcelona official',
    image: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'OFFICIAL NEWS'
  },
  {
    id: 5,
    title: 'MARENAH FC ANNOUNCE 59 YEARS',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'ANNIVERSARY'
  },
  {
    id: 6,
    title: 'YOUTH DEVELOPMENT PROGRAM',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'ACADEMY'
  }
];

export const News = () => {
  return (
    <section className="news-section">
      <div className="container">
        <h2 className="news-title">RTD NEWS</h2>
        <p className="news-subtitle">STAY IN THE KNOW</p>
        
        <div className="news-grid">
          {newsArticles.map((article) => (
            <div key={article.id} className="news-card">
              <div className="news-image" style={{ backgroundImage: `url(${article.image})` }}>
                <div className="news-category">{article.category}</div>
              </div>
              <div className="news-content">
                <h3>{article.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}; 