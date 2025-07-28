import { useState } from 'react';
import { Upload, FileText, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { LawyerDashboardLayout } from '../../components/layout/LawyerDashboardLayout';

export const AIReviewer = () => {
  const [file, setFile] = useState<File | null>(null);
  const [reviewing, setReviewing] = useState(false);
  const [review, setReview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setReview(null);
      setError(null);
    }
  };

  const handleReview = async () => {
    if (!file) return;
    setReviewing(true);
    setReview(null);
    setError(null);
    // Simulate AI review (replace with real API call)
    setTimeout(() => {
      setReviewing(false);
      setReview("✅ No major issues found. Suggestions:\n- Clarify clause 3.2\n- Add signature section\n- Check for missing dates.");
    }, 2000);
  };

  return (
    <LawyerDashboardLayout>
      <div className="bg-white rounded-xl shadow p-8 max-w-2xl mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary-500" />
          AI Document Reviewer
        </h2>
        <p className="text-gray-600 mb-6">Upload a legal document (PDF, DOCX) and let our AI review it for issues, missing sections, and suggestions.</p>

        {/* Upload/Dropzone */}
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-primary-300 rounded-lg p-6 cursor-pointer hover:bg-primary-50 transition mb-4">
          <Upload className="w-8 h-8 text-primary-400 mb-2" />
          <span className="text-primary-700 font-medium">Click to upload or drag & drop</span>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

        {/* File Preview */}
        {file && (
          <div className="flex items-center gap-4 bg-primary-50 rounded p-3 mb-4">
            <FileText className="w-6 h-6 text-primary-500" />
            <div>
              <div className="font-medium">{file.name}</div>
              <div className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</div>
            </div>
            <button
              className="ml-auto text-xs text-red-500 hover:underline"
              onClick={() => setFile(null)}
            >
              Remove
            </button>
          </div>
        )}

        {/* Review Button */}
        <button
          className="btn btn-primary w-full flex items-center justify-center gap-2"
          disabled={!file || reviewing}
          onClick={handleReview}
        >
          {reviewing ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
          {reviewing ? 'Reviewing...' : 'Review Document'}
        </button>

        {/* AI Review Output */}
        {review && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
            <pre className="text-green-900 whitespace-pre-wrap">{review}</pre>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-1" />
            <span className="text-red-900">{error}</span>
          </div>
        )}
      </div>
    </LawyerDashboardLayout>
  );
}; 