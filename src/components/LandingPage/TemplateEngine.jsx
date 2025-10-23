// src/utils/TemplateEngine.jsx
import React from "react";

/**
 * TemplateEngine.jsx
 * Updated for 13 export documents matching the AI Agent inputs
 * All data comes from user inputs collected via AI Agent questions
 */

/* ---------------- utils ---------------- */

const getRandomTwoDigits = () => String(Math.floor(Math.random() * 100)).padStart(2, "0");

export const buildDocIds = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const randomTwoDigits = getRandomTwoDigits();

  return {
    invoiceNumber: `INV/${year}${month}/${randomTwoDigits}${day}`,
    proformaNumber: `PI/${year}${month}/${randomTwoDigits}${day}`,
    packingNumber: `PL/${year}${month}/${randomTwoDigits}${day}`,
    challanNumber: `CH/${year}${month}/${randomTwoDigits}${day}`,
    creditNoteNumber: `CN/${year}${month}/${randomTwoDigits}${day}`,
    debitNoteNumber: `DN/${year}${month}/${randomTwoDigits}${day}`,
    certificateNumber: `COO/${year}${month}/${randomTwoDigits}${day}`,
    blNumber: `BL/${year}${month}/${randomTwoDigits}${day}`,
    siNumber: `SI/${year}${month}/${randomTwoDigits}${day}`,
    declarationNumber: `ED/${year}${month}/${randomTwoDigits}${day}`,
    awbNumber: `AWB/${year}${month}/${randomTwoDigits}${day}`,
    insuranceNumber: `INS/${year}${month}/${randomTwoDigits}${day}`,
    quotationNumber: `QT/${year}${month}/${randomTwoDigits}${day}`,
  };
};

const esc = (v) => (v === undefined || v === null ? "" : String(v));

const parseProducts = (productsInput) => {
  if (!productsInput || !Array.isArray(productsInput)) return [];

  return productsInput.map((p, idx) => ({
    sno: idx + 1,
    product_code: p.product_code || "",
    description: p.description || "",
    hs_code: p.hs_code || "",
    quantity: parseFloat(p.quantity) || 0,
    unit: p.unit || "PCS",
    unit_price: parseFloat(p.unit_price) || 0,
    total_amount: parseFloat(p.total_amount) || 0,
  }));
};

const parsePackingInfo = (packingInput) => {
  if (!packingInput || !Array.isArray(packingInput)) return [];

  return packingInput.map((p, idx) => ({
    sno: idx + 1,
    product_index: p.product_index || "",
    kind_of_packages: p.kind_of_packages || "Carton",
    number_of_packages: parseInt(p.number_of_packages) || 0,
    net_weight: parseFloat(p.net_weight) || 0,
    gross_weight: parseFloat(p.gross_weight) || 0,
    measurements: p.measurements || "",
  }));
};

const calculateTotals = (products, currency = "USD") => {
  const subtotal = products.reduce((sum, product) => sum + (product.total_amount || 0), 0);
  return {
    subtotal: subtotal.toFixed(2),
    total: subtotal.toFixed(2),
    currency,
  };
};

