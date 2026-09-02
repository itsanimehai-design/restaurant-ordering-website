import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useRestaurantData } from '../context/RestaurantDataContext';

export const HeaderLiveClock: React.FC = () => {
  const { config } = useRestaurantData();
  const [time, setTime] = useState<Date>(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format 12-hour time components
  const hoursRaw = time.getHours();
  const hours12 = hoursRaw % 12 || 12;
  const hoursStr = String(hours12).padStart(2, '0');
  const minutesStr = String(time.getMinutes()).padStart(2, '0');
  const secondsStr = String(time.getSeconds()).padStart(2, '0');
  const meridiem = hoursRaw >= 12 ? 'PM' : 'AM';

  // Get current day's hours or fallback
  const currentDayIndex = time.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const isWeekend = currentDayIndex === 0 || currentDayIndex === 6 || currentDayIndex === 5;
  const todayHours = isWeekend ? '12:30 PM – 12:30 AM' : '12:30 PM – 11:30 PM';

  return (
    <div 
      className="inline-flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-1.5 px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-lg bg-[#15110d]/90 border border-[#2c2219]/80 shadow-[0_2px_8px_rgba(0,0,0,0.4)] backdrop-blur-sm select-none"
      title="Live Local Restaurant Time"
    >
      {/* Mini Clock Icon with subtle warm gold glow */}
      <div className="flex items-center gap-1 shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
        <Clock className="w-3 h-3 text-[#d4af37] opacity-90" />
      </div>

      {/* Digital Time Typography */}
      <div className="flex items-baseline font-mono text-[11px] sm:text-xs font-bold tracking-wider tabular-nums text-[#faeed1] drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]">
        <span>{hoursStr}</span>
        <span className="text-[#d4af37] mx-0.5 animate-pulse">:</span>
        <span>{minutesStr}</span>
        <span className="text-[#d4af37] mx-0.5 animate-pulse">:</span>
        <span className="text-[#e6c975] text-[10px] sm:text-[11px]">{secondsStr}</span>
        <span className="ml-1 text-[9px] sm:text-[10px] font-sans font-extrabold uppercase text-[#d4af37] tracking-widest">
          {meridiem}
        </span>
      </div>

      {/* Subtle Divider */}
      <span className="text-[#3d2f22] text-[10px] hidden xs:inline">•</span>

      {/* Open Today & Hours */}
      <div className="hidden xs:flex items-center gap-1 text-[9.5px] sm:text-[10px] font-medium text-[#baa995] tracking-tight">
        <span className="text-emerald-400/90 font-semibold">Open Today</span>
        <span className="text-[#6e5d4d]">•</span>
        <span className="text-[#cfc3b2] tabular-nums">{todayHours}</span>
      </div>
    </div>
  );
};
