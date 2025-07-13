import '../styles/legal.css';

export const TermsOfService = () => {
  return (
      <main className="legal-page">
        <div className="container">
          <div className="legal-header">
            <h1>Terms and Conditions</h1>
            <p className="legal-updated">Last updated: March 2024</p>
          </div>
          
          <div className="legal-content">
            <section className="legal-section">
            <h2>Agreement to Terms</h2>
              <p>
              By accessing and using our website and services, you agree to be bound by these Terms and Conditions.
              </p>
            </section>

            <section className="legal-section">
            <h2>Use of Services</h2>
            <p>
              Our services are provided "as is" and "as available." You agree to use them at your own risk and responsibility.
            </p>
            </section>

            <section className="legal-section">
            <h2>User Accounts</h2>
            <p>
              When creating an account, you must provide accurate and complete information. You are responsible for maintaining the security of your account.
            </p>
            </section>

            <section className="legal-section">
            <h2>Intellectual Property</h2>
            <p>
              All content on this website, including text, graphics, logos, and images, is the property of Marenah FC and is protected by applicable copyright laws.
            </p>
            </section>

            <section className="legal-section">
            <h2>Limitation of Liability</h2>
            <p>
              Marenah FC shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use our services.
            </p>
            </section>

            <section className="legal-section">
            <h2>Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through our website.
            </p>
            </section>

            <section className="legal-section">
            <h2>Contact Information</h2>
            <p>
              For questions about these Terms, please contact us at:
            </p>
            <p>
              Email: legal@marenahfc.com<br />
              Phone: +44 123 456 789
            </p>
            </section>
          </div>
        </div>
      </main>
  );
};

export default TermsOfService; 