// Convert number to words for amount in words
const numberToWords = (num) => {
  const ones = ['', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'];
  const tens = ['', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'];

  if (num === 0) return 'ZERO';
  if (num < 20) return ones[num];
  if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + ones[num % 10] : '');
  if (num < 1000) return ones[Math.floor(num / 100)] + ' HUNDRED' + (num % 100 !== 0 ? ' AND ' + numberToWords(num % 100) : '');
  if (num < 100000) return numberToWords(Math.floor(num / 1000)) + ' THOUSAND' + (num % 1000 !== 0 ? ' ' + numberToWords(num % 1000) : '');
  if (num < 10000000) return numberToWords(Math.floor(num / 100000)) + ' LAKH' + (num % 100000 !== 0 ? ' ' + numberToWords(num % 100000) : '');
  return numberToWords(Math.floor(num / 10000000)) + ' CRORE' + (num % 10000000 !== 0 ? ' ' + numberToWords(num % 10000000) : '');
};

const getAmountInWords = (amount, currency = "USD") => {
  const wholePart = Math.floor(amount);
  const decimalPart = Math.round((amount - wholePart) * 100);

  let words = numberToWords(wholePart);

  if (currency === "INR") {
    words += ' RUPEES';
    if (decimalPart > 0) {
      words += ' AND ' + numberToWords(decimalPart) + ' PAISE';
    }
  } else {
    words += ' ' + currency;
    if (decimalPart > 0) {
      words += ' AND ' + numberToWords(decimalPart) + ' CENTS';
    }
  }

  words += ' ONLY';
  return words.toUpperCase();
};

/* ---------------- shared styles & palette ---------------- */

const colors = {
  textPrimary: "#000000",
  textSecondary: "#555555",
  accent: "#2563EB",
  border: "#CCCCCC",
  headerBg: "#F5F5F5",
  tableHeader: "#E5E5E5",
  lightGray: "#F9F9F9",
};

const containerBase = {
  maxWidth: 794,
  margin: "0 auto",
  padding: "20px",
  fontFamily: "Arial, Helvetica, sans-serif",
  background: "white",
  color: colors.textPrimary,
  lineHeight: 1.4,
  fontSize: "12px",
  boxSizing: "border-box",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  borderBottom: `2px solid ${colors.border}`,
  paddingBottom: "15px",
  marginBottom: "20px",
};

const docTitleStyle = {
  margin: 0,
  fontSize: "20px",
  fontWeight: "bold",
  textAlign: "center",
  color: colors.textPrimary,
};

const infoBoxStyle = {
  border: `1px solid ${colors.border}`,
  padding: "10px",
  borderRadius: "4px",
  background: colors.lightGray,
  fontSize: "11px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginBottom: "15px",
  fontSize: "11px",
};

const tableHeaderStyle = {
  background: colors.tableHeader,
  border: `1px solid ${colors.border}`,
  padding: "8px",
  textAlign: "left",
  fontWeight: "bold",
};

const tableCellStyle = {
  border: `1px solid ${colors.border}`,
  padding: "8px",
  verticalAlign: "top",
};

/* ---------------- React components ---------------- */

/* 1) Commercial Invoice */
export function CommercialInvoice({ company = {}, inputs = {}, docIds = buildDocIds(), currentDate = new Date().toLocaleDateString('en-GB') }) {
  const products = parseProducts(inputs.products);
  const totals = calculateTotals(products, inputs.currency);

  const formatDate = (dateStr) => {
    if (!dateStr) return currentDate;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB');
  };

  return (
    <div className="document-container" style={containerBase}>
      {/* Header Section */}
      <div style={headerStyle}>
        <div style={{ flex: 1 }}>
          {inputs.exporter_logo && (
            <img
              src={inputs.exporter_logo}
              alt="Company Logo"
              style={{ maxHeight: "60px", marginBottom: "10px" }}
            />
          )}
          <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "5px" }}>
            {inputs.exporter_company_name || "EXPORTER COMPANY NAME"}
          </div>
          <div style={{ fontSize: "11px", color: colors.textSecondary, lineHeight: "1.3" }}>
            {inputs.exporter_address || "Exporter Address"}
          </div>
          {inputs.exporter_gstin && (
            <div style={{ fontSize: "11px", color: colors.textSecondary, marginTop: "3px" }}>
              GSTIN: {inputs.exporter_gstin}
            </div>
          )}
        </div>

        <div style={{ textAlign: "center", flex: 1 }}>
          <h1 style={docTitleStyle}>COMMERCIAL INVOICE</h1>
          <div style={{ fontSize: "11px", marginTop: "5px" }}>
            Pages 1 of 1
          </div>
        </div>

        <div style={{ flex: 1, textAlign: "right" }}>
          <div style={{ fontSize: "11px", marginBottom: "5px" }}>
            <strong>Invoice Number & Date</strong><br />
            {inputs.invoice_number || docIds.invoiceNumber}<br />
            {formatDate(inputs.invoice_date)}
          </div>
          <div style={{ fontSize: "11px" }}>
            <strong>Bill of Lading Number</strong><br />
            {inputs.bill_of_lading || "To be assigned"}
          </div>
        </div>
      </div>

      {/* Reference and Buyer Information */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
        <div style={infoBoxStyle}>
          <div style={{ fontWeight: "bold", marginBottom: "5px" }}>Reference</div>
          <div>{inputs.export_reference || "N/A"}</div>
        </div>
        <div style={infoBoxStyle}>
          <div style={{ fontWeight: "bold", marginBottom: "5px" }}>Buyer Reference</div>
          <div>{inputs.buyer_reference || "N/A"}</div>
        </div>
      </div>

      {/* Consignee and Buyer */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
        <div style={infoBoxStyle}>
          <div style={{ fontWeight: "bold", marginBottom: "8px", fontSize: "12px" }}>CONSIGNEE</div>
          {inputs.consignee_same_as_buyer === 'Yes' ? (
            <div>
              <div style={{ fontWeight: "bold" }}>{inputs.buyer_company_name || "BUYER COMPANY NAME"}</div>
              <div style={{ fontSize: "10px", whiteSpace: "pre-line" }}>{inputs.buyer_address || "Buyer Address"}</div>
            </div>
          ) : (
            <div>
              <div style={{ fontWeight: "bold" }}>{inputs.consignee_company_name || "CONSIGNEE COMPANY NAME"}</div>
              <div style={{ fontSize: "10px", whiteSpace: "pre-line" }}>{inputs.consignee_address || "Consignee Address"}</div>
            </div>
          )}
        </div>

        <div style={infoBoxStyle}>
          <div style={{ fontWeight: "bold", marginBottom: "8px", fontSize: "12px" }}>BUYER (If not Consignee)</div>
          {inputs.consignee_same_as_buyer === 'No' && (
            <div>
              <div style={{ fontWeight: "bold" }}>{inputs.buyer_company_name || "BUYER COMPANY NAME"}</div>
              <div style={{ fontSize: "10px", whiteSpace: "pre-line" }}>{inputs.buyer_address || "Buyer Address"}</div>
            </div>
          )}
        </div>
      </div>

      {/* Shipment Details */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px", marginBottom: "20px", fontSize: "11px" }}>
        <div>
          <strong>Method of Dispatch</strong><br />
          {inputs.dispatch_method || "N/A"}
        </div>
        <div>
          <strong>Type of Shipment</strong><br />
          {inputs.shipment_type || "N/A"}
        </div>
        <div>
          <strong>Country Of Origin of Goods</strong><br />
          {inputs.country_of_origin || "N/A"}
        </div>
        <div>
          <strong>Country of Final Destination</strong><br />
          {inputs.final_destination_country || "N/A"}
        </div>
        <div>
          <strong>Vessel / Aircraft</strong><br />
          {inputs.vessel_flight_details || "N/A"}
        </div>
        <div>
          <strong>Voyage No</strong><br />
          {inputs.vessel_flight_details?.split('/')[1] || "N/A"}
        </div>
        <div>
          <strong>Terms / Method of Payment</strong><br />
          {inputs.payment_method || "N/A"}
        </div>
        <div></div>
        <div>
          <strong>Port of Loading</strong><br />
          {inputs.port_of_loading || "N/A"}
        </div>
        <div>
          <strong>Date of Departure</strong><br />
          {formatDate(inputs.departure_date)}
        </div>
        <div></div>
        <div></div>
        <div>
          <strong>Port of Discharge</strong><br />
          {inputs.port_of_discharge || "N/A"}
        </div>
        <div>
          <strong>Final Destination</strong><br />
          {inputs.final_destination_country || "N/A"}
        </div>
        <div>
          <strong>Marine Cover Policy No</strong><br />
          {inputs.insurance_policy || "N/A"}
        </div>
        <div>
          <strong>Letter Of Credit No</strong><br />
          {inputs.lc_number || "N/A"}
        </div>
      </div>

      {/* Products Table */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...tableHeaderStyle, width: "10%" }}>Product Code</th>
            <th style={{ ...tableHeaderStyle, width: "35%" }}>Description of Goods</th>
            <th style={{ ...tableHeaderStyle, width: "10%" }}>HS Code</th>
            <th style={{ ...tableHeaderStyle, width: "10%" }}>Unit Quantity</th>
            <th style={{ ...tableHeaderStyle, width: "10%" }}>Unit Type</th>
            <th style={{ ...tableHeaderStyle, width: "12%" }}>Price ({inputs.currency})</th>
            <th style={{ ...tableHeaderStyle, width: "13%" }}>Amount ({inputs.currency})</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ ...tableCellStyle, textAlign: "center", padding: "20px" }}>
                No products specified
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.sno}>
                <td style={tableCellStyle}>{product.product_code}</td>
                <td style={tableCellStyle}>
                  <div style={{ fontWeight: "bold" }}>{product.description}</div>
                </td>
                <td style={tableCellStyle}>{product.hs_code}</td>
                <td style={tableCellStyle}>{product.quantity}</td>
                <td style={tableCellStyle}>{product.unit}</td>
                <td style={{ ...tableCellStyle, textAlign: "right" }}>
                  {parseFloat(product.unit_price).toFixed(2)}
                </td>
                <td style={{ ...tableCellStyle, textAlign: "right" }}>
                  {parseFloat(product.total_amount).toFixed(2)}
                </td>
              </tr>
            ))
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="6" style={{ ...tableCellStyle, textAlign: "right", fontWeight: "bold" }}>
              Total This Page
            </td>
            <td style={{ ...tableCellStyle, textAlign: "right", fontWeight: "bold" }}>
              {inputs.currency} {totals.total}
            </td>
          </tr>
          <tr>
            <td colSpan="6" style={{ ...tableCellStyle, textAlign: "right", fontWeight: "bold" }}>
              Consignment Total
            </td>
            <td style={{ ...tableCellStyle, textAlign: "right", fontWeight: "bold" }}>
              {inputs.currency} {totals.total}
            </td>
          </tr>
        </tfoot>
      </table>

      {/* Footer Section */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "30px" }}>
        <div>
          <div style={{ fontWeight: "bold", marginBottom: "5px" }}>Additional Info</div>
          <div style={{ fontSize: "10px", minHeight: "40px" }}>
            {inputs.additional_instructions || "All goods are of origin as stated."}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: "bold", marginBottom: "5px" }}>TOTAL: {inputs.currency} {totals.total}</div>
          <div style={{ fontSize: "10px", marginBottom: "5px" }}>
            <strong>Incoterms® 2020:</strong> {inputs.incoterms || "N/A"}
          </div>
          <div style={{ fontSize: "10px", marginBottom: "5px" }}>
            <strong>Currency:</strong> {inputs.currency || "USD"}
          </div>
        </div>
      </div>

      {/* Signature Section */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "40px" }}>
        <div>
          <div style={{ fontWeight: "bold", marginBottom: "5px" }}>Bank Details</div>
          <div style={{ fontSize: "10px", lineHeight: "1.4" }}>
            {inputs.bank_details || "Bank details to be provided separately"}
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ marginBottom: "10px" }}>
            <strong>Signatory Company</strong><br />
            {inputs.exporter_company_name || "EXPORTER COMPANY NAME"}
          </div>
          <div style={{ marginBottom: "40px" }}>
            <strong>Name of Authorized Signatory</strong><br />
            {inputs.authorized_signatory_name || "Authorized Signatory"}
          </div>
          <div style={{ marginBottom: "40px" }}>
            <strong>Designation</strong><br />
            {inputs.authorized_signatory_designation || "Authorized Signatory Designation"}
          </div>
          <div style={{ borderTop: `1px solid ${colors.border}`, width: "200px", margin: "0 auto", paddingTop: "5px" }}>
            {inputs.authorized_signature ? (
              <img
                src={inputs.authorized_signature}
                alt="Signature"
                style={{ maxHeight: "40px" }}
              />
            ) : (
              "Signature"
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* 2) Proforma Invoice */
export function ProformaInvoice({ company = {}, inputs = {}, docIds = buildDocIds(), currentDate = new Date().toLocaleDateString('en-GB') }) {
  const products = parseProducts(inputs.products);
  const totals = calculateTotals(products, inputs.currency);

  const formatDate = (dateStr) => {
    if (!dateStr) return currentDate;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB');
  };

  return (
    <div style={containerBase}>
      {/* Header Section */}
      <div style={headerStyle}>
        <div style={{ flex: 1 }}>
          {inputs.exporter_logo && (
            <img
              src={inputs.exporter_logo}
              alt="Company Logo"
              style={{ maxHeight: "60px", marginBottom: "10px" }}
            />
          )}
          <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "5px" }}>
            {inputs.exporter_company_name || "SELLER"}
          </div>
          <div style={{ fontSize: "11px", color: colors.textSecondary, lineHeight: "1.3" }}>
            {inputs.exporter_address || "Seller Address"}
          </div>
        </div>

        <div style={{ textAlign: "center", flex: 1 }}>
          <h1 style={docTitleStyle}>PROFORMA INVOICE</h1>
          <div style={{ fontSize: "11px", marginTop: "5px" }}>
            Pages 1 of 1
          </div>
        </div>

        <div style={{ flex: 1, textAlign: "right" }}>
          <div style={{ fontSize: "11px", marginBottom: "5px" }}>
            <strong>Invoice Number</strong><br />
            {inputs.invoice_number || docIds.proformaNumber}
          </div>
          <div style={{ fontSize: "11px", marginBottom: "5px" }}>
            <strong>Issue Date</strong><br />
            {formatDate(inputs.invoice_date)}
          </div>
          <div style={{ fontSize: "11px" }}>
            <strong>Buyer Reference</strong><br />
            {inputs.buyer_reference || "N/A"}
          </div>
          <div style={{ fontSize: "11px" }}>
            <strong>Due Date</strong><br />
            {formatDate(inputs.delivery_date)}
          </div>
        </div>
      </div>

      {/* Buyer and Delivery Information */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
        <div style={infoBoxStyle}>
          <div style={{ fontWeight: "bold", marginBottom: "8px", fontSize: "12px" }}>BUYER</div>
          <div style={{ fontWeight: "bold" }}>{inputs.buyer_company_name || "BUYER COMPANY NAME"}</div>
          <div style={{ fontSize: "10px", whiteSpace: "pre-line" }}>{inputs.buyer_address || "Buyer Address"}</div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "11px", marginBottom: "5px" }}>
            <strong>Delivery Date</strong><br />
            {formatDate(inputs.delivery_date)}
          </div>
        </div>
      </div>

      {/* Shipment Details */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "20px", fontSize: "11px" }}>
        <div>
          <strong>Method of Dispatch</strong><br />
          {inputs.dispatch_method || "N/A"}
        </div>
        <div>
          <strong>Type of Shipment</strong><br />
          {inputs.shipment_type || "N/A"}
        </div>
        <div>
          <strong>Terms / Method of Payment</strong><br />
          {inputs.payment_method || "N/A"}
        </div>
        <div>
          <strong>Port of Loading</strong><br />
          {inputs.port_of_loading || "N/A"}
        </div>
        <div>
          <strong>Port of Discharge</strong><br />
          {inputs.port_of_discharge || "N/A"}
        </div>
        <div></div>
      </div>

      {/* Products Table */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...tableHeaderStyle, width: "10%" }}>Product Code</th>
            <th style={{ ...tableHeaderStyle, width: "40%" }}>Description of Goods</th>
            <th style={{ ...tableHeaderStyle, width: "10%" }}>Unit Quantity</th>
            <th style={{ ...tableHeaderStyle, width: "10%" }}>Unit Type</th>
            <th style={{ ...tableHeaderStyle, width: "15%" }}>Price ({inputs.currency})</th>
            <th style={{ ...tableHeaderStyle, width: "15%" }}>Amount ({inputs.currency})</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ ...tableCellStyle, textAlign: "center", padding: "20px" }}>
                No products specified
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.sno}>
                <td style={tableCellStyle}>{product.product_code}</td>
                <td style={tableCellStyle}>
                  <div style={{ fontWeight: "bold" }}>{product.description}</div>
                </td>
                <td style={tableCellStyle}>{product.quantity}</td>
                <td style={tableCellStyle}>{product.unit}</td>
                <td style={{ ...tableCellStyle, textAlign: "right" }}>
                  {parseFloat(product.unit_price).toFixed(2)}
                </td>
                <td style={{ ...tableCellStyle, textAlign: "right" }}>
                  {parseFloat(product.total_amount).toFixed(2)}
                </td>
              </tr>
            ))
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="5" style={{ ...tableCellStyle, textAlign: "right", fontWeight: "bold" }}>
              Total This Page
            </td>
            <td style={{ ...tableCellStyle, textAlign: "right", fontWeight: "bold" }}>
              {inputs.currency} {totals.total}
            </td>
          </tr>
          <tr>
            <td colSpan="5" style={{ ...tableCellStyle, textAlign: "right", fontWeight: "bold" }}>
              Consignment Total
            </td>
            <td style={{ ...tableCellStyle, textAlign: "right", fontWeight: "bold" }}>
              {inputs.currency} {totals.total}
            </td>
          </tr>
        </tfoot>
      </table>

      {/* Footer Section */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "30px" }}>
        <div>
          <div style={{ fontWeight: "bold", marginBottom: "5px" }}>Additional Info</div>
          <div style={{ fontSize: "10px", minHeight: "40px" }}>
            {inputs.additional_instructions || "This is a proforma invoice. Not valid for payment."}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: "bold", marginBottom: "5px" }}>TOTAL: {inputs.currency} {totals.total}</div>
          <div style={{ fontSize: "10px", marginBottom: "5px" }}>
            <strong>Incoterms® 2020:</strong> {inputs.incoterms || "N/A"}
          </div>
          <div style={{ fontSize: "10px", marginBottom: "5px" }}>
            <strong>Currency:</strong> {inputs.currency || "USD"}
          </div>
        </div>
      </div>

      {/* Signature Section */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "40px" }}>
        <div>
          <div style={{ fontWeight: "bold", marginBottom: "5px" }}>Bank Details</div>
          <div style={{ fontSize: "10px", lineHeight: "1.4" }}>
            {inputs.bank_details || "Bank details to be provided separately"}
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ marginBottom: "10px" }}>
            <strong>Signatory Company</strong><br />
            {inputs.exporter_company_name || "SELLER COMPANY NAME"}
          </div>
          <div style={{ marginBottom: "40px" }}>
            <strong>Name of Authorized Signatory</strong><br />
            {inputs.authorized_signatory_name || "Authorized Signatory"}
          </div>
          <div style={{ marginBottom: "40px" }}>
            <strong>Designation</strong><br />
            {inputs.authorized_signatory_designation || "Authorized Signatory Designation"}
          </div>
          <div style={{ borderTop: `1px solid ${colors.border}`, width: "200px", margin: "0 auto", paddingTop: "5px" }}>
            {inputs.authorized_signature ? (
              <img
                src={inputs.authorized_signature}
                alt="Signature"
                style={{ maxHeight: "40px" }}
              />
            ) : (
              "Signature"
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* 3) Packing List */
export function PackingList({ company = {}, inputs = {}, docIds = buildDocIds(), currentDate = new Date().toLocaleDateString('en-GB') }) {
  const products = parseProducts(inputs.products);
  const packingInfo = parsePackingInfo(inputs.packing_info);

  const formatDate = (dateStr) => {
    if (!dateStr) return currentDate;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB');
  };

  // Calculate totals
  const totalPackages = packingInfo.reduce((sum, p) => sum + (p.number_of_packages || 0), 0);
  const totalNetWeight = packingInfo.reduce((sum, p) => sum + (p.net_weight || 0), 0);
  const totalGrossWeight = packingInfo.reduce((sum, p) => sum + (p.gross_weight || 0), 0);

  return (
    <div style={containerBase}>
      {/* Header Section */}
      <div style={headerStyle}>
        <div style={{ flex: 1 }}>
          {inputs.exporter_logo && (
            <img
              src={inputs.exporter_logo}
              alt="Company Logo"
              style={{ maxHeight: "60px", marginBottom: "10px" }}
            />
          )}
          <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "5px" }}>
            {inputs.exporter_company_name || "EXPORTER"}
          </div>
          <div style={{ fontSize: "11px", color: colors.textSecondary, lineHeight: "1.3" }}>
            {inputs.exporter_address || "Exporter Address"}
          </div>
        </div>

        <div style={{ textAlign: "center", flex: 1 }}>
          <h1 style={docTitleStyle}>PACKING LIST</h1>
          <div style={{ fontSize: "11px", marginTop: "5px" }}>
            Page 1 of 1
          </div>
        </div>

        <div style={{ flex: 1, textAlign: "right" }}>
          <div style={{ fontSize: "11px", marginBottom: "5px" }}>
            <strong>Export Invoice Number & Date</strong><br />
            {inputs.invoice_number || docIds.invoiceNumber}<br />
            {formatDate(inputs.invoice_date)}
          </div>
          <div style={{ fontSize: "11px" }}>
            <strong>Bill of Lading Number</strong><br />
            {inputs.bill_of_lading || "To be assigned"}
          </div>
        </div>
      </div>

      {/* Reference and Buyer Information */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
        <div style={infoBoxStyle}>
          <div style={{ fontWeight: "bold", marginBottom: "5px" }}>Reference</div>
          <div>{inputs.export_reference || "N/A"}</div>
        </div>
        <div style={infoBoxStyle}>
          <div style={{ fontWeight: "bold", marginBottom: "5px" }}>Buyer Reference</div>
          <div>{inputs.buyer_reference || "N/A"}</div>
        </div>
      </div>

      {/* Consignee and Buyer */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
        <div style={infoBoxStyle}>
          <div style={{ fontWeight: "bold", marginBottom: "8px", fontSize: "12px" }}>CONSIGNEE</div>
          {inputs.consignee_same_as_buyer === 'Yes' ? (
            <div>
              <div style={{ fontWeight: "bold" }}>{inputs.buyer_company_name || "BUYER COMPANY NAME"}</div>
              <div style={{ fontSize: "10px", whiteSpace: "pre-line" }}>{inputs.buyer_address || "Buyer Address"}</div>
            </div>
          ) : (
            <div>
              <div style={{ fontWeight: "bold" }}>{inputs.consignee_company_name || "CONSIGNEE COMPANY NAME"}</div>
              <div style={{ fontSize: "10px", whiteSpace: "pre-line" }}>{inputs.consignee_address || "Consignee Address"}</div>
            </div>
          )}
        </div>

        <div style={infoBoxStyle}>
          <div style={{ fontWeight: "bold", marginBottom: "8px", fontSize: "12px" }}>BUYER (If not Consignee)</div>
          {inputs.consignee_same_as_buyer === 'No' && (
            <div>
              <div style={{ fontWeight: "bold" }}>{inputs.buyer_company_name || "BUYER COMPANY NAME"}</div>
              <div style={{ fontSize: "10px", whiteSpace: "pre-line" }}>{inputs.buyer_address || "Buyer Address"}</div>
            </div>
          )}
        </div>
      </div>

      {/* Shipment Details */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px", marginBottom: "20px", fontSize: "11px" }}>
        <div>
          <strong>Method of Dispatch</strong><br />
          {inputs.dispatch_method || "N/A"}
        </div>
        <div>
          <strong>Type of Shipment</strong><br />
          {inputs.shipment_type || "N/A"}
        </div>
        <div>
          <strong>Country Of Origin of Goods</strong><br />
          {inputs.country_of_origin || "N/A"}
        </div>
        <div>
          <strong>Country of Final Destination</strong><br />
          {inputs.final_destination_country || "N/A"}
        </div>
        <div>
          <strong>Vessel / Aircraft</strong><br />
          {inputs.vessel_flight_details || "N/A"}
        </div>
        <div>
          <strong>Voyage No</strong><br />
          {inputs.vessel_flight_details?.split('/')[1] || "N/A"}
        </div>
        <div>
          <strong>Packing Information</strong><br />
          Standard Export Packing
        </div>
        <div></div>
        <div>
          <strong>Port of Loading</strong><br />
          {inputs.port_of_loading || "N/A"}
        </div>
        <div>
          <strong>Date of Departure</strong><br />
          {formatDate(inputs.departure_date)}
        </div>
        <div></div>
        <div></div>
        <div>
          <strong>Port of Discharge</strong><br />
          {inputs.port_of_discharge || "N/A"}
        </div>
        <div>
          <strong>Final Destination</strong><br />
          {inputs.final_destination_country || "N/A"}
        </div>
        <div></div>
        <div></div>
      </div>

      {/* Packing Details Table */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...tableHeaderStyle, width: "10%" }}>Product Code</th>
            <th style={{ ...tableHeaderStyle, width: "30%" }}>Description of Goods</th>
            <th style={{ ...tableHeaderStyle, width: "10%" }}>Unit Quantity</th>
            <th style={{ ...tableHeaderStyle, width: "15%" }}>Kind & No of Packages</th>
            <th style={{ ...tableHeaderStyle, width: "10%" }}>Net Weight (Kg)</th>
            <th style={{ ...tableHeaderStyle, width: "10%" }}>Gross Weight (Kg)</th>
            <th style={{ ...tableHeaderStyle, width: "15%" }}>Measurements (m³)</th>
          </tr>
        </thead>
        <tbody>
          {packingInfo.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ ...tableCellStyle, textAlign: "center", padding: "20px" }}>
                No packing information specified
              </td>
            </tr>
          ) : (
            packingInfo.map((packing, index) => {
              const product = products[parseInt(packing.product_index) - 1];
              return (
                <tr key={packing.sno}>
                  <td style={tableCellStyle}>{product?.product_code || "N/A"}</td>
                  <td style={tableCellStyle}>
                    <div style={{ fontWeight: "bold" }}>{product?.description || "Product Description"}</div>
                  </td>
                  <td style={tableCellStyle}>{product?.quantity || "N/A"} {product?.unit || ""}</td>
                  <td style={tableCellStyle}>
                    {packing.kind_of_packages} × {packing.number_of_packages}
                  </td>
                  <td style={tableCellStyle}>{packing.net_weight.toFixed(2)}</td>
                  <td style={tableCellStyle}>{packing.gross_weight.toFixed(2)}</td>
                  <td style={tableCellStyle}>{packing.measurements || "N/A"}</td>
                </tr>
              );
            })
          )}
        </tbody>
        <tfoot>
          <tr style={{ fontWeight: "bold" }}>
            <td colSpan="3" style={tableCellStyle}>Total This Page</td>
            <td style={tableCellStyle}>{totalPackages} packages</td>
            <td style={tableCellStyle}>{totalNetWeight.toFixed(2)} Kg</td>
            <td style={tableCellStyle}>{totalGrossWeight.toFixed(2)} Kg</td>
            <td style={tableCellStyle}>-</td>
          </tr>
          <tr style={{ fontWeight: "bold" }}>
            <td colSpan="3" style={tableCellStyle}>Consignment Total</td>
            <td style={tableCellStyle}>{totalPackages} packages</td>
            <td style={tableCellStyle}>{totalNetWeight.toFixed(2)} Kg</td>
            <td style={tableCellStyle}>{totalGrossWeight.toFixed(2)} Kg</td>
            <td style={tableCellStyle}>-</td>
          </tr>
        </tfoot>
      </table>

      {/* Footer Section */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "30px" }}>
        <div>
          <div style={{ fontWeight: "bold", marginBottom: "5px" }}>Additional Info</div>
          <div style={{ fontSize: "10px", minHeight: "40px" }}>
            {inputs.additional_instructions || "All packages properly labeled and secured for export."}
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ marginBottom: "10px" }}>
            <strong>Signatory Company</strong><br />
            {inputs.exporter_company_name || "EXPORTER COMPANY NAME"}
          </div>
          <div style={{ marginBottom: "40px" }}>
            <strong>Name of Authorized Signatory</strong><br />
            {inputs.authorized_signatory_name || "Authorized Signatory"}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <strong>Designation</strong><br />
            {inputs.authorized_signatory_designation || "Authorized Signatory Designation"}
          </div>
          <div style={{ borderTop: `1px solid ${colors.border}`, width: "200px", margin: "0 auto", paddingTop: "5px" }}>
            {inputs.authorized_signature ? (
              <img
                src={inputs.authorized_signature}
                alt="Signature"
                style={{ maxHeight: "40px" }}
              />
            ) : (
              "Signature"
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* 4) Delivery Challan */
export function DeliveryChallan({ company = {}, inputs = {}, docIds = buildDocIds(), currentDate = new Date().toLocaleDateString('en-GB') }) {
  const products = parseProducts(inputs.products);

  const formatDate = (dateStr) => {
    if (!dateStr) return currentDate;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB');
  };

  return (
    <div style={containerBase}>
      {/* Header Section */}
      <div style={headerStyle}>
        <div style={{ flex: 1 }}>
          {inputs.exporter_logo && (
            <img
              src={inputs.exporter_logo}
              alt="Company Logo"
              style={{ maxHeight: "60px", marginBottom: "10px" }}
            />
          )}
          <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "5px" }}>
            {inputs.exporter_company_name || "EXPORTER"}
          </div>
          <div style={{ fontSize: "11px", color: colors.textSecondary, lineHeight: "1.3" }}>
            {inputs.exporter_address || "Exporter Address"}
          </div>
        </div>

        <div style={{ textAlign: "center", flex: 1 }}>
          <h1 style={docTitleStyle}>DELIVERY CHALLAN</h1>
          <div style={{ fontSize: "11px", marginTop: "5px" }}>
            Challan No: {docIds.challanNumber}
          </div>
          <div style={{ fontSize: "11px" }}>
            Date: {formatDate(inputs.delivery_date)}
          </div>
        </div>

        <div style={{ flex: 1, textAlign: "right" }}>
          <div style={{ fontSize: "11px", marginBottom: "5px" }}>
            <strong>Invoice Reference</strong><br />
            {inputs.invoice_number || "N/A"}<br />
            {formatDate(inputs.invoice_date)}
          </div>
          <div style={{ fontSize: "11px" }}>
            <strong>Vehicle No</strong><br />
            {inputs.vehicle_number || "To be assigned"}
          </div>
        </div>
      </div>

      {/* Delivery Information */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
        <div style={infoBoxStyle}>
          <div style={{ fontWeight: "bold", marginBottom: "8px", fontSize: "12px" }}>DELIVERED TO</div>
          <div style={{ fontWeight: "bold" }}>{inputs.buyer_company_name || "BUYER COMPANY NAME"}</div>
          <div style={{ fontSize: "10px", whiteSpace: "pre-line" }}>
            {inputs.delivery_address || inputs.buyer_address || "Delivery Address"}
          </div>
          {inputs.received_by_name && (
            <div style={{ fontSize: "10px", marginTop: "5px" }}>
              <strong>Attn:</strong> {inputs.received_by_name}
            </div>
          )}
        </div>

        <div style={infoBoxStyle}>
          <div style={{ fontWeight: "bold", marginBottom: "8px", fontSize: "12px" }}>DELIVERY DETAILS</div>
          <div style={{ fontSize: "10px" }}>
            <strong>Delivery Date:</strong> {formatDate(inputs.delivery_date)}<br />
            <strong>Vehicle No:</strong> {inputs.vehicle_number || "N/A"}<br />
            <strong>Reference:</strong> {inputs.buyer_reference || "N/A"}
          </div>
        </div>
      </div>

      {/* Products Table */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...tableHeaderStyle, width: "8%" }}>S.No</th>
            <th style={{ ...tableHeaderStyle, width: "20%" }}>Product Code</th>
            <th style={{ ...tableHeaderStyle, width: "42%" }}>Description of Goods</th>
            <th style={{ ...tableHeaderStyle, width: "10%" }}>Quantity</th>
            <th style={{ ...tableHeaderStyle, width: "10%" }}>Unit</th>
            <th style={{ ...tableHeaderStyle, width: "10%" }}>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ ...tableCellStyle, textAlign: "center", padding: "20px" }}>
                No products specified
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.sno}>
                <td style={tableCellStyle}>{product.sno}</td>
                <td style={tableCellStyle}>{product.product_code}</td>
                <td style={tableCellStyle}>
                  <div style={{ fontWeight: "bold" }}>{product.description}</div>
                </td>
                <td style={tableCellStyle}>{product.quantity}</td>
                <td style={tableCellStyle}>{product.unit}</td>
                <td style={tableCellStyle}>Good Condition</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Delivery Instructions */}
      {inputs.delivery_instructions && (
        <div style={{ margin: "20px 0", padding: "10px", border: `1px solid ${colors.border}`, borderRadius: "4px" }}>
          <div style={{ fontWeight: "bold", marginBottom: "5px" }}>Delivery Instructions:</div>
          <div style={{ fontSize: "10px" }}>{inputs.delivery_instructions}</div>
        </div>
      )}

      {/* Signatures */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "40px" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ marginBottom: "40px" }}>
            <strong>Prepared By</strong><br />
            {inputs.exporter_company_name || "EXPORTER COMPANY NAME"}
          </div>
          <div style={{ borderTop: `1px solid ${colors.border}`, width: "200px", margin: "0 auto", paddingTop: "5px" }}>
            {inputs.authorized_signature ? (
              <img
                src={inputs.authorized_signature}
                alt="Signature"
                style={{ maxHeight: "40px" }}
              />
            ) : (
              "Authorized Signature"
            )}
          </div>
          <div style={{ fontSize: "10px", marginTop: "5px" }}>
            {inputs.authorized_signatory_name || "Authorized Signatory"}
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ marginBottom: "40px" }}>
            <strong>Received By</strong><br />
            {inputs.buyer_company_name || "BUYER COMPANY NAME"}
          </div>
          <div style={{ borderTop: `1px solid ${colors.border}`, width: "200px", margin: "0 auto", paddingTop: "5px", minHeight: "45px" }}>
            {/* Empty space for receiver signature */}
          </div>
          <div style={{ fontSize: "10px", marginTop: "5px" }}>
            Name & Signature with Stamp
          </div>
        </div>
      </div>
    </div>
  );
}

