import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Upload, 
  Trash2, 
  Plus, 
  Save, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  FileCheck,
  HeartPulse,
  Bone,
  BedDouble,
  ShieldCheck,
  Award,
  FileSpreadsheet,
  Map
} from 'lucide-react';
import { 
  getStatutoryCompliancesState, 
  saveStatutoryCompliancesState, 
  uploadStatutoryPdf, 
  resetStatutoryCompliancesState 
} from '../../../utils/api';
import { showSuccessAlert, showErrorAlert } from '../../../utils/swal';
import { openPdfDocument } from '../../../utils/pdfViewer';
import ConfirmModal from '../../../components/admin/ConfirmModal/ConfirmModal';

const iconOptions = [
  { label: 'Heart Pulse (Stents)', value: 'HeartPulse', icon: HeartPulse },
  { label: 'Bone (Implants)', value: 'Bone', icon: Bone },
  { label: 'Bed Double (Category)', value: 'BedDouble', icon: BedDouble },
  { label: 'File Text', value: 'FileText', icon: FileText },
  { label: 'Shield Check', value: 'ShieldCheck', icon: ShieldCheck },
  { label: 'Award', value: 'Award', icon: Award },
  { label: 'Spreadsheet', value: 'FileSpreadsheet', icon: FileSpreadsheet }
];

const defaultInitialState = {
  compliances: [
    {
      id: 'comp-1',
      title: 'Coronary Stent Prices',
      icon: 'HeartPulse',
      pdfUrl: '',
      fileName: '',
      updatedAt: new Date().toISOString()
    },
    {
      id: 'comp-2',
      title: 'Knee Implant Prices',
      icon: 'Bone',
      pdfUrl: '',
      fileName: '',
      updatedAt: new Date().toISOString()
    },
    {
      id: 'comp-3',
      title: 'Indigent and Weaker Section Category',
      icon: 'BedDouble',
      pdfUrl: '',
      fileName: '',
      updatedAt: new Date().toISOString()
    }
  ],
  siteMapPdfUrl: '',
  siteMapFileName: ''
};

