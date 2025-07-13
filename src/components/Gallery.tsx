import './Gallery.css';
import galleryImage1 from '../assets/images/Gallery_image.JPG';
import galleryImage2 from '../assets/images/Gallery_image_2JPG.JPG';
import galleryImage3 from '../assets/images/Gallery_image_4.JPG';
import galleryImage4 from '../assets/images/Galley_image_6.JPG';
import galleryImage7 from '../assets/images/Gallery_image_7.JPG';
import teamImage from '../assets/images/team.JPG';

const galleryImages = [
  {
    id: 1,
    image: galleryImage1
  },
  {
    id: 2,
    image: galleryImage2
  },
  {
    id: 3,
    image: galleryImage3
  },
  {
    id: 4,
    image: galleryImage4
  },
  {
    id: 5,
    image: galleryImage7
  },
  {
    id: 6,
    image: teamImage
  }
];

export const Gallery = () => {
  return (
    <section className="gallery-section">
      <div className="container">
        <div className="gallery-grid">
          {galleryImages.map((item) => (
            <div key={item.id} className="gallery-item">
              <div className="gallery-image-container">
                <img src={item.image} alt="Marenah FC Gallery" className="gallery-img" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}; 