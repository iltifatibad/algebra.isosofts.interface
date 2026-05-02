import React, { useState } from "react";
import { useUser } from "./UserContext.jsx";
import { getHelpOverride, saveHelpOverride, clearHelpOverride } from "./helpStore.js";

const HelpModal = ({ isOpen, onClose, helpData }) => {
  const { isSuperAdmin } = useUser();
  const [editData, setEditData] = useState(null);
  const [override, setOverride] = useState(() =>
    helpData ? getHelpOverride(helpData.title) : null
  );
  const [openSections, setOpenSections] = useState({});

  if (!isOpen || !helpData) return null;

  const currentData = override || helpData;
  const isEditing = editData !== null;

  const enterEdit = () => {
    setEditData(JSON.parse(JSON.stringify(currentData)));
    setOpenSections({});
  };

  const cancelEdit = () => setEditData(null);

  const saveEdit = () => {
    saveHelpOverride(helpData.title, editData);
    setOverride(editData);
    setEditData(null);
  };

  const resetToDefault = () => {
    clearHelpOverride(helpData.title);
    setOverride(null);
    setEditData(null);
  };

  const upd = (key, val) => setEditData((p) => ({ ...p, [key]: val }));
  const updStep = (i, val) =>
    setEditData((p) => ({
      ...p,
      howToAdd: p.howToAdd.map((s, x) => (x === i ? val : s)),
    }));
  const addStep = () =>
    setEditData((p) => ({ ...p, howToAdd: [...(p.howToAdd || []), ""] }));
  const removeStep = (i) =>
    setEditData((p) => ({
      ...p,
      howToAdd: p.howToAdd.filter((_, x) => x !== i),
    }));
  const updSection = (si, key, val) =>
    setEditData((p) => ({
      ...p,
      sections: p.sections.map((s, x) => (x === si ? { ...s, [key]: val } : s)),
    }));
  const updFieldProp = (si, fi, key, val) =>
    setEditData((p) => ({
      ...p,
      sections: p.sections.map((s, sx) =>
        sx !== si
          ? s
          : {
              ...s,
              fields: s.fields.map((f, fx) =>
                fx !== fi ? f : { ...f, [key]: val }
              ),
            }
      ),
    }));
  const toggleSection = (si) =>
    setOpenSections((p) => ({ ...p, [si]: !p[si] }));

  // ─── EDIT MODE ───────────────────────────────────────────────
  if (isEditing) {
    return (
      <div className="fixed inset-0 z-[70] flex justify-end">
        <div
          className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          onClick={cancelEdit}
        />
        <div className="relative w-full max-w-xl bg-white shadow-2xl h-full overflow-y-auto flex flex-col">
          {/* Edit Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <i className="fas fa-pen text-base" />
              </div>
              <div>
                <h2 className="text-base font-semibold leading-tight">
                  Edit Help Content
                </h2>
                <p className="text-xs text-amber-100 mt-0.5">Super Admin Mode</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={saveEdit}
                className="px-3 py-1.5 text-xs font-semibold bg-white text-amber-600 rounded-lg hover:bg-amber-50 transition-colors"
              >
                Save
              </button>
              <button
                onClick={cancelEdit}
                className="px-3 py-1.5 text-xs font-semibold bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>

          <div className="flex-1 px-6 py-5 space-y-5">
            {/* Basic Info */}
            <div className="space-y-3">
              <label className="block">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
                  Module Title
                </span>
                <input
                  value={editData.title}
                  onChange={(e) => upd("title", e.target.value)}
                  className="mt-1 w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </label>
              <label className="block">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
                  Subtitle
                </span>
                <input
                  value={editData.subtitle || ""}
                  onChange={(e) => upd("subtitle", e.target.value)}
                  className="mt-1 w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </label>
              <label className="block">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
                  Description
                </span>
                <textarea
                  value={editData.description || ""}
                  onChange={(e) => upd("description", e.target.value)}
                  rows={3}
                  className="mt-1 w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                />
              </label>
            </div>

            {/* howToAdd */}
            {editData.howToAdd && (
              <div>
                <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <i className="fas fa-list-ol text-amber-400" />
                  How to Add Steps
                </h3>
                <div className="space-y-2">
                  {editData.howToAdd.map((step, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <span className="flex-shrink-0 w-5 h-5 mt-2 rounded-full bg-amber-100 text-amber-600 text-[11px] flex items-center justify-center font-bold">
                        {i + 1}
                      </span>
                      <input
                        value={step}
                        onChange={(e) => updStep(i, e.target.value)}
                        className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                      <button
                        onClick={() => removeStep(i)}
                        className="mt-2 w-6 h-6 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                      >
                        <i className="fas fa-times text-xs" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addStep}
                    className="mt-1 text-xs text-amber-600 hover:text-amber-700 flex items-center gap-1 font-semibold"
                  >
                    <i className="fas fa-plus text-[10px]" /> Add Step
                  </button>
                </div>
              </div>
            )}

            {/* Sections */}
            {editData.sections?.map((section, si) => (
              <div key={si} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleSection(si)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                >
                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <i
                      className={`fas ${section.icon || "fa-table-columns"} text-amber-400`}
                    />
                    {section.title}
                    <span className="text-gray-400 font-normal normal-case tracking-normal">
                      ({section.fields.length} fields)
                    </span>
                  </span>
                  <i
                    className={`fas fa-chevron-${openSections[si] ? "up" : "down"} text-gray-400 text-xs`}
                  />
                </button>

                {openSections[si] && (
                  <div className="px-4 py-3 space-y-3 bg-white">
                    <div className="flex gap-2">
                      <label className="flex-1">
                        <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                          Section Title
                        </span>
                        <input
                          value={section.title}
                          onChange={(e) => updSection(si, "title", e.target.value)}
                          className="mt-1 w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      </label>
                      <label className="w-36">
                        <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                          FA Icon
                        </span>
                        <input
                          value={section.icon || ""}
                          onChange={(e) => updSection(si, "icon", e.target.value)}
                          placeholder="fa-table-columns"
                          className="mt-1 w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      </label>
                    </div>

                    <div className="space-y-2">
                      {section.fields.map((field, fi) => (
                        <div
                          key={fi}
                          className="border border-gray-100 rounded-lg p-3 bg-gray-50/50"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <input
                              value={field.name}
                              onChange={(e) =>
                                updFieldProp(si, fi, "name", e.target.value)
                              }
                              placeholder="Field name"
                              className="flex-1 text-xs font-semibold border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-amber-300"
                            />
                            <label className="flex items-center gap-1 text-xs text-gray-500 cursor-pointer flex-shrink-0">
                              <input
                                type="checkbox"
                                checked={!!field.required}
                                onChange={(e) =>
                                  updFieldProp(si, fi, "required", e.target.checked)
                                }
                                className="accent-red-400"
                              />
                              Required
                            </label>
                            <input
                              value={field.type}
                              onChange={(e) =>
                                updFieldProp(si, fi, "type", e.target.value)
                              }
                              className="w-28 text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-amber-300"
                              placeholder="Type"
                            />
                          </div>
                          <textarea
                            value={field.description}
                            onChange={(e) =>
                              updFieldProp(si, fi, "description", e.target.value)
                            }
                            rows={2}
                            placeholder="Description"
                            className="w-full text-xs border border-gray-200 rounded px-2 py-1 mb-1.5 resize-none focus:outline-none focus:ring-1 focus:ring-amber-300"
                          />
                          <input
                            value={field.example || ""}
                            onChange={(e) =>
                              updFieldProp(si, fi, "example", e.target.value)
                            }
                            placeholder="Example value"
                            className="w-full text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-amber-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Edit Footer */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 sticky bottom-0 flex gap-2">
            <button
              onClick={saveEdit}
              className="flex-1 py-2.5 text-sm font-semibold text-white bg-amber-500 rounded-xl hover:bg-amber-600 transition-all"
            >
              Save Changes
            </button>
            <button
              onClick={resetToDefault}
              className="py-2.5 px-4 text-sm font-medium text-red-500 bg-white border border-red-200 rounded-xl hover:bg-red-50 transition-all"
            >
              Reset
            </button>
            <button
              onClick={cancelEdit}
              className="py-2.5 px-4 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── VIEW MODE ───────────────────────────────────────────────
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
              <h2 className="text-base font-semibold leading-tight">
                {currentData.title}
              </h2>
              <p className="text-xs text-blue-100 mt-0.5">{currentData.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {override && (
              <span className="text-[10px] bg-amber-400/30 text-amber-100 px-2 py-0.5 rounded-full font-medium">
                Edited
              </span>
            )}
            {isSuperAdmin && (
              <button
                onClick={enterEdit}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                title="Edit Help Content"
              >
                <i className="fas fa-pen text-xs" />
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 px-6 py-5 space-y-6">
          {/* Description */}
          {currentData.description && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="text-sm text-blue-800 leading-relaxed">
                {currentData.description}
              </p>
            </div>
          )}

          {/* How to add */}
          {currentData.howToAdd && (
            <div>
              <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <i className="fas fa-list-ol text-indigo-400" />
                How to Add Data
              </h3>
              <ol className="space-y-2.5">
                {currentData.howToAdd.map((step, i) => (
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
          {currentData.sections?.map((section, si) => (
            <div key={si}>
              <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <i
                  className={`fas ${section.icon || "fa-table-columns"} text-indigo-400`}
                />
                {section.title}
              </h3>
              <div className="space-y-2">
                {section.fields.map((field, fi) => (
                  <div
                    key={fi}
                    className="border border-gray-100 rounded-xl p-3.5 bg-gray-50/60 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-800">
                        {field.name}
                      </span>
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
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {field.description}
                    </p>
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
