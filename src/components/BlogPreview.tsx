import { Link } from 'react-router-dom';
import '../styles/BlogPreview.css';

// Using the same blog posts data that's in the BlogPage component
const blogPosts = [
  {
    id: 1,
    slug: 'future-of-vr-industry',
    title: 'The Future of VR Industry in 2024',
    excerpt: "Virtual reality continues to transform how we interact with digital content. Here's what to expect in the coming year.",
    category: 'Industry Trends',
    date: 'January 15, 2024',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8dmlydHVhbCUyMHJlYWxpdHl8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
  },
  {
    id: 2,
    slug: 'immersive-learning-education',
    title: 'How Immersive Learning is Transforming Education',
    excerpt: 'Educational institutions are increasingly adopting virtual reality to create engaging learning experiences.',
    category: 'Education',
    date: 'January 8, 2024',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fHZpcnR1YWwlMjByZWFsaXR5fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
  },
  {
    id: 3,
    slug: 'ai-powered-vr-experiences',
    title: 'AI-Powered VR Experiences: The Next Frontier',
    excerpt: 'The integration of artificial intelligence with virtual reality is creating more responsive and personalized experiences.',
    category: 'Technology',
    date: 'December 20, 2023',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fGFydGlmaWNpYWwlMjBpbnRlbGxpZ2VuY2V8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
  },
  {
    id: 4,
    slug: 'virtual-concerts-future-entertainment',
    title: 'Virtual Concerts: The Future of Entertainment',
    excerpt: 'Live music experiences are being revolutionized by VR technology, allowing fans to attend concerts from anywhere.',
    category: 'Entertainment',
    date: 'December 12, 2023',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y29uY2VydHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
  },
  {
    id: 5,
    slug: 'vr-therapy-mental-health',
    title: 'VR Therapy: A New Approach to Mental Health',
    excerpt: 'Therapists are using virtual reality to create controlled environments for treating anxiety, PTSD, and phobias.',
    category: 'Health',
    date: 'December 5, 2023',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1580584126903-c17d41830450?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8bWVudGFsJTIwaGVhbHRofGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
  },
];

export const BlogPreview = () => {
  return (
    <section className="blog-preview-section">
      <div className="container">
        <div className="blog-preview-header">
          <h2>Latest from Our Blog</h2>
          <Link to="/blog" className="view-all-link">
            View All <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
        
        <div className="blog-preview-scroll-container">
          <div className="blog-preview-cards">
            {blogPosts.map(post => (
              <Link to={`/blog/${post.slug}`} className="blog-preview-card" key={post.id}>
                <div className="blog-preview-image" style={{ backgroundImage: `url(${post.image})` }}>
                  <div className="blog-preview-category">{post.category}</div>
                </div>
                <div className="blog-preview-content">
                  <h3>{post.title}</h3>
                  <p className="blog-preview-meta">
                    <span>{post.date}</span>
                    <span className="separator">•</span>
                    <span>{post.readTime}</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}; 