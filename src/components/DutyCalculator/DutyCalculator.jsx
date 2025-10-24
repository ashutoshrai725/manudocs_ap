import React, { useState, useRef } from 'react';
import { Calculator, DollarSign, FileCheck, AlertCircle } from 'lucide-react';
import Header from '../LandingPage/Header';

function DutyCalculator({ user, onPageChange, onLogout }) {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const exchangeRate = 83.5;
  const resultsRef = useRef(null);

  const [formData, setFormData] = useState({
    hsn: '',
    country: '',
    fob: '',
    freight: '',
    insurance: '',
    hasCOO: false
  });

  const [result, setResult] = useState(null);

  const dutyRates = {
    '09041100': {
      name: 'Black Pepper (neither crushed nor ground)',
      UAE: { mfn: 5, fta: 0, ftaName: 'India-UAE CEPA', vat: 5, requiresCOO: true, notes: 'Phytosanitary certificate required' },
      USA: { mfn: 0, fta: null, ftaName: null, vat: 0, requiresCOO: false, notes: 'FDA prior notice required' },
      UK: { mfn: 7, fta: 0, ftaName: 'UK-India FTA (Negotiating)', vat: 20, requiresCOO: true, notes: 'Health certificate may be required' },
    },
    '52010000': {
      name: 'Cotton, not carded or combed',
      UAE: { mfn: 0, fta: 0, ftaName: 'India-UAE CEPA', vat: 5, requiresCOO: false, notes: 'Quality certificate required' },
      USA: { mfn: 0, fta: null, ftaName: null, vat: 0, requiresCOO: false, notes: 'Fumigation certificate required' },
    },
    '10063000': {
      name: 'Rice, semi-milled or wholly milled',
      UAE: { mfn: 5, fta: 0, ftaName: 'India-UAE CEPA', vat: 5, requiresCOO: true, notes: 'Health certificate required' },
      USA: { mfn: 11.2, fta: null, ftaName: null, vat: 0, requiresCOO: false, notes: 'USDA inspection required' },
    }
  };

  const countries = ['UAE', 'USA', 'UK'];

  const calculateDuty = () => {
    if (!formData.hsn || !formData.country || !formData.fob) {
      alert('Please fill HSN Code, Country, and FOB Value');
      return;
    }

    const productData = dutyRates[formData.hsn];
    if (!productData) {
      setResult({
        error: true,
        message: `HSN Code ${formData.hsn} not found. Try: 09041100 (Pepper), 52010000 (Cotton), 10063000 (Rice)`
      });
      return;
    }

    const countryData = productData[formData.country];
    if (!countryData) {
      setResult({
        error: true,
        message: `Duty rates for ${formData.country} not available for this product`
      });
      return;
    }

    const convertToUSD = (value) => {
      if (selectedCurrency === 'INR') {
        return value / exchangeRate;
      }
      return value;
    };

    let fob = parseFloat(formData.fob) || 0;
    let freight = parseFloat(formData.freight) || 0;
    let insurance = parseFloat(formData.insurance) || 0;

    fob = convertToUSD(fob);
    freight = convertToUSD(freight);
    insurance = insurance > 0 ? convertToUSD(insurance) : (fob * 0.01);

    const cif = fob + freight + insurance;
    const useFTA = formData.hasCOO && countryData.fta !== null && countryData.requiresCOO;
    const dutyRate = useFTA ? countryData.fta : countryData.mfn;
    const customsDuty = cif * (dutyRate / 100);
    const vatBase = cif + customsDuty;
    const vat = vatBase * (countryData.vat / 100);
    const landedCost = cif + customsDuty + vat;

    let savings = 0;
    if (useFTA && countryData.mfn > 0) {
      const mfnDuty = cif * (countryData.mfn / 100);
      const mfnVat = (cif + mfnDuty) * (countryData.vat / 100);
      const mfnLanded = cif + mfnDuty + mfnVat;
      savings = mfnLanded - landedCost;
    }

    setResult({
      error: false,
      hsn: formData.hsn,
      country: formData.country,
      productName: productData.name,
      breakdown: { fob, freight, insurance, cif },
      duty: {
        rate: dutyRate,
        type: useFTA ? 'FTA' : 'MFN',
        ftaName: useFTA ? countryData.ftaName : null,
        amount: customsDuty
      },
      vat: {
        rate: countryData.vat,
        base: vatBase,
        amount: vat
      },
      landedCost,
      savings,
      requiresCOO: countryData.requiresCOO,
      notes: countryData.notes
    });

    setTimeout(() => {
      const element = resultsRef.current;
      if (element) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - 100; // 100px offset from top

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);

  };

  const formatCurrency = (amount) => {
    if (selectedCurrency === 'INR') {
      const inrAmount = amount * exchangeRate;
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2
      }).format(inrAmount);
    }

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handleReset = () => {
    setFormData({
      hsn: '',
      country: '',
      fob: '',
      freight: '',
      insurance: '',
      hasCOO: false
    });
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header user={user} onLogout={onLogout} onPageChange={onPageChange} />

      <div className="max-w-6xl mx-auto px-4 pt-32 pb-8">
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Calculator size={24} className="text-green-400" />
            <div>
              <h1 className="text-xl font-bold">Import Duty Calculator</h1>
              <p className="text-xs text-gray-400">Calculate landed costs instantly</p>
            </div>
          </div>

          {/* Currency Selector */}
          <div className="mb-4 flex items-center gap-3 bg-gray-700 p-2 rounded-lg text-sm">
            <span className="font-medium">Currency:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedCurrency('USD')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all text-sm ${selectedCurrency === 'USD'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  }`}
              >
                🇺🇸 USD
              </button>
              <button
                onClick={() => setSelectedCurrency('INR')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all text-sm ${selectedCurrency === 'INR'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  }`}
              >
                🇮🇳 INR
              </button>
            </div>
            {selectedCurrency === 'INR' && (
              <span className="text-xs text-gray-400 ml-auto">
                Rate: ₹{exchangeRate} = $1
              </span>
            )}
          </div>

          {/* Input Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs font-medium mb-1">HSN Code *</label>
              <input
                type="text"
                value={formData.hsn}
                onChange={(e) => setFormData({ ...formData, hsn: e.target.value })}
                placeholder="e.g., 09041100"
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-green-500"
              />
              <p className="text-xs text-gray-400 mt-0.5">Try: 09041100, 52010000, 10063000</p>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Destination Country *</label>
              <select
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-green-500"
              >
                <option value="">Select Country</option>
                {countries.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">FOB Value ({selectedCurrency}) *</label>
              <input
                type="number"
                value={formData.fob}
                onChange={(e) => setFormData({ ...formData, fob: e.target.value })}
                placeholder={selectedCurrency === 'USD' ? '10000' : '835000'}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Freight ({selectedCurrency})</label>
              <input
                type="number"
                value={formData.freight}
                onChange={(e) => setFormData({ ...formData, freight: e.target.value })}
                placeholder={selectedCurrency === 'USD' ? '500' : '41750'}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Insurance ({selectedCurrency})</label>
              <input
                type="number"
                value={formData.insurance}
                onChange={(e) => setFormData({ ...formData, insurance: e.target.value })}
                placeholder="Auto: 1% of FOB"
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-green-500"
              />
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasCOO}
                  onChange={(e) => setFormData({ ...formData, hasCOO: e.target.checked })}
                  className="w-4 h-4 accent-green-500"
                />
                <span className="text-xs">I have Certificate of Origin (COO)</span>
              </label>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={calculateDuty}
              className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold text-sm transition-all"
            >
              <Calculator size={16} />
              Calculate Duty
            </button>
            <button
              onClick={handleReset}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Results - COMPACT VERSION */}
        {result && !result.error && (
          <div ref={resultsRef} className="space-y-3">
            {/* Summary Card - Compact */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-bold mb-1">Total Landed Cost</h2>
                  <div className="text-3xl font-bold">{formatCurrency(result.landedCost)}</div>
                  {result.savings > 0 && (
                    <div className="mt-2 text-green-200 flex items-center gap-2 text-sm">
                      <FileCheck size={16} />
                      Saved {formatCurrency(result.savings)} with {result.duty.ftaName}
                    </div>
                  )}
                </div>
                <div className="text-right text-xs">
                  <div className="opacity-90">HSN: {result.hsn}</div>
                  <div className="opacity-90">{result.country}</div>
                </div>
              </div>
            </div>

            {/* Product Info - Compact */}
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-xs text-gray-400">Product</div>
              <div className="text-sm font-semibold">{result.productName}</div>
            </div>

            {/* Breakdown - Compact */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
                <DollarSign size={16} className="text-green-400" />
                Cost Breakdown
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-gray-700 pb-1.5">
                  <span>FOB Value</span>
                  <span className="font-semibold">{formatCurrency(result.breakdown.fob)}</span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-1.5">
                  <span>Freight</span>
                  <span className="font-semibold">{formatCurrency(result.breakdown.freight)}</span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-1.5">
                  <span>Insurance</span>
                  <span className="font-semibold">{formatCurrency(result.breakdown.insurance)}</span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-1.5 text-base">
                  <span className="font-semibold">CIF Value</span>
                  <span className="font-bold text-green-400">{formatCurrency(result.breakdown.cif)}</span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-1.5">
                  <span className="text-sm">
                    Customs Duty ({result.duty.rate}% {result.duty.type})
                    {result.duty.type === 'FTA' && (
                      <span className="text-xs text-green-400 ml-1">✓ FTA</span>
                    )}
                  </span>
                  <span className="font-semibold">{formatCurrency(result.duty.amount)}</span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-1.5">
                  <span>VAT/GST ({result.vat.rate}%)</span>
                  <span className="font-semibold">{formatCurrency(result.vat.amount)}</span>
                </div>
                <div className="flex justify-between text-lg pt-2">
                  <span className="font-bold">Total Landed Cost</span>
                  <span className="font-bold text-green-400">{formatCurrency(result.landedCost)}</span>
                </div>
              </div>
            </div>

            {/* Notes - Compact */}
            {result.notes && (
              <div className="bg-blue-900 border border-blue-700 rounded-lg p-3 flex gap-2">
                <AlertCircle size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-semibold mb-1">Important Notes</div>
                  <div className="text-blue-200">{result.notes}</div>
                  {result.requiresCOO && !formData.hasCOO && (
                    <div className="text-yellow-200 mt-1.5">
                      ⚠️ Certificate of Origin (COO) required for preferential duty rate!
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}


        {result && result.error && (
          <div className="bg-red-900 border border-red-700 rounded-lg p-4">
            <div className="font-semibold mb-2">Error</div>
            <div className="text-sm text-red-200">{result.message}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DutyCalculator;
