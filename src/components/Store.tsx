import { useState, useEffect, useRef } from 'react';

interface SubscriptionTier {
  name: string;
  credits: number;
  price: number;
  isCurrentTier?: boolean;
}

interface TopUpPackage {
  credits: number;
  price: number;
}

export const Store = () => {
  const [currentBalance] = useState(0);
  const [selectedTopUpIndex, setSelectedTopUpIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const setCardRef = (index: number) => (el: HTMLDivElement | null) => {
    cardsRef.current[index] = el;
  };

  const subscriptionTiers: SubscriptionTier[] = [
    { name: 'Basic', credits: 100, price: 4.99 },
    { name: 'Premium', credits: 300, price: 9.99, isCurrentTier: true },
    { name: 'Pro', credits: 1000, price: 24.99 }
  ];

  const topUpPackages: TopUpPackage[] = [
    { credits: 50, price: 2.99 },
    { credits: 100, price: 4.99 },
    { credits: 200, price: 8.99 },
    { credits: 500, price: 19.99 },
    { credits: 1000, price: 34.99 },
    { credits: 2000, price: 59.99 }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('card-visible');
            }, index * 100);
          }
        });
      },
      { threshold: 0.2 }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  const handleSubscriptionPurchase = async (tier: SubscriptionTier) => {
    setIsLoading(true);
    // Simulated purchase process
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Processing subscription purchase for ${tier.name} tier: ${tier.credits} credits at $${tier.price}/month`);
    setIsLoading(false);
  };

  const handleTopUpPurchase = async (pkg: TopUpPackage, index: number) => {
    setSelectedTopUpIndex(index);
    setIsLoading(true);
    console.log(pkg);
    // Simulated purchase process
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  return (
    <section id="store-section" className="full-width">
      {/* Floating coins background */}
      <div className="coin-background">
        <div className="floating-coin"></div>
        <div className="floating-coin"></div>
        <div className="floating-coin"></div>
        <div className="floating-coin"></div>
        <div className="floating-coin"></div>
      </div>
      
      <div className="container">
        <div className="store-header glass-effect">
          <h1 className="text-reveal">Token Store</h1>
          <div className="balance-display gradient-border">
            <span>Current Balance:</span>
            <div className="credit-amount">
              <i className="fas fa-coins"></i>
              <span>{currentBalance}</span>
            </div>
          </div>
          <button className="button restore-button">
            Restore Purchases
          </button>
        </div>

        <h2 className="section-title text-reveal">Monthly Subscriptions</h2>
        <div className="subscription-tiers">
          {subscriptionTiers.map((tier, index) => (
            <div
              key={tier.name}
              ref={setCardRef(index)}
              className={`subscription-card gradient-border glass-effect transform-3d rich-hover ${
                tier.isCurrentTier ? 'current-tier' : ''
              }`}
              onClick={() => handleSubscriptionPurchase(tier)}
            >
              {tier.isCurrentTier && (
                <div className="current-badge">
                  <span>Current Plan</span>
                </div>
              )}
              <div className="card-content">
                <h3>{tier.name}</h3>
                <div className="credits">
                  <i className="fas fa-coins"></i>
                  <span>{tier.credits}</span>
                </div>
                <div className="price">
                  <span>${tier.price}</span>
                  <small>/month</small>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="subscription-note glass-effect">
          <i className="fas fa-info-circle"></i>
          <p>Note: Top-ups are not carried over to the next billing cycle. Your balance resets to your monthly subscription amount.</p>
        </div>

        <h2 className="section-title text-reveal">One-time Top Up</h2>
        <div className="top-up-grid">
          {topUpPackages.map((pkg, index) => (
            <div
              key={pkg.credits}
              ref={setCardRef(index + subscriptionTiers.length)}
              className={`top-up-card gradient-border glass-effect rich-hover ${
                selectedTopUpIndex === index ? 'selected' : ''
              }`}
              onClick={() => handleTopUpPurchase(pkg, index)}
            >
              <div className="card-content">
                <div className="credits">
                  <i className="fas fa-coins"></i>
                  <span>{pkg.credits}</span>
                </div>
                <div className="price">
                  <span>${pkg.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="loading-overlay glass-effect">
          <div className="loading-spinner"></div>
          <p className="pulse-text">Processing Purchase</p>
        </div>
      )}
    </section>
  );
};