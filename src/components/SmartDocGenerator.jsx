import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, FileText, Download, Mail, Upload, ChevronRight, ChevronLeft, Home, Edit3, Send } from 'lucide-react';
import { lookupIEC } from '../utils/iecLookup';
import { getCertificatesByHSN } from '../utils/certificateHelper';
import { getCountryInfo } from '../utils/documentSelector';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as ReactDOM from 'react-dom/client';
import { createRoot } from 'react-dom/client';

// Import template components
import CommercialInvoice from './templates/CommercialInvoice';
import PackingList from './templates/PackingList';
import CertificateOfOrigin from './templates/CertificateOfOrigin';
import BillOfLading from './templates/BillOfLading';
import HealthCertificate from './templates/HealthCertificate';
import HalalCertificate from './templates/HalalCertificate';
import ISFFiling from './templates/ISFFiling';
import FDAPriorNotice from './templates/FDAPriorNotice';
import EUR1Certificate from './templates/EUR1Certificate';
import REXCertificate from './templates/REXCertificate';
import Header from './LandingPage/Header';

// Data for suggestions
const SUGGESTED_IEC = "demo";
const SUGGESTED_HSN = "09041100";

const INDIAN_PORTS = [
  "Nhava Sheva (JNPT), Mumbai",
  "Mundra Port, Gujarat",
  "Chennai Port, Tamil Nadu",
  "Kolkata Port, West Bengal",
  "Cochin Port, Kerala",
  "Visakhapatnam Port, Andhra Pradesh",
  "Kandla Port, Gujarat",
  "Mumbai Port, Maharashtra",
  "Tuticorin Port, Tamil Nadu",
  "Paradip Port, Odisha",
  "New Mangalore Port, Karnataka",
  "Mormugao Port, Goa"
];

const UAE_PORTS = [
  "Jebel Ali Port, Dubai",
  "Port Rashid, Dubai",
  "Khalifa Port, Abu Dhabi",
  "Port Zayed, Abu Dhabi",
  "Sharjah Port, Sharjah",
  "Fujairah Port, Fujairah"
];

const USA_PORTS = [
  "Port of Los Angeles, California",
  "Port of Long Beach, California",
  "Port of New York & New Jersey",
  "Port of Savannah, Georgia",
  "Port of Houston, Texas",
  "Port of Seattle, Washington",
  "Port of Oakland, California",
  "Port of Charleston, South Carolina"
];

const GERMANY_PORTS = [
  "Port of Hamburg",
  "Port of Bremerhaven",
  "Port of Wilhelmshaven",
  "Port of Rostock",
  "Port of Lübeck"
];

const DESIGNATIONS = [
  "Owner",
  "Manager",
  "Director",
  "Proprietor",
  "Export Manager",
  "Authorized Signatory"
];

const INDIAN_NAMES = [
  "Rajesh Kumar",
  "Priya Sharma",
  "Amit Patel",
  "Sneha Gupta",
  "Vikram Singh",
  "Anjali Mehta",
  "Sanjay Verma",
  "Pooja Reddy"
];

const INDIAN_CONTACTS = [
  "export@company.com | +91-9876543210",
  "sales@company.com | +91-9876543211",
  "info@company.com | +91-9876543212",
  "operations@company.com | +91-9876543213"
];

const BANK_DETAILS_SUGGESTIONS = [
  "Bank of India, Main Branch Mumbai\nAccount: 12345678901\nIFSC: BKID0000123\nSWIFT: BKIDINBBMUM",
  "State Bank of India, International Branch\nAccount: 98765432109\nIFSC: SBIN0000456\nSWIFT: SBININBB552",
  "HDFC Bank, Corporate Branch\nAccount: 45678901234\nIFSC: HDFC0000789\nSWIFT: HDFCINBB"
];

