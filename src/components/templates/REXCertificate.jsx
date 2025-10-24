import React from 'react';

const REXCertificate = React.forwardRef(({ data }, ref) => {
    const {
        rex_number,
        exporter_company_name,
        exporter_address,
        exporter_gstin,
        buyer_company_name,
        buyer_address,
        invoice_number,
        invoice_date,
        dispatch_method,
        vessel_flight_details,
        port_of_loading,
        port_of_discharge,
        final_destination,
        departure_date,
        exporter_status,
        products = [],
        authorized_signatory_name,
        authorized_signatory_designation
    } = data;

    return (
        <div ref={ref} style={styles.page}>
            {/* Header */}
            <div style={styles.header}>
                <div style={styles.euHeader}>
                    <div style={styles.euFlag}>🇪🇺</div>
                    <div style={styles.rexText}>
                        <div style={styles.systemTitle}>REGISTERED EXPORTER SYSTEM</div>
                        <div style={styles.certificateTitle}>STATEMENT ON ORIGIN</div>
                        <div style={styles.systemSubtitle}>Self-Certification under REX System</div>
                    </div>
                </div>
                <div style={styles.rexNumber}>
                    REX No: {rex_number || 'IN' + Date.now().toString().slice(-10)}
                </div>
            </div>

            {/* Exporter Information */}
            <div style={styles.section}>
                <div style={styles.sectionHeader}>EXPORTER INFORMATION</div>
                <div style={styles.exporterInfo}>
                    <div><strong>Registered Exporter Number:</strong> {rex_number || 'Pending Registration'}</div>
                    <div><strong>Company Name:</strong> {exporter_company_name}</div>
                    <div><strong>Registered Address:</strong> {exporter_address}</div>
                    <div><strong>Tax Identification:</strong> {exporter_gstin}</div>
                    <div><strong>REX Status:</strong> <span style={styles.statusVerified}>{exporter_status || 'Registered'}</span></div>
                </div>
            </div>

            {/* Consignee Information */}
            <div style={styles.section}>
                <div style={styles.sectionHeader}>CONSIGNEE INFORMATION</div>
                <div style={styles.consigneeInfo}>
                    <div><strong>Consignee Name:</strong> {buyer_company_name}</div>
                    <div><strong>Delivery Address:</strong> {buyer_address}</div>
                    <div><strong>Country of Destination:</strong> {final_destination}</div>
                </div>
            </div>

            {/* Shipment Details */}
            <div style={styles.section}>
                <div style={styles.sectionHeader}>SHIPMENT DETAILS</div>
                <table style={styles.shipmentTable}>
                    <tbody>
                        <tr>
                            <td style={styles.shipmentLabel}>Commercial Invoice No</td>
                            <td style={styles.shipmentValue}>{invoice_number}</td>
                            <td style={styles.shipmentLabel}>Invoice Date</td>
                            <td style={styles.shipmentValue}>{new Date(invoice_date).toLocaleDateString()}</td>
                        </tr>
                        <tr>
                            <td style={styles.shipmentLabel}>Means of Transport</td>
                            <td style={styles.shipmentValue}>{dispatch_method}</td>
                            <td style={styles.shipmentLabel}>Vessel/Flight</td>
                            <td style={styles.shipmentValue}>{vessel_flight_details}</td>
                        </tr>
                        <tr>
                            <td style={styles.shipmentLabel}>Port of Loading</td>
                            <td style={styles.shipmentValue}>{port_of_loading}</td>
                            <td style={styles.shipmentLabel}>Port of Discharge</td>
                            <td style={styles.shipmentValue}>{port_of_discharge}</td>
                        </tr>
                        <tr>
                            <td style={styles.shipmentLabel}>Departure Date</td>
                            <td style={styles.shipmentValue}>{new Date(departure_date).toLocaleDateString()}</td>
                            <td style={styles.shipmentLabel}>Final Destination</td>
                            <td style={styles.shipmentValue}>{final_destination}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Origin Declaration */}
            <div style={styles.section}>
                <div style={styles.sectionHeader}>ORIGIN DECLARATION</div>
                <div style={styles.originDeclaration}>
                    <div style={styles.declarationBox}>
                        <strong>STATEMENT ON ORIGIN</strong>
                        <div style={styles.declarationText}>
                            The exporter of the products covered by this document declares that,
                            except where otherwise clearly indicated, these products are of
                            <strong> Indian origin </strong>
                            according to the rules of origin of the European Union's Generalized Scheme of Preferences.
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Information */}
            <div style={styles.section}>
                <div style={styles.sectionHeader}>PRODUCTS COVERED BY THIS STATEMENT</div>
                <table style={styles.productsTable}>
                    <thead>
                        <tr>
                            <th style={styles.tableHeader}>Item No</th>
                            <th style={styles.tableHeader}>Description of Goods</th>
                            <th style={styles.tableHeader}>HS Heading</th>
                            <th style={styles.tableHeader}>Quantity</th>
                            <th style={styles.tableHeader}>Origin Criterion</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <tr key={index}>
                                <td style={styles.tableCell}>{index + 1}</td>
                                <td style={styles.tableCell}>{product.description}</td>
                                <td style={styles.tableCell}>{product.hs_code}</td>
                                <td style={styles.tableCell}>{product.quantity} {product.unit}</td>
                                <td style={styles.tableCell}>Wholly obtained</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Legal Provisions */}
            <div style={styles.section}>
                <div style={styles.sectionHeader}>LEGAL PROVISIONS</div>
                <div style={styles.legalText}>
                    This statement on origin is made out in accordance with Article 68 of Regulation (EU) No 952/2013
                    and Article 66 of Delegated Regulation (EU) 2015/2446. The exporter is registered in the REX system
                    for the purpose of making out statements on origin.
                </div>
            </div>

            {/* Exporter Certification */}
            <div style={styles.certification}>
                <div style={styles.certificationHeader}>EXPORTER'S CERTIFICATION</div>
                <div style={styles.certificationBody}>
                    <div style={styles.certificationText}>
                        I, the undersigned, certify that the information provided in this statement is accurate
                        and that the products specified qualify as originating goods for which preferential treatment may be claimed.
                    </div>
                    <div style={styles.signatureSection}>
                        <div style={styles.signatureBox}>
                            <div style={styles.signatureLine}>_________________________</div>
                            <div><strong>{authorized_signatory_name}</strong></div>
                            <div>{authorized_signatory_designation}</div>
                            <div>{exporter_company_name}</div>
                            <div>REX Number: {rex_number || 'Pending'}</div>
                            <div>Place and date: {exporter_address.split(',')[0]}, {new Date().toLocaleDateString()}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Information */}
            <div style={styles.footer}>
                <div style={styles.footerSection}>
                    <strong>REX SYSTEM INFORMATION</strong>
                    <div style={styles.footerText}>
                        • This statement replaces the traditional certificate of origin Form A<br />
                        • Valid for multiple shipments of identical goods within 12 months<br />
                        • Customs authorities may request supporting documentation<br />
                        • The exporter must maintain records for at least 3 years
                    </div>
                </div>
                <div style={styles.verification}>
                    <div style={styles.qrPlaceholder}>
                        [QR Code for Verification]
                    </div>
                    <div style={styles.verificationText}>
                        Verify this REX statement at:<br />
                        ec.europa.eu/taxation_customs/rex
                    </div>
                </div>
            </div>
        </div>
    );
});

