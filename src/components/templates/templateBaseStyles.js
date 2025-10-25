// templateBaseStyles.js
export const templateBaseStyles = {
    page: {
        width: '100%',
        minHeight: 'auto',
        padding: '15mm',
        backgroundColor: 'white',
        fontFamily: 'Arial, sans-serif',
        fontSize: '12px',
        lineHeight: '1.4',
        boxSizing: 'border-box',
        overflow: 'visible'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '15px',
        borderBottom: '2px solid #000',
        paddingBottom: '10px',
        flexWrap: 'wrap'
    },
    headerLeft: {
        flex: '1 1 300px',
        minWidth: '300px'
    },
    headerRight: {
        flex: '1 1 300px',
        minWidth: '300px'
    },
    title: {
        fontSize: '20px',
        fontWeight: 'bold',
        margin: '0 0 10px 0',
        textAlign: 'center'
    },
    section: {
        marginBottom: '15px',
        pageBreakInside: 'avoid'
    },
    twoColumn: {
        display: 'flex',
        gap: '15px',
        flexWrap: 'wrap'
    },
    column: {
        flex: '1 1 300px',
        minWidth: '300px'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '10px',
        tableLayout: 'fixed'
    },
    tableHeader: {
        backgroundColor: '#f5f5f5',
        border: '1px solid #ccc',
        padding: '6px',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: '9px',
        wordWrap: 'break-word'
    },
    tableCell: {
        border: '1px solid #ccc',
        padding: '6px',
        textAlign: 'center',
        fontSize: '9px',
        wordWrap: 'break-word'
    },
    footer: {
        marginTop: '20px',
        borderTop: '2px solid #000',
        paddingTop: '10px',
        pageBreakInside: 'avoid'
    }
};