function ExtendedSmartDocGenerator({ user, onPageChange, onLogout, documentsUploaded = true }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [iecNumber, setIecNumber] = useState('');
  const [companyData, setCompanyData] = useState(null);
  const [hsnCode, setHsnCode] = useState('');
  const [certificates, setCertificates] = useState(null);
  const [destination, setDestination] = useState('');
  const [countryInfo, setCountryInfo] = useState(null);
  const [countryAnswers, setCountryAnswers] = useState({});
  const [buyerDetails, setBuyerDetails] = useState({
    name: '',
    address: '',
    email: '',
    phone: '',
    reference: ''
  });
  const [productDetails, setProductDetails] = useState({
    description: '',
    quantity: '',
    unit: 'KG',
    price: '',
    packaging: '',
    net_weight: '',
    gross_weight: '',
    measurements: ''
  });
  const [userInputs, setUserInputs] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [generatedDocuments, setGeneratedDocuments] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeDocIndex, setActiveDocIndex] = useState(0);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // All possible questions needed for documents
  const allDocumentQuestions = [
    // Commercial Invoice Fields
    { field: 'invoice_number', question: 'What is your commercial invoice number?', type: 'text', required: true },
    { field: 'invoice_date', question: 'What is the invoice date?', type: 'date', required: true },
    { field: 'buyer_reference', question: 'What is the buyer reference number?', type: 'text', required: false },
    { field: 'lc_number', question: 'What is the Letter of Credit number?', type: 'text', required: false },
    { field: 'insurance_policy', question: 'What is the Marine Cover Policy number?', type: 'text', required: false },

    // Packing List Fields
    { field: 'package_details', question: 'What are the package details (kind & number of packages)?', type: 'textarea', required: true },
    { field: 'net_weight_total', question: 'Total net weight (Kg)?', type: 'number', required: false },
    { field: 'gross_weight_total', question: 'Total gross weight (Kg)?', type: 'number', required: false },
    { field: 'measurements_total', question: 'Total measurements (m³)?', type: 'text', required: true },

    // Certificate of Origin Fields
    { field: 'origin_criteria', question: 'What is the origin criteria?', type: 'select', options: ['Wholly obtained', 'Sufficiently processed'], required: true },
    { field: 'tariff_code', question: 'What is the tariff code for the goods?', type: 'text', required: true },
    { field: 'marks_numbers', question: 'Marks & numbers on packages?', type: 'text', required: false },

    // Bill of Lading Fields
    { field: 'bill_of_lading_number', question: 'What is the Bill of Lading number?', type: 'text', required: true },
    { field: 'shippers_reference', question: 'Shipper\'s reference number?', type: 'text', required: false },
    { field: 'notify_party', question: 'Notify party details (if different from consignee)?', type: 'textarea', required: false },
    { field: 'freight_terms', question: 'Freight terms?', type: 'select', options: ['Prepaid', 'Collect'], required: true },
    { field: 'number_of_originals', question: 'Number of original Bills of Lading?', type: 'select', options: ['1', '2', '3', '4'], required: true },

    // Health Certificate Fields
    { field: 'health_certificate_number', question: 'Health certificate number?', type: 'text', required: false },
    { field: 'manufacturing_plant', question: 'Manufacturing plant address?', type: 'textarea', required: false },
    { field: 'product_batch_number', question: 'Product batch number?', type: 'text', required: false },
    { field: 'manufacturing_date', question: 'Manufacturing date?', type: 'date', required: false },
    { field: 'expiry_date', question: 'Expiry date?', type: 'date', required: false },

    // Halal Certificate Fields
    { field: 'halal_certificate_number', question: 'Halal certificate number?', type: 'text', required: false },
    { field: 'halal_supervisor', question: 'Halal supervisor name?', type: 'text', required: false },
    { field: 'inspection_date', question: 'Halal inspection date?', type: 'date', required: false },

    // ISF Filing Fields
    { field: 'importer_of_record', question: 'US Importer of Record details?', type: 'textarea', required: false },
    { field: 'manufacturer_supplier', question: 'Manufacturer/Supplier details?', type: 'textarea', required: false },
    { field: 'seller_owner', question: 'Seller/Owner details?', type: 'textarea', required: false },
    { field: 'consignee_number', question: 'Consignee number?', type: 'text', required: false },

    // Common Shipping Fields
    { field: 'vessel_flight_details', question: 'Vessel/Flight name and voyage number?', type: 'text', required: true },
    { field: 'port_of_loading', question: 'Port of loading?', type: 'text', required: true },
    { field: 'port_of_discharge', question: 'Port of discharge?', type: 'text', required: true },
    { field: 'final_destination', question: 'Final destination?', type: 'text', required: true },
    { field: 'departure_date', question: 'Departure date?', type: 'date', required: true },

    // Payment & Bank
    { field: 'incoterms', question: 'Incoterms?', type: 'select', options: ['EXW', 'FCA', 'FOB', 'CIF', 'CFR', 'DAP', 'DDP'], required: true },
    { field: 'payment_method', question: 'Payment method?', type: 'select', options: ['Letter of Credit', 'Bank Transfer', 'Cash'], required: true },
    { field: 'currency', question: 'Currency?', type: 'select', options: ['USD', 'EUR', 'INR', 'GBP'], required: true },
    { field: 'bank_details', question: 'Bank details for payment?', type: 'textarea', required: true },

    // Contact Information
    { field: 'exporter_contact_person', question: 'Exporter contact person name?', type: 'text', required: true },
    { field: 'exporter_contact_info', question: 'Exporter contact phone/email?', type: 'text', required: true },
    { field: 'authorized_signatory_name', question: 'Authorized signatory name?', type: 'text', required: true },
    { field: 'authorized_signatory_designation', question: 'Authorized signatory designation?', type: 'select', options: DESIGNATIONS, required: true }
  ];

  // Helper functions for suggestions
  const getSuggestedBuyerDetails = () => {
    const buyers = {
      UAE: [
        { name: "Al Maya Trading LLC", address: "P.O. Box 1234, Dubai, UAE", email: "purchase@almaya.ae", phone: "+971-4-1234567", reference: "AMT-PO-2024-001" },
        { name: "Lulu International Group", address: "P.O. Box 5678, Abu Dhabi, UAE", email: "imports@lulu.ae", phone: "+971-2-7654321", reference: "LUL-IMP-2024-002" }
      ],
      USA: [
        { name: "Global Imports Inc.", address: "123 Trade Street, New York, NY 10001, USA", email: "orders@globalimports.com", phone: "+1-212-555-7890", reference: "GI-PO-2024-US001" },
        { name: "American Trading Corp", address: "456 Commerce Ave, Los Angeles, CA 90001, USA", email: "purchasing@americantrading.com", phone: "+1-213-555-1234", reference: "ATC-IMP-2024-003" }
      ],
      Germany: [
        { name: "Euro Import GmbH", address: "Handelsstraße 123, 20457 Hamburg, Germany", email: "einkauf@euroimport.de", phone: "+49-40-12345678", reference: "EI-BEST-2024-004" },
        { name: "German Trade Partners", address: "Importallee 456, 10115 Berlin, Germany", email: "orders@gtp.de", phone: "+49-30-98765432", reference: "GTP-PO-2024-005" }
      ]
    };
    return buyers[destination] || [];
  };

  const getSuggestedProductDetails = () => {
    const products = {
      "09041100": [
        { description: "Red Chili Powder", quantity: "1000", unit: "KG", price: "5.00", packaging: "20 bags x 50 KG each", net_weight: "1000", gross_weight: "1020", measurements: "1.2 x 1.0 x 0.8 m" },
        { description: "Turmeric Powder", quantity: "500", unit: "KG", price: "8.50", packaging: "10 cartons x 50 KG each", net_weight: "500", gross_weight: "515", measurements: "1.0 x 0.8 x 0.6 m" }
      ],
      "52051100": [
        { description: "Cotton Yarn", quantity: "2000", unit: "KG", price: "3.20", packaging: "40 bales x 50 KG each", net_weight: "2000", gross_weight: "2040", measurements: "2.5 x 1.5 x 1.2 m" }
      ]
    };
    return products[hsnCode] || [];
  };

  // Generate smart suggestions based on context
  const generateSmartSuggestion = (field, currentValue) => {
    switch (field) {
      case 'invoice_number':
        return `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
      case 'invoice_date':
        return new Date().toISOString().split('T')[0];
      case 'buyer_reference':
        return `${buyerDetails.name.substring(0, 3).toUpperCase()}-PO-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 100)).padStart(2, '0')}`;
      case 'insurance_policy':
        return `MC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
      case 'package_details':
        if (productDetails.packaging) {
          return `${productDetails.packaging}, Total ${productDetails.quantity} ${productDetails.unit}`;
        }
        return `${Math.ceil(productDetails.quantity / 50)} bags x 50 KG each, Total ${productDetails.quantity} KG`;
      case 'net_weight_total':
        return productDetails.net_weight || Math.round(productDetails.quantity * 1).toString();
      case 'gross_weight_total':
        return productDetails.gross_weight || Math.round(productDetails.quantity * 1.02).toString();
      case 'measurements_total':
        if (productDetails.measurements) return productDetails.measurements;
        const packages = Math.ceil(productDetails.quantity / 50);
        const volume = (packages * 0.1).toFixed(1);
        return `${volume} m³ (${packages} packages)`;
      case 'tariff_code':
        return hsnCode;
      case 'marks_numbers':
        return `${buyerDetails.name.substring(0, 3).toUpperCase()}/${productDetails.description.substring(0, 3).toUpperCase()}/1-UP`;
      case 'bill_of_lading_number':
        return `MBL${new Date().getFullYear()}${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
      case 'shippers_reference':
        return `${companyData?.companyName?.substring(0, 3).toUpperCase() || 'EXP'}-SR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 100)).padStart(2, '0')}`;
      case 'notify_party':
        return `Same as consignee - ${buyerDetails.name}`;
      case 'health_certificate_number':
        return `HC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
      case 'manufacturing_plant':
        return companyData?.fullAddress || "Plot No. 123, Industrial Area, Mumbai, Maharashtra, India";
      case 'product_batch_number':
        return `BATCH-${new Date().getMonth() + 1}${new Date().getFullYear().toString().slice(-2)}-${String(Math.floor(Math.random() * 100)).padStart(2, '0')}`;
      case 'halal_certificate_number':
        return `HALAL-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
      case 'vessel_flight_details':
        return `MAERSK HONGFKONG V.234${Math.floor(Math.random() * 10)}`;
      case 'bank_details':
        return BANK_DETAILS_SUGGESTIONS[Math.floor(Math.random() * BANK_DETAILS_SUGGESTIONS.length)];
      case 'exporter_contact_person':
        return INDIAN_NAMES[Math.floor(Math.random() * INDIAN_NAMES.length)];
      case 'exporter_contact_info':
        return INDIAN_CONTACTS[Math.floor(Math.random() * INDIAN_CONTACTS.length)];
      default:
        return currentValue || '';
    }
  };

  // Helper function to get template component
  const getTemplateComponent = (templateId) => {
    const templateMap = {
      commercial_invoice: CommercialInvoice,
      packing_list: PackingList,
      certificate_of_origin: CertificateOfOrigin,
      bill_of_lading: BillOfLading,
      health_certificate: HealthCertificate,
      halal_certificate: HalalCertificate,
      isf_filing: ISFFiling,
      fda_prior_notice: FDAPriorNotice,
      eur1_certificate: EUR1Certificate,
      rex_certificate: REXCertificate,
    };
    return templateMap[templateId] || null;
  };

  // Fallback template for unsupported documents
  const generateFallbackHTML = (docName, data) => `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <div style="text-align: center; border-bottom: 3px solid #333; padding-bottom: 20px; margin-bottom: 30px;">
        <h1 style="color: #2c3e50; margin: 0;">${docName.toUpperCase()}</h1>
      </div>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 5px;">
        <h3 style="color: #34495e;">DOCUMENT DATA</h3>
        <pre style="white-space: pre-wrap; font-family: Arial, sans-serif; font-size: 12px;">
  ${JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  `;

  const renderTemplateToHTML = (templateId, data) => {
    return new Promise((resolve) => {
      const tempDiv = document.createElement('div');
      const pageWidthMM = 210;
      const pageHeightMM = 297;
      const marginMM = 15;
      const contentWidthMM = pageWidthMM - (marginMM * 2);
      const contentWidthPX = (contentWidthMM * 96) / 25.4;

      tempDiv.style.width = `${contentWidthPX}px`;
      tempDiv.style.minHeight = 'auto';
      tempDiv.style.padding = `${marginMM}mm`;
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.boxSizing = 'border-box';
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      tempDiv.style.fontSize = '12px';
      tempDiv.style.lineHeight = '1.4';
      tempDiv.style.overflow = 'visible';

      document.body.appendChild(tempDiv);

      const TemplateComponent = getTemplateComponent(templateId);

      if (TemplateComponent) {
        const root = createRoot(tempDiv);
        root.render(<TemplateComponent data={data} />);

        setTimeout(() => {
          try {
            tempDiv.getBoundingClientRect();
            const htmlContent = tempDiv.innerHTML;
            root.unmount();
            document.body.removeChild(tempDiv);
            resolve(htmlContent);
          } catch (error) {
            console.error('Error in renderTemplateToHTML:', error);
            const fallbackHTML = generateFallbackHTML(templateId, data);
            document.body.removeChild(tempDiv);
            resolve(fallbackHTML);
          }
        }, 200);
      } else {
        const fallbackHTML = generateFallbackHTML(templateId, data);
        document.body.removeChild(tempDiv);
        resolve(fallbackHTML);
      }
    });
  };

  const downloadCombinedPDF = async () => {
    try {
      setIsDownloading(true);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const pageHeight = 290;
      const margin = 5;
      const contentWidth = pageWidth - (margin * 2);
      const contentHeight = pageHeight - (margin * 2);

      for (let i = 0; i < generatedDocuments.length; i++) {
        const doc = generatedDocuments[i];
        if (i > 0) pdf.addPage();

        const htmlContent = await renderTemplateToHTML(doc.id, doc.props);
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;

        tempDiv.style.width = `${contentWidth}mm`;
        tempDiv.style.maxWidth = `${contentWidth}mm`;
        tempDiv.style.padding = `${margin}mm`;
        tempDiv.style.backgroundColor = 'white';
        tempDiv.style.boxSizing = 'border-box';
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.top = '0';
        tempDiv.style.fontSize = '12px';
        tempDiv.style.lineHeight = '1.4';
        tempDiv.style.overflow = 'visible';

        document.body.appendChild(tempDiv);

        try {
          await new Promise(resolve => setTimeout(resolve, 100));
          const canvas = await html2canvas(tempDiv, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            width: tempDiv.scrollWidth,
            height: tempDiv.scrollHeight,
            windowWidth: tempDiv.scrollWidth,
            windowHeight: tempDiv.scrollHeight,
            onclone: (clonedDoc, element) => {
              const elements = element.querySelectorAll('*');
              elements.forEach(el => {
                el.style.boxSizing = 'border-box';
                el.style.maxWidth = '100%';
              });
            }
          });

          const imgData = canvas.toDataURL('image/png', 1.0);
          const imgWidth = canvas.width;
          const imgHeight = canvas.height;
          const ratio = Math.min(contentWidth / imgWidth, contentHeight / imgHeight);
          const finalWidth = imgWidth * ratio;
          const finalHeight = imgHeight * ratio;

          pdf.addImage(imgData, 'PNG', margin, margin, finalWidth, finalHeight);
          pdf.setFontSize(8);
          pdf.setTextColor(100, 100, 100);
          pdf.text(`Page ${i + 1} of ${generatedDocuments.length}`, pageWidth - 20, pageHeight - 10);

        } catch (error) {
          console.error(`Error generating page ${i + 1}:`, error);
          pdf.setFontSize(16);
          pdf.text(`Error generating ${doc.name}`, 20, 20);
          pdf.setFontSize(12);
          pdf.text('Please try generating this document again.', 20, 40);
        } finally {
          if (document.body.contains(tempDiv)) {
            document.body.removeChild(tempDiv);
          }
        }
      }

      const fileName = `export-documents-${buyerDetails.name.replace(/\s+/g, '-')}-${Date.now()}.pdf`;
      pdf.save(fileName);
      alert(`✅ Success! Downloaded ${generatedDocuments.length} professional documents`);

    } catch (error) {
      console.error('PDF generation error:', error);
      alert('❌ PDF generation failed. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Add this function to render templates in preview
  const renderTemplateComponent = (templateId, data) => {
    const TemplateComponent = getTemplateComponent(templateId);
    return TemplateComponent ? <TemplateComponent data={data} /> : <div>Template not found: {templateId}</div>;
  };

  // Smart Flow Steps
  const handleIECSubmit = () => {
    const result = lookupIEC(iecNumber);
    if (result.success) {
      setCompanyData(result.data);
      setCurrentStep(2);
    } else {
      alert(result.error);
    }
  };

  const handleHSNSubmit = () => {
    if (!hsnCode || hsnCode.length < 4) {
      alert('Please enter valid HSN code (min 4 digits)');
      return;
    }
    const certInfo = getCertificatesByHSN(hsnCode);
    setCertificates(certInfo);
    setCurrentStep(3);
  };

  const handleCountrySubmit = () => {
    if (!destination) {
      alert('Please select destination');
      return;
    }
    const info = getCountryInfo(destination);
    setCountryInfo(info);
    setCurrentStep(4);
  };

  const handleCountryQuestionsSubmit = () => {
    setUserInputs(prev => ({ ...prev, ...countryAnswers }));
    setCurrentStep(5);
  };

  const handleBuyerSubmit = () => {
    if (!buyerDetails.name || !buyerDetails.address) {
      alert('Please fill buyer name and address');
      return;
    }
    setCurrentStep(6);
  };

  const handleProductSubmit = () => {
    if (!productDetails.description || !productDetails.quantity || !productDetails.price) {
      alert('Please fill all product details');
      return;
    }

    const productData = {
      product_code: `HSN-${hsnCode}`,
      description: productDetails.description,
      hs_code: hsnCode,
      unit: productDetails.unit,
      quantity: productDetails.quantity,
      unit_price: productDetails.price,
      total_amount: (productDetails.quantity * productDetails.price).toFixed(2),
      net_weight: productDetails.net_weight,
      gross_weight: productDetails.gross_weight,
      measurements: productDetails.measurements
    };

    setUserInputs(prev => ({
      ...prev,
      products: [productData],
      total_amount: (productDetails.quantity * productDetails.price).toFixed(2)
    }));

    setCurrentStep(7);
    setCurrentQuestion(0);
  };

  // Get only relevant questions based on selected documents
  const getRelevantQuestions = () => {
    if (!countryInfo) return [];
    const requiredFields = new Set();
    const coreFields = [
      'exporter_contact_person', 'exporter_contact_info', 'authorized_signatory_name',
      'authorized_signatory_designation', 'vessel_flight_details', 'port_of_loading',
      'port_of_discharge', 'departure_date', 'incoterms', 'payment_method',
      'currency', 'bank_details'
    ];

    coreFields.forEach(field => requiredFields.add(field));
    countryInfo.documents.forEach(doc => {
      if (doc.includes('Commercial Invoice')) {
        ['invoice_number', 'invoice_date', 'buyer_reference', 'lc_number', 'insurance_policy'].forEach(f => requiredFields.add(f));
      }
      if (doc.includes('Packing List')) {
        ['package_details', 'net_weight_total', 'gross_weight_total', 'measurements_total'].forEach(f => requiredFields.add(f));
      }
      if (doc.includes('Certificate of Origin') || doc.includes('EUR.1')) {
        ['origin_criteria', 'tariff_code', 'marks_numbers'].forEach(f => requiredFields.add(f));
      }
      if (doc.includes('Bill of Lading')) {
        ['bill_of_lading_number', 'shippers_reference', 'freight_terms', 'number_of_originals', 'notify_party'].forEach(f => requiredFields.add(f));
      }
      if (doc.includes('Health Certificate')) {
        ['health_certificate_number', 'manufacturing_plant', 'product_batch_number', 'manufacturing_date', 'expiry_date'].forEach(f => requiredFields.add(f));
      }
      if (doc.includes('Halal Certificate')) {
        ['halal_certificate_number', 'halal_supervisor', 'inspection_date'].forEach(f => requiredFields.add(f));
      }
      if (doc.includes('ISF Filing')) {
        ['importer_of_record', 'manufacturer_supplier', 'seller_owner', 'consignee_number'].forEach(f => requiredFields.add(f));
      }
    });

    return allDocumentQuestions.filter(question => requiredFields.has(question.field));
  };

  // Extended Questions Handler
  const handleQuestionAnswer = (field, value) => {
    setUserInputs(prev => ({
      ...prev,
      [field]: value
    }));

    const questions = getRelevantQuestions();
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      generateAllDocuments();
    }
  };

  // Generate all documents
  const generateAllDocuments = async () => {
    setIsGenerating(true);
    try {
      const finalData = {
        exporter_company_name: companyData.companyName,
        exporter_address: companyData.fullAddress,
        exporter_gstin: companyData.gstin || '',
        buyer_company_name: buyerDetails.name,
        buyer_address: buyerDetails.address,
        buyer_country: destination,
        buyer_reference: buyerDetails.reference,
        buyer_email: buyerDetails.email,
        buyer_phone: buyerDetails.phone,
        products: [{
          product_code: userInputs.product_code || `HSN-${hsnCode}`,
          description: productDetails.description,
          hs_code: userInputs.hs_code || hsnCode,
          unit: productDetails.unit,
          quantity: productDetails.quantity,
          unit_price: productDetails.price,
          total_amount: (productDetails.quantity * productDetails.price).toFixed(2),
          net_weight: productDetails.net_weight,
          gross_weight: productDetails.gross_weight,
          measurements: productDetails.measurements
        }],
        ...countryAnswers,
        ...userInputs,
        total_amount: (productDetails.quantity * productDetails.price).toFixed(2),
        bill_of_lading_number: userInputs.bill_of_lading_number || `BL-${Date.now()}`,
        invoice_number: userInputs.invoice_number || `INV-${Date.now()}`,
        invoice_date: userInputs.invoice_date || new Date().toISOString().split('T')[0]
      };

      const documentsToGenerate = mapDocumentsToTemplates(countryInfo.documents);
      const generatedDocs = documentsToGenerate.map(template => ({
        id: template.id,
        name: template.name,
        props: finalData
      }));

      setGeneratedDocuments(generatedDocs);
      setCurrentStep(8);

    } catch (error) {
      console.error('Error generating documents:', error);
      alert('Error generating documents. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Map document names to template components
  const mapDocumentsToTemplates = (documents) => {
    const documentMap = {
      'Commercial Invoice': { id: 'commercial_invoice', name: 'Commercial Invoice' },
      'Packing List': { id: 'packing_list', name: 'Packing List' },
      'Certificate of Origin': { id: 'certificate_of_origin', name: 'Certificate of Origin' },
      'Certificate of Origin (Preferential - India-UAE CEPA)': { id: 'certificate_of_origin', name: 'Certificate of Origin (India-UAE CEPA)' },
      'Certificate of Origin (Non-preferential)': { id: 'certificate_of_origin', name: 'Certificate of Origin' },
      'Bill of Lading': { id: 'bill_of_lading', name: 'Bill of Lading' },
      'Health Certificate (for food products)': { id: 'health_certificate', name: 'Health Certificate' },
      'Halal Certificate (for meat/food)': { id: 'halal_certificate', name: 'Halal Certificate' },
      'ISF Filing (Importer Security Filing)': { id: 'isf_filing', name: 'Importer Security Filing' },
      'FDA Prior Notice (for food/drugs)': { id: 'fda_prior_notice', name: 'FDA Prior Notice' },
      'EUR.1 Movement Certificate': { id: 'eur1_certificate', name: 'EUR.1 Movement Certificate' },
      'REX Certificate (if value >€6,000)': { id: 'rex_certificate', name: 'REX Certificate' }
    };

    return documents
      .map(doc => documentMap[doc])
      .filter(Boolean);
  };

  // Render current question with suggestions
  const renderCurrentQuestion = () => {
    const questions = getRelevantQuestions();
    if (currentQuestion >= questions.length) return null;

    const question = questions[currentQuestion];
    const currentValue = userInputs[question.field] || '';
    const suggestion = generateSmartSuggestion(question.field, currentValue);

    if (question.field === 'invoice_date' && !currentValue) {
      setUserInputs(prev => ({ ...prev, [question.field]: suggestion }));
    }

    return (
      <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
        <h3 className="text-lg font-semibold text-white mb-4">
          {currentQuestion + 1}/{questions.length} - {question.question}
          {question.required && <span className="text-red-400 ml-1">*</span>}
        </h3>

        {suggestion && question.type !== 'select' && question.field !== 'invoice_date' && (
          <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 mb-4 flex items-center justify-between">
            <span className="text-blue-300 text-sm">💡 Suggestion: {suggestion}</span>
            <button
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
              onClick={() => {
                setUserInputs(prev => ({ ...prev, [question.field]: suggestion }));
              }}
            >
              Use This
            </button>
          </div>
        )}

        {question.type === 'text' && (
          <input
            type="text"
            value={currentValue}
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-manu-green"
            placeholder={`Enter ${question.field.replace(/_/g, ' ')}...`}
            onChange={(e) => setUserInputs(prev => ({ ...prev, [question.field]: e.target.value }))}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                handleQuestionAnswer(question.field, e.target.value.trim());
              }
            }}
          />
        )}

        {question.type === 'select' && (
          <div className="grid grid-cols-2 gap-3">
            {question.options.map(option => (
              <button
                key={option}
                className={`p-3 rounded-lg border transition-colors ${currentValue === option
                  ? 'bg-manu-green border-manu-green text-white'
                  : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                  }`}
                onClick={() => handleQuestionAnswer(question.field, option)}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {question.type === 'date' && (
          <input
            type="date"
            value={currentValue}
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-manu-green"
            onChange={(e) => setUserInputs(prev => ({ ...prev, [question.field]: e.target.value }))}
          />
        )}

        {question.type === 'textarea' && (
          <textarea
            value={currentValue}
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-manu-green"
            rows="3"
            placeholder={`Enter ${question.field.replace(/_/g, ' ')}...`}
            onChange={(e) => setUserInputs(prev => ({ ...prev, [question.field]: e.target.value }))}
          />
        )}

        {question.type === 'number' && (
          <input
            type="number"
            value={currentValue}
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-manu-green"
            placeholder={`Enter ${question.field.replace(/_/g, ' ')}...`}
            onChange={(e) => setUserInputs(prev => ({ ...prev, [question.field]: e.target.value }))}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                handleQuestionAnswer(question.field, e.target.value.trim());
              }
            }}
          />
        )}

        <div className="mt-6">
          <button
            className="w-full bg-manu-green text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-semibold disabled:bg-gray-600 disabled:cursor-not-allowed"
            onClick={() => {
              if (question.required && !currentValue) {
                alert('This field is required');
                return;
              }
              handleQuestionAnswer(question.field, currentValue);
            }}
            disabled={question.required && !currentValue}
          >
            {currentQuestion < questions.length - 1 ? 'Next Question →' : 'Generate Documents'}
          </button>
        </div>

        <div className="mt-4 bg-gray-600 rounded-full h-2">
          <div
            className="bg-manu-green h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>
    );
  };

  // Email sending function
  const sendPdfViaEmail = async () => {
    if (generatedDocuments.length === 0) {
      alert("No documents generated to send.");
      return;
    }

    setIsSendingEmail(true);
    try {
      const userEmail = user?.email || user?.user_metadata?.email || 'unknown@example.com';
      alert(`📧 Documents would be sent to: ${userEmail}\n\nThis feature integrates with your email service to send professional export documents directly to your inbox.`);
    } catch (error) {
      console.error('Error sending email:', error);
      alert('❌ Error sending documents via email. Please try again.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Reset function
  const resetGenerator = () => {
    setCurrentStep(1);
    setGeneratedDocuments([]);
    setUserInputs({});
    setCurrentQuestion(0);
    setCountryAnswers({});
    setIecNumber('');
    setHsnCode('');
    setCertificates(null);
    setDestination('');
    setCountryInfo(null);
    setBuyerDetails({ name: '', address: '', email: '', phone: '', reference: '' });
    setProductDetails({ description: '', quantity: '', unit: 'KG', price: '', packaging: '', net_weight: '', gross_weight: '', measurements: '' });
  };

  // Progress calculation
  const getProgressPercentage = () => {
    const steps = {
      1: 14,
      2: 28,
      3: 42,
      4: 56,
      5: 70,
      6: 84,
      7: 92,
      8: 100
    };
    return steps[currentStep] || 0;
  };

  // STEP 1: IEC Input
  if (currentStep === 1) {
    return (
      <div className="min-h-screen bg-gray-900" style={{
        background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
      }}>
        <Header
          user={user}
          onPageChange={onPageChange}
          onLogout={onLogout}
          documentsUploaded={documentsUploaded}
        />

        <div className="pt-16 min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-2xl">
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 shadow-2xl">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-manu-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="text-white" size={32} />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Smart Document Generator</h1>
                <p className="text-gray-400">Generate professional export documents in minutes</p>
              </div>

              <div className="mb-8">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Step 1 of 8</span>
                  <span>{getProgressPercentage()}% Complete</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-manu-green h-2 rounded-full transition-all duration-500"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                    🏢 Enter Your IEC Number
                  </h2>
                  <p className="text-gray-400 mb-4">We'll auto-fill your company details from our verified database</p>

                  <input
                    type="text"
                    value={iecNumber}
                    onChange={(e) => setIecNumber(e.target.value)}
                    placeholder="Enter IEC (e.g., demo)"
                    className="w-full p-4 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-manu-green"
                  />

                  <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 mt-4 flex items-center justify-between">
                    <span className="text-blue-300 text-sm">💡 Try this demo IEC: {SUGGESTED_IEC}</span>
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      onClick={() => setIecNumber(SUGGESTED_IEC)}
                    >
                      Use This
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleIECSubmit}
                  className="w-full bg-manu-green text-white py-4 rounded-lg hover:bg-green-600 transition-colors font-semibold text-lg flex items-center justify-center gap-2"
                >
                  Continue <ChevronRight size={20} />
                </button>

                <p className="text-center text-gray-400 text-sm">
                  💡 Try "demo" for testing with sample company data
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STEP 2: HSN Code
  if (currentStep === 2 && companyData) {
    return (
      <div className="min-h-screen bg-gray-900" style={{
        background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
      }}>
        <Header
          user={user}
          onPageChange={onPageChange}
          onLogout={onLogout}
          documentsUploaded={documentsUploaded}
        />

        <div className="pt-16 min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-2xl">
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 shadow-2xl">
              <div className="mb-8">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Step 2 of 8</span>
                  <span>{getProgressPercentage()}% Complete</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-manu-green h-2 rounded-full transition-all duration-500"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-green-900/20 border border-green-700 rounded-lg p-6 mb-6">
                <h3 className="text-green-400 font-semibold mb-2 flex items-center gap-2">
                  ✅ Company Found
                </h3>
                <p className="text-white font-semibold text-lg">{companyData.companyName}</p>
                <p className="text-gray-300 text-sm mt-1">{companyData.fullAddress}</p>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                    📦 Enter HSN Code
                  </h2>
                  <p className="text-gray-400 mb-4">We'll show required certificates for your product category</p>

                  <input
                    type="text"
                    value={hsnCode}
                    onChange={(e) => setHsnCode(e.target.value)}
                    placeholder="Enter HSN Code (e.g., 09041100)"
                    className="w-full p-4 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-manu-green"
                    maxLength="8"
                  />

                  <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 mt-4 flex items-center justify-between">
                    <span className="text-blue-300 text-sm">💡 Try: {SUGGESTED_HSN} (Spices)</span>
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      onClick={() => setHsnCode(SUGGESTED_HSN)}
                    >
                      Use This
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 bg-gray-700 text-white py-4 rounded-lg hover:bg-gray-600 transition-colors font-semibold flex items-center justify-center gap-2"
                  >
                    <ChevronLeft size={20} /> Back
                  </button>
                  <button
                    onClick={handleHSNSubmit}
                    className="flex-1 bg-manu-green text-white py-4 rounded-lg hover:bg-green-600 transition-colors font-semibold flex items-center justify-center gap-2"
                  >
                    Continue <ChevronRight size={20} />
                  </button>
                </div>

                <p className="text-center text-gray-400 text-sm">
                  💡 Try "09041100" (spices) or "52051100" (textiles) for testing
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STEP 3: Show Certificates + Select Country
  if (currentStep === 3 && certificates) {
    return (
      <div className="min-h-screen bg-gray-900" style={{
        background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
      }}>
        <Header
          user={user}
          onPageChange={onPageChange}
          onLogout={onLogout}
          documentsUploaded={documentsUploaded}
        />

        <div className="pt-16 min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-4xl">
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 shadow-2xl">
              <div className="mb-8">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Step 3 of 8</span>
                  <span>{getProgressPercentage()}% Complete</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-manu-green h-2 rounded-full transition-all duration-500"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
              </div>

              {certificates.found && certificates.certificates.length > 0 && (
                <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-6 mb-6">
                  <h3 className="text-blue-400 font-semibold mb-4 flex items-center gap-2 text-lg">
                    📋 Required Certificates for {certificates.category}
                  </h3>
                  <p className="text-gray-300 mb-4">{certificates.description}</p>

                  <div className="space-y-3">
                    {certificates.certificates.map((cert, idx) => (
                      <div key={idx} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <strong className="text-white">{cert.name}</strong>
                              <span className="px-2 py-1 bg-blue-900 text-blue-300 rounded text-xs font-bold">
                                Required
                              </span>
                            </div>
                            <p className="text-gray-300 text-sm mb-2">{cert.reason}</p>
                            <p className="text-gray-400 text-xs">
                              Issuer: {cert.issuer} • Cost: {cert.cost} • Time: {cert.processingTime}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                    🌍 Select Destination Country
                  </h2>
                  <p className="text-gray-400 mb-4">We'll show country-specific requirements and documents</p>

                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full p-4 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-manu-green"
                  >
                    <option value="">-- Select Country --</option>
                    <option value="UAE">United Arab Emirates (UAE)</option>
                    <option value="USA">United States (USA)</option>
                    <option value="Germany">Germany (EU)</option>
                  </select>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="flex-1 bg-gray-700 text-white py-4 rounded-lg hover:bg-gray-600 transition-colors font-semibold flex items-center justify-center gap-2"
                  >
                    <ChevronLeft size={20} /> Back
                  </button>
                  <button
                    onClick={handleCountrySubmit}
                    className="flex-1 bg-manu-green text-white py-4 rounded-lg hover:bg-green-600 transition-colors font-semibold flex items-center justify-center gap-2"
                  >
                    Continue <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STEP 4: Show Country Documents + Ask Country-Specific Questions
  if (currentStep === 4 && countryInfo) {
    return (
      <div className="min-h-screen bg-gray-900" style={{
        background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
      }}>
        <Header
          user={user}
          onPageChange={onPageChange}
          onLogout={onLogout}
          documentsUploaded={documentsUploaded}
        />

        <div className="pt-16 min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-4xl">
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 shadow-2xl">
              <div className="mb-8">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Step 4 of 8</span>
                  <span>{getProgressPercentage()}% Complete</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-manu-green h-2 rounded-full transition-all duration-500"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-green-900/20 border border-green-700 rounded-lg p-6 mb-6">
                <h3 className="text-green-400 font-semibold mb-4 flex items-center gap-2 text-lg">
                  📄 Required Documents for {countryInfo.countryName}
                </h3>

                <div className="grid gap-3">
                  {countryInfo.documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                      <span className="text-white">{doc}</span>
                    </div>
                  ))}
                </div>

                {countryInfo.ftaInfo.available && (
                  <div className="mt-4 p-4 bg-green-900/30 rounded-lg border border-green-600">
                    <strong className="text-green-400">🎉 FTA Benefit Available!</strong>
                    <p className="text-green-300 text-sm mt-1">
                      {countryInfo.ftaInfo.name} - {countryInfo.ftaInfo.benefit}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  ❓ {countryInfo.countryName}-Specific Questions
                </h2>

                {countryInfo.specificQuestions.map((q, idx) => (
                  <div key={q.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                    <label className="block text-white font-semibold mb-2">
                      {q.question}
                      {q.required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                    <p className="text-gray-400 text-sm mb-3">{q.helpText}</p>

                    {q.type === 'text' && (
                      <input
                        type="text"
                        value={countryAnswers[q.id] || ''}
                        onChange={(e) => setCountryAnswers({
                          ...countryAnswers,
                          [q.id]: e.target.value
                        })}
                        className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-manu-green"
                      />
                    )}

                    {q.type === 'yes_no' && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => setCountryAnswers({ ...countryAnswers, [q.id]: 'yes' })}
                          className={`flex-1 py-3 rounded-lg border transition-colors ${countryAnswers[q.id] === 'yes'
                            ? 'bg-manu-green border-manu-green text-white'
                            : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                            }`}
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setCountryAnswers({ ...countryAnswers, [q.id]: 'no' })}
                          className={`flex-1 py-3 rounded-lg border transition-colors ${countryAnswers[q.id] === 'no'
                            ? 'bg-red-600 border-red-600 text-white'
                            : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                            }`}
                        >
                          No
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                <div className="flex gap-3">
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="flex-1 bg-gray-700 text-white py-4 rounded-lg hover:bg-gray-600 transition-colors font-semibold flex items-center justify-center gap-2"
                  >
                    <ChevronLeft size={20} /> Back
                  </button>
                  <button
                    onClick={handleCountryQuestionsSubmit}
                    className="flex-1 bg-manu-green text-white py-4 rounded-lg hover:bg-green-600 transition-colors font-semibold flex items-center justify-center gap-2"
                  >
                    Continue <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STEP 5: Buyer Details
  if (currentStep === 5) {
    const suggestedBuyers = getSuggestedBuyerDetails();

    return (
      <div className="min-h-screen bg-gray-900" style={{
        background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
      }}>
        <Header
          user={user}
          onPageChange={onPageChange}
          onLogout={onLogout}
          documentsUploaded={documentsUploaded}
        />

        <div className="pt-16 min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-2xl">
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 shadow-2xl">
              <div className="mb-8">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Step 5 of 8</span>
                  <span>{getProgressPercentage()}% Complete</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-manu-green h-2 rounded-full transition-all duration-500"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  👤 Buyer Details
                </h2>

                {suggestedBuyers.length > 0 && (
                  <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                    <h4 className="text-white font-semibold mb-3">Suggested Buyers for {destination}:</h4>
                    <div className="space-y-3">
                      {suggestedBuyers.map((buyer, index) => (
                        <div key={index} className="bg-gray-600 rounded-lg p-3 flex items-center justify-between">
                          <div className="flex-1">
                            <strong className="text-white">{buyer.name}</strong>
                            <p className="text-gray-300 text-sm mt-1">{buyer.address}</p>
                            <p className="text-gray-400 text-xs mt-1">
                              {buyer.email} • {buyer.phone} • Ref: {buyer.reference}
                            </p>
                          </div>
                          <button
                            className="bg-manu-green text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors"
                            onClick={() => setBuyerDetails(buyer)}
                          >
                            Use This
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">Buyer Company Name *</label>
                    <input
                      type="text"
                      value={buyerDetails.name}
                      onChange={(e) => setBuyerDetails({ ...buyerDetails, name: e.target.value })}
                      placeholder="ABC Trading LLC"
                      className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-manu-green"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Buyer Address *</label>
                    <textarea
                      value={buyerDetails.address}
                      onChange={(e) => setBuyerDetails({ ...buyerDetails, address: e.target.value })}
                      placeholder="Full address with country"
                      rows="3"
                      className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-manu-green"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-semibold mb-2">Buyer Email</label>
                      <input
                        type="email"
                        value={buyerDetails.email}
                        onChange={(e) => setBuyerDetails({ ...buyerDetails, email: e.target.value })}
                        placeholder="buyer@example.com"
                        className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-manu-green"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-2">Buyer Phone</label>
                      <input
                        type="tel"
                        value={buyerDetails.phone}
                        onChange={(e) => setBuyerDetails({ ...buyerDetails, phone: e.target.value })}
                        placeholder="+971-4-1234567"
                        className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-manu-green"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Buyer Reference</label>
                    <input
                      type="text"
                      value={buyerDetails.reference}
                      onChange={(e) => setBuyerDetails({ ...buyerDetails, reference: e.target.value })}
                      placeholder="Buyer reference number"
                      className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-manu-green"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="flex-1 bg-gray-700 text-white py-4 rounded-lg hover:bg-gray-600 transition-colors font-semibold flex items-center justify-center gap-2"
                  >
                    <ChevronLeft size={20} /> Back
                  </button>
                  <button
                    onClick={handleBuyerSubmit}
                    className="flex-1 bg-manu-green text-white py-4 rounded-lg hover:bg-green-600 transition-colors font-semibold flex items-center justify-center gap-2"
                  >
                    Continue <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STEP 6: Product Details
  if (currentStep === 6) {
    const totalValue = (productDetails.quantity * productDetails.price).toFixed(2);
    const suggestedProducts = getSuggestedProductDetails();

    return (
      <div className="min-h-screen bg-gray-900" style={{
        background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
      }}>
        <Header
          user={user}
          onPageChange={onPageChange}
          onLogout={onLogout}
          documentsUploaded={documentsUploaded}
        />

        <div className="pt-16 min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-2xl">
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 shadow-2xl">
              <div className="mb-8">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Step 6 of 8</span>
                  <span>{getProgressPercentage()}% Complete</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-manu-green h-2 rounded-full transition-all duration-500"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  📦 Product Details
                </h2>

                {suggestedProducts.length > 0 && (
                  <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                    <h4 className="text-white font-semibold mb-3">Suggested Products for HSN {hsnCode}:</h4>
                    <div className="space-y-3">
                      {suggestedProducts.map((product, index) => (
                        <div key={index} className="bg-gray-600 rounded-lg p-3 flex items-center justify-between">
                          <div className="flex-1">
                            <strong className="text-white">{product.description}</strong>
                            <p className="text-gray-300 text-sm mt-1">
                              {product.quantity} {product.unit} × ${product.price} = ${(product.quantity * product.price).toFixed(2)}
                            </p>
                            <p className="text-gray-400 text-xs mt-1">
                              Packaging: {product.packaging} • Net: {product.net_weight}KG • Gross: {product.gross_weight}KG
                            </p>
                          </div>
                          <button
                            className="bg-manu-green text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors"
                            onClick={() => setProductDetails(product)}
                          >
                            Use This
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">Product Description *</label>
                    <input
                      type="text"
                      value={productDetails.description}
                      onChange={(e) => setProductDetails({ ...productDetails, description: e.target.value })}
                      placeholder="Red Chili Powder"
                      className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-manu-green"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-semibold mb-2">Quantity *</label>
                      <input
                        type="number"
                        value={productDetails.quantity}
                        onChange={(e) => setProductDetails({ ...productDetails, quantity: e.target.value })}
                        placeholder="1000"
                        className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-manu-green"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-2">Unit</label>
                      <select
                        value={productDetails.unit}
                        onChange={(e) => setProductDetails({ ...productDetails, unit: e.target.value })}
                        className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-manu-green"
                      >
                        <option>KG</option>
                        <option>MT</option>
                        <option>PCS</option>
                        <option>BOXES</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Price per Unit (USD) *</label>
                    <input
                      type="number"
                      value={productDetails.price}
                      onChange={(e) => setProductDetails({ ...productDetails, price: e.target.value })}
                      placeholder="5.00"
                      step="0.01"
                      className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-manu-green"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-semibold mb-2">Net Weight (Kg)</label>
                      <input
                        type="number"
                        value={productDetails.net_weight}
                        onChange={(e) => setProductDetails({ ...productDetails, net_weight: e.target.value })}
                        placeholder="Net weight"
                        className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-manu-green"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-2">Gross Weight (Kg)</label>
                      <input
                        type="number"
                        value={productDetails.gross_weight}
                        onChange={(e) => setProductDetails({ ...productDetails, gross_weight: e.target.value })}
                        placeholder="Gross weight"
                        className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-manu-green"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Packaging Type</label>
                    <input
                      type="text"
                      value={productDetails.packaging}
                      onChange={(e) => setProductDetails({ ...productDetails, packaging: e.target.value })}
                      placeholder="10 cartons x 100 KG each"
                      className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-manu-green"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Measurements</label>
                    <input
                      type="text"
                      value={productDetails.measurements}
                      onChange={(e) => setProductDetails({ ...productDetails, measurements: e.target.value })}
                      placeholder="Length x Width x Height"
                      className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-manu-green"
                    />
                  </div>
                </div>

                {totalValue > 0 && (
                  <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <strong className="text-white">Total FOB Value:</strong>
                      <span className="text-2xl font-bold text-green-400">
                        ${totalValue}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setCurrentStep(5)}
                    className="flex-1 bg-gray-700 text-white py-4 rounded-lg hover:bg-gray-600 transition-colors font-semibold flex items-center justify-center gap-2"
                  >
                    <ChevronLeft size={20} /> Back
                  </button>
                  <button
                    onClick={handleProductSubmit}
                    className="flex-1 bg-manu-green text-white py-4 rounded-lg hover:bg-green-600 transition-colors font-semibold text-lg flex items-center justify-center gap-2"
                  >
                    🚀 Generate All Documents
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STEP 7: Extended Questions
  if (currentStep === 7) {
    const questions = getRelevantQuestions();

    return (
      <div className="min-h-screen bg-gray-900" style={{
        background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
      }}>
        <Header
          user={user}
          onPageChange={onPageChange}
          onLogout={onLogout}
          documentsUploaded={documentsUploaded}
        />

        <div className="pt-16 min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-4xl">
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 shadow-2xl">
              <div className="mb-8">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Step 7 of 8 - Document Details</span>
                  <span>{getProgressPercentage()}% Complete</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-manu-green h-2 rounded-full transition-all duration-500"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  📝 Additional Document Information
                </h2>
                <p className="text-gray-400 mb-6">
                  {questions.length - currentQuestion} questions remaining to complete your {countryInfo.documents.length} export documents
                </p>

                {renderCurrentQuestion()}

                {isGenerating && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
                      <div className="w-16 h-16 border-4 border-manu-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-white text-lg">Generating your export documents...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STEP 8: Success & Download
  if (currentStep === 8) {
    return (

      <div className="min-h-screen bg-gray-900 notranslate" style={{
        background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
      }}>
        <Header
          user={user}
          onPageChange={onPageChange}
          onLogout={onLogout}
          documentsUploaded={documentsUploaded}
        />

        <div className="pt-16 min-h-screen p-4">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 shadow-2xl">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🎉</span>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Documents Generated Successfully!</h1>
                <p className="text-gray-400 text-lg">Your {generatedDocuments.length} export documents are ready for download</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Left Panel - Documents List and Actions */}

                <div className="space-y-6" >
                  <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                    <h3 className="text-white font-semibold mb-4 text-lg">Generated Documents:</h3>
                    <div className="space-y-2">
                      {generatedDocuments.map((doc, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-600 rounded-lg">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm">✓</span>
                          </div>
                          <span className="text-white flex-1">{doc.name}</span>
                          <button
                            onClick={() => setActiveDocIndex(index)}
                            className={`px-3 py-1 rounded text-sm ${activeDocIndex === index
                              ? 'bg-manu-green text-white'
                              : 'bg-gray-500 text-gray-300 hover:bg-gray-400'
                              }`}
                          >
                            Preview
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                    <h3 className="text-white font-semibold mb-4">Download Options</h3>
                    <div className="space-y-3">
                      <button
                        onClick={downloadCombinedPDF}
                        disabled={isDownloading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:bg-gray-600 disabled:cursor-not-allowed"
                      >
                        <Download size={20} />
                        {isDownloading ? 'Generating PDF...' : 'Download All Documents as PDF'}
                      </button>

                      <button
                        onClick={sendPdfViaEmail}
                        disabled={isSendingEmail}
                        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:bg-gray-600 disabled:cursor-not-allowed"
                      >
                        <Mail size={20} />
                        {isSendingEmail ? 'Sending...' : 'Send via Email'}
                      </button>

                      <button
                        onClick={resetGenerator}
                        className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-500 transition-colors font-semibold flex items-center justify-center gap-2"
                      >
                        <Home size={20} />
                        Create New Export
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Panel - Document Preview */}
                <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold text-lg">Document Preview</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm">
                        {activeDocIndex + 1} of {generatedDocuments.length}
                      </span>
                      <button
                        onClick={() => setActiveDocIndex(prev => Math.max(0, prev - 1))}
                        disabled={activeDocIndex === 0}
                        className="p-2 rounded bg-gray-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        onClick={() => setActiveDocIndex(prev => Math.min(generatedDocuments.length - 1, prev + 1))}
                        disabled={activeDocIndex === generatedDocuments.length - 1}
                        className="p-2 rounded bg-gray-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 max-h-100 overflow-y-auto">
                    {generatedDocuments.length > 0 && renderTemplateComponent(
                      generatedDocuments[activeDocIndex].id,
                      generatedDocuments[activeDocIndex].props
                    )}
                  </div>

                  {generatedDocuments.length > 0 && (
                    <button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(new Blob([
                          JSON.stringify(generatedDocuments[activeDocIndex].props, null, 2)
                        ], { type: 'application/json' }));
                        link.download = `${generatedDocuments[activeDocIndex].name.replace(/\s+/g, '_')}_data.json`;
                        link.click();
                      }}
                      className="w-full mt-4 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-500 transition-colors text-sm"
                    >
                      Download JSON Data
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default ExtendedSmartDocGenerator;