import React, { useState } from 'react';
import './StorePage.css';
import whiteShirtBack from '../assets/images/whiteshirt.png';
import whiteShirtFront from '../assets/images/whiteshirtfront.png';
import blackShirtBack from '../assets/images/blackshirt.png';
import blackShirtFront from '../assets/images/blackshirtfront.png';
import yellowShirtBack from '../assets/images/yellowshirt.png';
import yellowShirtFront from '../assets/images/yellowshirtfront.png';
import blueShirtFront from '../assets/images/blueshirtfront.png';
import blueShorts from '../assets/images/blueshorts.png';

interface StoreItem {
  id: number;
  name: string;
  price: number;
  description: string;
  images: string[];
  sizes: string[];
  category: 'jersey' | 'shorts';
}

export const StorePage = () => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);

  const storeItems: StoreItem[] = [
    {
      id: 1,
      name: "Marenah FC Home Jersey 2024",
      price: 59.99,
      description: "Official Marenah FC home jersey for the 2024 season. Features breathable fabric and club crest.",
      images: [whiteShirtFront, whiteShirtBack],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      category: 'jersey'
    },
    {
      id: 2,
      name: "Marenah FC Away Jersey 2024",
      price: 59.99,
      description: "Official Marenah FC away jersey for the 2024 season. Sleek black design with premium materials.",
      images: [blackShirtFront, blackShirtBack],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      category: 'jersey'
    },
    {
      id: 3,
      name: "Marenah FC Third Jersey 2024",
      price: 59.99,
      description: "Official Marenah FC third kit for the 2024 season. Bold yellow design celebrating our heritage.",
      images: [yellowShirtFront, yellowShirtBack],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      category: 'jersey'
    },
    {
      id: 4,
      name: "Marenah FC Training Jersey",
      price: 49.99,
      description: "Official training jersey in vibrant blue. Perfect for practice sessions and casual wear.",
      images: [blueShirtFront],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      category: 'jersey'
    },
    {
      id: 5,
      name: "Marenah FC Match Shorts",
      price: 29.99,
      description: "Official Marenah FC match shorts. Lightweight and comfortable design.",
      images: [blueShorts],
      sizes: ['S', 'M', 'L', 'XL'],
      category: 'shorts'
    }
  ];

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  const handleItemClick = (item: StoreItem) => {
    setSelectedItem(item);
  };

  return (
    <div className="store-page">
      <div className="store-header">
        <h1>OFFICIAL STORE</h1>
        <p>Get your official Marenah FC merchandise</p>
      </div>

      <div className="store-content">
        <div className="store-grid">
          {storeItems.map((item) => (
            <div 
              key={item.id} 
              className="store-item"
              onClick={() => handleItemClick(item)}
            >
              <div className="item-images">
                {item.images.map((image, index) => (
                  <img 
                    key={index}
                    src={image} 
                    alt={`${item.name} view ${index + 1}`}
                    className="item-image"
                  />
                ))}
              </div>
              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="item-price">${item.price}</p>
                <div className="size-selector">
                  {item.sizes.map((size) => (
                    <button
                      key={size}
                      className={`size-button ${selectedSize === size ? 'selected' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSizeSelect(size);
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <button className="add-to-cart-btn">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="item-modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="item-modal" onClick={(e) => e.stopPropagation()}>
            <button 
              className="close-modal-btn"
              onClick={() => setSelectedItem(null)}
            >
              ×
            </button>
            <div className="modal-content">
              <div className="modal-images">
                {selectedItem.images.map((image, index) => (
                  <img 
                    key={index}
                    src={image} 
                    alt={`${selectedItem.name} view ${index + 1}`}
                    className="modal-image"
                  />
                ))}
              </div>
              <div className="modal-details">
                <h2>{selectedItem.name}</h2>
                <p className="modal-price">${selectedItem.price}</p>
                <p className="modal-description">{selectedItem.description}</p>
                <div className="modal-sizes">
                  <h4>Select Size:</h4>
                  <div className="size-buttons">
                    {selectedItem.sizes.map((size) => (
                      <button
                        key={size}
                        className={`size-button ${selectedSize === size ? 'selected' : ''}`}
                        onClick={() => handleSizeSelect(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <button className="add-to-cart-btn large">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 