/* 5) Credit/Debit Note */
export function CreditDebitNote({ company = {}, inputs = {}, docIds = buildDocIds(), currentDate = new Date().toLocaleDateString('en-GB') }) {
  const products = parseProducts(inputs.products);
  const totals = calculateTotals(products, inputs.currency);
  const noteType = inputs.note_type || 'Credit';
  const amountInWords = getAmountInWords(parseFloat(totals.total), inputs.currency);

  const formatDate = (dateStr) => {
    if (!dateStr) return currentDate;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB');
  };

  return (
    <div style={containerBase}>
      {/* Header Section */}
      <div style={headerStyle}>
        <div style={{ flex: 1 }}>
          {inputs.exporter_logo && (
            <img
              src={inputs.exporter_logo}
              alt="Company Logo"
              style={{ maxHeight: "60px", marginBottom: "10px" }}
            />
          )}
          <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "5px" }}>
            {inputs.exporter_company_name || "EXPORTER COMPANY NAME"}
          </div>
          <div style={{ fontSize: "11px", color: colors.textSecondary, lineHeight: "1.3" }}>
            {inputs.exporter_address || "Exporter Address"}
          </div>
          {inputs.exporter_gstin && (
            <div style={{ fontSize: "11px", color: colors.textSecondary, marginTop: "3px" }}>
              GSTIN: {inputs.exporter_gstin}
            </div>
          )}
        </div>

        <div style={{ textAlign: "center", flex: 1 }}>
          <h1 style={docTitleStyle}>{noteType.toUpperCase()} NOTE</h1>
          <div style={{ fontSize: "11px", marginTop: "5px" }}>
            {noteType === 'Credit' ? docIds.creditNoteNumber : docIds.debitNoteNumber}
          </div>
          <div style={{ fontSize: "11px" }}>
            Date: {currentDate}
          </div>
        </div>

        <div style={{ flex: 1, textAlign: "right" }}>
          <div style={{ fontSize: "11px", marginBottom: "5px" }}>
            <strong>Original Invoice</strong><br />
            {inputs.original_invoice_number || inputs.invoice_number || "N/A"}<br />
            {formatDate(inputs.original_invoice_date || inputs.invoice_date)}
          </div>
        </div>
      </div>

      {/* Buyer Information */}
      <div style={{ marginBottom: "20px" }}>
        <div style={infoBoxStyle}>
          <div style={{ fontWeight: "bold", marginBottom: "8px", fontSize: "12px" }}>BILL TO</div>
          <div style={{ fontWeight: "bold" }}>{inputs.buyer_company_name || "BUYER COMPANY NAME"}</div>
          <div style={{ fontSize: "10px", whiteSpace: "pre-line" }}>{inputs.buyer_address || "Buyer Address"}</div>
        </div>
      </div>

      {/* Reason Section */}
      <div style={{ ...infoBoxStyle, marginBottom: "20px", background: noteType === 'Credit' ? '#F0F8FF' : '#FFF0F0' }}>
        <div style={{ fontWeight: "bold", marginBottom: "5px" }}>Reason for {noteType} Note:</div>
        <div style={{ fontSize: "11px" }}>{inputs.note_reason || "Adjustment"}</div>
        {inputs.adjustment_type && (
          <div style={{ fontSize: "11px", marginTop: "5px" }}>
            <strong>Type:</strong> {inputs.adjustment_type}
          </div>
        )}
      </div>

      {/* Products Table */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...tableHeaderStyle, width: "8%" }}>S.No</th>
            <th style={{ ...tableHeaderStyle, width: "52%" }}>Description</th>
            <th style={{ ...tableHeaderStyle, width: "10%" }}>Quantity</th>
            <th style={{ ...tableHeaderStyle, width: "10%" }}>Unit Price ({inputs.currency})</th>
            <th style={{ ...tableHeaderStyle, width: "20%" }}>{noteType} Amount ({inputs.currency})</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ ...tableCellStyle, textAlign: "center", padding: "20px" }}>
                No items specified
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.sno}>
                <td style={tableCellStyle}>{product.sno}</td>
                <td style={tableCellStyle}>
                  <div style={{ fontWeight: "bold" }}>{product.description}</div>
                  {product.product_code && (
                    <div style={{ fontSize: "10px", color: colors.textSecondary }}>
                      Code: {product.product_code}
                    </div>
                  )}
                </td>
                <td style={tableCellStyle}>{product.quantity} {product.unit}</td>
                <td style={{ ...tableCellStyle, textAlign: "right" }}>
                  {parseFloat(product.unit_price).toFixed(2)}
                </td>
                <td style={{ ...tableCellStyle, textAlign: "right" }}>
                  {parseFloat(product.total_amount).toFixed(2)}
                </td>
              </tr>
            ))
          )}
        </tbody>
        <tfoot>
          <tr style={{ fontWeight: "bold" }}>
            <td colSpan="4" style={{ ...tableCellStyle, textAlign: "right" }}>
              Total {noteType} Amount:
            </td>
            <td style={{ ...tableCellStyle, textAlign: "right" }}>
              {inputs.currency} {totals.total}
            </td>
          </tr>
        </tfoot>
      </table>

      {/* Amount in Words */}
      <div style={{ margin: "15px 0", padding: "10px", border: `1px solid ${colors.border}`, borderRadius: "4px" }}>
        <div style={{ fontWeight: "bold", marginBottom: "5px" }}>Amount in Words:</div>
        <div style={{ fontSize: "11px" }}>{amountInWords}</div>
      </div>

      {/* Bank Details & Signature */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "30px" }}>
        <div>
          <div style={{ fontWeight: "bold", marginBottom: "5px" }}>Bank Details</div>
          <div style={{ fontSize: "10px", lineHeight: "1.4" }}>
            {inputs.bank_details || "Bank details to be provided separately"}
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ marginBottom: "40px" }}>
            <strong>Authorized Signatory</strong><br />
            {inputs.exporter_company_name || "EXPORTER COMPANY NAME"}
          </div>
          <div style={{ borderTop: `1px solid ${colors.border}`, width: "200px", margin: "0 auto", paddingTop: "5px" }}>
            {inputs.authorized_signature ? (
              <img
                src={inputs.authorized_signature}
                alt="Signature"
                style={{ maxHeight: "40px" }}
              />
            ) : (
              "Signature"
            )}
          </div>
          <div style={{ fontSize: "10px", marginTop: "5px" }}>
            {inputs.authorized_signatory_name || "Authorized Signatory"}<br />
            {inputs.authorized_signatory_designation || "Designation"}
          </div>
        </div>
      </div>
    </div>
  );
}