const styles = {
    page: {
        width: '794px',
        minHeight: '1123px',
        padding: '40px',
        backgroundColor: 'white',
        fontFamily: 'Arial, sans-serif',
        fontSize: '12px',
        lineHeight: '1.4',
        border: '1px solid #ccc',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)'
    },
    header: {
        textAlign: 'center',
        marginBottom: '25px',
        borderBottom: '3px solid #003399',
        paddingBottom: '20px'
    },
    euHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        marginBottom: '15px'
    },
    euFlag: {
        fontSize: '50px'
    },
    rexText: {
        textAlign: 'center'
    },
    systemTitle: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#003399'
    },
    certificateTitle: {
        fontSize: '22px',
        fontWeight: 'bold',
        color: '#003399',
        margin: '5px 0'
    },
    systemSubtitle: {
        fontSize: '12px',
        color: '#666',
        fontStyle: 'italic'
    },
    rexNumber: {
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#d4af37',
        backgroundColor: '#f8f9fa',
        padding: '8px 15px',
        borderRadius: '20px',
        display: 'inline-block',
        border: '2px solid #d4af37'
    },
    section: {
        marginBottom: '20px',
        padding: '15px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        backgroundColor: 'white'
    },
    sectionHeader: {
        backgroundColor: '#003399',
        color: 'white',
        padding: '8px 12px',
        margin: '-15px -15px 15px -15px',
        borderRadius: '3px 3px 0 0',
        fontWeight: 'bold',
        fontSize: '13px'
    },
    exporterInfo: {
        lineHeight: '1.8'
    },
    statusVerified: {
        color: '#2e8b57',
        fontWeight: 'bold'
    },
    consigneeInfo: {
        lineHeight: '1.8'
    },
    shipmentTable: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '11px'
    },
    shipmentLabel: {
        fontWeight: 'bold',
        padding: '6px',
        border: '1px solid #ccc',
        backgroundColor: '#f0f8ff',
        width: '25%'
    },
    shipmentValue: {
        padding: '6px',
        border: '1px solid #ccc'
    },
    originDeclaration: {
        textAlign: 'center'
    },
    declarationBox: {
        display: 'inline-block',
        padding: '20px',
        border: '2px solid #003399',
        borderRadius: '8px',
        backgroundColor: '#f0f8ff',
        maxWidth: '80%'
    },
    declarationText: {
        marginTop: '10px',
        fontSize: '12px',
        lineHeight: '1.5'
    },
    productsTable: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '10px'
    },
    tableHeader: {
        backgroundColor: '#003399',
        color: 'white',
        border: '1px solid #002266',
        padding: '8px',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    tableCell: {
        border: '1px solid #ccc',
        padding: '8px',
        textAlign: 'center'
    },
    legalText: {
        fontSize: '11px',
        lineHeight: '1.4',
        textAlign: 'justify'
    },
    certification: {
        marginBottom: '25px',
        padding: '20px',
        border: '2px solid #003399',
        borderRadius: '8px',
        backgroundColor: '#f8f9fa'
    },
    certificationHeader: {
        backgroundColor: '#003399',
        color: 'white',
        padding: '10px',
        margin: '-20px -20px 20px -20px',
        borderRadius: '5px 5px 0 0',
        fontWeight: 'bold',
        fontSize: '14px',
        textAlign: 'center'
    },
    certificationBody: {
        textAlign: 'center'
    },
    certificationText: {
        marginBottom: '20px',
        fontSize: '12px',
        lineHeight: '1.4'
    },
    signatureSection: {
        marginTop: '20px'
    },
    signatureBox: {
        display: 'inline-block',
        textAlign: 'center'
    },
    signatureLine: {
        marginBottom: '5px'
    },
    footer: {
        display: 'flex',
        gap: '20px',
        marginTop: '25px',
        padding: '15px',
        backgroundColor: '#f0f8ff',
        borderRadius: '5px'
    },
    footerSection: {
        flex: 2
    },
    footerText: {
        fontSize: '10px',
        lineHeight: '1.5',
        marginTop: '8px'
    },
    verification: {
        flex: 1,
        textAlign: 'center'
    },
    qrPlaceholder: {
        width: '100px',
        height: '100px',
        border: '2px dashed #003399',
        borderRadius: '5px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '9px',
        color: '#666',
        backgroundColor: 'white',
        margin: '0 auto 10px auto'
    },
    verificationText: {
        fontSize: '9px',
        color: '#666'
    }
};

export default REXCertificate;