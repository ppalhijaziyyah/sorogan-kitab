import React, { useState, useEffect, useMemo } from 'react';
import masterIndex from '../../data/master-index.json';
import StudioDashboard from './StudioDashboard';
import StudioEditor from './StudioEditor';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Studio Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 text-center text-red-600 bg-red-50 rounded-lg border border-red-200">
                    <h2 className="text-xl font-bold mb-2">Terjadi Kesalahan di Studio</h2>
                    <pre className="bg-white p-4 rounded text-left overflow-auto text-sm border border-red-100">
                        {this.state.error && this.state.error.toString()}
                    </pre>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                    >
                        Muat Ulang Halaman
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

const StudioPage = () => {
    const [view, setView] = useState('dashboard'); // 'dashboard' | 'editor'
    const [lessonsMap, setLessonsMap] = useState({});
    const [editingLessonId, setEditingLessonId] = useState(null);
    const [currentLessonData, setCurrentLessonData] = useState(null);
    const [localMasterIndex, setLocalMasterIndex] = useState(masterIndex);
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

    // Load all lesson data on mount using import.meta.glob (eager)
    // Load all lesson data on mount using import.meta.glob (lazy/dynamic for better error handling)
    useEffect(() => {
        const loadLessons = async () => {
            try {
                // Remove { eager: true } to get factory functions
                const modules = import.meta.glob('/src/data/**/*.json');
                const keys = Object.keys(modules);

                // Use Promise.all to load them in parallel
                // Mapping to handle individual failures gracefully
                const promises = keys.map(async (path) => {
                    try {
                        const mod = await modules[path]();
                        return { path, data: mod.default || mod };
                    } catch (error) {
                        console.error(`Gagal memuat file: ${path}`, error);
                        return null;
                    }
                });

                const results = await Promise.all(promises);

                const loadedLessons = {};
                results.forEach(result => {
                    if (result) {
                        loadedLessons[result.path] = result.data;
                    }
                });

                setLessonsMap(loadedLessons);
            } catch (err) {
                console.error("Critical error loading studio data:", err);
            }
        };

        loadLessons();
    }, []);

    const handleEditLesson = (lessonId) => {
        // Find in local index first
        const lessonIndex = localMasterIndex.find(l => l.id === lessonId);
        if (!lessonIndex) {
            alert("Pelajaran tidak ditemukan di indeks.");
            return;
        }

        // Construct full path. logic needs to match how paths are stored in masterIndex vs glob
        // masterIndex path: "data/1-ibtidai/filename.json"
        // glob path: "/src/data/1-ibtidai/filename.json"

        const fullPath = `/src/${lessonIndex.path}`;
        const lessonData = lessonsMap[fullPath];

        if (lessonData) {
            setCurrentLessonData(JSON.parse(JSON.stringify(lessonData))); // Deep copy
            setEditingLessonId(lessonId);
            setView('editor');
        } else {
            console.error("Loaded map keys:", Object.keys(lessonsMap));
            console.error("Looking for:", fullPath);
            alert(`Gagal memuat data pelajaran studio. Path: ${fullPath}`);
        }
    };

    const handleCreateLesson = (newLessonData) => {
        if (newLessonData) {
            // Logic when importing from Excel
            setCurrentLessonData(newLessonData);
            setEditingLessonId(null);
            setView('editor');
            return;
        }

        setCurrentLessonData({
            title: "",
            titleArabic: "",
            level: "Ibtida’i",
            textData: [[]],
            quizData: [],
            fullTranslation: "",
            reference: ""
        });
        setEditingLessonId(null);
        setView('editor');
    };

    const handleDeleteLesson = (lessonId) => {
        setLocalMasterIndex(prev => prev.filter(l => l.id !== lessonId));
    };

    const handleUpdateOrder = (newOrder) => {
        setLocalMasterIndex(newOrder);
    };

    const handleSaveLesson = (lessonId, updatedData) => {
        // 1. Construct Metadata for Master Index
        const metadata = {
            id: lessonId || `lesson-${Date.now()}`,
            title: updatedData.title,
            titleArabic: updatedData.titleArabic,
            level: updatedData.level,
            path: updatedData.path || `data/${updatedData.level === 'Ibtida’i' ? '1-ibtidai' : updatedData.level === 'Mutawassit' ? '2-mutawassit' : '3-mutaqaddim'}/${updatedData.fileNumber || 'x'}-${updatedData.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`,
            preview: updatedData.preview || (updatedData.textData?.[0]?.[0]?.terjemahan || "").substring(0, 100) + "...",
            lastModified: new Date().toISOString()
        };

        // 2. Update Master Index State
        if (lessonId) {
            setLocalMasterIndex(prev => prev.map(l => l.id === lessonId ? { ...l, ...metadata } : l));
        } else {
            setLocalMasterIndex(prev => [...prev, metadata]);
            setEditingLessonId(metadata.id);
        }

        // 3. Update In-Memory Cache (lessonsMap)
        const fullPath = `/src/${metadata.path}`;
        setLessonsMap(prev => ({
            ...prev,
            [fullPath]: updatedData
        }));

        setCurrentLessonData(updatedData);

        // Show Toast instead of Alert
        setToast({
            show: true,
            message: "Data tersimpan sementara di browser! Jangan lupa download JSON & Index.",
            type: 'success'
        });

        // Auto hide toast
        setTimeout(() => setToast({ ...toast, show: false }), 4000);
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
            <div className="container mx-auto p-4 md:p-8 max-w-7xl">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-teal-600 dark:text-teal-400">Sorogan Studio</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Internal Content Management System</p>
                    </div>
                </header>

                {/* Toast Notification */}
                {toast.show && (
                    <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl flex items-center space-x-4 z-50 animate-bounce transition-all duration-300 ${toast.type === 'success' ? 'bg-green-600 text-white' :
                        toast.type === 'warning' ? 'bg-orange-600 text-white' : 'bg-gray-800 text-white'
                        }`}>
                        <span className="font-medium">{toast.message}</span>
                    </div>
                )}

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl min-h-[600px] border border-gray-200 dark:border-gray-700">
                    <ErrorBoundary>
                        {view === 'dashboard' ? (
                            <StudioDashboard
                                masterIndex={localMasterIndex}
                                onEdit={handleEditLesson}
                                onCreate={handleCreateLesson}
                                onDelete={handleDeleteLesson}
                                onUpdateOrder={handleUpdateOrder}
                            />
                        ) : (
                            <StudioEditor
                                initialData={currentLessonData}
                                lessonId={editingLessonId}
                                onBack={() => setView('dashboard')}
                                onSave={handleSaveLesson}
                            />
                        )}
                    </ErrorBoundary>
                </div>
            </div>
        </div>
    );
};

export default StudioPage;
