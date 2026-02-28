import React, { useState } from 'react';
import { downloadFile } from '../../utils/studioUtils';

const HelpImportExcel = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('materi');

    if (!isOpen) return null;

    const handleDownloadSample = () => {
        // Since we can't easily create a multi-sheet Excel in browser without a heavy library,
        // we will provide instructions or a link to a hosted file if available.
        // For now, let's alert the user or provide a CSV for the main 'Materi' sheet as a basic start.

        const csvContent = "data:text/csv;charset=utf-8,"
            + "berharakat,terjemahan,irab,nga_logat,tasykil_options\n"
            + "الْعِلْمُ,Ilmu itu,Mubtada Marfu,utawi:top-right,الْعَلَمُ,الْعِلْمَ\n"
            + "نُورٌ,Cahaya,Khobar Marfu,iku:top-left,نُورًا,نُورٍ";

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "sample-materi.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        alert("Saat ini sample yang didownload hanya untuk sheet 'Materi' (CSV). Silakan buat file Excel (.xlsx) dengan 3 sheet: Info, Materi, Kuis sesuai panduan.");
    };

    const tabs = [
        { id: 'info', label: 'Sheet 1: Info' },
        { id: 'materi', label: 'Sheet 2: Materi' },
        { id: 'kuis', label: 'Sheet 3: Kuis' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-teal-50 dark:bg-teal-900/30">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <span>📊</span> Panduan Format Excel (3 Sheet)
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        ✕
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-700">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 py-3 text-sm font-bold transition ${activeTab === tab.id
                                ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50 dark:bg-teal-900/20 dark:text-teal-400'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1">

                    {activeTab === 'info' && (
                        <div className="space-y-4">
                            <h4 className="font-bold text-lg text-gray-800 dark:text-white">📄 Sheet "Info" (Metadata)</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Sheet ini berisi informasi dasar tentang pelajaran. Gunakan format dua kolom (Key - Value).
                            </p>
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 border rounded hidden md:table">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th className="px-4 py-2">Kolom A (Kunci)</th>
                                        <th className="px-4 py-2">Kolom B (Nilai)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b dark:border-gray-700"><td className="px-4 py-2 font-bold">Judul Latin</td><td className="px-4 py-2">Rukun Islam</td></tr>
                                    <tr className="border-b dark:border-gray-700"><td className="px-4 py-2 font-bold">Judul Arab</td><td className="px-4 py-2 font-arabic">أركان الإسلام</td></tr>
                                    <tr className="border-b dark:border-gray-700"><td className="px-4 py-2 font-bold">Level</td><td className="px-4 py-2">Ibtida'i / Mutawassit / Mutaqaddim</td></tr>
                                    <tr className="border-b dark:border-gray-700"><td className="px-4 py-2 font-bold">Terjemahan Lengkap</td><td className="px-4 py-2">Terjemahan lengkap paragraf...</td></tr>
                                    <tr><td className="px-4 py-2 font-bold">Referensi / Sumber</td><td className="px-4 py-2">Kitab Safinatun Najah</td></tr>
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'materi' && (
                        <div className="space-y-4">
                            <h4 className="font-bold text-lg text-gray-800 dark:text-white">📖 Sheet "Materi" (Konten Utama)</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Menampung teks Arab per-kata beserta atributnya. Baris kosong dianggap paragraf baru.
                            </p>
                            <div className="overflow-x-auto border rounded-lg">
                                <table className="w-full text-xs text-left text-gray-500 dark:text-gray-400">
                                    <thead className="text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th className="px-3 py-2">A: berharakat</th>
                                            <th className="px-3 py-2">B: terjemahan</th>
                                            <th className="px-3 py-2">C: irab</th>
                                            <th className="px-3 py-2 bg-yellow-50 dark:bg-yellow-900/20">D: nga_logat</th>
                                            <th className="px-3 py-2 bg-yellow-50 dark:bg-yellow-900/20">E: tasykil_options</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                            <td className="px-3 py-2 font-arabic text-lg text-gray-900 dark:text-white">الْعِلْمُ</td>
                                            <td className="px-3 py-2">Ilmu itu</td>
                                            <td className="px-3 py-2 italic">Mubtada</td>
                                            <td className="px-3 py-2 font-mono text-xs">utawi:top-right</td>
                                            <td className="px-3 py-2 font-arabic">الْعَلَمُ,الْعِلْمَ</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded text-xs space-y-1">
                                <p><strong>Format Nga Logat:</strong> `simbol:posisi`. Posisi: `top`, `bottom`, `top-right`, dll. Pisahkan dengan `;` jika &gt; 1.</p>
                                <p><strong>Format Tasykil:</strong> Pisahkan opsi dengan koma `,`.</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'kuis' && (
                        <div className="space-y-4">
                            <h4 className="font-bold text-lg text-gray-800 dark:text-white">❓ Sheet "Kuis" (Evaluasi)</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Daftar pertanyaan kuis pilihan ganda.
                            </p>
                            <ul className="list-decimal pl-5 text-sm space-y-1 text-gray-600 dark:text-gray-400">
                                <li><strong>Col A (question):</strong> Pertanyaan</li>
                                <li><strong>Col B (context):</strong> Konteks Arab (Opsional)</li>
                                <li><strong>Col C-F (option1-4):</strong> Pilihan Jawaban</li>
                                <li><strong>Col G (correct_answer):</strong> Angka 0-3 (0=Opsi 1, 1=Opsi 2, dst)</li>
                                <li><strong>Col H (explanation):</strong> Penjelasan jawaban</li>
                            </ul>
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-800">
                    <button
                        onClick={handleDownloadSample}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
                    >
                        ⬇️ Download Contoh (Materi Only)
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-bold transition shadow-lg"
                    >
                        Mengerti
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HelpImportExcel;