/* 6) Certificate of Origin */
export function CertificateOfOrigin({ company = {}, inputs = {}, docIds = buildDocIds(), currentDate = new Date().toLocaleDateString('en-GB') }) {
  const products = parseProducts(inputs.products);

  const formatDate = (dateStr) => {
    if (!dateStr) return currentDate;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB');
  };

  return (
    <div style={containerBase}>
      {/* Header Section */}
      <div style={{ ...headerStyle, borderBottom: `3px solid ${colors.accent}` }}>
        <div style={{ flex: 1 }}>
          {inputs.exporter_logo && (
            <img
              src={inputs.exporter_logo}
              alt="Company Logo"
              style={{ maxHeight: "60px", marginBottom: "10px" }}
            />
          )}
        </div>

        <div style={{ textAlign: "center", flex: 2 }}>
          <h1 style={{ ...docTitleStyle, color: colors.accent }}>CERTIFICATE OF ORIGIN</h1>
          <div style={{ fontSize: "11px", marginTop: "5px" }}>
            Certificate No: {docIds.certificateNumber}
          </div>
          <div style={{ fontSize: "11px" }}>
            Date: {currentDate}
          </div>
        </div>

        <div style={{ flex: 1, textAlign: "right" }}>
          <div style={{ fontSize: "11px" }}>
            <strong>Type:</strong> {inputs.certificate_type || "Non-preferential"}
          </div>
        </div>
      </div>

      {/* Exporter and Consignee Information */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
        <div style={infoBoxStyle}>
          <div style={{ fontWeight: "bold", marginBottom: "8px", fontSize: "12px", color: colors.accent }}>EXPORTER</div>
          <div style={{ fontWeight: "bold" }}>{inputs.exporter_company_name || "EXPORTER COMPANY NAME"}</div>
          <div style={{ fontSize: "10px", whiteSpace: "pre-line" }}>{inputs.exporter_address || "Exporter Address"}</div>
          {inputs.exporter_gstin && (
            <div style={{ fontSize: "10px", marginTop: "3px" }}>
              <strong>GSTIN:</strong> {inputs.exporter_gstin}
            </div>
          )}
          {inputs.exporter_eori_number && (
            <div style={{ fontSize: "10px", marginTop: "3px" }}>
              <strong>EORI:</strong> {inputs.exporter_eori_number}
            </div>
          )}
        </div>

        <div style={infoBoxStyle}>
          <div style={{ fontWeight: "bold", marginBottom: "8px", fontSize: "12px", color: colors.accent }}>CONSIGNEE</div>
          {inputs.consignee_same_as_buyer === 'Yes' ? (
            <div>
              <div style={{ fontWeight: "bold" }}>{inputs.buyer_company_name || "BUYER COMPANY NAME"}</div>
              <div style={{ fontSize: "10px", whiteSpace: "pre-line" }}>{inputs.buyer_address || "Buyer Address"}</div>
            </div>
          ) : (
            <div>
              <div style={{ fontWeight: "bold" }}>{inputs.consignee_company_name || "CONSIGNEE COMPANY NAME"}</div>
              <div style={{ fontSize: "10px", whiteSpace: "pre-line" }}>{inputs.consignee_address || "Consignee Address"}</div>
            </div>
          )}
        </div>
      </div>

      {/* Shipment Details */}
      <div style={{ ...infoBoxStyle, marginBottom: "20px", background: "#F0F8FF" }}>
        <div style={{ fontWeight: "bold", marginBottom: "8px", fontSize: "12px", color: colors.accent }}>SHIPMENT DETAILS</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", fontSize: "11px" }}>
          <div>
            <strong>Country of Origin:</strong><br />
            {inputs.country_of_origin || "N/A"}
          </div>
          <div>
            <strong>Final Destination:</strong><br />
            {inputs.final_destination_country || "N/A"}
          </div>
          <div>
            <strong>Port of Loading:</strong><br />
            {inputs.port_of_loading || "N/A"}
          </div>
          <div>
            <strong>Vessel/Flight:</strong><br />
            {inputs.vessel_flight_details || "N/A"}
          </div>
          <div>
            <strong>Departure Date:</strong><br />
            {formatDate(inputs.departure_date)}
          </div>
          <div>
            <strong>Origin Criteria:</strong><br />
            {inputs.origin_criteria || "Wholly obtained"}
          </div>
        </div>
      </div>

      {/* Products Table */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...tableHeaderStyle, width: "8%" }}>S.No</th>
            <th style={{ ...tableHeaderStyle, width: "25%" }}>Product Code</th>
            <th style={{ ...tableHeaderStyle, width: "42%" }}>Description of Goods</th>
            <th style={{ ...tableHeaderStyle, width: "10%" }}>HS Code</th>
            <th style={{ ...tableHeaderStyle, width: "15%" }}>Origin Criteria</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ ...tableCellStyle, textAlign: "center", padding: "20px" }}>
                No products specified
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.sno}>
                <td style={tableCellStyle}>{product.sno}</td>
                <td style={tableCellStyle}>{product.product_code}</td>
                <td style={tableCellStyle}>
                  <div style={{ fontWeight: "bold" }}>{product.description}</div>
                </td>
                <td style={tableCellStyle}>{product.hs_code}</td>
                <td style={tableCellStyle}>{inputs.origin_criteria || "Wholly obtained"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Declaration */}
      <div style={{ margin: "20px 0", padding: "15px", border: `2px solid ${colors.accent}`, borderRadius: "4px" }}>
        <div style={{ fontWeight: "bold", marginBottom: "10px", textAlign: "center", color: colors.accent }}>
          DECLARATION
        </div>
        <div style={{ fontSize: "11px", lineHeight: "1.6", textAlign: "justify" }}>
          I, the undersigned, hereby declare that the above-stated information is correct and that
          all the goods were produced in {inputs.country_of_origin || "the exporting country"} and
          comply with the origin requirements specified for the purposes of this certificate.
        </div>
      </div>

      {/* Authority and Signature */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "30px" }}>
        <div>
          <div style={{ fontWeight: "bold", marginBottom: "5px" }}>Issuing Authority</div>
          <div style={{ fontSize: "10px" }}>
            {inputs.customs_authority || "Customs Authority"}<br />
            {inputs.exporter_country || "Exporting Country"}
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ marginBottom: "40px" }}>
            <strong>Authorized Signatory</strong><br />
            {inputs.exporter_company_name || "EXPORTER COMPANY NAME"}
          </div>
          <div style={{ borderTop: `1px solid ${colors.border}`, width: "200px", margin: "0 auto", paddingTop: "5px" }}>
            {inputs.authorized_signature ? (
              <img
                src={inputs.authorized_signature}
                alt="Signature"
                style={{ maxHeight: "40px" }}
              />
            ) : (
              "Signature"
            )}
          </div>
          <div style={{ fontSize: "10px", marginTop: "5px" }}>
            {inputs.authorized_signatory_name || "Authorized Signatory"}<br />
            {inputs.authorized_signatory_designation || "Designation"}
          </div>
        </div>
      </div>
    </div>
  );
}

