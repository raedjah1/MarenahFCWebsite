import { useState, useEffect } from 'react';
import './StorePage.css';
import { storeService, Product, ProductSize, formatPrice } from '../firebase';

export const StorePage = () => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);
  const [storeItems, setStoreItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStoreItems = async () => {
      try {
        setLoading(true);
        const result = await storeService.getProducts({
          isActive: true,
          orderBy: 'isFeatured',
          orderDirection: 'desc'
        });
        
        if (result.success && result.data) {
          setStoreItems(result.data.data);
        } else {
          setError(result.error || 'Failed to fetch store items');
        }
      } catch (err) {
        console.error('Error fetching store items:', err);
        setError('An unexpected error occurred while fetching store items');
      } finally {
        setLoading(false);
      }
    };

    fetchStoreItems();
  }, []);

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  const handleItemClick = (item: Product) => {
    setSelectedItem(item);
  };

  const getAvailableSizes = (product: Product): ProductSize[] => {
    return Object.entries(product.sizes)
      .filter(([_, stock]) => stock > 0)
      .map(([size, _]) => size as ProductSize);
  };

  return (
    <div className="store-page">
      <div className="store-header">
        <h1>OFFICIAL STORE</h1>
        <p>Get your official Marenah FC merchandise</p>
      </div>

      <div className="store-content">
        {loading ? (
          <div className="loading-container">
            <p>Loading store items...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>Error: {error}</p>
          </div>
        ) : storeItems.length === 0 ? (
          <div className="empty-container">
            <p>No products available at the moment.</p>
          </div>
        ) : (
          <div className="store-grid">
            {storeItems.map((item) => (
              <div 
                key={item.id} 
                className="store-item"
                onClick={() => handleItemClick(item)}
              >
                <div className="item-images">
                  {item.imageURLs && item.imageURLs.length > 0 ? (
                    <img 
                      src={item.imageURLs[0]} 
                      alt={item.name}
                      className="item-image"
                    />
                  ) : (
                    <div className="no-image">No Image Available</div>
                  )}
                </div>
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-price">{formatPrice(item.price, item.currency)}</p>
                  <div className="size-selector">
                    {getAvailableSizes(item).map((size) => (
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
                  <button 
                    className="add-to-cart-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add to cart functionality would go here
                      console.log('Add to cart:', item.id, selectedSize);
                    }}
                    disabled={!selectedSize}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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
                {selectedItem.imageURLs && selectedItem.imageURLs.map((image, index) => (
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
                <p className="modal-price">{formatPrice(selectedItem.price, selectedItem.currency)}</p>
                <p className="modal-description">{selectedItem.description}</p>
                <div className="modal-sizes">
                  <h4>Select Size:</h4>
                  <div className="size-buttons">
                    {getAvailableSizes(selectedItem).map((size) => (
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
                <button 
                  className="add-to-cart-btn large"
                  onClick={() => {
                    // Add to cart functionality would go here
                    console.log('Add to cart from modal:', selectedItem.id, selectedSize);
                  }}
                  disabled={!selectedSize}
                >
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