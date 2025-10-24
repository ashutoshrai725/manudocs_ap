import React from 'react';

const HealthCertificate = React.forwardRef(({ data }, ref) => {
    const {
        health_certificate_number,
        exporter_company_name,
        exporter_address,
        buyer_company_name,
        buyer_address,
        products = [],
        product_batch_number,
        manufacturing_plant,
        manufacturing_date,
        expiry_date,
        invoice_number,
        invoice_date,
        dispatch_method,
        port_of_loading,
        port_of_discharge,
        net_weight_total,
        gross_weight_total
    } = data;

    const product = products[0] || {};

    return (
        <div ref={ref} style={styles.page}>
            {/* Header */}
            <div style={styles.header}>
                <h1 style={styles.title}>HEALTH CERTIFICATE</h1>
                <div style={styles.certificateNumber}>
                    No: {health_certificate_number || 'EIA/MUM/2024-25/VOL/00735'}
                </div>
                <div style={styles.subtitle}>
                    (General - Applicable for all food items other than those where specific formats are prescribed)
                </div>
            </div>

            {/* Country of Despatch */}
            <div style={styles.section}>
                <strong>Country of despatch: INDIA</strong>
            </div>

            {/* Competent Authority */}
            <div style={styles.section}>
                <strong>Competent Authority:</strong> Export Inspection Council (Ministry of Commerce & Industry, Govt. of India)
                2nd Floor, B-Plate, Block-1 Commercial Complex, East Kidwai Nagar New Delhi-110023, INDIA;
                Phone : +91-11- 20815386/87/88, E-mail:eic@eicindia.gov.in, Website: www.eicindia.gov.in.
            </div>

            {/* 1. Details Identifying the products */}
            <div style={styles.section}>
                <strong>1. Details Identifying the products</strong>
                <table style={styles.detailsTable}>
                    <tbody>
                        <tr>
                            <td style={styles.detailLabel}>Description:</td>
                            <td style={styles.detailValue} colSpan="3">{product.description || 'Food Product'}</td>
                        </tr>
                        <tr>
                            <td style={styles.detailLabel}>Batch No./Lot No.</td>
                            <td style={styles.detailValue}>{product_batch_number || 'EXP-616/23-24'}</td>
                            <td style={styles.detailLabel}>Quantity:</td>
                            <td style={styles.detailValue}>
                                NET WT: {net_weight_total} Kgs<br />
                                Gross WT: {gross_weight_total} Kgs
                            </td>
                        </tr>
                        <tr>
                            <td style={styles.detailLabel}>Type of Packaging:</td>
                            <td style={styles.detailValue}>1 x 25 Kgs</td>
                            <td style={styles.detailLabel}>Invoice No.:</td>
                            <td style={styles.detailValue}>{invoice_number}, DT. {new Date(invoice_date).toLocaleDateString()}</td>
                        </tr>
                        <tr>
                            <td style={styles.detailLabel}>No. of packages:</td>
                            <td style={styles.detailValue}>792 DRUMS</td>
                            <td style={styles.detailLabel}>Temperature required during storage and transport:</td>
                            <td style={styles.detailValue}>Ambient</td>
                        </tr>
                        <tr>
                            <td style={styles.detailLabel}>Manufacturing date:</td>
                            <td style={styles.detailValue}>{manufacturing_date ? new Date(manufacturing_date).toLocaleDateString() : '19/02/2024'}</td>
                            <td style={styles.detailLabel}>Expiry Date:</td>
                            <td style={styles.detailValue}>{expiry_date ? new Date(expiry_date).toLocaleDateString() : '18/02/2029'}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* 2. Provenance of products */}
            <div style={styles.section}>
                <strong>2. Provenance of products</strong>
                <div style={styles.provenance}>
                    Address (es) and number(s) of preparation or processing plant(s) authorised for exports by the competent authority
                </div>
                <div style={styles.plantAddress}>
                    {manufacturing_plant || exporter_address}
                </div>
            </div>

            {/* 3. Destination of the products */}
            <div style={styles.section}>
                <strong>3. Destination of the products</strong>
                <div style={styles.destination}>
                    The products are to be despatched<br />
                    From: {port_of_loading}, INDIA<br />
                    To: {port_of_discharge}<br />
                    By the following means of transport: {(dispatch_method || '').toUpperCase()}
                </div>

                <div style={styles.twoColumn}>
                    <div style={styles.column}>
                        <strong>Name of consignor and address at place of despatch</strong>
                        <div>{exporter_company_name}</div>
                        <div>{exporter_address}</div>
                    </div>
                    <div style={styles.column}>
                        <strong>Name of consignee and address at place of destination</strong>
                        <div>{buyer_company_name}</div>
                        <div>{buyer_address}</div>
                    </div>
                </div>

                <div style={styles.lcDetails}>
                    <strong>LC Details:</strong> {data.lc_number || 'NA'}
                </div>
            </div>

            {/* 4. Health Attestation */}
            <div style={styles.section}>
                <strong>4. Health Attestation</strong>
                <div style={styles.attestation}>
                    It is hereby certified that the products described above have been processed as per the
                    (i) Buyer's requirements in Specification of the importing country
                    (ii) National Standards, stored and transported under hygienic conditions and found conforming to laid down standards.
                    This product is fit for the human consumption.
                </div>
            </div>

            {/* Validity and Signature */}
            <div style={styles.footer}>
                <div style={styles.twoColumn}>
                    <div style={styles.column}>
                        <div><strong>Validity of the Certificate:</strong> {expiry_date ? new Date(expiry_date).toLocaleDateString() : '20/07/2024'}</div>
                        <div><strong>Place of Issue:</strong> Export Inspection Agency - Mumbai</div>
                    </div>
                    <div style={styles.column}>
                        <div><strong>Date of issue:</strong> {new Date().toLocaleDateString()}</div>
                        <div style={styles.signature}>
                            <div><strong>Signature of authorized officer</strong></div>
                            <div>Name: Sumon Ghosh</div>
                            <div>Designation: Technical Officer</div>
                            <div style={styles.signatureLine}>_________________________</div>
                        </div>
                    </div>
                </div>
                <div style={styles.seal}>
                    <strong>Seal</strong><br />
                    [OFFICIAL SEAL]
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
        textAlign: 'center',
        marginBottom: '20px',
        borderBottom: '2px solid #000',
        paddingBottom: '15px'
    },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
        margin: '0 0 10px 0'
    },
    certificateNumber: {
        fontSize: '14px',
        fontWeight: 'bold',
        marginBottom: '5px'
    },
    subtitle: {
        fontSize: '11px',
        fontStyle: 'italic',
        color: '#666'
    },
    section: {
        marginBottom: '20px',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px'
    },
    detailsTable: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '10px',
        fontSize: '11px'
    },
    detailLabel: {
        fontWeight: 'bold',
        padding: '4px',
        border: '1px solid #ccc',
        backgroundColor: '#f5f5f5',
        whiteSpace: 'nowrap',
        width: '25%'
    },
    detailValue: {
        padding: '4px',
        border: '1px solid #ccc'
    },
    provenance: {
        marginTop: '10px',
        marginBottom: '5px',
        fontSize: '11px'
    },
    plantAddress: {
        padding: '8px',
        backgroundColor: '#f9f9f9',
        border: '1px solid #ddd',
        borderRadius: '3px',
        fontSize: '11px'
    },
    destination: {
        marginBottom: '15px',
        fontSize: '11px'
    },
    twoColumn: {
        display: 'flex',
        gap: '20px',
        marginTop: '10px'
    },
    column: {
        flex: 1
    },
    lcDetails: {
        marginTop: '10px',
        fontSize: '11px'
    },
    attestation: {
        marginTop: '10px',
        fontSize: '11px',
        lineHeight: '1.3',
        textAlign: 'justify'
    },
    footer: {
        marginTop: '30px',
        borderTop: '2px solid #000',
        paddingTop: '15px'
    },
    signature: {
        marginTop: '15px'
    },
    signatureLine: {
        marginTop: '20px'
    },
    seal: {
        textAlign: 'center',
        marginTop: '30px',
        fontSize: '14px'
    }
};

export default HealthCertificate;