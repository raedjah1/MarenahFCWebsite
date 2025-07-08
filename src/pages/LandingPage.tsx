import Hero from '../components/Hero';
import { Features } from '../components/Features';
import { Media } from '../components/Media';
import { Store } from '../components/Store';
import { CTA } from '../components/CTA';
import { BlogPreview } from '../components/BlogPreview';

export const LandingPage = () => {
  return (
    <div className="landing-page">
      <Hero />
      <Media />
      <Features />
      <Store />
      <BlogPreview />
      <CTA />
    </div>
  );
}; 