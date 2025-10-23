import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { MessageCircle, FileText, Edit3, Send, Download, Mail, Upload, SkipForward } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { generateDocuments, renderTemplateComponent } from '../LandingPage/TemplateEngine';
import * as ReactDOM from 'react-dom/client';
import Header from '../LandingPage/Header';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.REACT_APP_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const AIAgentPage = ({ user, onPageChange, onLogout, documentsUploaded = true }) => {
    // State management
    const [messages, setMessages] = useState([]);
    const [currentStep, setCurrentStep] = useState('loading');
    const [initialized, setInitialized] = useState(false);
    const [selectedTemplates, setSelectedTemplates] = useState([]);
    const [companyData, setCompanyData] = useState(null);
    const [userInputs, setUserInputs] = useState({});
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [awaitingInput, setAwaitingInput] = useState(false);
    const [generatedDocuments, setGeneratedDocuments] = useState([]);
    const [activeDocIndex, setActiveDocIndex] = useState(0);
    const [showContinueButton, setShowContinueButton] = useState(false);

    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [userMessage, setUserMessage] = useState('');
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [signatureFile, setSignatureFile] = useState(null);
    const [signaturePreview, setSignaturePreview] = useState(null);

    // New edit functionality state
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [activeEditTab, setActiveEditTab] = useState('exporter');

    // Autofill states
    const [pendingInput, setPendingInput] = useState('');
    const [showConfirmButton, setShowConfirmButton] = useState(false);
    const [currentInputField, setCurrentInputField] = useState('');

    // Product state
    const [products, setProducts] = useState([]);
    const [currentProduct, setCurrentProduct] = useState({
        product_code: '',
        description: '',
        hs_code: '',
        unit: 'PCS',
        quantity: '',
        unit_price: '',
        total_amount: ''
    });

    // Packing state
    const [packingInfo, setPackingInfo] = useState([]);
    const [currentPacking, setCurrentPacking] = useState({
        product_index: '',
        kind_of_packages: 'Carton',
        number_of_packages: '',
        net_weight: '',
        gross_weight: '',
        length: '',
        width: '',
        height: ''
    });

    // Refs for auto-scroll
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Storage key for persistence
    const storageKey = useMemo(() => `manudocs.aiagent.chat.${user?.id || 'guest'}`, [user?.id]);
    const autofillStorageKey = useMemo(() => `manudocs.autofill.data.${user?.id || 'guest'}`, [user?.id]);

    // Unique ID generator
    const generateUniqueId = useCallback(() => {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }, []);

    // Document-specific questions
    const documentQuestions = useMemo(() => ({
        // Common questions for most documents
        common: [
            // ========== EXPORTER DETAILS ==========
            { field: 'exporter_company_name', question: 'What is your company name?', type: 'text', required: true, category: 'exporter' },
            { field: 'exporter_address', question: 'What is your complete company address?', type: 'textarea', required: true, category: 'exporter' },
            { field: 'exporter_gstin', question: 'What is your GST number? (Format: 07AABCU9603R1ZM)', type: 'text', required: true, category: 'exporter' },
            { field: 'exporter_contact_person', question: 'What is your contact person\'s name?', type: 'text', required: true, category: 'exporter' },
            { field: 'exporter_contact_info', question: 'What is your contact phone number or email?', type: 'text', required: true, category: 'exporter' },
            { field: 'exporter_logo', question: 'Would you like to upload your company logo? (PNG/JPG, max 2MB)', type: 'file', accept: 'image/*', required: false, category: 'exporter' },
            { field: 'exporter_eori_number', question: 'What is your EORI number? (Economic Operator Registration and Identification)', type: 'text', required: false, category: 'exporter' },
            { field: 'authorized_signatory_name', question: 'What is the name of the authorized signatory?', type: 'text', required: true, category: 'signatory' },
            { field: 'authorized_signatory_designation', question: 'What is the designation of the authorized signatory?', type: 'text', required: true, category: 'signatory' },
            { field: 'authorized_signature', question: 'Please upload the authorized signature (PNG/JPG, max 2MB)', type: 'file', accept: 'image/*', required: true, category: 'signatory' },

            // ========== BUYER DETAILS ==========
            { field: 'buyer_company_name', question: 'What is the buyer\'s complete legal company name?', type: 'text', required: true, category: 'buyer' },
            { field: 'buyer_address', question: 'What is the buyer\'s complete address?', type: 'textarea', required: true, category: 'buyer' },
            { field: 'buyer_country', question: 'What is the buyer\'s country?', type: 'text', required: true, category: 'buyer' },
            { field: 'buyer_reference', question: 'What is the buyer\'s reference number?', type: 'text', required: false, category: 'buyer' },

            // ========== CONSIGNEE DETAILS ==========
            { field: 'consignee_same_as_buyer', question: 'Is the consignee the same as the buyer?', type: 'select', options: ['Yes', 'No'], required: true, category: 'consignee' },
            { field: 'consignee_company_name', question: 'What is the consignee\'s company name?', type: 'text', required: false, condition: { field: 'consignee_same_as_buyer', value: 'No' }, category: 'consignee' },
            { field: 'consignee_address', question: 'What is the consignee\'s complete address?', type: 'textarea', required: false, condition: { field: 'consignee_same_as_buyer', value: 'No' }, category: 'consignee' },
            { field: 'consignee_country', question: 'What is the consignee\'s country?', type: 'text', required: false, condition: { field: 'consignee_same_as_buyer', value: 'No' }, category: 'consignee' },

            // ========== SHIPMENT DETAILS ==========
            { field: 'dispatch_method', question: 'What is the method of dispatch?', type: 'select', options: ['Sea', 'Air', 'Road', 'Rail'], required: true, category: 'shipment' },
            { field: 'shipment_type', question: 'What is the type of shipment?', type: 'select', options: ['Full Container', 'Less than Container (LCL)', 'Bulk', 'Break Bulk', 'Air Freight'], required: true, category: 'shipment' },
            { field: 'country_of_origin', question: 'What is the country of origin of goods?', type: 'text', required: true, category: 'shipment' },
            { field: 'final_destination_country', question: 'What is the country of final destination?', type: 'text', required: true, category: 'shipment' },
            { field: 'port_of_loading', question: 'What is the port of loading? (e.g., NHAVA SHEVA, MUMBAI)', type: 'text', required: true, category: 'shipment' },
            { field: 'port_of_discharge', question: 'What is the port of discharge? (e.g., ROTTERDAM)', type: 'text', required: true, category: 'shipment' },
            { field: 'departure_date', question: 'What is the date of departure?', type: 'date', required: true, category: 'shipment' },
            { field: 'delivery_date', question: 'What is the expected delivery date?', type: 'date', required: true, category: 'shipment' },
            { field: 'vessel_flight_details', question: 'What is the vessel name / aircraft name and voyage number? (e.g., MAERSK HONG KONG / V.234W)', type: 'text', required: true, category: 'shipment' },
            { field: 'place_of_receipt', question: 'Where will the carrier receive the goods?', type: 'text', required: true, category: 'shipment' },
            { field: 'place_of_delivery', question: 'What is the final place of delivery?', type: 'text', required: true, category: 'shipment' },

            // ========== PAYMENT & TERMS ==========
            { field: 'incoterms', question: 'What are the terms of sale? (Incoterms 2020)', type: 'select', options: ['EXW', 'FCA', 'FOB', 'CIF', 'CFR', 'DAP', 'DDP'], required: true, category: 'payment' },
            { field: 'payment_method', question: 'What is the method of payment?', type: 'select', options: ['Letter of Credit', 'Bank Transfer', 'Cash', 'Documentary Collection', 'Open Account'], required: true, category: 'payment' },
            { field: 'currency', question: 'What is the transaction currency?', type: 'select', options: ['USD', 'EUR', 'INR', 'GBP', 'JPY', 'AED', 'SGD'], required: true, category: 'payment' },
            { field: 'bank_details', question: 'What are your bank details for payment? Include account number, bank name, SWIFT/IFSC, and branch.', type: 'textarea', required: true, category: 'payment' },
        ],

        // Invoice-specific questions
        commercial_invoice: [
            { field: 'invoice_number', question: 'What is the invoice number? (e.g., INV-2024-001)', type: 'text', required: true, category: 'documents' },
            { field: 'invoice_date', question: 'What is the invoice issue date?', type: 'date', required: true, category: 'documents' },
            { field: 'export_reference', question: 'What is the export reference number?', type: 'text', required: false, category: 'documents' },
            { field: 'bill_of_lading', question: 'What is the bill of lading number? (if applicable)', type: 'text', required: false, category: 'documents' },
            { field: 'declaration_number', question: 'What is the customs declaration number?', type: 'text', required: false, category: 'documents' },
            { field: 'insurance_policy', question: 'What is the Marine Cover Policy No?', type: 'text', required: false, category: 'payment' },
            { field: 'lc_number', question: 'What is the Letter Of Credit (LC) No?', type: 'text', required: false, category: 'payment' },
            { field: 'additional_instructions', question: 'Are there any additional instructions or remarks for this shipment?', type: 'textarea', required: false, category: 'additional' },
            { field: 'products', question: 'Let\'s add your products for the invoice.', type: 'products', required: true, category: 'products' },
        ],

        proforma_invoice: [
            { field: 'invoice_number', question: 'What is the proforma invoice number? (e.g., PI-2024-001)', type: 'text', required: true, category: 'documents' },
            { field: 'invoice_date', question: 'What is the proforma invoice issue date?', type: 'date', required: true, category: 'documents' },
            { field: 'additional_instructions', question: 'Any additional remarks for the proforma invoice?', type: 'textarea', required: false, category: 'additional' },
            { field: 'products', question: 'Let\'s add your products for the proforma invoice.', type: 'products', required: true, category: 'products' },
        ],

        packing_list: [
            { field: 'invoice_number', question: 'What is the export invoice number?', type: 'text', required: true, category: 'documents' },
            { field: 'invoice_date', question: 'What is the export invoice date?', type: 'date', required: true, category: 'documents' },
            { field: 'export_reference', question: 'What is the export reference number?', type: 'text', required: false, category: 'documents' },
            { field: 'bill_of_lading', question: 'What is the bill of lading number?', type: 'text', required: false, category: 'documents' },
            { field: 'additional_instructions', question: 'Any special packing instructions?', type: 'textarea', required: false, category: 'additional' },
            { field: 'packing_info', question: 'Let\'s add packing information for your products.', type: 'packing', required: true, category: 'packing' },
        ],

        delivery_challan: [
            { field: 'delivery_address', question: 'What is the delivery address?', type: 'textarea', required: true, category: 'delivery' },
            { field: 'vehicle_number', question: 'What is the vehicle number for delivery?', type: 'text', required: true, category: 'delivery' },
            { field: 'received_by_name', question: 'Who should receive the goods?', type: 'text', required: true, category: 'delivery' },
            { field: 'delivery_instructions', question: 'Any special delivery instructions?', type: 'textarea', required: false, category: 'delivery' },
            { field: 'invoice_number', question: 'What is the invoice reference number?', type: 'text', required: true, category: 'documents' },
            { field: 'invoice_date', question: 'What is the invoice date?', type: 'date', required: true, category: 'documents' },
            { field: 'products', question: 'Let\'s add products for the delivery challan.', type: 'products', required: true, category: 'products' },
        ],

        credit_note: [
            { field: 'note_type', question: 'What type of adjustment note?', type: 'select', options: ['Credit Note', 'Debit Note'], required: true, category: 'adjustments' },
            { field: 'note_reason', question: 'Reason for the credit/debit note?', type: 'select', options: ['Goods returned', 'Price adjustment', 'Discount', 'Damage', 'Additional charges', 'Tax adjustment'], required: true, category: 'adjustments' },
            { field: 'original_invoice_number', question: 'What is the original invoice number?', type: 'text', required: true, category: 'adjustments' },
            { field: 'original_invoice_date', question: 'What is the original invoice date?', type: 'date', required: true, category: 'adjustments' },
            { field: 'adjustment_type', question: 'Type of adjustment?', type: 'select', options: ['Full return', 'Partial return', 'Price adjustment', 'Additional charges'], required: true, category: 'adjustments' },
            { field: 'products', question: 'Let\'s add products for the credit note.', type: 'products', required: true, category: 'products' },
        ],

        debit_note: [
            { field: 'note_type', question: 'What type of adjustment note?', type: 'select', options: ['Credit Note', 'Debit Note'], required: true, category: 'adjustments' },
            { field: 'note_reason', question: 'Reason for the credit/debit note?', type: 'select', options: ['Goods returned', 'Price adjustment', 'Discount', 'Damage', 'Additional charges', 'Tax adjustment'], required: true, category: 'adjustments' },
            { field: 'original_invoice_number', question: 'What is the original invoice number?', type: 'text', required: true, category: 'adjustments' },
            { field: 'original_invoice_date', question: 'What is the original invoice date?', type: 'date', required: true, category: 'adjustments' },
            { field: 'adjustment_type', question: 'Type of adjustment?', type: 'select', options: ['Full return', 'Partial return', 'Price adjustment', 'Additional charges'], required: true, category: 'adjustments' },
            { field: 'products', question: 'Let\'s add products for the debit note.', type: 'products', required: true, category: 'products' },
        ],

        certificate_of_origin: [
            { field: 'certificate_type', question: 'What type of Certificate of Origin is required?', type: 'select', options: ['Form A', 'Non-preferential', 'Preferential', 'General'], required: true, category: 'certificates' },
            { field: 'origin_criteria', question: 'What is the origin criteria for the goods?', type: 'select', options: ['Wholly obtained', 'Sufficiently processed', 'Regional value content'], required: true, category: 'certificates' },
            { field: 'customs_authority', question: 'Which customs authority will issue the certificate?', type: 'text', required: true, category: 'certificates' },
            { field: 'manufacturing_address', question: 'What is the manufacturing address (if different from exporter address)?', type: 'textarea', required: false, category: 'certificates' },
            { field: 'additional_instructions', question: 'Any additional declaration information?', type: 'textarea', required: false, category: 'additional' },
            { field: 'products', question: 'Let\'s add products for the certificate of origin.', type: 'products', required: true, category: 'products' },
        ],

        bill_of_lading: [
            { field: 'bl_type', question: 'What type of Bill of Lading is required?', type: 'select', options: ['Sea Waybill', 'Express Release', 'Telex Release', 'Original'], required: true, category: 'shipping_docs' },
            { field: 'number_of_originals', question: 'How many original Bills of Lading should be issued?', type: 'number', required: true, category: 'shipping_docs' },
            { field: 'notify_party_same_as_consignee', question: 'Is the notify party the same as the consignee?', type: 'select', options: ['Yes', 'No'], required: true, category: 'notify_party' },
            { field: 'notify_party_company_name', question: 'What is the notify party\'s company name?', type: 'text', required: false, condition: { field: 'notify_party_same_as_consignee', value: 'No' }, category: 'notify_party' },
            { field: 'notify_party_address', question: 'What is the notify party\'s complete address?', type: 'textarea', required: false, condition: { field: 'notify_party_same_as_consignee', value: 'No' }, category: 'notify_party' },
            { field: 'freight_terms', question: 'What are the freight terms?', type: 'select', options: ['Prepaid', 'Collect', 'Third Party'], required: true, category: 'freight' },
            { field: 'flight_number', question: 'What is the flight number? (for air shipments)', type: 'text', required: false, category: 'shipment', condition: { field: 'dispatch_method', value: 'Air' } },
            { field: 'airport_of_departure', question: 'What is the airport of departure? (IATA code)', type: 'text', required: false, category: 'shipment', condition: { field: 'dispatch_method', value: 'Air' } },
            { field: 'airport_of_destination', question: 'What is the airport of destination? (IATA code)', type: 'text', required: false, category: 'shipment', condition: { field: 'dispatch_method', value: 'Air' } },
            { field: 'additional_instructions', question: 'Any special shipping instructions?', type: 'textarea', required: false, category: 'additional' },
            { field: 'packing_info', question: 'Let\'s add packing information for the bill of lading.', type: 'packing', required: true, category: 'packing' },
        ],

        shipping_instructions: [
            { field: 'forwarder_company', question: 'What is your freight forwarder company name?', type: 'text', required: true, category: 'shipping_docs' },
            { field: 'forwarder_contact', question: 'What is the freight forwarder contact person?', type: 'text', required: true, category: 'shipping_docs' },
            { field: 'special_handling', question: 'Any special handling instructions?', type: 'textarea', required: false, category: 'shipping_docs' },
            { field: 'documents_required', question: 'Which documents are required for this shipment?', type: 'multiselect', options: ['Commercial Invoice', 'Packing List', 'Certificate of Origin', 'Bill of Lading', 'Insurance Certificate', 'Export Declaration'], required: true, category: 'shipping_docs' },
            { field: 'notify_party_same_as_consignee', question: 'Is the notify party the same as the consignee?', type: 'select', options: ['Yes', 'No'], required: true, category: 'notify_party' },
            { field: 'notify_party_company_name', question: 'What is the notify party\'s company name?', type: 'text', required: false, condition: { field: 'notify_party_same_as_consignee', value: 'No' }, category: 'notify_party' },
            { field: 'notify_party_address', question: 'What is the notify party\'s complete address?', type: 'textarea', required: false, condition: { field: 'notify_party_same_as_consignee', value: 'No' }, category: 'notify_party' },
            { field: 'packing_info', question: 'Let\'s add packing information for shipping instructions.', type: 'packing', required: true, category: 'packing' },
        ],

        export_declaration: [
            { field: 'export_purpose', question: 'What is the purpose of export?', type: 'select', options: ['Sale', 'Return', 'Repair', 'Sample', 'Exhibition'], required: true, category: 'declarations' },
            { field: 'license_details', question: 'Any export license details?', type: 'text', required: false, category: 'declarations' },
            { field: 'customs_office', question: 'Which customs office will handle the export?', type: 'text', required: true, category: 'declarations' },
            { field: 'declaration_number', question: 'What is the export declaration number?', type: 'text', required: false, category: 'declarations' },
            { field: 'additional_instructions', question: 'Any additional declaration information?', type: 'textarea', required: false, category: 'additional' },
            { field: 'products', question: 'Let\'s add products for the export declaration.', type: 'products', required: true, category: 'products' },
        ],

        air_waybill: [
            { field: 'airport_of_departure', question: 'What is the airport of departure? (IATA code)', type: 'text', required: true, category: 'shipment' },
            { field: 'airport_of_destination', question: 'What is the airport of destination? (IATA code)', type: 'text', required: true, category: 'shipment' },
            { field: 'flight_number', question: 'What is the flight number?', type: 'text', required: true, category: 'shipment' },
            { field: 'notify_party_same_as_consignee', question: 'Is the notify party the same as the consignee?', type: 'select', options: ['Yes', 'No'], required: true, category: 'notify_party' },
            { field: 'notify_party_company_name', question: 'What is the notify party\'s company name?', type: 'text', required: false, condition: { field: 'notify_party_same_as_consignee', value: 'No' }, category: 'notify_party' },
            { field: 'notify_party_address', question: 'What is the notify party\'s complete address?', type: 'textarea', required: false, condition: { field: 'notify_party_same_as_consignee', value: 'No' }, category: 'notify_party' },
            { field: 'special_handling', question: 'Any special handling instructions for air freight?', type: 'textarea', required: false, category: 'shipping_docs' },
            { field: 'packing_info', question: 'Let\'s add packing information for the air waybill.', type: 'packing', required: true, category: 'packing' },
        ],

        insurance_certificate: [
            { field: 'insurance_company', question: 'What is the insurance company name?', type: 'text', required: true, category: 'freight' },
            { field: 'insurance_policy', question: 'What is the Marine Cover Policy No?', type: 'text', required: true, category: 'payment' },
            { field: 'coverage_type', question: 'What type of insurance coverage?', type: 'select', options: ['All Risk', 'FPA (Free of Particular Average)', 'WA (With Average)'], required: true, category: 'freight' },
            { field: 'insured_value', question: 'What is the insured value of the shipment?', type: 'number', required: true, category: 'freight' },
            { field: 'premium_amount', question: 'What is the insurance premium amount?', type: 'number', required: true, category: 'freight' },
            { field: 'claims_payable_at', question: 'Where are claims payable?', type: 'text', required: true, category: 'freight' },
            { field: 'additional_instructions', question: 'Any special insurance terms?', type: 'textarea', required: false, category: 'additional' },
        ],

        quotation: [
            { field: 'quotation_validity', question: 'How many days is this quotation valid?', type: 'number', required: true, category: 'quotation' },
            { field: 'payment_terms_detailed', question: 'Detailed payment terms for quotation?', type: 'textarea', required: true, category: 'quotation' },
            { field: 'delivery_terms', question: 'Detailed delivery timeline?', type: 'textarea', required: true, category: 'quotation' },
            { field: 'inclusions_exclusions', question: 'What is included/excluded in the quotation?', type: 'textarea', required: true, category: 'quotation' },
            { field: 'additional_instructions', question: 'Any additional terms and conditions?', type: 'textarea', required: false, category: 'additional' },
            { field: 'products', question: 'Let\'s add products for the quotation.', type: 'products', required: true, category: 'products' },
        ]
    }), []);

    // Get questions based on selected templates
    const getQuestionsForSelectedTemplates = useCallback(() => {
        if (selectedTemplates.length === 0) return [];

        let allQuestions = [...documentQuestions.common];
        const seenFields = new Set(allQuestions.map(q => q.field));

        selectedTemplates.forEach(template => {
            const templateQuestions = documentQuestions[template.id] || [];
            templateQuestions.forEach(question => {
                if (!seenFields.has(question.field)) {
                    allQuestions.push(question);
                    seenFields.add(question.field);
                }
            });
        });

        return allQuestions;
    }, [selectedTemplates, documentQuestions]);

    const questions = useMemo(() => getQuestionsForSelectedTemplates(), [getQuestionsForSelectedTemplates]);

    // Group questions by category for editing
    const questionsByCategory = useMemo(() => {
        const categories = {};
        questions.forEach(q => {
            if (!categories[q.category]) {
                categories[q.category] = [];
            }
            categories[q.category].push(q);
        });
        return categories;
    }, [questions]);

    // Get current document data (with edits if in edit mode)
    const getCurrentDocumentData = useCallback(() => {
        if (isEditing && Object.keys(editData).length > 0) {
            return {
                ...editData,
                total_amount: editData.products?.reduce((sum, product) =>
                    sum + (parseFloat(product.total_amount) || 0), 0) || 0,
            };
        }

        return {
            ...userInputs,
            products: products,
            packing_info: packingInfo,
            exporter_logo: logoPreview,
            authorized_signature: signaturePreview,
            total_amount: products.reduce((sum, product) => sum + (parseFloat(product.total_amount) || 0), 0),
        };
    }, [isEditing, editData, userInputs, products, packingInfo, logoPreview, signaturePreview]);

    // Load autofill data from localStorage
    const loadAutofillData = useCallback(() => {
        try {
            const saved = localStorage.getItem(autofillStorageKey);
            return saved ? JSON.parse(saved) : {};
        } catch (error) {
            console.warn('Error loading autofill data:', error);
            return {};
        }
    }, [autofillStorageKey]);

    // Save autofill data to localStorage
    const saveAutofillData = useCallback((data) => {
        try {
            localStorage.setItem(autofillStorageKey, JSON.stringify(data));
        } catch (error) {
            console.warn('Error saving autofill data:', error);
        }
    }, [autofillStorageKey]);

    // Update autofill data when user inputs change for first 3 questions
    useEffect(() => {
        const autofillFields = ['exporter_company_name', 'exporter_address', 'exporter_gstin'];
        const hasNewData = autofillFields.some(field =>
            userInputs[field] && userInputs[field] !== '[Skipped]' && userInputs[field].trim()
        );

        if (hasNewData) {
            const newAutofillData = { ...loadAutofillData() };
            autofillFields.forEach(field => {
                if (userInputs[field] && userInputs[field] !== '[Skipped]') {
                    newAutofillData[field] = userInputs[field];
                }
            });
            saveAutofillData(newAutofillData);
        }
    }, [userInputs, loadAutofillData, saveAutofillData]);

    // Handle file uploads
    const handleFileUpload = useCallback((file, field) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target.result;
                if (field === 'exporter_logo') {
                    setLogoPreview(result);
                } else if (field === 'authorized_signature') {
                    setSignaturePreview(result);
                }
                resolve(result);
            };
            reader.readAsDataURL(file);
        });
    }, []);

    // Handle user input
    const handleUserInput = useCallback(async (inputValue, field, file = null) => {
        console.log('handleUserInput called - field:', field, 'value:', inputValue);

        // Handle file uploads
        if (file) {
            await handleFileUpload(file, field);
            inputValue = file.name;
        }

        // Validate required fields
        const currentQ = questions.find(q => q.field === field);
        if (currentQ?.required && !inputValue) {
            alert('This field is required. Please provide an answer.');
            return;
        }

        setUserInputs(prev => ({
            ...prev,
            [field]: inputValue
        }));

        // Save to autofill data for first 3 questions
        const autofillFields = ['exporter_company_name', 'exporter_address', 'exporter_gstin'];
        if (autofillFields.includes(field) && inputValue && inputValue !== '[Skipped]') {
            const autofillData = loadAutofillData();
            autofillData[field] = inputValue;
            saveAutofillData(autofillData);
        }

        if (field !== 'exporter_logo' && field !== 'authorized_signature') {
            setMessages(prev => [...prev, {
                id: generateUniqueId(),
                type: 'user',
                content: inputValue,
                timestamp: new Date()
            }]);
        }

        setMessages(prevMessages =>
            prevMessages.map(msg =>
                msg.showInput && msg.expectedField === field
                    ? { ...msg, showInput: false, inputDisabled: true, userAnswer: inputValue }
                    : msg
            )
        );

        setAwaitingInput(false);
        setShowConfirmButton(false);
        setPendingInput('');
        setCurrentInputField('');

        // Move to next question and trigger next question
        const nextIndex = currentQuestion + 1;
        console.log('Moving to next question index:', nextIndex);
        setCurrentQuestion(nextIndex);
    }, [generateUniqueId, questions, currentQuestion, handleFileUpload, loadAutofillData, saveAutofillData]);

    // Handle confirm button click for autofilled inputs
    const handleConfirmInput = useCallback(() => {
        if (pendingInput.trim()) {
            handleUserInput(pendingInput, currentInputField);
        }
    }, [pendingInput, currentInputField, handleUserInput]);

    // Complete data collection
    const completeDataCollection = useCallback(async () => {
        console.log('=== completeDataCollection called ===');

        const selectedDocNames = selectedTemplates.map(t => t.name).join(', ');

        setMessages(prev => [...prev, {
            id: generateUniqueId(),
            type: 'bot',
            content: `🎉 All information collected!\n\nGenerating your professional export documents now...\n\n📄 Documents to be generated:\n${selectedTemplates.map(t => `• ${t.name}`).join('\n')}`,
            timestamp: new Date()
        }]);

        setCurrentStep('generating');

        // Prepare final data for document generation
        const finalData = getCurrentDocumentData();

        console.log('Final data for document generation:', finalData);

        // Use the actual template engine to generate documents
        const companyData = {
            company_name: userInputs.exporter_company_name,
            comp_reg_address: userInputs.exporter_address,
            gstin: userInputs.exporter_gstin
        };

        try {
            const generatedDocs = generateDocuments(selectedTemplates, companyData, finalData);
            console.log('Generated documents:', generatedDocs);

            setGeneratedDocuments(generatedDocs);

            setMessages(prev => [...prev, {
                id: generateUniqueId(),
                type: 'bot',
                content: `✅ ${selectedTemplates.length} professional export documents generated successfully!\n\n📋 Documents include:\n${selectedTemplates.map(t => `• ${t.name}`).join('\n')}`,
                timestamp: new Date(),
                showDownloadButton: true
            }]);

            console.log('Setting currentStep to completed');
            setCurrentStep('completed');
        } catch (error) {
            console.error('Error generating documents:', error);
            setMessages(prev => [...prev, {
                id: generateUniqueId(),
                type: 'bot',
                content: '❌ Error generating documents. Please try again.',
                timestamp: new Date()
            }]);
            setCurrentStep('error');
        }
    }, [generateUniqueId, getCurrentDocumentData, userInputs, selectedTemplates]);

    // Get the next valid question index
    const getNextValidQuestionIndex = useCallback((startIndex) => {
        let index = startIndex;

        while (index < questions.length) {
            const question = questions[index];

            // Skip conditional questions that don't apply
            if (question.condition) {
                const conditionField = question.condition.field;
                const conditionValue = question.condition.value;

                if (userInputs[conditionField] !== conditionValue) {
                    console.log(`Skipping conditional question: ${question.field}, condition not met`);
                    index++;
                    continue;
                }
            }

            // This question is valid
            return index;
        }

        // No more valid questions
        return questions.length;
    }, [questions, userInputs]);

    // Skip current question
    const skipCurrentQuestion = useCallback(() => {
        const currentQ = questions[currentQuestion];

        if (currentQ.required) {
            alert('This question is required and cannot be skipped.');
            return;
        }

        setMessages(prev => [...prev, {
            id: generateUniqueId(),
            type: 'user',
            content: '[Skipped]',
            timestamp: new Date()
        }]);

        setMessages(prevMessages =>
            prevMessages.map(msg =>
                msg.showInput && msg.expectedField === currentQ.field
                    ? { ...msg, showInput: false, inputDisabled: true, userAnswer: '[Skipped]' }
                    : msg
            )
        );

        setUserInputs(prev => ({
            ...prev,
            [currentQ.field]: '[Skipped]'
        }));

        setAwaitingInput(false);
        setShowConfirmButton(false);
        const nextIndex = currentQuestion + 1;
        setCurrentQuestion(nextIndex);
    }, [currentQuestion, questions, generateUniqueId]);

    // Ask questions one by one
    const askNextQuestion = useCallback(() => {
        console.log('=== askNextQuestion called ===');
        console.log('currentQuestion:', currentQuestion);
        console.log('questions.length:', questions.length);
        console.log('awaitingInput:', awaitingInput);
        console.log('currentStep:', currentStep);

        // If we're already awaiting input, don't ask another question
        if (awaitingInput) {
            console.log('Already awaiting input, skipping...');
            return;
        }

        // Find the next valid question
        const nextValidIndex = getNextValidQuestionIndex(currentQuestion);
        console.log('nextValidIndex:', nextValidIndex);

        if (nextValidIndex >= questions.length) {
            console.log('All questions completed, calling completeDataCollection');
            completeDataCollection();
            return;
        }

        setCurrentQuestion(nextValidIndex);
        const currentQ = questions[nextValidIndex];

        console.log('Asking question:', currentQ.field, 'index:', nextValidIndex);

        // Check for autofill values from localStorage for first 3 questions
        let autofillValue = '';
        const autofillFields = ['exporter_company_name', 'exporter_address', 'exporter_gstin'];

        if (autofillFields.includes(currentQ.field)) {
            const autofillData = loadAutofillData();
            autofillValue = autofillData[currentQ.field] || '';
        }

        // Also check company data as fallback
        if (!autofillValue && nextValidIndex < 3 && companyData) {
            switch (currentQ.field) {
                case 'exporter_company_name':
                    autofillValue = companyData.company_name;
                    break;
                case 'exporter_address':
                    autofillValue = companyData.comp_reg_address;
                    break;
                case 'exporter_gstin':
                    autofillValue = companyData.gstin;
                    break;
            }
        }

        // If we have an autofill value and the field isn't already filled, show with autofill
        if (autofillValue && !userInputs[currentQ.field]) {
            console.log('Showing question with autofill value:', autofillValue);

            setMessages(prev => [...prev, {
                id: generateUniqueId(),
                type: 'bot',
                content: `${nextValidIndex + 1}/${questions.length} - ${currentQ.question}${currentQ.required ? ' *' : ''}\n\nI found this information from your previous sessions: "${autofillValue}"`,
                timestamp: new Date(),
                showInput: true,
                inputType: currentQ.type,
                inputOptions: currentQ.options,
                expectedField: currentQ.field,
                required: currentQ.required,
                accept: currentQ.accept,
                showSkip: !currentQ.required,
                autofillValue: autofillValue
            }]);

            // Set the pending input with autofill value
            setPendingInput(autofillValue);
            setCurrentInputField(currentQ.field);
            setShowConfirmButton(true);
            setAwaitingInput(true);
            return;
        }

        if (currentQ.field === 'products') {
            setMessages(prev => [...prev, {
                id: generateUniqueId(),
                type: 'bot',
                content: `Let's add your products. We'll collect the following details for each product:\n• Product Code\n• Description\n• HS Code (for Commercial Invoice)\n• Unit of Measure\n• Quantity\n• Unit Price\n• Total Amount\n\nClick "Add Product" to start.`,
                timestamp: new Date(),
                showInput: true,
                inputType: 'products',
                expectedField: 'products'
            }]);
            setAwaitingInput(true);
            return;
        }

        if (currentQ.field === 'packing_info') {
            setMessages(prev => [...prev, {
                id: generateUniqueId(),
                type: 'bot',
                content: `Now let's add packing information for your products. We need:\n• Product reference\n• Kind of packages\n• Number of packages\n• Net weight (Kg)\n• Gross weight (Kg)\n• Measurements (Length × Width × Height)\n\nClick "Add Packing Info" to start.`,
                timestamp: new Date(),
                showInput: true,
                inputType: 'packing',
                expectedField: 'packing_info'
            }]);
            setAwaitingInput(true);
            return;
        }

        setMessages(prev => [...prev, {
            id: generateUniqueId(),
            type: 'bot',
            content: `${nextValidIndex + 1}/${questions.length} - ${currentQ.question}${currentQ.required ? ' *' : ''}`,
            timestamp: new Date(),
            showInput: true,
            inputType: currentQ.type,
            inputOptions: currentQ.options,
            expectedField: currentQ.field,
            required: currentQ.required,
            accept: currentQ.accept,
            showSkip: !currentQ.required,
            autofillValue: autofillValue
        }]);
        setAwaitingInput(true);
    }, [currentQuestion, questions, completeDataCollection, userInputs, generateUniqueId, awaitingInput, currentStep, getNextValidQuestionIndex, companyData, loadAutofillData]);

    // Load saved state and company data
    useEffect(() => {
        const loadSavedState = () => {
            try {
                const raw = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
                if (raw) {
                    const saved = JSON.parse(raw);
                    if (saved) {
                        setMessages(saved.messages || []);
                        setCurrentStep(saved.currentStep || 'loading');
                        setInitialized(Boolean(saved.initialized));
                        setSelectedTemplates(saved.selectedTemplates || []);
                        setCompanyData(saved.companyData || null);
                        setUserInputs(saved.userInputs || {});
                        setCurrentQuestion(saved.currentQuestion || 0);
                        setAwaitingInput(Boolean(saved.awaitingInput));
                        setGeneratedDocuments(saved.generatedDocuments || []);
                        setActiveDocIndex(saved.activeDocIndex || 0);
                        setShowContinueButton(Boolean(saved.showContinueButton));
                        setProducts(saved.products || []);
                        setPackingInfo(saved.packingInfo || []);
                        setLogoPreview(saved.logoPreview || null);
                        setSignaturePreview(saved.signaturePreview || null);
                    }
                }

                // Load company data from previous sessions
                const companyDataKey = `manudocs.companyData.${user?.id || 'guest'}`;
                const savedCompanyData = localStorage.getItem(companyDataKey);
                if (savedCompanyData) {
                    const companyData = JSON.parse(savedCompanyData);
                    setCompanyData(companyData);
                }
            } catch (error) {
                console.warn('Error loading saved chat state:', error);
            }
        };

        loadSavedState();
    }, [storageKey, user?.id]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (messagesEndRef.current) {
            setTimeout(() => {
                messagesEndRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'end'
                });
            }, 300);
        }
    }, [messages]);

    // Save state
    useEffect(() => {
        const saveState = () => {
            try {
                const stateToSave = {
                    messages,
                    currentStep,
                    initialized,
                    selectedTemplates,
                    companyData,
                    userInputs,
                    currentQuestion,
                    awaitingInput,
                    generatedDocuments,
                    activeDocIndex,
                    showContinueButton,
                    products,
                    packingInfo,
                    logoPreview,
                    signaturePreview,
                };
                if (typeof window !== 'undefined') {
                    localStorage.setItem(storageKey, JSON.stringify(stateToSave));
                }

                // Save company data separately for future sessions
                if (userInputs.exporter_company_name) {
                    const companyDataToSave = {
                        company_name: userInputs.exporter_company_name,
                        comp_reg_address: userInputs.exporter_address,
                        gstin: userInputs.exporter_gstin
                    };
                    const companyDataKey = `manudocs.companyData.${user?.id || 'guest'}`;
                    localStorage.setItem(companyDataKey, JSON.stringify(companyDataToSave));
                }
            } catch (error) {
                console.warn('Error saving chat state:', error);
            }
        };

        saveState();
    }, [
        messages, currentStep, initialized, selectedTemplates, companyData,
        userInputs, currentQuestion, awaitingInput, generatedDocuments,
        activeDocIndex, showContinueButton, products, packingInfo,
        logoPreview, signaturePreview, storageKey, user?.id
    ]);

    useEffect(() => {
        // Apply background to all main containers
        const applyBackgrounds = () => {
            const containers = document.querySelectorAll('.bg-gray-800, .bg-gray-900, [class*="overflow"]');
            containers.forEach(container => {
                container.style.backgroundColor = '#1f2937';
                container.style.backgroundImage = 'none';
            });
        };

        applyBackgrounds();

        // Re-apply on resize or scroll (if needed)
        window.addEventListener('resize', applyBackgrounds);
        return () => window.removeEventListener('resize', applyBackgrounds);
    }, []);

    // Initialize the chat
    useEffect(() => {
        if (initialized) return;

        if (!documentsUploaded) {
            setMessages([{
                id: 1,
                type: 'bot',
                content: '⚠️ Please upload your identity and company documents first to use the AI Agent.',
                timestamp: new Date(),
                showUploadButton: true
            }]);
            setCurrentStep('need_documents');
            setInitialized(true);
            return;
        }

        setTimeout(() => {
            setMessages([
                {
                    id: 1,
                    type: 'bot',
                    content: '🌍 Hello! Welcome to ManuDocs Export Document Assistant! 🤖\n\nI specialize in generating professional international trade documents.',
                    timestamp: new Date()
                },
                {
                    id: 2,
                    type: 'bot',
                    content: 'Please select the export documents you want to generate. I will ask only the necessary questions for your selected documents.',
                    timestamp: new Date(),
                    showTemplateSelector: true
                }
            ]);
            setCurrentStep('template_selection');
            setInitialized(true);
        }, 1000);
    }, [documentsUploaded, initialized]);

    // Handle template selection
    const handleTemplateSelection = (templateId, isSelected) => {
        setSelectedTemplates(prev => {
            if (isSelected) {
                return [...prev, { id: templateId, name: getTemplateName(templateId) }];
            } else {
                return prev.filter(t => t.id !== templateId);
            }
        });
    };

    const getTemplateName = (templateId) => {
        const templateNames = {
            commercial_invoice: 'Commercial Invoice',
            proforma_invoice: 'Proforma Invoice',
            packing_list: 'Packing List',
            delivery_challan: 'Delivery Challan',
            credit_note: 'Credit Note',
            debit_note: 'Debit Note',
            certificate_of_origin: 'Certificate of Origin',
            bill_of_lading: 'Bill of Lading',
            shipping_instructions: 'Shipping Instructions',
            export_declaration: 'Export Declaration',
            air_waybill: 'Air Waybill',
            insurance_certificate: 'Insurance Certificate',
            quotation: 'Quotation'
        };
        return templateNames[templateId] || templateId;
    };

    const handleStartProcess = () => {
        if (selectedTemplates.length === 0) {
            alert('Please select at least one document to generate.');
            return;
        }

        const selectedDocNames = selectedTemplates.map(t => t.name).join(', ');

        setMessages(prev => [...prev, {
            id: generateUniqueId(),
            type: 'user',
            content: `Start generating: ${selectedDocNames}`,
            timestamp: new Date()
        }]);

        setCurrentStep('data_collection');
        setCurrentQuestion(0);
        setAwaitingInput(false);

        setTimeout(() => {
            askNextQuestion();
        }, 100);
    };

    // Continue button handler
    const handleContinueClick = useCallback(() => {
        setShowContinueButton(false);
        setCurrentStep('data_collection');
        setCurrentQuestion(0);
        setAwaitingInput(false);

        setTimeout(() => {
            askNextQuestion();
        }, 100);
    }, [askNextQuestion]);

    // Auto-ask next question
    useEffect(() => {
        console.log('Auto-ask effect - currentStep:', currentStep, 'awaitingInput:', awaitingInput, 'currentQuestion:', currentQuestion);

        if (currentStep === 'data_collection' && !awaitingInput && currentQuestion < questions.length) {
            console.log('Auto-asking next question...');
            const timer = setTimeout(() => {
                askNextQuestion();
            }, 100);
            return () => clearTimeout(timer);
        }

        // If we've completed all questions but documents aren't generated, trigger completion
        if (currentStep === 'data_collection' && !awaitingInput && currentQuestion >= questions.length) {
            console.log('All questions completed, triggering document generation');
            completeDataCollection();
        }
    }, [currentStep, currentQuestion, awaitingInput, askNextQuestion, questions.length, completeDataCollection]);

    // Handle product addition
    const handleAddProduct = () => {
        if (!currentProduct.product_code || !currentProduct.description || !currentProduct.quantity || !currentProduct.unit_price) {
            alert('Please fill in all required product details: Product Code, Description, Quantity, and Unit Price.');
            return;
        }

        const totalAmount = (parseFloat(currentProduct.quantity) * parseFloat(currentProduct.unit_price)).toFixed(2);
        const newProduct = {
            ...currentProduct,
            id: generateUniqueId(),
            total_amount: totalAmount
        };

        setProducts(prev => [...prev, newProduct]);

        const productSummary = `Added: ${newProduct.product_code} - ${newProduct.description} | Qty: ${newProduct.quantity} ${newProduct.unit} | Price: ${newProduct.unit_price} | Total: ${totalAmount}`;
        setMessages(prev => [...prev, {
            id: generateUniqueId(),
            type: 'user',
            content: productSummary,
            timestamp: new Date()
        }]);

        // Reset current product form
        setCurrentProduct({
            product_code: '',
            description: '',
            hs_code: '',
            unit: 'PCS',
            quantity: '',
            unit_price: '',
            total_amount: ''
        });
    };

    const handleFinishProducts = () => {
        if (products.length === 0) {
            alert("Please add at least one product before finishing.");
            return;
        }

        const productsSummary = `Added ${products.length} product(s):\n${products.map((p, i) => `${i + 1}. ${p.product_code} - ${p.description} (${p.quantity} ${p.unit})`).join('\n')}`;

        // Add user message with products summary
        setMessages(prev => [...prev, {
            id: generateUniqueId(),
            type: 'user',
            content: productsSummary,
            timestamp: new Date()
        }]);

        // Update the products field in userInputs
        setUserInputs(prev => ({
            ...prev,
            products: products
        }));

        // Mark the products question as answered
        setMessages(prevMessages =>
            prevMessages.map(msg =>
                msg.showInput && msg.expectedField === 'products'
                    ? { ...msg, showInput: false, inputDisabled: true, userAnswer: `Added ${products.length} product(s)` }
                    : msg
            )
        );

        setAwaitingInput(false);

        // Move to next question after products
        const nextIndex = currentQuestion + 1;
        console.log('Moving from products to next question index:', nextIndex);
        setCurrentQuestion(nextIndex);
    };

    // Handle packing info addition
    const handleAddPackingInfo = () => {
        if (!currentPacking.product_index || !currentPacking.number_of_packages || !currentPacking.net_weight || !currentPacking.gross_weight) {
            alert('Please fill in all required packing details: Product Reference, Number of Packages, Net Weight, and Gross Weight.');
            return;
        }

        const newPacking = {
            ...currentPacking,
            id: generateUniqueId(),
            measurements: `${currentPacking.length || ''}×${currentPacking.width || ''}×${currentPacking.height || ''}`
        };

        setPackingInfo(prev => [...prev, newPacking]);

        const packingSummary = `Added packing for Product ${currentPacking.product_index}: ${currentPacking.kind_of_packages} × ${currentPacking.number_of_packages} | Net: ${currentPacking.net_weight}Kg | Gross: ${currentPacking.gross_weight}Kg`;
        setMessages(prev => [...prev, {
            id: generateUniqueId(),
            type: 'user',
            content: packingSummary,
            timestamp: new Date()
        }]);

        setCurrentPacking({
            product_index: '',
            kind_of_packages: 'Carton',
            number_of_packages: '',
            net_weight: '',
            gross_weight: '',
            length: '',
            width: '',
            height: ''
        });
    };

    const handleFinishPacking = () => {
        if (packingInfo.length === 0) {
            alert("Please add at least one packing entry before finishing.");
            return;
        }

        const packingSummary = `Added ${packingInfo.length} packing entries`;
        setMessages(prev => [...prev, {
            id: generateUniqueId(),
            type: 'user',
            content: packingSummary,
            timestamp: new Date()
        }]);

        // Update the packing_info field in userInputs
        setUserInputs(prev => ({
            ...prev,
            packing_info: packingInfo
        }));

        setMessages(prevMessages =>
            prevMessages.map(msg =>
                msg.showInput && msg.expectedField === 'packing_info'
                    ? { ...msg, showInput: false, inputDisabled: true, userAnswer: `Added ${packingInfo.length} packing entries` }
                    : msg
            )
        );

        setAwaitingInput(false);

        // Move to next question after packing
        const nextIndex = currentQuestion + 1;
        console.log('Moving from packing to next question index:', nextIndex);
        setCurrentQuestion(nextIndex);
    };

    // Download functions
    const downloadAllPdfs = async () => {
        if (generatedDocuments.length === 0) {
            alert("No documents generated to download.");
            return;
        }

        try {
            for (const doc of generatedDocuments) {
                // Create a temporary container
                const container = document.createElement('div');
                container.style.width = '794px';
                container.style.padding = '20px';
                container.style.backgroundColor = 'white';
                container.style.position = 'absolute';
                container.style.left = '-9999px';
                container.style.top = '0';

                document.body.appendChild(container);

                try {
                    // Get current data with edits applied
                    const currentData = getCurrentDocumentData();

                    const templateElement = renderTemplateComponent(doc.id, {
                        ...doc.props,
                        ...currentData
                    });

                    if (ReactDOM.createRoot) {
                        const root = ReactDOM.createRoot(container);
                        root.render(templateElement);
                    } else {
                        ReactDOM.render(templateElement, container);
                    }

                    // Wait for rendering to complete
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    // Use html2canvas to capture the content
                    const canvas = await html2canvas(container, {
                        scale: 2,
                        useCORS: true,
                        allowTaint: false,
                        width: 794,
                        windowWidth: 794,
                        logging: false
                    });

                    const imgData = canvas.toDataURL('image/png');
                    const pdf = new jsPDF({
                        orientation: 'portrait',
                        unit: 'mm',
                        format: 'a4'
                    });

                    const imgWidth = 210; // A4 width in mm
                    const pageHeight = 295; // A4 height in mm
                    const imgHeight = (canvas.height * imgWidth) / canvas.width;

                    let heightLeft = imgHeight;
                    let position = 0;

                    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;

                    while (heightLeft >= 0) {
                        position = heightLeft - imgHeight;
                        pdf.addPage();
                        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                        heightLeft -= pageHeight;
                    }

                    pdf.save(`${doc.name.replace(/\s+/g, '_')}.pdf`);
                } finally {
                    // Always remove the container
                    if (document.body.contains(container)) {
                        document.body.removeChild(container);
                    }
                }
            }

            alert(`✅ ${generatedDocuments.length} professional export documents downloaded successfully!`);
        } catch (error) {
            console.error('Error downloading PDFs:', error);
            alert('❌ Error downloading documents. Please try again.');
        }
    };

    const downloadIndividualPdf = async (docIndex) => {
        if (generatedDocuments.length === 0) {
            alert("No documents generated to download.");
            return;
        }

        const doc = generatedDocuments[docIndex];

        try {
            // Create a temporary container
            const container = document.createElement('div');
            container.style.width = '794px';
            container.style.padding = '20px';
            container.style.backgroundColor = 'white';
            container.style.position = 'absolute';
            container.style.left = '-9999px';
            container.style.top = '0';
            container.style.fontFamily = 'Arial, sans-serif';

            document.body.appendChild(container);

            try {
                // Get current data with edits
                const currentData = getCurrentDocumentData();

                console.log('📥 Downloading PDF with data:', currentData);

                // Render the template component with current data
                const templateElement = renderTemplateComponent(doc.id, {
                    ...doc.props,
                    ...currentData
                });

                if (ReactDOM.createRoot) {
                    const root = ReactDOM.createRoot(container);
                    root.render(templateElement);
                } else {
                    ReactDOM.render(templateElement, container);
                }

                // Wait for rendering to complete
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Use html2canvas to capture the content
                const canvas = await html2canvas(container, {
                    scale: 2,
                    useCORS: true,
                    allowTaint: false,
                    width: 794,
                    windowWidth: 794,
                    logging: false,
                    backgroundColor: '#ffffff'
                });

                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4'
                });

                const imgWidth = 210; // A4 width in mm
                const pageHeight = 295; // A4 height in mm
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                let heightLeft = imgHeight;
                let position = 0;

                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }

                pdf.save(`${doc.name.replace(/\s+/g, '_')}.pdf`);

                alert(`✅ ${doc.name} downloaded successfully with all edits!`);
            } finally {
                // Always remove the container
                if (document.body.contains(container)) {
                    document.body.removeChild(container);
                }
            }
        } catch (error) {
            console.error('Error downloading PDF:', error);
            alert(`❌ Error downloading ${doc.name}. Please try again.`);
        }
    };

    // Email webhook function
    const sendPdfViaEmail = async () => {
        if (generatedDocuments.length === 0) {
            alert("No documents generated to send.");
            return;
        }

        setIsSendingEmail(true);

        try {
            const userEmail = user?.email || user?.user_metadata?.email || 'unknown@example.com';
            console.log('Generating combined PDF and sending via email webhook for user:', userEmail);

            const pdf = new jsPDF('p', 'pt', 'a4');
            let currentPage = 0;

            for (let i = 0; i < generatedDocuments.length; i++) {
                const doc = generatedDocuments[i];
                const container = document.createElement('div');
                container.style.position = 'fixed';
                container.style.left = '-9999px';
                container.style.width = '794px';
                container.style.padding = '20px';
                container.style.backgroundColor = 'white';

                document.body.appendChild(container);

                try {
                    // Get current data with edits
                    const currentData = getCurrentDocumentData();

                    // Render the template component with updated data
                    const templateElement = renderTemplateComponent(doc.id, {
                        ...doc.props,
                        ...currentData
                    });

                    if (ReactDOM.createRoot) {
                        const root = ReactDOM.createRoot(container);
                        root.render(templateElement);
                    } else {
                        ReactDOM.render(templateElement, container);
                    }

                    // Wait for rendering
                    await new Promise(resolve => setTimeout(resolve, 500));

                    const canvas = await html2canvas(container, {
                        scale: 1.5,
                        useCORS: true,
                        allowTaint: false,
                        width: 794,
                        windowWidth: 794,
                        logging: false
                    });

                    const imgData = canvas.toDataURL('image/jpeg', 0.7);
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

                    if (currentPage > 0) {
                        pdf.addPage();
                    }

                    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
                    pdf.setFontSize(12);
                    pdf.setTextColor(100);
                    pdf.text(`Document: ${doc.name || 'Untitled'}`, 40, 30);
                    pdf.text(`Page ${currentPage + 1}`, pdfWidth - 60, 30);
                    currentPage++;
                } finally {
                    if (document.body.contains(container)) {
                        document.body.removeChild(container);
                    }
                }
            }

            const pdfArrayBuffer = pdf.output('arraybuffer');
            const uint8Array = new Uint8Array(pdfArrayBuffer);
            let binaryString = '';
            const chunkSize = 8192;

            for (let i = 0; i < uint8Array.length; i += chunkSize) {
                const chunk = uint8Array.subarray(i, i + chunkSize);
                binaryString += String.fromCharCode.apply(null, chunk);
            }

            const pdfBase64 = btoa(binaryString);
            const pdfDataArray = [{
                filename: `Export_Documents_${new Date().toISOString().split('T')[0]}.pdf`,
                base64Data: pdfBase64,
                mimetype: 'application/pdf',
                size: pdfArrayBuffer.byteLength,
                documentType: 'combined',
                documentName: 'All Export Documents'
            }];

            const webhookUrl = 'https://snobbily-tombless-louisa.ngrok-free.dev/webhook/60c9760c-650d-471c-9d4f-e7d4e362980f';
            const payload = {
                action: 'send_email',
                userEmail: userEmail,
                documents: generatedDocuments.map(doc => ({
                    name: doc.name,
                    type: doc.type,
                    content: doc.content
                })),
                pdfFiles: pdfDataArray,
                companyData: companyData,
                userInputs: getCurrentDocumentData(),
                timestamp: new Date().toISOString(),
                documentCount: generatedDocuments.length,
                isCombined: true
            };

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 60000);

            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                alert(`✅ ${generatedDocuments.length} documents combined and sent successfully via email!`);
                console.log('Successfully sent combined PDF to webhook');
            } else {
                console.error('Webhook response error:', response.status, response.statusText);
                alert('❌ Failed to send documents via webhook. Check console for details.');
            }
        } catch (error) {
            console.error('Error sending combined PDF via webhook:', error);
            if (error.name === 'AbortError') {
                alert('❌ Request timed out. Please try again.');
            } else {
                alert('❌ Error sending documents. Check console for details.');
            }
        } finally {
            setIsSendingEmail(false);
        }
    };

    const handleSendMessage = useCallback(() => {
        if (!userMessage.trim()) return;

        const newMessage = {
            id: generateUniqueId(),
            type: 'user',
            content: userMessage,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newMessage]);
        setUserMessage('');

        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: generateUniqueId(),
                type: 'bot',
                content: 'I understand. Let me continue with the export document generation process.',
                timestamp: new Date()
            }]);
        }, 1000);
    }, [userMessage, generateUniqueId]);

    // New Edit Functionality
    const startEditing = useCallback(() => {
        // Initialize edit data with current user inputs
        const currentData = getCurrentDocumentData();
        setEditData(currentData);
        setIsEditing(true);
        setActiveEditTab('exporter');
    }, [getCurrentDocumentData]);

    const handleEditFieldChange = useCallback((field, value) => {
        setEditData(prev => ({
            ...prev,
            [field]: value
        }));
    }, []);

    const handleSaveEdits = useCallback(() => {
        // Update the main userInputs with edited data
        const updatedData = { ...editData };

        // Remove internal fields that shouldn't be in userInputs
        const { products: editProducts, packing_info: editPacking, ...restEditData } = updatedData;

        setUserInputs(restEditData);

        // Update products and packing if they were edited
        if (editProducts) {
            setProducts(editProducts);
        }
        if (editPacking) {
            setPackingInfo(editPacking);
        }

        // Regenerate documents with updated data
        const finalData = getCurrentDocumentData();

        const companyDataForRegen = {
            company_name: restEditData.exporter_company_name || userInputs.exporter_company_name,
            comp_reg_address: restEditData.exporter_address || userInputs.exporter_address,
            gstin: restEditData.exporter_gstin || userInputs.exporter_gstin
        };

        try {
            const updatedGeneratedDocs = generateDocuments(selectedTemplates, companyDataForRegen, finalData);
            setGeneratedDocuments(updatedGeneratedDocs);

            setIsEditing(false);
            alert('✅ Changes saved successfully! Your documents have been updated.');
        } catch (error) {
            console.error('Error regenerating documents:', error);
            alert('❌ Error updating documents. Please try again.');
        }
    }, [editData, userInputs, getCurrentDocumentData, selectedTemplates]);

    const cancelEditing = useCallback(() => {
        setIsEditing(false);
        setEditData({});
    }, []);

    // Render edit form based on active tab
    const renderEditForm = () => {
        const categoryQuestions = questionsByCategory[activeEditTab] || [];

        return (
            <div className="space-y-4 max-h-96 overflow-y-auto">
                {categoryQuestions.map((question) => {
                    if (question.condition) {
                        const conditionField = question.condition.field;
                        const conditionValue = question.condition.value;
                        if (editData[conditionField] !== conditionValue) {
                            return null;
                        }
                    }

                    return (
                        <div key={question.field} className="space-y-2">
                            <label className="block text-sm font-medium text-white">
                                {question.question}
                                {question.required && <span className="text-red-400 ml-1">*</span>}
                            </label>

                            {question.type === 'text' && (
                                <input
                                    type="text"
                                    value={editData[question.field] || ''}
                                    onChange={(e) => handleEditFieldChange(question.field, e.target.value)}
                                    className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
                                    placeholder={`Enter ${question.field.replace(/_/g, ' ')}...`}
                                />
                            )}

                            {question.type === 'textarea' && (
                                <textarea
                                    value={editData[question.field] || ''}
                                    onChange={(e) => handleEditFieldChange(question.field, e.target.value)}
                                    className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
                                    rows="3"
                                    placeholder={`Enter ${question.field.replace(/_/g, ' ')}...`}
                                />
                            )}

                            {question.type === 'select' && (
                                <select
                                    value={editData[question.field] || ''}
                                    onChange={(e) => handleEditFieldChange(question.field, e.target.value)}
                                    className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
                                >
                                    <option value="">Select an option</option>
                                    {question.options?.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            )}

                            {question.type === 'date' && (
                                <input
                                    type="date"
                                    value={editData[question.field] || ''}
                                    onChange={(e) => handleEditFieldChange(question.field, e.target.value)}
                                    className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
                                />
                            )}
                        </div>
                    );
                })}

                {/* Products editing */}
                {activeEditTab === 'products' && (
                    <div className="space-y-4">
                        <h4 className="font-semibold text-white">Products</h4>
                        {editData.products?.map((product, index) => (
                            <div key={product.id || index} className="p-3 border border-gray-600 rounded bg-gray-700">
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={product.product_code || ''}
                                        onChange={(e) => {
                                            const newProducts = [...editData.products];
                                            newProducts[index] = {
                                                ...newProducts[index],
                                                product_code: e.target.value,
                                                total_amount: (parseFloat(newProducts[index].quantity) || 0) * (parseFloat(newProducts[index].unit_price) || 0)
                                            };
                                            handleEditFieldChange('products', newProducts);
                                        }}
                                        className="p-2 border border-gray-600 rounded bg-gray-800 text-white text-sm"
                                        placeholder="Product Code"
                                    />
                                    <input
                                        type="text"
                                        value={product.hs_code || ''}
                                        onChange={(e) => {
                                            const newProducts = [...editData.products];
                                            newProducts[index] = { ...newProducts[index], hs_code: e.target.value };
                                            handleEditFieldChange('products', newProducts);
                                        }}
                                        className="p-2 border border-gray-600 rounded bg-gray-800 text-white text-sm"
                                        placeholder="HS Code"
                                    />
                                </div>
                                <textarea
                                    value={product.description || ''}
                                    onChange={(e) => {
                                        const newProducts = [...editData.products];
                                        newProducts[index] = { ...newProducts[index], description: e.target.value };
                                        handleEditFieldChange('products', newProducts);
                                    }}
                                    className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white text-sm mb-2"
                                    placeholder="Description"
                                    rows="2"
                                />
                                <div className="grid grid-cols-3 gap-2">
                                    <input
                                        type="number"
                                        value={product.quantity || ''}
                                        onChange={(e) => {
                                            const newProducts = [...editData.products];
                                            newProducts[index] = {
                                                ...newProducts[index],
                                                quantity: e.target.value,
                                                total_amount: (parseFloat(e.target.value) || 0) * (parseFloat(newProducts[index].unit_price) || 0)
                                            };
                                            handleEditFieldChange('products', newProducts);
                                        }}
                                        className="p-2 border border-gray-600 rounded bg-gray-800 text-white text-sm"
                                        placeholder="Quantity"
                                    />
                                    <select
                                        value={product.unit || 'PCS'}
                                        onChange={(e) => {
                                            const newProducts = [...editData.products];
                                            newProducts[index] = { ...newProducts[index], unit: e.target.value };
                                            handleEditFieldChange('products', newProducts);
                                        }}
                                        className="p-2 border border-gray-600 rounded bg-gray-800 text-white text-sm"
                                    >
                                        <option value="PCS">PCS</option>
                                        <option value="KG">KG</option>
                                        <option value="M">M</option>
                                        <option value="M²">M²</option>
                                        <option value="M³">M³</option>
                                        <option value="L">L</option>
                                        <option value="SET">SET</option>
                                        <option value="BOX">BOX</option>
                                        <option value="CARTON">CARTON</option>
                                    </select>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={product.unit_price || ''}
                                        onChange={(e) => {
                                            const newProducts = [...editData.products];
                                            newProducts[index] = {
                                                ...newProducts[index],
                                                unit_price: e.target.value,
                                                total_amount: (parseFloat(newProducts[index].quantity) || 0) * (parseFloat(e.target.value) || 0)
                                            };
                                            handleEditFieldChange('products', newProducts);
                                        }}
                                        className="p-2 border border-gray-600 rounded bg-gray-800 text-white text-sm"
                                        placeholder="Unit Price"
                                    />
                                </div>
                                {product.total_amount && (
                                    <div className="mt-2 text-sm text-green-400">
                                        Total: {product.total_amount}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Packing info editing */}
                {activeEditTab === 'packing' && (
                    <div className="space-y-4">
                        <h4 className="font-semibold text-white">Packing Information</h4>
                        {editData.packing_info?.map((packing, index) => (
                            <div key={packing.id || index} className="p-3 border border-gray-600 rounded bg-gray-700">
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                    <select
                                        value={packing.product_index || ''}
                                        onChange={(e) => {
                                            const newPacking = [...editData.packing_info];
                                            newPacking[index] = { ...newPacking[index], product_index: e.target.value };
                                            handleEditFieldChange('packing_info', newPacking);
                                        }}
                                        className="p-2 border border-gray-600 rounded bg-gray-800 text-white text-sm"
                                    >
                                        <option value="">Select Product</option>
                                        {editData.products?.map((product, prodIndex) => (
                                            <option key={prodIndex} value={prodIndex + 1}>
                                                {product.product_code} - {product.description}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        value={packing.kind_of_packages || 'Carton'}
                                        onChange={(e) => {
                                            const newPacking = [...editData.packing_info];
                                            newPacking[index] = { ...newPacking[index], kind_of_packages: e.target.value };
                                            handleEditFieldChange('packing_info', newPacking);
                                        }}
                                        className="p-2 border border-gray-600 rounded bg-gray-800 text-white text-sm"
                                    >
                                        <option value="Carton">Carton</option>
                                        <option value="Box">Box</option>
                                        <option value="Crate">Crate</option>
                                        <option value="Drum">Drum</option>
                                        <option value="Bag">Bag</option>
                                        <option value="Pallet">Pallet</option>
                                        <option value="Bundle">Bundle</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-3 gap-2 mb-2">
                                    <input
                                        type="number"
                                        value={packing.number_of_packages || ''}
                                        onChange={(e) => {
                                            const newPacking = [...editData.packing_info];
                                            newPacking[index] = { ...newPacking[index], number_of_packages: e.target.value };
                                            handleEditFieldChange('packing_info', newPacking);
                                        }}
                                        className="p-2 border border-gray-600 rounded bg-gray-800 text-white text-sm"
                                        placeholder="No. of Packages"
                                    />
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={packing.net_weight || ''}
                                        onChange={(e) => {
                                            const newPacking = [...editData.packing_info];
                                            newPacking[index] = { ...newPacking[index], net_weight: e.target.value };
                                            handleEditFieldChange('packing_info', newPacking);
                                        }}
                                        className="p-2 border border-gray-600 rounded bg-gray-800 text-white text-sm"
                                        placeholder="Net Weight (Kg)"
                                    />
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={packing.gross_weight || ''}
                                        onChange={(e) => {
                                            const newPacking = [...editData.packing_info];
                                            newPacking[index] = { ...newPacking[index], gross_weight: e.target.value };
                                            handleEditFieldChange('packing_info', newPacking);
                                        }}
                                        className="p-2 border border-gray-600 rounded bg-gray-800 text-white text-sm"
                                        placeholder="Gross Weight (Kg)"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    // Render document preview with current data
    const renderDocumentPreview = () => {
        if (generatedDocuments.length === 0 || !generatedDocuments[activeDocIndex]) {
            return (
                <div className="h-full flex items-center justify-center text-gray-500">
                    Documents will appear here after generation
                </div>
            );
        }

        const currentData = getCurrentDocumentData();
        const doc = generatedDocuments[activeDocIndex];

        return (
            <div className="w-full h-full">
                {renderTemplateComponent(doc.id, {
                    ...doc.props,
                    ...currentData
                })}
            </div>
        );
    };

    // Template selection component
    const renderTemplateSelector = () => {
        const templates = [
            { id: 'commercial_invoice', name: 'Commercial Invoice', desc: 'Main international trade invoice with compliance details', icon: '📄' },
            { id: 'proforma_invoice', name: 'Proforma Invoice', desc: 'Quotation document for international buyers', icon: '📋' },
            { id: 'packing_list', name: 'Packing List', desc: 'Detailed packaging and shipping information', icon: '📦' },
            { id: 'delivery_challan', name: 'Delivery Challan', desc: 'Proof of goods delivery', icon: '🚚' },
            { id: 'credit_note', name: 'Credit Note', desc: 'Reduce amount in original invoice', icon: '💳' },
            { id: 'debit_note', name: 'Debit Note', desc: 'Increase amount in original invoice', icon: '💳' },
            { id: 'certificate_of_origin', name: 'Certificate of Origin', desc: 'Certify goods origin for customs', icon: '🌍' },
            { id: 'bill_of_lading', name: 'Bill of Lading', desc: 'Contract between shipper and carrier', icon: '📑' },
            { id: 'shipping_instructions', name: 'Shipping Instructions', desc: 'Instructions to freight forwarder', icon: '📝' },
            { id: 'export_declaration', name: 'Export Declaration', desc: 'Customs declaration for export', icon: '🏛️' },
            { id: 'air_waybill', name: 'Air Waybill', desc: 'Air freight contract', icon: '✈️' },
            { id: 'insurance_certificate', name: 'Insurance Certificate', desc: 'Proof of shipment insurance', icon: '🛡️' },
            { id: 'quotation', name: 'Quotation', desc: 'Price quote for potential buyer', icon: '💰' }
        ];

        return (
            <div className="mt-4 space-y-4">
                <div className="text-sm text-gray-300 mb-4">
                    Select the documents you want to generate. I will ask only the necessary questions for your selected documents.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                    {templates.map((template) => (
                        <label
                            key={template.id}
                            className={`flex items-start space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${selectedTemplates.some(t => t.id === template.id)
                                ? 'border-manu-green bg-green-900/20'
                                : 'border-gray-600 bg-gray-700 hover:bg-gray-600'
                                }`}
                        >
                            <input
                                type="checkbox"
                                checked={selectedTemplates.some(t => t.id === template.id)}
                                onChange={(e) => handleTemplateSelection(template.id, e.target.checked)}
                                className="mt-1 rounded border-gray-600 bg-gray-700 text-manu-green focus:ring-manu-green"
                            />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2">
                                    <span className="text-lg">{template.icon}</span>
                                    <div className="font-medium text-white text-sm">{template.name}</div>
                                </div>
                                <div className="text-xs text-gray-300 mt-1">{template.desc}</div>
                            </div>
                        </label>
                    ))}
                </div>

                {selectedTemplates.length > 0 && (
                    <div className="mt-4 p-3 bg-gray-700 rounded-lg">
                        <div className="text-sm font-medium text-white mb-2">
                            Selected Documents ({selectedTemplates.length}):
                        </div>
                        <div className="text-xs text-gray-300">
                            {selectedTemplates.map(t => t.name).join(', ')}
                        </div>
                    </div>
                )}

                <button
                    className={`w-full mt-4 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${selectedTemplates.length === 0
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-manu-green text-white hover:bg-green-600'
                        }`}
                    onClick={handleStartProcess}
                    disabled={selectedTemplates.length === 0}
                >
                    {selectedTemplates.length === 0
                        ? 'Please select at least one document'
                        : `Start Generating ${selectedTemplates.length} Document${selectedTemplates.length > 1 ? 's' : ''}`
                    }
                </button>
            </div>
        );
    };

    return (
        <div
            className="min-h-screen bg-gray-900 text-white"
            style={{
                backgroundColor: '#1f2937',
                background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
                minHeight: '100vh'
            }}
        >
            <Header
                user={user}
                onPageChange={onPageChange}
                onLogout={onLogout}
                documentsUploaded={documentsUploaded}
            />

            <div className="pt-16 h-screen flex flex-col md:flex-row">
                {/* Left Panel - Chat Interface */}
                <div className="w-full md:w-1/2 bg-gray-800 border-r border-gray-700 flex flex-col">
                    <div className="p-4 border-b border-gray-700 bg-gray-900">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                                <MessageCircle className="text-manu-green" size={20} />
                            </div>
                            <div>
                                <h3 className="font-semibold">Export Document Assistant</h3>
                                <p className="text-sm opacity-90">
                                    {selectedTemplates.length > 0
                                        ? `${selectedTemplates.length} Document${selectedTemplates.length > 1 ? 's' : ''} Selected`
                                        : 'Select Documents to Generate'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[80%] rounded-lg p-3 ${message.type === 'user'
                                    ? 'bg-manu-green text-white'
                                    : 'bg-gray-700 text-gray-100'
                                    }`}>
                                    <div className="whitespace-pre-wrap">{message.content}</div>

                                    {/* Template Selector */}
                                    {message.showTemplateSelector && renderTemplateSelector()}

                                    {/* Continue Button */}
                                    {message.showContinueButton && showContinueButton && (
                                        <button
                                            onClick={handleContinueClick}
                                            className="mt-3 bg-manu-green text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
                                        >
                                            Continue to Export Questions
                                        </button>
                                    )}

                                    {/* Upload Documents Button */}
                                    {message.showUploadButton && (
                                        <button
                                            onClick={() => onPageChange('upload')}
                                            className="mt-3 bg-manu-green text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
                                        >
                                            Upload Company Documents
                                        </button>
                                    )}

                                    {/* Input Fields */}
                                    {message.showInput && awaitingInput && (
                                        <div className="mt-4">
                                            {/* Skip Button for non-required questions */}
                                            {message.showSkip && (
                                                <button
                                                    onClick={skipCurrentQuestion}
                                                    className="mb-3 flex items-center gap-2 px-3 py-1 text-xs bg-gray-600 text-gray-300 rounded hover:bg-gray-500 transition-colors"
                                                >
                                                    <SkipForward size={12} />
                                                    Skip this question
                                                </button>
                                            )}

                                            {/* File Input */}
                                            {message.inputType === 'file' && (
                                                <div className="space-y-2">
                                                    <input
                                                        type="file"
                                                        accept={message.accept}
                                                        className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
                                                        onChange={(e) => {
                                                            const file = e.target.files[0];
                                                            if (file) {
                                                                if (file.size > 2 * 1024 * 1024) {
                                                                    alert('File size must be less than 2MB');
                                                                    return;
                                                                }
                                                                handleUserInput(file.name, message.expectedField, file);
                                                            }
                                                        }}
                                                    />
                                                    <p className="text-xs text-gray-400">Max file size: 2MB</p>
                                                </div>
                                            )}

                                            {/* Text Input */}
                                            {['text', 'email', 'number'].includes(message.inputType) && (
                                                <div className="space-y-2">
                                                    <input
                                                        type={message.inputType}
                                                        placeholder={`Enter ${message.expectedField.replace(/_/g, ' ')}...`}
                                                        className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400"
                                                        autoFocus
                                                        value={pendingInput}
                                                        onChange={(e) => {
                                                            setPendingInput(e.target.value);
                                                            setCurrentInputField(message.expectedField);
                                                            setShowConfirmButton(true);
                                                        }}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' && e.target.value.trim()) {
                                                                e.preventDefault();
                                                                handleUserInput(e.target.value.trim(), message.expectedField);
                                                                setPendingInput('');
                                                                setShowConfirmButton(false);
                                                            }
                                                        }}
                                                    />
                                                    {/* Show autofill message if available */}
                                                    {message.autofillValue && (
                                                        <p className="text-xs text-green-400">
                                                            💡 Pre-filled from your previous sessions. You can edit this if needed.
                                                        </p>
                                                    )}
                                                    {showConfirmButton && (
                                                        <button
                                                            onClick={handleConfirmInput}
                                                            className="w-full bg-manu-green text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
                                                        >
                                                            {message.autofillValue ? 'Confirm & Continue' : 'Send Answer'}
                                                        </button>
                                                    )}
                                                </div>
                                            )}

                                            {/* Textarea Input */}
                                            {message.inputType === 'textarea' && (
                                                <div className="space-y-2">
                                                    <textarea
                                                        placeholder={`Enter ${message.expectedField.replace(/_/g, ' ')}...`}
                                                        rows="3"
                                                        className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400"
                                                        autoFocus
                                                        value={pendingInput}
                                                        onChange={(e) => {
                                                            setPendingInput(e.target.value);
                                                            setCurrentInputField(message.expectedField);
                                                            setShowConfirmButton(true);
                                                        }}
                                                    ></textarea>
                                                    {/* Show autofill message if available */}
                                                    {message.autofillValue && (
                                                        <p className="text-xs text-green-400">
                                                            💡 Pre-filled from your previous sessions. You can edit this if needed.
                                                        </p>
                                                    )}
                                                    {showConfirmButton && (
                                                        <button
                                                            onClick={handleConfirmInput}
                                                            className="w-full bg-manu-green text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
                                                        >
                                                            {message.autofillValue ? 'Confirm & Continue' : 'Send Answer'}
                                                        </button>
                                                    )}
                                                </div>
                                            )}

                                            {/* Select Input */}
                                            {message.inputType === 'select' && (
                                                <div className="space-y-2">
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {message.inputOptions?.map((option) => (
                                                            <button
                                                                key={option}
                                                                onClick={() => handleUserInput(option, message.expectedField)}
                                                                className="p-2 border border-gray-600 rounded-lg hover:bg-gray-700 text-sm hover:border-manu-green text-white"
                                                            >
                                                                {option}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {message.inputType === 'multiselect' && (
                                                <div className="space-y-2">
                                                    <div className="grid grid-cols-1 gap-2">
                                                        {message.inputOptions?.map((option) => (
                                                            <label key={option} className="flex items-center space-x-2 p-2 border border-gray-600 rounded-lg hover:bg-gray-700 cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    value={option}
                                                                    onChange={(e) => {
                                                                        const currentValues = pendingInput ? pendingInput.split(', ') : [];
                                                                        if (e.target.checked) {
                                                                            currentValues.push(option);
                                                                        } else {
                                                                            const index = currentValues.indexOf(option);
                                                                            if (index > -1) currentValues.splice(index, 1);
                                                                        }
                                                                        setPendingInput(currentValues.join(', '));
                                                                        setShowConfirmButton(currentValues.length > 0);
                                                                    }}
                                                                    className="rounded border-gray-600 bg-gray-700 text-manu-green focus:ring-manu-green"
                                                                />
                                                                <span className="text-sm text-white">{option}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                    {showConfirmButton && (
                                                        <button
                                                            onClick={handleConfirmInput}
                                                            className="w-full bg-manu-green text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
                                                        >
                                                            Confirm Selection
                                                        </button>
                                                    )}
                                                </div>
                                            )}

                                            {/* Date Input */}
                                            {message.inputType === 'date' && (
                                                <div className="space-y-2">
                                                    <input
                                                        type="date"
                                                        className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
                                                        autoFocus
                                                        onChange={(e) => {
                                                            if (e.target.value) {
                                                                handleUserInput(e.target.value, message.expectedField);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            )}

                                            {/* Products Input */}
                                            {message.inputType === 'products' && (
                                                <div className="space-y-3 mt-4">
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <input
                                                            type="text"
                                                            placeholder="Product Code *"
                                                            className="p-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400"
                                                            value={currentProduct.product_code}
                                                            onChange={e => setCurrentProduct(prev => ({ ...prev, product_code: e.target.value }))}
                                                        />
                                                        <input
                                                            type="text"
                                                            placeholder="HS Code"
                                                            className="p-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400"
                                                            value={currentProduct.hs_code}
                                                            onChange={e => setCurrentProduct(prev => ({ ...prev, hs_code: e.target.value }))}
                                                        />
                                                    </div>
                                                    <textarea
                                                        placeholder="Product Description *"
                                                        rows="2"
                                                        className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400"
                                                        value={currentProduct.description}
                                                        onChange={e => setCurrentProduct(prev => ({ ...prev, description: e.target.value }))}
                                                    />
                                                    <div className="grid grid-cols-3 gap-2">
                                                        <input
                                                            type="number"
                                                            placeholder="Quantity *"
                                                            className="p-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400"
                                                            value={currentProduct.quantity}
                                                            onChange={e => setCurrentProduct(prev => ({ ...prev, quantity: e.target.value }))}
                                                        />
                                                        <select
                                                            className="p-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
                                                            value={currentProduct.unit}
                                                            onChange={e => setCurrentProduct(prev => ({ ...prev, unit: e.target.value }))}
                                                        >
                                                            <option value="PCS">PCS</option>
                                                            <option value="KG">KG</option>
                                                            <option value="M">M</option>
                                                            <option value="M²">M²</option>
                                                            <option value="M³">M³</option>
                                                            <option value="L">L</option>
                                                            <option value="SET">SET</option>
                                                            <option value="BOX">BOX</option>
                                                            <option value="CARTON">CARTON</option>
                                                        </select>
                                                        <input
                                                            type="number"
                                                            placeholder="Unit Price *"
                                                            step="0.01"
                                                            className="p-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400"
                                                            value={currentProduct.unit_price}
                                                            onChange={e => setCurrentProduct(prev => ({ ...prev, unit_price: e.target.value }))}
                                                        />
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <button
                                                            className={`flex-1 px-4 py-2 rounded-lg transition-colors text-sm ${(!currentProduct.product_code || !currentProduct.description || !currentProduct.quantity || !currentProduct.unit_price)
                                                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                                                : 'bg-manu-green text-white hover:bg-green-600'
                                                                }`}
                                                            onClick={handleAddProduct}
                                                            disabled={!currentProduct.product_code || !currentProduct.description || !currentProduct.quantity || !currentProduct.unit_price}
                                                        >
                                                            Add Product
                                                        </button>
                                                        <button
                                                            className={`flex-1 px-4 py-2 rounded-lg transition-colors text-sm ${products.length === 0
                                                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                                                }`}
                                                            onClick={handleFinishProducts}
                                                            disabled={products.length === 0}
                                                        >
                                                            Finish ({products.length} added)
                                                        </button>
                                                    </div>

                                                    {products.length > 0 && (
                                                        <div className="mt-3 p-3 bg-gray-600 border border-gray-500 rounded">
                                                            <h4 className="font-semibold mb-2 text-white">Products Added ({products.length}):</h4>
                                                            {products.map((product, index) => (
                                                                <div key={product.id} className="text-sm border-b border-gray-500 pb-2 mb-2 last:border-b-0">
                                                                    <div className="text-white"><strong>{product.product_code}</strong> - {product.description}</div>
                                                                    <div className="text-gray-300">Qty: {product.quantity} {product.unit} | Price: {product.unit_price} | Total: {product.total_amount}</div>
                                                                    {product.hs_code && <div className="text-xs text-blue-400">HS Code: {product.hs_code}</div>}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Packing Input */}
                                            {message.inputType === 'packing' && (
                                                <div className="space-y-3 mt-4">
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <select
                                                            className="p-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
                                                            value={currentPacking.product_index}
                                                            onChange={e => setCurrentPacking(prev => ({ ...prev, product_index: e.target.value }))}
                                                        >
                                                            <option value="">Select Product *</option>
                                                            {products.map((product, index) => (
                                                                <option key={product.id} value={index + 1}>
                                                                    {product.product_code} - {product.description}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <select
                                                            className="p-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
                                                            value={currentPacking.kind_of_packages}
                                                            onChange={e => setCurrentPacking(prev => ({ ...prev, kind_of_packages: e.target.value }))}
                                                        >
                                                            <option value="Carton">Carton</option>
                                                            <option value="Box">Box</option>
                                                            <option value="Crate">Crate</option>
                                                            <option value="Drum">Drum</option>
                                                            <option value="Bag">Bag</option>
                                                            <option value="Pallet">Pallet</option>
                                                            <option value="Bundle">Bundle</option>
                                                        </select>
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        <input
                                                            type="number"
                                                            placeholder="No. of Packages *"
                                                            className="p-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400"
                                                            value={currentPacking.number_of_packages}
                                                            onChange={e => setCurrentPacking(prev => ({ ...prev, number_of_packages: e.target.value }))}
                                                        />
                                                        <input
                                                            type="number"
                                                            placeholder="Net Weight (Kg) *"
                                                            step="0.01"
                                                            className="p-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400"
                                                            value={currentPacking.net_weight}
                                                            onChange={e => setCurrentPacking(prev => ({ ...prev, net_weight: e.target.value }))}
                                                        />
                                                        <input
                                                            type="number"
                                                            placeholder="Gross Weight (Kg) *"
                                                            step="0.01"
                                                            className="p-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400"
                                                            value={currentPacking.gross_weight}
                                                            onChange={e => setCurrentPacking(prev => ({ ...prev, gross_weight: e.target.value }))}
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        <input
                                                            type="number"
                                                            placeholder="Length (cm)"
                                                            className="p-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400"
                                                            value={currentPacking.length}
                                                            onChange={e => setCurrentPacking(prev => ({ ...prev, length: e.target.value }))}
                                                        />
                                                        <input
                                                            type="number"
                                                            placeholder="Width (cm)"
                                                            className="p-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400"
                                                            value={currentPacking.width}
                                                            onChange={e => setCurrentPacking(prev => ({ ...prev, width: e.target.value }))}
                                                        />
                                                        <input
                                                            type="number"
                                                            placeholder="Height (cm)"
                                                            className="p-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400"
                                                            value={currentPacking.height}
                                                            onChange={e => setCurrentPacking(prev => ({ ...prev, height: e.target.value }))}
                                                        />
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <button
                                                            className={`flex-1 px-4 py-2 rounded-lg transition-colors text-sm ${(!currentPacking.product_index || !currentPacking.number_of_packages || !currentPacking.net_weight || !currentPacking.gross_weight)
                                                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                                                : 'bg-manu-green text-white hover:bg-green-600'
                                                                }`}
                                                            onClick={handleAddPackingInfo}
                                                            disabled={!currentPacking.product_index || !currentPacking.number_of_packages || !currentPacking.net_weight || !currentPacking.gross_weight}
                                                        >
                                                            Add Packing Info
                                                        </button>
                                                        <button
                                                            className={`flex-1 px-4 py-2 rounded-lg transition-colors text-sm ${packingInfo.length === 0
                                                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                                                }`}
                                                            onClick={handleFinishPacking}
                                                            disabled={packingInfo.length === 0}
                                                        >
                                                            Finish ({packingInfo.length} added)
                                                        </button>
                                                    </div>

                                                    {packingInfo.length > 0 && (
                                                        <div className="mt-3 p-3 bg-gray-600 border border-gray-500 rounded">
                                                            <h4 className="font-semibold mb-2 text-white">Packing Entries ({packingInfo.length}):</h4>
                                                            {packingInfo.map((packing, index) => (
                                                                <div key={packing.id} className="text-sm border-b border-gray-500 pb-2 mb-2 last:border-b-0">
                                                                    <div className="text-white"><strong>Product {packing.product_index}</strong> - {packing.kind_of_packages}</div>
                                                                    <div className="text-gray-300">Packages: {packing.number_of_packages} | Net: {packing.net_weight}Kg | Gross: {packing.gross_weight}Kg</div>
                                                                    {packing.measurements && <div className="text-xs text-blue-400">Measurements: {packing.measurements}</div>}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Show user answers */}
                                    {message.inputDisabled && message.userAnswer && (
                                        <div className="mt-4 p-3 bg-gray-600 border border-gray-500 rounded-lg">
                                            <div className="text-sm text-gray-300 mb-1">Your answer:</div>
                                            <div className="text-sm font-medium text-white">
                                                ✓ {message.userAnswer}
                                            </div>
                                        </div>
                                    )}

                                    {/* Download Buttons */}
                                    {message.showDownloadButton && (
                                        <div className="flex flex-col gap-2 mt-3">
                                            <button
                                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center justify-center gap-2"
                                                onClick={downloadAllPdfs}
                                            >
                                                <Download size={16} />
                                                Download All Documents
                                            </button>
                                            <button
                                                className={`px-4 py-2 text-white rounded flex items-center justify-center gap-2 ${isSendingEmail ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                                                    } text-sm`}
                                                onClick={sendPdfViaEmail}
                                                disabled={isSendingEmail}
                                            >
                                                <Mail size={16} />
                                                {isSendingEmail ? 'Sending...' : 'Send via Email'}
                                            </button>
                                        </div>
                                    )}

                                    <div className="text-xs opacity-70 mt-2 text-gray-400">
                                        {new Date(message.timestamp).toLocaleTimeString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Free-form message input */}
                    {!awaitingInput && currentStep === 'completed' && (
                        <div className="p-4 border-t border-gray-700">
                            <div className="flex space-x-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Type your message about export documents..."
                                    className="flex-1 px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-manu-green"
                                    value={userMessage}
                                    onChange={(e) => setUserMessage(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && userMessage.trim()) {
                                            handleSendMessage();
                                        }
                                    }}
                                />
                                <button
                                    className="bg-manu-green text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                                    onClick={handleSendMessage}
                                    disabled={!userMessage.trim()}
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Panel - Preview & Edit */}
                <div className="w-full md:w-1/2 bg-gray-800 flex flex-col">
                    <div className="flex-1 p-4">
                        {currentStep === 'template_selection' && (
                            <div className="h-full flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-white text-2xl">📄</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2">
                                        Select Documents to Generate
                                    </h3>
                                    <p className="text-gray-400">
                                        Choose the export documents you need from the chat interface
                                    </p>
                                </div>
                            </div>
                        )}

                        {currentStep === 'data_collection' && (
                            <div className="h-full flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-white text-xl">📝</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2">
                                        Collecting Export Information
                                    </h3>
                                    <p className="text-gray-400 mb-4">
                                        Question {currentQuestion + 1} of {questions.length}
                                    </p>
                                    <div className="w-full bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 'generating' && (
                            <div className="h-full flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                                        <span className="text-white text-xl">⚡</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2">
                                        Generating Documents...
                                    </h3>
                                    <p className="text-gray-400">
                                        Creating professional export documents
                                    </p>
                                </div>
                            </div>
                        )}

                        {currentStep === 'completed' && (
                            <div className="bg-gray-700 rounded-lg p-6 shadow-sm h-full flex flex-col">
                                <div className="flex gap-2 mb-4 flex-wrap">
                                    {/* Download Dropdown */}
                                    <div className="relative group">
                                        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2 text-sm">
                                            <Download size={16} />
                                            Download ▼
                                        </button>
                                        <div className="absolute left-0 mt-1 w-48 bg-gray-700 border border-gray-600 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                                            <button
                                                className="w-full text-left px-4 py-2 text-white hover:bg-gray-600 rounded-t-lg flex items-center gap-2 text-sm"
                                                onClick={downloadAllPdfs}
                                            >
                                                <Download size={14} />
                                                Download All Documents
                                            </button>
                                            <div className="border-t border-gray-600"></div>
                                            {generatedDocuments.map((doc, i) => (
                                                <button
                                                    key={doc.id}
                                                    className="w-full text-left px-4 py-2 text-white hover:bg-gray-600 flex items-center gap-2 text-sm"
                                                    onClick={() => downloadIndividualPdf(i)}
                                                >
                                                    <Download size={14} />
                                                    {doc.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        className={`px-4 py-2 text-white rounded flex items-center gap-2 text-sm ${isSendingEmail
                                            ? 'bg-gray-600 cursor-not-allowed'
                                            : 'bg-green-600 hover:bg-green-700'
                                            }`}
                                        onClick={sendPdfViaEmail}
                                        disabled={isSendingEmail}
                                    >
                                        <Mail size={16} />
                                        {isSendingEmail ? 'Sending...' : 'Email All'}
                                    </button>

                                    {/* Edit Button */}
                                    <button
                                        className={`px-4 py-2 text-white rounded flex items-center gap-2 text-sm ${isEditing
                                            ? 'bg-red-600 hover:bg-red-700'
                                            : 'bg-yellow-600 hover:bg-yellow-700'
                                            }`}
                                        onClick={isEditing ? cancelEditing : startEditing}
                                    >
                                        <Edit3 size={16} />
                                        {isEditing ? 'Cancel Editing' : 'Edit Information'}
                                    </button>

                                    {isEditing && (
                                        <button
                                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2 text-sm"
                                            onClick={handleSaveEdits}
                                        >
                                            Save Changes
                                        </button>
                                    )}
                                </div>

                                {/* Edit Tabs */}
                                {isEditing && (
                                    <div className="mb-4 border-b border-gray-600">
                                        <div className="flex space-x-1 overflow-x-auto">
                                            {Object.keys(questionsByCategory).map(category => (
                                                <button
                                                    key={category}
                                                    onClick={() => setActiveEditTab(category)}
                                                    className={`px-4 py-2 text-sm font-medium rounded-t ${activeEditTab === category
                                                        ? 'bg-manu-green text-white'
                                                        : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                                                        }`}
                                                >
                                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {isEditing ? (
                                    <div className="flex-1 overflow-auto">
                                        {renderEditForm()}
                                    </div>
                                ) : (
                                    <>
                                        {generatedDocuments.length > 0 && (
                                            <div className="flex space-x-2 border-b border-gray-600 pb-2 mb-4 overflow-x-auto">
                                                {generatedDocuments.map((doc, i) => (
                                                    <div key={doc.id} className="flex items-center space-x-1">
                                                        <div className="relative group">
                                                            <button
                                                                onClick={() => setActiveDocIndex(i)}
                                                                className={`px-4 py-1 rounded-t ${activeDocIndex === i ? 'bg-manu-green text-white' : 'bg-gray-600 text-gray-300'} text-sm font-semibold whitespace-nowrap flex items-center gap-2 pr-8`}
                                                            >
                                                                {doc.name}
                                                            </button>
                                                            {/* Download icon positioned absolutely */}
                                                            <button
                                                                onClick={() => downloadIndividualPdf(i)}
                                                                className={`absolute right-1 top-1/2 transform -translate-y-1/2 p-1 transition-colors ${activeDocIndex === i ? 'text-white hover:text-yellow-300' : 'text-gray-400 hover:text-yellow-300'}`}
                                                                title={`Download ${doc.name}`}
                                                            >
                                                                <Download size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex-1 overflow-auto bg-white rounded-lg">
                                            {renderDocumentPreview()}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIAgentPage;