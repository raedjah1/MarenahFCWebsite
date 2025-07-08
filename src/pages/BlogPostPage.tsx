import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import '../styles/BlogPostPage.css';

// Sample blog post data - in a real app, this would come from an API or CMS
const blogPosts = [
  {
    id: 1,
    slug: 'future-of-vr-industry',
    title: 'The Future of VR Industry in 2024',
    excerpt: "Virtual reality continues to transform how we interact with digital content. Here's what to expect in the coming year.",
    content: `
      <p>The virtual reality industry is poised for unprecedented growth in 2024, with advancements in hardware, software, and content creation accelerating the adoption of immersive technologies across multiple sectors.</p>
      
      <h2>Hardware Evolution</h2>
      <p>The next generation of VR headsets are becoming increasingly lightweight and powerful. Major manufacturers are focusing on reducing form factors while improving display resolution, field of view, and processing capabilities. Standalone headsets that don't require connection to external computers are becoming the norm, making VR more accessible to mainstream consumers.</p>
      
      <p>Eye-tracking technology integrated into newer headsets is enabling foveated rendering, which focuses processing power on wherever the user is looking. This mimics how human vision works and allows for more efficient rendering and higher visual fidelity.</p>
      
      <blockquote>
        "The hardware improvements we're seeing this year represent the biggest leap forward since the introduction of consumer VR. These devices are finally approaching the form factor and usability that mainstream users expect." — Dr. Robert Chen, VR Industry Analyst
      </blockquote>
      
      <h2>Enterprise Adoption</h2>
      <p>While gaming continues to drive consumer VR, enterprise applications are showing the strongest growth. Companies are investing in VR for training, design visualization, remote collaboration, and customer experience:</p>
      
      <ul>
        <li><strong>Healthcare:</strong> Medical training and therapeutic applications</li>
        <li><strong>Manufacturing:</strong> Design review, assembly training, and maintenance</li>
        <li><strong>Retail:</strong> Virtual showrooms and product demonstrations</li>
        <li><strong>Real Estate:</strong> Virtual property tours and architectural visualization</li>
      </ul>
      
      <p>The ROI for enterprise VR is becoming increasingly clear, with companies reporting reduced training time, lower costs, and improved outcomes across various use cases.</p>
      
      <h2>Content Ecosystem</h2>
      <p>The VR content ecosystem is maturing rapidly. Major studios are investing in VR content creation, while tools for independent developers are becoming more accessible. Cross-platform development frameworks are reducing the fragmentation that previously challenged the industry.</p>
      
      <p>Social VR platforms are evolving beyond simple meeting spaces to become complex virtual worlds where users can create, share, and monetize content. These platforms are beginning to form the foundation of what many are calling the "metaverse."</p>
      
      <h2>Challenges and Opportunities</h2>
      <p>Despite the progress, challenges remain. Content creation for VR remains more complex and expensive than traditional media. User experience issues like motion sickness affect a segment of users. And while prices are coming down, the cost of high-end VR equipment remains a barrier to mass adoption.</p>
      
      <p>However, these challenges present opportunities for innovation. Companies solving these problems—whether through new hardware approaches, innovative content creation tools, or novel interaction paradigms—will be well-positioned as the industry continues to grow.</p>
      
      <h2>What's Next?</h2>
      <p>Looking ahead, the convergence of VR with other technologies like AI, 5G, and cloud computing will enable new use cases we're only beginning to imagine. Fully immersive digital experiences that are indistinguishable from reality may still be years away, but the path toward that future is becoming clearer with each advancement.</p>
      
      <p>For businesses and consumers alike, 2024 represents an exciting inflection point in the evolution of virtual reality—a technology that continues to transform how we work, play, and connect with each other.</p>
    `,
    category: 'Industry Trends',
    author: 'Alex Morgan',
    authorAvatar: 'https://i.pravatar.cc/150?img=11',
    authorBio: 'Alex Morgan is a technology analyst specializing in immersive technologies with over 8 years of experience covering the VR/AR industry.',
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
    content: `
      <p>Education is undergoing a revolution as virtual reality and immersive technologies redefine what's possible in the classroom, creating unprecedented opportunities for experiential learning.</p>
      
      <h2>Beyond Traditional Learning</h2>
      <p>Traditional education has always been limited by physical constraints—access to resources, location, and the challenge of visualizing abstract concepts. Immersive technologies are breaking down these barriers, allowing students to:</p>
      
      <ul>
        <li>Travel through time and visit historical events as they unfolded</li>
        <li>Explore the human body from the inside out</li>
        <li>Manipulate molecular structures with their hands</li>
        <li>Visit locations around the world without leaving the classroom</li>
      </ul>
      
      <p>This shift from passive to active learning engages multiple senses and creates powerful emotional connections to the material, significantly improving retention and understanding.</p>
      
      <h2>Impact Across Educational Levels</h2>
      <p>From elementary schools to universities, immersive learning is showing impressive results:</p>
      
      <h3>K-12 Education</h3>
      <p>In primary and secondary education, VR field trips are bringing subjects to life. Students can explore the Egyptian pyramids, dive into coral reefs, or walk on the surface of Mars. These experiences create context and relevance that textbooks simply cannot match.</p>
      
      <blockquote>
        "My students used to dread history class. Now they can't wait to put on the headsets and travel back in time. They're not just memorizing dates and events—they're experiencing history." — Maria Gonzalez, 8th Grade Teacher
      </blockquote>
      
      <h3>Higher Education</h3>
      <p>Colleges and universities are using VR for advanced training in fields like medicine, engineering, and architecture. Medical students can practice surgical procedures in virtual environments before working with real patients. Engineering students can build and test complex designs without material costs or safety risks.</p>
      
      <h2>Accessibility and Inclusion</h2>
      <p>One of the most promising aspects of immersive learning is its potential to increase accessibility and inclusion in education. Students with physical disabilities can participate in activities that might otherwise be impossible. Those with learning differences can benefit from customized environments that adapt to their needs.</p>
      
      <p>Virtual reality also democratizes access to educational experiences. Schools with limited resources can provide their students with virtual labs, museums, and field trips that would be financially out of reach in the physical world.</p>
      
      <h2>Challenges to Implementation</h2>
      <p>Despite its promise, immersive learning faces several implementation challenges:</p>
      
      <ul>
        <li><strong>Cost:</strong> While prices are decreasing, VR equipment remains a significant investment for many schools</li>
        <li><strong>Content Quality:</strong> Educational content must be pedagogically sound, not just technically impressive</li>
        <li><strong>Teacher Training:</strong> Educators need support to effectively integrate these tools into their curriculum</li>
        <li><strong>Technical Support:</strong> Schools need infrastructure and staff to maintain VR systems</li>
      </ul>
      
      <h2>The Future of Learning</h2>
      <p>As these technologies continue to evolve and become more accessible, we can expect immersive learning to become a standard component of education at all levels. The lines between physical and virtual classrooms will blur, and the definition of "hands-on learning" will expand to include digital experiences that were once impossible.</p>
      
      <p>The most exciting aspect may be what we haven't yet imagined. As educators and students become creators in virtual space, entirely new forms of teaching and learning will emerge, fundamentally changing our conception of what education can be.</p>
    `,
    category: 'Education',
    author: 'Sarah Chen',
    authorAvatar: 'https://i.pravatar.cc/150?img=5',
    authorBio: 'Sarah Chen is an education technology researcher and former classroom teacher who specializes in immersive learning applications.',
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
    authorBio: 'Michael Stevens is a technology journalist covering the intersection of AI and immersive technologies.',
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
    authorBio: 'Zoe Williams covers entertainment technology and digital media trends.',
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
    authorBio: 'Dr. Emily Rodriguez is a clinical psychologist specializing in virtual reality applications for mental health treatment.',
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
    authorBio: 'Jason Lee is a UX designer specializing in immersive experiences with over a decade of experience in VR/AR design.',
    date: 'November 28, 2023',
    readTime: '5 min read',
    featured: false,
    image: 'https://images.unsplash.com/photo-1561883088-039e53143d73?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZGVzaWduJTIwcHJvY2Vzc3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
    tags: ['Design', 'UX', 'Development']
  },
];

