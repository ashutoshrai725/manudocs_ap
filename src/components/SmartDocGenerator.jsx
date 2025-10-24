import React, { useState } from 'react';
import { lookupIEC } from '../utils/iecLookup';
import { getCertificatesByHSN } from '../utils/certificateHelper';
import { getCountryInfo } from '../utils/documentSelector';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
// Import for the legacy/preview rendering (Step 8)
import * as ReactDOM from 'react-dom';

// Import the modern API for PDF generation (The core fix)
import { createRoot } from 'react-dom/client';
// Import all your existing template components
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

function ExtendedSmartDocGenerator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [iecNumber, setIecNumber] = useState('');
  const [companyData, setCompanyData] = useState(null);

  // Smart flow data
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

  // Extended document questions state
  const [userInputs, setUserInputs] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [generatedDocuments, setGeneratedDocuments] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

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
    { field: 'carriers_reference', question: 'Carrier\'s reference number?', type: 'text', required: false },
    { field: 'notify_party', question: 'Notify party details (if different from consignee)?', type: 'textarea', required: false },
    { field: 'freight_terms', question: 'Freight terms?', type: 'select', options: ['Prepaid', 'Collect'], required: true },
    { field: 'number_of_originals', question: 'Number of original Bills of Lading?', type: 'text', required: true },

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
    { field: 'authorized_signatory_designation', question: 'Authorized signatory designation?', type: 'text', required: true }
  ];

  // Get only relevant questions based on selected documents
  const getRelevantQuestions = () => {
    if (!countryInfo) return [];

    const requiredFields = new Set();

    // Always ask these core questions
    const coreFields = [
      'exporter_contact_person', 'exporter_contact_info', 'authorized_signatory_name',
      'authorized_signatory_designation', 'vessel_flight_details', 'port_of_loading',
      'port_of_discharge', 'departure_date', 'incoterms', 'payment_method',
      'currency', 'bank_details'
    ];

    coreFields.forEach(field => requiredFields.add(field));

    // Add fields based on specific documents
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

    return allDocumentQuestions.filter(question =>
      requiredFields.has(question.field)
    );
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

  // No longer a Promise, just a helper
  const renderTemplateToHTML = (templateId, data) => {
    return new Promise((resolve) => {
      const tempDiv = document.createElement('div');
      tempDiv.style.width = '794px';
      tempDiv.style.padding = '20px';
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      document.body.appendChild(tempDiv);

      const TemplateComponent = getTemplateComponent(templateId);

      if (TemplateComponent) {
        // *** THE FIX ***
        const root = createRoot(tempDiv);
        root.render(<TemplateComponent data={data} />);

        // You still need a delay for React to finish flushing the DOM updates
        setTimeout(() => {
          const htmlContent = tempDiv.innerHTML;
          root.unmount(); // Clean up the root
          document.body.removeChild(tempDiv);
          resolve(htmlContent);
        }, 100);

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
      let currentPage = 1;

      for (let i = 0; i < generatedDocuments.length; i++) {
        const doc = generatedDocuments[i];

        if (i > 0) {
          pdf.addPage();
          currentPage++;
        }

        // Generate HTML using your React templates
        const htmlContent = await renderTemplateToHTML(doc.id, doc.props);

        // Create a temporary div to render the content
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        tempDiv.style.width = '794px';
        tempDiv.style.padding = '20px';
        tempDiv.style.backgroundColor = 'white';
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        document.body.appendChild(tempDiv);

        try {
          // Convert to canvas
          const canvas = await html2canvas(tempDiv, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
          });

          const imgData = canvas.toDataURL('image/png', 1.0);
          const imgWidth = 210;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

          // Add page number
          pdf.setFontSize(10);
          pdf.setTextColor(100, 100, 100);
          pdf.text(`Page ${currentPage} of ${generatedDocuments.length}`, 190, 285);

        } finally {
          document.body.removeChild(tempDiv);
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

  // Smart Flow Steps (1-6)
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
    // Store country-specific answers
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

    // Store product data and move to extended questions
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
      // Prepare final data combining all collected information
      const finalData = {
        // From IEC lookup
        exporter_company_name: companyData.companyName,
        exporter_address: companyData.fullAddress,
        exporter_gstin: companyData.gstin || '',

        // From buyer details
        buyer_company_name: buyerDetails.name,
        buyer_address: buyerDetails.address,
        buyer_country: destination,
        buyer_reference: buyerDetails.reference,
        buyer_email: buyerDetails.email,
        buyer_phone: buyerDetails.phone,

        // From product details
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

        // From country-specific answers
        ...countryAnswers,

        // From extended questions
        ...userInputs,

        // Calculated fields
        total_amount: (productDetails.quantity * productDetails.price).toFixed(2),

        // Default values for missing fields
        bill_of_lading_number: userInputs.bill_of_lading_number || `BL-${Date.now()}`,
        invoice_number: userInputs.invoice_number || `INV-${Date.now()}`,
        invoice_date: userInputs.invoice_date || new Date().toISOString().split('T')[0]
      };

      // Generate documents based on country requirements
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

  // Render current question
  const renderCurrentQuestion = () => {
    const questions = getRelevantQuestions();
    if (currentQuestion >= questions.length) return null;

    const question = questions[currentQuestion];
    const currentValue = userInputs[question.field] || '';

    return (
      <div style={styles.questionCard}>
        <h3 style={styles.questionTitle}>
          {currentQuestion + 1}/{questions.length} - {question.question}
          {question.required && <span style={{ color: '#ef4444' }}> *</span>}
        </h3>

        {question.type === 'text' && (
          <input
            type="text"
            value={currentValue}
            style={styles.input}
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
          <div style={styles.optionsGrid}>
            {question.options.map(option => (
              <button
                key={option}
                style={{
                  ...styles.optionButton,
                  background: currentValue === option ? '#10b981' : 'white',
                  color: currentValue === option ? 'white' : '#374151'
                }}
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
            style={styles.input}
            onChange={(e) => setUserInputs(prev => ({ ...prev, [question.field]: e.target.value }))}
          />
        )}

        {question.type === 'textarea' && (
          <textarea
            value={currentValue}
            style={styles.textarea}
            rows="3"
            placeholder={`Enter ${question.field.replace(/_/g, ' ')}...`}
            onChange={(e) => setUserInputs(prev => ({ ...prev, [question.field]: e.target.value }))}
          />
        )}

        <div style={styles.questionActions}>
          <button
            style={styles.nextButton}
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

        <div style={styles.progress}>
          <div style={{
            width: `${((currentQuestion + 1) / questions.length) * 100}%`,
            height: '4px',
            background: '#10b981',
            borderRadius: '2px'
          }}></div>
        </div>
      </div>
    );
  };

  // STEP 1: IEC Input
  if (currentStep === 1) {
    return (
      <div style={styles.container}>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: '14%' }}></div>
        </div>
        <div style={styles.stepIndicator}>Step 1 of 8</div>

        <div style={styles.card}>
          <h2 style={styles.title}>🏢 Enter Your IEC Number</h2>
          <p style={styles.subtitle}>We'll auto-fill your company details</p>

          <input
            type="text"
            value={iecNumber}
            onChange={(e) => setIecNumber(e.target.value)}
            placeholder="Enter IEC (e.g., demo)"
            style={styles.input}
          />

          <button onClick={handleIECSubmit} style={styles.primaryButton}>
            Continue →
          </button>

          <p style={styles.hint}>💡 Try "demo" for testing</p>
        </div>
      </div>
    );
  }

  // STEP 2: HSN Code
  if (currentStep === 2 && companyData) {
    return (
      <div style={styles.container}>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: '28%' }}></div>
        </div>
        <div style={styles.stepIndicator}>Step 2 of 8</div>

        <div style={styles.successBox}>
          <h3 style={{ color: '#10b981' }}>✅ Company Found</h3>
          <p><strong>{companyData.companyName}</strong></p>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>{companyData.fullAddress}</p>
        </div>

        <div style={styles.card}>
          <h2 style={styles.title}>📦 Enter HSN Code</h2>
          <p style={styles.subtitle}>We'll show required certificates for your product</p>

          <input
            type="text"
            value={hsnCode}
            onChange={(e) => setHsnCode(e.target.value)}
            placeholder="Enter HSN Code (e.g., 09041100)"
            style={styles.input}
            maxLength="8"
          />

          <div style={styles.buttonGroup}>
            <button onClick={() => setCurrentStep(1)} style={styles.secondaryButton}>
              ← Back
            </button>
            <button onClick={handleHSNSubmit} style={styles.primaryButton}>
              Continue →
            </button>
          </div>

          <p style={styles.hint}>💡 Try "09041100" (spices) or "52051100" (textiles)</p>
        </div>
      </div>
    );
  }

  // STEP 3: Show Certificates + Select Country
  if (currentStep === 3 && certificates) {
    return (
      <div style={styles.container}>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: '42%' }}></div>
        </div>
        <div style={styles.stepIndicator}>Step 3 of 8</div>

        {/* Show certificates alert */}
        {certificates.found && certificates.certificates.length > 0 && (
          <div style={styles.alertBox}>
            <h3 style={{ color: '#2563eb', marginBottom: '15px' }}>
              📋 Required Certificates for {certificates.category}
            </h3>
            <p style={{ marginBottom: '15px' }}>{certificates.description}</p>

            {certificates.certificates.map((cert, idx) => (
              <div key={idx} style={styles.certCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <strong>{cert.name}</strong>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: '5px 0' }}>
                      {cert.reason}
                    </p>
                    <p style={{ fontSize: '12px', color: '#9ca3af' }}>
                      Issuer: {cert.issuer} • Cost: {cert.cost} • Time: {cert.processingTime}
                    </p>
                  </div>
                  <span style={{
                    padding: '4px 12px',
                    background: '#dbeafe',
                    color: '#1e40af',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    Required
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={styles.card}>
          <h2 style={styles.title}>🌍 Select Destination Country</h2>
          <p style={styles.subtitle}>We'll show country-specific requirements</p>

          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            style={styles.select}
          >
            <option value="">-- Select Country --</option>
            <option value="UAE">United Arab Emirates (UAE)</option>
            <option value="USA">United States (USA)</option>
            <option value="Germany">Germany (EU)</option>
          </select>

          <div style={styles.buttonGroup}>
            <button onClick={() => setCurrentStep(2)} style={styles.secondaryButton}>
              ← Back
            </button>
            <button onClick={handleCountrySubmit} style={styles.primaryButton}>
              Continue →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STEP 4: Show Country Documents + Ask Country-Specific Questions
  if (currentStep === 4 && countryInfo) {
    return (
      <div style={styles.container}>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: '56%' }}></div>
        </div>
        <div style={styles.stepIndicator}>Step 4 of 8</div>

        {/* Show required documents */}
        <div style={styles.alertBox}>
          <h3 style={{ color: '#10b981', marginBottom: '15px' }}>
            📄 Required Documents for {countryInfo.countryName}
          </h3>

          <div style={{ display: 'grid', gap: '8px' }}>
            {countryInfo.documents.map((doc, idx) => (
              <div key={idx} style={styles.docItem}>
                ✅ {doc}
              </div>
            ))}
          </div>

          {countryInfo.ftaInfo.available && (
            <div style={{ marginTop: '15px', padding: '12px', background: '#d1fae5', borderRadius: '8px' }}>
              <strong>🎉 FTA Benefit Available!</strong>
              <p style={{ fontSize: '14px', margin: '5px 0 0 0' }}>
                {countryInfo.ftaInfo.name} - {countryInfo.ftaInfo.benefit}
              </p>
            </div>
          )}
        </div>

        {/* Country-specific questions */}
        <div style={styles.card}>
          <h2 style={styles.title}>❓ {countryInfo.countryName}-Specific Questions</h2>

          {countryInfo.specificQuestions.map((q, idx) => (
            <div key={q.id} style={{ marginBottom: '20px' }}>
              <label style={styles.label}>
                {q.question}
                {q.required && <span style={{ color: '#ef4444' }}> *</span>}
              </label>
              <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>
                {q.helpText}
              </p>

              {q.type === 'text' && (
                <input
                  type="text"
                  value={countryAnswers[q.id] || ''}
                  onChange={(e) => setCountryAnswers({
                    ...countryAnswers,
                    [q.id]: e.target.value
                  })}
                  style={styles.input}
                />
              )}

              {q.type === 'yes_no' && (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => setCountryAnswers({ ...countryAnswers, [q.id]: 'yes' })}
                    style={{
                      ...styles.optionButton,
                      background: countryAnswers[q.id] === 'yes' ? '#10b981' : '#f3f4f6',
                      color: countryAnswers[q.id] === 'yes' ? 'white' : '#374151'
                    }}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setCountryAnswers({ ...countryAnswers, [q.id]: 'no' })}
                    style={{
                      ...styles.optionButton,
                      background: countryAnswers[q.id] === 'no' ? '#ef4444' : '#f3f4f6',
                      color: countryAnswers[q.id] === 'no' ? 'white' : '#374151'
                    }}
                  >
                    No
                  </button>
                </div>
              )}
            </div>
          ))}

          <div style={styles.buttonGroup}>
            <button onClick={() => setCurrentStep(3)} style={styles.secondaryButton}>
              ← Back
            </button>
            <button onClick={handleCountryQuestionsSubmit} style={styles.primaryButton}>
              Continue →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STEP 5: Buyer Details
  if (currentStep === 5) {
    return (
      <div style={styles.container}>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: '70%' }}></div>
        </div>
        <div style={styles.stepIndicator}>Step 5 of 8</div>

        <div style={styles.card}>
          <h2 style={styles.title}>👤 Buyer Details</h2>

          <label style={styles.label}>Buyer Company Name *</label>
          <input
            type="text"
            value={buyerDetails.name}
            onChange={(e) => setBuyerDetails({ ...buyerDetails, name: e.target.value })}
            placeholder="ABC Trading LLC"
            style={styles.input}
          />

          <label style={styles.label}>Buyer Address *</label>
          <textarea
            value={buyerDetails.address}
            onChange={(e) => setBuyerDetails({ ...buyerDetails, address: e.target.value })}
            placeholder="Full address with country"
            rows="3"
            style={styles.textarea}
          />

          <label style={styles.label}>Buyer Email</label>
          <input
            type="email"
            value={buyerDetails.email}
            onChange={(e) => setBuyerDetails({ ...buyerDetails, email: e.target.value })}
            placeholder="buyer@example.com"
            style={styles.input}
          />

          <label style={styles.label}>Buyer Phone</label>
          <input
            type="tel"
            value={buyerDetails.phone}
            onChange={(e) => setBuyerDetails({ ...buyerDetails, phone: e.target.value })}
            placeholder="+971-4-1234567"
            style={styles.input}
          />

          <label style={styles.label}>Buyer Reference</label>
          <input
            type="text"
            value={buyerDetails.reference}
            onChange={(e) => setBuyerDetails({ ...buyerDetails, reference: e.target.value })}
            placeholder="Buyer reference number"
            style={styles.input}
          />

          <div style={styles.buttonGroup}>
            <button onClick={() => setCurrentStep(4)} style={styles.secondaryButton}>
              ← Back
            </button>
            <button onClick={handleBuyerSubmit} style={styles.primaryButton}>
              Continue →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STEP 6: Product Details
  if (currentStep === 6) {
    const totalValue = (productDetails.quantity * productDetails.price).toFixed(2);

    return (
      <div style={styles.container}>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: '84%' }}></div>
        </div>
        <div style={styles.stepIndicator}>Step 6 of 8</div>

        <div style={styles.card}>
          <h2 style={styles.title}>📦 Product Details</h2>

          <label style={styles.label}>Product Description *</label>
          <input
            type="text"
            value={productDetails.description}
            onChange={(e) => setProductDetails({ ...productDetails, description: e.target.value })}
            placeholder="Red Chili Powder"
            style={styles.input}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={styles.label}>Quantity *</label>
              <input
                type="number"
                value={productDetails.quantity}
                onChange={(e) => setProductDetails({ ...productDetails, quantity: e.target.value })}
                placeholder="1000"
                style={styles.input}
              />
            </div>

            <div>
              <label style={styles.label}>Unit</label>
              <select
                value={productDetails.unit}
                onChange={(e) => setProductDetails({ ...productDetails, unit: e.target.value })}
                style={styles.select}
              >
                <option>KG</option>
                <option>MT</option>
                <option>PCS</option>
                <option>BOXES</option>
              </select>
            </div>
          </div>

          <label style={styles.label}>Price per Unit (USD) *</label>
          <input
            type="number"
            value={productDetails.price}
            onChange={(e) => setProductDetails({ ...productDetails, price: e.target.value })}
            placeholder="5.00"
            step="0.01"
            style={styles.input}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={styles.label}>Net Weight (Kg)</label>
              <input
                type="number"
                value={productDetails.net_weight}
                onChange={(e) => setProductDetails({ ...productDetails, net_weight: e.target.value })}
                placeholder="Net weight"
                style={styles.input}
              />
            </div>

            <div>
              <label style={styles.label}>Gross Weight (Kg)</label>
              <input
                type="number"
                value={productDetails.gross_weight}
                onChange={(e) => setProductDetails({ ...productDetails, gross_weight: e.target.value })}
                placeholder="Gross weight"
                style={styles.input}
              />
            </div>
          </div>

          <label style={styles.label}>Packaging Type</label>
          <input
            type="text"
            value={productDetails.packaging}
            onChange={(e) => setProductDetails({ ...productDetails, packaging: e.target.value })}
            placeholder="10 cartons x 100 KG each"
            style={styles.input}
          />

          <label style={styles.label}>Measurements</label>
          <input
            type="text"
            value={productDetails.measurements}
            onChange={(e) => setProductDetails({ ...productDetails, measurements: e.target.value })}
            placeholder="Length x Width x Height"
            style={styles.input}
          />

          {totalValue > 0 && (
            <div style={styles.totalBox}>
              <strong>Total FOB Value:</strong>
              <span style={{ fontSize: '24px', color: '#10b981' }}>
                ${totalValue}
              </span>
            </div>
          )}

          <div style={styles.buttonGroup}>
            <button onClick={() => setCurrentStep(5)} style={styles.secondaryButton}>
              ← Back
            </button>
            <button onClick={handleProductSubmit} style={styles.generateButton}>
              🚀 Generate All Documents
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STEP 7: Extended Questions
  if (currentStep === 7) {
    const questions = getRelevantQuestions();

    return (
      <div style={styles.container}>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: '92%' }}></div>
        </div>
        <div style={styles.stepIndicator}>Step 7 of 8 - Document Details</div>

        <div style={styles.card}>
          <h2 style={styles.title}>📝 Additional Document Information</h2>
          <p style={styles.subtitle}>
            {questions.length - currentQuestion} questions remaining to complete your {countryInfo.documents.length} export documents
          </p>

          {renderCurrentQuestion()}

          {isGenerating && (
            <div style={styles.loadingOverlay}>
              <div style={styles.spinner}></div>
              <p>Generating your export documents...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // STEP 8: Success & Download
  if (currentStep === 8) {
    return (
      <div style={styles.container}>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: '100%' }}></div>
        </div>
        <div style={styles.stepIndicator}>Step 8 of 8 - Complete!</div>

        <div style={styles.card}>
          <div style={styles.successHeader}>
            <div style={styles.successIcon}>🎉</div>
            <h2 style={styles.title}>Documents Generated Successfully!</h2>
            <p style={styles.subtitle}>Your {generatedDocuments.length} export documents are ready for download</p>
          </div>

          <div style={styles.documentsList}>
            <h3 style={styles.documentsTitle}>Generated Documents:</h3>
            {generatedDocuments.map((doc, index) => (
              <div key={index} style={styles.documentItem}>
                ✅ {doc.name}
              </div>
            ))}
          </div>

          {/* Template Previews */}
          <div style={styles.templatePreviews}>
            <h3 style={styles.documentsTitle}>Document Previews:</h3>
            {generatedDocuments.map((doc, index) => (
              <div key={index} style={styles.templatePreview}>
                <h4>{doc.name}</h4>
                <div style={styles.templateContainer}>
                  {renderTemplateComponent(doc.id, doc.props)}
                </div>
              </div>
            ))}
          </div>

          <div style={styles.downloadSection}>
            <button
              onClick={downloadCombinedPDF}
              style={styles.downloadButton}
              disabled={isDownloading}
            >
              {isDownloading ? '⏳ Generating PDF...' : '📥 Download All Documents as Single PDF'}
            </button>
            <p style={styles.downloadHint}>All {generatedDocuments.length} documents will be combined into one PDF file</p>
          </div>

          <div style={styles.actions}>
            <button
              style={styles.secondaryButton}
              onClick={() => {
                // Reset for new export
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
                setBuyerDetails({
                  name: '', address: '', email: '', phone: '', reference: ''
                });
                setProductDetails({
                  description: '', quantity: '', unit: 'KG', price: '', packaging: '',
                  net_weight: '', gross_weight: '', measurements: ''
                });
              }}
            >
              Create New Export
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// Styles
const styles = {
  container: {
    padding: '40px 20px',
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  progressBar: {
    width: '100%',
    height: '8px',
    background: '#e5e7eb',
    borderRadius: '4px',
    marginBottom: '10px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #10b981, #059669)',
    transition: 'width 0.3s ease'
  },
  stepIndicator: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '30px'
  },
  card: {
    background: 'white',
    padding: '30px',
    borderRadius: '16px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    position: 'relative'
  },
  successBox: {
    background: '#d1fae5',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '20px',
    border: '2px solid #10b981'
  },
  alertBox: {
    background: '#eff6ff',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '20px',
    border: '2px solid #3b82f6'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#1f2937',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: '16px',
    color: '#6b7280',
    marginBottom: '25px',
    textAlign: 'center'
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    marginBottom: '15px',
    outline: 'none'
  },
  textarea: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    marginBottom: '15px',
    fontFamily: 'inherit',
    outline: 'none',
    resize: 'vertical'
  },
  select: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    marginBottom: '15px',
    outline: 'none',
    cursor: 'pointer'
  },
  label: {
    display: 'block',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#374151'
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px'
  },
  primaryButton: {
    flex: 2,
    padding: '15px',
    fontSize: '16px',
    fontWeight: 'bold',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  secondaryButton: {
    flex: 1,
    padding: '15px',
    fontSize: '16px',
    background: '#6b7280',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  generateButton: {
    flex: 2,
    padding: '15px',
    fontSize: '18px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #10b981, #059669)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(16, 185, 129, 0.3)'
  },
  hint: {
    fontSize: '14px',
    color: '#9ca3af',
    marginTop: '10px',
    textAlign: 'center'
  },
  certCard: {
    padding: '15px',
    background: 'white',
    borderRadius: '8px',
    marginBottom: '10px',
    border: '1px solid #e5e7eb'
  },
  docItem: {
    padding: '10px',
    background: 'white',
    borderRadius: '6px',
    fontSize: '14px'
  },
  optionButton: {
    flex: 1,
    padding: '10px',
    fontSize: '14px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500'
  },
  totalBox: {
    padding: '20px',
    background: '#f0fdf4',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    border: '2px solid #10b981'
  },
  questionCard: {
    background: '#f8fafc',
    padding: '25px',
    borderRadius: '12px',
    border: '2px solid #e2e8f0'
  },
  questionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '15px',
    color: '#1e293b'
  },
  optionsGrid: {
    display: 'grid',
    gap: '10px',
    marginBottom: '15px'
  },
  questionActions: {
    marginTop: '20px'
  },
  nextButton: {
    width: '100%',
    padding: '15px',
    fontSize: '16px',
    fontWeight: 'bold',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  progress: {
    marginTop: '20px',
    background: '#e2e8f0',
    borderRadius: '2px',
    overflow: 'hidden'
  },
  successHeader: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  successIcon: {
    fontSize: '60px',
    marginBottom: '20px'
  },
  documentsList: {
    background: '#f0fdf4',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '25px'
  },
  documentsTitle: {
    marginBottom: '15px',
    color: '#065f46'
  },
  documentItem: {
    padding: '10px',
    background: 'white',
    marginBottom: '8px',
    borderRadius: '6px',
    border: '1px solid #dcfce7'
  },
  templatePreviews: {
    marginBottom: '25px'
  },
  templatePreview: {
    marginBottom: '30px',
    padding: '20px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    background: '#fafafa'
  },
  templateContainer: {
    maxWidth: '100%',
    overflow: 'auto'
  },
  downloadSection: {
    textAlign: 'center',
    marginBottom: '25px'
  },
  downloadButton: {
    width: '100%',
    padding: '20px',
    fontSize: '18px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #10b981, #059669)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    marginBottom: '10px'
  },
  downloadHint: {
    fontSize: '14px',
    color: '#6b7280'
  },
  actions: {
    display: 'flex',
    gap: '10px'
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255,255,255,0.9)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '16px'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #10b981',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '15px'
  }
};

// Add CSS animation
const styleSheet = document.styleSheets[0];
if (styleSheet) {
  styleSheet.insertRule(`
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `, styleSheet.cssRules.length);
}

export default ExtendedSmartDocGenerator;