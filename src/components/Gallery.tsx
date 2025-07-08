import './Gallery.css';

const galleryImages = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: 'MARENAH FC',
    subtitle: 'TEAM TRAINING'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: 'YOUTH DEVELOPMENT',
    subtitle: 'PROFESSIONAL CLUBS'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: 'MATCH DAY',
    subtitle: 'TEAM PREPARATION'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: 'GRASSROOTS ACADEMY IN AFRICA',
    subtitle: 'FOOTBALL DEVELOPMENT'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: 'FOOTBALL COACHING',
    subtitle: 'YOUTH DEVELOPMENT'
  }
];

export const Gallery = () => {
  return (
    <section className="gallery-section">
      <div className="container">
        <div className="gallery-grid">
          {galleryImages.map((item) => (
            <div key={item.id} className="gallery-item">
              <div className="gallery-image" style={{ backgroundImage: `url(${item.image})` }}>
                <div className="gallery-overlay">
                  <h3>{item.title}</h3>
                  <p>{item.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}; 