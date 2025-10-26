import React, { useState, useEffect } from 'react';
import {
  TrendingUp, Globe, FileText, DollarSign, Award, ArrowUp, ArrowDown,
  Clock, MapPin, Newspaper, Target, BarChart3, Activity, Zap, ExternalLink,
  RefreshCw, ChevronRight, TrendingDown, Filter, Home, Users, Package,
  MessageSquare, Settings, HelpCircle, Bell, Search, Menu, X, ChevronDown,
  Sparkles, CheckCircle, AlertCircle, Upload, Calculator, Phone, Mail,
  FileCheck, LogOut, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fetchPersonalizedExportNews, fetchNewsByCategory } from '../../services/newsService';
import Header from '../LandingPage/Header';

function AnalyticsDashboard({ user, onPageChange, onLogout }) {
  const navigate = useNavigate();
  const [readinessScore, setReadinessScore] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [liveNews, setLiveNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [newsCategory, setNewsCategory] = useState('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const userExportProfile = {
    countries: ['UAE', 'USA', 'UK'],
    products: ['Spices', 'Textiles', 'Rice']
  };

  const stats = {
    totalDocuments: 127,
    exportValue: 1200000,
    countries: 5,
    compliance: 92
  };

  const recentDocs = [
    { id: 1, name: 'Commercial Invoice', country: 'UAE', status: 'Completed', code: 'CI-2024-001', icon: '📄', date: 'Oct 20th' },
    { id: 2, name: 'Packing List', country: 'USA', status: 'Pending', code: 'PL-2024-089', icon: '📦', date: 'Oct 19th' },
    { id: 3, name: 'Bill of Lading', country: 'UK', status: 'Pending', code: 'BL-2024-156', icon: '🚢', date: 'Oct 18th' },
    { id: 4, name: 'Certificate of Origin', country: 'Germany', status: 'Completed', code: 'CO-2024-045', icon: '✓', date: 'Oct 17th' },
    { id: 5, name: 'Export Declaration', country: 'UAE', status: 'Completed', code: 'ED-2024-234', icon: '📋', date: 'Oct 16th' },
    { id: 6, name: 'Phytosanitary Cert', country: 'Australia', status: 'Completed', code: 'PC-2024-078', icon: '🌿', date: 'Oct 15th' }
  ];

  const exportTrends = [
    { product: 'Organic Rice', growth: 45, countries: 12, value: 850000 },
    { product: 'Black Pepper', growth: 38, countries: 8, value: 620000 },
    { product: 'Turmeric Powder', growth: 32, countries: 10, value: 480000 }
  ];

  const newMarkets = [
    { country: 'Vietnam', flag: '🇻🇳', potential: 'High', demand: 'Spices', score: 85 },
    { country: 'Poland', flag: '🇵🇱', potential: 'High', demand: 'Organic Products', score: 78 },
    { country: 'Saudi Arabia', flag: '🇸🇦', potential: 'Medium', demand: 'Food & Beverages', score: 72 }
  ];

  useEffect(() => {
    const loadNews = async () => {
      setLoadingNews(true);
      const newsData = await fetchPersonalizedExportNews(
        userExportProfile.countries,
        userExportProfile.products
      );
      if (newsData.success) {
        setLiveNews(newsData.articles.slice(0, 6));
      }
      setLoadingNews(false);
    };
    loadNews();
    const interval = setInterval(loadNews, 300000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setReadinessScore(prev => (prev < 85 ? prev + 1 : 85));
    }, 20);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount}`;
  };

  const handleCategoryFilter = async (category) => {
    setNewsCategory(category);
    if (category === 'all') {
      setLoadingNews(true);
      const newsData = await fetchPersonalizedExportNews(
        userExportProfile.countries,
        userExportProfile.products
      );
      setLiveNews(newsData.articles.slice(0, 6));
      setLoadingNews(false);
    } else {
      setLoadingNews(true);
      const articles = await fetchNewsByCategory(category);
      setLiveNews(articles.slice(0, 6).map((article, index) => ({
        id: index + 1,
        title: article.title,
        source: article.source.name,
        url: article.url,
        time: new Date(article.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
      })));
      setLoadingNews(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900" style={{
      background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
    }}>
      {/* Header */}
      <Header
        user={user}
        onPageChange={onPageChange}
        onLogout={onLogout}
        documentsUploaded={true}
      />



      {/* Main Content */}
      <div className="pt-16 min-h-screen">
        {/* Content Header */}
        <div className="bg-gray-800 border-b border-gray-700 px-4 lg:px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white">Analytics Dashboard</h1>
                <p className="text-sm lg:text-base text-gray-400 mt-1">
                  Track your export performance with real-time insights
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 bg-gray-700 rounded-lg px-3 lg:px-4 py-2 flex-1 min-w-[200px]">
                  <Search size={18} className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search documents, markets..."
                    className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-gray-400"
                  />
                </div>

                <button className="p-2 hover:bg-gray-700 rounded-lg relative">
                  <Bell size={20} className="text-gray-300" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <button
                  onClick={() => navigate('/smart-generate')}
                  className="bg-manu-green text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  New Document
                  <span className="bg-white text-manu-green rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    +
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Top Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
              {[
                { icon: FileText, value: stats.totalDocuments, label: 'Documents', color: 'blue', change: '+15%' },
                { icon: DollarSign, value: formatCurrency(stats.exportValue), label: 'Export Value', color: 'green', change: '+12%' },
                { icon: Globe, value: stats.countries, label: 'Countries', color: 'purple', change: null },
                { icon: CheckCircle, value: `${stats.compliance}%`, label: 'Compliance', color: 'orange', change: null }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-gray-800 rounded-xl p-3 lg:p-4 border border-gray-700 hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon size={18} className={`text-${stat.color}-400`} />
                    {stat.change && (
                      <span className="text-xs text-green-400 font-semibold flex items-center gap-0.5">
                        <ArrowUp size={12} />
                        {stat.change}
                      </span>
                    )}
                  </div>
                  <div className="text-lg lg:text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* ERI Score + Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-4 lg:p-6 text-white relative overflow-hidden lg:col-span-1"
              >
                <div className="absolute top-0 right-0 w-24 h-24 lg:w-32 lg:h-32 bg-white/10 rounded-full -mr-12 lg:-mr-16 -mt-12 lg:-mt-16"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <Award size={20} />
                    <h3 className="text-sm font-semibold">Export Readiness</h3>
                  </div>
                  <div className="text-3xl lg:text-5xl font-bold mb-2">{readinessScore}%</div>
                  <div className="text-xs lg:text-sm opacity-90 mb-4">
                    {readinessScore >= 80 ? 'Excellent - Ready to export!' : readinessScore >= 60 ? 'Good - Minor improvements needed' : 'Fair - Work on key areas'}
                  </div>
                  <button
                    onClick={() => navigate('/export-readiness-index')}
                    className="bg-white text-green-600 px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2 w-full justify-center"
                  >
                    Retake Assessment
                    <ChevronRight size={14} />
                  </button>
                </div>
              </motion.div>

              <div className="lg:col-span-2 bg-gray-800 rounded-2xl p-4 lg:p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
                  {[
                    { icon: FileCheck, label: 'Generate Invoice', action: () => navigate('/smart-generate') },
                    { icon: Calculator, label: 'Calculate Duty', action: () => navigate('/duty-calculator') },
                    { icon: Globe, label: 'Find Markets', action: () => { } },
                    { icon: Award, label: 'Get Certified', action: () => navigate('/export-readiness-index') }
                  ].map((action, i) => (
                    <button
                      key={i}
                      onClick={action.action}
                      className="flex flex-col items-center gap-2 p-3 border border-gray-700 rounded-xl hover:border-manu-green hover:bg-gray-700 transition-all group text-center"
                    >
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gray-700 group-hover:bg-manu-green rounded-lg flex items-center justify-center transition-colors">
                        <action.icon size={16} className="text-gray-400 group-hover:text-white" />
                      </div>
                      <span className="text-xs font-medium text-gray-300 group-hover:text-white leading-tight">
                        {action.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Documents + Export News */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6 mb-6">
              <div className="bg-gray-800 rounded-2xl p-4 lg:p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">Recent Documents</h3>
                  <button className="text-sm text-manu-green hover:text-green-400 font-medium">
                    View All →
                  </button>
                </div>

                <div className="space-y-2 lg:space-y-3">
                  {recentDocs.map((doc, i) => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="flex items-center gap-3 p-2 lg:p-3 hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                    >
                      <div className="text-xl lg:text-2xl">{doc.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-white truncate">
                          {doc.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          {doc.country} • {doc.date}
                        </div>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full ${doc.status === 'Completed'
                        ? 'bg-green-900/50 text-green-400'
                        : 'bg-yellow-900/50 text-yellow-400'
                        }`}>
                        {doc.status}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800 rounded-2xl p-4 lg:p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Newspaper size={20} className="text-yellow-400" />
                    Export News
                  </h3>
                  <div className="flex items-center gap-2">
                    <select
                      value={newsCategory}
                      onChange={(e) => handleCategoryFilter(e.target.value)}
                      className="text-xs border border-gray-600 rounded-lg px-2 py-1 bg-gray-700 text-white"
                    >
                      <option value="all">All</option>
                      <option value="policy">Policy</option>
                      <option value="trade">Trade</option>
                    </select>
                    <button
                      onClick={() => handleCategoryFilter('all')}
                      className="p-1.5 hover:bg-gray-700 rounded-lg"
                    >
                      <RefreshCw size={14} className={loadingNews ? 'animate-spin text-gray-400' : 'text-gray-400'} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {loadingNews ? (
                    <div className="flex items-center justify-center h-40">
                      <RefreshCw size={24} className="text-manu-green animate-spin" />
                    </div>
                  ) : (
                    liveNews.map((news, i) => (
                      <motion.a
                        key={i}
                        href={news.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="block p-2 lg:p-3 hover:bg-gray-700 rounded-lg transition-colors group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-medium text-gray-200 line-clamp-2 group-hover:text-manu-green transition-colors">
                            {news.title}
                          </h4>
                          <ExternalLink size={12} className="text-gray-500 flex-shrink-0" />
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-500">
                          <span>{news.source}</span>
                          <span>•</span>
                          <span>{news.time}</span>
                        </div>
                      </motion.a>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Export Trends + New Markets */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
              <div className="bg-gray-800 rounded-2xl p-4 lg:p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingUp size={20} className="text-blue-400" />
                  Export Trends
                </h3>
                <div className="space-y-3 lg:space-y-4">
                  {exportTrends.map((trend, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-3 lg:p-4 bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-xl border border-green-800/50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-white text-sm">{trend.product}</h4>
                        <span className="text-green-400 font-bold text-sm flex items-center gap-1">
                          <TrendingUp size={14} />
                          +{trend.growth}%
                        </span>
                      </div>
                      <div className="flex items-center gap-3 lg:gap-4 text-xs text-gray-400 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Globe size={12} />
                          {trend.countries} countries
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign size={12} />
                          {formatCurrency(trend.value)}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800 rounded-2xl p-4 lg:p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Zap size={20} className="text-orange-400" />
                  New Markets to Tap
                </h3>
                <div className="space-y-3 lg:space-y-4">
                  {newMarkets.map((market, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-3 lg:p-4 bg-gradient-to-r from-orange-900/30 to-red-900/30 rounded-xl border border-orange-800/50 hover:border-orange-600 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl lg:text-2xl">{market.flag}</span>
                          <h4 className="font-semibold text-white text-sm lg:text-base">{market.country}</h4>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${market.potential === 'High'
                          ? 'bg-green-900/50 text-green-400'
                          : 'bg-yellow-900/50 text-yellow-400'
                          }`}>
                          {market.potential} Potential
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Demand: {market.demand}</span>
                        <span className="text-orange-400 font-semibold">Score: {market.score}/100</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;