import { motion } from 'framer-motion';

interface OrbitVisualizationProps {
  centerValue: string;
  centerLabel: string;
}

const avatars = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
];

const businessIcons = [
  { bg: 'bg-primary/20', icon: '📊' },
  { bg: 'bg-lavender/20', icon: '💼' },
  { bg: 'bg-peach/20', icon: '🏢' },
];

export function OrbitVisualization({ centerValue, centerLabel }: OrbitVisualizationProps) {
  return (
    <div className="relative w-full h-full min-h-[400px] lg:min-h-[500px] flex items-center justify-center">
      {/* Orbit rings */}
      <div className="absolute w-[280px] h-[280px] lg:w-[400px] lg:h-[400px] rounded-full border border-border/20 animate-orbit-slow" />
      <div className="absolute w-[200px] h-[200px] lg:w-[300px] lg:h-[300px] rounded-full border border-border/30 animate-orbit-reverse" />
      <div className="absolute w-[120px] h-[120px] lg:w-[200px] lg:h-[200px] rounded-full border border-border/40" />

      {/* Orbiting avatars - outer ring */}
      <motion.div 
        className="absolute w-[280px] h-[280px] lg:w-[400px] lg:h-[400px]"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {avatars.slice(0, 3).map((avatar, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              top: '50%',
              left: '50%',
              transform: `rotate(${i * 120}deg) translateX(${window.innerWidth > 1024 ? 200 : 140}px) rotate(-${i * 120}deg)`,
            }}
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            <div className="relative -translate-x-1/2 -translate-y-1/2">
              <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-full overflow-hidden border-2 border-primary/30 shadow-lg shadow-primary/20">
                <img src={avatar} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -inset-1 rounded-full bg-primary/20 blur-md -z-10" />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Orbiting avatars - middle ring */}
      <motion.div 
        className="absolute w-[200px] h-[200px] lg:w-[300px] lg:h-[300px]"
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        {avatars.slice(3, 6).map((avatar, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              top: '50%',
              left: '50%',
              transform: `rotate(${i * 120 + 60}deg) translateX(${window.innerWidth > 1024 ? 150 : 100}px) rotate(-${i * 120 + 60}deg)`,
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          >
            <div className="relative -translate-x-1/2 -translate-y-1/2">
              <div className="w-8 h-8 lg:w-12 lg:h-12 rounded-full overflow-hidden border-2 border-lavender/30 shadow-lg shadow-lavender/20">
                <img src={avatar} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -inset-1 rounded-full bg-lavender/20 blur-md -z-10" />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Floating business icons */}
      {businessIcons.map((item, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: `${30 + i * 25}%`,
            right: `${10 + i * 15}%`,
          }}
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 4 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5
          }}
        >
          <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl ${item.bg} backdrop-blur-sm flex items-center justify-center text-lg lg:text-xl border border-border/30`}>
            {item.icon}
          </div>
        </motion.div>
      ))}

      {/* Center content */}
      <motion.div 
        className="relative z-10 text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="text-4xl lg:text-6xl font-bold text-foreground mb-1">{centerValue}</div>
        <div className="text-sm lg:text-base text-muted-foreground">{centerLabel}</div>
      </motion.div>
    </div>
  );
}
