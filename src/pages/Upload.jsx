import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVault } from '../context/VaultContext';
import DuplicateModal from '../components/materials/DuplicateModal';
import { 
  Upload as UploadIcon, FileText, CheckCircle2, AlertTriangle, 
  Sparkles, RefreshCw, ArrowRight, ShieldCheck, HardDrive, 
  HelpCircle, X, Layers, Brain, FolderCheck 
} from 'lucide-react';

export default function Upload() {
  const navigate = useNavigate();
  const { addMaterial, checkDuplicate, showToast } = useVault();

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('idle'); // 'idle' | 'processing' | 'duplicate_detected' | 'success'
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [duplicateInfo, setDuplicateInfo] = useState(null);
  const [organizedResult, setOrganizedResult] = useState(null);

  const processingSteps = [
    { label: 'Uploading file securely...', duration: 700 },
    { label: 'Extracting text and scanning structure...', duration: 800 },
    { label: 'AI Detecting Subject: Database Management Systems...', duration: 750 },
    { label: 'AI Detecting Topic: Relational Normalization (Unit 3)...', duration: 700 },
    { label: 'Checking for duplicates in student vault...', duration: 650 },
    { label: 'Classifying and organizing into course tree...', duration: 600 },
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file) => {
    setSelectedFile(file);
    startAIProcessing(file.name);
  };

  // Mock demo trigger for hackathon: click sample file
  const handleSelectDemoFile = (fileName = 'DBMS_Unit3_Notes.pdf') => {
    const mockFile = {
      name: fileName,
      size: 2450000,
      type: 'application/pdf'
    };
    setSelectedFile(mockFile);
    startAIProcessing(mockFile.name);
  };

  const startAIProcessing = (fileName) => {
    setUploadStatus('processing');
    setCurrentStepIndex(0);

    // Step through the AI processing pipeline
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      if (step < processingSteps.length) {
        setCurrentStepIndex(step);
      } else {
        clearInterval(interval);
        finishProcessing(fileName);
      }
    }, 650);
  };

  const finishProcessing = (fileName) => {
    // Check if this file triggers duplicate detection
    const dupCheck = checkDuplicate(fileName);

    if (dupCheck.isDuplicate) {
      setDuplicateInfo(dupCheck);
      setUploadStatus('duplicate_detected');
    } else {
      finalizeSuccess(fileName);
    }
  };

  const finalizeSuccess = (fileName) => {
    const newMat = {
      id: `uploaded-${Date.now()}`,
      title: fileName.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
      subject: 'Database Management Systems',
      topic: 'Normalization',
      unit: 'Unit 3',
      type: 'PDF',
      fileSize: '2.4 MB',
      uploadedDate: 'Just now',
      uploadedBy: 'You (Arjun)',
      source: 'Direct Upload',
      verificationStatus: 'pending',
      summary: 'Automatically parsed lecture notes covering 1NF, 2NF, 3NF, BCNF decomposition and dependency preservation.',
      keyConcepts: ['Functional Dependency', '1NF', '2NF', '3NF', 'BCNF'],
      examRelevance: 5,
      healthScore: 94
    };

    addMaterial(newMat);
    setOrganizedResult(newMat);
    setUploadStatus('success');
  };

  const handleResolveDuplicate = (decision) => {
    // 'keep_both' | 'replace' | 'cancel'
    if (decision === 'cancel') {
      setUploadStatus('idle');
      setSelectedFile(null);
      setDuplicateInfo(null);
    } else {
      finalizeSuccess(selectedFile.name);
      setDuplicateInfo(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Upload Study Material
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Drop any notes, PDFs, slides, or links. StudyVault’s AI automatically categorizes subject, topic, unit, and checks for duplicates.
        </p>
      </div>

      {/* Main Drag & Drop Zone */}
      {uploadStatus === 'idle' && (
        <div className="space-y-4">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-3xl p-10 sm:p-14 text-center transition-all bg-white dark:bg-navy-900 ${
              dragActive
                ? 'border-vault-500 bg-vault-50/60 dark:bg-vault-950/40 scale-[1.01]'
                : 'border-slate-300 dark:border-navy-700 hover:border-vault-400'
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-vault-50 dark:bg-vault-950/80 text-vault-600 dark:text-vault-400 mx-auto flex items-center justify-center mb-4 shadow-sm">
              <UploadIcon className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              Drop your study material here
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
              Drag & drop PDFs, handwritten notes, PPTs, or Word documents. AI will parse and organize everything.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <label className="cursor-pointer bg-vault-600 hover:bg-vault-700 text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition-all">
                <span>Browse Files</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileInput}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.png"
                />
              </label>

              {/* Hackathon Demo Preset Trigger */}
              <button
                type="button"
                onClick={() => handleSelectDemoFile('DBMS_Unit3_Notes.pdf')}
                className="bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold px-4 py-3 rounded-xl border border-slate-200 dark:border-navy-700 transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-vault-600" />
                <span>Simulate Demo: DBMS_Unit3_Notes.pdf</span>
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-navy-800 text-xs text-slate-400 flex flex-wrap items-center justify-center gap-4">
              <span>✓ Supported: PDF, PPTX, DOCX, JPG, PNG, URL links</span>
              <span>✓ Max file size: 50MB</span>
              <span>✓ OCR Enabled for handwritten notes</span>
            </div>
          </div>
        </div>
      )}

      {/* AI Processing Animation Stage */}
      {uploadStatus === 'processing' && (
        <div className="bg-white dark:bg-navy-900 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-navy-800 shadow-vault-md text-center max-w-xl mx-auto space-y-6 animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-vault-600 text-white mx-auto flex items-center justify-center shadow-lg relative">
            <Brain className="w-8 h-8 animate-pulse" />
            <div className="absolute inset-0 rounded-2xl border-2 border-vault-300 animate-ping opacity-25" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              AI Study Assistant Processing
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              File: <strong className="text-slate-800 dark:text-slate-200">{selectedFile?.name}</strong>
            </p>
          </div>

          {/* Stepper Display */}
          <div className="space-y-3 text-left bg-slate-50 dark:bg-navy-950/60 p-5 rounded-2xl border border-slate-100 dark:border-navy-800">
            {processingSteps.map((step, idx) => {
              const isCompleted = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 text-xs transition-all ${
                    isCompleted
                      ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                      : isCurrent
                      ? 'text-vault-600 dark:text-vault-400 font-bold scale-[1.01]'
                      : 'text-slate-400 opacity-60'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : isCurrent ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-vault-600 shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-navy-700 shrink-0" />
                  )}
                  <span>{step.label}</span>
                </div>
              );
            })}
          </div>

          <div className="w-full bg-slate-100 dark:bg-navy-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-vault-600 h-full transition-all duration-300 rounded-full"
              style={{
                width: `${((currentStepIndex + 1) / processingSteps.length) * 100}%`
              }}
            />
          </div>
        </div>
      )}

      {/* Duplicate Modal Triggered If Matched */}
      {uploadStatus === 'duplicate_detected' && duplicateInfo && (
        <DuplicateModal
          isOpen={true}
          duplicateInfo={duplicateInfo}
          uploadedFile={selectedFile || { name: 'DBMS_Unit3_Notes.pdf' }}
          existingMaterial={duplicateInfo.matchedMaterial}
          similarityPercentage={duplicateInfo.similarityPercentage || 92}
          onClose={() => setUploadStatus('idle')}
          onKeepBoth={() => handleResolveDuplicate('keep_both')}
          onReplace={() => handleResolveDuplicate('replace')}
          onResolve={handleResolveDuplicate}
        />
      )}

      {/* Success & Auto-Organized Summary Card */}
      {uploadStatus === 'success' && organizedResult && (
        <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 border border-emerald-200 dark:border-emerald-900/60 shadow-vault-md space-y-6 animate-fadeIn">
          <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center">
              <FolderCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Material Organized Successfully!
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                StudyVault AI automatically tagged, structured, and cataloged this file into your vault.
              </p>
            </div>
          </div>

          {/* AI Auto-Organization Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 dark:bg-navy-950 p-3.5 rounded-xl border border-slate-100 dark:border-navy-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Detected Subject</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                {organizedResult.subject}
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-navy-950 p-3.5 rounded-xl border border-slate-100 dark:border-navy-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Detected Topic</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                {organizedResult.topic}
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-navy-950 p-3.5 rounded-xl border border-slate-100 dark:border-navy-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Syllabus Unit</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                {organizedResult.unit}
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-navy-950 p-3.5 rounded-xl border border-slate-100 dark:border-navy-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">AI Confidence</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 94%
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100 dark:border-navy-800">
            <button
              onClick={() => navigate(`/material/${organizedResult.id}`)}
              className="bg-vault-600 hover:bg-vault-700 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-colors"
            >
              <span>View Material Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/vault')}
              className="border border-slate-200 dark:border-navy-700 hover:bg-slate-50 dark:hover:bg-navy-800 text-slate-700 dark:text-slate-300 font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-colors"
            >
              Go to My Vault
            </button>

            <button
              onClick={() => {
                setUploadStatus('idle');
                setSelectedFile(null);
                setOrganizedResult(null);
              }}
              className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-xs font-medium ml-auto"
            >
              Upload another file
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
