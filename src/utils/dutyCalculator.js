export class DutyCalculator {
  constructor(dutyData) {
    this.dutyData = dutyData;
  }

  // Calculate CIF value
  calculateCIF(fob, freight, insurance) {
    const fobValue = parseFloat(fob) || 0;
    const freightValue = parseFloat(freight) || 0;
    const insuranceValue = parseFloat(insurance) || (fobValue * 0.01); // Default 1% if not provided
    
    return {
      fob: fobValue,
      freight: freightValue,
      insurance: insuranceValue,
      cif: fobValue + freightValue + insuranceValue
    };
  }

  // Find duty rates for HSN + Country
  findDutyRate(hsn, country) {
    const product = this.dutyData.duties.find(d => d.hsn === hsn);
    if (!product) return null;
    
    const destination = product.destinations[country];
    if (!destination) return null;
    
    return {
      ...destination,
      description: product.description,
      hsn: product.hsn
    };
  }

  // Main calculation function
  calculate(params) {
    const { hsn, country, fob, freight, insurance, hasCOO } = params;
    
    // Step 1: Get CIF
    const cifBreakdown = this.calculateCIF(fob, freight, insurance);
    
    // Step 2: Find duty rates
    const dutyInfo = this.findDutyRate(hsn, country);
    if (!dutyInfo) {
      return {
        error: 'Duty rates not found for this HSN code and destination',
        hsn,
        country
      };
    }

    // Step 3: Determine applicable duty rate
    const useFTA = hasCOO && dutyInfo.ftaRate !== null && dutyInfo.requiresCOO;
    const dutyRate = useFTA ? dutyInfo.ftaRate : dutyInfo.mfnRate;
    
    // Step 4: Calculate customs duty
    const customsDuty = cifBreakdown.cif * (dutyRate / 100);
    
    // Step 5: Calculate VAT (on CIF + Customs Duty)
    const vatBase = cifBreakdown.cif + customsDuty;
    const vat = vatBase * (dutyInfo.vatRate / 100);
    
    // Step 6: Calculate total landed cost
    const landedCost = cifBreakdown.cif + customsDuty + vat;
    
    // Step 7: Calculate savings if FTA was used
    let savings = 0;
    if (useFTA && dutyInfo.mfnRate > 0) {
      const mfnCustomsDuty = cifBreakdown.cif * (dutyInfo.mfnRate / 100);
      const mfnVat = (cifBreakdown.cif + mfnCustomsDuty) * (dutyInfo.vatRate / 100);
      const mfnLandedCost = cifBreakdown.cif + mfnCustomsDuty + mfnVat;
      savings = mfnLandedCost - landedCost;
    }

    return {
      success: true,
      hsn,
      country,
      description: dutyInfo.description,
      
      // CIF Breakdown
      breakdown: {
        fob: cifBreakdown.fob,
        freight: cifBreakdown.freight,
        insurance: cifBreakdown.insurance,
        cif: cifBreakdown.cif
      },
      
      // Duty Details
      duty: {
        rateUsed: dutyRate,
        rateType: useFTA ? 'FTA' : 'MFN',
        ftaName: useFTA ? dutyInfo.ftaName : null,
        amount: customsDuty
      },
      
      // VAT Details
      vat: {
        rate: dutyInfo.vatRate,
        base: vatBase,
        amount: vat
      },
      
      // Final Costs
      landedCost,
      savings,
      
      // Additional Info
      requiresCOO: dutyInfo.requiresCOO,
      notes: dutyInfo.notes,
      
      // Percentage breakdown
      percentages: {
        fob: (cifBreakdown.fob / landedCost * 100).toFixed(2),
        freight: (cifBreakdown.freight / landedCost * 100).toFixed(2),
        insurance: (cifBreakdown.insurance / landedCost * 100).toFixed(2),
        customsDuty: (customsDuty / landedCost * 100).toFixed(2),
        vat: (vat / landedCost * 100).toFixed(2)
      }
    };
  }
}
