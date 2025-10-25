// src/services/newsService.js

const NEWS_API_KEY = import.meta.env.REACT_APP_NEWS_API_KEY || import.meta.env.VITE_NEWS_API_KEY;
const NEWS_API_BASE = 'https://newsapi.org/v2';

/**
 * Fetch personalized export news based on user's countries and products
 */
export const fetchPersonalizedExportNews = async (userCountries = [], userProducts = []) => {
  try {
    // Build personalized query
    const queries = [
      'india export trade',
      'export policy india',
      'customs duty update',
      'DGFT notification',
      'trade agreement',
      'export incentive',
      'RoDTEP scheme',
      ...userCountries.map(country => `india ${country} trade`),
      ...userProducts.map(product => `${product} export`)
    ];

    // Combine queries with OR operator
    const searchQuery = queries.slice(0, 5).join(' OR ');

    const response = await fetch(
      `${NEWS_API_BASE}/everything?` +
      `q=${encodeURIComponent(searchQuery)}&` +
      `language=en&` +
      `sortBy=publishedAt&` +
      `pageSize=10&` +
      `apiKey=${NEWS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('News API request failed');
    }

    const data = await response.json();
    
    return {
      success: true,
      articles: data.articles.map((article, index) => ({
        id: index + 1,
        title: article.title,
        description: article.description?.slice(0, 150) + '...' || 'No description available',
        source: article.source.name,
        url: article.url,
        publishedAt: article.publishedAt,
        time: getTimeAgo(article.publishedAt),
        imageUrl: article.urlToImage,
        icon: getNewsIcon(index),
        impact: determineImpact(article.title, article.description),
        category: categorizeNews(article.title, article.description)
      }))
    };
  } catch (error) {
    console.error('Error fetching news:', error);
    return {
      success: false,
      articles: getFallbackNews()
    };
  }
};
/**
 * Fetch news by specific category
 */
export const fetchNewsByCategory = async (category) => {
  const categoryQueries = {
    policy: 'india export policy DGFT customs',
    trade: 'india trade agreement FTA tariff',
    incentive: 'export incentive RoDTEP PLI scheme',
    logistics: 'port shipping logistics export',
    market: 'market demand export opportunity'
  };

  const query = categoryQueries[category] || categoryQueries.policy;

  try {
    const response = await fetch(
      `${NEWS_API_BASE}/everything?` +
      `q=${encodeURIComponent(query)}&` +
      `language=en&` +
      `sortBy=publishedAt&` +
      `pageSize=5&` +
      `apiKey=${NEWS_API_KEY}`
    );

    const data = await response.json();
    return data.articles || [];
  } catch (error) {
    console.error('Error fetching category news:', error);
    return [];
  }
};

// Helper Functions
const getTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
  return date.toLocaleDateString();
};

const getNewsIcon = (index) => {
  const icons = ['🚨', '📢', '💰', '🌐', '📊', '🔔', '⚡', '📈', '🎯', '💼'];
  return icons[index % icons.length];
};

const determineImpact = (title, description) => {
  const highImpactKeywords = ['new policy', 'tariff change', 'ban', 'restriction', 'FTA', 'agreement'];
  const mediumImpactKeywords = ['update', 'change', 'announce', 'launch', 'scheme'];
  
  const text = `${title} ${description}`.toLowerCase();
  
  if (highImpactKeywords.some(keyword => text.includes(keyword))) return 'High';
  if (mediumImpactKeywords.some(keyword => text.includes(keyword))) return 'Medium';
  return 'Low';
};

const categorizeNews = (title, description) => {
  const text = `${title} ${description}`.toLowerCase();
  
  if (text.includes('policy') || text.includes('dgft')) return 'Policy Update';
  if (text.includes('tariff') || text.includes('duty')) return 'Tariff Change';
  if (text.includes('incentive') || text.includes('scheme')) return 'Incentive';
  if (text.includes('trade') || text.includes('fta')) return 'Trade Agreement';
  return 'General';
};

const getFallbackNews = () => [
  {
    id: 1,
    title: 'India-UAE CEPA Shows Strong Growth in Q4 2025',
    source: 'Trade Ministry',
    time: '2 hours ago',
    description: 'Bilateral trade under India-UAE CEPA crosses $85 billion milestone, showing 20% YoY growth.',
    icon: '🚨',
    impact: 'High',
    category: 'Trade Agreement',
    url: '#'
  },
  {
    id: 2,
    title: 'RoDTEP Rates Updated for Agricultural Products',
    source: 'DGFT',
    time: '5 hours ago',
    description: 'New rebate rates announced for rice, spices, and fruits exports effective January 2026.',
    icon: '📢',
    impact: 'Medium',
    category: 'Policy Update',
    url: '#'
  },
  {
    id: 3,
    title: 'Export Incentive Scheme Extended for MSMEs',
    source: 'Commerce Ministry',
    time: '1 day ago',
    description: 'Small exporters to receive additional 2% incentive for exports to new markets.',
    icon: '💰',
    impact: 'High',
    category: 'Incentive',
    url: '#'
  }
];