/* 7) Bill of Lading */
export function BillOfLading({ company = {}, inputs = {}, docIds = buildDocIds(), currentDate = new Date().toLocaleDateString('en-GB') }) {
  const products = parseProducts(inputs.products);
  const packingInfo = parsePackingInfo(inputs.packing_info);

  const formatDate = (dateStr) => {
    if (!dateStr) return currentDate;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB');
  };

  // Calculate totals
  const totalPackages = packingInfo.reduce((sum, p) => sum + (p.number_of_packages || 0), 0);
  const totalGrossWeight = packingInfo.reduce((sum, p) => sum + (p.gross_weight || 0), 0);

  return (
    <div style={containerBase}>
      {/* Header Section */}
      <div style={{ ...headerStyle, borderBottom: `3px solid ${colors.accent}` }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "16px", fontWeight: "bold", color: colors.accent, marginBottom: "5px" }}>
            BILL OF LADING
          </div>
          <div style={{ fontSize: "11px" }}>
            <strong>Type:</strong> {inputs.bl_type || "Sea Waybill"}
          </div>
        </div>

        <div style={{ textAlign: "center", flex: 1 }}>
          <h1 style={{ ...docTitleStyle, color: colors.accent }}>BILL OF LADING</h1>
          <div style={{ fontSize: "11px", marginTop: "5px" }}>
            B/L No: {inputs.bill_of_lading || docIds.blNumber}
          </div>
        </div>

        <div style={{ flex: 1, textAlign: "right" }}>
          <div style={{ fontSize: "11px", marginBottom: "5px" }}>
            <strong>Reference No:</strong><br />
            {inputs.export_reference || "N/A"}
          </div>
        </div>
      </div>

      {/* Shipper and Consignee Information */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
        <div style={infoBoxStyle}>
          <div style={{ fontWeight: "bold", marginBottom: "8px", fontSize: "12px" }}>SHIPPER</div>
          <div style={{ fontWeight: "bold" }}>{inputs.exporter_company_name || "EXPORTER COMPANY NAME"}</div>
          <div style={{ fontSize: "10px", whiteSpace: "pre-line" }}>{inputs.exporter_address || "Exporter Address"}</div>
        </div>

        <div style={infoBoxStyle}>
          <div style={{ fontWeight: "bold", marginBottom: "8px", fontSize: "12px" }}>CONSIGNEE</div>
          {inputs.consignee_same_as_buyer === 'Yes' ? (
            <div>
              <div style={{ fontWeight: "bold" }}>{inputs.buyer_company_name || "BUYER COMPANY NAME"}</div>
              <div style={{ fontSize: "10px", whiteSpace: "pre-line" }}>{inputs.buyer_address || "Buyer Address"}</div>
            </div>
          ) : (
            <div>
              <div style={{ fontWeight: "bold" }}>{inputs.consignee_company_name || "CONSIGNEE COMPANY NAME"}</div>
              <div style={{ fontSize: "10px", whiteSpace: "pre-line" }}>{inputs.consignee_address || "Consignee Address"}</div>
            </div>
          )}
        </div>
      </div>

      {/* Notify Party */}
      <div style={{ marginBottom: "20px" }}>
        <div style={infoBoxStyle}>
          <div style={{ fontWeight: "bold", marginBottom: "8px", fontSize: "12px" }}>NOTIFY PARTY</div>
          {inputs.notify_party_same_as_consignee === 'No' && inputs.notify_party_company_name ? (
            <div>
              <div style={{ fontWeight: "bold" }}>{inputs.notify_party_company_name}</div>
              <div style={{ fontSize: "10px", whiteSpace: "pre-line" }}>{inputs.notify_party_address || "Notify Party Address"}</div>
            </div>
          ) : (
            <div style={{ fontSize: "11px", fontStyle: "italic" }}>
              Same as Consignee
            </div>
          )}
        </div>
      </div>

      {/* Vessel and Voyage Details */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px", marginBottom: "20px", fontSize: "11px" }}>
        <div>
          <strong>Vessel</strong><br />
          {inputs.vessel_flight_details?.split('/')[0] || "N/A"}
        </div>
        <div>
          <strong>Voyage No</strong><br />
          {inputs.vessel_flight_details?.split('/')[1] || "N/A"}
        </div>
        <div>
          <strong>Port of Loading</strong><br />
          {inputs.port_of_loading || "N/A"}
        </div>
        <div>
          <strong>Port of Discharge</strong><br />
          {inputs.port_of_discharge || "N/A"}
        </div>
        <div>
          <strong>Place of Receipt</strong><br />
          {inputs.place_of_receipt || "N/A"}
        </div>
        <div>
          <strong>Place of Delivery</strong><br />
          {inputs.place_of_delivery || "N/A"}
        </div>
        <div>
          <strong>Freight Terms</strong><br />
          {inputs.freight_terms || "N/A"}
        </div>
        <div>
          <strong>Number of Originals</strong><br />
          {inputs.number_of_originals || "3"}
        </div>
      </div>

      {/* Goods Description Table */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...tableHeaderStyle, width: "8%" }}>Marks & Nos</th>
            <th style={{ ...tableHeaderStyle, width: "12%" }}>No of Packages</th>
            <th style={{ ...tableHeaderStyle, width: "25%" }}>Description of Goods</th>
            <th style={{ ...tableHeaderStyle, width: "15%" }}>Gross Weight (Kg)</th>
            <th style={{ ...tableHeaderStyle, width: "15%" }}>Measurement (m³)</th>
          </tr>
        </thead>
        <tbody>
          {packingInfo.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ ...tableCellStyle, textAlign: "center", padding: "20px" }}>
                No cargo information specified
              </td>
            </tr>
          ) : (
            packingInfo.map((packing, index) => {
              const product = products[parseInt(packing.product_index) - 1];
              return (
                <tr key={packing.sno}>
                  <td style={tableCellStyle}>
                    {product?.product_code || "N/A"}
                  </td>
                  <td style={tableCellStyle}>
                    {packing.number_of_packages} {packing.kind_of_packages}
                  </td>
                  <td style={tableCellStyle}>
                    <div style={{ fontWeight: "bold" }}>{product?.description || "Cargo Description"}</div>
                  </td>
                  <td style={tableCellStyle}>{packing.gross_weight.toFixed(2)}</td>
                  <td style={tableCellStyle}>{packing.measurements || "N/A"}</td>
                </tr>
              );
            })
          )}
        </tbody>
        <tfoot>
          <tr style={{ fontWeight: "bold" }}>
            <td style={tableCellStyle}>TOTAL</td>
            <td style={tableCellStyle}>{totalPackages} packages</td>
            <td style={tableCellStyle}>SHIPPER'S LOAD, COUNT & SEAL</td>
            <td style={tableCellStyle}>{totalGrossWeight.toFixed(2)} Kg</td>
            <td style={tableCellStyle}>-</td>
          </tr>
        </tfoot>
      </table>

      {/* Freight and Charges */}
      <div style={{ margin: "15px 0", fontSize: "11px" }}>
        <strong>Freight and Charges:</strong> {inputs.freight_terms === 'Prepaid' ? 'FREIGHT PREPAID' : 'FREIGHT COLLECT'}
      </div>

      {/* Declaration */}
      <div style={{ margin: "20px 0", padding: "15px", border: `1px solid ${colors.border}`, borderRadius: "4px", fontSize: "10px" }}>
        <div style={{ fontWeight: "bold", marginBottom: "10px" }}>SHIPPED ON BOARD DATE</div>
        <div style={{ marginBottom: "10px" }}>
          {formatDate(inputs.departure_date)}
        </div>
        <div style={{ fontStyle: "italic" }}>
          In witness whereof, the number of original Bills of Lading stated above have been signed,
          one of which being accomplished, the other(s) to be void.
        </div>
      </div>

      {/* Signature */}
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <div style={{ borderTop: `1px solid ${colors.border}`, width: "300px", margin: "0 auto", paddingTop: "5px" }}>
          <strong>For the Carrier</strong>
        </div>
        <div style={{ fontSize: "10px", marginTop: "5px" }}>
          {currentDate}
        </div>
      </div>
    </div>
  );
}

