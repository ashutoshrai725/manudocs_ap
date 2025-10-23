// src/components/Upload/DocumentUploadPage.jsx
import React, { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, CloudUpload } from 'lucide-react';
import Header from '../LandingPage/Header';

const DocumentUploadPage = ({ user, onPageChange, onLogout }) => {
    const [uploadStatus, setUploadStatus] = useState(null);
    const [dragOver, setDragOver] = useState(false);

    // Step management
    const [currentStep, setCurrentStep] = useState(1);
    const [aadharCompleted, setAadharCompleted] = useState(false);
    const [companyCompleted, setCompanyCompleted] = useState(false);

    // Drag and drop handlers
    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setDragOver(false);
    }, []);

    const handleDrop = useCallback((e, documentType) => {
        e.preventDefault();
        setDragOver(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (documentType === 'aadhar') {
                handleAadharUpload(file);
            } else {
                handleCompanyUpload(file);
            }
        }
    }, []);

    // Aadhar Upload Function
    const handleAadharUpload = async (file) => {
        if (!validateFile(file)) return;

        setUploadStatus('uploading');

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('user_id', user.id);
            formData.append('user_email', user.email);
            formData.append('document_type', 'aadhar');
            formData.append('upload_timestamp', new Date().toISOString());

            const webhookUrl = import.meta.env.VITE_N8N_AADHAR_WEBHOOK_URL || import.meta.env.REACT_APP_N8N_AADHAR_WEBHOOK_URL || 'https://mock-webhook.com/aadhar';

            const response = await fetch(webhookUrl, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setUploadStatus('success');
                setAadharCompleted(true);

                setTimeout(() => {
                    setCurrentStep(2);
                    setUploadStatus(null);
                }, 2000);
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            setUploadStatus('error');
        }
    };

    // Company Document Upload Function
    const handleCompanyUpload = async (file) => {
        if (!validateFile(file)) return;

        setUploadStatus('uploading');

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('user_id', user.id);
            formData.append('user_email', user.email);
            formData.append('document_type', 'company');
            formData.append('upload_timestamp', new Date().toISOString());

            const webhookUrl = import.meta.env.VITE_N8N_COMPANY_WEBHOOK_URL || import.meta.env.REACT_APP_N8N_COMPANY_WEBHOOK_URL || 'https://mock-webhook.com/company';

            const response = await fetch(webhookUrl, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setUploadStatus('success');
                setCompanyCompleted(true);

                setTimeout(() => {
                    setCurrentStep(3);
                    setUploadStatus(null);
                }, 2000);
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            setUploadStatus('error');
        }
    };

    // File validation
    const validateFile = (file) => {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (!validTypes.includes(file.type)) {
            alert('Please upload a valid file type (JPG, PNG, PDF)');
            return false;
        }

        if (file.size > maxSize) {
            alert('File size must be less than 10MB');
            return false;
        }

        return true;
    };

    // If both documents completed, redirect to landing
    if (currentStep === 3) {
        setTimeout(() => {
            onPageChange('landing');
        }, 3000);
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Header user={user} onPageChange={onPageChange} onLogout={onLogout} />

            <div className="pt-16">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    {/* Progress Indicator */}
                    <div className="mb-8">
                        <div className="flex items-center space-x-4">
                            <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-blue-400' : 'text-gray-500'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${aadharCompleted ? 'bg-green-500 border-green-500 text-white' :
                                        currentStep === 1 ? 'bg-blue-500 border-blue-500 text-white' :
                                            'bg-gray-800 border-gray-600 text-gray-400'
                                    }`}>
                                    {aadharCompleted ? '✓' : '1'}
                                </div>
                                <span className="text-sm font-medium">Aadhar Card</span>
                            </div>
                            <div className={`w-16 h-0.5 ${currentStep >= 2 ? 'bg-blue-500' : 'bg-gray-700'}`}></div>
                            <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-green-400' : 'text-gray-500'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${companyCompleted ? 'bg-green-500 border-green-500 text-white' :
                                        currentStep === 2 ? 'bg-green-500 border-green-500 text-white' :
                                            'bg-gray-800 border-gray-600 text-gray-400'
                                    }`}>
                                    {companyCompleted ? '✓' : '2'}
                                </div>
                                <span className="text-sm font-medium">Company Document</span>
                            </div>
                            <div className={`w-16 h-0.5 ${currentStep >= 3 ? 'bg-green-500' : 'bg-gray-700'}`}></div>
                            <div className={`flex items-center space-x-2 ${currentStep >= 3 ? 'text-green-400' : 'text-gray-500'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 3 ? 'bg-green-500 border-green-500 text-white' :
                                        'bg-gray-800 border-gray-600 text-gray-400'
                                    }`}>
                                    {currentStep >= 3 ? '✓' : '3'}
                                </div>
                                <span className="text-sm font-medium">Completed</span>
                            </div>
                        </div>
                    </div>

                    {/* Page Header - DYNAMIC */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-white">
                            {currentStep === 1 && "Upload Aadhar Card"}
                            {currentStep === 2 && "Upload Company Document"}
                            {currentStep === 3 && "Upload Completed!"}
                        </h1>
                        <p className="text-gray-300 mt-2">
                            {currentStep === 1 && "Please upload your Aadhar card for identity verification"}
                            {currentStep === 2 && "Now upload your company registration certificate"}
                            {currentStep === 3 && "All documents uploaded successfully! Redirecting..."}
                        </p>
                    </div>

                    {/* Upload Sections - CONDITIONAL RENDERING */}
                    <div className="space-y-8">

                        {/* Step 1: Aadhar Card Upload */}
                        {currentStep === 1 && (
                            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 shadow-lg">
                                <h2 className="text-lg font-semibold text-white mb-4">
                                    📄 Aadhar Card Upload
                                </h2>
                                <p className="text-gray-300 mb-4">
                                    Upload your Aadhar card for identity verification
                                </p>

                                <div
                                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${dragOver ? 'border-blue-400 bg-blue-900/20' : 'border-blue-600 bg-gray-700/50'
                                        }`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={(e) => handleDrop(e, 'aadhar')}
                                >
                                    <CloudUpload className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                                    <p className="text-gray-300 mb-4">
                                        Drag & drop your Aadhar card here or click to browse
                                    </p>
                                    <input
                                        type="file"
                                        id="aadhar-upload"
                                        className="hidden"
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        onChange={(e) => {
                                            if (e.target.files[0]) {
                                                handleAadharUpload(e.target.files[0]);
                                            }
                                        }}
                                    />
                                    <label
                                        htmlFor="aadhar-upload"
                                        className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                    >
                                        Choose Aadhar File
                                    </label>
                                    <p className="text-xs text-gray-400 mt-3">
                                        Supports JPG, PNG, PDF (max 10MB)
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Company Registration Upload */}
                        {currentStep === 2 && (
                            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 shadow-lg">
                                <h2 className="text-lg font-semibold text-white mb-4">
                                    🏢 Company Registration Certificate
                                </h2>
                                <p className="text-gray-300 mb-4">
                                    Upload your company registration document for business verification
                                </p>

                                <div
                                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${dragOver ? 'border-green-400 bg-green-900/20' : 'border-green-600 bg-gray-700/50'
                                        }`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={(e) => handleDrop(e, 'company')}
                                >
                                    <FileText className="w-16 h-16 text-green-400 mx-auto mb-4" />
                                    <p className="text-gray-300 mb-4">
                                        Drag & drop your company document here or click to browse
                                    </p>
                                    <input
                                        type="file"
                                        id="company-upload"
                                        className="hidden"
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        onChange={(e) => {
                                            if (e.target.files[0]) {
                                                handleCompanyUpload(e.target.files[0]);
                                            }
                                        }}
                                    />
                                    <label
                                        htmlFor="company-upload"
                                        className="cursor-pointer bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                                    >
                                        Choose Company Document
                                    </label>
                                    <p className="text-xs text-gray-400 mt-3">
                                        Supports JPG, PNG, PDF (max 10MB)
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Completion Message */}
                        {currentStep === 3 && (
                            <div className="bg-green-900/30 border border-green-700 rounded-lg p-8 text-center shadow-lg">
                                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-green-400 mb-4">
                                    All Documents Uploaded Successfully!
                                </h2>
                                <p className="text-green-300 mb-6">
                                    Your documents are being processed. You will be redirected to the dashboard shortly.
                                </p>
                                <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-400 border-t-transparent mx-auto"></div>
                            </div>
                        )}

                        {/* Upload Status */}
                        {uploadStatus && currentStep < 3 && (
                            <div className={`p-4 rounded-lg flex items-center space-x-3 border ${uploadStatus === 'success' ? 'bg-green-900/30 border-green-700' :
                                    uploadStatus === 'error' ? 'bg-red-900/30 border-red-700' :
                                        'bg-blue-900/30 border-blue-700'
                                }`}>
                                {uploadStatus === 'uploading' && (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-400 border-t-transparent"></div>
                                        <span className="text-blue-300">Uploading and processing...</span>
                                    </>
                                )}
                                {uploadStatus === 'success' && (
                                    <>
                                        <CheckCircle className="w-5 h-5 text-green-400" />
                                        <span className="text-green-300">Document uploaded successfully! Moving to next step...</span>
                                    </>
                                )}
                                {uploadStatus === 'error' && (
                                    <>
                                        <AlertCircle className="w-5 h-5 text-red-400" />
                                        <span className="text-red-300">Upload failed. Please try again.</span>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Debug Info (Development only) */}
                        {import.meta.env.MODE === 'development' && (
                            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                                <h3 className="text-sm font-medium text-gray-300 mb-2">Debug Info:</h3>
                                <div className="text-xs text-gray-400 space-y-1">
                                    <div>User ID: {user.id}</div>
                                    <div>Email: {user.email}</div>
                                    <div>Current Step: {currentStep}</div>
                                    <div>Aadhar Completed: {aadharCompleted ? 'Yes' : 'No'}</div>
                                    <div>Company Completed: {companyCompleted ? 'Yes' : 'No'}</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentUploadPage;