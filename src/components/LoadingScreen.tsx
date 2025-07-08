import { useEffect, useRef, useState } from 'react';
import { useLoading } from '../contexts/LoadingContext';

export const LoadingScreen = () => {
  const { isLoading } = useLoading();
  const [isVisible, setIsVisible] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Handle visibility with a slight delay to ensure smooth transitions
  useEffect(() => {
    if (isLoading) {
      setIsVisible(true);
      // Prevent body scroll while loading
      document.body.style.overflow = 'hidden';
    } else {
      // Keep the loading screen visible until fade-out animation completes
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Restore body scroll after loading
        document.body.style.overflow = '';
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  useEffect(() => {
    if (!canvasRef.current || !isVisible) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const startTime = Date.now();

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class VortexParticle {
      x: number = 0;
      y: number = 0;
      radius: number = 0;
      angle: number = 0;
      speed: number = 0;
      distance: number = 0;
      color: string = '#4FD1C5';
      alpha: number = 0;
      
      constructor() {
        this.reset();
        // Start particles at random positions
        this.angle = Math.random() * Math.PI * 2;
        this.distance = Math.random() * (canvas.width * 0.4);
      }

      reset() {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        this.angle = 0;
        this.speed = 0.02 + Math.random() * 0.02;
        this.radius = Math.random() * 2;
        this.distance = 0;
        this.color = Math.random() > 0.5 ? '#4FD1C5' : '#000000';
        this.alpha = 0;
        this.x = centerX;
        this.y = centerY;
      }

      update() {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // Update angle and distance
        this.angle += this.speed;
        this.distance += 1;
        
        // Calculate new position
        this.x = centerX + Math.cos(this.angle) * this.distance;
        this.y = centerY + Math.sin(this.angle) * this.distance;
        
        // Update alpha based on distance
        const maxDistance = Math.min(canvas.width, canvas.height) * 0.5;
        this.alpha = 1 - (this.distance / maxDistance);
        
        // Reset particle if it's too far or invisible
        if (this.distance > maxDistance || this.alpha <= 0) {
          this.reset();
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color.replace(')', `,${this.alpha})`);
        ctx.fill();
      }
    }

    // Create particles
    const particles: VortexParticle[] = Array.from({ length: 200 }, () => new VortexParticle());

    const animate = () => {
      if (!isVisible) return;

      // Clear canvas with slight fade effect
      ctx.fillStyle = 'rgba(16, 16, 16, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw(ctx);
      });

      // Update progress
      const elapsed = (Date.now() - startTime) / 1000;
      const newProgress = Math.min(100, elapsed * 20); // Full load in 5 seconds
      setProgress(newProgress);

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isVisible]);

  // Clean up animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      // Ensure body scroll is restored on unmount
      document.body.style.overflow = '';
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-background transition-opacity duration-500 flex items-center justify-center
        ${!isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      <div className="relative z-10 flex flex-col items-center justify-center">
        <h1 className="text-5xl font-bold mb-8 text-gradient animate-pulse">
          POV.r
        </h1>
        <div className="w-64 h-1 bg-surface/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-primary-dark transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-4 text-text-secondary/80 text-sm">
          {progress < 100 ? 'Loading...' : 'Welcome'}
        </p>
      </div>
    </div>
  );
}; 