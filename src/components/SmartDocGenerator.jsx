import React, { useState } from 'react';
import { lookupIEC } from '../utils/iecLookup';
import { getCertificatesByHSN } from '../utils/certificateHelper';
import { getCountryInfo, getCountrySpecificQuestions } from '../utils/documentSelector';

function SmartDocGenerator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [iecNumber, setIecNumber] = useState('');
  const [companyData, setCompanyData] = useState(null);
  
  // Form data
  const [hsnCode, setHsnCode] = useState('');
  const [certificates, setCertificates] = useState(null);
  const [destination, setDestination] = useState('');
  const [countryInfo, setCountryInfo] = useState(null);
  const [countryAnswers, setCountryAnswers] = useState({});
  const [buyerDetails, setBuyerDetails] = useState({
    name: '',
    address: '',
    email: '',
    phone: ''
  });
  const [productDetails, setProductDetails] = useState({
    description: '',
    quantity: '',
    unit: 'KG',
    price: '',
    packaging: ''
  });
  
  // Step 1: IEC Lookup
  const handleIECSubmit = () => {
    const result = lookupIEC(iecNumber);
    if (result.success) {
      setCompanyData(result.data);
      setCurrentStep(2);
    } else {
      alert(result.error);
    }
  };
  
  // Step 2: HSN Code
  const handleHSNSubmit = () => {
    if (!hsnCode || hsnCode.length < 4) {
      alert('Please enter valid HSN code (min 4 digits)');
      return;
    }
    
    const certInfo = getCertificatesByHSN(hsnCode);
    setCertificates(certInfo);
    setCurrentStep(3);
  };
  
  // Step 3: Destination Country
 // Step 3: Destination Country
