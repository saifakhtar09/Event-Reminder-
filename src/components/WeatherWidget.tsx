import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cloud, CloudRain, Sun, Wind } from 'lucide-react';

export default function WeatherWidget() {
  const [weather, setWeather] = useState({
    temp: 72,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 8
  });

  useEffect(() => {
    const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy'];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    const randomTemp = Math.floor(Math.random() * 30) + 60;

    setWeather({
      temp: randomTemp,
      condition: randomCondition,
      humidity: Math.floor(Math.random() * 40) + 50,
      windSpeed: Math.floor(Math.random() * 15) + 5
    });
  }, []);

  const getWeatherIcon = () => {
    switch (weather.condition) {
      case 'Sunny':
        return <Sun className="w-12 h-12 text-yellow-400" />;
      case 'Rainy':
        return <CloudRain className="w-12 h-12 text-blue-400" />;
      case 'Cloudy':
        return <Cloud className="w-12 h-12 text-gray-400" />;
      default:
        return <Cloud className="w-12 h-12 text-blue-300" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-gray-600 text-sm font-medium">Current Weather</p>
          <p className="text-4xl font-bold text-gray-800 mt-1">{weather.temp}°F</p>
        </div>
        <motion.div
          animate={{ rotate: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {getWeatherIcon()}
        </motion.div>
      </div>

      <p className="text-gray-700 font-medium mb-4">{weather.condition}</p>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4" />
          <span>{weather.windSpeed} mph</span>
        </div>
        <div>
          <span>Humidity: {weather.humidity}%</span>
        </div>
      </div>
    </motion.div>
  );
}
