import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, HelpCircle, ArrowRight, ArrowLeft, Download, RefreshCw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const eriData = {
    metadata: {
        version: "1.0",
        totalQuestions: 23,
        maxScore: 100,
        lastUpdated: "2025-10-23"
    },
    categories: {
        Regulatory: {
            label: "Regulatory Compliance",
            icon: "📋",
            maxScore: 25,
            description: "Mandatory registrations and certifications required for export",
            questions: [
                {
                    id: "reg_1",
                    text: "Do you have IEC (Import Export Code)?",
                    weight: 5,
                    cost: "₹500",
                    helpText: "Mandatory for all exports. Issued by DGFT.",
                    resourceLink: "https://www.dgft.gov.in",
                    recommendation: "Apply for IEC online through DGFT portal within 1-2 working days.",
                    priority: "high",
                    mandatory: true
                },
                {
                    id: "reg_2",
                    text: "Is your GSTIN active and updated?",
                    weight: 5,
                    cost: "Free",
                    helpText: "Required for GST refunds and IGST payments.",
                    resourceLink: "https://www.gst.gov.in",
                    recommendation: "Register on GST portal and keep your registration active.",
                    priority: "high",
                    mandatory: true
                },
                {
                    id: "reg_3",
                    text: "Do you have RCMC (Registration cum Membership Certificate)?",
                    weight: 5,
                    cost: "₹8,000+",
                    helpText: "Required for availing export benefits like RoDTEP.",
                    resourceLink: "https://www.dgft.gov.in",
                    recommendation: "Apply through your sector's Export Promotion Council (EPC).",
                    priority: "high",
                    mandatory: false
                },
                {
                    id: "reg_4",
                    text: "Are you registered on ICEGATE portal?",
                    weight: 5,
                    cost: "Free",
                    helpText: "Required for filing shipping bills online.",
                    resourceLink: "https://www.icegate.gov.in",
                    recommendation: "Register online using your IEC and Digital Signature Certificate.",
                    priority: "medium",
                    mandatory: true
                },
                {
                    id: "reg_5",
                    text: "Do you have Digital Signature Certificate (DSC)?",
                    weight: 3,
                    cost: "₹3,000",
                    helpText: "Required for signing export documents digitally.",
                    resourceLink: null,
                    recommendation: "Obtain Class 3 DSC from authorized agencies (2-3 working days).",
                    priority: "medium",
                    mandatory: true
                },
                {
                    id: "reg_6",
                    text: "Do you have REX registration (for EU exports)?",
                    weight: 2,
                    cost: "Free",
                    helpText: "Self-certification for preferential COO to EU.",
                    resourceLink: "https://coo.dgft.gov.in",
                    recommendation: "Apply only if exporting to EU countries above EUR 6,000.",
                    priority: "low",
                    mandatory: false,
                    conditional: true,
                    conditionQuestion: "Are you planning to export to EU countries?"
                }
            ]
        },
        Financial: {
            label: "Financial Readiness",
            icon: "💰",
            maxScore: 20,
            description: "Banking and financial infrastructure for export transactions",
            questions: [
                {
                    id: "fin_1",
                    text: "Do you have a current account with AD Bank?",
                    weight: 10,
                    cost: "Free",
                    helpText: "Authorized Dealer Bank for receiving export payments.",
                    resourceLink: null,
                    recommendation: "Open current account with any scheduled commercial bank dealing in foreign exchange.",
                    priority: "high",
                    mandatory: true
                },
                {
                    id: "fin_2",
                    text: "Do you have ECGC risk coverage?",
                    weight: 5,
                    cost: "Premium-based",
                    helpText: "Export Credit Guarantee Corporation for buyer default risk.",
                    resourceLink: "https://www.ecgc.in",
                    recommendation: "Apply for ECGC export credit insurance to protect against payment defaults.",
                    priority: "medium",
                    mandatory: false
                },
                {
                    id: "fin_3",
                    text: "Have you availed packing credit from bank?",
                    weight: 5,
                    cost: "Interest-based",
                    helpText: "Pre-shipment financing for production and packaging.",
                    resourceLink: null,
                    recommendation: "Discuss packing credit facility with your AD Bank for working capital.",
                    priority: "low",
                    mandatory: false
                }
            ]
        },
        Infrastructure: {
            label: "Infrastructure Readiness",
            icon: "🏭",
            maxScore: 20,
            description: "Operational capacity and facilities for export production",
            questions: [
                {
                    id: "inf_1",
                    text: "Do you have adequate packaging facilities?",
                    weight: 7,
                    cost: "Varies",
                    helpText: "Export-quality packaging meeting international standards.",
                    resourceLink: null,
                    recommendation: "Upgrade packaging to meet export standards (IATA for air, ISO for sea).",
                    priority: "high",
                    mandatory: true
                },
                {
                    id: "inf_2",
                    text: "Is quality control system in place?",
                    weight: 7,
                    cost: "Varies",
                    helpText: "ISO/GMP certification or in-house QC processes.",
                    resourceLink: null,
                    recommendation: "Implement quality control systems or obtain ISO certification.",
                    priority: "high",
                    mandatory: true
                },
                {
                    id: "inf_3",
                    text: "Are you dealing with perishable products?",
                    weight: 0,
                    cost: "N/A",
                    helpText: "Products like seafood, dairy, pharma, fruits that require cold storage.",
                    resourceLink: null,
                    recommendation: null,
                    priority: "high",
                    mandatory: false,
                    isConditional: true
                },
                {
                    id: "inf_3a",
                    text: "Do you have cold storage facilities?",
                    weight: 3,
                    cost: "Varies",
                    helpText: "Temperature-controlled storage for perishable goods.",
                    resourceLink: null,
                    recommendation: "Arrange cold storage facilities or partner with cold chain logistics providers.",
                    priority: "high",
                    mandatory: true,
                    dependsOn: "inf_3",
                    showIfAnswer: true
                },
                {
                    id: "inf_4",
                    text: "Is your production capacity scalable?",
                    weight: 3,
                    cost: "Varies",
                    helpText: "Ability to fulfill bulk international orders.",
                    resourceLink: null,
                    recommendation: "Assess and expand production capacity to meet export demand.",
                    priority: "medium",
                    mandatory: false
                }
            ]
        },
        Product: {
            label: "Product Readiness",
            icon: "📦",
            maxScore: 15,
            description: "Product compliance and market suitability",
            questions: [
                {
                    id: "prod_1",
                    text: "Is your product HSN code correctly classified?",
                    weight: 5,
                    cost: "Free",
                    helpText: "Accurate classification determines duty rates and export policy.",
                    resourceLink: "https://www.dgft.gov.in/CP/?opt=itchs",
                    recommendation: "Verify correct 8-digit HSN code on DGFT website to avoid penalties.",
                    priority: "high",
                    mandatory: true
                },
                {
                    id: "prod_2",
                    text: "Do you have required product certifications?",
                    weight: 5,
                    cost: "Varies",
                    helpText: "Phytosanitary, Fumigation, Export Inspection, FDA etc.",
                    resourceLink: null,
                    recommendation: "Obtain product-specific certifications based on destination country requirements.",
                    priority: "high",
                    mandatory: true
                },
                {
                    id: "prod_3",
                    text: "Is product labeling compliant with destination country?",
                    weight: 5,
                    cost: "Varies",
                    helpText: "Nutritional info, MRP, country of origin marking.",
                    resourceLink: null,
                    recommendation: "Ensure product labels meet destination country's regulatory requirements.",
                    priority: "medium",
                    mandatory: true
                }
            ]
        },
        Market: {
            label: "Market Knowledge",
            icon: "🌍",
            maxScore: 10,
            description: "Understanding of target markets and trade agreements",
            questions: [
                {
                    id: "mkt_1",
                    text: "Have you identified target export markets?",
                    weight: 4,
                    cost: "Free",
                    helpText: "Research buyers, market demand, and competition.",
                    resourceLink: null,
                    recommendation: "Conduct market research using indiantradeportal.in and trade statistics.",
                    priority: "high",
                    mandatory: true
                },
                {
                    id: "mkt_2",
                    text: "Are you aware of applicable FTAs/PTAs?",
                    weight: 3,
                    cost: "Free",
                    helpText: "Free Trade Agreements for duty concessions.",
                    resourceLink: "https://indiantradeportal.in",
                    recommendation: "Check FTA benefits for your product-country combination to reduce import duties.",
                    priority: "high",
                    mandatory: false
                },
                {
                    id: "mkt_3",
                    text: "Do you understand INCOTERMS?",
                    weight: 3,
                    cost: "Free",
                    helpText: "FOB, CIF, DAP etc. define cost and risk responsibilities.",
                    resourceLink: null,
                    recommendation: "Learn INCOTERMS to negotiate clear terms with buyers (FOB, CIF, DAP).",
                    priority: "medium",
                    mandatory: true
                }
            ]
        },
        Operational: {
            label: "Operational Readiness",
            icon: "⚙",
            maxScore: 10,
            description: "Logistics and process management capabilities",
            questions: [
                {
                    id: "ops_1",
                    text: "Have you partnered with a CHA (Customs House Agent)?",
                    weight: 4,
                    cost: "Per shipment fee",
                    helpText: "CHA handles customs clearance formalities.",
                    resourceLink: "https://easeoflogistics.com",
                    recommendation: "Partner with licensed Customs Broker for smooth customs clearance.",
                    priority: "high",
                    mandatory: true
                },
                {
                    id: "ops_2",
                    text: "Do you have freight forwarder contacts?",
                    weight: 3,
                    cost: "Per shipment fee",
                    helpText: "For container booking and shipping arrangements.",
                    resourceLink: null,
                    recommendation: "Identify freight forwarders for shipping logistics (sea/air).",
                    priority: "medium",
                    mandatory: true
                },
                {
                    id: "ops_3",
                    text: "Is export documentation process mapped?",
                    weight: 3,
                    cost: "Free",
                    helpText: "Invoice, Packing List, Shipping Bill, COO, BL workflow.",
                    resourceLink: null,
                    recommendation: "Document your export process workflow and train staff on procedures.",
                    priority: "medium",
                    mandatory: true
                }
            ]
        }
    },
    scoringRubric: {
        "0-39": {
            level: "Not Ready",
            color: "red",
            message: "Significant preparation needed before starting export activities.",
            emoji: "⚠️"
        },
        "40-69": {
            level: "Needs Preparation",
            color: "yellow",
            message: "You're on the right track! Complete a few more requirements to become export-ready.",
            emoji: "💪"
        },
        "70-100": {
            level: "Export Ready",
            color: "green",
            message: "Congratulations! You're ready to start exporting. Time to find buyers and ship.",
            emoji: "🎉"
        }
    }
};

