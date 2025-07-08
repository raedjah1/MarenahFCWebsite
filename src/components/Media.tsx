import { useState, useRef } from 'react';
import povDrivingCar from '../assets/videos/pov_drivingcar.mp4';
import povManOnLift from '../assets/videos/pov_manonlift.mp4';
import povGym from '../assets/videos/pov_gym.mp4';
import povSkiingSnow from '../assets/videos/pov_skiing_snow.mp4';
import povBikingAdventure from '../assets/videos/pov_biking_adventure.mp4';
import povPaddleBoarding from '../assets/videos/pov_person_paddleboarding.mp4';

interface MediaData {
  title: string;
  description: string;
  color: string;
  video?: string;
}

const mediaItems: MediaData[] = [
  {
    title: "Driving Experience",
    description: "Experience the thrill of driving from a unique perspective",
    color: "from-red-500 to-orange-600",
    video: povDrivingCar
  },
  {
    title: "Construction View",
    description: "Watch the world from above on a construction lift",
    color: "from-cyan-500 to-blue-600",
    video: povManOnLift
  },
  {
    title: "Gym Workout",
    description: "Get an immersive view of intense workout sessions",
    color: "from-amber-500 to-yellow-600",
    video: povGym
  },
  {
    title: "Skiing Adventure",
    description: "Glide through pristine snow-covered slopes",
    color: "from-blue-500 to-indigo-600",
    video: povSkiingSnow
  },
  {
    title: "Mountain Biking",
    description: "Navigate through thrilling mountain trails",
    color: "from-purple-500 to-pink-600",
    video: povBikingAdventure
  },
  {
    title: "Paddle Adventure",
    description: "Explore waterways from a unique perspective",
    color: "from-green-500 to-teal-600",
    video: povPaddleBoarding
  }
];

export const Media = () => {
  const [hoveredItems, setHoveredItems] = useState<Set<number>>(new Set());
  const [playedItems, setPlayedItems] = useState<Set<number>>(new Set());
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const handleMouseEnter = (index: number) => {
    setHoveredItems(prev => new Set(prev).add(index));
    if (mediaItems[index].video && videoRefs.current[index]) {
      videoRefs.current[index]?.play();
    }
  };

  const handleMouseLeave = (index: number) => {
    setHoveredItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
    if (mediaItems[index].video && videoRefs.current[index]) {
      videoRefs.current[index]?.pause();
    }
  };

  const handleVideoPlayed = (index: number) => {
    setPlayedItems(prev => new Set(prev).add(index));
  };

  // Handle touch events for mobile
  const handleTouchStart = (index: number) => {
    if (mediaItems[index].video && videoRefs.current[index]) {
      if (!playedItems.has(index)) {
        videoRefs.current[index]?.play();
      } else {
        videoRefs.current[index]?.pause();
        setPlayedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(index);
          return newSet;
        });
      }
    }
  };

  return (
    <section id="media-section" className="py-12 md:py-16 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-3 md:px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 md:mb-3 font-display tracking-tight">
            Experience POV Adventures
          </h2>
          <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto font-light px-2">
            Immerse yourself in breathtaking moments captured from unique perspectives
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 max-w-7xl mx-auto">
          {mediaItems.map((item, index) => (
            <div 
              key={index} 
              className="relative group rounded-xl md:rounded-2xl overflow-hidden shadow-lg md:shadow-2xl transform transition-all duration-500 hover:scale-[1.02] h-48 sm:h-56 md:h-64"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={() => handleMouseLeave(index)}
              onTouchStart={() => handleTouchStart(index)}
            >
              <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-500`} />
              
              {/* Base placeholder with color gradient */}
              <div className={`w-full h-full bg-gradient-to-br ${item.color} flex items-center justify-center transition-opacity duration-500 ${item.video && playedItems.has(index) ? 'opacity-0' : 'opacity-100'}`}>
                <div className="text-white/30 text-4xl md:text-6xl font-bold">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 md:h-16 md:w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>

              {/* Video overlay */}
              {item.video && (
                <div className={`absolute inset-0 transition-opacity duration-500 ${playedItems.has(index) ? 'opacity-100' : 'opacity-0'}`}>
                  <video 
                    ref={el => { videoRefs.current[index] = el }}
                    className="w-full h-full object-cover"
                    src={item.video}
                    muted
                    loop
                    playsInline
                    onPlay={() => handleVideoPlayed(index)}
                  />
                </div>
              )}
              
              <div className="absolute inset-x-0 bottom-0 p-3 md:p-5">
                <div className={`transform transition-all duration-500 ${hoveredItems.has(index) || playedItems.has(index) ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-0.5 md:mb-1 font-display">
                    {item.title}
                  </h3>
                  <p className="text-gray-200 text-xs md:text-sm leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>
                {!hoveredItems.has(index) && !playedItems.has(index) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white/80 text-xs md:text-sm tracking-wider uppercase">
                      {item.video ? (window.innerWidth <= 768 ? 'Tap to Play' : 'Hover to Play') : 'Coming Soon'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}; 