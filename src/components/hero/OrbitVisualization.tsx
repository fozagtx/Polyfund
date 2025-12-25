import { motion } from 'framer-motion';

const businessIcons = [
  { bg: 'bg-primary/20', icon: '📊', position: { top: '15%', right: '10%' } },
  { bg: 'bg-lavender/20', icon: '💼', position: { top: '45%', right: '5%' } },
  { bg: 'bg-peach/20', icon: '🏢', position: { bottom: '25%', left: '35%' } },
];

export function OrbitVisualization() {
  return (
    <div className="relative w-full h-full min-h-[400px] lg:min-h-[500px] flex items-center justify-center">
      {/* Orbit rings */}
      <div className="absolute w-[320px] h-[320px] lg:w-[420px] lg:h-[420px] rounded-full border border-border/15" />
      <div className="absolute w-[220px] h-[220px] lg:w-[300px] lg:h-[300px] rounded-full border border-border/20" />
      <div className="absolute w-[120px] h-[120px] lg:w-[180px] lg:h-[180px] rounded-full border border-border/25" />

      {/* Center avatar with glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="relative z-10"
      >
        <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden border-2 border-primary/40">
          <img 
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" 
            alt="" 
            className="w-full h-full object-cover" 
          />
        </div>
        {/* Glow effect */}
        <div className="absolute -inset-3 rounded-full bg-primary/30 blur-xl -z-10" />
        <div className="absolute -inset-6 rounded-full bg-lavender/20 blur-2xl -z-20" />
      </motion.div>

      {/* Floating business icons */}
      {businessIcons.map((item, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={item.position}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 + i * 0.15, duration: 0.4 }}
        >
          <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-xl ${item.bg} backdrop-blur-sm flex items-center justify-center text-xl lg:text-2xl border border-border/20`}>
            {item.icon}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
