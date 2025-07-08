import '../styles/legal.css';

export const PrivacyPolicy = () => {
  return (
    <main className="legal-page">
      <div className="container">
        <div className="legal-header">
          <h1>Privacy Policy</h1>
          <p className="legal-updated">Last updated: March 2024</p>
        </div>
        
        <div className="legal-content">
          <section className="legal-section">
            <h2>Introduction</h2>
            <p>
              This Privacy Policy describes how Marenah FC ("we", "us", or "our") collects, uses, and shares your personal information when you use our website and services.
            </p>
          </section>

          <section className="legal-section">
            <h2>Information We Collect</h2>
            <p>
              We collect information that you provide directly to us, including:
            </p>
            <ul>
              <li>Name and contact information</li>
              <li>Account credentials</li>
              <li>Payment information</li>
              <li>Communications with us</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>How We Use Your Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul>
              <li>Provide and maintain our services</li>
              <li>Process your transactions</li>
              <li>Send you updates and marketing communications</li>
              <li>Improve our services</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>Information Sharing</h2>
            <p>
              We do not sell your personal information. We may share your information with:
            </p>
            <ul>
              <li>Service providers who assist in our operations</li>
              <li>Professional advisors</li>
              <li>Law enforcement when required by law</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>Your Rights</h2>
            <p>
              You have the right to:
            </p>
            <ul>
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt-out of marketing communications</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p>
              Email: privacy@marenahfc.com<br />
              Phone: +44 123 456 789
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicy; 