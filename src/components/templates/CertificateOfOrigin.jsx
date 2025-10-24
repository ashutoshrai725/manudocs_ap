import React from 'react';

const CertificateOfOrigin = React.forwardRef(({ data }, ref) => {
    const {
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
                <div style={styles.headerLeft}>
                    <h1 style={styles.title}>CERTIFICATE OF ORIGIN</h1>
                    <div style={styles.exporter}>
                        <strong>Exporter</strong>
                        <div>{exporter_company_name}</div>
                        <div>{exporter_address}</div>
                        <div>GSTIN: {exporter_gstin}</div>
                    </div>
                </div>
                <div style={styles.headerRight}>
                    <table style={styles.metaTable}>
                        <tbody>
                            <tr>
                                <td style={styles.metaLabel}>Pages</td>
                                <td style={styles.metaValue}>1 of 1</td>
                            </tr>
                            <tr>
                                <td style={styles.metaLabel}>Export Invoice Number & Date</td>
                                <td style={styles.metaValue}>
                                    {invoice_number} <br />
                                    {new Date(invoice_date).toLocaleDateString()}
                                </td>
                            </tr>
                            <tr>
                                <td style={styles.metaLabel}>Letter Of Credit No</td>
                                <td style={styles.metaValue}>{lc_number || 'N/A'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Consignee and Buyer */}
            <div style={styles.section}>
                <div style={styles.twoColumn}>
                    <div style={styles.column}>
                        <strong>Consignee</strong>
                        <div>{buyer_company_name}</div>
                        <div>{buyer_address}</div>
                    </div>
                    <div style={styles.column}>
                        <strong>Buyer (If not Consignee)</strong>
                        <div>{buyer_company_name}</div>
                        <div>{buyer_address}</div>
                    </div>
                </div>
            </div>

            {/* Shipment Details */}
            <div style={styles.section}>
                <table style={styles.detailsTable}>
                    <tbody>
                        <tr>
                            <td style={styles.detailLabel}>Method of Dispatch</td>
                            <td style={styles.detailValue}>{dispatch_method}</td>
                            <td style={styles.detailLabel}>Type of Shipment</td>
                            <td style={styles.detailValue}>Container</td>
                        </tr>
                        <tr>
                            <td style={styles.detailLabel}>Vessel / Aircraft</td>
                            <td style={styles.detailValue}>{vessel_flight_details}</td>
                            <td style={styles.detailLabel}>Voyage No</td>
                            <td style={styles.detailValue}>{vessel_flight_details.split('/').pop() || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td style={styles.detailLabel}>Port of Loading</td>
                            <td style={styles.detailValue}>{port_of_loading}</td>
                            <td style={styles.detailLabel}>Date of Departure</td>
                            <td style={styles.detailValue}>{new Date(departure_date).toLocaleDateString()}</td>
                        </tr>
                        <tr>
                            <td style={styles.detailLabel}>Port of Discharge</td>
                            <td style={styles.detailValue}>{port_of_discharge}</td>
                            <td style={styles.detailLabel}>Final Destination</td>
                            <td style={styles.detailValue}>{final_destination}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Products Table */}
            <div style={styles.section}>
                <table style={styles.productsTable}>
                    <thead>
                        <tr>
                            <th style={styles.tableHeader}>Marks & Numbers</th>
                            <th style={styles.tableHeader}>Kind & No of Packages</th>
                            <th style={styles.tableHeader}>Description of Goods</th>
                            <th style={styles.tableHeader}>Tariff Code</th>
                            <th style={styles.tableHeader}>Gross Weight (Kg)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <tr key={index}>
                                <td style={styles.tableCell}>{marks_numbers || `Mark${index + 1}`}</td>
                                <td style={styles.tableCell}>Cartons</td>
                                <td style={styles.tableCell}>{product.description}</td>
                                <td style={styles.tableCell}>{tariff_code || product.hs_code}</td>
                                <td style={styles.tableCell}>{product.gross_weight || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Declarations */}
            <div style={styles.section}>
                <div style={styles.twoColumn}>
                    <div style={styles.column}>
                        <div style={styles.declaration}>
                            <strong>Declaration By The Chamber</strong>
                            <p style={styles.declarationText}>
                                The undersigned certifies on the basis of information provided by the exporter that to the best of it's knowledge and belief, the goods are of designated origin, production or manufacture.
                            </p>
                            <div style={styles.signatureBlock}>
                                <div>Place and Date of Issue: _________________________</div>
                                <div>Signatory Company: {exporter_company_name}</div>
                                <div>Name of Authorized Signatory: _________________________</div>
                                <div style={styles.signatureLine}>Signature: _________________________</div>
                            </div>
                        </div>
                    </div>
                    <div style={styles.column}>
                        <div style={styles.declaration}>
                            <strong>Declaration By The Exporter</strong>
                            <p style={styles.declarationText}>
                                I, the undersigned, being duly authorized by the Consignor, and having made the necessary enquiries hereby certify that based on the rules of origin of the country of destination, all the goods listed originate in the country and place of designated. I further declare that I will furnish to the Customs authorities of the importing or their nominee, for inspection at any time, such as evidence as may be required for the purpose of verifying this certificate. The goods were produced/manufactured at:
                            </p>
                            <div style={styles.manufacturing}>
                                <strong>The goods were produced/manufactured at:</strong><br />
                                {exporter_address}
                            </div>
                            <div style={styles.signatureBlock}>
                                <div>Place and Date of Issue: _________________________</div>
                                <div>Signatory Company: {exporter_company_name}</div>
                                <div>Name of Authorized Signatory: {authorized_signatory_name}</div>
                                <div>Designation: {authorized_signatory_designation}</div>
                                <div style={styles.signatureLine}>Signature: _________________________</div>
                            </div>
                        </div>
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
        border: '1px solid #ccc'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '20px',
        borderBottom: '2px solid #000',
        paddingBottom: '15px'
    },
    headerLeft: {
        flex: 1
    },
    headerRight: {
        flex: 1
    },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
        margin: '0 0 15px 0',
        textAlign: 'center'
    },
    exporter: {
        marginBottom: '10px'
    },
    metaTable: {
        width: '100%',
        borderCollapse: 'collapse'
    },
    metaLabel: {
        fontWeight: 'bold',
        padding: '2px 5px',
        border: '1px solid #ccc',
        backgroundColor: '#f5f5f5'
    },
    metaValue: {
        padding: '2px 5px',
        border: '1px solid #ccc'
    },
    section: {
        marginBottom: '20px'
    },
    twoColumn: {
        display: 'flex',
        gap: '20px'
    },
    column: {
        flex: 1
    },
    detailsTable: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '10px'
    },
    detailLabel: {
        fontWeight: 'bold',
        padding: '4px',
        border: '1px solid #ccc',
        backgroundColor: '#f5f5f5',
        whiteSpace: 'nowrap'
    },
    detailValue: {
        padding: '4px',
        border: '1px solid #ccc'
    },
    productsTable: {
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: '10px'
    },
    tableHeader: {
        backgroundColor: '#f5f5f5',
        border: '1px solid #ccc',
        padding: '8px',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: '11px'
    },
    tableCell: {
        border: '1px solid #ccc',
        padding: '8px',
        textAlign: 'center',
        fontSize: '11px'
    },
    declaration: {
        border: '1px solid #ccc',
        padding: '15px',
        height: '100%'
    },
    declarationText: {
        fontSize: '11px',
        lineHeight: '1.3',
        marginBottom: '15px'
    },
    manufacturing: {
        marginBottom: '15px',
        fontSize: '11px'
    },
    signatureBlock: {
        marginTop: '20px'
    },
    signatureLine: {
        marginTop: '20px'
    }
};

export default CertificateOfOrigin;