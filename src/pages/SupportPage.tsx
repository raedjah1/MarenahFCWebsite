import React, { useState } from 'react';
import '../styles/SupportPage.css';

export const SupportPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState<{
    submitted: boolean;
    success?: boolean;
    message?: string;
  }>({ submitted: false });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setFormStatus({ submitted: true, success: true, message: 'Thank you for your message. We\'ll get back to you shortly!' });
    
    // Reset form after successful submission
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    }, 100);
  };

  return (
    <div className="support-page">
      <div className="support-header">
        <div className="support-header-content">
          <h1>How Can We Help You?</h1>
          <p>Our support team is here to assist with any questions or issues you might have.</p>
        </div>
      </div>

      <div className="support-container">
        <div className="support-grid">
          {/* Contact Information */}
          <div className="support-info-card">
            <div className="card-content">
              <h2>Contact Information</h2>
              <p>Reach out to us through any of these channels:</p>
              
              <div className="contact-methods">
                <div className="contact-method">
                  <div className="icon-container">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="contact-details">
                    <h3>Email Us</h3>
                    <p>admin@pov-reality.com</p>
                    <p>We usually respond within 24 hours</p>
                  </div>
                </div>
                
                <div className="contact-method">
                  <div className="icon-container">
                    <i className="fas fa-phone-alt"></i>
                  </div>
                  <div className="contact-details">
                    <h3>Call Us</h3>
                    <p>+44 7704 659886</p>
                    <p>Mon-Fri, 9am-5pm GMT</p>
                  </div>
                </div>
                
                <div className="contact-method">
                  <div className="icon-container">
                    <i className="fas fa-comment-alt"></i>
                  </div>
                  <div className="contact-details">
                    <h3>Live Chat</h3>
                    <p>Available on our website</p>
                    <p>24/7 for premium members</p>
                  </div>
                </div>
                
                <div className="contact-method">
                  <div className="icon-container">
                    <i className="fab fa-discord"></i>
                  </div>
                  <div className="contact-details">
                    <h3>Discord Community</h3>
                    <p>Join our community server</p>
                    <p>Connect with our team and other users</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="support-form-card">
            <div className="card-content">
              <h2>Send Us a Message</h2>
              <p>Fill out the form below and we'll get back to you as soon as possible.</p>
              
              {formStatus.submitted && formStatus.success ? (
                <div className="form-success-message">
                  <i className="fas fa-check-circle"></i>
                  <p>{formStatus.message}</p>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a topic</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Billing Question">Billing Question</option>
                      <option value="Feature Request">Feature Request</option>
                      <option value="Partnership">Partnership</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="message">Your Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      rows={5}
                      required
                    ></textarea>
                  </div>
                  
                  <button type="submit" className="submit-button">
                    <span>Send Message</span>
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          
          <div className="faq-grid">
            <div className="faq-item">
              <h3>How do I reset my password?</h3>
              <p>You can reset your password by clicking on the "Forgot Password" link on the login page. You'll receive an email with instructions to create a new password.</p>
            </div>
            
            <div className="faq-item">
              <h3>What devices are compatible with POV-Reality?</h3>
              <p>POV-Reality works with most modern VR headsets, including Meta Quest, Valve Index, HTC Vive, and PlayStation VR. For the best experience, we recommend using a PC-based VR system.</p>
            </div>
            
            <div className="faq-item">
              <h3>How can I cancel my subscription?</h3>
              <p>You can cancel your subscription anytime from your account settings. Navigate to the "Billing" section and click on "Cancel Subscription". Your access will remain active until the end of your current billing period.</p>
            </div>
            
            <div className="faq-item">
              <h3>Do you offer refunds?</h3>
              <p>Yes, we offer a 14-day refund policy for all new subscriptions. If you're not satisfied with our service, please contact our support team within 14 days of your purchase.</p>
            </div>
            
            <div className="faq-item">
              <h3>How do I join virtual events?</h3>
              <p>Virtual events can be accessed through the "Events" tab in your dashboard. Simply click on the event you want to join and follow the instructions. Make sure your VR equipment is set up and ready before the event starts.</p>
            </div>
            
            <div className="faq-item">
              <h3>Can I use POV-Reality without a VR headset?</h3>
              <p>While POV-Reality is designed for VR, we do offer a desktop mode for some features. However, for the full immersive experience, a VR headset is recommended.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 