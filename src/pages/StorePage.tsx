import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './StorePage.css';
import { storeService, Product, ProductSize, formatPrice } from '../firebase';

interface InquiryForm {
  name: string;
  email: string;
  productId: string;
  selectedSize: string;
}

export const StorePage = () => {
  const navigate = useNavigate();
  const [selectedSizes, setSelectedSizes] = useState<{[key: string]: string}>({});
  const [storeItems, setStoreItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryForm, setInquiryForm] = useState<InquiryForm>({
    name: '',
    email: '',
    productId: '',
    selectedSize: ''
  });

  useEffect(() => {
    const fetchStoreItems = async () => {
      try {
        setLoading(true);
        // Simplified query to avoid composite index requirements
        const result = await storeService.getProducts({
          // Remove complex filtering to avoid index requirements for now
        });
        
        if (result.success && result.data) {
          // Filter and sort on client side temporarily
          const activeItems = result.data.data
            .filter(item => item.isActive)
            .sort((a, b) => {
              // Sort featured items first, then by name
              if (a.isFeatured && !b.isFeatured) return -1;
              if (!a.isFeatured && b.isFeatured) return 1;
              return a.name.localeCompare(b.name);
            });
          
          setStoreItems(activeItems);
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

  const handleSizeSelect = (productId: string, size: string) => {
    setSelectedSizes(prev => ({
      ...prev,
      [productId]: size
    }));
  };

  const handleViewProduct = (productId: string) => {
    navigate(`/store/product/${productId}`);
  };

  const getAvailableSizes = (product: Product): ProductSize[] => {
    return Object.entries(product.sizes)
      .filter(([_, stock]) => stock > 0)
      .map(([size, _]) => size as ProductSize);
  };

  const handleOpenInquiryModal = (productId: string, selectedSize: string) => {
    if (!selectedSize) {
      alert('Please select a size first');
      return;
    }
    
    setInquiryForm({
      name: '',
      email: '',
      productId,
      selectedSize
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
    
    const product = storeItems.find(item => item.id === inquiryForm.productId);
    if (!product) return;
    
    // Compose email details
    const subject = `Product Inquiry - ${product.name}`;
    const body = `Hello Marenah FC,

I am interested in the following product and would like to make an inquiry:

=== PRODUCT DETAILS ===
Product Name: ${product.name}
Price: ${formatPrice(product.price, product.currency)}
Selected Size: ${inquiryForm.selectedSize}
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

  const handleQuickInquiry = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    const selectedSize = selectedSizes[productId];
    
    if (!selectedSize) {
      handleViewProduct(productId);
      return;
    }
    
    handleOpenInquiryModal(productId, selectedSize);
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
            <div className="loading-spinner"></div>
            <p>Loading store items...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <i className="fas fa-exclamation-triangle"></i>
            <p>Error: {error}</p>
          </div>
        ) : storeItems.length === 0 ? (
          <div className="empty-container">
            <i className="fas fa-shopping-bag"></i>
            <p>No products available at the moment.</p>
            <p>Check back soon for new merchandise!</p>
          </div>
        ) : (
          <div className="store-grid">
            {storeItems.map((item) => {
              const productSelectedSize = selectedSizes[item.id] || '';
              const availableSizes = getAvailableSizes(item);
              
              return (
                <div 
                  key={item.id} 
                  className="store-item"
                  onClick={() => handleViewProduct(item.id)}
                >
                  <div className="item-image-container">
                    {item.imageURLs && item.imageURLs.length > 0 ? (
                      <>
                        <img 
                          src={item.imageURLs[0]} 
                          alt={item.name}
                          className="item-image"
                        />
                        <div className="image-overlay">
                          <i className="fas fa-search-plus"></i>
                          <span>View Product</span>
                        </div>
                      </>
                    ) : (
                      <div className="no-image">
                        <i className="fas fa-image"></i>
                        <span>No Image Available</span>
                      </div>
                    )}
                    {item.isFeatured && (
                      <div className="featured-badge">
                        <i className="fas fa-star"></i>
                        <span>Featured</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="item-details">
                    <div className="item-header">
                      <h3>{item.name}</h3>
                      <p className="item-price">{formatPrice(item.price, item.currency)}</p>
                    </div>
                    
                    <div className="item-description">
                      <p>{item.description}</p>
                    </div>
                    
                    <div className="size-selector">
                      <h4>Quick Select:</h4>
                      <div className="size-options">
                        {availableSizes.slice(0, 4).map((size) => (
                          <button
                            key={size}
                            className={`size-button ${productSelectedSize === size ? 'selected' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSizeSelect(item.id, size);
                            }}
                          >
                            {size}
                          </button>
                        ))}
                        {availableSizes.length > 4 && (
                          <button 
                            className="size-button more-sizes"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewProduct(item.id);
                            }}
                          >
                            +{availableSizes.length - 4}
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="item-actions">
                      <button 
                        className="view-product-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewProduct(item.id);
                        }}
                      >
                        <i className="fas fa-eye"></i>
                        <span>View Details</span>
                      </button>
                      
                      <button 
                        className={`add-to-cart-btn ${!productSelectedSize ? 'quick-view' : ''}`}
                        onClick={(e) => handleQuickInquiry(e, item.id)}
                      >
                        <i className={`fas ${!productSelectedSize ? 'fa-search-plus' : 'fa-envelope'}`}></i>
                        <span>{!productSelectedSize ? 'Select Size' : 'Send Inquiry'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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