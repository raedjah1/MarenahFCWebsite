import React, { useState } from 'react';
import './StorePage.css';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  category: 'jerseys' | 'accessories' | 'memorabilia' | 'training';
  image: string;
  sizes?: string[];
  colors?: string[];
  description: string;
  featured: boolean;
  stock: number;
  rating: number;
  reviews: number;
}

interface CartItem extends Product {
  selectedSize?: string;
  selectedColor?: string;
  quantity: number;
}

export const StorePage = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'jerseys' | 'accessories' | 'memorabilia' | 'training'>('all');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');

  const products: Product[] = [
    // Jerseys
    {
      id: 1,
      name: "Marenah FC Home Jersey 2024",
      price: 75,
      category: "jerseys",
      image: "/api/placeholder/300/300",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      colors: ["Gold", "Black"],
      description: "Official home jersey featuring our iconic gold and black colors with advanced moisture-wicking technology.",
      featured: true,
      stock: 50,
      rating: 4.8,
      reviews: 124
    },
    {
      id: 2,
      name: "Marenah FC Away Jersey 2024",
      price: 75,
      category: "jerseys",
      image: "/api/placeholder/300/300",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      colors: ["White", "Gold"],
      description: "Sleek away jersey in crisp white with gold accents, perfect for supporting the team anywhere.",
      featured: true,
      stock: 35,
      rating: 4.7,
      reviews: 89
    },
    {
      id: 3,
      name: "Limited Edition Third Jersey",
      price: 95,
      originalPrice: 110,
      category: "jerseys",
      image: "/api/placeholder/300/300",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Black", "Gold"],
      description: "Exclusive third jersey with premium materials and unique design elements celebrating Senegalese culture.",
      featured: true,
      stock: 15,
      rating: 4.9,
      reviews: 67
    },
    // Accessories
    {
      id: 4,
      name: "Marenah FC Scarf",
      price: 25,
      category: "accessories",
      image: "/api/placeholder/300/300",
      colors: ["Gold/Black", "White/Gold"],
      description: "Premium knitted scarf with club colors and embroidered logo. Perfect for matchdays.",
      featured: false,
      stock: 80,
      rating: 4.5,
      reviews: 45
    },
    {
      id: 5,
      name: "Training Cap",
      price: 30,
      category: "accessories",
      image: "/api/placeholder/300/300",
      sizes: ["One Size"],
      colors: ["Black", "Gold", "White"],
      description: "Adjustable cap with moisture-wicking sweatband and embroidered club crest.",
      featured: false,
      stock: 60,
      rating: 4.4,
      reviews: 32
    },
    {
      id: 6,
      name: "Club Backpack",
      price: 55,
      category: "accessories",
      image: "/api/placeholder/300/300",
      colors: ["Black/Gold"],
      description: "Spacious backpack with multiple compartments, perfect for training or everyday use.",
      featured: false,
      stock: 25,
      rating: 4.6,
      reviews: 28
    },
    // Training Gear
    {
      id: 7,
      name: "Training Shorts",
      price: 35,
      category: "training",
      image: "/api/placeholder/300/300",
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Black", "Gold", "White"],
      description: "Lightweight training shorts with mesh panels for optimal ventilation.",
      featured: false,
      stock: 45,
      rating: 4.3,
      reviews: 56
    },
    {
      id: 8,
      name: "Training Jacket",
      price: 85,
      category: "training",
      image: "/api/placeholder/300/300",
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["Black/Gold", "Navy/Gold"],
      description: "Premium training jacket with zip pockets and weather-resistant fabric.",
      featured: true,
      stock: 30,
      rating: 4.7,
      reviews: 41
    },
    // Memorabilia
    {
      id: 9,
      name: "Signed Match Ball",
      price: 150,
      category: "memorabilia",
      image: "/api/placeholder/300/300",
      description: "Official match ball signed by the entire first team squad, comes with certificate of authenticity.",
      featured: true,
      stock: 5,
      rating: 5.0,
      reviews: 12
    },
    {
      id: 10,
      name: "Club Crest Pin Set",
      price: 20,
      category: "memorabilia",
      image: "/api/placeholder/300/300",
      description: "Collectible enamel pin set featuring various club crests and commemorative designs.",
      featured: false,
      stock: 100,
      rating: 4.2,
      reviews: 75
    }
  ];

  const filteredProducts = products
    .filter(product => activeCategory === 'all' || product.category === activeCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'featured':
        default:
          return b.featured ? 1 : -1;
      }
    });

  const addToCart = (product: Product, selectedSize?: string, selectedColor?: string) => {
    const existingItem = cartItems.find(item => 
      item.id === product.id && 
      item.selectedSize === selectedSize && 
      item.selectedColor === selectedColor
    );

    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item === existingItem 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, { 
        ...product, 
        selectedSize, 
        selectedColor, 
        quantity: 1 
      }]);
    }
    setIsCartOpen(true);
  };

  const removeFromCart = (itemIndex: number) => {
    setCartItems(cartItems.filter((_, index) => index !== itemIndex));
  };

  const updateQuantity = (itemIndex: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(itemIndex);
    } else {
      setCartItems(cartItems.map((item, index) =>
        index === itemIndex ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i 
        key={i} 
        className={`fas fa-star ${i < Math.floor(rating) ? 'filled' : ''}`}
      ></i>
    ));
  };

  const renderProduct = (product: Product) => (
    <div key={product.id} className="product-card">
      {product.featured && <div className="featured-badge">FEATURED</div>}
      {product.originalPrice && (
        <div className="sale-badge">
          SAVE ${product.originalPrice - product.price}
        </div>
      )}
      
      <div className="product-image">
        <div className="image-placeholder">
          <i className="fas fa-tshirt"></i>
        </div>
        <div className="product-overlay">
          <button 
            className="quick-view-btn"
            onClick={() => setSelectedProduct(product)}
          >
            <i className="fas fa-eye"></i>
            Quick View
          </button>
        </div>
      </div>
      
      <div className="product-info">
        <h3>{product.name}</h3>
        <div className="product-rating">
          {renderStars(product.rating)}
          <span className="rating-text">({product.reviews})</span>
        </div>
        <div className="product-price">
          <span className="current-price">${product.price}</span>
          {product.originalPrice && (
            <span className="original-price">${product.originalPrice}</span>
          )}
        </div>
        <div className="product-stock">
          {product.stock > 0 ? (
            <span className="in-stock">In Stock ({product.stock})</span>
          ) : (
            <span className="out-of-stock">Out of Stock</span>
          )}
        </div>
      </div>
      
      <div className="product-actions">
        <button 
          className="add-to-cart-btn"
          onClick={() => addToCart(product)}
          disabled={product.stock === 0}
        >
          <i className="fas fa-shopping-cart"></i>
          Add to Cart
        </button>
      </div>
    </div>
  );

  return (
    <div className="store-page">
      {/* Store Navigation and Filters */}
      <div className="store-navigation">
        <div className="store-nav-container">
          <div className="category-filters">
            <button 
              className={`category-btn ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              ALL PRODUCTS
            </button>
            <button 
              className={`category-btn ${activeCategory === 'jerseys' ? 'active' : ''}`}
              onClick={() => setActiveCategory('jerseys')}
            >
              JERSEYS
            </button>
            <button 
              className={`category-btn ${activeCategory === 'accessories' ? 'active' : ''}`}
              onClick={() => setActiveCategory('accessories')}
            >
              ACCESSORIES
            </button>
            <button 
              className={`category-btn ${activeCategory === 'memorabilia' ? 'active' : ''}`}
              onClick={() => setActiveCategory('memorabilia')}
            >
              MEMORABILIA
            </button>
            <button 
              className={`category-btn ${activeCategory === 'training' ? 'active' : ''}`}
              onClick={() => setActiveCategory('training')}
            >
              TRAINING
            </button>
          </div>
          <div className="sort-filter">
            <select 
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {filteredProducts.map(renderProduct)}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="product-modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="product-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedProduct.name}</h3>
              <button 
                className="close-btn"
                onClick={() => setSelectedProduct(null)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-content">
              <div className="modal-product-image">
                <div className="image-placeholder">
                  <i className="fas fa-tshirt"></i>
                </div>
              </div>
              
              <div className="modal-product-info">
                <div className="product-rating">
                  {renderStars(selectedProduct.rating)}
                  <span className="rating-text">({selectedProduct.reviews} reviews)</span>
                </div>
                
                <div className="product-price">
                  <span className="current-price">${selectedProduct.price}</span>
                  {selectedProduct.originalPrice && (
                    <span className="original-price">${selectedProduct.originalPrice}</span>
                  )}
                </div>
                
                <p className="product-description">{selectedProduct.description}</p>
                
                {selectedProduct.sizes && (
                  <div className="size-selector">
                    <label>Size:</label>
                    <div className="size-options">
                      {selectedProduct.sizes.map(size => (
                        <button key={size} className="size-btn">{size}</button>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedProduct.colors && (
                  <div className="color-selector">
                    <label>Color:</label>
                    <div className="color-options">
                      {selectedProduct.colors.map(color => (
                        <button key={color} className="color-btn">{color}</button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="product-stock">
                  {selectedProduct.stock > 0 ? (
                    <span className="in-stock">✓ In Stock ({selectedProduct.stock} available)</span>
                  ) : (
                    <span className="out-of-stock">✗ Out of Stock</span>
                  )}
                </div>
                
                <button 
                  className="add-to-cart-btn large"
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  disabled={selectedProduct.stock === 0}
                >
                  <i className="fas fa-shopping-cart"></i>
                  Add to Cart - ${selectedProduct.price}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="cart-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="cart-sidebar" onClick={(e) => e.stopPropagation()}>
            <div className="cart-header">
              <h3>Shopping Cart ({cartItems.length})</h3>
              <button 
                className="close-btn"
                onClick={() => setIsCartOpen(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="cart-content">
              {cartItems.length === 0 ? (
                <div className="empty-cart">
                  <i className="fas fa-shopping-cart"></i>
                  <p>Your cart is empty</p>
                  <button 
                    className="continue-shopping"
                    onClick={() => setIsCartOpen(false)}
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <>
                  <div className="cart-items">
                    {cartItems.map((item, index) => (
                      <div key={index} className="cart-item">
                        <div className="item-image">
                          <i className="fas fa-tshirt"></i>
                        </div>
                        <div className="item-details">
                          <h4>{item.name}</h4>
                          {item.selectedSize && <p>Size: {item.selectedSize}</p>}
                          {item.selectedColor && <p>Color: {item.selectedColor}</p>}
                          <div className="item-price">${item.price}</div>
                        </div>
                        <div className="item-quantity">
                          <button 
                            onClick={() => updateQuantity(index, item.quantity - 1)}
                          >
                            <i className="fas fa-minus"></i>
                          </button>
                          <span>{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(index, item.quantity + 1)}
                          >
                            <i className="fas fa-plus"></i>
                          </button>
                        </div>
                        <button 
                          className="remove-item"
                          onClick={() => removeFromCart(index)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="cart-footer">
                    <div className="cart-total">
                      <strong>Total: ${getCartTotal().toFixed(2)}</strong>
                    </div>
                    <button className="checkout-btn">
                      <i className="fas fa-credit-card"></i>
                      Proceed to Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 