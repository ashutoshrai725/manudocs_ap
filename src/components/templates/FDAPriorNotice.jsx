import React from 'react';

const FDAPriorNotice = React.forwardRef(({ data }, ref) => {
    const {
        exporter_company_name,
        exporter_address,
        buyer_company_name,
        buyer_address,
        invoice_number,
        invoice_date,
        products = [],
        fda_facility_registration,
        bill_of_lading_number,
        dispatch_method,
        vessel_flight_details,
        port_of_loading,
        port_of_discharge,
        departure_date,
        arrival_date_estimated
    } = data;

    const product = products[0] || {};

    return (
        <div ref={ref} style={styles.page}>
            {/* Header */}
            <div style={styles.header}>
                <div style={styles.fdaLogo}>
                    <div style={styles.logo}>🇺🇸</div>
                    <div style={styles.fdaText}>
                        <div style={styles.agency}>U.S. FOOD AND DRUG ADMINISTRATION</div>
                        <div style={styles.department}>Department of Health and Human Services</div>
                    </div>
                </div>
                <h1 style={styles.title}>PRIOR NOTICE OF IMPORTED FOOD</h1>
                <div style={styles.subtitle}>Food and Drug Administration Safety and Innovation Act (FDASIA)</div>
            </div>

            {/* Filing Information */}
            <div style={styles.section}>
                <div style={styles.sectionHeader}>FILING INFORMATION</div>
                <table style={styles.infoTable}>
                    <tbody>
                        <tr>
                            <td style={styles.infoLabel}>Prior Notice Confirmation Number</td>
                            <td style={styles.infoValue}>PN{Date.now().toString().slice(-8)}</td>
                            <td style={styles.infoLabel}>Submission Date/Time</td>
                            <td style={styles.infoValue}>{new Date().toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td style={styles.infoLabel}>FDA Facility Registration</td>
                            <td style={styles.infoValue}>{fda_facility_registration || 'Pending'}</td>
                            <td style={styles.infoLabel}>Filing Status</td>
                            <td style={styles.infoValue}><span style={styles.statusApproved}>APPROVED</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Shipper Information */}
            <div style={styles.section}>
                <div style={styles.sectionHeader}>SHIPPER INFORMATION</div>
                <div style={styles.twoColumn}>
                    <div style={styles.column}>
                        <strong>Foreign Shipper/Exporter</strong>
                        <div>{exporter_company_name}</div>
                        <div>{exporter_address}</div>
                        <div style={styles.contactInfo}>
                            <strong>Contact:</strong> {data.exporter_contact_person} - {data.exporter_contact_info}
                        </div>
                    </div>
                    <div style={styles.column}>
                        <strong>US Importer/Consignee</strong>
                        <div>{buyer_company_name}</div>
                        <div>{buyer_address}</div>
                        <div style={styles.contactInfo}>
                            <strong>FDA Registration:</strong> {fda_facility_registration || 'Required'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Shipment Details */}
            <div style={styles.section}>
                <div style={styles.sectionHeader}>SHIPMENT DETAILS</div>
                <table style={styles.detailsTable}>
                    <tbody>
                        <tr>
                            <td style={styles.detailLabel}>Invoice Number</td>
                            <td style={styles.detailValue}>{invoice_number}</td>
                            <td style={styles.detailLabel}>Invoice Date</td>
                            <td style={styles.detailValue}>{new Date(invoice_date).toLocaleDateString()}</td>
                            <td style={styles.detailLabel}>Bill of Lading</td>
                            <td style={styles.detailValue}>{bill_of_lading_number}</td>
                        </tr>
                        <tr>
                            <td style={styles.detailLabel}>Mode of Transport</td>
                            <td style={styles.detailValue}>{dispatch_method}</td>
                            <td style={styles.detailLabel}>Vessel/Flight</td>
                            <td style={styles.detailValue}>{vessel_flight_details}</td>
                            <td style={styles.detailLabel}>Voyage No</td>
                            <td style={styles.detailValue}>{vessel_flight_details.split('/').pop() || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td style={styles.detailLabel}>Port of Loading</td>
                            <td style={styles.detailValue}>{port_of_loading}</td>
                            <td style={styles.detailLabel}>Port of Discharge</td>
                            <td style={styles.detailValue}>{port_of_discharge}</td>
                            <td style={styles.detailLabel}>Estimated Arrival</td>
                            <td style={styles.detailValue}>
                                {arrival_date_estimated || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                            </td>
                        </tr>
                        <tr>
                            <td style={styles.detailLabel}>Departure Date</td>
                            <td style={styles.detailValue}>{new Date(departure_date).toLocaleDateString()}</td>
                            <td style={styles.detailLabel}>Entry Port (US)</td>
                            <td style={styles.detailValue}>{port_of_discharge}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Product Information */}
            <div style={styles.section}>
                <div style={styles.sectionHeader}>PRODUCT INFORMATION</div>
                <table style={styles.productsTable}>
                    <thead>
                        <tr>
                            <th style={styles.tableHeader}>Product Description</th>
                            <th style={styles.tableHeader}>FDA Product Code</th>
                            <th style={styles.tableHeader}>Quantity</th>
                            <th style={styles.tableHeader}>Lot/Batch Code</th>
                            <th style={styles.tableHeader}>Manufacturing Date</th>
                            <th style={styles.tableHeader}>Expiry Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <tr key={index}>
                                <td style={styles.tableCell}>{product.description}</td>
                                <td style={styles.tableCell}>{product.hs_code || 'FDA-' + product.product_code}</td>
                                <td style={styles.tableCell}>{product.quantity} {product.unit}</td>
                                <td style={styles.tableCell}>{data.product_batch_number || 'BATCH-' + Date.now().toString().slice(-6)}</td>
                                <td style={styles.tableCell}>
                                    {data.manufacturing_date ? new Date(data.manufacturing_date).toLocaleDateString() : 'N/A'}
                                </td>
                                <td style={styles.tableCell}>
                                    {data.expiry_date ? new Date(data.expiry_date).toLocaleDateString() : 'N/A'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Food Safety Information */}
            <div style={styles.section}>
                <div style={styles.sectionHeader}>FOOD SAFETY INFORMATION</div>
                <div style={styles.safetyInfo}>
                    <div style={styles.twoColumn}>
                        <div style={styles.column}>
                            <strong>HACCP Plan:</strong> Yes<br />
                            <strong>GMP Compliance:</strong> Yes<br />
                            <strong>Allergen Information:</strong> None Declared<br />
                            <strong>Storage Conditions:</strong> Ambient Temperature
                        </div>
                        <div style={styles.column}>
                            <strong>Country of Origin:</strong> India<br />
                            <strong>Manufacturer:</strong> {exporter_company_name}<br />
                            <strong>Facility Type:</strong> Food Processing<br />
                            <strong>Inspection Status:</strong> Compliant
                        </div>
                    </div>
                </div>
            </div>

            {/* Declaration */}
            <div style={styles.section}>
                <div style={styles.declaration}>
                    <strong>DECLARATION:</strong> I certify that the information submitted in this prior notice is
                    complete and accurate to the best of my knowledge. I understand that providing false or
                    misleading information may result in criminal prosecution.
                </div>
                <div style={styles.signatureSection}>
                    <div style={styles.signature}>
                        <div style={styles.signatureLine}>_________________________</div>
                        <div><strong>{data.authorized_signatory_name || 'Authorized Representative'}</strong></div>
                        <div>Designation: {data.authorized_signatory_designation || 'Export Manager'}</div>
                        <div>Company: {exporter_company_name}</div>
                        <div>Date: {new Date().toLocaleDateString()}</div>
                    </div>
                </div>
            </div>

            {/* Footer Notes */}
            <div style={styles.footerNotes}>
                <strong>Important FDA Requirements:</strong><br />
                • Prior Notice must be submitted no more than 15 days and no less than 8 hours before arrival<br />
                • Food articles must comply with FDA regulations under FD&C Act<br />
                • Failure to submit may result in refusal of admission<br />
                • All food facilities must be registered with FDA
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
        border: '1px solid #ccc'
    },
    header: {
        textAlign: 'center',
        marginBottom: '25px',
        borderBottom: '3px solid #0047ab',
        paddingBottom: '20px'
    },
    fdaLogo: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '15px',
        marginBottom: '15px'
    },
    logo: {
        fontSize: '40px'
    },
    fdaText: {
        textAlign: 'left'
    },
    agency: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#0047ab'
    },
    department: {
        fontSize: '12px',
        color: '#666'
    },
    title: {
        fontSize: '22px',
        fontWeight: 'bold',
        color: '#0047ab',
        margin: '10px 0'
    },
    subtitle: {
        fontSize: '12px',
        color: '#666',
        fontStyle: 'italic'
    },
    section: {
        marginBottom: '20px',
        padding: '15px',
        border: '1px solid #ddd',
        borderRadius: '5px'
    },
    sectionHeader: {
        backgroundColor: '#0047ab',
        color: 'white',
        padding: '8px 12px',
        margin: '-15px -15px 15px -15px',
        borderRadius: '3px 3px 0 0',
        fontWeight: 'bold',
        fontSize: '13px'
    },
    twoColumn: {
        display: 'flex',
        gap: '20px'
    },
    column: {
        flex: 1
    },
    infoTable: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '11px'
    },
    infoLabel: {
        fontWeight: 'bold',
        padding: '6px',
        border: '1px solid #ccc',
        backgroundColor: '#f0f8ff',
        width: '25%'
    },
    infoValue: {
        padding: '6px',
        border: '1px solid #ccc'
    },
    statusApproved: {
        color: '#2e8b57',
        fontWeight: 'bold'
    },
    contactInfo: {
        marginTop: '8px',
        fontSize: '11px',
        color: '#666'
    },
    detailsTable: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '10px'
    },
    detailLabel: {
        fontWeight: 'bold',
        padding: '5px',
        border: '1px solid #ccc',
        backgroundColor: '#f0f8ff',
        whiteSpace: 'nowrap',
        width: '18%'
    },
    detailValue: {
        padding: '5px',
        border: '1px solid #ccc'
    },
    productsTable: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '10px'
    },
    tableHeader: {
        backgroundColor: '#0047ab',
        color: 'white',
        border: '1px solid #003380',
        padding: '8px',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    tableCell: {
        border: '1px solid #ccc',
        padding: '8px',
        textAlign: 'center',
        backgroundColor: 'white'
    },
    safetyInfo: {
        fontSize: '11px'
    },
    declaration: {
        fontSize: '11px',
        marginBottom: '20px',
        padding: '12px',
        backgroundColor: '#f0f8ff',
        borderRadius: '5px',
        borderLeft: '4px solid #0047ab'
    },
    signatureSection: {
        textAlign: 'center',
        marginTop: '20px'
    },
    signature: {
        display: 'inline-block',
        textAlign: 'center'
    },
    signatureLine: {
        marginBottom: '5px'
    },
    footerNotes: {
        marginTop: '25px',
        padding: '15px',
        backgroundColor: '#fffacd',
        border: '1px solid #ffd700',
        borderRadius: '5px',
        fontSize: '11px'
    }
};

export default FDAPriorNotice;