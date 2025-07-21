import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductPage.css';
import { storeService, Product, ProductSize, formatPrice } from '../firebase';
import { LoadingSpinner } from '../components/LoadingSpinner';

interface InquiryForm {
  name: string;
  email: string;
}

export const ProductPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryForm, setInquiryForm] = useState<InquiryForm>({
    name: '',
    email: ''
  });

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError('Product ID not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Simplified query to avoid composite index requirements
        const result = await storeService.getProducts({
          // Remove all complex filtering to avoid index requirements
        });
        
        if (result.success && result.data) {
          // Filter active products and find the specific one we need
          const activeProducts = result.data.data.filter(p => p.isActive);
          const foundProduct = activeProducts.find(p => p.id === productId);
          
          if (foundProduct) {
            setProduct(foundProduct);
          } else {
            setError('Product not found');
          }
        } else {
          setError(result.error || 'Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const getAvailableSizes = (): ProductSize[] => {
    if (!product) return [];
    return Object.entries(product.sizes)
      .filter(([_, stock]) => stock > 0)
      .map(([size, _]) => size as ProductSize);
  };

  const handleOpenInquiryModal = () => {
    if (!selectedSize) {
      alert('Please select a size first');
      return;
    }
    
    setInquiryForm({
      name: '',
      email: ''
    });
    setShowInquiryModal(true);
  };

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inquiryForm.name.trim() || !inquiryForm.email.trim()) {
      alert('Please fill in all fields');
      return;
    }
    
    if (!inquiryForm.email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }
    
    if (!product) return;
    
    // Compose detailed email for product page inquiry
    const subject = `Product Inquiry - ${product.name}`;
    const body = `Hello Marenah FC,

I am interested in the following product and would like to make an inquiry:

=== PRODUCT DETAILS ===
Product Name: ${product.name}
Price: ${formatPrice(product.price, product.currency)}
Selected Size: ${selectedSize}
Category: ${product.category || 'Merchandise'}
Description: ${product.description}

=== CUSTOMER INFORMATION ===
Name: ${inquiryForm.name}
Email: ${inquiryForm.email}
Inquiry Date: ${new Date().toLocaleDateString()}

=== INQUIRY ===
Please provide more information about:
- Product availability in the selected size
- Shipping options and costs
- Payment methods accepted
- Estimated delivery time
- Any additional product details

I am ready to proceed with the order once I receive the details.

Thank you for your time and assistance!

Best regards,
${inquiryForm.name}`;

    // Create Gmail compose URL with pre-filled data
    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent('raedjah18@gmail.com')}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open Gmail compose in new tab
    window.open(gmailComposeUrl, '_blank');
    
    // Close modal
    setShowInquiryModal(false);
  };

  const handleBackToStore = () => {
    navigate('/store');
  };

  if (loading) {
    return (
      <div className="product-page loading">
        <div className="loading-container">
          <LoadingSpinner />
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-page error">
        <div className="error-container">
          <i className="fas fa-exclamation-triangle"></i>
          <h2>Product Not Found</h2>
          <p>{error || 'The requested product could not be found.'}</p>
          <button className="back-to-store-btn" onClick={handleBackToStore}>
            <i className="fas fa-arrow-left"></i>
            Back to Store
          </button>
        </div>
      </div>
    );
  }

  const availableSizes = getAvailableSizes();
  const images = product.imageURLs || [];

  return (
    <div className="product-page">
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb">
        <button onClick={handleBackToStore} className="breadcrumb-link">
          <i className="fas fa-arrow-left"></i>
          Store
        </button>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{product.name}</span>
      </div>

      <div className="product-container">
        {/* Product Images */}
        <div className="product-images">
          <div className="main-image-container">
            {images.length > 0 ? (
              <img 
                src={images[selectedImageIndex]} 
                alt={product.name}
                className="main-image"
              />
            ) : (
              <div className="no-main-image">
                <i className="fas fa-image"></i>
                <span>No Image Available</span>
              </div>
            )}
            
            {product.isFeatured && (
              <div className="featured-badge">
                <i className="fas fa-star"></i>
                <span>Featured</span>
              </div>
            )}
          </div>

          {/* Image Thumbnails */}
          {images.length > 1 && (
            <div className="image-thumbnails">
              {images.map((image, index) => (
                <button
                  key={index}
                  className={`thumbnail ${selectedImageIndex === index ? 'active' : ''}`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img src={image} alt={`${product.name} view ${index + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="product-details">
          <div className="product-header">
            <h1 className="product-title">{product.name}</h1>
            <div className="product-price">{formatPrice(product.price, product.currency)}</div>
          </div>

          <div className="product-description">
            <p>{product.description}</p>
          </div>

          {/* Size Selection */}
          <div className="size-selection">
            <h3>Select Size</h3>
            <div className="size-grid">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  <span className="size-label">{size}</span>
                  <span className="stock-info">{product.sizes[size]} in stock</span>
                </button>
              ))}
            </div>
            {availableSizes.length === 0 && (
              <p className="out-of-stock">This product is currently out of stock.</p>
            )}
          </div>

          {/* Product Actions */}
          <div className="product-actions">
            <button 
              className={`add-to-cart-btn primary ${!selectedSize || availableSizes.length === 0 ? 'disabled' : ''}`}
              onClick={handleOpenInquiryModal}
              disabled={!selectedSize || availableSizes.length === 0}
            >
              <i className="fas fa-envelope"></i>
              <span>Send Inquiry</span>
            </button>
            
            <button className="wishlist-btn">
              <i className="fas fa-heart"></i>
              <span>Add to Wishlist</span>
            </button>
          </div>

          {/* Product Info */}
          <div className="product-info">
            <div className="info-item">
              <strong>Category:</strong>
              <span>{product.category || 'Merchandise'}</span>
            </div>
            {product.tags && product.tags.length > 0 && (
              <div className="info-item">
                <strong>Tags:</strong>
                <div className="product-tags">
                  {product.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      {showInquiryModal && (
        <div className="inquiry-modal-overlay" onClick={() => setShowInquiryModal(false)}>
          <div className="inquiry-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Send Product Inquiry</h2>
              <button 
                className="close-modal-btn"
                onClick={() => setShowInquiryModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <p className="modal-description">
                Please provide your contact information to send an inquiry about this product.
              </p>
              
              <form onSubmit={handleSubmitInquiry} className="inquiry-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    value={inquiryForm.name}
                    onChange={(e) => setInquiryForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    value={inquiryForm.email}
                    onChange={(e) => setInquiryForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email address"
                    required
                  />
                </div>
                
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => setShowInquiryModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="submit-inquiry-btn">
                    <i className="fas fa-envelope"></i>
                    Send Inquiry
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 