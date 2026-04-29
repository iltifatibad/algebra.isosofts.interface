import React from "react";

const HelpModal = ({ isOpen, onClose, helpData }) => {
  if (!isOpen || !helpData) return null;

  return (
    <div className="fixed inset-0 z-[70] flex justify-end">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-white shadow-2xl h-full overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <i className="fas fa-circle-question text-lg" />
            </div>
            <div>
              <h2 className="text-base font-semibold leading-tight">{helpData.title}</h2>
              <p className="text-xs text-blue-100 mt-0.5">{helpData.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 px-6 py-5 space-y-6">
          {/* Description */}
          {helpData.description && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="text-sm text-blue-800 leading-relaxed">{helpData.description}</p>
            </div>
          )}

          {/* How to add */}
          {helpData.howToAdd && (
            <div>
              <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <i className="fas fa-list-ol text-indigo-400" />
                How to Add Data
              </h3>
              <ol className="space-y-2.5">
                {helpData.howToAdd.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm text-gray-700 leading-relaxed">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-[11px] flex items-center justify-center font-bold mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Field Sections */}
          {helpData.sections?.map((section, si) => (
            <div key={si}>
              <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <i className={`fas ${section.icon || "fa-table-columns"} text-indigo-400`} />
                {section.title}
              </h3>
              <div className="space-y-2">
                {section.fields.map((field, fi) => (
                  <div key={fi} className="border border-gray-100 rounded-xl p-3.5 bg-gray-50/60 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-800">{field.name}</span>
                      <div className="flex gap-1.5 flex-shrink-0 flex-wrap justify-end">
                        {field.required && (
                          <span className="text-[10px] font-medium px-1.5 py-0.5 bg-red-50 text-red-500 border border-red-100 rounded-full">
                            Required
                          </span>
                        )}
                        <span className="text-[10px] font-medium px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-full">
                          {field.type}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{field.description}</p>
                    {field.example && (
                      <p className="text-xs text-indigo-500 mt-1.5 bg-indigo-50 px-2 py-1 rounded-lg">
                        <span className="font-semibold">Example:</span> {field.example}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 sticky bottom-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
          >
            Close Help
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
