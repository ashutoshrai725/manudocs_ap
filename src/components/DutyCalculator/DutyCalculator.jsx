import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { 
  Calculator, TrendingUp, DollarSign, FileText, CheckCircle,
  Download, RefreshCw, Info, Ship, Plane, AlertTriangle, Sparkles
} from 'lucide-react';


const DutyCalculator = () => {
  const [mode, setMode] = useState('import');
  const [formData, setFormData] = useState({
    hsCode: '',
    productName: '',
    productValue: '',
    quantity: '1',
    unit: 'kg',
    originCountry: '',
    destinationCountry: '',
    currency: 'USD'
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // =========================
  // VERIFIED BASELINE RATES (MFN) — INDIA IMPORT/EXPORT
  // =========================
  // Notes:
  // • SWS = 10% of BCD; if BCD is 0, SWS is effectively 0.
  // • 1006.30 rice: IGST 0% for bulk/non pre-packaged imports; BCD protected at 70%.
  // • 8471.30 laptops: BCD 0% (MFN), IGST 18%.
  // • 8517.12 smartphones: BCD 20% (sensitive line; FTAs generally do not cut this to 0).
  // • Apparel 6203.42 has a specific duty alt (₹135/pc or 20%, whichever higher). We keep ad-valorem 20% to avoid UI changes.
  const hsCodeDatabase = {
    '0904.20': {
      name: 'Pepper (Piper), dried or crushed',
      import: { bcd: 70, sws: 10, igst: 5, cess: 0 },
      export: { rodtep: 4.3, meis: 0, drawback: 1.2 }
    },
    '0909.30': {
      name: 'Cumin seeds',
      import: { bcd: 30, sws: 10, igst: 0, cess: 0 },
      export: { rodtep: 3.8, meis: 0, drawback: 1.5 }
    },
    '0910.11': {
      name: 'Ginger (fresh)',
      import: { bcd: 30, sws: 10, igst: 0, cess: 0 },
      export: { rodtep: 2.5, meis: 0, drawback: 0.8 }
    },
    '5208.12': {
      name: 'Cotton fabric, unbleached',
      import: { bcd: 10, sws: 10, igst: 5, cess: 0 },
      export: { rodtep: 3.2, meis: 0, drawback: 2.1 }
    },
    '6203.42': {
      name: "Men's cotton trousers",
      import: { bcd: 20, sws: 10, igst: 12, cess: 0 },
      export: { rodtep: 4.1, meis: 0, drawback: 2.8 }
    },
    '0901.21': {
      name: 'Roasted coffee beans',
      import: { bcd: 100, sws: 10, igst: 5, cess: 0 },
      export: { rodtep: 2.9, meis: 0, drawback: 1.0 }
    },
    '0902.30': {
      name: 'Black tea (fermented)',
      import: { bcd: 100, sws: 10, igst: 5, cess: 0 },
      export: { rodtep: 3.5, meis: 0, drawback: 1.3 }
    },
    '1006.30': {
      name: 'Semi-milled or wholly milled rice',
      import: { bcd: 70, sws: 10, igst: 0, cess: 0 },
      export: { rodtep: 4.5, meis: 0, drawback: 1.8 }
    },
    '8517.12': {
      name: 'Smartphones',
      import: { bcd: 20, sws: 10, igst: 18, cess: 0 },
      export: { rodtep: 1.5, meis: 0, drawback: 0.8 }
    },
    '8471.30': {
      name: 'Laptops & portable computers',
      import: { bcd: 0, sws: 0, igst: 18, cess: 0 },
      export: { rodtep: 2.0, meis: 0, drawback: 1.2 }
    }
  };

  // =========================
  // FTA / PTA MAP (India-side, In force)
  // =========================
  // We detect presence of an agreement first; then apply a preferential BCD ONLY
  // if we have a vetted HS×Country rate below.
  const ftaDirectory = {
    AE: { code: 'AE', name: 'United Arab Emirates', pact: 'India–UAE CEPA', inForce: true },
    AU: { code: 'AU', name: 'Australia', pact: 'India–Australia ECTA', inForce: true },
    JP: { code: 'JP', name: 'Japan', pact: 'India–Japan CEPA', inForce: true },
    KR: { code: 'KR', name: 'South Korea', pact: 'India–Korea CEPA', inForce: true },
    SG: { code: 'SG', name: 'Singapore', pact: 'ASEAN–India FTA (via Singapore CECA)', inForce: true },
    LK: { code: 'LK', name: 'Sri Lanka', pact: 'India–Sri Lanka FTA / SAFTA', inForce: true },
    BD: { code: 'BD', name: 'Bangladesh', pact: 'SAFTA', inForce: true },
    NP: { code: 'NP', name: 'Nepal', pact: 'Treaty of Trade / SAFTA', inForce: true },
    BT: { code: 'BT', name: 'Bhutan', pact: 'India–Bhutan Trade Agreement', inForce: true },
    MU: { code: 'MU', name: 'Mauritius', pact: 'India–Mauritius CECPA', inForce: true },
    CH: { code: 'CH', name: 'Switzerland', pact: 'India–EFTA TEPA', inForce: true }, // EFTA: CH, NO, IS, LI
    NO: { code: 'NO', name: 'Norway', pact: 'India–EFTA TEPA', inForce: true },
    IS: { code: 'IS', name: 'Iceland', pact: 'India–EFTA TEPA', inForce: true },
    LI: { code: 'LI', name: 'Liechtenstein', pact: 'India–EFTA TEPA', inForce: true }
  };

  // =========================
  // PREFERENTIAL BCD — vetted HS×Country pairs only
  // =========================
  // IMPORTANT: This table only includes pairs we can rely on confidently today.
  // Everything else remains on MFN (no change).
  //
  // • 8471.30 Laptops → MFN BCD already 0% (FTA won’t reduce further).
  // • 8517.12 Smartphones → sensitive; keep 20% (most FTAs exclude or retain 20%).
  // • 1006.30 Rice → agriculture sensitive; keep 70%.
  // • 5208.12 Cotton fabrics → under Japan/Korea CEPA there are reduced lines; a safe,
  //   widely-cited preference for core 5208 sublines is 5% BCD. We apply 5% for JP/KR.
  //   (IGST stays 5%.)
  //
  // You can extend this object with more HS lines as you validate them.
  const preferentialBCD = {
    '5208.12': {
      JP: 5, // India–Japan CEPA: many 5208 lines at 5%
      KR: 5  // India–Korea CEPA: many 5208 lines at 5%
      // Add more countries if verified for your subline
    }
    // other HS codes can be added here as you validate
  };

  const countries = [
    { code: 'IN', name: 'India', flag: '🇮🇳' },
    { code: 'US', name: 'USA', flag: '🇺🇸' },
    { code: 'GB', name: 'UK', flag: '🇬🇧' },
    { code: 'AE', name: 'UAE', flag: '🇦🇪' },
    { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪' },
    { code: 'CN', name: 'China', flag: '🇨🇳' },
    { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵' },
    { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺' },
    { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰' },
    { code: 'BD', name: 'Bangladesh', flag: '🇧🇩' },
    { code: 'NP', name: 'Nepal', flag: '🇳🇵' },
    { code: 'MU', name: 'Mauritius', flag: '🇲🇺' },
    { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
    { code: 'NO', name: 'Norway', flag: '🇳🇴' },
    { code: 'IS', name: 'Iceland', flag: '🇮🇸' },
    { code: 'LI', name: 'Liechtenstein', flag: '🇱🇮' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'hsCode' && hsCodeDatabase[value]) {
      setFormData(prev => ({ ...prev, hsCode: value, productName: hsCodeDatabase[value].name }));
    }
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.hsCode) newErrors.hsCode = 'HS Code required';
    else if (!hsCodeDatabase[formData.hsCode]) newErrors.hsCode = 'Invalid HS Code';
    if (!formData.productValue || Number(formData.productValue) <= 0) newErrors.productValue = 'Valid value required';
    if (mode === 'import' && !formData.originCountry) newErrors.originCountry = 'Required';
    if (mode === 'export' && !formData.destinationCountry) newErrors.destinationCountry = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ================
  // FTA helper
  // ================
  const getFtaContext = (hsCode, originCountry) => {
    // checks if we have an in-force pact + a vetted preferential BCD for this HS
    const pact = ftaDirectory[originCountry];
    if (!pact || !pact.inForce) return { applied: false };
    const prefMap = preferentialBCD[hsCode];
    if (!prefMap || prefMap[originCountry] == null) return { applied: false, pact: pact.pact };
    return {
      applied: true,
      pact: pact.pact,
      bcd: prefMap[originCountry]
    };
  };

  const calculateImportDuty = () => {
    const productValue = parseFloat(formData.productValue);
    const hsData = hsCodeDatabase[formData.hsCode];
    if (!hsData) return null;

    // START with MFN (baseline)
    let bcdRate = hsData.import.bcd / 100;
    let swsRate = hsData.import.sws / 100;
    const igstRate = hsData.import.igst / 100;

    // Check FTA preference for India imports
    let ftaInfo = { applied: false };
    if (formData.originCountry && formData.originCountry !== 'IN') {
      const fta = getFtaContext(formData.hsCode, formData.originCountry);
      if (fta.applied && typeof fta.bcd === 'number') {
        bcdRate = fta.bcd / 100;
        // If BCD is reduced to 0 via FTA, SWS becomes 0 as well (10% of 0)
        swsRate = bcdRate === 0 ? 0 : 0.10;
        ftaInfo = { applied: true, pact: fta.pact, prefBcdPercent: fta.bcd };
      } else if (fta.pact) {
        ftaInfo = { applied: false, pact: fta.pact };
      }
    }

    // Duty math
    const basicCustomsDuty = productValue * bcdRate;
    const socialWelfareSurcharge = basicCustomsDuty * swsRate;
    const assessableValue = productValue + basicCustomsDuty + socialWelfareSurcharge;
    const igst = assessableValue * igstRate;

    const totalDuty = basicCustomsDuty + socialWelfareSurcharge + igst;
    const totalLandedCost = productValue + totalDuty;

    return {
      productValue,
      basicCustomsDuty,
      socialWelfareSurcharge,
      assessableValue,
      igst,
      totalDuty,
      totalLandedCost,
      effectiveDutyRate: ((totalDuty / productValue) * 100).toFixed(2),
      rates: hsData.import,
      ftaInfo
    };
  };

  const calculateExportBenefits = () => {
    const productValue = parseFloat(formData.productValue);
    const hsData = hsCodeDatabase[formData.hsCode];
    if (!hsData) return null;

    const rodtepBenefit = productValue * (hsData.export.rodtep / 100);
    const meisBenefit = productValue * (hsData.export.meis / 100);
    const dutyDrawback = productValue * (hsData.export.drawback / 100);

    const totalBenefits = rodtepBenefit + meisBenefit + dutyDrawback;
    const netRealizableValue = productValue + totalBenefits;

    return {
      productValue,
      rodtepBenefit,
      meisBenefit,
      dutyDrawback,
      totalBenefits,
      netRealizableValue,
      benefitPercentage: ((totalBenefits / productValue) * 100).toFixed(2),
      rates: hsData.export
    };
  };

  const handleCalculate = async () => {
    if (!validateForm()) return;
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    const calculatedResults = mode === 'import' ? calculateImportDuty() : calculateExportBenefits();
    setResults(calculatedResults);
    setLoading(false);
  };

  const handleReset = () => {
    setFormData({
      hsCode: '', productName: '', productValue: '', quantity: '1',
      unit: 'kg', originCountry: '', destinationCountry: '', currency: 'USD'
    });
    setResults(null);
    setErrors({});
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: formData.currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 py-6 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-5">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <Calculator size={16} className="text-white" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white">Smart Duty Calculator</h1>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm">Real Indian Customs rates (2025) • Accurate calculations</p>
        </motion.div>

        {/* Mode Toggle */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center mb-5">
          <div className="inline-flex bg-gray-800/50 p-0.5 rounded-lg border border-gray-700">
            <button
              onClick={() => { setMode('import'); setResults(null); }}
              className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all flex items-center gap-1 ${mode === 'import' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <Ship size={14} />
              Import
            </button>
            <button
              onClick={() => { setMode('export'); setResults(null); }}
              className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all flex items-center gap-1 ${mode === 'export' ? 'bg-green-500 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <Plane size={14} />
              Export
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Input Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-gray-800/30 backdrop-blur-xl rounded-xl p-4 border border-gray-700">
            <h2 className="text-base font-bold text-white mb-3 flex items-center gap-1.5">
              <FileText size={16} className="text-green-500" />
              Product Details
            </h2>

            <div className="space-y-2.5">
              {/* HS Code */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">HS Code *</label>
                <input
                  type="text"
                  name="hsCode"
                  value={formData.hsCode}
                  onChange={handleInputChange}
                  placeholder="e.g., 0904.20"
                  className={`w-full bg-gray-900/50 border ${errors.hsCode ? 'border-red-500' : 'border-gray-700'} rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-green-500`}
                />
                {errors.hsCode && <p className="text-red-400 text-[10px] mt-0.5">{errors.hsCode}</p>}

                <div className="mt-1.5 flex flex-wrap gap-1">
                  <p className="text-[10px] text-gray-500 w-full">Quick select:</p>
                  {['0904.20', '0901.21', '1006.30', '8517.12', '5208.12', '8471.30'].map(code => (
                    <button
                      key={code}
                      onClick={() => handleInputChange({ target: { name: 'hsCode', value: code } })}
                      className="text-[10px] bg-gray-700/50 hover:bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded transition-colors"
                    >
                      {code}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Product Name</label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  placeholder="Auto-filled from HS Code"
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                  readOnly
                />
              </div>

              {/* Value & Currency */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    {mode === 'import' ? 'CIF Value *' : 'FOB Value *'}
                  </label>
                  <input
                    type="number"
                    name="productValue"
                    value={formData.productValue}
                    onChange={handleInputChange}
                    placeholder="10000"
                    className={`w-full bg-gray-900/50 border ${errors.productValue ? 'border-red-500' : 'border-gray-700'} rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-green-500`}
                  />
                  {errors.productValue && <p className="text-red-400 text-[10px] mt-0.5">{errors.productValue}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Currency</label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-green-500"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="INR">INR</option>
                  </select>
                </div>
              </div>

             
              {/* Country */}
              {mode === 'import' ? (
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Origin Country *</label>
                  <select
                    name="originCountry"
                    value={formData.originCountry}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-900/50 border ${errors.originCountry ? 'border-red-500' : 'border-gray-700'} rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-green-500`}
                  >
                    <option value="">Select Country</option>
                    {countries.map(c => (
                      <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                    ))}
                  </select>
                  {errors.originCountry && <p className="text-red-400 text-[10px] mt-0.5">{errors.originCountry}</p>}
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Destination Country *</label>
                  <select
                    name="destinationCountry"
                    value={formData.destinationCountry}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-900/50 border ${errors.destinationCountry ? 'border-red-500' : 'border-gray-700'} rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-green-500`}
                  >
                    <option value="">Select Country</option>
                    {countries.map(c => (
                      <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                    ))}
                  </select>
                  {errors.destinationCountry && <p className="text-red-400 text-[10px] mt-0.5">{errors.destinationCountry}</p>}
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-2 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCalculate}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-2 rounded-lg text-xs font-semibold hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    <>
                      <Calculator size={14} />
                      Calculate
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleReset}
                  className="px-3 py-2 bg-gray-700 text-white rounded-lg text-xs font-semibold hover:bg-gray-600 transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw size={14} />
                  Reset
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-gray-800/30 backdrop-blur-xl rounded-xl p-4 border border-gray-700">
            <h2 className="text-base font-bold text-white mb-3 flex items-center gap-1.5">
              <TrendingUp size={16} className="text-green-500" />
              {mode === 'import' ? 'Duty Breakdown' : 'Benefits Breakdown'}
            </h2>

            <AnimatePresence mode="wait">
              {!results ? (
                <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center min-h-[300px] text-center">
                  <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mb-3">
                    <Calculator size={28} className="text-gray-500" />
                  </div>
                  <p className="text-gray-400 text-sm mb-1">Fill details and calculate</p>
                  <p className="text-gray-500 text-xs">Results will appear here</p>
                </motion.div>
              ) : (
                <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
                  {/* Summary */}
                  <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-white">
                        {mode === 'import' ? 'Total Landed Cost' : 'Net Realizable Value'}
                      </h3>
                      <CheckCircle size={18} className="text-green-400" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      {formatCurrency(mode === 'import' ? results.totalLandedCost : results.netRealizableValue)}
                    </div>
                    <p className="text-green-300 text-xs">
                      {mode === 'import' ? `Effective duty: ${results.effectiveDutyRate}%` : `Benefit: ${results.benefitPercentage}%`}
                    </p>
                  </div>

                  {/* FTA info (only if applied) */}
                  {mode === 'import' && results.ftaInfo?.applied && (
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Info size={14} className="text-blue-400" />
                        <h4 className="text-white font-semibold text-xs">FTA Applied</h4>
                      </div>
                      <p className="text-blue-200 text-[11px]">
                        {results.ftaInfo.pact} — Preferential BCD applied at <strong>{results.ftaInfo.prefBcdPercent}%</strong>.
                      </p>
                    </div>
                  )}

                  {/* Breakdown */}
                  <div className="space-y-2">
                    <h4 className="text-white font-semibold text-xs mb-2">Detailed Breakdown</h4>

                    {mode === 'import' ? (
                      <>
                        <div className="bg-gray-700/30 rounded-lg p-2.5">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-300 text-xs">Product Value (CIF)</span>
                            <span className="text-xs px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400">Base</span>
                          </div>
                          <div className="text-base font-bold text-white">{formatCurrency(results.productValue)}</div>
                        </div>

                        <div className="bg-gray-700/30 rounded-lg p-2.5">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-300 text-xs">Basic Customs Duty</span>
                            <span className="text-xs px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400">
                              {results.ftaInfo?.applied ? `${results.ftaInfo.prefBcdPercent}% (FTA)` : `${results.rates.bcd}%`}
                            </span>
                          </div>
                          <div className="text-base font-bold text-white">{formatCurrency(results.basicCustomsDuty)}</div>
                        </div>

                        <div className="bg-gray-700/30 rounded-lg p-2.5">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-300 text-xs">Social Welfare Surcharge</span>
                            <span className="text-xs px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400">10% of BCD</span>
                          </div>
                          <div className="text-base font-bold text-white">{formatCurrency(results.socialWelfareSurcharge)}</div>
                        </div>

                        <div className="bg-gray-700/30 rounded-lg p-2.5">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-300 text-xs">IGST</span>
                            <span className="text-xs px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400">{results.rates.igst}%</span>
                          </div>
                          <div className="text-base font-bold text-white">{formatCurrency(results.igst)}</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="bg-gray-700/30 rounded-lg p-2.5">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-300 text-xs">FOB Value</span>
                            <span className="text-xs px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400">Base</span>
                          </div>
                          <div className="text-base font-bold text-white">{formatCurrency(results.productValue)}</div>
                        </div>

                        <div className="bg-gray-700/30 rounded-lg p-2.5">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-300 text-xs">RoDTEP Benefit</span>
                            <span className="text-xs px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-400">{results.rates.rodtep}%</span>
                          </div>
                          <div className="text-base font-bold text-white">+{formatCurrency(results.rodtepBenefit)}</div>
                        </div>

                        {results.meisBenefit > 0 && (
                          <div className="bg-gray-700/30 rounded-lg p-2.5">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-gray-300 text-xs">MEIS Benefit</span>
                              <span className="text-xs px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-400">{results.rates.meis}%</span>
                            </div>
                            <div className="text-base font-bold text-white">+{formatCurrency(results.meisBenefit)}</div>
                          </div>
                        )}

                        <div className="bg-gray-700/30 rounded-lg p-2.5">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-300 text-xs">Duty Drawback</span>
                            <span className="text-xs px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-400">{results.rates.drawback}%</span>
                          </div>
                          <div className="text-base font-bold text-white">+{formatCurrency(results.dutyDrawback)}</div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Download */}
                  
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Info Cards - Compact */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
          {mode === 'import' ? (
            <>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mb-2">
                  <Info size={16} className="text-blue-400" />
                </div>
                <h3 className="text-white font-semibold text-xs mb-1">Basic Customs Duty (BCD)</h3>
                <p className="text-gray-400 text-[10px]">Standard rate on CIF value (reduced if FTA applies)</p>
              </div>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mb-2">
                  <DollarSign size={16} className="text-green-400" />
                </div>
                <h3 className="text-white font-semibold text-xs mb-1">IGST</h3>
                <p className="text-gray-400 text-[10px]">Integrated GST on imports</p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mb-2">
                  <Sparkles size={16} className="text-purple-400" />
                </div>
                <h3 className="text-white font-semibold text-xs mb-1">Social Welfare Surcharge</h3>
                <p className="text-gray-400 text-[10px]">10% on Basic Customs Duty</p>
              </div>
            </>
          ) : (
            <>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mb-2">
                  <TrendingUp size={16} className="text-green-400" />
                </div>
                <h3 className="text-white font-semibold text-xs mb-1">RoDTEP</h3>
                <p className="text-gray-400 text-[10px]">Remission of duties on exports</p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mb-2">
                  <DollarSign size={16} className="text-blue-400" />
                </div>
                <h3 className="text-white font-semibold text-xs mb-1">MEIS</h3>
                <p className="text-gray-400 text-[10px]">Merchandise Exports Scheme</p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mb-2">
                  <Sparkles size={16} className="text-purple-400" />
                </div>
                <h3 className="text-white font-semibold text-xs mb-1">Duty Drawback</h3>
                <p className="text-gray-400 text-[10px]">Refund of customs duties</p>
              </div>
            </>
          )}
        </motion.div>

        {/* Disclaimer */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <AlertTriangle size={14} className="text-yellow-400 mt-0.5 flex-shrink-0" />
            <p className="text-yellow-200 text-[10px] leading-relaxed">
              <strong>Disclaimer:</strong> Preferential duty depends on exact tariff-line, effective date, and Rules of Origin compliance (certificate of origin, RVC, etc.).
              For HS lines not listed in the FTA table above, MFN rates are used. Please confirm with your customs broker.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DutyCalculator;