const handleCountrySubmit = () => {
  console.log("🚀 handleCountrySubmit called");
  console.log("Selected destination:", destination);
  
  if (!destination) {
    alert('Please select destination');
    return;
  }
  
  try {
    const info = getCountryInfo(destination);
    console.log("✅ Got country info:", info);
    
    if (!info) {
      alert('Error: Could not load country data');
      return;
    }
    
    setCountryInfo(info);
    console.log("✅ State updated, moving to step 4");
    setCurrentStep(4);
  } catch (error) {
    console.error("❌ Error in handleCountrySubmit:", error);
    alert('Error: ' + error.message);
  }
};

  
  // Step 4: Country-specific questions
  const handleCountryQuestionsSubmit = () => {
    setCurrentStep(5);
  };
  
  // Step 5: Buyer details
  const handleBuyerSubmit = () => {
    if (!buyerDetails.name || !buyerDetails.address) {
      alert('Please fill buyer name and address');
      return;
    }
    setCurrentStep(6);
  };
  
  // Step 6: Product details
  const handleProductSubmit = () => {
    if (!productDetails.description || !productDetails.quantity || !productDetails.price) {
      alert('Please fill all product details');
      return;
    }
    setCurrentStep(7);
  };
  
  // Step 7: Generate
  const handleGenerate = () => {
    alert(`Will generate documents!\n\nCompany: ${companyData.companyName}\nBuyer: ${buyerDetails.name}\nProduct: ${productDetails.description}`);
    // TODO: Call TemplateEngine here
  };
  
  // UI RENDERING
  
  // STEP 1: IEC Input
  if (currentStep === 1) {
    return (
      <div style={styles.container}>
        <div style={styles.progressBar}>
          <div style={{...styles.progressFill, width: '14%'}}></div>
        </div>
        <div style={styles.stepIndicator}>Step 1 of 7</div>
        
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
          <div style={{...styles.progressFill, width: '28%'}}></div>
        </div>
        <div style={styles.stepIndicator}>Step 2 of 7</div>
        
        <div style={styles.successBox}>
          <h3 style={{color: '#10b981'}}>✅ Company Found</h3>
          <p><strong>{companyData.companyName}</strong></p>
          <p style={{fontSize: '14px', color: '#6b7280'}}>{companyData.fullAddress}</p>
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
          <div style={{...styles.progressFill, width: '42%'}}></div>
        </div>
        <div style={styles.stepIndicator}>Step 3 of 7</div>
        
        {/* Show certificates alert */}
        {certificates.found && certificates.certificates.length > 0 && (
          <div style={styles.alertBox}>
            <h3 style={{color: '#2563eb', marginBottom: '15px'}}>
              📋 Required Certificates for {certificates.category}
            </h3>
            <p style={{marginBottom: '15px'}}>{certificates.description}</p>
            
            {certificates.certificates.map((cert, idx) => (
              <div key={idx} style={styles.certCard}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                  <div style={{flex: 1}}>
                    <strong>{cert.name}</strong>
                    <p style={{fontSize: '14px', color: '#6b7280', margin: '5px 0'}}>
                      {cert.reason}
                    </p>
                    <p style={{fontSize: '12px', color: '#9ca3af'}}>
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
          <div style={{...styles.progressFill, width: '56%'}}></div>
        </div>
        <div style={styles.stepIndicator}>Step 4 of 7</div>
        
        {/* Show required documents */}
        <div style={styles.alertBox}>
          <h3 style={{color: '#10b981', marginBottom: '15px'}}>
            📄 Required Documents for {countryInfo.countryName}
          </h3>
          
          <div style={{display: 'grid', gap: '8px'}}>
            {countryInfo.documents.map((doc, idx) => (
              <div key={idx} style={styles.docItem}>
                ✅ {doc}
              </div>
            ))}
          </div>
          
          {countryInfo.ftaInfo.available && (
            <div style={{marginTop: '15px', padding: '12px', background: '#d1fae5', borderRadius: '8px'}}>
              <strong>🎉 FTA Benefit Available!</strong>
              <p style={{fontSize: '14px', margin: '5px 0 0 0'}}>
                {countryInfo.ftaInfo.name} - {countryInfo.ftaInfo.benefit}
              </p>
            </div>
          )}
        </div>
        
        {/* Country-specific questions */}
        <div style={styles.card}>
          <h2 style={styles.title}>❓ {countryInfo.countryName}-Specific Questions</h2>
          
          {countryInfo.specificQuestions.map((q, idx) => (
            <div key={q.id} style={{marginBottom: '20px'}}>
              <label style={styles.label}>
                {q.question}
                {q.required && <span style={{color: '#ef4444'}}> *</span>}
              </label>
              <p style={{fontSize: '13px', color: '#6b7280', marginBottom: '8px'}}>
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
                <div style={{display: 'flex', gap: '10px'}}>
                  <button
                    onClick={() => setCountryAnswers({...countryAnswers, [q.id]: 'yes'})}
                    style={{
                      ...styles.optionButton,
                      background: countryAnswers[q.id] === 'yes' ? '#10b981' : '#f3f4f6',
                      color: countryAnswers[q.id] === 'yes' ? 'white' : '#374151'
                    }}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setCountryAnswers({...countryAnswers, [q.id]: 'no'})}
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
          <div style={{...styles.progressFill, width: '70%'}}></div>
        </div>
        <div style={styles.stepIndicator}>Step 5 of 7</div>
        
        <div style={styles.card}>
          <h2 style={styles.title}>👤 Buyer Details</h2>
          
          <label style={styles.label}>Buyer Company Name *</label>
          <input
            type="text"
            value={buyerDetails.name}
            onChange={(e) => setBuyerDetails({...buyerDetails, name: e.target.value})}
            placeholder="ABC Trading LLC"
            style={styles.input}
          />
          
          <label style={styles.label}>Buyer Address *</label>
          <textarea
            value={buyerDetails.address}
            onChange={(e) => setBuyerDetails({...buyerDetails, address: e.target.value})}
            placeholder="Full address with country"
            rows="3"
            style={styles.textarea}
          />
          
          <label style={styles.label}>Buyer Email</label>
          <input
            type="email"
            value={buyerDetails.email}
            onChange={(e) => setBuyerDetails({...buyerDetails, email: e.target.value})}
            placeholder="buyer@example.com"
            style={styles.input}
          />
          
          <label style={styles.label}>Buyer Phone</label>
          <input
            type="tel"
            value={buyerDetails.phone}
            onChange={(e) => setBuyerDetails({...buyerDetails, phone: e.target.value})}
            placeholder="+971-4-1234567"
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
          <div style={{...styles.progressFill, width: '84%'}}></div>
        </div>
        <div style={styles.stepIndicator}>Step 6 of 7</div>
        
        <div style={styles.card}>
          <h2 style={styles.title}>📦 Product Details</h2>
          
          <label style={styles.label}>Product Description *</label>
          <input
            type="text"
            value={productDetails.description}
            onChange={(e) => setProductDetails({...productDetails, description: e.target.value})}
            placeholder="Red Chili Powder"
            style={styles.input}
          />
          
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
            <div>
              <label style={styles.label}>Quantity *</label>
              <input
                type="number"
                value={productDetails.quantity}
                onChange={(e) => setProductDetails({...productDetails, quantity: e.target.value})}
                placeholder="1000"
                style={styles.input}
              />
            </div>
            
            <div>
              <label style={styles.label}>Unit</label>
              <select
                value={productDetails.unit}
                onChange={(e) => setProductDetails({...productDetails, unit: e.target.value})}
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
            onChange={(e) => setProductDetails({...productDetails, price: e.target.value})}
            placeholder="5.00"
            step="0.01"
            style={styles.input}
          />
          
          {totalValue > 0 && (
            <div style={styles.totalBox}>
              <strong>Total FOB Value:</strong>
              <span style={{fontSize: '24px', color: '#10b981'}}>
                ${totalValue}
              </span>
            </div>
          )}
          
          <label style={styles.label}>Packaging Type</label>
          <input
            type="text"
            value={productDetails.packaging}
            onChange={(e) => setProductDetails({...productDetails, packaging: e.target.value})}
            placeholder="10 cartons x 100 KG each"
            style={styles.input}
          />
          
          <div style={styles.buttonGroup}>
            <button onClick={() => setCurrentStep(5)} style={styles.secondaryButton}>
              ← Back
            </button>
            <button onClick={handleProductSubmit} style={styles.primaryButton}>
              Continue →
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // STEP 7: Review & Generate
  if (currentStep === 7) {
    const totalValue = (productDetails.quantity * productDetails.price).toFixed(2);
    
    return (
      <div style={styles.container}>
        <div style={styles.progressBar}>
          <div style={{...styles.progressFill, width: '100%'}}></div>
        </div>
        <div style={styles.stepIndicator}>Step 7 of 7 - Final Review</div>
        
        <div style={styles.card}>
          <h2 style={styles.title}>📋 Review All Details</h2>
          
          <div style={styles.reviewSection}>
            <h4>🏢 Exporter</h4>
            <p>{companyData.companyName}</p>
            <p style={{fontSize: '14px', color: '#6b7280'}}>{companyData.fullAddress}</p>
          </div>
          
          <div style={styles.reviewSection}>
            <h4>👤 Buyer</h4>
            <p>{buyerDetails.name}</p>
            <p style={{fontSize: '14px', color: '#6b7280'}}>{buyerDetails.address}</p>
          </div>
          
          <div style={styles.reviewSection}>
            <h4>📦 Product</h4>
            <p>{productDetails.description} (HSN: {hsnCode})</p>
            <p>{productDetails.quantity} {productDetails.unit} × ${productDetails.price} = <strong>${totalValue}</strong></p>
          </div>
          
          <div style={styles.reviewSection}>
            <h4>🌍 Destination</h4>
            <p>{countryInfo.countryName}</p>
          </div>
          
          <div style={styles.reviewSection}>
            <h4>📄 Documents to Generate ({countryInfo.documents.length})</h4>
            {countryInfo.documents.map((doc, idx) => (
              <div key={idx} style={{fontSize: '14px', marginBottom: '4px'}}>
                ✅ {doc}
              </div>
            ))}
          </div>
          
          {certificates.found && certificates.certificates.length > 0 && (
            <div style={styles.reviewSection}>
              <h4>📋 Required Certificates ({certificates.certificates.length})</h4>
              {certificates.certificates.map((cert, idx) => (
                <div key={idx} style={{fontSize: '14px', marginBottom: '4px'}}>
                  ⚠️ {cert.name}
                </div>
              ))}
            </div>
          )}
          
          <div style={styles.buttonGroup}>
            <button onClick={() => setCurrentStep(6)} style={styles.secondaryButton}>
              ← Edit
            </button>
            <button onClick={handleGenerate} style={styles.generateButton}>
              🚀 Generate All Documents
            </button>
          </div>
        </div>
      </div>
    );
  }
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
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
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
    color: '#1f2937'
  },
  subtitle: {
    fontSize: '16px',
    color: '#6b7280',
    marginBottom: '25px'
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
    outline: 'none'
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
  reviewSection: {
    padding: '15px 0',
    borderBottom: '1px solid #e5e7eb',
    marginBottom: '15px'
  }
};

export default SmartDocGenerator;
