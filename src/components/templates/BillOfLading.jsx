import React from 'react';

const BillOfLading = React.forwardRef(({ data }, ref) => {
    const {
        exporter_company_name,
        exporter_address,
        buyer_company_name,
        buyer_address,
        bill_of_lading_number,
        shippers_reference,
        carriers_reference,
        notify_party,
        dispatch_method,
        vessel_flight_details,
        port_of_loading,
        port_of_discharge,
        final_destination,
        departure_date,
        freight_terms,
        number_of_originals,
        container_numbers,
        seal_numbers,
        products = [],
        net_weight_total,
        gross_weight_total,
        measurements_total,
        authorized_signatory_name,
        authorized_signatory_designation
    } = data;

    return (
        <div ref={ref} style={styles.page}>
            {/* Header */}
            <div style={styles.header}>
                <div style={styles.headerLeft}>
                    <h1 style={styles.title}>BILL OF LADING</h1>
                    <div style={styles.shipper}>
                        <strong>Shipper</strong>
                        <div>{exporter_company_name}</div>
                        <div>{exporter_address}</div>
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
                                <td style={styles.metaLabel}>Shipper's Reference</td>
                                <td style={styles.metaValue}>{shippers_reference || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td style={styles.metaLabel}>Bill of Lading Number</td>
                                <td style={styles.metaValue}>{bill_of_lading_number}</td>
                            </tr>
                            <tr>
                                <td style={styles.metaLabel}>Carrier's Reference</td>
                                <td style={styles.metaValue}>{carriers_reference || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td style={styles.metaLabel}>Unique Consignment Reference</td>
                                <td style={styles.metaValue}>{bill_of_lading_number}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Consignee and Carrier */}
            <div style={styles.section}>
                <div style={styles.twoColumn}>
                    <div style={styles.column}>
                        <strong>Consignee</strong>
                        <div>{buyer_company_name}</div>
                        <div>{buyer_address}</div>
                    </div>
                    <div style={styles.column}>
                        <strong>Carrier Name</strong>
                        <div>Shipping Line Ltd.</div>
                        <div>International Shipping</div>
                    </div>
                </div>
            </div>

            {/* Notify Party */}
            <div style={styles.section}>
                <div style={styles.twoColumn}>
                    <div style={styles.column}>
                        <strong>Notify Party (If not Consignee)</strong>
                        <div>{notify_party || buyer_company_name}</div>
                        <div>{buyer_address}</div>
                    </div>
                    <div style={styles.column}>
                        <strong>Additional Notify Party</strong>
                        <div>{notify_party || 'N/A'}</div>
                    </div>
                </div>
            </div>

            {/* Shipping Details */}
            <div style={styles.section}>
                <table style={styles.detailsTable}>
                    <tbody>
                        <tr>
                            <td style={styles.detailLabel}>Pre-Carriage By</td>
                            <td style={styles.detailValue}>TRUCK</td>
                            <td style={styles.detailLabel}>Place of Receipt</td>
                            <td style={styles.detailValue}>{exporter_address.split(',')[0]}</td>
                            <td style={styles.detailLabel} rowSpan="4">Additional Information</td>
                            <td style={styles.detailValue} rowSpan="4">
                                Freight: {freight_terms}<br />
                                Origin: India
                            </td>
                        </tr>
                        <tr>
                            <td style={styles.detailLabel}>Vessel / Aircraft</td>
                            <td style={styles.detailValue}>{vessel_flight_details}</td>
                            <td style={styles.detailLabel}>Port of Loading</td>
                            <td style={styles.detailValue}>{port_of_loading}</td>
                        </tr>
                        <tr>
                            <td style={styles.detailLabel}>Port of Discharge</td>
                            <td style={styles.detailValue}>{port_of_discharge}</td>
                            <td style={styles.detailLabel}>Place of Delivery</td>
                            <td style={styles.detailValue}>{final_destination}</td>
                        </tr>
                        <tr>
                            <td style={styles.detailLabel}>Final Destination</td>
                            <td style={styles.detailValue}>{final_destination}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Goods Table */}
            <div style={styles.section}>
                <table style={styles.goodsTable}>
                    <thead>
                        <tr>
                            <th style={styles.tableHeader}>Marks & Numbers</th>
                            <th style={styles.tableHeader}>Kind & No of Packages</th>
                            <th style={styles.tableHeader}>Description of Goods</th>
                            <th style={styles.tableHeader}>Net Weight (Kg)</th>
                            <th style={styles.tableHeader}>Gross Weight (Kg)</th>
                            <th style={styles.tableHeader}>Measurements (m³)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <tr key={index}>
                                <td style={styles.tableCell}>Mark {index + 1}</td>
                                <td style={styles.tableCell}>Cartons</td>
                                <td style={styles.tableCell}>{product.description}</td>
                                <td style={styles.tableCell}>{product.net_weight || net_weight_total}</td>
                                <td style={styles.tableCell}>{product.gross_weight || gross_weight_total}</td>
                                <td style={styles.tableCell}>{product.measurements || measurements_total}</td>
                            </tr>
                        ))}
                        {/* Total Row */}
                        <tr>
                            <td colSpan="3" style={{ ...styles.tableCell, textAlign: 'right', fontWeight: 'bold' }}>
                                Total This Page
                            </td>
                            <td style={{ ...styles.tableCell, fontWeight: 'bold' }}>
                                {net_weight_total}
                            </td>
                            <td style={{ ...styles.tableCell, fontWeight: 'bold' }}>
                                {gross_weight_total}
                            </td>
                            <td style={{ ...styles.tableCell, fontWeight: 'bold' }}>
                                {measurements_total}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="3" style={{ ...styles.tableCell, textAlign: 'right', fontWeight: 'bold' }}>
                                Consignment Total
                            </td>
                            <td style={{ ...styles.tableCell, fontWeight: 'bold' }}>
                                {net_weight_total}
                            </td>
                            <td style={{ ...styles.tableCell, fontWeight: 'bold' }}>
                                {gross_weight_total}
                            </td>
                            <td style={{ ...styles.tableCell, fontWeight: 'bold' }}>
                                {measurements_total}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Container Details */}
            <div style={styles.section}>
                <table style={styles.containerTable}>
                    <thead>
                        <tr>
                            <th style={styles.tableHeader}>Container No(s)</th>
                            <th style={styles.tableHeader}>Seal No(s)</th>
                            <th style={styles.tableHeader}>Size / Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={styles.tableCell}>{container_numbers || 'CONT' + bill_of_lading_number.slice(-6)}</td>
                            <td style={styles.tableCell}>{seal_numbers || 'SEAL' + bill_of_lading_number.slice(-6)}</td>
                            <td style={styles.tableCell}>40FT / DRY</td>
                        </tr>
                    </tbody>
                </table>

                <div style={styles.totalPackages}>
                    <strong>Total No of Containers or other packages or units (in words):</strong>
                    {products.length} PACKAGES ONLY
                </div>
            </div>

            {/* Footer */}
            <div style={styles.footer}>
                <table style={styles.footerTable}>
                    <tbody>
                        <tr>
                            <td style={styles.footerLabel}>No. of original Bills of Lading</td>
                            <td style={styles.footerValue}>{number_of_originals || 3}</td>
                            <td style={styles.footerLabel}>Incoterms® 2020</td>
                            <td style={styles.footerValue}>FOB</td>
                            <td style={styles.footerLabel}>Payable at</td>
                            <td style={styles.footerValue}>{port_of_loading}</td>
                            <td style={styles.footerLabel}>Freight Charges</td>
                            <td style={styles.footerValue}>{freight_terms}</td>
                            <td style={styles.footerLabel}>Shipped on Board Date</td>
                            <td style={styles.footerValue}>{new Date(departure_date).toLocaleDateString()}</td>
                        </tr>
                    </tbody>
                </table>

                <div style={styles.termsSection}>
                    <div style={styles.twoColumn}>
                        <div style={styles.column}>
                            <strong>Terms and Conditions</strong>
                            <div style={styles.terms}>
                                1. Carrier's liability as per Hague-Visby Rules<br />
                                2. Freight payable at destination<br />
                                3. Subject to liner terms and conditions
                            </div>
                        </div>
                        <div style={styles.column}>
                            <div style={styles.issuance}>
                                <div>Place and Date of Issue: {exporter_address.split(',')[0]}, {new Date().toLocaleDateString()}</div>
                                <div style={styles.signatory}>
                                    <strong>Signatory Company</strong><br />
                                    Shipping Line Ltd.
                                </div>
                                <div style={styles.signature}>
                                    <div>Name of Authorized Signatory: {authorized_signatory_name}</div>
                                    <div>Designation: {authorized_signatory_designation}</div>
                                    <div style={styles.signatureLine}>Signature: _________________________</div>
                                </div>
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
    shipper: {
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
        backgroundColor: '#f5f5f5',
        fontSize: '10px'
    },
    metaValue: {
        padding: '2px 5px',
        border: '1px solid #ccc',
        fontSize: '10px'
    },
    section: {
        marginBottom: '15px'
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
        whiteSpace: 'nowrap',
        fontSize: '9px'
    },
    detailValue: {
        padding: '4px',
        border: '1px solid #ccc',
        fontSize: '9px'
    },
    goodsTable: {
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: '10px',
        fontSize: '10px'
    },
    containerTable: {
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: '10px',
        fontSize: '10px'
    },
    tableHeader: {
        backgroundColor: '#f5f5f5',
        border: '1px solid #ccc',
        padding: '6px',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: '9px'
    },
    tableCell: {
        border: '1px solid #ccc',
        padding: '6px',
        textAlign: 'center',
        fontSize: '9px'
    },
    totalPackages: {
        marginTop: '10px',
        padding: '8px',
        backgroundColor: '#f5f5f5',
        border: '1px solid #ccc',
        fontSize: '10px'
    },
    footer: {
        marginTop: '20px',
        borderTop: '2px solid #000',
        paddingTop: '15px'
    },
    footerTable: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '9px',
        marginBottom: '15px'
    },
    footerLabel: {
        fontWeight: 'bold',
        padding: '4px',
        border: '1px solid #ccc',
        backgroundColor: '#f5f5f5',
        whiteSpace: 'nowrap'
    },
    footerValue: {
        padding: '4px',
        border: '1px solid #ccc'
    },
    termsSection: {
        marginTop: '15px'
    },
    terms: {
        fontSize: '9px',
        marginTop: '5px'
    },
    issuance: {
        fontSize: '10px'
    },
    signatory: {
        marginTop: '10px',
        marginBottom: '5px'
    },
    signature: {
        marginTop: '15px'
    },
    signatureLine: {
        marginTop: '20px'
    }
};

export default BillOfLading;