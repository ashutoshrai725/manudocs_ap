import React from 'react';

const HalalCertificate = React.forwardRef(({ data }, ref) => {
    const {
        halal_certificate_number,
        exporter_company_name,
        exporter_address,
        products = [],
        halal_supervisor,
        inspection_date,
        authorized_signatory_name
    } = data;

    const product = products[0] || {};

    return (
        <div ref={ref} style={styles.page}>
            {/* Header */}
            <div style={styles.header}>
                <div style={styles.logoSection}>
                    <div style={styles.logo}>🕌</div>
                    <div style={styles.companyInfo}>
                        <div style={styles.companyName}>Halal India Pvt. Ltd.</div>
                        <div style={styles.companySub}>Certified Halal Products</div>
                    </div>
                </div>
                <h1 style={styles.title}>HALAL CERTIFICATE</h1>
                <div style={styles.certificateNumber}>
                    Cert No. {halal_certificate_number || 'HIPA' + Date.now().toString().slice(-6)}
                </div>
            </div>

            {/* Certificate Body */}
            <div style={styles.certificateBody}>
                <div style={styles.certificateText}>
                    This is to certify that the products provided by
                </div>

                <div style={styles.companyAddress}>
                    <strong>{exporter_company_name}</strong><br />
                    {exporter_address}
                </div>

                <div style={styles.certificateText}>
                    Contains no pork, lard or other elements of non-halal ingredients as defined under
                    Islamic Law and is 'Halal' to Muslims.
                </div>

                <div style={styles.validity}>
                    This certificate is non-transferable and is valid from {new Date().toLocaleDateString()} to {new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </div>

                {/* Products Table */}
                <div style={styles.productsSection}>
                    <strong>Certified Products:</strong>
                    <table style={styles.productsTable}>
                        <thead>
                            <tr>
                                <th style={styles.tableHeader}>Product Name</th>
                                <th style={styles.tableHeader}>Product Code</th>
                                <th style={styles.tableHeader}>Halal Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, index) => (
                                <tr key={index}>
                                    <td style={styles.tableCell}>{product.description}</td>
                                    <td style={styles.tableCell}>{product.product_code}</td>
                                    <td style={styles.tableCell}>✅ Certified Halal</td>
                                </tr>
                            ))}
                            {products.length === 0 && (
                                <tr>
                                    <td style={styles.tableCell}>{product.description || 'Food Products'}</td>
                                    <td style={styles.tableCell}>{product.product_code || 'FP001'}</td>
                                    <td style={styles.tableCell}>✅ Certified Halal</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Inspection Details */}
                <div style={styles.inspectionSection}>
                    <div style={styles.twoColumn}>
                        <div style={styles.column}>
                            <strong>Halal Supervisor:</strong><br />
                            {halal_supervisor || 'Dr. Ahmed Rahman'}
                        </div>
                        <div style={styles.column}>
                            <strong>Inspection Date:</strong><br />
                            {inspection_date ? new Date(inspection_date).toLocaleDateString() : new Date().toLocaleDateString()}
                        </div>
                    </div>
                </div>

                {/* Declaration */}
                <div style={styles.declaration}>
                    All above said ingredients / products are approved by Halal India Certification Services
                    and no cross contamination with non-halal products has been confirmed.
                    Any questions regarding halal status of this organization please contact with us.
                </div>
            </div>

            {/* Footer */}
            <div style={styles.footer}>
                <div style={styles.signatureSection}>
                    <div style={styles.signature}>
                        <div style={styles.signatureLine}>_________________________</div>
                        <div><strong>Mohammed Chalthramwala</strong></div>
                        <div>Director</div>
                        <div>Halal India Pvt. Ltd.</div>
                    </div>
                </div>

                <div style={styles.contactInfo}>
                    <strong>Halal India Certification Services</strong><br />
                    India GIC C133, Prabhu Nagar, Delhi 10200<br />
                    Phone: +91-11-26543210<br />
                    Website: www.halalindia.in<br />
                    Email: info@halalindia.in
                </div>

                <div style={styles.stamp}>
                    <div style={styles.stampCircle}>
                        <div>OFFICIAL</div>
                        <div>HALAL</div>
                        <div>STAMP</div>
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
        marginBottom: '30px',
        borderBottom: '3px solid #2e8b57',
        paddingBottom: '20px'
    },
    logoSection: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '15px',
        marginBottom: '15px'
    },
    logo: {
        fontSize: '48px'
    },
    companyInfo: {
        textAlign: 'left'
    },
    companyName: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#2e8b57'
    },
    companySub: {
        fontSize: '12px',
        color: '#666'
    },
    title: {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#2e8b57',
        margin: '10px 0',
        textTransform: 'uppercase'
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
    certificateBody: {
        marginBottom: '30px',
        textAlign: 'center'
    },
    certificateText: {
        fontSize: '14px',
        marginBottom: '20px',
        lineHeight: '1.6'
    },
    companyAddress: {
        fontSize: '16px',
        fontWeight: 'bold',
        margin: '20px 0',
        padding: '15px',
        backgroundColor: '#f0f8f0',
        borderRadius: '8px',
        border: '1px solid #2e8b57'
    },
    validity: {
        fontSize: '12px',
        fontStyle: 'italic',
        color: '#666',
        margin: '20px 0',
        padding: '10px',
        backgroundColor: '#fffacd',
        borderRadius: '5px'
    },
    productsSection: {
        margin: '25px 0',
        textAlign: 'left'
    },
    productsTable: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '10px',
        fontSize: '11px'
    },
    tableHeader: {
        backgroundColor: '#2e8b57',
        color: 'white',
        border: '1px solid #1c6b47',
        padding: '10px',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    tableCell: {
        border: '1px solid #ddd',
        padding: '10px',
        textAlign: 'center',
        backgroundColor: '#f9f9f9'
    },
    inspectionSection: {
        margin: '20px 0',
        padding: '15px',
        backgroundColor: '#f0f8f0',
        borderRadius: '8px'
    },
    twoColumn: {
        display: 'flex',
        gap: '20px',
        justifyContent: 'center'
    },
    column: {
        flex: 1,
        textAlign: 'center'
    },
    declaration: {
        fontSize: '11px',
        fontStyle: 'italic',
        color: '#555',
        margin: '20px 0',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '5px',
        borderLeft: '4px solid #2e8b57'
    },
    footer: {
        marginTop: '40px',
        borderTop: '2px solid #2e8b57',
        paddingTop: '20px',
        position: 'relative'
    },
    signatureSection: {
        textAlign: 'center',
        marginBottom: '20px'
    },
    signature: {
        display: 'inline-block',
        textAlign: 'center'
    },
    signatureLine: {
        marginBottom: '5px',
        fontSize: '14px'
    },
    contactInfo: {
        textAlign: 'center',
        fontSize: '11px',
        color: '#666',
        marginBottom: '20px',
        lineHeight: '1.5'
    },
    stamp: {
        position: 'absolute',
        right: '50px',
        bottom: '20px',
        textAlign: 'center'
    },
    stampCircle: {
        width: '120px',
        height: '120px',
        border: '3px solid #d4af37',
        borderRadius: '50%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '12px',
        fontWeight: 'bold',
        color: '#d4af37',
        backgroundColor: '#fffacd',
        transform: 'rotate(-15deg)'
    }
};

export default HalalCertificate;