/* 8) Shipping Instructions */
export function ShippingInstructions({ company = {}, inputs = {}, docIds = buildDocIds(), currentDate = new Date().toLocaleDateString('en-GB') }) {
  const products = parseProducts(inputs.products);
  const packingInfo = parsePackingInfo(inputs.packing_info);

  const formatDate = (dateStr) => {
    if (!dateStr) return currentDate;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB');
  };

  return (
    <div style={containerBase}>
      {/* Header Section */}
      <div style={headerStyle}>
        <div style={{ flex: 1 }}>
          {inputs.exporter_logo && (
            <img
              src={inputs.exporter_logo}
              alt="Company Logo"
              style={{ maxHeight: "60px", marginBottom: "10px" }}
            />
          )}
          <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "5px" }}>
            {inputs.exporter_company_name || "SHIPPER"}
          </div>
          <div style={{ fontSize: "11px", color: colors.textSecondary, lineHeight: "1.3" }}>
            {inputs.exporter_address || "Shipper Address"}
          </div>
        </div>

        <div style={{ textAlign: "center", flex: 1 }}>
          <h1 style={docTitleStyle}>SHIPPING INSTRUCTIONS</h1>
          <div style={{ fontSize: "11px", marginTop: "5px" }}>
            SI No: {docIds.siNumber}
          </div>
          <div style={{ fontSize: "11px" }}>
            Date: {currentDate}
          </div>
        </div>

        <div style={{ flex: 1, textAlign: "right" }}>
          <div style={{ fontSize: "11px", marginBottom: "5px" }}>
            <strong>Forwarder</strong><br />
            {inputs.forwarder_company || "To be assigned"}
          </div>
        </div>
      </div>

      {/* Consignee and Notify Party */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
        <div style={infoBoxStyle}>
          <div style={{ fontWeight: "bold", marginBottom: "8px", fontSize: "12px" }}>CONSIGNEE</div>
          {inputs.consignee_same_as_buyer === 'Yes' ? (
            <div>
              <div style={{ fontWeight: "bold" }}>{inputs.buyer_company_name || "BUYER COMPANY NAME"}</div>
              <div style={{ fontSize: "10px", whiteSpace: "pre-line" }}>{inputs.buyer_address || "Buyer Address"}</div>
            </div>
          ) : (
            <div>
              <div style={{ fontWeight: "bold" }}>{inputs.consignee_company_name || "CONSIGNEE COMPANY NAME"}</div>
              <div style={{ fontSize: "10px", whiteSpace: "pre-line" }}>{inputs.consignee_address || "Consignee Address"}</div>
            </div>
          )}
        </div>

        <div style={infoBoxStyle}>
          <div style={{ fontWeight: "bold", marginBottom: "8px", fontSize: "12px" }}>NOTIFY PARTY</div>
          {inputs.notify_party_same_as_consignee === 'No' && inputs.notify_party_company_name ? (
            <div>
              <div style={{ fontWeight: "bold" }}>{inputs.notify_party_company_name}</div>
              <div style={{ fontSize: "10px", whiteSpace: "pre-line" }}>{inputs.notify_party_address || "Notify Party Address"}</div>
            </div>
          ) : (
            <div style={{ fontSize: "11px" }}>
              Same as Consignee
            </div>
          )}
        </div>
      </div>

      {/* Shipment Details */}
      <div style={{ ...infoBoxStyle, marginBottom: "20px" }}>
        <div style={{ fontWeight: "bold", marginBottom: "8px", fontSize: "12px" }}>SHIPMENT DETAILS</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", fontSize: "11px" }}>
          <div>
            <strong>Port of Loading:</strong><br />
            {inputs.port_of_loading || "N/A"}
          </div>
          <div>
            <strong>Port of Discharge:</strong><br />
            {inputs.port_of_discharge || "N/A"}
          </div>
          <div>
            <strong>Final Destination:</strong><br />
            {inputs.final_destination_country || "N/A"}
          </div>
          <div>
            <strong>Vessel/Flight:</strong><br />
            {inputs.vessel_flight_details || "N/A"}
          </div>
          <div>
            <strong>ETD:</strong><br />
            {formatDate(inputs.departure_date)}
          </div>
          <div>
            <strong>ETA:</strong><br />
            {formatDate(inputs.delivery_date)}
          </div>
        </div>
      </div>

      {/* Cargo Details */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...tableHeaderStyle, width: "8%" }}>S.No</th>
            <th style={{ ...tableHeaderStyle, width: "25%" }}>Description of Goods</th>
            <th style={{ ...tableHeaderStyle, width: "12%" }}>Quantity</th>
            <th style={{ ...tableHeaderStyle, width: "15%" }}>Packages</th>
            <th style={{ ...tableHeaderStyle, width: "15%" }}>Gross Weight (Kg)</th>
            <th style={{ ...tableHeaderStyle, width: "15%" }}>Dimensions</th>
          </tr>
        </thead>
        <tbody>
          {packingInfo.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ ...tableCellStyle, textAlign: "center", padding: "20px" }}>
                No cargo information specified
              </td>
            </tr>
          ) : (
            packingInfo.map((packing, index) => {
              const product = products[parseInt(packing.product_index) - 1];
              return (
                <tr key={packing.sno}>
                  <td style={tableCellStyle}>{packing.sno}</td>
                  <td style={tableCellStyle}>
                    <div style={{ fontWeight: "bold" }}>{product?.description || "Cargo Description"}</div>
                    {product?.product_code && (
                      <div style={{ fontSize: "10px" }}>Code: {product.product_code}</div>
                    )}
                  </td>
                  <td style={tableCellStyle}>{product?.quantity || "N/A"} {product?.unit || ""}</td>
                  <td style={tableCellStyle}>
                    {packing.number_of_packages} {packing.kind_of_packages}
                  </td>
                  <td style={tableCellStyle}>{packing.gross_weight.toFixed(2)}</td>
                  <td style={tableCellStyle}>{packing.measurements || "N/A"}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Special Instructions */}
      {inputs.special_handling && (
        <div style={{ margin: "15px 0", padding: "10px", border: `1px solid ${colors.border}`, borderRadius: "4px" }}>
          <div style={{ fontWeight: "bold", marginBottom: "5px" }}>Special Handling Instructions:</div>
          <div style={{ fontSize: "11px" }}>{inputs.special_handling}</div>
        </div>
      )}

      {/* Documents Required */}
      <div style={{ margin: "15px 0", padding: "10px", border: `1px solid ${colors.border}`, borderRadius: "4px" }}>
        <div style={{ fontWeight: "bold", marginBottom: "5px" }}>Documents Required:</div>
        <div style={{ fontSize: "11px" }}>
          {inputs.documents_required || "Commercial Invoice, Packing List, Bill of Lading"}
        </div>
      </div>

      {/* Contact Information */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "30px" }}>
        <div>
          <div style={{ fontWeight: "bold", marginBottom: "5px" }}>Shipper Contact</div>
          <div style={{ fontSize: "10px" }}>
            {inputs.exporter_contact_person || "Contact Person"}<br />
            {inputs.exporter_contact_info || "Contact Details"}
          </div>
        </div>
        <div>
          <div style={{ fontWeight: "bold", marginBottom: "5px" }}>Forwarder Contact</div>
          <div style={{ fontSize: "10px" }}>
            {inputs.forwarder_contact || "To be assigned"}
          </div>
        </div>
      </div>

      {/* Signature */}
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <div style={{ marginBottom: "40px" }}>
          <strong>Authorized Signatory</strong><br />
          {inputs.exporter_company_name || "SHIPPER COMPANY NAME"}
        </div>
        <div style={{ borderTop: `1px solid ${colors.border}`, width: "200px", margin: "0 auto", paddingTop: "5px" }}>
          {inputs.authorized_signature ? (
            <img
              src={inputs.authorized_signature}
              alt="Signature"
              style={{ maxHeight: "40px" }}
            />
          ) : (
            "Signature"
          )}
        </div>
        <div style={{ fontSize: "10px", marginTop: "5px" }}>
          {inputs.authorized_signatory_name || "Authorized Signatory"}
        </div>
      </div>
    </div>
  );
}

/* 9) Export Declaration */
export function ExportDeclaration({ company = {}, inputs = {}, docIds = buildDocIds(), currentDate = new Date().toLocaleDateString('en-GB') }) {
  const products = parseProducts(inputs.products);

  const formatDate = (dateStr) => {
    if (!dateStr) return currentDate;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB');
  };

  // Calculate total value
  const totalValue = products.reduce((sum, product) => sum + (product.total_amount || 0), 0);

  return (
    <div style={containerBase}>
      {/* Header Section */}
      <div style={{ ...headerStyle, borderBottom: `3px solid ${colors.accent}` }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "16px", fontWeight: "bold", color: colors.accent, marginBottom: "5px" }}>
            EXPORT DECLARATION
          </div>
          <div style={{ fontSize: "11px" }}>
            Declaration No: {inputs.declaration_number || docIds.declarationNumber}
          </div>
        </div>

        <div style={{ textAlign: "center", flex: 1 }}>
          <h1 style={{ ...docTitleStyle, color: colors.accent }}>EXPORT DECLARATION</h1>
          <div style={{ fontSize: "11px", marginTop: "5px" }}>
            Date: {currentDate}
          </div>
        </div>

        <div style={{ flex: 1, textAlign: "right" }}>
          <div style={{ fontSize: "11px" }}>
            <strong>Customs Office:</strong><br />
            {inputs.customs_office || "N/A"}
          </div>
        </div>
      </div>

      {/* Exporter Information */}
      <div style={{ marginBottom: "20px" }}>
        <div style={infoBoxStyle}>
          <div style={{ fontWeight: "bold", marginBottom: "8px", fontSize: "12px", color: colors.accent }}>EXPORTER</div>
          <div style={{ fontWeight: "bold" }}>{inputs.exporter_company_name || "EXPORTER COMPANY NAME"}</div>
          <div style={{ fontSize: "10px", whiteSpace: "pre-line" }}>{inputs.exporter_address || "Exporter Address"}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "5px", fontSize: "10px" }}>
            <div>
              <strong>GSTIN:</strong> {inputs.exporter_gstin || "N/A"}
            </div>
            <div>
              <strong>EORI:</strong> {inputs.exporter_eori_number || "N/A"}
            </div>
          </div>
        </div>
      </div>

      {/* Consignee Information */}
      <div style={{ marginBottom: "20px" }}>
        <div style={infoBoxStyle}>
          <div style={{ fontWeight: "bold", marginBottom: "8px", fontSize: "12px" }}>CONSIGNEE</div>
          {inputs.consignee_same_as_buyer === 'Yes' ? (
            <div>
              <div style={{ fontWeight: "bold" }}>{inputs.buyer_company_name || "BUYER COMPANY NAME"}</div>
              <div style={{ fontSize: "10px", whiteSpace: "pre-line" }}>{inputs.buyer_address || "Buyer Address"}</div>
            </div>
          ) : (
            <div>
              <div style={{ fontWeight: "bold" }}>{inputs.consignee_company_name || "CONSIGNEE COMPANY NAME"}</div>
              <div style={{ fontSize: "10px", whiteSpace: "pre-line" }}>{inputs.consignee_address || "Consignee Address"}</div>
            </div>
          )}
        </div>
      </div>

      {/* Shipment Details */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px", marginBottom: "20px", fontSize: "11px" }}>
        <div>
          <strong>Country of Origin</strong><br />
          {inputs.country_of_origin || "N/A"}
        </div>
        <div>
          <strong>Country of Destination</strong><br />
          {inputs.final_destination_country || "N/A"}
        </div>
        <div>
          <strong>Port of Loading</strong><br />
          {inputs.port_of_loading || "N/A"}
        </div>
        <div>
          <strong>Port of Discharge</strong><br />
          {inputs.port_of_discharge || "N/A"}
        </div>
        <div>
          <strong>Vessel/Flight</strong><br />
          {inputs.vessel_flight_details || "N/A"}
        </div>
        <div>
          <strong>Departure Date</strong><br />
          {formatDate(inputs.departure_date)}
        </div>
        <div>
          <strong>Export Purpose</strong><br />
          {inputs.export_purpose || "Sale"}
        </div>
        <div>
          <strong>Currency</strong><br />
          {inputs.currency || "USD"}
        </div>
      </div>

      {/* Goods Declaration Table */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...tableHeaderStyle, width: "8%" }}>S.No</th>
            <th style={{ ...tableHeaderStyle, width: "15%" }}>HS Code</th>
            <th style={{ ...tableHeaderStyle, width: "35%" }}>Description of Goods</th>
            <th style={{ ...tableHeaderStyle, width: "12%" }}>Quantity</th>
            <th style={{ ...tableHeaderStyle, width: "15%" }}>Unit Value ({inputs.currency})</th>
            <th style={{ ...tableHeaderStyle, width: "15%" }}>Total Value ({inputs.currency})</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ ...tableCellStyle, textAlign: "center", padding: "20px" }}>
                No goods specified
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.sno}>
                <td style={tableCellStyle}>{product.sno}</td>
                <td style={tableCellStyle}>{product.hs_code}</td>
                <td style={tableCellStyle}>
                  <div style={{ fontWeight: "bold" }}>{product.description}</div>
                  {product.product_code && (
                    <div style={{ fontSize: "10px" }}>Code: {product.product_code}</div>
                  )}
                </td>
                <td style={tableCellStyle}>{product.quantity} {product.unit}</td>
                <td style={{ ...tableCellStyle, textAlign: "right" }}>
                  {parseFloat(product.unit_price).toFixed(2)}
                </td>
                <td style={{ ...tableCellStyle, textAlign: "right" }}>
                  {parseFloat(product.total_amount).toFixed(2)}
                </td>
              </tr>
            ))
          )}
        </tbody>
        <tfoot>
          <tr style={{ fontWeight: "bold" }}>
            <td colSpan="5" style={{ ...tableCellStyle, textAlign: "right" }}>
              Total FOB Value:
            </td>
            <td style={{ ...tableCellStyle, textAlign: "right" }}>
              {inputs.currency} {totalValue.toFixed(2)}
            </td>
          </tr>
        </tfoot>
      </table>

      {/* License and Additional Information */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "20px" }}>
        <div>
          <div style={{ fontWeight: "bold", marginBottom: "5px" }}>License Details</div>
          <div style={{ fontSize: "10px", minHeight: "40px" }}>
            {inputs.license_details || "No license required"}
          </div>
        </div>
        <div>
          <div style={{ fontWeight: "bold", marginBottom: "5px" }}>Additional Information</div>
          <div style={{ fontSize: "10px", minHeight: "40px" }}>
            {inputs.additional_instructions || "All goods comply with export regulations."}
          </div>
        </div>
      </div>

      {/* Declaration */}
      <div style={{ margin: "20px 0", padding: "15px", border: `2px solid ${colors.accent}`, borderRadius: "4px" }}>
        <div style={{ fontWeight: "bold", marginBottom: "10px", textAlign: "center", color: colors.accent }}>
          DECLARATION
        </div>
        <div style={{ fontSize: "11px", lineHeight: "1.6", textAlign: "justify" }}>
          I/We hereby declare that the above-stated particulars are true and correct and that
          the goods described above are intended for exportation from the customs territory of
          the exporting country. I/We undertake to comply with all the relevant laws and regulations
          governing the export of these goods.
        </div>
      </div>

      {/* Signature */}
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <div style={{ marginBottom: "40px" }}>
          <strong>Authorized Signatory</strong><br />
          {inputs.exporter_company_name || "EXPORTER COMPANY NAME"}
        </div>
        <div style={{ borderTop: `1px solid ${colors.border}`, width: "200px", margin: "0 auto", paddingTop: "5px" }}>
          {inputs.authorized_signature ? (
            <img
              src={inputs.authorized_signature}
              alt="Signature"
              style={{ maxHeight: "40px" }}
            />
          ) : (
            "Signature"
          )}
        </div>
        <div style={{ fontSize: "10px", marginTop: "5px" }}>
          {inputs.authorized_signatory_name || "Authorized Signatory"}<br />
          {inputs.authorized_signatory_designation || "Designation"}
        </div>
      </div>
    </div>
  );
}

