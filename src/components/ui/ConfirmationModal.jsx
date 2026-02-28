import React from 'react';

const ConfirmationModal = ({
  isOpen,
  title = "Konfirmasi",
  message,
  onConfirm,
  onCancel,
  confirmText = "Yakin",
  cancelText = "Batal",
  type = "danger"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in" onClick={onCancel}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-sm md:max-w-md w-full p-6 text-center transform transition-all scale-100 animate-scale-in border border-gray-100 dark:border-gray-700" onClick={e => e.stopPropagation()}>
        <div className={`flex items-center justify-center w-12 h-12 mx-auto rounded-full mb-4 ${type === 'danger' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
          <span className="text-2xl">{type === 'danger' ? '⚠️' : 'ℹ️'}</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm md:text-base">{message}</p>
        <div className="flex justify-center gap-3">
          <button onClick={onCancel} className="px-5 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-5 py-2.5 text-sm font-bold text-white rounded-lg transition-colors shadow-md ${type === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
