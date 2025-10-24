import hsnCertData from '../data/hsn-certificates.json';

export function getCertificatesByHSN(hsnCode) {
  // Get first 2 digits of HSN
  const hsnPrefix = hsnCode.substring(0, 2);
  
  const category = hsnCertData[hsnPrefix];
  
  if (category) {
    return {
      found: true,
      category: category.category,
      description: category.description,
      certificates: category.requiredCerts
    };
  }
  
  return {
    found: false,
    category: "General",
    description: "Standard export product",
    certificates: []
  };
}
