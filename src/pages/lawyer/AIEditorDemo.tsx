import React from 'react';
import { LawyerDashboardLayout } from '../../components/layout/LawyerDashboardLayout';
import LegalDocEditor, { Clause } from '../../components/common/LegalDocEditor';
import { Brain, FileText, Scale, Search, Wand2 } from 'lucide-react';

export const AIEditorDemo = () => {
  // Sample legal clauses for demonstration
  const demoClauses: Clause[] = [
    {
      id: "nda-conf",
      title: "Confidentiality Clause",
      body: "The Parties agree to keep {{InformationType}} confidential until {{ExpiryDate}}.",
      variables: { InformationType: "Confidential Information", ExpiryDate: "2026-12-31" },
    },
    {
      id: "nda-def",
      title: "Definition of Confidential Information",
      body: "For purposes of this Agreement, 'Confidential Information' means {{InformationDefinition}}.",
      variables: { InformationDefinition: "any information disclosed by one party to the other" },
    },
    {
      id: "nda-oblig",
      title: "Obligations",
      body: "The Receiving Party shall: (a) use the Confidential Information solely for {{Purpose}}; (b) maintain the confidentiality of the Confidential Information; and (c) not disclose the Confidential Information to any third party without prior written consent.",
      variables: { Purpose: "the purpose of this Agreement" },
    },
    {
      id: "contract-gov",
      title: "Governing Law",
      body: "This Agreement shall be governed by and construed in accordance with the laws of {{Jurisdiction}}.",
      variables: { Jurisdiction: "Kenya" },
    },
    {
      id: "contract-dispute",
      title: "Dispute Resolution",
      body: "Any dispute arising out of or relating to this Agreement shall be resolved through {{ResolutionMethod}}.",
      variables: { ResolutionMethod: "mediation and arbitration in accordance with Kenyan law" },
    }
  ];

  // Sample metadata for AI functions
  const demoMetadata = {
    documentType: "Non-Disclosure Agreement",
    clientName: "Acme Corporation",
    caseType: "Commercial",
    description: "Standard NDA for business partnership discussions",
    jurisdiction: "Kenya",
    additionalRequirements: "Include specific clauses for trade secrets protection",
    effectiveDate: new Date().toISOString().split('T')[0]
  };

  return (
    <LawyerDashboardLayout>
      <div className="max-w-7xl mx-auto mt-20">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900">AI-Powered Legal Document Editor</h1>
              <p className="text-lg text-gray-600">Experience the future of legal document creation with HakiChain AI</p>
            </div>
          </div>
        </div>

        {/* AI Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Wand2 className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Haki Draft</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Generate complete legal documents from metadata using advanced AI. 
              Creates professional, compliant documents tailored to your specific case details.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Scale className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Haki Reviews</h3>
            </div>
            <p className="text-gray-600 text-sm">
              AI-powered document review that suggests improvements, identifies potential issues, 
              and ensures legal compliance with Kenyan law.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Haki Lens</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Legal research assistant that answers questions, provides citations, 
              and offers insights based on Kenyan legal precedents and statutes.
            </p>
          </div>
        </div>

        {/* Editor Demo */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Interactive Document Editor</h2>
            <p className="text-gray-600">
              Try the advanced AI-powered editor below. Use the toolbar to switch between Edit, Suggest, and View modes. 
              Explore the AI tools in the secondary toolbar.
            </p>
          </div>
          
          <div className="h-[800px]">
            <LegalDocEditor
              docId="demo-doc-001"
              currentUser={{ id: "demo-lawyer", name: "Adv. Wanjiku" }}
              initialContent={{
                type: "doc",
                content: [
                  {
                    type: "heading",
                    attrs: { level: 1 },
                    content: [{ type: "text", text: "Non-Disclosure Agreement" }]
                  },
                  {
                    type: "paragraph",
                    content: [{ type: "text", text: "This agreement is entered into on " + new Date().toLocaleDateString() + " between the parties for the purpose of protecting confidential information." }]
                  },
                  {
                    type: "paragraph",
                    content: [{ type: "text", text: "Start editing this document to experience the AI-powered features..." }]
                  }
                ]
              }}
              mode="edit"
              clauses={demoClauses}
              metadata={demoMetadata}
              onChange={(content) => console.log('Document updated:', content)}
              onAudit={(event) => console.log('Audit event:', event)}
              onSuggestionsChange={(suggestions) => console.log('Suggestions:', suggestions)}
            />
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="mt-8 bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Use the AI Editor</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Basic Features</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <strong>Edit Mode:</strong> Direct document editing with rich text formatting</li>
                <li>• <strong>Suggest Mode:</strong> Create insertion and deletion suggestions for review</li>
                <li>• <strong>View Mode:</strong> Read-only document viewing</li>
                <li>• <strong>Clause Library:</strong> Insert predefined legal clauses with variable substitution</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">AI Tools</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <strong>Haki Draft:</strong> Generate complete documents from metadata</li>
                <li>• <strong>Haki Reviews:</strong> Get AI suggestions for document improvements</li>
                <li>• <strong>Haki Lens:</strong> Ask legal research questions and get answers</li>
                <li>• <strong>Export:</strong> Download documents in various formats</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="mt-8 bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Integration</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                TipTap Editor
              </h4>
              <p className="text-sm text-gray-600">
                Built on TipTap, a modern rich text editor with collaborative editing capabilities, 
                custom extensions, and real-time collaboration support.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Gemini AI Integration
              </h4>
              <p className="text-sm text-gray-600">
                Powered by Google's Gemini AI for document generation, review, and research. 
                Specialized prompts for Kenyan legal context and compliance.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <Scale className="w-4 h-4" />
                Audit Trail
              </h4>
              <p className="text-sm text-gray-600">
                Complete audit trail of all document changes, AI interactions, and user actions 
                for compliance and transparency requirements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </LawyerDashboardLayout>
  );
};
