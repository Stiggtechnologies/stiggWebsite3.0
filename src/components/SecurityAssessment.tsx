import React, { useState } from 'react';
import { Shield, ArrowRight, CheckCircle, AlertTriangle, Star, Phone, Mail } from 'lucide-react';
import { useQuoteAutomation } from '../hooks/useQuoteAutomation';

interface AssessmentData {
  propertyType: string;
  primaryConcern: string;
  currentSecurity: string;
  budget: string;
  timeline: string;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    company: string;
  };
}

interface AssessmentResult {
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  score: number;
  recommendations: string[];
  estimatedCost: string;
  priority: string;
}

export const SecurityAssessment: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    propertyType: '',
    primaryConcern: '',
    currentSecurity: '',
    budget: '',
    timeline: '',
    contactInfo: {
      name: '',
      email: '',
      phone: '',
      company: ''
    }
  });
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { submitQuoteRequest } = useQuoteAutomation();

  const questions = [
    {
      id: 'propertyType',
      title: 'What type of property needs security?',
      options: [
        { value: 'office', label: 'Office Building', icon: '🏢' },
        { value: 'retail', label: 'Retail Store', icon: '🏪' },
        { value: 'industrial', label: 'Industrial Facility', icon: '🏭' },
        { value: 'construction', label: 'Construction Site', icon: '🚧' },
        { value: 'healthcare', label: 'Healthcare Facility', icon: '🏥' },
        { value: 'residential', label: 'Residential Complex', icon: '🏠' }
      ]
    },
    {
      id: 'primaryConcern',
      title: 'What\'s your biggest security concern?',
      options: [
        { value: 'theft', label: 'Theft & Vandalism', icon: '🚨' },
        { value: 'access', label: 'Unauthorized Access', icon: '🚪' },
        { value: 'safety', label: 'Employee/Customer Safety', icon: '👥' },
        { value: 'cyber', label: 'Cybersecurity Threats', icon: '💻' },
        { value: 'compliance', label: 'Regulatory Compliance', icon: '📋' },
        { value: 'emergency', label: 'Emergency Response', icon: '🚑' }
      ]
    },
    {
      id: 'currentSecurity',
      title: 'What security measures do you currently have?',
      options: [
        { value: 'none', label: 'No Security System', icon: '❌' },
        { value: 'basic', label: 'Basic Alarm System', icon: '🔔' },
        { value: 'cameras', label: 'Security Cameras', icon: '📹' },
        { value: 'guards', label: 'Security Guards', icon: '👮' },
        { value: 'comprehensive', label: 'Comprehensive System', icon: '🛡️' },
        { value: 'outdated', label: 'Outdated System', icon: '⚠️' }
      ]
    },
    {
      id: 'budget',
      title: 'What\'s your approximate monthly budget?',
      options: [
        { value: 'under-1k', label: 'Under $1,000', icon: '💰' },
        { value: '1k-3k', label: '$1,000 - $3,000', icon: '💰' },
        { value: '3k-5k', label: '$3,000 - $5,000', icon: '💰' },
        { value: '5k-10k', label: '$5,000 - $10,000', icon: '💰' },
        { value: 'over-10k', label: 'Over $10,000', icon: '💰' },
        { value: 'flexible', label: 'Flexible - Show Me Options', icon: '🤝' }
      ]
    },
    {
      id: 'timeline',
      title: 'When do you need security in place?',
      options: [
        { value: 'immediate', label: 'Immediately (Emergency)', icon: '🚨' },
        { value: '1-week', label: 'Within 1 Week', icon: '📅' },
        { value: '1-month', label: 'Within 1 Month', icon: '📅' },
        { value: '3-months', label: 'Within 3 Months', icon: '📅' },
        { value: 'planning', label: 'Just Planning Ahead', icon: '🤔' }
      ]
    }
  ];

  const handleOptionSelect = (questionId: string, value: string) => {
    setAssessmentData(prev => ({
      ...prev,
      [questionId]: value
    }));
    
    if (currentStep < questions.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    } else {
      setTimeout(() => setCurrentStep(questions.length), 300);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Trigger n8n automation for security assessment
      const quoteData = {
        firstName: assessmentData.contactInfo.name.split(' ')[0] || assessmentData.contactInfo.name,
        lastName: assessmentData.contactInfo.name.split(' ').slice(1).join(' ') || '',
        email: assessmentData.contactInfo.email,
        phone: assessmentData.contactInfo.phone,
        company: assessmentData.contactInfo.company,
        serviceType: getRecommendedService(assessmentData),
        propertyType: assessmentData.propertyType,
        securityConcerns: `Primary concern: ${assessmentData.primaryConcern}. Current security: ${assessmentData.currentSecurity}`,
        budget: assessmentData.budget,
        timeline: assessmentData.timeline,
        message: `Security Assessment Lead - Risk Level: ${calculateSecurityAssessment(assessmentData).riskLevel}`
      };

      await submitQuoteRequest(quoteData);
    } catch (error) {
      console.error('Assessment automation error:', error);
    }

    // Calculate assessment result
    const assessmentResult = calculateSecurityAssessment(assessmentData);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setResult(assessmentResult);
    setIsSubmitting(false);
    setCurrentStep(questions.length + 1);

    // Log lead data (in real app, send to CRM)
    console.log('Security Assessment Lead:', {
      ...assessmentData,
      result: assessmentResult,
      timestamp: new Date().toISOString(),
      source: 'security_assessment'
    });
  };

  const getRecommendedService = (data: AssessmentData): string => {
    if (data.primaryConcern === 'cyber') return 'it-support';
    if (data.primaryConcern === 'access') return 'surveillance';
    if (data.timeline === 'immediate') return 'security-guards';
    return 'multiple';
  };

  const calculateSecurityAssessment = (data: AssessmentData): AssessmentResult => {
    let riskScore = 0;
    let recommendations: string[] = [];
    let estimatedCost = '';
    let priority = '';

    // Risk scoring algorithm
    switch (data.primaryConcern) {
      case 'theft':
        riskScore += 30;
        recommendations.push('24/7 Security Guards');
        recommendations.push('HD Surveillance System');
        break;
      case 'access':
        riskScore += 25;
        recommendations.push('Access Control System');
        recommendations.push('Security Guards');
        break;
      case 'cyber':
        riskScore += 35;
        recommendations.push('IT Security Assessment');
        recommendations.push('Network Monitoring');
        break;
      case 'emergency':
        riskScore += 40;
        recommendations.push('Emergency Response Plan');
        recommendations.push('24/7 Monitoring');
        break;
    }

    switch (data.currentSecurity) {
      case 'none':
        riskScore += 40;
        recommendations.push('Immediate Security Implementation');
        break;
      case 'basic':
        riskScore += 25;
        recommendations.push('System Upgrade');
        break;
      case 'outdated':
        riskScore += 30;
        recommendations.push('Modern System Replacement');
        break;
    }

    switch (data.timeline) {
      case 'immediate':
        riskScore += 20;
        priority = 'CRITICAL - Emergency Response Required';
        break;
      case '1-week':
        riskScore += 15;
        priority = 'HIGH - Rapid Deployment Needed';
        break;
      case '1-month':
        priority = 'MEDIUM - Standard Implementation';
        break;
      default:
        priority = 'LOW - Planning Phase';
        break;
    }

    // Cost estimation
    switch (data.budget) {
      case 'under-1k':
        estimatedCost = '$800 - $1,200/month';
        break;
      case '1k-3k':
        estimatedCost = '$1,500 - $3,500/month';
        break;
      case '3k-5k':
        estimatedCost = '$3,000 - $6,000/month';
        break;
      case '5k-10k':
        estimatedCost = '$5,000 - $12,000/month';
        break;
      case 'over-10k':
        estimatedCost = '$10,000+/month - Enterprise Solution';
        break;
      default:
        estimatedCost = 'Custom Quote Based on Needs';
        break;
    }

    // Add property-specific recommendations
    if (data.propertyType === 'construction') {
      recommendations.push('Mobile Patrol Services');
      recommendations.push('Equipment Protection');
    } else if (data.propertyType === 'retail') {
      recommendations.push('Loss Prevention Program');
      recommendations.push('Customer Safety Measures');
    }

    const riskLevel = riskScore >= 70 ? 'critical' : 
                     riskScore >= 50 ? 'high' : 
                     riskScore >= 30 ? 'medium' : 'low';

    return {
      riskLevel,
      score: riskScore,
      recommendations: [...new Set(recommendations)], // Remove duplicates
      estimatedCost,
      priority
    };
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const resetAssessment = () => {
    setCurrentStep(0);
    setAssessmentData({
      propertyType: '',
      primaryConcern: '',
      currentSecurity: '',
      budget: '',
      timeline: '',
      contactInfo: {
        name: '',
        email: '',
        phone: '',
        company: ''
      }
    });
    setResult(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-xl max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-stigg-dark to-stigg-red text-white p-6 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="h-8 w-8 mr-3" />
            <div>
              <h2 className="text-2xl font-bold">Free Security Assessment</h2>
              <p className="text-blue-100">Get personalized recommendations in 2 minutes</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-100">Step {Math.min(currentStep + 1, questions.length + 1)} of {questions.length + 1}</div>
            <div className="w-32 bg-white bg-opacity-20 rounded-full h-2 mt-1">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${((Math.min(currentStep + 1, questions.length + 1)) / (questions.length + 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Questions */}
        {currentStep < questions.length && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {questions[currentStep].title}
              </h3>
              <p className="text-gray-600">Select the option that best describes your situation</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questions[currentStep].options.map((option, index) => (
                <button
                  key={option.value}
                  onClick={() => handleOptionSelect(questions[currentStep].id, option.value)}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-stigg-red hover:bg-red-50 transition-all duration-200 text-left group"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-4">{option.icon}</span>
                    <div className="flex-1">
                      <span className="font-medium text-gray-900 group-hover:text-stigg-red">
                        {option.label}
                      </span>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-stigg-red" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Contact Form */}
        {currentStep === questions.length && !result && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Get Your Personalized Security Report
              </h3>
              <p className="text-gray-600">We'll analyze your responses and provide custom recommendations</p>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={assessmentData.contactInfo.name}
                    onChange={(e) => setAssessmentData(prev => ({
                      ...prev,
                      contactInfo: { ...prev.contactInfo, name: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stigg-red"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={assessmentData.contactInfo.company}
                    onChange={(e) => setAssessmentData(prev => ({
                      ...prev,
                      contactInfo: { ...prev.contactInfo, company: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stigg-red"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={assessmentData.contactInfo.email}
                    onChange={(e) => setAssessmentData(prev => ({
                      ...prev,
                      contactInfo: { ...prev.contactInfo, email: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stigg-red"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={assessmentData.contactInfo.phone}
                    onChange={(e) => setAssessmentData(prev => ({
                      ...prev,
                      contactInfo: { ...prev.contactInfo, phone: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stigg-red"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-stigg-red text-white py-4 px-6 rounded-lg font-semibold hover:bg-stigg-red-dark transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Analyzing Your Security Needs...
                  </>
                ) : (
                  <>
                    Get My Security Report
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                Your Security Assessment Results
              </h3>
              <p className="text-gray-600">Based on your responses, here's what we recommend</p>
            </div>

            {/* Risk Level */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xl font-semibold text-gray-900">Security Risk Level</h4>
                <span className={`px-4 py-2 rounded-full text-sm font-bold ${getRiskColor(result.riskLevel)}`}>
                  {result.riskLevel.toUpperCase()} RISK
                </span>
              </div>
              <div className="flex items-center mb-4">
                <div className="flex-1 bg-gray-200 rounded-full h-4 mr-4">
                  <div
                    className={`h-4 rounded-full ${
                      result.riskLevel === 'critical' ? 'bg-red-500' :
                      result.riskLevel === 'high' ? 'bg-orange-500' :
                      result.riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${result.score}%` }}
                  ></div>
                </div>
                <span className="text-lg font-bold text-gray-900">{result.score}/100</span>
              </div>
              <p className="text-gray-700">
                <strong>Priority:</strong> {result.priority}
              </p>
            </div>

            {/* Recommendations */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Star className="h-5 w-5 text-yellow-500 mr-2" />
                Recommended Security Solutions
              </h4>
              <div className="space-y-3">
                {result.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cost Estimate */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Estimated Investment</h4>
              <p className="text-2xl font-bold text-stigg-red mb-2">{result.estimatedCost}</p>
              <p className="text-gray-600 text-sm">
                *Final pricing depends on specific requirements and site assessment
              </p>
            </div>

            {/* Next Steps */}
            <div className="bg-gradient-to-r from-stigg-red to-stigg-red-dark text-white rounded-lg p-6">
              <h4 className="text-xl font-semibold mb-4">Next Steps</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold mb-2 text-white">Immediate Action Required:</h5>
                  <ul className="space-y-1 text-sm text-blue-100">
                    <li>• Free on-site security assessment</li>
                    <li>• Custom security plan development</li>
                    <li>• Implementation timeline discussion</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <a
                    href="tel:1-587-644-4644"
                    className="bg-white text-stigg-red px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now: 1-587-644-4644
                  </a>
                  <a
                    href="mailto:admin@stigg.ca"
                    className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-stigg-red transition-colors flex items-center justify-center"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email Us
                  </a>
                </div>
              </div>
            </div>

            {/* Reset Button */}
            <div className="text-center">
              <button
                onClick={resetAssessment}
                className="text-stigg-red hover:text-stigg-red-dark font-semibold"
              >
                Take Assessment Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};