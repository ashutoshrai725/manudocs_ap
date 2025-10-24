// Inline country data - no JSON import issues
const countryDocs = {
  "UAE": {
    "countryName": "United Arab Emirates",
    "documents": [
      "Commercial Invoice",
      "Packing List",
      "Certificate of Origin (Preferential - India-UAE CEPA)",
      "Bill of Lading",
      "Health Certificate (for food products)",
      "Halal Certificate (for meat/food)"
    ],
    "specificQuestions": [
      {
        "id": "uae_trade_license",
        "question": "Does buyer have UAE Trade License number?",
        "type": "text",
        "required": true,
        "helpText": "Required for customs clearance in UAE"
      },
      {
        "id": "uae_embassy_attestation",
        "question": "Is shipment value above $3,000?",
        "type": "yes_no",
        "required": true,
        "helpText": "If yes, embassy attestation required"
      }
    ],
    "ftaInfo": {
      "available": true,
      "name": "India-UAE CEPA",
      "benefit": "Zero duty on most goods"
    }
  },
  "USA": {
    "countryName": "United States",
    "documents": [
      "Commercial Invoice",
      "Packing List",
      "Certificate of Origin (Non-preferential)",
      "Bill of Lading",
      "ISF Filing (Importer Security Filing)",
      "FDA Prior Notice (for food/drugs)"
    ],
    "specificQuestions": [
      {
        "id": "usa_fda_registration",
        "question": "Is your facility FDA registered?",
        "type": "yes_no",
        "required": true,
        "helpText": "Required for food/drug exports to USA"
      },
      {
        "id": "usa_importer_ein",
        "question": "US Importer's EIN Number",
        "type": "text",
        "required": false,
        "helpText": "Employer Identification Number of US buyer"
      }
    ],
    "ftaInfo": {
      "available": false,
      "name": null,
      "benefit": "Standard MFN rates apply"
    }
  },
  "Germany": {
    "countryName": "Germany (EU)",
    "documents": [
      "Commercial Invoice",
      "Packing List",
      "EUR.1 Movement Certificate",
      "Bill of Lading",
      "REX Certificate (if value >€6,000)"
    ],
    "specificQuestions": [
      {
        "id": "eu_eori_number",
        "question": "Buyer's EORI Number",
        "type": "text",
        "required": true,
        "helpText": "Economic Operators Registration and Identification number"
      },
      {
        "id": "eu_rex_registered",
        "question": "Do you have REX registration?",
        "type": "yes_no",
        "required": false,
        "helpText": "Required for self-certification if value >€6,000"
      }
    ],
    "ftaInfo": {
      "available": true,
      "name": "India-EU FTA (under negotiation)",
      "benefit": "GSP rates currently available"
    }
  }
};

export function getCountryInfo(country) {
  console.log("🔍 Getting country info for:", country);
  
  const info = countryDocs[country];
  
  if (!info) {
    console.warn("⚠️ Country not found, returning UAE default");
    return countryDocs['UAE'];
  }
  
  console.log("✅ Country info found:", info);
  return info;
}

export function getCountrySpecificQuestions(country) {
  const countryInfo = countryDocs[country] || countryDocs['UAE'];
  return countryInfo.specificQuestions || [];
}

export function getAllCountries() {
  return Object.keys(countryDocs);
}
