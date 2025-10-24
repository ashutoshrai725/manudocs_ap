import iecData from '../data/iec-mock-data.json';

export function lookupIEC(iecNumber) {
  const company = iecData[iecNumber];
  
  if (company) {
    return { success: true, data: company };
  } else {
    return { success: false, error: "IEC not found. Try: demo" };
  }
}
