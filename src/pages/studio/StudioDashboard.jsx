import React, { useState, useEffect } from 'react';
import { ReactSortable } from "react-sortablejs";
import { copyToClipboard, downloadJSON, readExcel, readWorkbook, sheetToJson, removeHarakat } from '../../utils/studioUtils';
import HelpImportExcel from '../../components/studio/HelpImportExcel';
import ConfirmationModal from '../../components/ui/ConfirmationModal';

// Define levels and colors consistent with main app
const levels = {
    'Ibtida’i': { color: 'green', title: 'Tingkat Ibtida’i' },
    'Mutawassit': { color: 'yellow', title: 'Tingkat Mutawassit' },
    'Mutaqaddim': { color: 'red', title: 'Tingkat Mutaqaddim' }
};

const StudioDashboard = ({ masterIndex, onEdit, onCreate, onDelete, onUpdateOrder }) => {
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, lessonId: null });
    const [filterLevel, setFilterLevel] = useState('All');
    const [sortConfig, setSortConfig] = useState({ key: 'default', direction: 'asc' });
    const [isHelpOpen, setIsHelpOpen] = useState(false);

    // Sort Helper
    const sortLessons = (lessons) => {
        if (sortConfig.key === 'default') return lessons;

        return [...lessons].sort((a, b) => {
            let valA, valB;

            if (sortConfig.key === 'title') {
                valA = a.title.toLowerCase();
                valB = b.title.toLowerCase();
            } else if (sortConfig.key === 'date') {
                valA = a.lastModified || '';
                valB = b.lastModified || '';
            } else if (sortConfig.key === 'filename') {
                // Parse filename from path: "data/1-ibtidai/1-1-judul.json" -> "1-1-judul"
                const getFilename = (path) => path ? path.split('/').pop().replace('.json', '') : '';
                valA = getFilename(a.path);
                valB = getFilename(b.path);

                // Try natural sort for numbers "1-1", "10-1"
                return sortConfig.direction === 'asc'
                    ? valA.localeCompare(valB, undefined, { numeric: true, sensitivity: 'base' })
                    : valB.localeCompare(valA, undefined, { numeric: true, sensitivity: 'base' });
            }

            if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    };

    const showToast = (msg, type = 'info') => {
        setToast({ show: true, message: msg, type });
    };

    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => {
                setToast(prev => ({ ...prev, show: false }));
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [toast.show]);

    const confirmDelete = () => {
        if (deleteModal.lessonId) {
            onDelete(deleteModal.lessonId);
            showToast("Pelajaran dihapus sementara.", "warning");
            setDeleteModal({ isOpen: false, lessonId: null });
        }
    };

    const handleDeleteClick = (lessonId) => {
        setDeleteModal({ isOpen: true, lessonId });
    };

    // Helper to update master index when a group is reordered
    const handleGroupUpdate = (levelKey, newList) => {
        // 1. Get managed levels to preserve order of groups
        const managedLevels = Object.keys(levels);

        // 2. Extract lessons that are NOT in any of our managed levels (safeguard against data loss)
        const unmanagedLessons = masterIndex.filter(l => !managedLevels.includes(l.level));

        // 3. Rebuild the list level by level
        let newMasterIndex = [];

        managedLevels.forEach(lvl => {
            if (lvl === levelKey) {
                // Use the new list for the modified level
                newMasterIndex = [...newMasterIndex, ...newList];
            } else {
                // Use existing lessons for other levels
                const levelLessons = masterIndex.filter(l => l.level === lvl);
                newMasterIndex = [...newMasterIndex, ...levelLessons];
            }
        });

        // 4. Append unmanaged lessons (if any)
        newMasterIndex = [...newMasterIndex, ...unmanagedLessons];

        onUpdateOrder(newMasterIndex);
        // showToast("Urutan diperbarui. Klik 'Download Index' untuk menyimpan permanen.", "success");
    };

    const handleCopyIndex = async () => {
        let processedIndex = [...masterIndex];

        // If sorting is active (not default), apply sort
        if (sortConfig.key !== 'default') {
            processedIndex = sortLessons(processedIndex);
        }

        const success = await copyToClipboard(JSON.stringify(processedIndex, null, 2));
        if (success) showToast("Master Index disalin ke clipboard (sesuai urutan tampilan)!", "success");
    };

    const handleDownloadIndex = () => {
        let processedIndex = [...masterIndex];

        // If sorting is active (not default), apply sort
        if (sortConfig.key !== 'default') {
            processedIndex = sortLessons(processedIndex);
        }

        downloadJSON(processedIndex, 'master-index.json');
        showToast("Master Index berhasil didownload (sesuai urutan tampilan)!", "success");
    };

    const handleImportExcel = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            // Using a modified readExcel to return workbook or sheets
            // Since readExcel currently returns just the first sheet data, we need to modify utils.js OR 
            // handle it here if we import XLSX directly. 
            // BUT utils.js abstracts XLSX. Let's update utils.js first to support multiple sheets or return the workbook.
            // Wait, I can't update utils.js in this step easily without context switch.
            // Let's assume I will update utils.js to export `readExcelWorkbook`.
            // FOR NOW, I will implement a local reader here or update utils.js in next step?
            // Better: Update utils.js to return all sheets.

            // Re-importing XLSX here just for this complex operation might be easier than changing potentially shared utils.
            // But let's check utils.js content again. It uses 'xlsx'.
            // I'll update utils.js to export `readWorkbook` in the next step.
            // For now, let's write the logic assuming `readWorkbook` exists.

            const workbook = await readWorkbook(file);

            // 1. Parse Info Sheet
            let lessonMetadata = {
                title: "Imported Lesson",
                titleArabic: "درس مستورد",
                level: "Ibtida’i",
                fullTranslation: "",
                reference: ""
            };

            const infoSheet = workbook.Sheets['Info'];
            if (infoSheet) {
                const infoData = sheetToJson(infoSheet);
                infoData.forEach(row => {
                    const key = (row[0] || '').toLowerCase().trim();
                    const value = row[1] || '';
                    if (key.includes('judul latin')) lessonMetadata.title = value;
                    if (key.includes('judul arab')) lessonMetadata.titleArabic = value;
                    if (key.includes('level')) {
                        let level = value.toLowerCase().trim();
                        if (level.includes('ibtida')) lessonMetadata.level = "Ibtida’i";
                        else if (level.includes('mutawas')) lessonMetadata.level = "Mutawassit";
                        else if (level.includes('mutaqad')) lessonMetadata.level = "Mutaqaddim";
                    }
                    if (key.includes('terjemahan lengkap')) lessonMetadata.fullTranslation = value;
                    if (key.includes('referensi') || key.includes('sumber') || key.includes('reference')) lessonMetadata.reference = value;
                });
            }

            // 2. Parse Materi Sheet
            const textData = [];
            let currentParagraph = [];
            const materiSheet = workbook.Sheets['Materi'] || workbook.Sheets[workbook.SheetNames[0]]; // Fallback to first sheet

            if (materiSheet) {
                const rows = sheetToJson(materiSheet);
                // Skip header (row 0)
                for (let i = 1; i < rows.length; i++) {
                    const row = rows[i];
                    // Empty row = new paragraph
                    if (!row || row.length === 0) {
                        if (currentParagraph.length > 0) {
                            textData.push(currentParagraph);
                            currentParagraph = [];
                        }
                        continue;
                    }

                    const arabic = row[0] || "";
                    if (!arabic) {
                        if (currentParagraph.length > 0) {
                            textData.push(currentParagraph);
                            currentParagraph = [];
                        }
                        continue;
                    }

                    const translation = row[1] || "";
                    const irab = row[2] || "";
                    const ngaLogatRaw = row[3] || ""; // Col D
                    const tasykilRaw = row[4] || ""; // Col E

                    // Parse Nga Logat: "utawi:top-right;iku:top-left"
                    const nga_logat = [];
                    if (ngaLogatRaw) {
                        const parts = ngaLogatRaw.split(';');
                        parts.forEach(part => {
                            const [symbol, position] = part.split(':').map(s => s.trim());
                            if (symbol && position) {
                                nga_logat.push({ symbol, position });
                            }
                        });
                    }

                    // Parse Tasykil Options: "opt1,opt2"
                    const tasykil_options = tasykilRaw ? tasykilRaw.split(',').map(s => s.trim()).filter(s => s) : [];

                    currentParagraph.push({
                        berharakat: arabic,
                        gundul: removeHarakat(arabic),
                        terjemahan: translation,
                        irab: irab,
                        link: '',
                        nga_logat: nga_logat,
                        tasykil_options: tasykil_options
                    });
                }
                if (currentParagraph.length > 0) textData.push(currentParagraph);
            }

            // 3. Parse Kuis Sheet
            const quizData = [];
            const kuisSheet = workbook.Sheets['Kuis'];
            if (kuisSheet) {
                const rows = sheetToJson(kuisSheet);
                // Header: question, context, opt1, opt2, opt3, opt4, correct, explanation
                for (let i = 1; i < rows.length; i++) {
                    const row = rows[i];
                    if (!row || !row[0]) continue;

                    const question = row[0];
                    const context = row[1] || "";
                    const options = [row[2], row[3], row[4], row[5]].filter(o => o !== undefined && o !== "");
                    const correctAnswer = parseInt(row[6] || "0");
                    const explanation = row[7] || "";

                    quizData.push({
                        question,
                        context,
                        options,
                        correctAnswer,
                        explanation
                    });
                }
            }

            const newLesson = {
                id: `import-${Date.now()}`,
                ...lessonMetadata,
                textData: textData,
                quizData: quizData,
                path: '' // Will be set on save
            };

            onCreate(newLesson);
            showToast("Lesson imported successfully from 3 sheets!", "success");

        } catch (err) {
            console.error(err);
            alert("Gagal membaca file Excel. Pastikan format sesuai panduan.");
        }
    };

    return (
        <div className="p-6 relative">
            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                title="Hapus Pelajaran?"
                message="Apakah Anda yakin ingin menghapus pelajaran ini dari daftar sementara? Perubahan ini belum disimpan ke file asli."
                onConfirm={confirmDelete}
                onCancel={() => setDeleteModal({ isOpen: false, lessonId: null })}
                confirmText="Hapus"
                type="danger"
            />

            {/* Toast Notification */}
            {toast.show && (
                <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl flex items-center space-x-4 z-50 animate-bounce transition-all duration-300 ${toast.type === 'success' ? 'bg-green-600 text-white' :
                    toast.type === 'warning' ? 'bg-orange-600 text-white' : 'bg-gray-800 text-white'
                    }`}>
                    <span className="font-medium">{toast.message}</span>
                    <div className="flex space-x-2 border-l border-white/30 pl-3 ml-2">
                        <button
                            onClick={handleCopyIndex}
                            className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition font-bold"
                            title="Copy JSON"
                        >
                            📋 Copy
                        </button>
                        <button
                            onClick={handleDownloadIndex}
                            className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition font-bold"
                            title="Download JSON"
                        >
                            ⬇️ JSON
                        </button>
                    </div>
                </div>
            )}

            {/* Header Actions */}
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Daftar Pelajaran</h2>
                <div className="flex space-x-4">
                    <button
                        onClick={handleCopyIndex}
                        className="flex items-center space-x-2 bg-orange-100 hover:bg-orange-200 text-orange-700 px-4 py-2 rounded-lg font-bold shadow-sm transition"
                        title="Copy ke Clipboard"
                    >
                        <span>📋 Copy</span>
                    </button>
                    <button
                        onClick={handleDownloadIndex}
                        className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold shadow transition"
                    >
                        <span>⬇️ Download Index</span>
                    </button>

                    <div className="relative">
                        <input
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={handleImportExcel}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <button
                            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold shadow transition"
                        >
                            <span>📤 Import Excel</span>
                        </button>
                    </div>

                    <button
                        onClick={() => setIsHelpOpen(true)}
                        className="p-2 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition dark:bg-gray-700 dark:text-gray-300"
                        title="Panduan Format Excel"
                    >
                        ❓
                    </button>

                    <button
                        onClick={() => onCreate()}
                        className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold shadow transition"
                    >
                        <span>+ Tambah Baru</span>
                    </button>
                </div>
            </div>

            {/* Filter & Sort Controls */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
                {/* Filter Tabs */}
                <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                    {['All', 'Ibtida’i', 'Mutawassit', 'Mutaqaddim'].map(level => (
                        <button
                            key={level}
                            onClick={() => setFilterLevel(level)}
                            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${filterLevel === level
                                ? 'bg-teal-600 text-white shadow-md'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            {level === 'All' ? 'Semua Level' : level}
                        </button>
                    ))}
                </div>

                {/* Sort Controls */}
                <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
                    <span className="text-sm font-bold text-gray-500 mr-2 hidden md:inline">Urutkan:</span>
                    <select
                        value={sortConfig.key}
                        onChange={(e) => {
                            setSortConfig(prev => ({ ...prev, key: e.target.value }));
                            showToast(`Urutan diubah berdasarkan ${e.target.options[e.target.selectedIndex].text}`, 'info');
                        }}
                        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700"
                    >
                        <option value="default">Default (Topik)</option>
                        <option value="title">Judul</option>
                        <option value="date">Terbaru</option>
                        <option value="filename">Nama File</option>
                    </select>

                    {sortConfig.key !== 'default' && (
                        <button
                            onClick={() => setSortConfig(prev => ({ ...prev, direction: prev.direction === 'asc' ? 'desc' : 'asc' }))}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                            title={sortConfig.direction === 'asc' ? "Urutan Naik (A-Z)" : "Urutan Turun (Z-A)"}
                        >
                            {sortConfig.direction === 'asc' ? '⬆️' : '⬇️'}
                        </button>
                    )}
                </div>
            </div>

            {/* Render Groups */}
            <div className="space-y-12">
                {
                    Object.entries(levels)
                        .filter(([key]) => filterLevel === 'All' || filterLevel === key)
                        .map(([levelKey, levelInfo]) => {
                            const lessons = masterIndex.filter(l => l.level === levelKey);
                            // Even if empty, show the section so we can drop into it (future enhancement)
                            if (lessons.length === 0) return null;

                            const sortedLessons = sortLessons(lessons);
                            const isDraggable = sortConfig.key === 'default' && filterLevel === 'All';

                            return (
                                <section key={levelKey}>
                                    <div className="flex items-center space-x-4 mb-6">
                                        <h3 className={`text-2xl font-bold text-${levelInfo.color}-600 dark:text-${levelInfo.color}-400`}>
                                            {levelInfo.title}
                                        </h3>
                                        <div className={`h-1 flex-1 bg-${levelInfo.color}-100 dark:bg-${levelInfo.color}-900/30 rounded-full`}></div>
                                    </div>

                                    {isDraggable ? (
                                        <ReactSortable
                                            list={sortedLessons}
                                            setList={(newList) => handleGroupUpdate(levelKey, newList)}
                                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                                            animation={150}
                                            ghostClass="bg-blue-100"
                                        >
                                            {sortedLessons.map((lesson) => (
                                                <LessonCard
                                                    key={lesson.id}
                                                    lesson={lesson}
                                                    levelInfo={levelInfo}
                                                    onEdit={onEdit}
                                                    handleDeleteClick={handleDeleteClick}
                                                />
                                            ))}
                                        </ReactSortable>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                            {sortedLessons.map((lesson) => (
                                                <LessonCard
                                                    key={lesson.id}
                                                    lesson={lesson}
                                                    levelInfo={levelInfo}
                                                    onEdit={onEdit}
                                                    handleDeleteClick={handleDeleteClick}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </section>
                            );
                        })
                }
            </div>

            {
                masterIndex.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        Belum ada pelajaran. Silakan tambahkan pelajaran baru.
                    </div>
                )
            }

            <HelpImportExcel isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
        </div>
    );
};

const LessonCard = ({ lesson, levelInfo, onEdit, handleDeleteClick }) => {
    return (
        <div
            className={`bg-white dark:bg-gray-700 rounded-lg shadow-md p-4 flex flex-col justify-between border-l-4 border-${levelInfo.color}-500 hover:shadow-lg transition cursor-pointer group relative`}
            onClick={() => onEdit(lesson.id)}
        >
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(lesson.id);
                }}
                className="absolute top-2 right-2 text-gray-300 hover:text-red-500 transition-colors z-10"
                title="Hapus Pelajaran"
            >
                🗑️
            </button>
            <div>
                <div className="flex justify-between items-start mb-2 pr-6">
                    <span className={`text-xs font-bold uppercase text-${levelInfo.color}-600 bg-${levelInfo.color}-100 px-2 py-1 rounded`}>
                        {lesson.level}
                    </span>
                    <span className="text-xs text-gray-400 group-hover:text-gray-600 transition-colors">ID: {lesson.id.substring(0, 8)}...</span>
                </div>
                <h3 className="text-lg font-bold text-right font-arabic mb-1 text-gray-800 dark:text-gray-100" dir="rtl">{lesson.titleArabic}</h3>
                <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300">{lesson.title}</h4>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2 font-arabic text-right leading-relaxed" dir="rtl">{lesson.preview || "Belum ada preview"}</p>

                {/* Filename Preview */}
                <p className="text-xs text-gray-400 mt-2 font-mono truncate">
                    {lesson.path ? lesson.path.split('/').pop() : 'No file'}
                </p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-600 flex justify-end">
                <span className="text-xs text-teal-600 dark:text-teal-400 font-bold hover:underline">
                    Edit Pelajaran &rarr;
                </span>
            </div>
        </div>
    );
};

export default StudioDashboard;