const ExportReadinessIndex = ({ user }) => {
    const navigate = useNavigate();
    const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);
    const [categoryScores, setCategoryScores] = useState({});
    const [expandedHelp, setExpandedHelp] = useState(null);
    const [questionHistory, setQuestionHistory] = useState([]);
    const [skippedQuestions, setSkippedQuestions] = useState(new Set());

    const categories = Object.keys(eriData.categories);
    const currentCategoryKey = categories[currentCategoryIndex];
    const currentCategory = eriData.categories[currentCategoryKey];

    // Get all eligible questions
    const getEligibleQuestions = (categoryKey) => {
        const category = eriData.categories[categoryKey];
        return category.questions.filter(q => {
            // Skip if it's a dependent question and condition not met
            if (q.dependsOn) {
                const dependentAnswer = answers[q.dependsOn];
                if (dependentAnswer !== q.showIfAnswer) {
                    return false;
                }
            }
            return true;
        });
    };

    const eligibleQuestions = getEligibleQuestions(currentCategoryKey);
    const currentQuestion = eligibleQuestions[currentQuestionIndex];

    // Calculate total eligible questions dynamically
    const getTotalEligibleQuestions = () => {
        let total = 0;
        categories.forEach(catKey => {
            const category = eriData.categories[catKey];
            category.questions.forEach(q => {
                if (q.dependsOn) {
                    if (answers[q.dependsOn] === q.showIfAnswer) {
                        total++;
                    }
                } else if (!q.isConditional || q.weight === 0) {
                    total++;
                }
            });
        });
        return total;
    };

    const totalQuestions = getTotalEligibleQuestions();
    const answeredQuestions = Object.keys(answers).filter(key => {
        // Only count answers that matter
        const question = findQuestionById(key);
        return question && question.weight > 0;
    }).length;
    const progress = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

    function findQuestionById(id) {
        for (let catKey of categories) {
            const cat = eriData.categories[catKey];
            const question = cat.questions.find(q => q.id === id);
            if (question) return question;
        }
        return null;
    }

    useEffect(() => {
        if (!user) {
            navigate('/auth');
        }
    }, [user, navigate]);

    const handleAnswer = (answer) => {
        const newAnswers = { ...answers, [currentQuestion.id]: answer };
        setAnswers(newAnswers);

        // Add to history
        setQuestionHistory([...questionHistory, {
            categoryIndex: currentCategoryIndex,
            questionIndex: currentQuestionIndex,
            questionId: currentQuestion.id
        }]);

        // Move to next question
        moveToNextQuestion(newAnswers);
    };

    const moveToNextQuestion = (newAnswers) => {
        // Check if there's a next question in current category
        const nextEligibleQuestions = getEligibleQuestions(currentCategoryKey);

        if (currentQuestionIndex < nextEligibleQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else if (currentCategoryIndex < categories.length - 1) {
            // Move to next category
            setCurrentCategoryIndex(currentCategoryIndex + 1);
            setCurrentQuestionIndex(0);
        } else {
            // Assessment complete
            calculateResults(newAnswers);
        }
    };

    const handlePrevious = () => {
        if (questionHistory.length === 0) return;

        const lastQuestion = questionHistory[questionHistory.length - 1];
        setQuestionHistory(questionHistory.slice(0, -1));

        // Remove the answer for the last question
        const newAnswers = { ...answers };
        delete newAnswers[lastQuestion.questionId];
        setAnswers(newAnswers);

        // Go back to the last question
        setCurrentCategoryIndex(lastQuestion.categoryIndex);
        setCurrentQuestionIndex(lastQuestion.questionIndex);
    };

    const calculateResults = (finalAnswers) => {
        let totalScore = 0;
        let maxPossibleScore = 0;
        const catScores = {};

        categories.forEach(catKey => {
            const category = eriData.categories[catKey];
            let categoryScore = 0;
            let categoryMaxScore = 0;

            category.questions.forEach(q => {
                // Determine if question was applicable
                let isApplicable = true;

                if (q.dependsOn) {
                    isApplicable = finalAnswers[q.dependsOn] === q.showIfAnswer;
                }

                if (isApplicable && q.weight > 0) {
                    categoryMaxScore += q.weight;
                    if (finalAnswers[q.id] === true) {
                        categoryScore += q.weight;
                    }
                }
            });

            catScores[catKey] = {
                score: categoryScore,
                maxScore: categoryMaxScore,
                percentage: categoryMaxScore > 0 ? (categoryScore / categoryMaxScore) * 100 : 0
            };

            totalScore += categoryScore;
            maxPossibleScore += categoryMaxScore;
        });

        // Calculate percentage score
        const percentageScore = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;

        setScore(percentageScore);
        setCategoryScores(catScores);
        setShowResults(true);
    };

    const getScoreLevel = () => {
        if (score >= 70) return eriData.scoringRubric["70-100"];
        if (score >= 40) return eriData.scoringRubric["40-69"];
        return eriData.scoringRubric["0-39"];
    };

    const getRecommendations = () => {
        const recommendations = [];
        categories.forEach(catKey => {
            const category = eriData.categories[catKey];
            category.questions.forEach(q => {
                // Check if question was applicable
                let isApplicable = true;
                if (q.dependsOn) {
                    isApplicable = answers[q.dependsOn] === q.showIfAnswer;
                }

                // Only recommend if question was applicable and answered "No" or not answered
                if (isApplicable && q.weight > 0 && !answers[q.id]) {
                    recommendations.push({
                        category: category.label,
                        question: q.text,
                        recommendation: q.recommendation,
                        cost: q.cost,
                        priority: q.priority,
                        resourceLink: q.resourceLink,
                        mandatory: q.mandatory
                    });
                }
            });
        });

        // Sort by priority and mandatory status
        return recommendations.sort((a, b) => {
            if (a.mandatory !== b.mandatory) return a.mandatory ? -1 : 1;
            const priorityOrder = { high: 1, medium: 2, low: 3 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
    };

    const handleRestart = () => {
        setAnswers({});
        setCurrentCategoryIndex(0);
        setCurrentQuestionIndex(0);
        setShowResults(false);
        setScore(0);
        setCategoryScores({});
        setQuestionHistory([]);
        setSkippedQuestions(new Set());
    };

    const handleDownloadReport = () => {
        const recommendations = getRecommendations();
        const scoreLevel = getScoreLevel();

        const reportContent = `
═══════════════════════════════════════════════════════════
EXPORT READINESS INDEX REPORT
═══════════════════════════════════════════════════════════
Generated: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
User: ${user?.user_metadata?.full_name || user?.email}
Assessment Version: ${eriData.metadata.version}

───────────────────────────────────────────────────────────
OVERALL SCORE
───────────────────────────────────────────────────────────
Score: ${score}%
Status: ${scoreLevel.level}
Assessment: ${scoreLevel.message}

───────────────────────────────────────────────────────────
CATEGORY BREAKDOWN
───────────────────────────────────────────────────────────
${categories.map(catKey => {
            const cat = eriData.categories[catKey];
            const catScore = categoryScores[catKey];
            return `${cat.icon} ${cat.label}
   Score: ${catScore.score}/${catScore.maxScore} (${catScore.percentage.toFixed(1)}%)
   ${catScore.percentage >= 70 ? '✓ Strong' : catScore.percentage >= 40 ? '⚠ Needs Work' : '✗ Critical Gap'}`;
        }).join('\n\n')}

───────────────────────────────────────────────────────────
RECOMMENDED ACTIONS (${recommendations.length} items)
───────────────────────────────────────────────────────────
${recommendations.map((rec, i) => `
${i + 1}. ${rec.mandatory ? '[MANDATORY]' : '[OPTIONAL]'} [${rec.priority.toUpperCase()}]
   ${rec.question}
   
   Category: ${rec.category}
   Action: ${rec.recommendation}
   Estimated Cost: ${rec.cost}
   ${rec.resourceLink ? `Resource: ${rec.resourceLink}` : 'Contact: Local Export Promotion Council'}
   
   ───────────────────────────────────────────────────────────
`).join('\n')}

═══════════════════════════════════════════════════════════
NEXT STEPS
═══════════════════════════════════════════════════════════
${score >= 70 ? `
✓ You're export-ready! Focus on:
  1. Finding international buyers
  2. Negotiating your first export contract
  3. Finalizing logistics partnerships
` : score >= 40 ? `
⚠ Priority Actions (Complete these first):
${recommendations.filter(r => r.mandatory && r.priority === 'high').slice(0, 5).map((r, i) => `  ${i + 1}. ${r.question}`).join('\n')}
` : `
✗ Critical Requirements (Must complete before exporting):
${recommendations.filter(r => r.mandatory).slice(0, 5).map((r, i) => `  ${i + 1}. ${r.question}`).join('\n')}
`}

───────────────────────────────────────────────────────────
Report generated by ManuDocs Export Readiness Index
Visit: https://manudocs.com | Contact: support@manudocs.com
═══════════════════════════════════════════════════════════
        `;

        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ERI_Report_${score}percent_${new Date().getTime()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (!user) {
        return null;
    }

    if (showResults) {
        const scoreLevel = getScoreLevel();
        const recommendations = getRecommendations();
        const mandatoryGaps = recommendations.filter(r => r.mandatory);
        const optionalImprovements = recommendations.filter(r => !r.mandatory);

        return (
            <div className="min-h-screen bg-gradient-to-br from-manu-dark via-gray-900 to-manu-dark py-12 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Results Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 mb-8 border border-manu-green/20"
                    >
                        <div className="text-center mb-6">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", duration: 0.6 }}
                                className="text-6xl mb-4"
                            >
                                {scoreLevel.emoji}
                            </motion.div>
                            <h1 className="text-4xl font-bold text-white mb-2">Your Export Readiness Score</h1>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring" }}
                                className="text-7xl font-bold mb-4"
                                style={{
                                    color: scoreLevel.color === 'green' ? '#01C023' :
                                        scoreLevel.color === 'yellow' ? '#FFA500' : '#FF0000'
                                }}
                            >
                                {score}%
                            </motion.div>
                            <div className={`inline-block px-6 py-2 rounded-full text-lg font-semibold mb-4 ${scoreLevel.color === 'green' ? 'bg-manu-green/20 text-manu-green border-2 border-manu-green' :
                                scoreLevel.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-500 border-2 border-yellow-500' :
                                    'bg-red-500/20 text-red-500 border-2 border-red-500'
                                }`}>
                                {scoreLevel.level}
                            </div>
                            <p className="text-gray-300 mt-4 text-lg max-w-2xl mx-auto">{scoreLevel.message}</p>

                            {/* Score Breakdown */}
                            <div className="mt-6 flex justify-center gap-8 text-sm">
                                <div className="text-center">
                                    <div className="text-manu-green text-2xl font-bold">{answeredQuestions}</div>
                                    <div className="text-gray-400">Questions Answered</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-manu-green text-2xl font-bold">
                                        {Object.values(answers).filter(a => a === true).length}
                                    </div>
                                    <div className="text-gray-400">Requirements Met</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-yellow-500 text-2xl font-bold">{recommendations.length}</div>
                                    <div className="text-gray-400">Action Items</div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-4 justify-center mt-6">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleDownloadReport}
                                className="flex items-center gap-2 bg-manu-green text-white px-6 py-3 rounded-xl font-semibold shadow-lg"
                            >
                                <Download size={18} />
                                Download Detailed Report
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleRestart}
                                className="flex items-center gap-2 bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold"
                            >
                                <RefreshCw size={18} />
                                Retake Assessment
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/')}
                                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold"
                            >
                                <Home size={18} />
                                Back to Home
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Category Scores */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 mb-8 border border-manu-green/20"
                    >
                        <h2 className="text-2xl font-bold text-white mb-6">📊 Category Breakdown</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categories.map((catKey, index) => {
                                const cat = eriData.categories[catKey];
                                const catScore = categoryScores[catKey];
                                return (
                                    <motion.div
                                        key={catKey}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.4 + index * 0.1 }}
                                        className="bg-gray-700/50 rounded-xl p-6 border border-gray-600 hover:border-manu-green/50 transition-colors"
                                    >
                                        <div className="text-3xl mb-2">{cat.icon}</div>
                                        <h3 className="text-white font-semibold mb-2">{cat.label}</h3>
                                        <div className="flex items-baseline gap-2 mb-2">
                                            <span className="text-3xl font-bold text-manu-green">
                                                {catScore.percentage.toFixed(0)}%
                                            </span>
                                            <span className="text-gray-400 text-sm">
                                                ({catScore.score}/{catScore.maxScore})
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-600 rounded-full h-2 mb-2">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${catScore.percentage}%` }}
                                                transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                                                className={`h-2 rounded-full ${catScore.percentage >= 70 ? 'bg-manu-green' :
                                                    catScore.percentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}
                                            />
                                        </div>
                                        <p className="text-sm text-gray-400">
                                            {catScore.percentage >= 70 ? '✓ Strong Performance' :
                                                catScore.percentage >= 40 ? '⚠ Needs Improvement' : '✗ Critical Gaps'}
                                        </p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Mandatory Requirements */}
                    {mandatoryGaps.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="bg-gradient-to-br from-red-900/20 to-gray-900 rounded-2xl p-8 mb-8 border border-red-500/30"
                        >
                            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                                <span className="text-3xl">🚨</span>
                                Mandatory Requirements Missing ({mandatoryGaps.length})
                            </h2>
                            <p className="text-gray-300 mb-6 text-sm">These are essential for legal export activities</p>
                            <div className="space-y-4">
                                {mandatoryGaps.map((rec, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.7 + index * 0.05 }}
                                        className="bg-gray-700/50 rounded-xl p-6 border-l-4 border-red-500"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500">
                                                        MANDATORY
                                                    </span>
                                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${rec.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                                                        rec.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                            'bg-blue-500/20 text-blue-400'
                                                        }`}>
                                                        {rec.priority.toUpperCase()} PRIORITY
                                                    </span>
                                                    <span className="text-gray-400 text-sm">{rec.category}</span>
                                                </div>
                                                <h3 className="text-white font-semibold mb-2 text-lg">{rec.question}</h3>
                                                <p className="text-gray-300 text-sm mb-3">{rec.recommendation}</p>
                                                <div className="flex items-center gap-4 text-sm flex-wrap">
                                                    <span className="text-manu-green font-semibold">💰 Cost: {rec.cost}</span>
                                                    {rec.resourceLink && (
                                                        <a
                                                            href={rec.resourceLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-400 hover:text-blue-300 underline flex items-center gap-1"
                                                        >
                                                            <span>Visit Resource</span>
                                                            <ArrowRight size={14} />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Optional Improvements */}
                    {optionalImprovements.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-manu-green/20"
                        >
                            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                                <span className="text-3xl">💡</span>
                                Recommended Improvements ({optionalImprovements.length})
                            </h2>
                            <p className="text-gray-300 mb-6 text-sm">These will strengthen your export capabilities</p>
                            <div className="space-y-4">
                                {optionalImprovements.map((rec, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.9 + index * 0.05 }}
                                        className={`bg-gray-700/50 rounded-xl p-6 border-l-4 ${rec.priority === 'high' ? 'border-yellow-500' :
                                            rec.priority === 'medium' ? 'border-blue-500' :
                                                'border-gray-500'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${rec.priority === 'high' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        rec.priority === 'medium' ? 'bg-blue-500/20 text-blue-400' :
                                                            'bg-gray-500/20 text-gray-400'
                                                        }`}>
                                                        {rec.priority.toUpperCase()} PRIORITY
                                                    </span>
                                                    <span className="text-gray-400 text-sm">{rec.category}</span>
                                                </div>
                                                <h3 className="text-white font-semibold mb-2">{rec.question}</h3>
                                                <p className="text-gray-300 text-sm mb-2">{rec.recommendation}</p>
                                                <div className="flex items-center gap-4 text-sm flex-wrap">
                                                    <span className="text-manu-green font-semibold">Cost: {rec.cost}</span>
                                                    {rec.resourceLink && (
                                                        <a
                                                            href={rec.resourceLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-400 hover:text-blue-300 underline flex items-center gap-1"
                                                        >
                                                            <span>Learn More</span>
                                                            <ArrowRight size={14} />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-manu-dark via-gray-900 to-manu-dark py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl font-bold text-white mb-2">📊 Export Readiness Index</h1>
                    <p className="text-gray-400">Comprehensive assessment to evaluate your export preparedness</p>
                </motion.div>

                {/* Progress Bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-8"
                >
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400 text-sm">Assessment Progress</span>
                        <span className="text-manu-green font-semibold">
                            {answeredQuestions}/{totalQuestions} ({Math.round(progress)}%)
                        </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="bg-gradient-to-r from-manu-green to-green-500 h-3 rounded-full relative"
                            transition={{ duration: 0.5 }}
                        >
                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Category Progress Pills */}
                <div className="flex flex-wrap gap-2 mb-8 justify-center">
                    {categories.map((catKey, index) => {
                        const cat = eriData.categories[catKey];
                        const isActive = index === currentCategoryIndex;
                        const isPast = index < currentCategoryIndex;
                        return (
                            <motion.div
                                key={catKey}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-all ${isActive ? 'bg-manu-green text-white shadow-lg scale-105' :
                                    isPast ? 'bg-gray-700 text-manu-green' :
                                        'bg-gray-800 text-gray-400'
                                    }`}
                            >
                                <span>{cat.icon}</span>
                                <span className="hidden sm:inline">{cat.label}</span>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Question Card */}
                <AnimatePresence mode="wait">
                    {currentQuestion && (
                        <motion.div
                            key={`${currentCategoryKey}-${currentQuestionIndex}`}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-manu-green/20 mb-6 shadow-2xl"
                        >
                            {/* Category Badge */}
                            <div className="flex items-center gap-2 mb-6">
                                <span className="text-3xl">{currentCategory.icon}</span>
                                <div>
                                    <h2 className="text-xl font-bold text-white">{currentCategory.label}</h2>
                                    <p className="text-sm text-gray-400">{currentCategory.description}</p>
                                </div>
                            </div>

                            {/* Question */}
                            <div className="mb-8">
                                <h3 className="text-2xl font-semibold text-white mb-4">{currentQuestion.text}</h3>

                                {/* Help Text */}
                                <div className="bg-gray-700/50 rounded-xl p-4 mb-4">
                                    <div className="flex items-start gap-2 text-gray-300 text-sm">
                                        <HelpCircle size={18} className="flex-shrink-0 mt-0.5 text-manu-green" />
                                        <p>{currentQuestion.helpText}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-4 mt-3 text-sm">
                                        <span className="text-manu-green font-semibold">💰 {currentQuestion.cost}</span>
                                        {currentQuestion.mandatory && (
                                            <span className="px-2 py-1 rounded text-xs font-bold bg-red-500/20 text-red-400 border border-red-500">
                                                MANDATORY
                                            </span>
                                        )}
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${currentQuestion.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                                            currentQuestion.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-blue-500/20 text-blue-400'
                                            }`}>
                                            {currentQuestion.priority.toUpperCase()} PRIORITY
                                        </span>
                                    </div>
                                </div>

                                {/* Expandable Recommendation */}
                                <AnimatePresence>
                                    {expandedHelp === currentQuestion.id && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="bg-manu-green/10 border border-manu-green/30 rounded-xl p-4 mb-4">
                                                <p className="text-gray-300 text-sm mb-2">{currentQuestion.recommendation}</p>
                                                {currentQuestion.resourceLink && (
                                                    <a
                                                        href={currentQuestion.resourceLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-manu-green hover:text-green-400 text-sm underline flex items-center gap-1"
                                                    >
                                                        <span>Visit Official Resource</span>
                                                        <ArrowRight size={14} />
                                                    </a>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <button
                                    onClick={() => setExpandedHelp(expandedHelp === currentQuestion.id ? null : currentQuestion.id)}
                                    className="text-manu-green text-sm hover:text-green-400 font-semibold flex items-center gap-1"
                                >
                                    {expandedHelp === currentQuestion.id ? '▼ Hide' : '▶ Show'} Recommendation & Resources
                                </button>
                            </div>

                            {/* Answer Buttons */}
                            <div className="grid grid-cols-2 gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleAnswer(true)}
                                    className="flex items-center justify-center gap-3 bg-manu-green hover:bg-green-600 text-white p-6 rounded-xl font-semibold text-lg transition-colors shadow-lg"
                                >
                                    <CheckCircle size={24} />
                                    Yes, I have this
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleAnswer(false)}
                                    className="flex items-center justify-center gap-3 bg-gray-700 hover:bg-gray-600 text-white p-6 rounded-xl font-semibold text-lg transition-colors"
                                >
                                    <XCircle size={24} />
                                    No, I don't
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex justify-between items-center">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handlePrevious}
                        disabled={questionHistory.length === 0}
                        className="flex items-center gap-2 bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                    >
                        <ArrowLeft size={18} />
                        Previous
                    </motion.button>

                    <span className="text-gray-400 text-sm">
                        Question {answeredQuestions + 1} of {totalQuestions}
                    </span>

                    <div className="w-32"></div>
                </div>
            </div>
        </div>
    );
};

export default ExportReadinessIndex;