/* 10) Air Waybill */
export function AirWaybill({ company = {}, inputs = {}, docIds = buildDocIds(), currentDate = new Date().toLocaleDateString('en-GB') }) {
  const products = parseProducts(inputs.products);
  const packingInfo = parsePackingInfo(inputs.packing_info);

  const formatDate = (dateStr) => {
    if (!dateStr) return currentDate;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB');
  };

  // Calculate totals
  const totalPackages = packingInfo.reduce((sum, p) => sum + (p.number_of_packages || 0), 0);
  const totalGrossWeight = packingInfo.reduce((sum, p) => sum + (p.gross_weight || 0), 0);

  return (
    <div style={containerBase}>
      {/* Header Section */}
      <div style={{ ...headerStyle, borderBottom: `3px solid ${colors.accent}` }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "16px", fontWeight: "bold", color: colors.accent, marginBottom: "5px" }}>
            AIR WAYBILL
          </div>
          <div style={{ fontSize: "11px" }}>
            AWB No: {docIds.awbNumber}
          </div>
        </div>

        <div style={{ textAlign: "center", flex: 1 }}>
          <h1 style={{ ...docTitleStyle, color: colors.accent }}>AIR WAYBILL</h1>
          <div style={{ fontSize: "11px", marginTop: "5px" }}>
            Not Negotiable
          </div>
        </div>

        <div style={{ flex: 1, textAlign: "right" }}>
          <div style={{ fontSize: "11px" }}>
            <strong>Flight Date:</strong><br />
            {formatDate(inputs.departure_date)}
          </div>
        </div>
      </div>

      {/* Shipper and Consignee Information */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
        <div style={infoBoxStyle}>
          <div style={{ fontWeight: "bold", marginBottom: "8px", fontSize: "12px" }}>SHIPPER</div>
          <div style={{ fontWeight: "bold" }}>{inputs.exporter_company_name || "EXPORTER COMPANY NAME"}</div>
          <div style={{ fontSize: "10px", whiteSpace: "pre-line" }}>{inputs.exporter_address || "Exporter Address"}</div>
          <div style={{ fontSize: "10px", marginTop: "5px" }}>
            <strong>Contact:</strong> {inputs.exporter_contact_info || "N/A"}
          </div>
        </div>

        <div style={infoBoxStyle}>
          <div style={{ fontWeight: "bold", marginBottom: "8px", fontSize: "12px" }}>CONSIGNEE</div>
          {inputs.consignee_same_as_buyer === 'Yes' ? (
            <div>
              <div style={{ fontWeight: "bold" }}>{inputs.buyer_company_name || "BUYER COMPANY NAME"}</div>
              <div style={{ fontSize: "10px", whiteSpace: "pre-line" }}>{inputs.buyer_address || "Buyer Address"}</div>
            </div>
          ) : (
            <div>
              <div style={{ fontWeight: "bold" }}>{inputs.consignee_company_name || "CONSIGNEE COMPANY NAME"}</div>
              <div style={{ fontSize: "10px", whiteSpace: "pre-line" }}>{inputs.consignee_address || "Consignee Address"}</div>
            </div>
          )}
        </div>
      </div>

      {/* Flight and Routing Details */}
      <div style={{ ...infoBoxStyle, marginBottom: "20px" }}>
        <div style={{ fontWeight: "bold", marginBottom: "8px", fontSize: "12px" }}>ROUTING AND DESTINATION</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px", fontSize: "11px" }}>
          <div>
            <strong>Airport of Departure</strong><br />
            {inputs.airport_of_departure || "N/A"}
          </div>
          <div>
            <strong>Airport of Destination</strong><br />
            {inputs.airport_of_destination || "N/A"}
          </div>
          <div>
            <strong>Flight Number</strong><br />
            {inputs.flight_number || "N/A"}
          </div>
          <div>
            <strong>Flight Date</strong><br />
            {formatDate(inputs.departure_date)}
          </div>
        </div>
      </div>

      {/* Cargo Details */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...tableHeaderStyle, width: "8%" }}>No of Pieces</th>
            <th style={{ ...tableHeaderStyle, width: "15%" }}>Gross Weight (Kg)</th>
            <th style={{ ...tableHeaderStyle, width: "10%" }}>Kg/Lb</th>
            <th style={{ ...tableHeaderStyle, width: "15%" }}>Rate Class</th>
            <th style={{ ...tableHeaderStyle, width: "42%" }}>Nature and Quantity of Goods</th>
          </tr>
        </thead>
        <tbody>
          {packingInfo.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ ...tableCellStyle, textAlign: "center", padding: "20px" }}>
                No cargo information specified
              </td>
            </tr>
          ) : (
            packingInfo.map((packing, index) => {
              const product = products[parseInt(packing.product_index) - 1];
              return (
                <tr key={packing.sno}>
                  <td style={tableCellStyle}>{packing.number_of_packages}</td>
                  <td style={tableCellStyle}>{packing.gross_weight.toFixed(2)}</td>
                  <td style={tableCellStyle}>Kg</td>
                  <td style={tableCellStyle}>N</td>
                  <td style={tableCellStyle}>
                    <div style={{ fontWeight: "bold" }}>{product?.description || "Cargo Description"}</div>
                    <div style={{ fontSize: "10px" }}>
                      {packing.kind_of_packages} {packing.measurements && `- ${packing.measurements}`}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
        <tfoot>
          <tr style={{ fontWeight: "bold" }}>
            <td style={tableCellStyle}>{totalPackages}</td>
            <td style={tableCellStyle}>{totalGrossWeight.toFixed(2)}</td>
            <td style={tableCellStyle}>Kg</td>
            <td style={tableCellStyle}></td>
            <td style={tableCellStyle}>TOTAL</td>
          </tr>
        </tfoot>
      </table>

      {/* Handling Information */}
      <div style={{ margin: "15px 0", padding: "10px", border: `1px solid ${colors.border}`, borderRadius: "4px" }}>
        <div style={{ fontWeight: "bold", marginBottom: "5px" }}>Handling Information:</div>
        <div style={{ fontSize: "11px" }}>
          {inputs.special_handling || "PERISHABLE - KEEP COOL"}
        </div>
      </div>

      {/* Insurance and Value */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
        <div>
          <div style={{ fontWeight: "bold", marginBottom: "5px" }}>Insurance</div>
          <div style={{ fontSize: "11px" }}>
            {inputs.insurance_required === 'Yes' ? 'INSURANCE COVERED' : 'NO INSURANCE COVERED'}
          </div>
        </div>
        <div>
          <div style={{ fontWeight: "bold", marginBottom: "5px" }}>Declared Value for Carriage</div>
         // Fixed version:
          <div style={{ fontSize: "11px" }}>
            {inputs.insured_value ? `${inputs.currency} ${parseFloat(inputs.insured_value).toFixed(2)}` : 'NVD'}
          </div>
        </div>
      </div>

      {/* Signature */}
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <div style={{ borderTop: `1px solid ${colors.border}`, width: "300px", margin: "0 auto", paddingTop: "5px" }}>
          <strong>Signature of Shipper or Agent</strong>
        </div>
        <div style={{ fontSize: "10px", marginTop: "5px" }}>
          {currentDate}
        </div>
      </div>
    </div>
  );
}

/* 11) Insurance Certificate */
export function InsuranceCertificate({ company = {}, inputs = {}, docIds = buildDocIds(), currentDate = new Date().toLocaleDateString('en-GB') }) {
  const products = parseProducts(inputs.products);

  const formatDate = (dateStr) => {
    if (!dateStr) return currentDate;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB');
  };

  // Calculate total insured value
  const totalInsuredValue = parseFloat(inputs.insured_value) || products.reduce((sum, product) => sum + (parseFloat(product.total_amount) || 0), 0);

  return (
    <div style={containerBase}>
      {/* Header Section */}
      <div style={{ ...headerStyle, borderBottom: `3px solid ${colors.accent}` }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "16px", fontWeight: "bold", color: colors.accent, marginBottom: "5px" }}>
            INSURANCE CERTIFICATE
          </div>
          <div style={{ fontSize: "11px" }}>
            Policy No: {inputs.insurance_policy || docIds.insuranceNumber}
          </div>
        </div>

        <div style={{ textAlign: "center", flex: 1 }}>
          <h1 style={{ ...docTitleStyle, color: colors.accent }}>INSURANCE CERTIFICATE</h1>
          <div style={{ fontSize: "11px", marginTop: "5px" }}>
            Date: {currentDate}
          </div>
        </div>

        <div style={{ flex: 1, textAlign: "right" }}>
          <div style={{ fontSize: "11px" }}>
            <strong>Certificate No:</strong><br />
            {docIds.insuranceNumber}
          </div>
        </div>
      </div>

      {/* Insured and Carrier Information */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
        <div style={infoBoxStyle}>
          <div style={{ fontWeight: "bold", marginBottom: "8px", fontSize: "12px" }}>INSURED</div>
          <div style={{ fontWeight: "bold" }}>{inputs.exporter_company_name || "EXPORTER COMPANY NAME"}</div>
          <div style={{ fontSize: "10px", whiteSpace: "pre-line" }}>{inputs.exporter_address || "Exporter Address"}</div>
        </div>

        <div style={infoBoxStyle}>
          <div style={{ fontWeight: "bold", marginBottom: "8px", fontSize: "12px" }}>INSURANCE COMPANY</div>
          <div style={{ fontWeight: "bold" }}>{inputs.insurance_company || "INSURANCE COMPANY"}</div>
          <div style={{ fontSize: "10px" }}>
            Policy No: {inputs.insurance_policy || "N/A"}<br />
            Coverage: {inputs.coverage_type || "All Risk"}
          </div>
        </div>
      </div>

      {/* Shipment Details */}
      <div style={{ ...infoBoxStyle, marginBottom: "20px", background: "#F0F8FF" }}>
        <div style={{ fontWeight: "bold", marginBottom: "8px", fontSize: "12px" }}>SHIPMENT DETAILS</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", fontSize: "11px" }}>
          <div>
            <strong>Vessel/Flight:</strong><br />
            {inputs.vessel_flight_details || "N/A"}
          </div>
          <div>
            <strong>Voyage No:</strong><br />
            {inputs.vessel_flight_details?.split('/')[1] || "N/A"}
          </div>
          <div>
            <strong>Port of Loading:</strong><br />
            {inputs.port_of_loading || "N/A"}
          </div>
          <div>
            <strong>Port of Discharge:</strong><br />
            {inputs.port_of_discharge || "N/A"}
          </div>
          <div>
            <strong>Departure Date:</strong><br />
            {formatDate(inputs.departure_date)}
          </div>
          <div>
            <strong>Final Destination:</strong><br />
            {inputs.final_destination_country || "N/A"}
          </div>
        </div>
      </div>

      {/* Insurance Details */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
        <div style={infoBoxStyle}>
          <div style={{ fontWeight: "bold", marginBottom: "8px", fontSize: "12px" }}>INSURANCE COVERAGE</div>
          <div style={{ fontSize: "11px" }}>
            <strong>Coverage Type:</strong> {inputs.coverage_type || "All Risk"}<br />
            <strong>Insured Value:</strong> {inputs.currency} {parseFloat(totalInsuredValue).toFixed(2)}<br />
            <strong>Premium Amount:</strong> {inputs.currency} {inputs.premium_amount || "0.00"}<br />
            <strong>Claims Payable At:</strong> {inputs.claims_payable_at || "Destination"}
          </div>
        </div>

        <div style={infoBoxStyle}>
          <div style={{ fontWeight: "bold", marginBottom: "8px", fontSize: "12px" }}>GOODS DESCRIPTION</div>
          <div style={{ fontSize: "11px" }}>
            {products.length > 0 ? (
              products.map(product => (
                <div key={product.sno} style={{ marginBottom: "5px" }}>
                  • {product.description} - {product.quantity} {product.unit}
                </div>
              ))
            ) : (
              "No goods specified"
            )}
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div style={{ margin: "20px 0", padding: "15px", border: `1px solid ${colors.border}`, borderRadius: "4px" }}>
        <div style={{ fontWeight: "bold", marginBottom: "10px" }}>INSURANCE TERMS AND CONDITIONS</div>
        <div style={{ fontSize: "10px", lineHeight: "1.6" }}>
          1. This insurance covers all risks of physical loss or damage from any external cause.<br />
          2. Claims payable irrespective of percentage.<br />
          3. Subject to Institute Cargo Clauses (A) unless otherwise specified.<br />
          4. This certificate is not valid unless countersigned by the insurance company.
        </div>
      </div>

      {/* Signature */}
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <div style={{ marginBottom: "40px" }}>
          <strong>For {inputs.insurance_company || "INSURANCE COMPANY"}</strong>
        </div>
        <div style={{ borderTop: `1px solid ${colors.border}`, width: "200px", margin: "0 auto", paddingTop: "5px" }}>
          Authorized Signature
        </div>
        <div style={{ fontSize: "10px", marginTop: "5px" }}>
          Authorized Representative
        </div>
      </div>
    </div>
  );
}

/* 12) Quotation */
export function Quotation({ company = {}, inputs = {}, docIds = buildDocIds(), currentDate = new Date().toLocaleDateString('en-GB') }) {
  const products = parseProducts(inputs.products);
  const totals = calculateTotals(products, inputs.currency);

  const formatDate = (dateStr) => {
    if (!dateStr) return currentDate;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB');
  };

  // Calculate validity date
  const validityDate = new Date();
  validityDate.setDate(validityDate.getDate() + (inputs.quotation_validity || 30));

  return (
    <div style={containerBase}>
      {/* Header Section */}
      <div style={headerStyle}>
        <div style={{ flex: 1 }}>
          {inputs.exporter_logo && (
            <img
              src={inputs.exporter_logo}
              alt="Company Logo"
              style={{ maxHeight: "60px", marginBottom: "10px" }}
            />
          )}
          <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "5px" }}>
            {inputs.exporter_company_name || "SUPPLIER"}
          </div>
          <div style={{ fontSize: "11px", color: colors.textSecondary, lineHeight: "1.3" }}>
            {inputs.exporter_address || "Supplier Address"}
          </div>
        </div>

        <div style={{ textAlign: "center", flex: 1 }}>
          <h1 style={docTitleStyle}>QUOTATION</h1>
          <div style={{ fontSize: "11px", marginTop: "5px" }}>
            Quotation No: {docIds.quotationNumber}
          </div>
          <div style={{ fontSize: "11px" }}>
            Date: {currentDate}
          </div>
        </div>

        <div style={{ flex: 1, textAlign: "right" }}>
          <div style={{ fontSize: "11px", marginBottom: "5px" }}>
            <strong>Valid Until</strong><br />
            {validityDate.toLocaleDateString('en-GB')}
          </div>
          <div style={{ fontSize: "11px" }}>
            <strong>Prepared For</strong><br />
            {inputs.buyer_company_name || "BUYER COMPANY NAME"}
          </div>
        </div>
      </div>

      {/* Buyer Information */}
      <div style={{ marginBottom: "20px" }}>
        <div style={infoBoxStyle}>
          <div style={{ fontWeight: "bold", marginBottom: "8px", fontSize: "12px" }}>QUOTATION FOR</div>
          <div style={{ fontWeight: "bold" }}>{inputs.buyer_company_name || "BUYER COMPANY NAME"}</div>
          <div style={{ fontSize: "10px", whiteSpace: "pre-line" }}>{inputs.buyer_address || "Buyer Address"}</div>
        </div>
      </div>

      {/* Quotation Details */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px", fontSize: "11px" }}>
        <div>
          <strong>Payment Terms</strong><br />
          {inputs.payment_terms_detailed || inputs.payment_method || "N/A"}
        </div>
        <div>
          <strong>Delivery Terms</strong><br />
          {inputs.delivery_terms || inputs.incoterms || "N/A"}
        </div>
        <div>
          <strong>Delivery Timeline</strong><br />
          {formatDate(inputs.delivery_date)}
        </div>
        <div>
          <strong>Validity</strong><br />
          {inputs.quotation_validity || "30"} days
        </div>
      </div>

      {/* Products Table */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...tableHeaderStyle, width: "8%" }}>S.No</th>
            <th style={{ ...tableHeaderStyle, width: "25%" }}>Product Code</th>
            <th style={{ ...tableHeaderStyle, width: "32%" }}>Description</th>
            <th style={{ ...tableHeaderStyle, width: "10%" }}>Quantity</th>
            <th style={{ ...tableHeaderStyle, width: "10%" }}>Unit Price ({inputs.currency})</th>
            <th style={{ ...tableHeaderStyle, width: "15%" }}>Amount ({inputs.currency})</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ ...tableCellStyle, textAlign: "center", padding: "20px" }}>
                No items specified
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.sno}>
                <td style={tableCellStyle}>{product.sno}</td>
                <td style={tableCellStyle}>{product.product_code}</td>
                <td style={tableCellStyle}>
                  <div style={{ fontWeight: "bold" }}>{product.description}</div>
                </td>
                <td style={tableCellStyle}>{product.quantity} {product.unit}</td>
                <td style={{ ...tableCellStyle, textAlign: "right" }}>
                  {parseFloat(product.unit_price).toFixed(2)}
                </td>
                <td style={{ ...tableCellStyle, textAlign: "right" }}>
                  {parseFloat(product.total_amount).toFixed(2)}
                </td>
              </tr>
            ))
          )}
        </tbody>
        <tfoot>
          <tr style={{ fontWeight: "bold" }}>
            <td colSpan="5" style={{ ...tableCellStyle, textAlign: "right" }}>
              Total Amount:
            </td>
            <td style={{ ...tableCellStyle, textAlign: "right" }}>
              {inputs.currency} {totals.total}
            </td>
          </tr>
        </tfoot>
      </table>

      {/* Inclusions/Exclusions */}
      {inputs.inclusions_exclusions && (
        <div style={{ margin: "15px 0", padding: "10px", border: `1px solid ${colors.border}`, borderRadius: "4px" }}>
          <div style={{ fontWeight: "bold", marginBottom: "5px" }}>Inclusions/Exclusions:</div>
          <div style={{ fontSize: "10px" }}>{inputs.inclusions_exclusions}</div>
        </div>
      )}

      {/* Terms and Conditions */}
      <div style={{ margin: "20px 0", padding: "15px", border: `1px solid ${colors.border}`, borderRadius: "4px" }}>
        <div style={{ fontWeight: "bold", marginBottom: "10px" }}>TERMS AND CONDITIONS</div>
        <div style={{ fontSize: "10px", lineHeight: "1.6" }}>
          1. Prices are valid for {inputs.quotation_validity || "30"} days from the date of this quotation.<br />
          2. Payment terms: {inputs.payment_terms_detailed || inputs.payment_method || "To be discussed"}.<br />
          3. Delivery: {inputs.delivery_terms || inputs.incoterms || "To be confirmed"}.<br />
          4. This quotation is subject to our final confirmation.<br />
          5. Prices are exclusive of any applicable taxes and duties.
        </div>
      </div>

      {/* Contact and Signature */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "30px" }}>
        <div>
          <div style={{ fontWeight: "bold", marginBottom: "5px" }}>Contact Information</div>
          <div style={{ fontSize: "10px" }}>
            {inputs.exporter_contact_person || "Contact Person"}<br />
            {inputs.exporter_contact_info || "Contact Details"}<br />
            {inputs.exporter_company_name || "Company Name"}
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ marginBottom: "40px" }}>
            <strong>Authorized Signatory</strong><br />
            {inputs.exporter_company_name || "SUPPLIER COMPANY NAME"}
          </div>
          <div style={{ borderTop: `1px solid ${colors.border}`, width: "200px", margin: "0 auto", paddingTop: "5px" }}>
            {inputs.authorized_signature ? (
              <img
                src={inputs.authorized_signature}
                alt="Signature"
                style={{ maxHeight: "40px" }}
              />
            ) : (
              "Signature"
            )}
          </div>
          <div style={{ fontSize: "10px", marginTop: "5px" }}>
            {inputs.authorized_signatory_name || "Authorized Signatory"}<br />
            {inputs.authorized_signatory_designation || "Designation"}
          </div>
        </div>
      </div>
    </div>
  );
}

