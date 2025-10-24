import React from 'react';

const PackingList = React.forwardRef(({ data }, ref) => {
    const {
        exporter_company_name,
        exporter_address,
        exporter_gstin,
        exporter_contact_person,
        exporter_contact_info,
        buyer_company_name,
        buyer_address,
        invoice_number,
        invoice_date,
        bill_of_lading_number,
        buyer_reference,
        dispatch_method,
        vessel_flight_details,
        port_of_loading,
        port_of_discharge,
        final_destination,
        departure_date,
        package_details,
        net_weight_total,
        gross_weight_total,
        measurements_total,
        products = [],
        authorized_signatory_name,
        authorized_signatory_designation
    } = data;

    return (
        <div ref={ref} style={styles.page}>
            {/* Header */}
            <div style={styles.header}>
                <div style={styles.headerLeft}>
                    <h1 style={styles.title}>PACKING LIST</h1>
                    <div style={styles.exporter}>
                        <strong>Exporter</strong>
                        <div>{exporter_company_name}</div>
                        <div>{exporter_address}</div>
                        <div>GSTIN: {exporter_gstin}</div>
                        <div>Contact: {exporter_contact_person} - {exporter_contact_info}</div>
                    </div>
                </div>
                <div style={styles.headerRight}>
                    <table style={styles.metaTable}>
                        <tbody>
                            <tr>
                                <td style={styles.metaLabel}>Page</td>
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
                                <td style={styles.metaLabel}>Bill of Lading Number</td>
                                <td style={styles.metaValue}>{bill_of_lading_number}</td>
                            </tr>
                            <tr>
                                <td style={styles.metaLabel}>Reference</td>
                                <td style={styles.metaValue}>{buyer_reference || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td style={styles.metaLabel}>Buyer Reference</td>
                                <td style={styles.metaValue}>{buyer_reference || 'N/A'}</td>
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
                            <td style={styles.detailLabel}>Country Of Origin of Goods</td>
                            <td style={styles.detailValue}>India</td>
                            <td style={styles.detailLabel}>Country of Final Destination</td>
                            <td style={styles.detailValue}>{final_destination}</td>
                        </tr>
                        <tr>
                            <td style={styles.detailLabel}>Vessel / Aircraft</td>
                            <td style={styles.detailValue}>{vessel_flight_details}</td>
                            <td style={styles.detailLabel}>Voyage No</td>
                            <td style={styles.detailValue}>{vessel_flight_details.split('/').pop() || 'N/A'}</td>
                            <td style={styles.detailLabel} colSpan="2">Packing Information</td>
                            <td style={styles.detailValue} colSpan="2">{package_details}</td>
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
                            <th style={styles.tableHeader}>Product Code</th>
                            <th style={styles.tableHeader}>Description of Goods</th>
                            <th style={styles.tableHeader}>Unit Quantity</th>
                            <th style={styles.tableHeader}>Kind & No of Packages</th>
                            <th style={styles.tableHeader}>Net Weight (Kg)</th>
                            <th style={styles.tableHeader}>Gross Weight (Kg)</th>
                            <th style={styles.tableHeader}>Measurements (m³)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <tr key={index}>
                                <td style={styles.tableCell}>{product.product_code}</td>
                                <td style={styles.tableCell}>{product.description}</td>
                                <td style={styles.tableCell}>{product.quantity} {product.unit}</td>
                                <td style={styles.tableCell}>{package_details}</td>
                                <td style={styles.tableCell}>{product.net_weight || net_weight_total}</td>
                                <td style={styles.tableCell}>{product.gross_weight || gross_weight_total}</td>
                                <td style={styles.tableCell}>{product.measurements || measurements_total}</td>
                            </tr>
                        ))}
                        {/* Total Row */}
                        <tr>
                            <td colSpan="4" style={{ ...styles.tableCell, textAlign: 'right', fontWeight: 'bold' }}>
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
                            <td colSpan="4" style={{ ...styles.tableCell, textAlign: 'right', fontWeight: 'bold' }}>
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

            {/* Footer */}
            <div style={styles.footer}>
                <div style={styles.twoColumn}>
                    <div style={styles.column}>
                        <div><strong>Additional Info</strong></div>
                        <div style={styles.packingInfo}>
                            {package_details}
                        </div>
                    </div>
                    <div style={styles.column}>
                        <div style={styles.signatory}>
                            <strong>Signatory Company</strong><br />
                            {exporter_company_name}
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
    footer: {
        marginTop: '30px',
        borderTop: '2px solid #000',
        paddingTop: '15px'
    },
    packingInfo: {
        marginTop: '10px',
        fontSize: '11px'
    },
    signatory: {
        marginTop: '15px',
        marginBottom: '10px'
    },
    signature: {
        marginTop: '20px'
    },
    signatureLine: {
        marginTop: '40px'
    }
};

export default PackingList;