export const BlogPostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    // Find the post based on the slug
    const foundPost = blogPosts.find(p => p.slug === slug);
    
    if (foundPost) {
      setPost(foundPost);
      
      // Set document title
      document.title = `${foundPost.title} | POV-Reality Blog`;
      
      // Find related posts based on category or tags
      const related = blogPosts
        .filter(p => 
          p.id !== foundPost.id && 
          (p.category === foundPost.category || 
          p.tags.some((tag: string) => foundPost.tags.includes(tag)))
        )
        .slice(0, 3);
      
      setRelatedPosts(related);
    } else {
      // Redirect to blog home if post not found
      navigate('/blog');
    }
  }, [slug, navigate]);

  // Scroll progress handler
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!post) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading article...</p>
      </div>
    );
  }

  return (
    <div className="blog-post-page">
      {/* Reading Progress Bar */}
      <div className="reading-progress-container">
        <div 
          className="reading-progress-bar"
          style={{ width: `${readingProgress}%` }}
        ></div>
      </div>

      {/* Hero Section */}
      <div className="blog-post-hero" style={{ backgroundImage: `url(${post.image})` }}>
        <div className="blog-post-hero-overlay">
          <div className="blog-post-hero-content container">
            <Link to="/blog" className="back-to-blog">
              <i className="fas fa-arrow-left"></i> Back to Articles
            </Link>
            <div className="post-category">{post.category}</div>
            <h1>{post.title}</h1>
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
        </div>
      </div>

      {/* Post Content */}
      <div className="blog-post-content container">
        <div className="blog-post-layout">
          {/* Main Content */}
          <article className="post-main">
            <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }}></div>
            
            {/* Tags */}
            <div className="post-tags">
              {post.tags.map((tag: string, index: number) => (
                <span key={index} className="tag">#{tag}</span>
              ))}
            </div>
            
            {/* Author Bio */}
            <div className="author-box">
              <div className="author-image">
                <img src={post.authorAvatar} alt={post.author} />
              </div>
              <div className="author-info">
                <h4>Written by {post.author}</h4>
                <p>{post.authorBio}</p>
              </div>
            </div>
            
            {/* Share Buttons */}
            <div className="share-buttons">
              <h4>Share This Article</h4>
              <div className="social-buttons">
                <button aria-label="Share on Twitter">
                  <i className="fab fa-twitter"></i>
                </button>
                <button aria-label="Share on Facebook">
                  <i className="fab fa-facebook-f"></i>
                </button>
                <button aria-label="Share on LinkedIn">
                  <i className="fab fa-linkedin-in"></i>
                </button>
                <button aria-label="Copy Link">
                  <i className="fas fa-link"></i>
                </button>
              </div>
            </div>
          </article>
          
          {/* Sidebar */}
          <aside className="post-sidebar">
            <div className="sidebar-section">
              <h3>Table of Contents</h3>
              <ul className="table-of-contents">
                {post.content &&
                  post.content
                    .match(/<h2>(.*?)<\/h2>/g)
                    ?.map((match: string, index: number) => {
                      const title = match.replace(/<h2>(.*?)<\/h2>/, '$1');
                      const slug = title.toLowerCase().replace(/\s+/g, '-');
                      return (
                        <li key={index}>
                          <a href={`#${slug}`}>{title}</a>
                        </li>
                      );
                    })}
              </ul>
            </div>
            
            <div className="sidebar-section newsletter-box">
              <h3>Subscribe to Our Newsletter</h3>
              <p>Get the latest VR insights delivered to your inbox</p>
              <form className="newsletter-form">
                <input type="email" placeholder="Your email address" required />
                <button type="submit">Subscribe</button>
              </form>
            </div>
          </aside>
        </div>
      </div>
      
      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="related-posts-section">
          <div className="container">
            <h2>Related Articles</h2>
            <div className="related-posts-grid">
              {relatedPosts.map(relatedPost => (
                <Link to={`/blog/${relatedPost.slug}`} className="related-post-card" key={relatedPost.id}>
                  <div className="related-post-image" style={{ backgroundImage: `url(${relatedPost.image})` }}>
                    <div className="related-post-category">{relatedPost.category}</div>
                  </div>
                  <div className="related-post-content">
                    <h3>{relatedPost.title}</h3>
                    <p>{relatedPost.excerpt}</p>
                    <div className="related-post-meta">
                      <span>{relatedPost.date}</span>
                      <span className="separator">•</span>
                      <span>{relatedPost.readTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Call to Action */}
      <div className="blog-cta-section">
        <div className="container">
          <div className="blog-cta-content">
            <h2>Ready to Experience VR For Yourself?</h2>
            <p>Explore our cutting-edge virtual reality solutions and transform the way you interact with digital content.</p>
            <div className="cta-buttons">
              <Link to="/store" className="cta-button primary">Shop VR Products</Link>
              <Link to="/contact" className="cta-button secondary">Contact Us</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 