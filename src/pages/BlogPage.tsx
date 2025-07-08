import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/BlogPage.css';

// Sample blog post data - in a real app, this would come from an API or CMS
const blogPosts = [
  {
    id: 1,
    slug: 'future-of-vr-industry',
    title: 'The Future of VR Industry in 2024',
    excerpt: "Virtual reality continues to transform how we interact with digital content. Here's what to expect in the coming year.",
    category: 'Industry Trends',
    author: 'Alex Morgan',
    authorAvatar: 'https://i.pravatar.cc/150?img=11',
    date: 'January 15, 2024',
    readTime: '5 min read',
    featured: true,
    image: 'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8dmlydHVhbCUyMHJlYWxpdHl8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    tags: ['VR', 'Technology', 'Future']
  },
  {
    id: 2,
    slug: 'immersive-learning-education',
    title: 'How Immersive Learning is Transforming Education',
    excerpt: 'Educational institutions are increasingly adopting virtual reality to create engaging learning experiences.',
    category: 'Education',
    author: 'Sarah Chen',
    authorAvatar: 'https://i.pravatar.cc/150?img=5',
    date: 'January 8, 2024',
    readTime: '4 min read',
    featured: true,
    image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fHZpcnR1YWwlMjByZWFsaXR5fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
    tags: ['Education', 'Learning', 'VR']
  },
  {
    id: 3,
    slug: 'ai-powered-vr-experiences',
    title: 'AI-Powered VR Experiences: The Next Frontier',
    excerpt: 'The integration of artificial intelligence with virtual reality is creating more responsive and personalized experiences.',
    category: 'Technology',
    author: 'Michael Stevens',
    authorAvatar: 'https://i.pravatar.cc/150?img=12',
    date: 'December 20, 2023',
    readTime: '6 min read',
    featured: false,
    image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fGFydGlmaWNpYWwlMjBpbnRlbGxpZ2VuY2V8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    tags: ['AI', 'Technology', 'Innovation']
  },
  {
    id: 4,
    slug: 'virtual-concerts-future-entertainment',
    title: 'Virtual Concerts: The Future of Entertainment',
    excerpt: 'Live music experiences are being revolutionized by VR technology, allowing fans to attend concerts from anywhere.',
    category: 'Entertainment',
    author: 'Zoe Williams',
    authorAvatar: 'https://i.pravatar.cc/150?img=23',
    date: 'December 12, 2023',
    readTime: '4 min read',
    featured: false,
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y29uY2VydHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
    tags: ['Entertainment', 'Music', 'Events']
  },
  {
    id: 5,
    slug: 'vr-therapy-mental-health',
    title: 'VR Therapy: A New Approach to Mental Health',
    excerpt: 'Therapists are using virtual reality to create controlled environments for treating anxiety, PTSD, and phobias.',
    category: 'Health',
    author: 'Dr. Emily Rodriguez',
    authorAvatar: 'https://i.pravatar.cc/150?img=32',
    date: 'December 5, 2023',
    readTime: '7 min read',
    featured: false,
    image: 'https://images.unsplash.com/photo-1580584126903-c17d41830450?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8bWVudGFsJTIwaGVhbHRofGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
    tags: ['Health', 'Therapy', 'Wellness']
  },
  {
    id: 6,
    slug: 'vr-design-best-practices',
    title: 'Best Practices for VR Experience Design',
    excerpt: 'Creating effective VR experiences requires understanding human perception and interaction in 3D space.',
    category: 'Design',
    author: 'Jason Lee',
    authorAvatar: 'https://i.pravatar.cc/150?img=15',
    date: 'November 28, 2023',
    readTime: '5 min read',
    featured: false,
    image: 'https://images.unsplash.com/photo-1561883088-039e53143d73?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZGVzaWduJTIwcHJvY2Vzc3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
    tags: ['Design', 'UX', 'Development']
  },
];

// Get unique categories from the posts
const categories = Array.from(new Set(blogPosts.map(post => post.category)));

export const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter posts based on active category and search query
  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = activeCategory ? post.category === activeCategory : true;
    const matchesSearch = searchQuery 
      ? post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  // Get featured posts
  const featuredPosts = blogPosts.filter(post => post.featured);

  return (
    <div className="blog-page">
      {/* Hero Section */}
      <div className="blog-hero">
        <div className="blog-hero-content">
          <h1>POV-Reality Blog</h1>
          <p>
            Insights, updates, and stories about VR technology, immersive experiences, 
            and the future of digital interaction.
          </p>
          <div className="blog-search-filters">
            <div className="blog-search">
              <input 
                type="text" 
                placeholder="Search articles..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button aria-label="Search">
                <i className="fas fa-search"></i>
              </button>
            </div>
            
            <div className="category-dropdown">
              <select 
                value={activeCategory || ''} 
                onChange={(e) => setActiveCategory(e.target.value || null)}
                aria-label="Filter by category"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Posts */}
      {!searchQuery && !activeCategory && (
        <section className="featured-posts">
          <div className="container">
            <h2 className="section-title">Featured Articles</h2>
            <div className="featured-grid">
              {featuredPosts.map(post => (
                <Link to={`/blog/${post.slug}`} className="featured-card" key={post.id}>
                  <div className="featured-image" style={{ backgroundImage: `url(${post.image})` }}>
                    <div className="featured-category">{post.category}</div>
                  </div>
                  <div className="featured-content">
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <div className="post-meta">
                      <div className="author">
                        <img src={post.authorAvatar} alt={post.author} />
                        <span>{post.author}</span>
                      </div>
                      <div className="post-info">
                        <span>{post.date}</span>
                        <span className="separator">•</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories and Post Listing */}
      <section className="blog-content">
        <div className="container">
          {/* Posts Grid */}
          <div className="posts-container">
            <h2 className="posts-title">
              {activeCategory ? activeCategory : 'All Articles'}
              {searchQuery && ` - Search results for "${searchQuery}"`}
            </h2>
            
            {filteredPosts.length === 0 ? (
              <div className="no-posts">
                <i className="fas fa-search-minus"></i>
                <h3>No articles found</h3>
                <p>Try adjusting your search or filter criteria.</p>
              </div>
            ) : (
              <div className="posts-grid">
                {filteredPosts.map(post => (
                  <Link to={`/blog/${post.slug}`} className="post-card" key={post.id}>
                    <div className="post-image" style={{ backgroundImage: `url(${post.image})` }}>
                      <div className="post-category">{post.category}</div>
                    </div>
                    <div className="post-content">
                      <h3>{post.title}</h3>
                      <p>{post.excerpt}</p>
                      <div className="post-meta">
                        <div className="post-info">
                          <span>{post.date}</span>
                          <span className="separator">•</span>
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-container">
            <h2>Subscribe to Our Newsletter</h2>
            <p>Get the latest articles and VR insights delivered straight to your inbox.</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Your email address" required />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}; 