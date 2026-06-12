'use client';

import { useState } from 'react';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import { extractTextFromFile } from '@/lib/ocr';

interface ReportTabProps {
  onReportAnalyzed: (text: string) => void;
}

export default function ReportTab({ onReportAnalyzed }: ReportTabProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    
    try {
      const text = await extractTextFromFile(file);
      if (!text.trim()) {
        setError("No text could be extracted. Please ensure it's a valid text PDF or clear image.");
      } else {
        onReportAnalyzed(text);
      }
    } catch (err: any) {
      setError(`Failed to extract text: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center h-full max-w-2xl mx-auto">
      <div className="text-cyan-400 mb-6 bg-cyan-900/20 p-4 rounded-full">
        <FileText size={48} />
      </div>
      <h2 className="text-2xl font-semibold mb-3">📄 Upload Diagnostic Report</h2>
      <p className="text-gray-400 text-sm mb-8">
        Upload a diagnostic report (PDF, TXT, or scanned image) and the chatbot will automatically extract the text, analyze the contents, and explain it to you.
      </p>

      <div className="w-full">
        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-600 hover:border-cyan-500 hover:bg-cyan-900/10 rounded-xl cursor-pointer transition-colors mb-6 relative overflow-hidden group">
          <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 z-10">
            {file ? (
              <>
                <CheckCircle className="text-green-400 mb-2" size={32} />
                <p className="mb-2 text-sm text-gray-300 font-medium break-all">{file.name}</p>
                <p className="text-xs text-gray-500">Click to change file</p>
              </>
            ) : (
              <>
                <Upload className="text-gray-400 mb-3 group-hover:text-cyan-400 transition-colors" size={32} />
                <p className="mb-2 text-sm text-gray-400"><span className="font-semibold text-cyan-400">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500">PDF, TXT, PNG, or JPG</p>
              </>
            )}
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept=".pdf,.txt,.jpg,.jpeg,.png"
            onChange={handleFileChange}
          />
        </label>

        {error && <div className="text-red-400 text-sm mb-4 bg-red-900/20 p-3 rounded">{error}</div>}

        <button 
          className="btn-primary w-full py-3 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleAnalyze}
          disabled={!file || loading}
        >
          {loading ? (
            <><div className="animate-spin rounded-full h-5 w-5 border-2 border-white"></div> Extracting text...</>
          ) : (
            <>🔍 Analyze & Explain Report</>
          )}
        </button>
      </div>
    </div>
  );
}