// Add this function to your TemplateEngine.jsx after the component definitions
export const renderTemplateComponent = (templateType, props) => {
  const components = {
    commercial_invoice: CommercialInvoice,
    proforma_invoice: ProformaInvoice,
    packing_list: PackingList,
    delivery_challan: DeliveryChallan,
    credit_note: CreditDebitNote,
    debit_note: CreditDebitNote,
    certificate_of_origin: CertificateOfOrigin,
    bill_of_lading: BillOfLading,
    shipping_instructions: ShippingInstructions,
    export_declaration: ExportDeclaration,
    air_waybill: AirWaybill,
    insurance_certificate: InsuranceCertificate,
    quotation: Quotation,
  };

  const Component = components[templateType];

  if (!Component) {
    return <div>Template component not found: {templateType}</div>;
  }

  return React.createElement(Component, props);
};

/* ---------------- Document Generation Function ---------------- */

export const generateDocuments = (selectedTemplates = [], companyData = {}, userInputs = {}) => {
  const docIds = buildDocIds();
  const currentDate = new Date().toLocaleDateString('en-GB');

  const templateComponents = {
    commercial_invoice: CommercialInvoice,
    proforma_invoice: ProformaInvoice,
    packing_list: PackingList,
    delivery_challan: DeliveryChallan,
    credit_note: CreditDebitNote,
    debit_note: CreditDebitNote,
    certificate_of_origin: CertificateOfOrigin,
    bill_of_lading: BillOfLading,
    shipping_instructions: ShippingInstructions,
    export_declaration: ExportDeclaration,
    air_waybill: AirWaybill,
    insurance_certificate: InsuranceCertificate,
    quotation: Quotation,
  };

  return selectedTemplates.map((template) => {
    const TemplateComponent = templateComponents[template.id];

    // Combine company data and user inputs
    const combinedInputs = {
      ...userInputs,
      exporter_company_name: userInputs.exporter_company_name || companyData.company_name,
      exporter_address: userInputs.exporter_address || companyData.comp_reg_address,
      exporter_gstin: userInputs.exporter_gstin || companyData.gstin,
      exporter_logo: userInputs.exporter_logo,
      authorized_signature: userInputs.authorized_signature,
    };

    const props = {
      company: companyData,
      inputs: combinedInputs,
      docIds: docIds,
      currentDate: currentDate
    };

    let html = "";
    if (TemplateComponent) {
      html = `<div data-template-id="${template.id}" data-render="true"></div>`;
    } else {
      html = `<div style="padding:20px;font-family:Arial;color:${colors.textPrimary}">Template ${esc(template.id)} not found</div>`;
    }

    return {
      id: template.id,
      name: template.name || template.id.replace(/_/g, ' ').toUpperCase(),
      html,
      component: TemplateComponent,
      props: props
    };
  });
};

export default {
  buildDocIds,
  parseProducts,
  parsePackingInfo,
  calculateTotals,
  CommercialInvoice,
  ProformaInvoice,
  PackingList,
  DeliveryChallan,
  CreditDebitNote,
  CertificateOfOrigin,
  BillOfLading,
  ShippingInstructions,
  ExportDeclaration,
  AirWaybill,
  InsuranceCertificate,
  Quotation,
  generateDocuments,
};