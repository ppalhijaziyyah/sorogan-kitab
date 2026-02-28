import React, { useState, useEffect } from 'react';
import { removeHarakat, copyToClipboard, downloadJSON } from '../../utils/studioUtils';
import ConfirmationModal from '../../components/ui/ConfirmationModal';

const StudioEditor = ({ initialData, lessonId, onBack, onSave }) => {
    // State
    const [lessonData, setLessonData] = useState(() => {
        const data = initialData || {
            title: "",
            titleArabic: "",
            level: "Ibtida’i",
            textData: [],
            quizData: [],
            fullTranslation: "",
            reference: "",
            path: ""
        };


        // Try to extract file number from path if not explicitly set
        // Format: data/1-ibtidai/1-1-judul.json -> extract "1" from "1-1"
        if (!data.fileNumber && data.path) {
            const filename = data.path.split('/').pop(); // "1-1-judul.json"
            const parts = filename.split('-');
            const levelMap = { 'Ibtida’i': '1', 'Mutawassit': '2', 'Mutaqaddim': '3' };
            const levelId = levelMap[data.level];

            if (levelId && parts.length >= 2) {
                // If the second part matches the level ID, the first part is the file number
                // Example: "10-1-judul.json" (Level 1) -> parts[1] is "1", so parts[0] "10" is FileNum
                if (parts[1] === levelId) {
                    data.fileNumber = parts[0];
                }
            }
        }
        return data;
    });
    const [fullTextRaw, setFullTextRaw] = useState('');
    const [activeTab, setActiveTab] = useState('metadata');
    const [modal, setModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null,
        type: 'danger'
    });

    useEffect(() => {
        if (initialData) {
            const data = { ...initialData };
            // Re-apply extraction logic when initialData updates (e.g. after save)
            if (!data.fileNumber && data.path) {
                const filename = data.path.split('/').pop();
                const parts = filename.split('-');
                const levelMap = { 'Ibtida’i': '1', 'Mutawassit': '2', 'Mutaqaddim': '3' };
                const levelId = levelMap[data.level];

                if (levelId && parts.length >= 2) {
                    if (parts[1] === levelId) {
                        data.fileNumber = parts[0];
                    }
                }
            }
            setLessonData(data);
        }
    }, [initialData]);

    const closeModal = () => setModal({ ...modal, isOpen: false });

    // Handlers
    const handleChange = (field, value) => {
        setLessonData(prev => ({ ...prev, [field]: value }));
    };

    const handleProcessText = () => {
        if (!fullTextRaw.trim()) return;

        const paragraphs = fullTextRaw.split(/\n\s*\n/).filter(p => p.trim());
        const newTextData = paragraphs.map(p => {
            return p.trim().split(/\s+/).map(word => ({
                berharakat: word,
                gundul: removeHarakat(word),
                terjemahan: '',
                irab: '',
                link: '',
                nga_logat: [],
                tasykil_options: []
            }));
        });

        setLessonData(prev => ({
            ...prev,
            textData: [...(prev.textData || []), ...newTextData]
        }));
        setFullTextRaw('');
    };

    const handleWordChange = (pIndex, wIndex, field, value) => {
        const newData = [...lessonData.textData];
        if (!newData[pIndex]) return;

        if (field === 'tasykil_options') {
            newData[pIndex][wIndex][field] = value;
        } else {
            newData[pIndex][wIndex][field] = value;
            if (field === 'berharakat') {
                newData[pIndex][wIndex].gundul = removeHarakat(value);
            }
        }
        setLessonData(prev => ({ ...prev, textData: newData }));
    };

    const addWord = (pIndex, wIndex) => {
        const newData = [...lessonData.textData];
        if (!newData[pIndex]) return;

        newData[pIndex].splice(wIndex + 1, 0, {
            berharakat: "", gundul: "", terjemahan: "", irab: "", link: "", nga_logat: [], tasykil_options: []
        });
        setLessonData(prev => ({ ...prev, textData: newData }));
    };

    const removeWord = (pIndex, wIndex) => {
        setModal({
            isOpen: true,
            title: 'Hapus Kata',
            message: 'Apakah Anda yakin ingin menghapus kata ini?',
            confirmText: 'Hapus',
            type: 'danger',
            onConfirm: () => {
                const newData = [...lessonData.textData];
                if (newData[pIndex]) {
                    newData[pIndex].splice(wIndex, 1);
                    if (newData[pIndex].length === 0) {
                        newData.splice(pIndex, 1);
                    }
                    setLessonData(prev => ({ ...prev, textData: newData }));
                }
                closeModal();
            }
        });
    };

    const removeParagraph = (pIndex) => {
        setModal({
            isOpen: true,
            title: 'Hapus Paragraf',
            message: 'Apakah Anda yakin ingin menghapus seluruh paragraf ini?',
            confirmText: 'Hapus',
            type: 'danger',
            onConfirm: () => {
                const newData = [...lessonData.textData];
                newData.splice(pIndex, 1);
                setLessonData(prev => ({ ...prev, textData: newData }));
                closeModal();
            }
        });
    };

    // Quiz Handlers
    const addQuiz = () => {
        setLessonData(prev => ({
            ...prev,
            quizData: [...(prev.quizData || []), {
                question: "",
                context: "",
                options: ["", "", "", ""],
                correctAnswer: 0,
                explanation: ""
            }]
        }));
    };

    const removeQuiz = (qIndex) => {
        setModal({
            isOpen: true,
            title: 'Hapus Pertanyaan',
            message: 'Apakah Anda yakin ingin menghapus pertanyaan ini?',
            confirmText: 'Hapus',
            type: 'danger',
            onConfirm: () => {
                const newQuizData = [...(lessonData.quizData || [])];
                newQuizData.splice(qIndex, 1);
                setLessonData(prev => ({ ...prev, quizData: newQuizData }));
                closeModal();
            }
        });
    };

    const updateQuiz = (qIndex, field, value) => {
        const newQuizData = [...(lessonData.quizData || [])];
        newQuizData[qIndex][field] = value;
        setLessonData(prev => ({ ...prev, quizData: newQuizData }));
    };

    const updateQuizOption = (qIndex, oIndex, value) => {
        const newQuizData = [...(lessonData.quizData || [])];
        const newOptions = [...newQuizData[qIndex].options];
        newOptions[oIndex] = value;
        newQuizData[qIndex].options = newOptions;
        setLessonData(prev => ({ ...prev, quizData: newQuizData }));
    };



    const handleCopyJSON = async () => {
        await copyToClipboard(JSON.stringify(lessonData, null, 2));
        alert("JSON pelajaran berhasil disalin ke clipboard!");
    };

    const getFilename = () => {
        const levelMap = { 'Ibtida’i': 1, 'Mutawassit': 2, 'Mutaqaddim': 3 };
        const levelNum = levelMap[lessonData.level] || 1; // Default to 1 if not found
        const sanitizedTitle = lessonData.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/[\s-]+/g, '-');

        if (lessonData.fileNumber) {
            return `${lessonData.fileNumber}-${levelNum}-${sanitizedTitle}.json`;
        }
        return `${levelNum}-${sanitizedTitle}.json`;
    };

    const handleDownloadJSON = () => {
        const fileName = getFilename();
        // Remove fileNumber from the downloaded JSON content
        const { fileNumber, ...cleanData } = lessonData;
        downloadJSON(cleanData, fileName);
    };

    const handleSave = () => {
        const filename = getFilename();
        // Remove fileNumber from the saved data structure
        const { fileNumber, ...cleanData } = lessonData;

        // Generate preview from textData (gundul)
        let previewText = "";
        if (lessonData.textData && lessonData.textData.length > 0) {
            // Flatten all paragraphs and words, extract gundul text
            const allWords = lessonData.textData.flatMap(paragraph => paragraph.map(word => word.gundul));
            const fullText = allWords.join(' ');

            // Truncate to ~150 chars, max 2 lines approx
            if (fullText.length > 150) {
                previewText = fullText.substring(0, 150) + "...";
            } else {
                previewText = fullText;
            }
        }

        const updatedLesson = {
            ...cleanData,
            preview: previewText, // Add preview field
            path: `data/${lessonData.level === 'Ibtida’i' ? '1-ibtidai' : lessonData.level === 'Mutawassit' ? '2-mutawassit' : '3-mutaqaddim'}/${filename}`
        };

        if (onSave) {
            onSave(lessonId, updatedLesson);
        }
    };

    return (
        <div className="p-6 pb-32">
            <ConfirmationModal
                isOpen={modal.isOpen}
                title={modal.title}
                message={modal.message}
                onConfirm={modal.onConfirm}
                onCancel={closeModal}
                confirmText={modal.confirmText}
                type={modal.type}
            />
            <header className="flex justify-between items-center mb-6 sticky top-0 bg-white dark:bg-gray-800 z-10 py-4 border-b">
                <div className="flex items-center space-x-4">
                    <button onClick={onBack} className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">&larr; Kembali</button>
                    <h2 className="text-2xl font-bold text-teal-600 dark:text-teal-400">{lessonId ? 'Edit Pelajaran' : 'Tambah Pelajaran Baru'}</h2>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={handleSave}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold shadow transition-transform transform active:scale-95"
                    >
                        💾 Simpan
                    </button>
                    <button
                        onClick={handleCopyJSON}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold shadow-sm transition"
                    >
                        📋 Copy
                    </button>
                    <button
                        onClick={handleDownloadJSON}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold shadow transition-transform transform active:scale-95"
                    >
                        ⬇️ Download JSON
                    </button>
                </div>
            </header>

            {/* Tabs */}
            <div className="flex border-b mb-6 overflow-x-auto">
                {['metadata', 'text', 'quiz'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 font-semibold capitalize whitespace-nowrap transition-colors ${activeTab === tab ? 'border-b-2 border-teal-600 text-teal-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                    >
                        {tab === 'metadata' ? 'Informasi Dasar' : tab === 'text' ? 'Editor Teks' : 'Kuis'}
                    </button>
                ))}
            </div>

            {/* METADATA TAB */}
            {activeTab === 'metadata' && (
                <div className="space-y-6 max-w-4xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Judul (Latin)</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:border-gray-600"
                                    value={lessonData.title}
                                    onChange={(e) => handleChange('title', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300 text-right">Judul (Arab)</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg p-3 text-right font-arabic text-xl dark:bg-gray-700 dark:border-gray-600"
                                    value={lessonData.titleArabic}
                                    onChange={(e) => handleChange('titleArabic', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Tingkatan</label>
                                <select
                                    className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:border-gray-600"
                                    value={lessonData.level}
                                    onChange={(e) => handleChange('level', e.target.value)}
                                >
                                    <option>Ibtida’i</option>
                                    <option>Mutawassit</option>
                                    <option>Mutaqaddim</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Nomor Urut File (Opsional)</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:border-gray-600"
                                    value={lessonData.fileNumber || ''}
                                    onChange={(e) => handleChange('fileNumber', e.target.value)}
                                    placeholder="Contoh: 1, 10 (Kosongkan jika tidak perlu)"
                                />
                                <p className="text-xs text-gray-400 mt-1">Hanya untuk penamaan file: [No]-[Level]-[Judul].json</p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Preview Nama File</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        readOnly
                                        className="w-full border rounded-lg p-3 bg-gray-50 text-gray-500 text-sm font-mono dark:bg-gray-800 dark:border-gray-600"
                                        value={(() => {
                                            const levelMap = { 'Ibtida’i': 1, 'Mutawassit': 2, 'Mutaqaddim': 3 };
                                            const levelNum = levelMap[lessonData.level] || 1;
                                            const sanitizedTitle = lessonData.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/[\s-]+/g, '-');

                                            if (lessonData.fileNumber) {
                                                return `${lessonData.fileNumber}-${levelNum}-${sanitizedTitle}.json`;
                                            }
                                            return `${levelNum}-${sanitizedTitle}.json`;
                                        })()}
                                    />
                                    <button
                                        onClick={() => {
                                            const levelMap = { 'Ibtida’i': 1, 'Mutawassit': 2, 'Mutaqaddim': 3 };
                                            const levelNum = levelMap[lessonData.level] || 1;
                                            const sanitizedTitle = lessonData.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/[\s-]+/g, '-');

                                            let fileName;
                                            if (lessonData.fileNumber) {
                                                fileName = `${lessonData.fileNumber}-${levelNum}-${sanitizedTitle}.json`;
                                            } else {
                                                fileName = `${levelNum}-${sanitizedTitle}.json`;
                                            }
                                            copyToClipboard(fileName);
                                        }}
                                        className="bg-gray-200 hover:bg-gray-300 text-gray-600 px-3 rounded-lg dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
                                        title="Copy Nama File"
                                    >
                                        📋
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Referensi</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:border-gray-600"
                                    value={lessonData.reference || ''}
                                    onChange={(e) => handleChange('reference', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="mt-6">
                            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Terjemahan Lengkap</label>
                            <textarea
                                className="w-full border rounded-lg p-3 h-32 dark:bg-gray-700 dark:border-gray-600"
                                value={lessonData.fullTranslation || ''}
                                onChange={(e) => handleChange('fullTranslation', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="font-bold text-lg mb-2 text-teal-600">Input Teks Cepat</h3>
                        <p className="text-sm text-gray-500 mb-4">Paste teks Arab berharakat di sini untuk diproses menjadi kata per kata.</p>
                        <textarea
                            className="w-full border rounded-lg p-4 h-48 font-arabic text-right text-2xl leading-loose dark:bg-gray-700 dark:border-gray-600"
                            value={fullTextRaw}
                            onChange={(e) => setFullTextRaw(e.target.value)}
                            placeholder="Paste teks Arab di sini..."
                        />
                        <button
                            onClick={handleProcessText}
                            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold shadow"
                        >
                            Proses Teks &rarr;
                        </button>
                    </div>
                </div>
            )}

            {/* TEXT EDITOR TAB */}
            {activeTab === 'text' && (
                <div className="space-y-8 max-w-6xl mx-auto">
                    {lessonData.textData && lessonData.textData.map((paragraph, pIndex) => (
                        <div key={pIndex} className="border border-gray-200 dark:border-gray-700 p-6 rounded-xl bg-white dark:bg-gray-800 shadow-sm">
                            <div className="flex justify-between items-center mb-4 border-b pb-2">
                                <h3 className="font-bold text-lg text-gray-700 dark:text-gray-300">Paragraf {pIndex + 1}</h3>
                                <button onClick={() => removeParagraph(pIndex)} className="text-red-500 text-sm hover:underline">Hapus Paragraf</button>
                            </div>

                            <div className="space-y-3">
                                {/* Header Row */}
                                <div className="hidden md:grid grid-cols-12 gap-4 text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">
                                    <div className="col-span-3 text-right">Teks Arab</div>
                                    <div className="col-span-3">Terjemahan</div>
                                    <div className="col-span-3 text-right">I'rab</div>
                                    <div className="col-span-2">Link (Opsional)</div>
                                    <div className="col-span-1 text-center">Aksi</div>
                                </div>
                                {paragraph.map((word, wIndex) => (
                                    <div key={wIndex} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center py-4 md:py-2 border-b last:border-0 border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded px-2 transition-colors">

                                        {/* Mobile Labels */}
                                        <div className="md:hidden font-bold text-xs text-gray-400 mt-2">TEKS ARAB</div>
                                        <div className="col-span-3">
                                            <input
                                                className="w-full border rounded p-2 text-right font-arabic text-xl dark:bg-gray-700 dark:border-gray-600"
                                                value={word.berharakat}
                                                onChange={(e) => handleWordChange(pIndex, wIndex, 'berharakat', e.target.value)}
                                            />
                                        </div>

                                        <div className="md:hidden font-bold text-xs text-gray-400 mt-2">TERJEMAHAN</div>
                                        <div className="col-span-3">
                                            <input
                                                className="w-full border rounded p-2 text-sm dark:bg-gray-700 dark:border-gray-600"
                                                value={word.terjemahan}
                                                placeholder="Terjemahan..."
                                                onChange={(e) => handleWordChange(pIndex, wIndex, 'terjemahan', e.target.value)}
                                            />
                                        </div>

                                        <div className="md:hidden font-bold text-xs text-gray-400 mt-2">I'RAB</div>
                                        <div className="col-span-3">
                                            <textarea
                                                className="w-full border rounded p-2 text-right font-arabic text-sm dark:bg-gray-700 dark:border-gray-600"
                                                rows={1}
                                                value={word.irab}
                                                placeholder="I'rab..."
                                                onChange={(e) => handleWordChange(pIndex, wIndex, 'irab', e.target.value)}
                                            />
                                        </div>

                                        <div className="md:hidden font-bold text-xs text-gray-400 mt-2">LINK</div>
                                        <div className="col-span-2">
                                            <input
                                                className="w-full border rounded p-2 text-xs text-gray-500 dark:bg-gray-700 dark:border-gray-600"
                                                placeholder="Link..."
                                                value={word.link || ''}
                                                onChange={(e) => handleWordChange(pIndex, wIndex, 'link', e.target.value)}
                                            />
                                        </div>

                                        {/* New Fields: Nga-logat & Tasykil */}
                                        <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 pt-2 border-t border-gray-100 dark:border-gray-700/50">

                                            {/* Nga-logat Editor */}
                                            <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                                                <div className="flex justify-between items-center mb-2">
                                                    <label className="text-[10px] font-bold uppercase text-gray-400">SIMBOL NGA-LOGAT (PEGO)</label>
                                                    <button
                                                        onClick={() => {
                                                            const newData = [...lessonData.textData];
                                                            const currentLogat = newData[pIndex][wIndex].nga_logat || [];
                                                            newData[pIndex][wIndex].nga_logat = [...currentLogat, { symbol: "", position: "bottom-center" }];
                                                            setLessonData(prev => ({ ...prev, textData: newData }));
                                                        }}
                                                        className="text-[10px] bg-teal-100 text-teal-700 px-2 py-0.5 rounded hover:bg-teal-200"
                                                    >
                                                        + Simbol
                                                    </button>
                                                </div>

                                                {(word.nga_logat || []).map((logat, lIndex) => (
                                                    <div key={lIndex} className="flex gap-2 mb-2 items-center">
                                                        <input
                                                            className="flex-1 border rounded p-1 text-center font-arabic text-sm dark:bg-gray-700 dark:border-gray-600"
                                                            placeholder="Simbol (utawi)"
                                                            value={logat.symbol}
                                                            onChange={(e) => {
                                                                const newData = [...lessonData.textData];
                                                                newData[pIndex][wIndex].nga_logat[lIndex].symbol = e.target.value;
                                                                setLessonData(prev => ({ ...prev, textData: newData }));
                                                            }}
                                                        />
                                                        <select
                                                            className="flex-1 border rounded p-1 text-xs dark:bg-gray-700 dark:border-gray-600"
                                                            value={logat.position}
                                                            onChange={(e) => {
                                                                const newData = [...lessonData.textData];
                                                                newData[pIndex][wIndex].nga_logat[lIndex].position = e.target.value;
                                                                setLessonData(prev => ({ ...prev, textData: newData }));
                                                            }}
                                                        >
                                                            <option value="top">Atas</option>
                                                            <option value="top-right">Atas Kanan</option>
                                                            <option value="top-left">Atas Kiri</option>
                                                            <option value="bottom">Bawah</option>
                                                            <option value="bottom-right">Bawah Kanan</option>
                                                            <option value="bottom-left">Bawah Kiri</option>
                                                        </select>
                                                        <button
                                                            onClick={() => {
                                                                const newData = [...lessonData.textData];
                                                                newData[pIndex][wIndex].nga_logat.splice(lIndex, 1);
                                                                setLessonData(prev => ({ ...prev, textData: newData }));
                                                            }}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            &times;
                                                        </button>
                                                    </div>
                                                ))}
                                                {(word.nga_logat || []).length === 0 && (
                                                    <p className="text-xs text-gray-400 italic text-center">Tidak ada simbol.</p>
                                                )}
                                            </div>

                                            {/* Tasykil Options */}
                                            <div>
                                                <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">OPSI TASYKIL (Kom dipisah)</label>
                                                <input
                                                    className="w-full border rounded p-2 font-arabic text-right dark:bg-gray-700 dark:border-gray-600"
                                                    placeholder="Salah1, Salah2..."
                                                    value={Array.isArray(word.tasykil_options) ? word.tasykil_options.join(', ') : (word.tasykil_options || '')}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        const arr = val ? val.split(',').map(s => s.trim()).filter(Boolean) : [];
                                                        handleWordChange(pIndex, wIndex, 'tasykil_options', arr);
                                                    }}
                                                />
                                                <p className="text-[10px] text-gray-400 mt-1">
                                                    Masukkan jawaban pengecoh untuk mode kuis tasykil. Jawaban benar diambil dari teks asli.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="col-span-1 flex space-x-2 justify-center mt-2 md:mt-0">
                                            <button
                                                onClick={() => addWord(pIndex, wIndex)}
                                                className="bg-green-100 text-green-600 rounded-lg w-8 h-8 flex items-center justify-center hover:bg-green-200 transition"
                                                title="Tambah Baris"
                                            >
                                                +
                                            </button>
                                            <button
                                                onClick={() => removeWord(pIndex, wIndex)}
                                                className="bg-red-100 text-red-600 rounded-lg w-8 h-8 flex items-center justify-center hover:bg-red-200 transition"
                                                title="Hapus Baris"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    {(!lessonData.textData || lessonData.textData.length === 0) && (
                        <div className="text-center p-12 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                            <p className="text-gray-500">Belum ada data teks.</p>
                            <button onClick={() => setActiveTab('metadata')} className="text-teal-600 font-bold hover:underline mt-2">
                                Proses teks di tab Informasi Dasar &rarr;
                            </button>
                        </div>
                    )}
                    <div className="text-center pt-8">
                        <p className="text-sm text-gray-500 mb-4">Tips: Gunakan tombol Copy JSON di pojok kanan atas untuk menyimpan progress.</p>
                    </div>
                </div>
            )}

            {/* QUIZ EDITOR TAB */}
            {activeTab === 'quiz' && (
                <div className="space-y-8 max-w-4xl mx-auto">
                    {(lessonData.quizData || []).map((quiz, qIndex) => (
                        <div key={qIndex} className="border border-gray-200 dark:border-gray-700 p-6 rounded-xl bg-white dark:bg-gray-800 shadow-sm relative">
                            <button
                                onClick={() => removeQuiz(qIndex)}
                                className="absolute top-4 right-4 bg-red-100 text-red-600 px-3 py-1 rounded text-xs font-bold hover:bg-red-200"
                            >
                                Hapus Pertanyaan
                            </button>
                            <h4 className="font-bold text-lg mb-4 text-teal-600">Pertanyaan {qIndex + 1}</h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Pertanyaan</label>
                                    <input
                                        className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:border-gray-600"
                                        value={quiz.question}
                                        onChange={(e) => updateQuiz(qIndex, 'question', e.target.value)}
                                        placeholder="Tulis pertanyaan..."
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1 text-right">Konteks (Arab - Opsional)</label>
                                    <input
                                        className="w-full border rounded-lg p-3 text-right font-arabic text-lg dark:bg-gray-700 dark:border-gray-600"
                                        value={quiz.context || ''}
                                        onChange={(e) => updateQuiz(qIndex, 'context', e.target.value)}
                                        placeholder="Konteks ayat/hadits..."
                                    />
                                </div>

                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Opsi Jawaban</label>
                                    <div className="space-y-3">
                                        {(quiz.options || ["", "", "", ""]).map((opt, oIndex) => (
                                            <div key={oIndex} className={`flex items-center space-x-2 p-2 rounded border ${quiz.correctAnswer === oIndex ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-transparent'}`}>
                                                <input
                                                    type="radio"
                                                    name={`correct-${qIndex}`}
                                                    checked={quiz.correctAnswer === oIndex}
                                                    onChange={() => updateQuiz(qIndex, 'correctAnswer', oIndex)}
                                                    className="w-4 h-4 text-green-600 focus:ring-green-500"
                                                />
                                                <input
                                                    className="flex-1 bg-transparent border-b border-gray-300 focus:border-teal-500 focus:outline-none p-1"
                                                    value={opt}
                                                    onChange={(e) => updateQuizOption(qIndex, oIndex, e.target.value)}
                                                    placeholder={`Opsi ${oIndex + 1}`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2">*Pilih radio button untuk menandai jawaban benar.</p>
                                </div>

                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Penjelasan (Opsional)</label>
                                    <textarea
                                        className="w-full border rounded-lg p-3 h-40 dark:bg-gray-700 dark:border-gray-600"
                                        value={quiz.explanation || ''}
                                        onChange={(e) => updateQuiz(qIndex, 'explanation', e.target.value)}
                                        placeholder="Penjelasan jawaban benar..."
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={addQuiz}
                        className="w-full py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex flex-col items-center justify-center gap-2"
                    >
                        <span className="text-2xl">+</span>
                        <span>Tambah Pertanyaan Baru</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default StudioEditor;