const StatutoryCompliances = () => {
  const [compliances, setCompliances] = useState([]);
  const [siteMapPdfUrl, setSiteMapPdfUrl] = useState('');
  const [siteMapFileName, setSiteMapFileName] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState(null);
  const [uploadingSiteMap, setUploadingSiteMap] = useState(false);

  // Confirm Modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    actionType: null,
    targetId: null
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getStatutoryCompliancesState(defaultInitialState);
      if (res && Array.isArray(res.compliances)) {
        setCompliances(res.compliances.slice(0, 5)); // Limit to max 5
        setSiteMapPdfUrl(res.siteMapPdfUrl || '');
        setSiteMapFileName(res.siteMapFileName || '');
      } else {
        setCompliances(defaultInitialState.compliances);
        setSiteMapPdfUrl('');
        setSiteMapFileName('');
      }
    } catch (err) {
      console.error('Failed to load statutory compliances:', err);
      setCompliances(defaultInitialState.compliances);
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (id, newTitle) => {
    setCompliances(prev => prev.map(item => item.id === id ? { ...item, title: newTitle } : item));
  };

  const handleIconChange = (id, newIcon) => {
    setCompliances(prev => prev.map(item => item.id === id ? { ...item, icon: newIcon } : item));
  };

  const handlePdfUpload = async (id, file) => {
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      showErrorAlert('Invalid File Format', 'Please select a valid PDF document (.pdf).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) { // 15MB limit
      showErrorAlert('File Too Large', 'Maximum allowed PDF file size is 15 MB.');
      return;
    }

    setUploadingId(id);
    const item = compliances.find(c => c.id === id);
    const itemTitle = item?.title || file.name;

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target.result;
        const uploadRes = await uploadStatutoryPdf(itemTitle, file.name, base64Data);

        if (uploadRes && uploadRes.url) {
          const updatedList = compliances.map(c => {
            if (c.id === id) {
              return {
                ...c,
                pdfUrl: uploadRes.url,
                fileName: file.name,
                updatedAt: new Date().toISOString()
              };
            }
            return c;
          });
          setCompliances(updatedList);

          // Auto-save updated state to database
          await saveStatutoryCompliancesState({
            compliances: updatedList,
            siteMapPdfUrl,
            siteMapFileName,
            updatedAt: new Date().toISOString()
          });

          showSuccessAlert(
            'PDF Uploaded & Saved!',
            `The PDF document for "${itemTitle}" has been uploaded and saved to the database.`
          );
        } else {
          showErrorAlert('Upload Error', 'Failed to upload PDF file. Please try again.');
        }
        setUploadingId(null);
      };

      reader.onerror = () => {
        showErrorAlert('File Reading Failed', 'Could not read selected file.');
        setUploadingId(null);
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error('PDF upload error:', err);
      showErrorAlert('Upload Failed', 'An unexpected error occurred during file upload.');
      setUploadingId(null);
    }
  };

  const handleRemovePdf = async (id) => {
    const updatedList = compliances.map(c => c.id === id ? { ...c, pdfUrl: '', fileName: '' } : c);
    setCompliances(updatedList);
    try {
      await saveStatutoryCompliancesState({
        compliances: updatedList,
        siteMapPdfUrl,
        siteMapFileName,
        updatedAt: new Date().toISOString()
      });
      showSuccessAlert('PDF Removed', 'The PDF link has been removed and saved.');
    } catch (err) {
      console.error('Error saving after PDF removal:', err);
    }
  };

  // Site Map Single PDF Upload
  const handleSiteMapPdfUpload = async (file) => {
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      showErrorAlert('Invalid File Format', 'Please select a valid PDF document (.pdf).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      showErrorAlert('File Too Large', 'Maximum allowed PDF file size is 15 MB.');
      return;
    }

    setUploadingSiteMap(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target.result;
        const uploadRes = await uploadStatutoryPdf('Site Map', file.name, base64Data);

        if (uploadRes && uploadRes.url) {
          setSiteMapPdfUrl(uploadRes.url);
          setSiteMapFileName(file.name);

          await saveStatutoryCompliancesState({
            compliances,
            siteMapPdfUrl: uploadRes.url,
            siteMapFileName: file.name,
            updatedAt: new Date().toISOString()
          });

          showSuccessAlert(
            'Site Map PDF Uploaded!',
            'The Site Map PDF document has been uploaded and linked to the website footer.'
          );
        } else {
          showErrorAlert('Upload Error', 'Failed to upload Site Map PDF file.');
        }
        setUploadingSiteMap(false);
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Site Map upload error:', err);
      showErrorAlert('Upload Failed', 'An error occurred during Site Map PDF upload.');
      setUploadingSiteMap(false);
    }
  };

  const handleRemoveSiteMapPdf = async () => {
    setSiteMapPdfUrl('');
    setSiteMapFileName('');
    try {
      await saveStatutoryCompliancesState({
        compliances,
        siteMapPdfUrl: '',
        siteMapFileName: '',
        updatedAt: new Date().toISOString()
      });
      showSuccessAlert('Site Map Removed', 'The Site Map PDF document has been removed.');
    } catch (err) {
      console.error('Error saving after Site Map removal:', err);
    }
  };

  const handleAddItem = () => {
    if (compliances.length >= 5) {
      showErrorAlert(
        'Maximum Limit Reached',
        'You can add a maximum of 5 Statutory Compliance items. Please remove or edit an existing item.'
      );
      return;
    }

    const newItemId = `comp-${Date.now()}`;
    const newItem = {
      id: newItemId,
      title: 'New Statutory Compliance Item',
      icon: 'FileText',
      pdfUrl: '',
      fileName: '',
      updatedAt: new Date().toISOString()
    };

    setCompliances(prev => [...prev, newItem]);

    setTimeout(() => {
      const newBox = document.getElementById(`compliance-item-${newItemId}`);
      if (newBox) {
        newBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const titleInput = newBox.querySelector('input[type="text"]');
        if (titleInput) {
          titleInput.focus();
          titleInput.select();
        }
      }
    }, 120);
  };

  const handleDeleteItem = (id) => {
    const item = compliances.find(c => c.id === id);
    setConfirmModal({
      isOpen: true,
      title: 'Delete Compliance Item',
      message: `Are you sure you want to delete "${item?.title || 'this compliance item'}"?`,
      actionType: 'delete',
      targetId: id
    });
  };

  const handleResetDefaults = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Reset to Default Compliance Items',
      message: 'This will reset statutory compliances back to hospital defaults. Any custom items created will be removed.',
      actionType: 'reset',
      targetId: null
    });
  };

  const handleConfirmAction = async () => {
    if (confirmModal.actionType === 'delete') {
      const targetId = confirmModal.targetId;
      const updatedList = compliances.filter(c => c.id !== targetId);
      setCompliances(updatedList);
      setConfirmModal({ isOpen: false, title: '', message: '', actionType: null, targetId: null });

      setSaving(true);
      try {
        await saveStatutoryCompliancesState({
          compliances: updatedList,
          siteMapPdfUrl,
          siteMapFileName,
          updatedAt: new Date().toISOString()
        });
        showSuccessAlert('Item Deleted', 'The compliance item has been permanently deleted from the database.');
      } catch (err) {
        console.error('Failed to save after delete:', err);
        showErrorAlert('Delete Failed', 'Failed to update database after deleting item.');
      } finally {
        setSaving(false);
      }
    } else if (confirmModal.actionType === 'reset') {
      setConfirmModal({ isOpen: false, title: '', message: '', actionType: null, targetId: null });
      setSaving(true);
      try {
        const res = await resetStatutoryCompliancesState();
        if (res && res.data && Array.isArray(res.data.compliances)) {
          setCompliances(res.data.compliances.slice(0, 5));
          setSiteMapPdfUrl(res.data.siteMapPdfUrl || '');
          setSiteMapFileName(res.data.siteMapFileName || '');
        } else {
          setCompliances(defaultInitialState.compliances);
          setSiteMapPdfUrl('');
          setSiteMapFileName('');
        }
        showSuccessAlert('Reset Successful', 'Statutory compliances have been reset to hospital defaults.');
      } catch (err) {
        showErrorAlert('Reset Failed', 'Could not reset statutory compliances.');
      } finally {
        setSaving(false);
      }
    }
  };

  const handleSaveChanges = async () => {
    if (compliances.length > 5) {
      showErrorAlert('Validation Error', 'Maximum 5 statutory compliance items allowed.');
      return;
    }

    const emptyItem = compliances.find(c => !c.title.trim());
    if (emptyItem) {
      showErrorAlert('Validation Error', 'All compliance items must have a valid title.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        compliances,
        siteMapPdfUrl,
        siteMapFileName,
        updatedAt: new Date().toISOString()
      };
      await saveStatutoryCompliancesState(payload);
      showSuccessAlert(
        'Changes Saved!',
        'Statutory compliances and Site Map PDF document have been saved and published to the website.'
      );
    } catch (err) {
      console.error('Failed to save statutory compliances:', err);
      showErrorAlert('Save Failed', 'Could not save statutory compliances. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-semibold text-sm">Loading Statutory Compliances & Site Map...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
              <FileCheck size={24} />
            </span>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Statutory Compliances & Site Map Management</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage statutory compliance items (max 5) and upload the official Site Map PDF document.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleAddItem}
            disabled={compliances.length >= 5}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              compliances.length >= 5 
                ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed' 
                : 'text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200'
            }`}
            title={compliances.length >= 5 ? 'Maximum 5 items reached' : 'Add new compliance item'}
          >
            <Plus size={16} />
            <span>Add Compliance Item ({compliances.length}/5)</span>
          </button>

          <button
            onClick={handleSaveChanges}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* SECTION 1: STATUTORY COMPLIANCES (MAX 5 ITEMS) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-blue-950 flex items-center gap-2">
            <span>Statutory Compliance Items</span>
          </h2>

          {compliances.length >= 5 && (
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1">
              <AlertCircle size={14} />
              <span>Maximum 5 Statutory Compliances Reached</span>
            </span>
          )}
        </div>

        {compliances.map((item, index) => {
          const SelectedIconComponent = iconOptions.find(o => o.value === item.icon)?.icon || FileText;

          return (
            <div 
              key={item.id}
              id={`compliance-item-${item.id}`}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-200 transition-all space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center">
                    #{index + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Statutory Item</span>
                </div>

                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-all cursor-pointer"
                  title="Delete compliance item"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* Item Title Input */}
                <div className="md:col-span-6">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Compliance Title *</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleTitleChange(item.id, e.target.value)}
                    placeholder="e.g. Coronary Stent Prices"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white px-3.5 py-2.5 text-xs rounded-xl outline-none font-semibold text-slate-800 transition-all"
                  />
                </div>

                {/* Icon Selection */}
                <div className="md:col-span-6">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Display Icon</label>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center flex-shrink-0">
                      <SelectedIconComponent size={18} />
                    </div>
                    <select
                      value={item.icon || 'FileText'}
                      onChange={(e) => handleIconChange(item.id, e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white px-3 py-2.5 text-xs rounded-xl outline-none font-medium text-slate-700 cursor-pointer"
                    >
                      {iconOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* PDF Document Upload Area */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.pdfUrl ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                    <FileText size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">PDF Document</span>
                      {item.pdfUrl ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          <CheckCircle2 size={12} />
                          <span>PDF Attached</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                          <AlertCircle size={12} />
                          <span>No PDF Uploaded</span>
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5 truncate max-w-xs md:max-w-md">
                      {item.fileName || (item.pdfUrl ? 'Document attached' : 'Upload a PDF file that will open when users click this item.')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 w-full md:w-auto">
                  {item.pdfUrl && (
                    <>
                      <button
                        type="button"
                        onClick={() => openPdfDocument(item.pdfUrl, item.title)}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-blue-700 bg-white border border-blue-200 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
                      >
                        <ExternalLink size={14} />
                        <span>View PDF</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemovePdf(item.id)}
                        className="px-2.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                        title="Remove uploaded PDF"
                      >
                        Remove
                      </button>
                    </>
                  )}

                  <label className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-lg shadow-sm transition-all cursor-pointer">
                    {uploadingId === item.id ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload size={14} />
                        <span>{item.pdfUrl ? 'Replace PDF' : 'Upload PDF'}</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handlePdfUpload(item.id, e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          );
        })}

        {compliances.length === 0 && (
          <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-300">
            <FileText size={36} className="mx-auto text-slate-300 mb-2" />
            <h3 className="text-base font-bold text-slate-700">No Compliance Items Configured</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Click the "Add Compliance Item" button above to create statutory compliance links (up to 5 items).
            </p>
          </div>
        )}
      </div>

      {/* SECTION 2: DEDICATED SITE MAP PDF SECTION */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <span className="p-2 bg-amber-50 text-amber-700 rounded-lg">
            <Map size={20} />
          </span>
          <div>
            <h2 className="text-base font-extrabold text-blue-950">Site Map Document Management</h2>
            <p className="text-xs text-slate-500">
              Upload the official hospital Site Map PDF document (1 file max). Clicking "Site Map" in the website footer will open this PDF.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${siteMapPdfUrl ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
              <Map size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">Hospital Site Map PDF</span>
                {siteMapPdfUrl ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 size={12} />
                    <span>Site Map PDF Linked</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                    <AlertCircle size={12} />
                    <span>No Site Map PDF Uploaded</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1 truncate max-w-xs md:max-w-md">
                {siteMapFileName || (siteMapPdfUrl ? 'Site Map document attached' : 'Select a single PDF file for the hospital site map.')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            {siteMapPdfUrl && (
              <>
                <button
                  type="button"
                  onClick={() => openPdfDocument(siteMapPdfUrl, 'Hospital Site Map')}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-blue-700 bg-white border border-blue-200 hover:bg-blue-50 rounded-xl transition-all cursor-pointer"
                >
                  <ExternalLink size={14} />
                  <span>View Site Map PDF</span>
                </button>
                <button
                  type="button"
                  onClick={handleRemoveSiteMapPdf}
                  className="px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                  title="Remove Site Map PDF"
                >
                  Remove
                </button>
              </>
            )}

            <label className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-blue-900 hover:bg-blue-950 rounded-xl shadow-sm transition-all cursor-pointer">
              {uploadingSiteMap ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Uploading Site Map...</span>
                </>
              ) : (
                <>
                  <Upload size={14} />
                  <span>{siteMapPdfUrl ? 'Replace Site Map PDF' : 'Upload Site Map PDF'}</span>
                </>
              )}
              <input
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleSiteMapPdfUpload(e.target.files[0]);
                  }
                }}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmModal({ isOpen: false, title: '', message: '', actionType: null, targetId: null })}
      />
    </div>
  );
};

export default StatutoryCompliances;
