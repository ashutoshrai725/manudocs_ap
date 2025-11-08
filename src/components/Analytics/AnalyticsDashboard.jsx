import React, { useState, useEffect } from 'react';
import {
  TrendingUp, Globe, FileText, DollarSign, Award, ArrowUp, ArrowDown,
  Clock, MapPin, Newspaper, Target, BarChart3, Activity, Zap, ExternalLink,
  RefreshCw, ChevronRight, TrendingDown, Filter, Home, Users, Package,
  MessageSquare, Settings, HelpCircle, Bell, Search, Menu, X, ChevronDown,
  Sparkles, CheckCircle, AlertCircle, Upload, Calculator, Phone, Mail,
  FileCheck, LogOut, Download, ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fetchPersonalizedExportNews, fetchNewsByCategory } from '../../services/newsService';
import Header from '../LandingPage/Header';
import { eriStorageService } from '../../services/eriStorageService';

function AnalyticsDashboard({ user, onPageChange, onLogout }) {
  const navigate = useNavigate();
  const [readinessScore, setReadinessScore] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [liveNews, setLiveNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [newsCategory, setNewsCategory] = useState('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activePersonalizedTab, setActivePersonalizedTab] = useState('news');
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

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
    // Core Trade & Logistics Docs
    { id: 1, name: 'Commercial Invoice', country: 'UAE', status: 'Completed', code: 'CI-2024-001', icon: '📄', date: 'Oct 20th' },
    { id: 2, name: 'Packing List', country: 'USA', status: 'Pending', code: 'PL-2024-089', icon: '📦', date: 'Oct 19th' },
    { id: 3, name: 'Bill of Lading', country: 'UK', status: 'Pending', code: 'BL-2024-156', icon: '🚢', date: 'Oct 18th' },
    { id: 4, name: 'Certificate of Origin', country: 'Germany', status: 'Completed', code: 'CO-2024-045', icon: '🌍', date: 'Oct 17th' },
    { id: 5, name: 'Export Declaration', country: 'UAE', status: 'Completed', code: 'ED-2024-234', icon: '📋', date: 'Oct 16th' },
    { id: 6, name: 'Phytosanitary Certificate', country: 'Australia', status: 'Completed', code: 'PC-2024-078', icon: '🌿', date: 'Oct 15th' },

    // Financial & Compliance Docs
    { id: 7, name: 'Proforma Invoice', country: 'Japan', status: 'Completed', code: 'PI-2024-102', icon: '💰', date: 'Oct 14th' },
    { id: 8, name: 'Insurance Certificate', country: 'France', status: 'Completed', code: 'IC-2024-076', icon: '🧾', date: 'Oct 13th' },
    { id: 9, name: 'Letter of Credit', country: 'Singapore', status: 'Pending', code: 'LC-2024-034', icon: '🏦', date: 'Oct 12th' },
    { id: 10, name: 'Bank Realisation Certificate (BRC)', country: 'USA', status: 'Completed', code: 'BRC-2024-028', icon: '💳', date: 'Oct 11th' },
    { id: 11, name: 'Export Invoice (GST Compliant)', country: 'Netherlands', status: 'Completed', code: 'EI-2024-050', icon: '🧾', date: 'Oct 10th' },

    // Quality & Product Certification
    { id: 12, name: 'FSSAI Clearance Certificate', country: 'Canada', status: 'Pending', code: 'FS-2024-091', icon: '🥫', date: 'Oct 9th' },
    { id: 13, name: 'APEDA Registration (RCMC)', country: 'UAE', status: 'Completed', code: 'AP-2024-055', icon: '🍚', date: 'Oct 8th' },
    { id: 14, name: 'Marine Product Export Inspection (EIA)', country: 'China', status: 'Completed', code: 'EIA-2024-067', icon: '🐟', date: 'Oct 7th' },
    { id: 15, name: 'DGFT Registration of Exporter (IEC)', country: 'India', status: 'Completed', code: 'IEC-2024-999', icon: '🪪', date: 'Oct 6th' },
    { id: 16, name: 'HACCP / Quality Management Certificate', country: 'South Korea', status: 'Completed', code: 'QC-2024-081', icon: '✅', date: 'Oct 5th' },
    { id: 17, name: 'ISO 9001 Compliance Audit', country: 'Italy', status: 'Pending', code: 'ISO-2024-023', icon: '📊', date: 'Oct 4th' },
    { id: 18, name: 'EIC Health Certificate (Seafood)', country: 'UK', status: 'Completed', code: 'HC-2024-074', icon: '🧫', date: 'Oct 3rd' },
    { id: 19, name: 'Plant Quarantine Clearance', country: 'Vietnam', status: 'Pending', code: 'PQ-2024-046', icon: '🌾', date: 'Oct 2nd' },

    // Transport, Customs & Logistics
    { id: 20, name: 'Shipping Bill (ICEGATE)', country: 'Belgium', status: 'Completed', code: 'SB-2024-088', icon: '🚚', date: 'Oct 1st' },
    { id: 21, name: 'Airway Bill (AWB)', country: 'Qatar', status: 'Pending', code: 'AWB-2024-097', icon: '✈️', date: 'Sep 30th' },
    { id: 22, name: 'Cargo Insurance Declaration', country: 'Italy', status: 'Completed', code: 'CID-2024-011', icon: '📦', date: 'Sep 29th' },
    { id: 23, name: 'Freight Forwarding Manifest', country: 'Germany', status: 'Pending', code: 'FM-2024-066', icon: '🚛', date: 'Sep 28th' },
    { id: 24, name: 'Export General Manifest (EGM)', country: 'USA', status: 'Completed', code: 'EGM-2024-033', icon: '🗂️', date: 'Sep 27th' },
    { id: 25, name: 'Port Handling Receipt', country: 'Malaysia', status: 'Completed', code: 'PH-2024-078', icon: '⚓', date: 'Sep 26th' },

    // Sector-Specific Export Docs (AP relevant)
    { id: 26, name: 'Spice Board Clearance', country: 'Sri Lanka', status: 'Completed', code: 'SP-2024-017', icon: '🌶️', date: 'Sep 25th' },
    { id: 27, name: 'Marine Export Health Inspection', country: 'Japan', status: 'Completed', code: 'ME-2024-058', icon: '🐠', date: 'Sep 24th' },
    { id: 28, name: 'Textile Export Inspection', country: 'France', status: 'Completed', code: 'TX-2024-022', icon: '🧵', date: 'Sep 23rd' },
    { id: 29, name: 'Pharma Export Batch Release Cert', country: 'UK', status: 'Pending', code: 'PH-2024-025', icon: '💊', date: 'Sep 22nd' },
    { id: 30, name: 'Agri Commodity Sample Report', country: 'Bangladesh', status: 'Completed', code: 'AG-2024-077', icon: '🌾', date: 'Sep 21st' },
    { id: 31, name: 'Export Promotion Council Approval', country: 'India', status: 'Completed', code: 'EP-2024-101', icon: '🏛️', date: 'Sep 20th' },
    { id: 32, name: 'Warehouse Storage Certificate', country: 'UAE', status: 'Completed', code: 'WH-2024-044', icon: '🏗️', date: 'Sep 19th' },
    { id: 33, name: 'Customs Duty Exemption Form (EPCG)', country: 'India', status: 'Pending', code: 'EX-2024-026', icon: '🧾', date: 'Sep 18th' },
    { id: 34, name: 'DGFT Scrip Issuance (RoDTEP)', country: 'India', status: 'Completed', code: 'SC-2024-109', icon: '💹', date: 'Sep 17th' },
    { id: 35, name: 'Shipment Inspection Report (QC)', country: 'Vietnam', status: 'Pending', code: 'SR-2024-083', icon: '🔍', date: 'Sep 16th' },
    { id: 36, name: 'Buyer Contract Agreement', country: 'UAE', status: 'Completed', code: 'BC-2024-064', icon: '🤝', date: 'Sep 15th' },
    { id: 37, name: 'Product Safety Data Sheet', country: 'USA', status: 'Completed', code: 'PS-2024-098', icon: '🧪', date: 'Sep 14th' },
    { id: 38, name: 'Trade Compliance Checklist', country: 'Singapore', status: 'Completed', code: 'TC-2024-053', icon: '📑', date: 'Sep 13th' },
    { id: 39, name: 'DGFT LUT (Letter of Undertaking)', country: 'India', status: 'Completed', code: 'LUT-2024-066', icon: '📜', date: 'Sep 12th' },
    { id: 40, name: 'Freight Payment Confirmation', country: 'Germany', status: 'Pending', code: 'FP-2024-032', icon: '💸', date: 'Sep 11th' }
  ];


  const exportTrends = [
    { product: 'Shrimps & Prawns (seafood aquaculture)', growth: 48, countries: 18 },
    { product: 'Marine & Other Seafood (frozen fish, squid, cuttlefish)', growth: 42, countries: 16 },
    { product: 'Processed & Parboiled Rice', growth: 38, countries: 14 },
    { product: 'Raw/Non-Basmati Rice (bulk & specialty varieties)', growth: 34, countries: 12 },
    { product: 'Mangoes (fresh & processed — Banginapalli, Totapuri)', growth: 36, countries: 12 },
    { product: 'Chillies & Dried Red Chillies (Guntur chillies)', growth: 35, countries: 11 },
    { product: 'Spices (turmeric powder, black pepper, mixed spice blends)', growth: 33, countries: 12 },
    { product: 'Value-added frozen foods (ready-to-eat, frozen vegetables/fruit)', growth: 31, countries: 10 },
    { product: 'Edible Oils & Oilseeds (groundnut/other oilseed products)', growth: 20, countries: 8 },
    { product: 'Cashew Kernels & Processed Nuts', growth: 22, countries: 9 },
    { product: 'Processed Pulses & Packaged Grains (organic / speciality pulses)', growth: 24, countries: 9 },
    { product: 'Dairy & Value-added Dairy (cheese, UHT milk products)', growth: 18, countries: 7 },
    { product: 'Meat & Poultry (processed & frozen)', growth: 19, countries: 8 },
    { product: 'Fishmeal & Marine-based feed ingredients', growth: 21, countries: 7 },
    { product: 'Textiles — Handloom & Powerloom (sarees, cotton yarn, garments)', growth: 29, countries: 13 },
    { product: 'Apparel & Ready-Made Garments (value-added apparel)', growth: 26, countries: 12 },
    { product: 'Home Textiles (bedsheets, towels)', growth: 20, countries: 9 },
    { product: 'Leather & Footwear (components & finished goods)', growth: 23, countries: 10 },
    { product: 'Timber Products, Wood Panels & Furniture Components', growth: 17, countries: 8 },
    { product: 'Engineering Goods & Auto Components', growth: 28, countries: 14 },
    { product: 'AC / HVAC Components & White Goods (Sri City cluster)', growth: 45, countries: 16 },
    { product: 'Electronics Components (ESDM suppliers, PCBs, modules)', growth: 32, countries: 13 },
    { product: 'Mobile/Consumer Electronics (components & subassemblies)', growth: 30, countries: 12 },
    { product: 'Pharmaceuticals & APIs (bulk drugs, intermediates)', growth: 25, countries: 11 },
    { product: 'Medical Devices & Consumables', growth: 22, countries: 10 },
    { product: 'Chemical & Allied Products (industrial chemicals, specialty chemicals)', growth: 21, countries: 10 },
    { product: 'Iron & Steel Products & Fabrications', growth: 27, countries: 12 },
    { product: 'Shipbuilding & Marine Fabrication (small vessels, components)', growth: 24, countries: 9 },
    { product: 'Gems & Jewellery Components (semi-fabricated)', growth: 15, countries: 7 },
    { product: 'Organic & Specialty Agriculture (organic rice, millets)', growth: 26, countries: 10 },
    { product: 'Millets & Nutritional Grains (value-added millets products)', growth: 23, countries: 9 },
    { product: 'Honey & Apiculture Products (processed honey, pollen)', growth: 19, countries: 8 },
    { product: 'Packaged Consumer Foods & Snacks (regional snacks, namkeens)', growth: 25, countries: 11 },
    { product: 'Confectionery & Bakery Ingredients', growth: 16, countries: 7 },
    { product: 'Plastic Products & Polymers (non-hazardous plastics)', growth: 18, countries: 8 },
    { product: 'Packaging Materials (corrugated boxes, flexible packaging)', growth: 20, countries: 9 },
    { product: 'Solar / Renewable Components (PV parts, mounting structures)', growth: 22, countries: 10 },
    { product: 'Green Hydrogen / Clean-energy Components (emerging)', growth: 14, countries: 6 },
    { product: 'Agritech / Foodtech Solutions (farm-to-fork packaged solutions)', growth: 17, countries: 7 },
    { product: 'Beauty & Personal Care (herbal cosmetics, organic products)', growth: 18, countries: 9 },
    { product: 'Handicrafts & Cottage Industry Exports', growth: 21, countries: 10 },
    { product: 'Sports Goods & Rubber Products', growth: 13, countries: 6 },
    { product: 'Industrial Machinery & Tools (SME manufactured items)', growth: 19, countries: 9 },
    { product: 'Testing, Calibration & Laboratory Services (exported services)', growth: 12, countries: 6 },
    { product: 'IT/ITES & Software Services (software export opportunities)', growth: 28, countries: 15 },
    { product: 'Logistics & Supply-chain Services (export logistics, 3PL)', growth: 20, countries: 9 },
    { product: 'Export Packaging Machinery & Processing Lines', growth: 15, countries: 7 },
    { product: 'Biotech Products (agri-biotech inputs, biofertilisers)', growth: 16, countries: 7 },
    { product: 'Educational & Training Services (skill export via vocational programs)', growth: 10, countries: 5 }
  ];



  // Notifications data
  const notifications = [
    { id: 1, title: 'New Export Policy Update', message: 'Government has updated export policies for agricultural products', time: '2 hours ago', read: false },
    { id: 2, title: 'Document Expiry Alert', message: 'Your export license will expire in 15 days', time: '1 day ago', read: false },
    { id: 3, title: 'Market Opportunity', message: 'High demand for spices detected in European markets', time: '2 days ago', read: true },
    { id: 4, title: 'Compliance Check', message: 'Your recent shipment requires additional documentation', time: '3 days ago', read: true }
  ];

  // Personalized Panel Data
  const personalizedNews = [
    {
      id: 1,
      title: 'Australia removes curbs on Andhra shrimp exports',
      image: 'https://www.hindustantimes.com/ht-img/img/2025/10/21/1600x900/Andhra-Pradesh-IT-minister-Nara-Lokesh-with-offici_1761075166241.jpeg',
      excerpt: 'Australia had long restricted the import of unpeeled prawns from India after the detection of white spot virus in previous consignments',
      fullContent: '',
      date: 'Oct 22, 2025',
      link: 'https://www.hindustantimes.com/india-news/australia-removes-curbs-on-andhra-shrimp-exports-101761075173025.html'
    },
    {
      id: 2,
      title: 'Global MSME Export Development Convention 2025 in Visakhapatnam on November 9, 10',
      image: 'https://i.postimg.cc/wMs72NHF/image.png',
      excerpt: 'The Andhra Pradesh MSME Development Corporation (A.P.-MSMEDC) is organising a Global MSME Export Development Convention 2025 in Visakhapatnam on November 9 and 10.',
      fullContent: '',
      date: '8 nov, 2025',
      source: '',
      link: 'https://www.thehindu.com/news/national/andhra-pradesh/global-msme-export-development-convention-2025-in-visakhapatnam-on-november-9-10/article70251547.ece'
    },
    {
      id: 3,
      title: 'Trump tariff impact becomes clearer: Andhra pegs shrimp export losses at Rs 25,000 crore, 50% export orders cancelled',
      image: 'https://i.postimg.cc/wjbMCFMK/image.png',
      excerpt: 'US President Donald Trump\'s tariffs are estimated to have cost Andhra Pradesh approximately Rs 25,000 crore in shrimp exports, with government officials saying that about 50 percent orders were cancelled.',
      fullContent: '',
      date: 'Oct 10, 2025',
      source: '',
      link: 'https://indianexpress.com/article/india/andhra-shrimp-exports-losses-trump-tariffs-impact-10250736/'
    }
  ];

  const marketOpportunities = [
    {
      country: 'Japan',
      image: 'https://flagcdn.com/w320/jp.png',
      description:
        'Rising preference for clean, traceable food & lifestyle products. Key Andhra exports: Organic millets, pulses, marine shrimp, Kalamkari handicrafts, Ayurvedic extracts, granite slabs, APIs (pharma intermediates).',
      potential: 'High'
    },
    {
      country: 'Germany',
      image: 'https://flagcdn.com/w320/de.png',
      description:
        'High-quality niche market for sustainable textiles, organic products, and renewable components. AP can export: Handloom sarees (Venkatagiri, Dharmavaram), Kalamkari textiles, solar-PV mounts, herbal pharma, turmeric.',
      potential: 'High'
    },
    {
      country: 'UAE',
      image: 'https://flagcdn.com/w320/ae.png',
      description:
        'Major re-export and consumption hub for food, construction, and pharma. Products from AP: Basmati & non-Basmati rice, frozen shrimp, mango pulp, ready-to-eat foods, granite, building stones, generic medicines.',
      potential: 'High'
    },
    {
      country: 'United States',
      image: 'https://flagcdn.com/w320/us.png',
      description:
        'Top market for software services, pharmaceuticals, and specialty foods. Key AP exports: APIs & formulations (Vizag cluster), frozen seafood, turmeric & chillies, nutraceuticals, organic snacks, textiles.',
      potential: 'High'
    },
    {
      country: 'China',
      image: 'https://flagcdn.com/w320/cn.png',
      description:
        'Large buyer of raw spices, marine products, and minerals. AP products: Guntur red chillies, cotton yarn, shrimp (Black Tiger, Vannamei), granite, limestone, mineral exports, steel products.',
      potential: 'Medium'
    },
    {
      country: 'United Kingdom',
      image: 'https://flagcdn.com/w320/gb.png',
      description:
        'Strong market for Indian heritage textiles and processed agri goods. AP products: Pochampalli & Venkatagiri sarees, turmeric powder, mango pulp, natural dyed fabrics, seafood & organic packaged foods.',
      potential: 'High'
    },
    {
      country: 'Netherlands',
      image: 'https://flagcdn.com/w320/nl.png',
      description:
        'Gateway to Europe for agri-food and flower exports. AP can export: Marine frozen items, floriculture products, mango pulp, horticultural produce, and plant-based food ingredients.',
      potential: 'Medium'
    },
    {
      country: 'Singapore',
      image: 'https://flagcdn.com/w320/sg.png',
      description:
        'Strategic re-export hub for ASEAN markets. Products: Ready-to-eat food, shrimp, engineering goods, pharma APIs, nutraceuticals, packaged spices from AP.',
      potential: 'High'
    },
    {
      country: 'Australia',
      image: 'https://flagcdn.com/w320/au.png',
      description:
        'Growing market for authentic Indian foods and eco-friendly products. AP can export: Millets, rice, mangoes, processed foods, turmeric, and vegan foods. High potential for frozen shrimp and seafood.',
      potential: 'High'
    },
    {
      country: 'Saudi Arabia',
      image: 'https://flagcdn.com/w320/sa.png',
      description:
        'Rising import demand for agri-commodities and construction materials. AP exports: Rice, pulses, spices, granite, marble, frozen seafood, and ready-to-eat foods.',
      potential: 'High'
    },
    {
      country: 'South Korea',
      image: 'https://flagcdn.com/w320/kr.png',
      description:
        'Tech-driven demand for electronic components, minerals, and chemicals. AP products: API exports, engineered steel, auto components, marine products, and electronics parts from Sri City.',
      potential: 'Medium'
    },
    {
      country: 'Vietnam',
      image: 'https://flagcdn.com/w320/vn.png',
      description:
        'Importing agri inputs, shrimp feed, and processed food. AP opportunities: Shrimp, aquafeed, chillies, turmeric, food-processing machinery, organic pulses.',
      potential: 'High'
    },
    {
      country: 'France',
      image: 'https://flagcdn.com/w320/fr.png',
      description:
        'Appreciation for sustainable handmade goods and organic ingredients. AP exports: Handicrafts, herbal extracts, eco-dyed textiles, essential oils, nutraceutical powders.',
      potential: 'Medium'
    },
    {
      country: 'Bangladesh',
      image: 'https://flagcdn.com/w320/bd.png',
      description:
        'Rising buyer of cement, steel, and processed rice. AP can export: Construction materials, machinery, rice, chillies, and pulses through Visakhapatnam port routes.',
      potential: 'High'
    },
    {
      country: 'Malaysia',
      image: 'https://flagcdn.com/w320/my.png',
      description:
        'Demand for Indian foods and chemicals. AP can export: Rice, pulses, marine frozen food, APIs, turmeric powder, and auto components.',
      potential: 'Medium'
    },
    {
      country: 'Italy',
      image: 'https://flagcdn.com/w320/it.png',
      description:
        'Growing interest in handcrafted textiles and stone. AP exports: Kalamkari paintings, cotton fabrics, granite blocks, tiles, handloom sarees, processed seafood.',
      potential: 'Medium'
    },
    {
      country: 'Canada',
      image: 'https://flagcdn.com/w320/ca.png',
      description:
        'Demand for ethnic foods and pharma formulations. AP exports: Turmeric powder, organic rice, shrimp, pharma formulations, and nutraceuticals.',
      potential: 'High'
    },
    {
      country: 'Brazil',
      image: 'https://flagcdn.com/w320/br.png',
      description:
        'Emerging market for spices, condiments, and processed foods. AP products: Guntur chilli, turmeric, cumin, pharma formulations, processed foods, auto components.',
      potential: 'Medium'
    },
    {
      country: 'South Africa',
      image: 'https://flagcdn.com/w320/za.png',
      description:
        'Growing import market for engineering goods and spices. AP can export: Chillies, rice, auto components, pharmaceuticals, seafood, processed food items.',
      potential: 'High'
    },
    {
      country: 'Indonesia',
      image: 'https://flagcdn.com/w320/id.png',
      description:
        'Importing Indian rice and chillies. AP opportunity in: Rice, pulses, processed food, steel, and spices. Collaboration potential in fisheries & aquaculture.',
      potential: 'Medium'
    },
    {
      country: 'Qatar',
      image: 'https://flagcdn.com/w320/qa.png',
      description:
        'High consumer base for rice, fruits, dairy, and construction material. AP exports: Rice, granite, mango pulp, spices, frozen foods, and seafood.',
      potential: 'High'
    },
    {
      country: 'United Arab Emirates (Dubai Hub)',
      image: 'https://flagcdn.com/w320/ae.png',
      description:
        'AP exporters use Dubai as a transshipment hub to Africa and Europe. Key exports: Agri foods, pharma, seafood, textiles, and polished granite.',
      potential: 'Very High'
    },
    {
      country: 'United States (West Coast)',
      image: 'https://flagcdn.com/w320/us.png',
      description:
        'Growing demand for organic packaged Indian foods. AP potential: Organic rice, millet snacks, spices, turmeric capsules, shrimp, and ready-to-eat curries.',
      potential: 'High'
    },
    {
      country: 'Russia',
      image: 'https://flagcdn.com/w320/ru.png',
      description:
        'Looking for non-EU agri suppliers. AP exports: Rice, seafood, pharmaceuticals, engineering goods, chillies, and stone materials.',
      potential: 'Medium'
    }
  ];


  const insights = [
    {
      id: 1,
      title: 'AP MSME Export Convention 2025 – Vizag',
      description: 'Andhra Pradesh government\'s flagship MSME export event bringing together international buyers and local exporters to accelerate global trade for MSMEs.',
      date: 'Nov 9-10, 2025',
      duration: '2 Days',
      audience: 'MSME Exporters',
      priority: 'High',
      link: 'https://www.newindianexpress.com/states/andhra-pradesh/2025/Nov/07/vizag-set-to-be-epicentre-for-global-msme-trade-834567.html',
      keyPoints: [
        '34 global buyers from 16 countries attending: Russia, UK, Egypt, Ghana etc.',
        'Focus sectors: auto components, electronics, textiles, pharma.',
        'Export-ready MSMEs (registered under Udyam) will be shortlisted for B2B meetings.',
        'Part of the state\'s "Swarna Andhra 2047" and "One Family One Entrepreneur" vision.'
      ],
      actionItems: [
        'Register your MSME export unit for the convention before deadline.',
        'Update your business-profile/portfolio with export credentials & product catalogue.',
        'Prepare meeting slots with international buyers; identify target sectors.',
        'Review export-compliance/documentation readiness (SPS, packaging, shipping).'
      ]
    },
    {
      id: 2,
      title: 'AP MSME Digital Empowerment Challenge 2025',
      description: 'A challenge launched by the Andhra Pradesh government to empower MSMEs via digital tools and chances of major contracts—building export-readiness through digital transformation.',
      date: 'Oct 27, 2025',
      duration: 'Ongoing/Challenge Period',
      audience: 'MSMEs (Manufacturing & Services)',
      priority: 'Medium',
      link: 'https://ngobox.org/full_grant_announcement/Applications-Invited-for-the-Andhra-Pradesh-MSME-Digital-Empowerment-Challenge-2025-_13053',
      keyPoints: [
        'Opportunity to win govt. work orders worth ₹1 Crore+.',
        'Promotes adoption of digital tools, export-software, readiness for global markets.',
        'Focus on automating business-processes, preparing bankable DPRs for exports.',
        'Part of broader MSME ecosystem support by the state as export-enablement measure.'
      ],
      actionItems: [
        'Check eligibility for the challenge and apply with your digital-transformation plan.',
        'Identify digital tools you need (export-documentation, supply-chain, analytics).',
        'Align your export-goals (market target, products) with the challenge submission.',
        'Use this as input to enrich your placement dashboard\'s "tech-stack readiness" section.'
      ]
    },
    {
      id: 3,
      title: 'AP Export Promotion Portal Relaunch – APTPC',
      description: 'The state\'s export promotion body (Andhra Pradesh Trade Promotion Corporation) relaunched its portal to consolidate export-information, scheme access, and infrastructure mapping for exporters in Andhra Pradesh.',
      date: '2025 (Q2)',
      duration: 'Half Day (Launch Event)',
      audience: 'Exporters, Trade Bodies, MSMEs',
      priority: 'Low',
      link: 'https://www.apexports.ap.gov.in/',
      keyPoints: [
        'Portal covers state export-incentives, infrastructure, export hub mapping.',
        'Helps exporters access schemes, buyer-meet information and export-readiness tools.',
        'Data-driven export ecosystem support, usable for dashboards like yours.',
        'Improves visibility of Andhra Pradesh as an export-hub state.'
      ],
      actionItems: [
        'Visit the portal and download latest export-scheme documents & data sets.',
        'Link the portal\'s data feeds to your dashboard (trending tech stacks, export hubs).',
        'Update your database of export-units/clusters in Andhra Pradesh using this portal.',
        'Use portal links and data to showcase AP\'s export-ecosystem in your Placement Intelligence project.'
      ]
    },
    {
      id: 4,
      title: 'Australia Approves Unpeeled Indian Prawns from AP – Export Market Diversification',
      description: 'After an eight-year ban, Australia has approved the import of unpeeled prawns from Andhra Pradesh, opening a new high-value export market for its marine sector.',
      date: 'Oct 22, 2025',
      duration: 'Half Day (Approval Announcement)',
      audience: 'Marine & Seafood Exporters',
      priority: 'High',
      link: 'https://economictimes.indiatimes.com/news/india/after-8-year-freeze-andhras-prawns-return-to-australia/articleshow/124728593.cms',
      keyPoints: [
        'Australia grants first import-approval for unpeeled Indian prawns from AP.',
        'Opportunity to diversify export markets beyond traditional destinations.',
        'Requires exporters to meet SPS (sanitary & phytosanitary) norms for Australia.',
        'Strengthens Andhra Pradesh\'s position in marine exports and global seafood trade.'
      ],
      actionItems: [
        'Verify your marine/export unit meets Australia\'s SPS requirements and certification.',
        'Map alternate export-markets and opportunities created by this new market access.',
        'Update your business profile & product catalogue to include Australia as target.',
        'Reflect this market-access update in your dashboard\'s "industry export insights by year" module.'
      ]
    }
  ];

  // Schemes Data
  const schemes = [
    { id: 1, name: 'AP Export Promotion Policy (APEX) 2022-27', description: 'State export promotion policy with incentives, export hub development, market linkage support to increase AP exports.', link: 'https://www.apindustries.gov.in/APIndus/Data/policies/9.-AP-Export-Promotion-Policy-2022-27.pdf' },
    { id: 2, name: 'AP Industrial Development Policy (4.0) 2024-29', description: 'Comprehensive industrial policy offering fiscal incentives, land & infrastructure support for manufacturing and export-oriented units.', link: 'https://www.apexports.ap.gov.in/assets/gallery/AP%20Industrial%20Development%20Policy%20%284.0%29%202024-29.pdf' },
    { id: 3, name: 'AP MSME & Entrepreneurship Development Policy 4.0 (2024-29)', description: 'State MSME policy — subsidies, cluster development, flatted factories, credit facilitation and entrepreneurship promotion (One Family One Entrepreneur).', link: 'https://apmsmeone.ap.gov.in/Public/AboutAPMSMEONE.aspx' },
    { id: 4, name: 'Trade Infrastructure for Export Schemes (TIES) – AP implementation', description: 'State implementation/support for trade export infrastructure (common facilities, testing, logistics) to help MSME exporters.', link: 'https://apmsmeone.ap.gov.in/MSMEONE/Public/Schemes.aspx?ID=MCI8' },
    { id: 5, name: 'AP Retail Parks Policy (Draft) 2021-26', description: 'Promotion of retail parks to strengthen supply-chains and market access for MSME producers and entrepreneurs.', link: 'https://www.apexports.ap.gov.in/assets/gallery/retail-policy.pdf' },
    { id: 6, name: 'AP Private Industrial Parks Policy (4.0) 2024-29', description: 'Framework to establish private industrial parks with plug-and-play infrastructure and incentives for investors & MSMEs.', link: 'https://www.apexports.ap.gov.in/assets/gallery/AP%20Private%20Industrial%20%20Parks%20Policy%20%284.0%29-%202024-29.pdf' },
    { id: 7, name: 'Flatted Factory & MSME Park Programme – AP (FFCs)', description: 'State programme to build flatted factories/walk-to-work clusters (affordable plug-and-play units for MSMEs).', link: 'https://apiic.in/wp-content/uploads/2024/12/GOMS-NO-68.pdf' },
    { id: 8, name: 'District Industrial & Export Promotion Committee (DIEPC) Orders', description: 'District-level institutional mechanism for export promotion and approvals to handhold exporters at district level.', link: 'https://www.apexports.ap.gov.in/assets/gallery/DIEPC.pdf' },
    { id: 9, name: 'State Export Promotion Committee (SEPC)', description: 'State committee to co-ordinate between State and Central government for export promotion activities and schemes.', link: 'https://www.apexports.ap.gov.in/assets/gallery/SEPC.pdf' },
    { id: 10, name: 'AP Renewable Energy Export Policy 2020-25', description: 'Policy to promote renewable energy generation for export and interstate sale, useful for energy-intensive exporters and green manufacturing.', link: 'https://nredcap.in/pdfs/pages/ap_re_export_policy_2020.pdf' },
    { id: 11, name: 'AP Logistics Policy 2022-27', description: 'State logistics & multimodal policy to reduce logistics cost, important for exporters and supply-chain competitiveness.', link: 'https://apmsmeone.ap.gov.in/MSMEONE/Public/Policies.aspx' },
    { id: 12, name: 'AP Food Processing & Agri-Export Promotion (state initiatives/PMFME links)', description: 'State support for food processing clusters, cold-chain, and PMFME implementation to promote agro-exports.', link: 'https://apmsmeone.ap.gov.in/MSMEONE/Public/Schemes.aspx?ID=PMFME' },
    { id: 13, name: 'AP Textile, Apparel & Garments Policy 4.0', description: 'Sector policy to support textile & garment units — incentives for manufacturing, skill development and export promotion.', link: 'https://apedb.ap.gov.in/documents/AP%20Textile%2C%20Apparel%20%26%20Garments%20Policy.pdf' },
    { id: 14, name: 'AP Electronics Manufacturing Policy 4.0', description: 'Sector-specific incentives for electronics manufacturing, component suppliers and exports of electronic goods.', link: 'https://apiic.in/wp-content/uploads/2024/12/Andhra-Pradesh-Electronics-Manufacturing-policy-4.0-2024-29.pdf' },
    { id: 15, name: 'AP Aerospace & Defence Policy (4.0)', description: 'Policy to promote aerospace & defence manufacturing clusters and associated export-capable suppliers.', link: 'https://apmsmeone.ap.gov.in/MSMEONE/Public/Policies.aspx' },
    { id: 16, name: 'AP MSME Parks — Krishnapuram & other constituency parks', description: 'State program to set up MSME parks across constituencies with plots, common infra and priority allotments for MSMEs.', link: 'https://timesofindia.indiatimes.com/city/vijayawada/foundation-laid-for-msme-park-in-krishnapuram/articleshow/120971945.cms' },
    { id: 17, name: 'AP Export Hub / District Export Hubs', description: 'District-level export hub model: common testing, export facilitation, one-stop handholding for exporters and cluster firms.', link: 'https://www.apexports.ap.gov.in/assets/files/AP%20Exports%20Brochure.pdf' },
    { id: 18, name: 'Quality Certification Support (State top-up for ZED/BIS/HACCP etc.)', description: 'State-provided top-up subsidies and facilitation to obtain quality certifications, improving export-market acceptability.', link: 'https://www.apexports.ap.gov.in/' },
    { id: 19, name: 'Marketing & Trade Fair Support (State sponsored)', description: 'State assistance/subsidy for participation in international fairs, buyer-seller meets and trade missions for AP exporters.', link: 'https://apmsmeone.ap.gov.in/MSMEONE/Public/AboutAPMSMEONE.aspx' },
    { id: 20, name: 'Interest Subvention & Credit Facilitation (State nodal handholding)', description: 'AP facilitation to access central interest-subvention programs, bank linkages and state schemes for export working capital.', link: 'https://apmsmeone.ap.gov.in/' },
    { id: 21, name: 'AP One District One Product (ODOP) – export support', description: 'ODOP aligns district products to export channels, provides promotion and market linkages for selected district products.', link: 'https://eastgodavari.ap.gov.in/one-district-one-product1/' },
    { id: 22, name: 'AP MSME One Portal (Single Window for MSMEs)', description: 'APMSMEONE portal — single-window for schemes, approvals, incentives and scheme application trackers for MSMEs & exporters.', link: 'https://apmsmeone.ap.gov.in/' },
    { id: 23, name: 'AP Tourism Policy (export of services – tourism & hospitality)', description: 'Policy to grow tourism services export (hospitality, homestays, MICE) and related SME opportunities.', link: 'https://apmsmeone.ap.gov.in/MSMEONE/Public/Policies.aspx' },
    { id: 24, name: 'AP Retail & Marketplace Promotion (State e-market linkages)', description: 'Programs to onboard MSME producers / ODOP products to state-supported e-marketplaces and aggregator platforms for exports/overseas buyers.', link: 'https://www.apexports.ap.gov.in/' },
    { id: 25, name: 'AP Energy Efficiency & Green MSME Incentives (state measures)', description: 'State facilitation and coordination for energy efficiency grants and deployment of clean energy tech to reduce manufacturing costs.', link: 'https://nredcap.in/pdfs/pages/ap_re_export_policy_2020.pdf' },
    { id: 26, name: 'AP Industrial Infrastructure Upgradation (state GOs & APIIC projects)', description: 'State GOs to upgrade industrial estate infrastructure (roads, power, water) and common facilities enabling export readiness.', link: 'https://apiic.in/wp-content/uploads/2024/12/GOMS-NO-68.pdf' },
    { id: 27, name: 'AP Special Incentives for Export Oriented Units (EOUs)', description: 'State-level incentives (stamp duty reimbursement, land concessions, VAT/SGST assistance) for export-oriented manufacturing units.', link: 'https://www.apexports.ap.gov.in/' },
    { id: 28, name: 'AP Skill Development & Apprenticeship Linkages for Export Sectors', description: 'State skill programs and industry-academia tie-ups focused on export-relevant skills (textiles, food processing, electronics).', link: 'https://apmsmeone.ap.gov.in/' },
    { id: 29, name: 'AP MSME Cluster Development & MSECDP support', description: 'State support (and nodal implementation) for Cluster Development programme — common facilities, shared machinery for clusters.', link: 'https://apmsmeone.ap.gov.in/MSMEONE/Public/Schemes.aspx' },
    { id: 30, name: 'AP Food Park & Cold Chain Support (state implementation of central schemes)', description: 'State-level implementation support for cold chain, food parks, and export-oriented agri-processing units under central schemes.', link: 'https://apmsmeone.ap.gov.in/MSMEONE/Public/Schemes.aspx?ID=PMFME' },
    { id: 31, name: 'AP Ease of Doing Business / Single Window Clearance (industrial approvals)', description: 'State single-window for approvals, key to reduce time-to-market for exporters setting up units in AP.', link: 'https://apmsmeone.ap.gov.in/' },
    { id: 32, name: 'AP Tourism-linked Handicraft & Cottage Export Support', description: 'Support for handicraft clusters, artisans and cottage industry exports (marketing, fairs, certification and design inputs).', link: 'https://apmsmeone.ap.gov.in/' },
    { id: 33, name: 'AP Biomedical / Pharma Manufacturing Promotion (state initiatives)', description: 'State steps to attract pharma and medical devices manufacturing with incentives and export-cluster support.', link: 'https://www.apexports.ap.gov.in/' },
    { id: 34, name: 'AP Logistics Park & Multimodal Connectivity Projects', description: 'State projects to build logistics parks and improve port/road/rail connections for exporters in AP.', link: 'https://apmsmeone.ap.gov.in/MSMEONE/Public/Policies.aspx' },
    { id: 35, name: 'AP Research & Testing Labs support for exporters', description: 'State nodal support for setting up testing, calibration and export-compliance labs for food, textiles and industrial products.', link: 'https://apmsmeone.ap.gov.in/' },
    { id: 36, name: 'AP ESDM (Electronics System Design & Manufacturing) incentives', description: 'State incentives for ESDM suppliers and SMEs in electronics value chain to support exports of electronic goods/components.', link: 'https://apiic.in/' },
    { id: 37, name: 'AP Agro & Marine Exports Promotion initiatives', description: 'State schemes for marine product exporters, fisheries clusters, and value-addition facilitation for seafood exports.', link: 'https://apmsmeone.ap.gov.in/' },
    { id: 38, name: 'AP Start-up & Innovation Support (state funds & incubators)', description: 'State incubator funding, innovation hubs and startup support that can help export-ready tech/services scale globally.', link: 'https://apmsmeone.ap.gov.in/' },
    { id: 39, name: 'AP Clean Manufacturing & Sustainability Incentives', description: 'Incentives for sustainable manufacturing & circular-economy measures to meet global buyer ESG requirements for exports.', link: 'https://apmsmeone.ap.gov.in/' },
    { id: 40, name: 'AP Special Economic Zones (SEZ) & Export-Oriented Zones facilitation', description: 'AP facilitation and policy support for SEZs and export-oriented zones and units within the state.', link: 'https://apexports.ap.gov.in/' },
    { id: 101, name: 'EPCG (Export Promotion Capital Goods) Scheme', description: 'Allows import of capital goods at zero/low duty for producing export goods, improving manufacturing/export capacity.', link: 'https://content.dgft.gov.in/Website/EPS.pdf' },
    { id: 102, name: 'RoDTEP (Remission of Duties & Taxes on Exported Products)', description: 'Refunds embedded central/state duties/taxes to exporters to improve competitiveness.', link: 'https://content.dgft.gov.in/Website/RoDTEP.pdf' },
    { id: 103, name: 'Advance Authorisation Scheme (DGFT)', description: 'Duty-free import of inputs required to produce export products, subject to export obligations.', link: 'https://dgft.gov.in/' },
    { id: 104, name: 'DFIA (Duty Free Import Authorisation) – legacy scheme references', description: 'Legacy scheme for duty-free imports against exports — historically important (replaced by other schemes in many cases).', link: 'https://dgft.gov.in/' },
    { id: 105, name: 'SEIS/MEIS (legacy) – export incentives (historical)', description: 'Earlier export incentive schemes (SEIS/MEIS) — useful to understand historic incentives & transitions to RoDTEP.', link: 'https://content.dgft.gov.in/Website/EPS.pdf' },
    { id: 106, name: 'PMEGP (Prime Minister’s Employment Generation Programme)', description: 'Credit-linked subsidy program to promote micro & small enterprises and self-employment across India.', link: 'https://www.msme.gov.in/' },
    { id: 107, name: 'CGTMSE (Credit Guarantee Fund Trust for Micro & Small Enterprises)', description: 'Provides credit guarantee to collateral-free loans to MSMEs to improve access to bank finance.', link: 'https://www.cgtmse.in/' },
    { id: 108, name: 'PMFME (PM Formalisation of Micro Food Processing Enterprises)', description: 'Central scheme for micro food processing units: credit-linked grants, branding, capacity building and market linkages.', link: 'https://apmsmeone.ap.gov.in/MSMEONE/Public/Schemes.aspx?ID=PMFME' },
    { id: 109, name: 'MSE-CDP (Micro & Small Enterprises Cluster Development Programme)', description: 'Cluster development support — CFCs (common facility centres), training and market linkages to raise cluster export potential.', link: 'https://my.msme.gov.in/' },
    { id: 110, name: 'RAMP (Raising and Accelerating MSME Performance)', description: 'Program to strengthen MSME competitiveness, technology adoption, and market access including exports.', link: 'https://dcmsme.gov.in/' },
    { id: 111, name: 'ZED (Zero Defect Zero Effect) Certification', description: 'Supports MSMEs to adopt quality manufacturing practices for global market suitability.', link: 'https://www.makeinindia.com/schemes-msmes' },
    { id: 112, name: 'CLCSS (Credit Linked Capital Subsidy Scheme) for Technology Upgradation', description: 'Capital subsidy to MSMEs for purchase of approved machinery & technology to upgrade production.', link: 'https://msme.gov.in/' },
    { id: 113, name: 'International Cooperation Scheme (ICS) / Capacity building for exporters', description: 'Supports exposure visits, buyer-seller meets and capacity building for first-time exporters.', link: 'https://dcmsme.gov.in/' },
    { id: 114, name: 'Market Development Assistance (MDA) / MPDA', description: 'Assistance to MSME exporters to participate in global fairs, buyer-seller meets and branding activities.', link: 'https://msme.gov.in/' },
    { id: 115, name: 'PCRS (Performance & Credit Rating Scheme)', description: 'Subsidy support for MSMEs obtaining credit rating to improve access to finance.', link: 'https://msme.gov.in/' },
    { id: 116, name: 'ASPIRE (A Scheme for Promoting Innovation, Rural Industry and Entrepreneurship)', description: 'Support for incubation, innovation and rural entrepreneurship in MSME ecosystem.', link: 'https://nimsme.gov.in/' },
    { id: 117, name: 'PM Vishwakarma Kaushal Samman (PMVKSY)', description: 'Support to traditional artisans and craftspeople with toolkits, training and market development.', link: 'https://pmvishwakarma.gov.in/' },
    { id: 118, name: 'Mudra Yojana (PMMY)', description: 'Micro credit for non-farm small enterprises with Shishu/Kishore/Tarun categories.', link: 'https://www.mudra.org.in/' },
    { id: 119, name: 'DGFT Export Promotion Schemes compendium (DGFT/EPS)', description: 'DGFT listing of export incentive schemes, notifications and trade facilitation measures for exporters.', link: 'https://content.dgft.gov.in/Website/EPS.pdf' },
    { id: 120, name: 'RoSCTL / RoSLT (Textiles & garments schemes – legacy/sectoral)', description: 'Schemes that supported apparel/textile exporters (sectoral legacy programmes replaced/upgraded over time).', link: 'https://dgft.gov.in/' },
    { id: 121, name: 'Sagarmala (ports & logistics facilitation)', description: 'National program to modernize ports, enhance connectivity and reduce logistics cost for exporters.', link: 'https://sagarmala.gov.in/' },
    { id: 122, name: 'Operation Greens / Agri export promotion initiatives', description: 'Central programs to stabilize prices and create value-chain support for selected agri crops and processed exports.', link: 'https://agricoop.nic.in/' },
    { id: 123, name: 'Interest Subvention Schemes (central/state linked for exports)', description: 'Central interest-subvention programs for export credit or working capital to reduce finance costs for exporters.', link: 'https://msme.gov.in/' },
    { id: 124, name: 'Technology Centre Systems Programme (TCSP) and Technology Centres', description: 'Network of technology centres, incubation and testing facilities to support manufacturing and exports.', link: 'https://msme.gov.in/' },
    { id: 125, name: 'Credit Linked Subsidy for MSME Export Marketing', description: 'Central support mechanisms for marketing & branding subsidies to MSME exporters (various schemes/MPDA).', link: 'https://msme.gov.in/' },
    { id: 126, name: 'National Logistics Policy & EDI / Port facilitation', description: 'Policies to streamline logistics and trade documentation for exporters across India.', link: 'https://dpiit.gov.in/national-logistics-policy' },
    { id: 127, name: 'Support for trade remedial measures & export promotion via DGFT', description: 'DGFT support for trade remedies, export controls, and notified schemes for specific commodities.', link: 'https://dgft.gov.in/' },
    { id: 128, name: 'National Export Insurance Account (NExport / ECGC related support)', description: 'Insurance and credit risk mitigation tools for exporters (ECGC services and government-backed instruments).', link: 'https://www.ecgc.in/' },
    { id: 129, name: 'Standards & Quality Infrastructure (BIS / NABL support programs)', description: 'Central programs for standards, certification, lab accreditation which exporters need to access overseas markets.', link: 'https://bis.gov.in/' },
    { id: 130, name: 'Scheme for Promotion of MSME Clusters – SPMC', description: 'Central support to build competitiveness and export-readiness of MSME clusters.', link: 'https://msme.gov.in/' },
    { id: 131, name: 'Skill India / PMKVY / Apprenticeship schemes for export sectors', description: 'Skill development programs supporting workforce readiness for export sectors (textiles, food processing, electronics).', link: 'https://www.skillindia.gov.in/' },
    { id: 132, name: 'Incubation & Seed Support (central funds & grants)', description: 'Central grant support for incubators and startups that can scale exportable products & SaaS services.', link: 'https://www.startupindia.gov.in/' },
    { id: 133, name: 'Trade Infrastructure for Export Scheme (TIES) – Central component', description: 'Central scheme to create trade infrastructure (common user facilities, labs, logistics hubs) to support exporters.', link: 'https://apmsmeone.ap.gov.in/MSMEONE/Public/Schemes.aspx?ID=MCI8' },
    { id: 134, name: 'Aid to Exporters (DGFT export promotion incentives & scrips)', description: 'DGFT instruments & scrips supporting exports and duty credit mechanisms for exporting units.', link: 'https://dgft.gov.in/' },
    { id: 135, name: 'Interest Equalisation Scheme on Pre & Post Shipment Rupee Export Credit (legacy/sectoral)', description: 'Interest equalization support for exporters in specified sectors (subject to notifications).', link: 'https://dgft.gov.in/' },
    { id: 136, name: 'National Export Strategy & Market Access Programs', description: 'Central initiatives to target markets, trade missions, and bilateral export promotion through MEA & commerce ministry.', link: 'https://commerce.gov.in/' },
    { id: 137, name: 'National Single Window System (facilitate approvals for exporters/investors)', description: 'Central single-window to ease approvals and compliances for exporters & investments across India.', link: 'https://www.nsws.gov.in/' },
    { id: 138, name: 'Support for Standards/Testing: NABL / BIS certification schemes', description: 'Accreditation & testing support from national bodies to meet export buyer requirements.', link: 'https://www.nabl-india.org/' },
    { id: 139, name: 'Financial Inclusion & MSME Finance programmes (PSB schemes, SIDBI)', description: 'SIDBI & partner bank schemes to provide dedicated MSME credit lines, refinance and export finance support.', link: 'https://sidbi.in/' },
    { id: 140, name: 'Central Govt. Cluster-specific initiatives (textiles, leather, gems & jewellery)', description: 'Sectoral cluster support programs for competitiveness & exports across textile, leather and gems sectors.', link: 'https://msme.gov.in/' }
  ];



  // Government Websites
  // Government Websites Data
  const stateGovtWebsites = [
    { name: 'AP Trade & Exports (AP Exports)', url: 'https://www.apexports.ap.gov.in/', icon: Globe, image: 'https://www.apexports.ap.gov.in/favicon.ico' },
    { name: 'AP Exports — Brochure & Policies (PDFs)', url: 'https://www.apexports.ap.gov.in/assets/files/AP%20Exports%20Brochure.pdf', icon: Globe, image: 'https://www.apexports.ap.gov.in/favicon.ico' },
    { name: 'AP MSME ONE (Single Window for MSMEs)', url: 'https://apmsmeone.ap.gov.in/', icon: Globe, image: 'https://apmsmeone.ap.gov.in/favicon.ico' },
    { name: 'APIIC — Andhra Pradesh Industrial Infrastructure', url: 'https://apiic.in/', icon: Globe, image: 'https://apiic.in/wp-content/uploads/2021/09/cropped-favicon-32x32.png' },
    { name: 'AP Industries / Investment (Dept. of Industries)', url: 'https://www.apindustries.gov.in/', icon: Globe, image: 'https://www.apindustries.gov.in/favicon.ico' },
    { name: 'AP Economic Development Board (APEDB)', url: 'https://apedb.ap.gov.in/', icon: Globe, image: 'https://apedb.ap.gov.in/favicon.ico' },
    { name: 'AP Logistics Policy (PDF)', url: 'https://www.apexports.ap.gov.in/assets/gallery/logistics-policy.pdf', icon: Globe, image: 'https://www.apexports.ap.gov.in/favicon.ico' },
    { name: 'AP Retail Parks Policy (Draft PDF)', url: 'https://www.nsws.gov.in/s3fs/2021-09/AP%20Retail%20Policy%20One%20Pager.pdf', icon: Globe },
    { name: 'AP One District One Product (ODOP) — state page / guidance', url: 'https://www.pmfmeap.org/content-page/one-district-one-product', icon: Globe },
    { name: 'AP Export Hub (DIEPC / DEAPs)', url: 'https://www.apexports.ap.gov.in/assets/gallery/DIEPC.pdf', icon: Globe, image: 'https://www.apexports.ap.gov.in/favicon.ico' },
    { name: 'APIIC Industrial Parks & Land Bank', url: 'https://apiic.in/industrial-parks/', icon: Globe, image: 'https://apiic.in/wp-content/uploads/2021/09/cropped-favicon-32x32.png' },
    { name: 'AP Food Processing / PMFME (state implementation)', url: 'https://apmsmeone.ap.gov.in/MSMEONE/Public/Schemes.aspx?ID=PMFME', icon: Globe, image: 'https://apmsmeone.ap.gov.in/favicon.ico' },
    { name: 'AP Skill Development & Apprenticeship (state links)', url: 'https://apmsmeone.ap.gov.in/', icon: Globe, image: 'https://apmsmeone.ap.gov.in/favicon.ico' },
    { name: 'AP Testing / Lab Support & Quality (state pages)', url: 'https://apmsmeone.ap.gov.in/', icon: Globe },
    { name: 'District Industries Centres (DIC) — sample district portal', url: 'https://tirupati.ap.gov.in/district-industries-centre/', icon: Globe },
    { name: 'AP Investment & Notifications (APIIC / APEDB news)', url: 'https://apiic.in/', icon: Globe, image: 'https://apiic.in/wp-content/uploads/2021/09/cropped-favicon-32x32.png' },
    { name: 'AP Ports & Maritime / State trade pages', url: 'https://www.apexports.ap.gov.in/', icon: Globe, image: 'https://www.apexports.ap.gov.in/favicon.ico' },
    { name: 'AP Single Window / Ease of Doing Business (APMSMEONE)', url: 'https://apmsmeone.ap.gov.in/', icon: Globe, image: 'https://apmsmeone.ap.gov.in/favicon.ico' },
    { name: 'AP Export Promotion Policy (APEX) PDFs', url: 'https://www.apexports.ap.gov.in/assets/files/AP%20Exports%20Brochure.pdf', icon: Globe }
  ];

  const centralGovtWebsites = [
    { name: 'DGFT — Directorate General of Foreign Trade', url: 'https://dgft.gov.in/', icon: Globe, image: 'https://dgft.gov.in/themes/custom/dgft/images/favicon.ico' },
    { name: 'DGFT — Export Promotion Schemes (EPS PDF)', url: 'https://content.dgft.gov.in/Website/EPS.pdf', icon: Globe },
    { name: 'Ministry of Commerce & Industry', url: 'https://commerce.gov.in/', icon: Globe },
    { name: 'Ministry of MSME', url: 'https://www.msme.gov.in/', icon: Globe, image: 'https://www.msme.gov.in/themes/custom/msme/logo_favicon.ico' },
    { name: 'Make in India / ZED & MSME scheme references', url: 'https://www.makeinindia.com/schemes-msmes', icon: Globe },
    { name: 'CGTMSE — Credit Guarantee for MSMEs', url: 'https://www.cgtmse.in/', icon: Globe },
    { name: 'SIDBI — MSME refinance & schemes', url: 'https://sidbi.in/', icon: Globe },
    { name: 'ECGC — Export Credit & Insurance', url: 'https://www.ecgc.in/', icon: Globe },
    { name: 'CBIC — Central Board of Indirect Taxes & Customs', url: 'https://www.cbic.gov.in/', icon: Globe },
    { name: 'ICEGATE — Customs e-filing & declarations', url: 'https://www.icegate.gov.in/', icon: Globe },
    { name: 'NABL — Lab accreditation (testing & labs)', url: 'https://www.nabl-india.org/', icon: Globe },
    { name: 'BIS — Standards & Certification', url: 'https://bis.gov.in/', icon: Globe },
    { name: 'Sagarmala — ports & logistics program', url: 'https://sagarmala.gov.in/', icon: Globe },
    { name: 'National Single Window System (NSWS)', url: 'https://www.nsws.gov.in/', icon: Globe },
    { name: 'PMFME / Food Processing (central info)', url: 'https://my.msme.gov.in/', icon: Globe },
    { name: 'RAMP / DCMSME — MSME performance program', url: 'https://dcmsme.gov.in/', icon: Globe },
    { name: 'PM Vishwakarma Kaushal Samman (artisans)', url: 'https://pmvishwakarma.gov.in/', icon: Globe },
    { name: 'Pradhan Mantri Mudra Yojana (PMMY)', url: 'https://www.mudra.org.in/', icon: Globe },
    { name: 'Startup India (incubation & funding)', url: 'https://www.startupindia.gov.in/', icon: Globe },
    { name: 'Export Inspection Council (EIC) / labs', url: 'https://www.eicindia.gov.in/', icon: Globe }
  ];

  useEffect(() => {
    const storedScore = eriStorageService.getScore();
    if (storedScore !== null) {
      setReadinessScore(storedScore);
    } else {
      const interval = setInterval(() => {
        setReadinessScore(prev => (prev < 45 ? prev + 1 : 45));
      }, 20);
      return () => clearInterval(interval);
    }
  }, []);

  // Auto-rotate news carousel
  useEffect(() => {
    if (activePersonalizedTab === 'news') {
      const interval = setInterval(() => {
        setCurrentNewsIndex((prev) =>
          prev === personalizedNews.length - 1 ? 0 : prev + 1
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [activePersonalizedTab, personalizedNews.length]);

  const formatCurrency = (amount) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`; // Crore
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;      // Lakh
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;           // Thousand
    return `₹${amount}`;
  };

  const nextNews = () => {
    setCurrentNewsIndex((prev) =>
      prev === personalizedNews.length - 1 ? 0 : prev + 1
    );
  };

  const prevNews = () => {
    setCurrentNewsIndex((prev) =>
      prev === 0 ? personalizedNews.length - 1 : prev - 1
    );
  };

  const goToNews = (index) => {
    setCurrentNewsIndex(index);
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

      {/* Notifications Popup */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowNotifications(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-2xl p-6 max-w-md w-full max-h-96 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Notifications</h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border ${notification.read ? 'border-gray-600 bg-gray-700' : 'border-manu-green bg-green-900/20'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-white text-sm">
                          {notification.title}
                        </h4>
                        <p className="text-gray-300 text-xs mt-1">
                          {notification.message}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-manu-green rounded-full"></div>
                      )}
                    </div>
                    <div className="text-gray-400 text-xs mt-2">
                      {notification.time}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="pt-16 min-h-screen">
        {/* Content Header */}
        <div className="bg-gray-800 border-b border-gray-700 px-4 lg:px-6 py-6">
          <div className="max-w-7xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl lg:text-6xl font-bold text-white mb-4"
              style={{
                background: 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Analytics Dashboard
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg lg:text-xl text-gray-400"
            >
              Track your export performance with real-time insights and opportunities
            </motion.p>
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
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3">
                  {[
                    { icon: FileCheck, label: 'Generate Invoice', action: () => navigate('/smart-generate') },
                    { icon: Calculator, label: 'Calculate Duty', action: () => navigate('/duty-calculator') },

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

            {/* Recent Documents + Export Trends */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6 mb-6">
              {/* Recent Documents - Scrollable */}
              <div className="bg-gray-800 rounded-2xl p-4 lg:p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">Recent Documents</h3>
                  <button className="text-sm text-manu-green hover:text-green-400 font-medium">
                    View All →
                  </button>
                </div>

                <div className="space-y-2 lg:space-y-3 max-h-80 overflow-y-auto pr-2">
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

              {/* Export Trends Panel - Scrollable */}
              <div className="bg-gray-800 rounded-2xl p-4 lg:p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <TrendingUp size={20} className="text-blue-400" />
                    Export Trends
                  </h3>
                </div>

                <div className="space-y-3 lg:space-y-4 max-h-80 overflow-y-auto pr-2">
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

                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Personalized Panel */}
            <div className="bg-gray-800 rounded-2xl p-4 lg:p-6 border border-gray-700 mb-6">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                Personalized Insights
              </h3>

              {/* Tab Navigation - Only news, markets, insights */}
              <div className="flex justify-center mb-6">
                <div className="bg-gray-700 rounded-xl p-1 flex">
                  {['news', 'markets', 'insights'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActivePersonalizedTab(tab)}
                      className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activePersonalizedTab === tab
                        ? 'bg-manu-green text-white'
                        : 'text-gray-400 hover:text-white'
                        }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="min-h-64">
                {activePersonalizedTab === 'news' && (
                  <div className="relative">
                    {/* News Carousel */}
                    <div className="relative bg-gray-900 rounded-xl overflow-hidden">
                      {/* Carousel Container */}
                      <div className="relative h-96 lg:h-[500px]">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={currentNewsIndex}
                            initial={{ opacity: 0, x: 300 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -300 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0"
                          >
                            {/* Full Image Background with Clickable Overlay */}
                            <div
                              className="relative w-full h-full cursor-pointer"
                              onClick={() => window.open(personalizedNews[currentNewsIndex].link, '_blank')}
                            >
                              {/* Background Image */}
                              <img
                                src={personalizedNews[currentNewsIndex].image}
                                alt={personalizedNews[currentNewsIndex].title}
                                className="w-full h-full object-cover"
                              />

                              {/* Gradient Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                              {/* News Content Overlay */}
                              <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 text-white">
                                <div className="max-w-4xl mx-auto">
                                  {/* Source and Date */}
                                  <div className="flex items-center gap-4 text-sm text-white/80 mb-3">
                                    <span>{personalizedNews[currentNewsIndex].source}</span>
                                    <span>•</span>
                                    <span>{personalizedNews[currentNewsIndex].date}</span>
                                  </div>

                                  {/* News Title */}
                                  <h3 className="text-2xl lg:text-4xl font-bold mb-4 leading-tight">
                                    {personalizedNews[currentNewsIndex].title}
                                  </h3>

                                  {/* News Excerpt */}
                                  <p className="text-lg lg:text-xl text-white/90 mb-6 leading-relaxed max-w-3xl">
                                    {personalizedNews[currentNewsIndex].excerpt}
                                  </p>

                                  {/* Read More Button */}
                                  <button className="bg-manu-green text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-600 transition-colors flex items-center gap-2 group">
                                    Read Full Story
                                    <ExternalLink size={20} className="group-hover:translate-x-1 transition-transform" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </AnimatePresence>
                      </div>

                      {/* Navigation Arrows */}
                      <button
                        onClick={prevNews}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-sm"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        onClick={nextNews}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-sm"
                      >
                        <ChevronRight size={24} />
                      </button>

                      {/* Current Position Indicator */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-white text-sm bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                        {currentNewsIndex + 1} / {personalizedNews.length}
                      </div>
                    </div>

                    {/* Additional News Thumbnails */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                      {personalizedNews.map((news, index) => (
                        <div
                          key={news.id}
                          className={`relative group cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${index === currentNewsIndex
                            ? 'border-manu-green ring-2 ring-manu-green/20'
                            : 'border-gray-600 hover:border-manu-green/60'
                            }`}
                          onClick={() => goToNews(index)}
                        >
                          {/* Thumbnail Image */}
                          <div className="aspect-video relative">
                            <img
                              src={news.image}
                              alt={news.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>

                            {/* Thumbnail Title */}
                            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                              <h4 className="font-semibold text-white text-sm line-clamp-2">
                                {news.title}
                              </h4>
                              <div className="text-gray-300 text-xs mt-1">
                                {news.date}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activePersonalizedTab === 'markets' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {marketOpportunities.map((market, index) => (
                      <motion.div
                        key={market.country}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-700 rounded-xl p-4 border border-gray-600 hover:border-orange-500 transition-colors cursor-pointer text-center"
                      >
                        {/* Fixed image container */}
                        <div className="relative h-32 mb-3 bg-gray-600 rounded-lg overflow-hidden">
                          <img
                            src={market.image}
                            alt={market.country}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <h4 className="font-semibold text-white text-sm mb-2">
                          {market.country}
                        </h4>
                        <p className="text-gray-400 text-xs mb-3 leading-relaxed">
                          {market.description}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded-full ${market.potential === 'High'
                          ? 'bg-green-900/50 text-green-400'
                          : 'bg-yellow-900/50 text-yellow-400'
                          }`}>
                          {market.potential} Potential
                        </span>
                      </motion.div>
                    ))}
                  </div>
                )}

                {activePersonalizedTab === 'insights' && (
                  <div className="space-y-6">
                    {/* Main Featured Insight */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-2xl p-6 border border-blue-500/30 hover:border-blue-400 transition-colors cursor-pointer"
                      onClick={() => window.open(insights[0].link, '_blank')}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Zap size={20} className="text-blue-400" />
                        <span className="text-blue-400 text-sm font-semibold">FEATURED INSIGHT</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">
                        {insights[0].title}
                      </h3>
                      <p className="text-gray-300 text-sm leading-relaxed mb-4">
                        {insights[0].description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span>📅 {insights[0].date}</span>
                          <span>⏱️ {insights[0].duration}</span>
                          <span>👥 {insights[0].audience}</span>
                        </div>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                          Learn More
                          <ExternalLink size={16} />
                        </button>
                      </div>
                    </motion.div>

                    {/* Insights Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {insights.slice(1).map((insight, index) => (
                        <motion.div
                          key={insight.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: (index + 1) * 0.1 }}
                          className="bg-gray-700 rounded-xl p-5 border border-gray-600 hover:border-green-500 transition-colors cursor-pointer group"
                          onClick={() => window.open(insight.link, '_blank')}
                        >
                          {/* Insight Header */}
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-bold text-white text-lg mb-2 group-hover:text-green-400 transition-colors">
                                {insight.title}
                              </h4>
                              <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                                <span className="flex items-center gap-1">
                                  <Clock size={12} />
                                  {insight.duration}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users size={12} />
                                  {insight.audience}
                                </span>
                              </div>
                            </div>
                            <div className={`px-2 py-1 rounded-full text-xs font-semibold ${insight.priority === 'High'
                              ? 'bg-red-900/50 text-red-400'
                              : insight.priority === 'Medium'
                                ? 'bg-yellow-900/50 text-yellow-400'
                                : 'bg-blue-900/50 text-blue-400'
                              }`}>
                              {insight.priority}
                            </div>
                          </div>

                          {/* Insight Description */}
                          <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                            {insight.description}
                          </p>

                          {/* Key Points */}
                          {insight.keyPoints && (
                            <div className="mb-4">
                              <h5 className="text-white text-sm font-semibold mb-2 flex items-center gap-2">
                                <Target size={14} />
                                Key Highlights:
                              </h5>
                              <ul className="text-gray-400 text-sm space-y-1">
                                {insight.keyPoints.map((point, pointIndex) => (
                                  <li key={pointIndex} className="flex items-start gap-2">
                                    <span className="text-green-400 mt-1">•</span>
                                    <span>{point}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Action Items */}
                          {insight.actionItems && (
                            <div className="mb-4">
                              <h5 className="text-white text-sm font-semibold mb-2 flex items-center gap-2">
                                <CheckCircle size={14} />
                                Recommended Actions:
                              </h5>
                              <ul className="text-gray-400 text-sm space-y-1">
                                {insight.actionItems.map((action, actionIndex) => (
                                  <li key={actionIndex} className="flex items-start gap-2">
                                    <span className="text-blue-400 mt-1">→</span>
                                    <span>{action}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Footer */}
                          <div className="flex items-center justify-between pt-3 border-t border-gray-600">
                            <div className="text-xs text-gray-500">
                              📅 {insight.date}
                            </div>
                            <button className="text-green-400 text-sm font-medium hover:text-green-300 transition-colors flex items-center gap-1 group">
                              View Details
                              <ExternalLink size={14} className="group-hover:translate-x-0.5 transition-transform" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Quick Tips Section */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-gray-700 rounded-2xl p-6 border border-yellow-500/30"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <Sparkles size={20} className="text-yellow-400" />
                        <h3 className="text-lg font-bold text-white">Quick Export Tips</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                          {
                            icon: '📋',
                            title: 'Document Checklist',
                            tip: 'Always verify HS codes and certificate requirements before shipping'
                          },
                          {
                            icon: '💸',
                            title: 'Cost Optimization',
                            tip: 'Use RoDTEP scheme to claim duty refunds on exported goods'
                          },
                          {
                            icon: '🌍',
                            title: 'Market Research',
                            tip: 'Check import regulations of target countries for your products'
                          },
                          {
                            icon: '⚡',
                            title: 'Digital Tools',
                            tip: 'Utilize DGFT portal for faster document processing and tracking'
                          }
                        ].map((tip, index) => (
                          <div key={index} className="text-center p-4 bg-gray-600 rounded-lg hover:bg-gray-500 transition-colors">
                            <div className="text-2xl mb-2">{tip.icon}</div>
                            <h4 className="font-semibold text-white text-sm mb-2">{tip.title}</h4>
                            <p className="text-gray-300 text-xs">{tip.tip}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                )}
              </div>
            </div>

            {/* Separate Schemes Panel */}
            <div className="bg-gray-800 rounded-2xl p-4 lg:p-6 border border-gray-700 mb-6">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                Government Export Schemes
              </h3>

              <div className="space-y-3 max-w-4xl mx-auto">
                {schemes.map((scheme, index) => (
                  <motion.div
                    key={scheme.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-700 rounded-lg p-4 border border-gray-600 hover:border-manu-green hover:bg-gray-650 transition-all cursor-pointer group"
                    onClick={() => window.open(scheme.link, '_blank')}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-manu-green rounded-lg flex items-center justify-center group-hover:bg-green-600 transition-colors">
                          <Award size={20} className="text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-lg group-hover:text-manu-green transition-colors">
                            {scheme.name}
                          </h4>
                          <p className="text-gray-300 text-sm">
                            {scheme.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm group-hover:text-manu-green transition-colors">
                          Learn More
                        </span>
                        <ExternalLink size={16} className="text-gray-400 group-hover:text-manu-green transition-colors group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quick Info Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl p-4 border border-purple-500/30 mt-6"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={16} className="text-purple-400" />
                  <h5 className="text-white font-semibold text-sm">Scheme Benefits & Latest Terms</h5>
                </div>

                {/* Top highlights (updated with modern terms) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs mb-4">
                  <div className="flex flex-col gap-1 text-gray-300">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                      <span className="font-medium">Duty Exemptions & Refunds</span>
                    </div>
                    <div className="text-gray-400 text-[11px]">
                      Includes RoDTEP, duty-drawback references and legacy DFIA/EPCG considerations.
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 text-gray-300">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full" />
                      <span className="font-medium">Export Promotion & Market Access</span>
                    </div>
                    <div className="text-gray-400 text-[11px]">
                      Trade fairs, buyer-seller meets, digital B2B onboarding, RoSCTL & sectoral missions.
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 text-gray-300">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                      <span className="font-medium">Capital Goods & Tech Support</span>
                    </div>
                    <div className="text-gray-400 text-[11px]">
                      EPCG, CLCSS, ZED, TCSP and grants for technology & lab/incubation support.
                    </div>
                  </div>
                </div>


              </motion.div>

            </div>

            {/* Government Websites */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* State Government Websites */}
              <div className="bg-gray-800 rounded-2xl p-4 lg:p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4 text-center">
                  State Government Portals
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {stateGovtWebsites.map((website, index) => (
                    <motion.a
                      key={website.name}
                      href={website.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg border border-gray-600 hover:border-manu-green transition-colors group"
                    >
                      <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center overflow-hidden">
                        <img
                          src={website.image || `https://www.google.com/s2/favicons?sz=64&domain=${new URL(website.url).hostname}`}
                          alt={`${website.name} icon`}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const iconElement = e.target.nextSibling;
                            if (iconElement) iconElement.style.display = 'flex';
                          }}
                          className="w-6 h-6 object-contain"
                        />
                        <Globe
                          size={18}
                          className="text-gray-400 group-hover:text-manu-green hidden"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white text-sm line-clamp-2">
                          {website.name}
                        </h4>
                      </div>
                      <ExternalLink size={16} className="text-gray-400 group-hover:text-manu-green flex-shrink-0" />
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Central Government Websites */}
              <div className="bg-gray-800 rounded-2xl p-4 lg:p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4 text-center">
                  Central Government Portals
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {centralGovtWebsites.map((website, index) => (
                    <motion.a
                      key={website.name}
                      href={website.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg border border-gray-600 hover:border-blue-500 transition-colors group"
                    >
                      <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center overflow-hidden">
                        <img
                          src={website.image || `https://www.google.com/s2/favicons?sz=64&domain=${new URL(website.url).hostname}`}
                          alt={`${website.name} icon`}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const iconElement = e.target.nextSibling;
                            if (iconElement) iconElement.style.display = 'flex';
                          }}
                          className="w-6 h-6 object-contain"
                        />
                        <Globe
                          size={18}
                          className="text-gray-400 group-hover:text-blue-400 hidden"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white text-sm line-clamp-2">
                          {website.name}
                        </h4>
                      </div>
                      <ExternalLink size={16} className="text-gray-400 group-hover:text-blue-400 flex-shrink-0" />
                    </motion.a>
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