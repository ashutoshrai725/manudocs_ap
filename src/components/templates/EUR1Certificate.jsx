import React from 'react';

const EUR1Certificate = React.forwardRef(({ data }, ref) => {
    const {
        eur1_number,
        exporter_company_name,
        exporter_address,
        exporter_gstin,
        buyer_company_name,
        buyer_address,
        invoice_number,
        invoice_date,
        lc_number,
        dispatch_method,
        vessel_flight_details,
        port_of_loading,
        port_of_discharge,
        final_destination,
        departure_date,
        origin_criteria,
        tariff_code,
        marks_numbers,
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
                    <div style={styles.euText}>
                        <div style={styles.euTitle}>EUROPEAN UNION</div>
                        <div style={styles.certificateTitle}>MOVEMENT CERTIFICATE EUR.1</div>
                    </div>
                </div>
                <div style={styles.certificateNumber}>
                    No. {eur1_number || 'EUR1' + Date.now().toString().slice(-8)}
                </div>
            </div>

            {/* Exporter and Consignee */}
            <div style={styles.section}>
                <div style={styles.twoColumn}>
                    <div style={styles.column}>
                        <strong>1. Exporter</strong>
                        <div>{exporter_company_name}</div>
                        <div>{exporter_address}</div>
                        <div>Tax ID: {exporter_gstin}</div>
                    </div>
                    <div style={styles.column}>
                        <strong>2. Consignee</strong>
                        <div>{buyer_company_name}</div>
                        <div>{buyer_address}</div>
                    </div>
                </div>
            </div>

            {/* Transport Details */}
            <div style={styles.section}>
                <strong>3. Transport details (Optional)</strong>
                <table style={styles.transportTable}>
                    <tbody>
                        <tr>
                            <td style={styles.transportLabel}>Departure Date</td>
                            <td style={styles.transportValue}>{new Date(departure_date).toLocaleDateString()}</td>
                            <td style={styles.transportLabel}>Vessel/Flight</td>
                            <td style={styles.transportValue}>{vessel_flight_details}</td>
                        </tr>
                        <tr>
                            <td style={styles.transportLabel}>Port of loading</td>
                            <td style={styles.transportValue}>{port_of_loading}</td>
                            <td style={styles.transportLabel}>Port of discharge</td>
                            <td style={styles.transportValue}>{port_of_discharge}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Remarks */}
            <div style={styles.section}>
                <strong>4. Remarks</strong>
                <div style={styles.remarks}>
                    Preferential tariff treatment under EU-India Free Trade Agreement<br />
                    Invoice No: {invoice_number} dated {new Date(invoice_date).toLocaleDateString()}
                </div>
            </div>

            {/* Items Table */}
            <div style={styles.section}>
                <strong>5. Items</strong>
                <table style={styles.itemsTable}>
                    <thead>
                        <tr>
                            <th style={styles.tableHeader}>Marks & Numbers</th>
                            <th style={styles.tableHeader}>Number & kind of packages</th>
                            <th style={styles.tableHeader}>Description of goods</th>
                            <th style={styles.tableHeader}>Gross weight (kg)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <tr key={index}>
                                <td style={styles.tableCell}>{marks_numbers || `MK${index + 1}`}</td>
                                <td style={styles.tableCell}>Cartons - {product.quantity} packages</td>
                                <td style={styles.tableCell}>{product.description}</td>
                                <td style={styles.tableCell}>{product.gross_weight || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Origin Criteria */}
            <div style={styles.section}>
                <strong>6. Origin criterion</strong>
                <div style={styles.originCriteria}>
                    "{origin_criteria || 'Wholly obtained'}" - Products wholly obtained in India
                </div>
            </div>

            {/* Customs Official Use */}
            <div style={styles.section}>
                <strong>7. For official use (Customs)</strong>
                <div style={styles.customsSection}>
                    <table style={styles.customsTable}>
                        <tbody>
                            <tr>
                                <td style={styles.customsLabel}>Documentary evidence</td>
                                <td style={styles.customsValue}>Verified</td>
                                <td style={styles.customsLabel}>Origin verified</td>
                                <td style={styles.customsValue}>Yes</td>
                            </tr>
                            <tr>
                                <td style={styles.customsLabel}>Preferential treatment</td>
                                <td style={styles.customsValue}>Granted</td>
                                <td style={styles.customsLabel}>Tariff heading</td>
                                <td style={styles.customsValue}>{tariff_code || products[0]?.hs_code}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Certification */}
            <div style={styles.certification}>
                <div style={styles.certificationText}>
                    <strong>8. CERTIFICATION</strong><br />
                    It is hereby certified, on the basis of control carried out, that the declaration by the exporter is correct.
                </div>
                <div style={styles.certificationDetails}>
                    <div style={styles.placeDate}>
                        <div>Place: {exporter_address.split(',')[0]}</div>
                        <div>Date: {new Date().toLocaleDateString()}</div>
                    </div>
                    <div style={styles.customsStamp}>
                        <div style={styles.stampBox}>
                            <div>CUSTOMS</div>
                            <div>OFFICE</div>
                            <div>STAMP</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Declaration by Exporter */}
            <div style={styles.declaration}>
                <strong>DECLARATION BY THE EXPORTER</strong>
                <div style={styles.declarationText}>
                    I, the undersigned, declare that the goods described above meet the conditions required for the issue of this document.
                </div>
                <div style={styles.exporterSignature}>
                    <div style={styles.signatureBox}>
                        <div style={styles.signatureLine}>_________________________</div>
                        <div><strong>{authorized_signatory_name}</strong></div>
                        <div>{authorized_signatory_designation}</div>
                        <div>{exporter_company_name}</div>
                        <div>Place and date: {exporter_address.split(',')[0]}, {new Date().toLocaleDateString()}</div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div style={styles.footer}>
                <div style={styles.footerText}>
                    <strong>EUR.1 Movement Certificate</strong> - This certificate enables products to benefit from preferential treatment under the EU-India Free Trade Agreement.
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
        gap: '15px',
        marginBottom: '15px'
    },
    euFlag: {
        fontSize: '40px'
    },
    euText: {
        textAlign: 'center'
    },
    euTitle: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#003399'
    },
    certificateTitle: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#003399',
        marginTop: '5px'
    },
    certificateNumber: {
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
    twoColumn: {
        display: 'flex',
        gap: '20px'
    },
    column: {
        flex: 1
    },
    transportTable: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '10px',
        fontSize: '11px'
    },
    transportLabel: {
        fontWeight: 'bold',
        padding: '5px',
        border: '1px solid #ccc',
        backgroundColor: '#f0f8ff',
        width: '25%'
    },
    transportValue: {
        padding: '5px',
        border: '1px solid #ccc'
    },
    remarks: {
        marginTop: '8px',
        padding: '10px',
        backgroundColor: '#f0f8ff',
        borderRadius: '3px',
        fontSize: '11px'
    },
    itemsTable: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '10px',
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
    originCriteria: {
        marginTop: '8px',
        padding: '10px',
        backgroundColor: '#f0fff0',
        borderRadius: '3px',
        fontStyle: 'italic'
    },
    customsSection: {
        marginTop: '10px'
    },
    customsTable: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '10px'
    },
    customsLabel: {
        fontWeight: 'bold',
        padding: '5px',
        border: '1px solid #ccc',
        backgroundColor: '#f0f8ff',
        width: '25%'
    },
    customsValue: {
        padding: '5px',
        border: '1px solid #ccc'
    },
    certification: {
        marginBottom: '25px',
        padding: '20px',
        border: '2px solid #003399',
        borderRadius: '8px',
        backgroundColor: '#f8f9fa'
    },
    certificationText: {
        marginBottom: '15px',
        fontSize: '12px'
    },
    certificationDetails: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },
    placeDate: {
        fontSize: '11px'
    },
    customsStamp: {
        textAlign: 'center'
    },
    stampBox: {
        width: '120px',
        height: '80px',
        border: '2px solid #003399',
        borderRadius: '5px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '10px',
        fontWeight: 'bold',
        color: '#003399',
        backgroundColor: '#f0f8ff'
    },
    declaration: {
        marginBottom: '20px',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        backgroundColor: 'white'
    },
    declarationText: {
        margin: '10px 0 20px 0',
        fontSize: '11px',
        lineHeight: '1.4'
    },
    exporterSignature: {
        textAlign: 'center'
    },
    signatureBox: {
        display: 'inline-block',
        textAlign: 'center'
    },
    signatureLine: {
        marginBottom: '5px'
    },
    footer: {
        marginTop: '25px',
        padding: '15px',
        backgroundColor: '#f0f8ff',
        borderRadius: '5px',
        textAlign: 'center'
    },
    footerText: {
        fontSize: '11px',
        color: '#666'
    }
};

export default EUR1Certificate;