// Memuat data secara statis di luar hook agar referensi memori (identity)
// array allChapters dan objek di dalamnya tidak berubah (re-create) 
// setiap kali useBookData dipanggil oleh komponen yang melakukan re-render.
const chaptersMap = import.meta.glob('../data/**/*.json', { eager: true });

// Fungsi bantuan untuk extract angka dari filename supaya kita bisa sort dengan benar.
// Misalnya "1-muqaddimah.json" atau "01-bab-1.json".
const extractNumber = (filename) => {
    const match = filename.match(/^(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
};

const ignoreFiles = ['master-index.json', 'ngalogat-symbol-colors.json', 'sponsors-contributors.json'];

const staticChapters = Object.keys(chaptersMap)
    .filter((path) => {
        const filename = path.split('/').pop();
        return !ignoreFiles.includes(filename);
    })
    .map((path) => {
        const module = chaptersMap[path];
        // Pastikan format module default (karena Vite .json import)
        const content = module.default || module;
        const filename = path.split('/').pop();

        return {
            ...content,
            _path: path,
            _filename: filename,
            _order: extractNumber(filename),
        };
    });

// Urutkan berdasarkan path / nama file agar berurut otomatis
staticChapters.sort((a, b) => {
    if (a._path < b._path) return -1;
    if (a._path > b._path) return 1;
    return 0;
});

// Deteksi hierarki sub-bab berdasarkan folder
// Format standar path: '../data/[level]/[file].json' (length split('/') == 4)
// Kalau dalam sub-folder: '../data/[level]/[folder]/[file].json' (length split('/') == 5)
let currentDir = null;
staticChapters.forEach((chapter) => {
    const dirPath = chapter._path.substring(0, chapter._path.lastIndexOf('/'));
    // Misal: '../data/1-ibtidai' -> split length 3. '{dirPath}' -> '[..', 'data', '1-ibtidai']
    // Jika length > 2, berarti path memiliki tingkat di bawah 'data' (contoh: 'data/1-ibtidai')
    const isSubFolder = dirPath.split('/').length > 2;

    if (isSubFolder) {
        if (currentDir !== dirPath) {
            currentDir = dirPath;
            chapter.isSubChapter = false; // File index 0 di dalam sub-folder tetap jadi Induk (Indikator Folder)
            chapter.isParent = true;
            chapter.groupId = dirPath;
        } else {
            chapter.isSubChapter = true; // File ke-1 dan setelahnya jadi sub-bab
            chapter.isParent = false;
            chapter.groupId = dirPath;
        }
    } else {
        chapter.isSubChapter = false;
        chapter.isParent = false;
        chapter.groupId = null;
        currentDir = dirPath;
    }
});

export const useBookData = () => {
    return { allChapters: staticChapters };
};
