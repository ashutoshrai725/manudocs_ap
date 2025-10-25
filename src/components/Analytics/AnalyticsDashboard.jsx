import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Globe, FileText, DollarSign, Award, ArrowUp, ArrowDown,
  Clock, MapPin, Newspaper, Target, BarChart3, Activity, Zap, ExternalLink,
  RefreshCw, ChevronRight, TrendingDown, Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../LandingPage/Header';
import { fetchPersonalizedExportNews, fetchNewsByCategory } from '../../services/newsService';

function AnalyticsDashboard({ user, onPageChange, onLogout }) {
  const [readinessScore, setReadinessScore] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [liveNews, setLiveNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [newsCategory, setNewsCategory] = useState('all');
  const [animatedStats, setAnimatedStats] = useState({
    docs: 0, value: 0, countries: 0, compliance: 0
  });

  const userExportProfile = {
    countries: ['UAE', 'USA', 'UK'],
    products: ['Spices', 'Textiles', 'Rice']
  };

  const stats = {
    totalDocuments: 127,
    totalValue: 1200000,
    countries: 5,
    lastMonth: 23,
    growth: 15.3
  };

  const monthlyData = [
    { month: 'Jan', value: 45000, docs: 18 },
    { month: 'Feb', value: 52000, docs: 21 },
    { month: 'Mar', value: 48000, docs: 19 },
    { month: 'Apr', value: 61000, docs: 24 },
    { month: 'May', value: 58000, docs: 22 },
    { month: 'Jun', value: 72000, docs: 28 }
  ];

  const topCountries = [
    { name: 'UAE', value: 40, amount: 480000, flag: '🇦🇪', growth: 12 },
    { name: 'USA', value: 30, amount: 360000, flag: '🇺🇸', growth: 8 },
    { name: 'UK', value: 20, amount: 240000, flag: '🇬🇧', growth: 15 },
    { name: 'Germany', value: 7, amount: 84000, flag: '🇩🇪', growth: 5 },
    { name: 'Australia', value: 3, amount: 36000, flag: '🇦🇺', growth: -2 }
  ];

  const emergingMarkets = [
    {
      country: 'Vietnam', flag: '🇻🇳', growth: 45,
      demand: 'Spices & Agricultural Products',
      reason: 'New trade agreement',
      trending: ['Turmeric', 'Black Pepper', 'Rice']
    },
    {
      country: 'Poland', flag: '🇵🇱', growth: 38,
      demand: 'Organic Food Products',
      reason: 'Health consciousness boom',
      trending: ['Organic Rice', 'Spices', 'Tea']
    },
    {
      country: 'Saudi Arabia', flag: '🇸🇦', growth: 32,
      demand: 'Food & Beverages',
      reason: 'Tourism expansion',
      trending: ['Basmati Rice', 'Fruits']
    }
  ];

  const trendingProducts = [
    { hsn: '10063000', name: 'Organic Rice', growth: 32, trend: 'up', value: 850, unit: 'MT' },
    { hsn: '09041100', name: 'Black Pepper', growth: 28, trend: 'up', value: 6200, unit: 'MT' },
    { hsn: '09103000', name: 'Turmeric', growth: 25, trend: 'up', value: 2800, unit: 'MT' },
    { hsn: '09023000', name: 'Black Tea', growth: 22, trend: 'up', value: 3500, unit: 'MT' },
    { hsn: '08051000', name: 'Fresh Oranges', growth: -5, trend: 'down', value: 1200, unit: 'MT' }
  ];

  const maxValue = Math.max(...monthlyData.map(d => d.value));

  useEffect(() => {
    const loadNews = async () => {
      setLoadingNews(true);
      const newsData = await fetchPersonalizedExportNews(
        userExportProfile.countries,
        userExportProfile.products
      );
      if (newsData.success) {
        setLiveNews(newsData.articles.slice(0, 5));
      }
      setLoadingNews(false);
    };
    loadNews();
    const interval = setInterval(loadNews, 300000);
    return () => clearInterval(interval);
  }, []);

  const handleCategoryFilter = async (category) => {
    setNewsCategory(category);
    if (category === 'all') {
      setLoadingNews(true);
      const newsData = await fetchPersonalizedExportNews(
        userExportProfile.countries,
        userExportProfile.products
      );
      setLiveNews(newsData.articles.slice(0, 5));
      setLoadingNews(false);
    } else {
      setLoadingNews(true);
      const articles = await fetchNewsByCategory(category);
      setLiveNews(articles.slice(0, 5).map((article, index) => ({
        id: index + 1,
        title: article.title,
        description: article.description?.slice(0, 100) + '...',
        source: article.source.name,
        url: article.url,
        time: getTimeAgo(article.publishedAt),
        icon: ['🚨', '📢', '💰', '🌐', '📊'][index],
        impact: Math.random() > 0.5 ? 'High' : 'Medium'
      })));
      setLoadingNews(false);
    }
  };

  const refreshNews = async () => {
    setLoadingNews(true);
    const newsData = await fetchPersonalizedExportNews(
      userExportProfile.countries,
      userExportProfile.products
    );
    if (newsData.success) {
      setLiveNews(newsData.articles.slice(0, 5));
    }
    setLoadingNews(false);
  };

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      setAnimatedStats({
        docs: Math.floor(stats.totalDocuments * progress),
        value: Math.floor(stats.totalValue * progress),
        countries: Math.floor(stats.countries * progress),
        compliance: Math.floor(92 * progress)
      });
      if (currentStep >= steps) clearInterval(interval);
    }, stepTime);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setReadinessScore(prev => (prev < 85 ? prev + 1 : 85));
    }, 20);
    return () => clearInterval(interval);
  }, []);

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000 / 60 / 60);
    if (diff < 1) return 'Just now';
    if (diff < 24) return `${diff}h ago`;
    return `${Math.floor(diff / 24)}d ago`;
  };

  const formatCurrency = (amount) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    return `$${(amount / 1000).toFixed(0)}K`;
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Fair';
  };

  const generateCurvePath = (data) => {
    const points = data.map((d, i) => ({
      x: (i / (data.length - 1)) * 100,
      y: 100 - ((d.value / maxValue) * 100)
    }));
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const xc = (points[i].x + points[i - 1].x) / 2;
      const yc = (points[i].y + points[i - 1].y) / 2;
      path += ` Q ${points[i - 1].x} ${points[i - 1].y}, ${xc} ${yc}`;
    }
    path += ` T ${points[points.length - 1].x} ${points[points.length - 1].y}`;
    return path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Header user={user} onLogout={onLogout} onPageChange={onPageChange} />
      
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-6">
        {/* Page Header - Compact */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <h1 className="text-2xl md:text-3xl font-bold mb-1 flex items-center gap-2 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            <BarChart3 size={28} className="text-green-400" />
            Export Analytics Dashboard
          </h1>
          <p className="text-xs text-gray-400">Real-time insights for your export business</p>
        </motion.div>

        {/* Readiness Score - Compact */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-green-600 via-green-500 to-emerald-600 rounded-2xl p-4 md:p-6 mb-4 relative overflow-hidden shadow-xl"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20"
          />
          
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Award className="text-white" size={24} />
                <h2 className="text-lg md:text-xl font-bold text-white">Export Readiness</h2>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <motion.span 
                  key={readinessScore}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className="text-5xl md:text-6xl font-bold text-white"
                >
                  {readinessScore}
                </motion.span>
                <span className="text-2xl text-white/90">/100</span>
                <span className="ml-2 px-3 py-1 bg-white/20 rounded-full text-xs font-semibold text-white">
                  {getScoreLabel(readinessScore)}
                </span>
              </div>
              
              <div className="w-full max-w-sm bg-white/20 rounded-full h-3 mb-2 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${readinessScore}%` }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  className="bg-white rounded-full h-3 shadow-lg"
                />
              </div>
              <p className="text-xs text-white/90">
                🎯 Great progress! Complete certificates to reach 100%
              </p>
            </div>
            <motion.div 
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="hidden lg:block"
            >
              <Activity size={100} className="text-white/20" />
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Grid - Compact */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {[
            { icon: FileText, value: animatedStats.docs, label: 'Documents', color: 'blue', growth: stats.growth },
            { icon: DollarSign, value: formatCurrency(animatedStats.value), label: 'Value', color: 'green', growth: 12.5 },
            { icon: Globe, value: animatedStats.countries, label: 'Countries', color: 'purple', growth: null },
            { icon: Target, value: `${animatedStats.compliance}%`, label: 'Compliance', color: 'orange', growth: null }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -3 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-gray-700/50 hover:border-green-500/50 transition-all cursor-pointer relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/10 rounded-full blur-xl -mr-12 -mt-12`} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon size={18} className={`text-${stat.color}-400`} />
                  {stat.growth && (
                    <span className="text-[10px] text-green-400 flex items-center gap-0.5 font-semibold">
                      <ArrowUp size={10} />
                      {stat.growth}%
                    </span>
                  )}
                </div>
                <div className="text-xl md:text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-xs text-gray-400">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts & Countries Grid - Compact */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* Curve Chart */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm md:text-base font-semibold flex items-center gap-2">
                <TrendingUp size={18} className="text-green-400" />
                Export Trends
              </h3>
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-gray-700/50 border border-gray-600 rounded-lg px-2 py-1 text-xs"
              >
                <option value="3months">3 Months</option>
                <option value="6months">6 Months</option>
                <option value="1year">1 Year</option>
              </select>
            </div>
            <div className="relative h-48">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(34, 197, 94, 0.4)" />
                    <stop offset="100%" stopColor="rgba(34, 197, 94, 0)" />
                  </linearGradient>
                </defs>
                <motion.path
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.3 }}
                  transition={{ duration: 2 }}
                  d={`${generateCurvePath(monthlyData)} L 100 100 L 0 100 Z`}
                  fill="url(#chartGradient)"
                />
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2 }}
                  d={generateCurvePath(monthlyData)}
                  fill="none"
                  stroke="rgba(34, 197, 94, 1)"
                  strokeWidth="0.5"
                />
              </svg>
              <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1 text-[10px] text-gray-400">
                {monthlyData.map((d, i) => (
                  <span key={i}>{d.month}</span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Top Countries - Compact */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50"
          >
            <h3 className="text-sm md:text-base font-semibold mb-3 flex items-center gap-2">
              <MapPin size={18} className="text-blue-400" />
              Top Destinations
            </h3>
            <div className="space-y-3">
              {topCountries.map((country, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 3 }}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <span className="text-2xl">{country.flag}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">{country.name}</span>
                      <span className="text-[10px] text-gray-400">{country.value}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${country.value}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                        className="bg-gradient-to-r from-green-600 to-green-400 rounded-full h-2"
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-gray-500">{formatCurrency(country.amount)}</span>
                      <span className={`text-[10px] flex items-center gap-0.5 ${country.growth > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {country.growth > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                        {Math.abs(country.growth)}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* News & Markets - Compact */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* News - Compact */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm md:text-base font-semibold flex items-center gap-2">
                <Newspaper size={18} className="text-yellow-400" />
                Export News
              </h3>
              <div className="flex items-center gap-2">
                <select
                  value={newsCategory}
                  onChange={(e) => handleCategoryFilter(e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-2 py-1 text-[10px]"
                >
                  <option value="all">All</option>
                  <option value="policy">Policy</option>
                  <option value="trade">Trade</option>
                </select>
                <motion.button
                  whileHover={{ rotate: 180 }}
                  onClick={refreshNews}
                  className="p-1.5 bg-gray-700 rounded-lg hover:bg-gray-600"
                  disabled={loadingNews}
                >
                  <RefreshCw size={12} className={loadingNews ? 'animate-spin' : ''} />
                </motion.button>
              </div>
            </div>

            <div className="mb-2 p-2 bg-green-900/20 rounded-lg border border-green-800/30">
              <p className="text-[10px] text-green-300 flex items-center gap-1">
                <Target size={10} />
                {userExportProfile.countries.join(', ')} · {userExportProfile.products.join(', ')}
              </p>
            </div>
            
            <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar">
              {loadingNews ? (
                <div className="flex items-center justify-center h-48">
                  <RefreshCw size={24} className="text-green-400 animate-spin" />
                </div>
              ) : (
                liveNews.map((news, index) => (
                  <motion.a
                    key={news.id}
                    href={news.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.01 }}
                    className="block bg-gray-700/50 rounded-lg p-3 border border-gray-600/50 hover:border-green-500/50 transition-all group"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-xl">{news.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="text-xs font-semibold group-hover:text-green-400 transition-colors line-clamp-2">
                            {news.title}
                          </h4>
                          <ExternalLink size={10} className="text-gray-400 flex-shrink-0 ml-1" />
                        </div>
                        <p className="text-[10px] text-gray-400 mb-2 line-clamp-1">{news.description}</p>
                        <div className="flex items-center gap-1 text-[9px] text-gray-500 flex-wrap">
                          <span className="font-medium">{news.source}</span>
                          <span>•</span>
                          <span>{news.time}</span>
                          <span className={`ml-auto px-1.5 py-0.5 rounded-full ${
                            news.impact === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {news.impact}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.a>
                ))
              )}
            </div>
          </motion.div>

          {/* Markets - Compact */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50"
          >
            <h3 className="text-sm md:text-base font-semibold mb-3 flex items-center gap-2">
              <Zap size={18} className="text-orange-400" />
              Hot Markets
            </h3>
            <div className="space-y-3 max-h-72 overflow-y-auto custom-scrollbar">
              {emergingMarkets.map((market, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.15 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-lg p-3 border border-orange-500/30 hover:border-orange-500/60 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{market.flag}</span>
                      <div>
                        <h4 className="text-sm font-bold">{market.country}</h4>
                        <span className="text-[10px] text-gray-400">{market.demand}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded-full text-[10px] font-bold flex items-center gap-0.5">
                      <TrendingUp size={10} />
                      +{market.growth}%
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 mb-2">{market.reason}</p>
                  <div className="flex flex-wrap gap-1">
                    {market.trending.map((product, i) => (
                      <span 
                        key={i}
                        className="px-2 py-0.5 bg-gray-700/50 rounded-full text-[9px] text-gray-300"
                      >
                        {product}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Trending Products - Compact */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50"
        >
          <h3 className="text-sm md:text-base font-semibold mb-3 flex items-center gap-2">
            <TrendingUp size={18} className="text-pink-400" />
            Trending Products
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {trendingProducts.map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.03 }}
                className={`rounded-xl p-3 border cursor-pointer transition-all ${
                  product.trend === 'up' 
                    ? 'bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/30 hover:border-green-500/60' 
                    : 'bg-gradient-to-br from-red-500/10 to-red-600/10 border-red-500/30 hover:border-red-500/60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-white">#{index + 1}</span>
                  <span className={`flex items-center gap-0.5 text-xs font-bold ${
                    product.trend === 'up' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {product.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {Math.abs(product.growth)}%
                  </span>
                </div>
                <h4 className="text-xs font-bold mb-1 line-clamp-2">{product.name}</h4>
                <p className="text-[9px] text-gray-400 mb-2">HSN: {product.hsn}</p>
                <div className="text-sm font-bold text-white">
                  ${product.value}
                  <span className="text-[10px] text-gray-400 font-normal">/{product.unit}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(75, 85, 99, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(34, 197, 94, 0.5);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}

export default AnalyticsDashboard;
