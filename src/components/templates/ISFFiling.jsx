import React from 'react';

const ISFFiling = React.forwardRef(({ data }, ref) => {
    const {
        exporter_company_name,
        exporter_address,
        buyer_company_name,
        buyer_address,
        invoice_number,
        invoice_date,
        bill_of_lading_number,
        buyer_reference,
        importer_of_record,
        manufacturer_supplier,
        seller_owner,
        consignee_number,
        dispatch_method,
        vessel_flight_details,
        port_of_loading,
        departure_date,
        country_of_origin = 'India',
        final_destination,
        products = [],
        container_numbers
    } = data;

    return (
        <div ref={ref} style={styles.page}>
            {/* Header */}
            <div style={styles.header}>
                <h1 style={styles.title}>IMPORTER SECURITY FILING</h1>
                <div style={styles.subtitle}>10+2 Security Filing for US Customs and Border Protection</div>
            </div>

            {/* Manufacturer/Supplier */}
            <div style={styles.section}>
                <div style={styles.twoColumn}>
                    <div style={styles.column}>
                        <strong>Manufacturer or Supplier Name and Address</strong>
                        <div>{exporter_company_name}</div>
                        <div>{exporter_address}</div>
                    </div>
                    <div style={styles.column}>
                        <table style={styles.metaTable}>
                            <tbody>
                                <tr>
                                    <td style={styles.metaLabel}>Pages</td>
                                    <td style={styles.metaValue}>1 of 1</td>
                                </tr>
                                <tr>
                                    <td style={styles.metaLabel}>Export Invoice Number & Date</td>
                                    <td style={styles.metaValue}>
                                        {invoice_number}<br />
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
            </div>

            {/* Seller/Owner and Buyer */}
            <div style={styles.section}>
                <div style={styles.twoColumn}>
                    <div style={styles.column}>
                        <strong>Seller or Owner Name and Address</strong>
                        <div>{seller_owner || exporter_company_name}</div>
                        <div>{exporter_address}</div>
                    </div>
                    <div style={styles.column}>
                        <strong>Buyer or Owner Name and Address</strong>
                        <div>{buyer_company_name}</div>
                        <div>{buyer_address}</div>
                    </div>
                </div>
            </div>

            {/* Consignee and Ship To */}
            <div style={styles.section}>
                <div style={styles.twoColumn}>
                    <div style={styles.column}>
                        <strong>Consignee Number(s) Name and Address</strong>
                        <div>Number: {consignee_number || 'N/A'}</div>
                        <div>{buyer_company_name}</div>
                        <div>{buyer_address}</div>
                    </div>
                    <div style={styles.column}>
                        <strong>Ship To Name and Address</strong>
                        <div>{buyer_company_name}</div>
                        <div>{buyer_address}</div>
                    </div>
                </div>
            </div>

            {/* Shipping Details */}
            <div style={styles.section}>
                <table style={styles.detailsTable}>
                    <tbody>
                        <tr>
                            <td style={styles.detailLabel}>Method of Dispatch</td>
                            <td style={styles.detailValue}>{dispatch_method}</td>
                            <td style={styles.detailLabel}>Type of Shipment</td>
                            <td style={styles.detailValue}>Container</td>
                            <td style={styles.detailLabel}>Importer of Record Number</td>
                            <td style={styles.detailValue}>{consignee_number || 'N/A'}</td>
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
                            <td style={styles.detailLabel}>Importer of Record Name and Address</td>
                            <td style={styles.detailValue}>
                                {importer_of_record || buyer_company_name}<br />
                                {buyer_address}
                            </td>
                        </tr>
                        <tr>
                            <td style={styles.detailLabel}>Country Of Origin of Goods</td>
                            <td style={styles.detailValue}>{country_of_origin}</td>
                            <td style={styles.detailLabel}>Country of Final Destination</td>
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
                            <th style={styles.tableHeader}>HTS Code</th>
                            <th style={styles.tableHeader}>Manufacturer / Supplier</th>
                            <th style={styles.tableHeader}>Country of Origin</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <tr key={index}>
                                <td style={styles.tableCell}>{product.product_code}</td>
                                <td style={styles.tableCell}>{product.description}</td>
                                <td style={styles.tableCell}>{product.hs_code}</td>
                                <td style={styles.tableCell}>{manufacturer_supplier || exporter_company_name}</td>
                                <td style={styles.tableCell}>{country_of_origin}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Container and Consolidator Info */}
            <div style={styles.section}>
                <div style={styles.twoColumn}>
                    <div style={styles.column}>
                        <strong>Container Stuffing Location</strong>
                        <div>{exporter_address}</div>
                        <div style={styles.containerInfo}>
                            <strong>Container Numbers:</strong> {container_numbers || 'N/A'}
                        </div>
                    </div>
                    <div style={styles.column}>
                        <div style={styles.issuance}>
                            <div><strong>Place and Date of Issue</strong></div>
                            <div>{exporter_address.split(',')[0]}, {new Date().toLocaleDateString()}</div>
                            <div style={styles.signatory}>
                                <strong>Signatory Company</strong><br />
                                {exporter_company_name}
                            </div>
                            <div style={styles.signature}>
                                <div style={styles.signatureLine}>Signature: _________________________</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Consolidator Info */}
            <div style={styles.section}>
                <strong>Consolidator (Stuffer) Name and Address</strong>
                <div>{exporter_company_name}</div>
                <div>{exporter_address}</div>
            </div>

            {/* Footer Notes */}
            <div style={styles.footerNotes}>
                <strong>Important Notes:</strong><br />
                • ISF must be filed 24 hours before vessel departure<br />
                • Failure to file may result in penalties up to $5,000<br />
                • All information must be accurate and complete
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
        borderBottom: '2px solid #0047ab',
        paddingBottom: '15px'
    },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#0047ab',
        margin: '0 0 10px 0'
    },
    subtitle: {
        fontSize: '14px',
        color: '#666',
        fontStyle: 'italic'
    },
    section: {
        marginBottom: '20px',
        padding: '15px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        backgroundColor: '#fafafa'
    },
    twoColumn: {
        display: 'flex',
        gap: '20px'
    },
    column: {
        flex: 1
    },
    metaTable: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '10px'
    },
    metaLabel: {
        fontWeight: 'bold',
        padding: '3px 5px',
        border: '1px solid #ccc',
        backgroundColor: '#e6f2ff',
        whiteSpace: 'nowrap'
    },
    metaValue: {
        padding: '3px 5px',
        border: '1px solid #ccc'
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
        backgroundColor: '#e6f2ff',
        whiteSpace: 'nowrap',
        width: '20%'
    },
    detailValue: {
        padding: '4px',
        border: '1px solid #ccc'
    },
    productsTable: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '10px',
        fontSize: '10px'
    },
    tableHeader: {
        backgroundColor: '#0047ab',
        color: 'white',
        border: '1px solid #003380',
        padding: '8px',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: '9px'
    },
    tableCell: {
        border: '1px solid #ccc',
        padding: '8px',
        textAlign: 'center',
        fontSize: '9px',
        backgroundColor: 'white'
    },
    containerInfo: {
        marginTop: '10px',
        padding: '8px',
        backgroundColor: '#e6f2ff',
        borderRadius: '3px'
    },
    issuance: {
        textAlign: 'center'
    },
    signatory: {
        marginTop: '15px',
        marginBottom: '10px'
    },
    signature: {
        marginTop: '20px'
    },
    signatureLine: {
        marginTop: '30px'
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

export default ISFFiling;