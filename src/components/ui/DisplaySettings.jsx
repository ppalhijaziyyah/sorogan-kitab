import React, { useEffect, useRef, useState } from 'react';
import SettingToggle from './SettingToggle';

// Inline Icons for better performance and no external deps
const Icons = {
    TextSize: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M2.5 1h11a1.5 1.5 0 0 1 1.5 1.5v11a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 13.5v-11A1.5 1.5 0 0 1 2.5 1zm11 1.5a.5.5 0 0 0-.5-.5h-11a.5.5 0 0 0-.5.5v11a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-11z" />
            <path d="M6 9.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-1.25v2.5h1.25a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1h1.25v-2.5H6.5a.5.5 0 0 1-.5-.5z" />
        </svg>
    ),
    Spacing: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M1.5 2a.5.5 0 0 1 .5-.5h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5v-2zm0 5a.5.5 0 0 1 .5-.5h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5v-2zm0 5a.5.5 0 0 1 .5-.5h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5v-2z" />
        </svg>
    ),
    Close: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
        </svg>
    )
};

const SettingSlider = ({ label, id, min, max, step, value, onChange, icon }) => (
    <div className="mb-3">
        <label htmlFor={id} className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {icon && <span className="mr-2 text-gray-500 dark:text-gray-400">{icon}</span>}
            {label}
        </label>
        <div className="flex items-center">
            <input
                id={id}
                type="range"
                min={min} max={max} step={step}
                value={value}
                onChange={onChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-teal-600"
            />
        </div>
    </div>
);

const DisplaySettings = ({ isOpen, settings, updateSettings, onReset, onClose, inline = false }) => {
    // We'll use a ref to detect clicks outside on desktop, but for mobile we rely on the backdrop
    const dropdownRef = useRef(null);
    const [sheetHeight, setSheetHeight] = useState('auto'); // 'auto' or '50vh'
    const [isDragging, setIsDragging] = useState(false);
    const startY = useRef(0);
    const currentY = useRef(0);

    // Prevent scrolling when mobile drawer is open
    useEffect(() => {
        if (inline) return;
        if (isOpen && window.innerWidth < 768) {
            document.body.style.overflow = 'hidden';
            setSheetHeight('auto'); // Reset height on open
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            if (!inline) document.body.style.overflow = 'unset';
        };
    }, [isOpen, inline]);

    const handleTouchStart = (e) => {
        setIsDragging(true);
        startY.current = e.touches[0].clientY;
        currentY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        currentY.current = e.touches[0].clientY;
        const deltaY = currentY.current - startY.current;

        // Visual feedback could be added here (e.g., transforming the sheet)
        // For now, we just track the movement
        if (deltaY > 0) {
            dropdownRef.current.style.transform = `translateY(${deltaY}px)`;
        }
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        const deltaY = currentY.current - startY.current;

        // Reset transform
        dropdownRef.current.style.transform = '';

        if (deltaY > 100) {
            // Dragged down significantly
            if (sheetHeight === 'auto') {
                // If full height, snap to half height? Or close?
                // User request: "drag to half screen" to calibrate
                // Let's implement: Default is auto (full content). Drag down -> Close.
                // BUT user wants to "geser ke bawah jadi setengah layar".
                // So logic:
                // If currently full/auto -> Drag down -> Snack to 50vh.
                // If currently 50vh -> Drag down -> Close.

                // However, detecting "auto" height is tricky. 
                // Let's assume default is basically full content.
                setSheetHeight('50vh');
            } else {
                onClose();
            }
        } else if (deltaY < -50 && sheetHeight === '50vh') {
            // Dragged up from half height -> Expand
            setSheetHeight('auto');
        }
    };

    if (!isOpen) return null;

    if (inline) {
        return (
            <div className="w-full flex-1 flex flex-col pt-4">
                <div className="space-y-6">
                    {/* Section: Tampilan Teks */}
                    <div>
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Tampilan Teks</h3>
                        <SettingSlider label="Ukuran Teks Arab" id="arabic-font-slider" min="1.25" max="3" step="0.125" value={settings.arabicSize} onChange={(e) => updateSettings({ arabicSize: parseFloat(e.target.value) })} icon={<Icons.TextSize />} />
                        <SettingSlider label="Ukuran Terjemahan" id="tooltip-font-slider" min="0.6" max="1.25" step="0.0625" value={settings.tooltipSize} onChange={(e) => updateSettings({ tooltipSize: parseFloat(e.target.value) })} />
                        <SettingSlider label="Ukuran I'rab" id="irab-font-slider" min="0.75" max="2" step="0.0625" value={settings.irabSize} onChange={(e) => updateSettings({ irabSize: parseFloat(e.target.value) })} />
                    </div>


                    {/* Section: Preferensi */}
                    <div className="pt-2 border-t border-gray-100 dark:border-gray-700 space-y-3">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider my-3">Preferensi</h3>
                        <SettingToggle label="Efek Suara" id="sound-enabled-toggle" isChecked={settings.isSoundEnabled} onChange={(e) => updateSettings({ isSoundEnabled: e.target.checked })} />
                        <SettingToggle label="Mode Fokus" id="focus-mode-toggle" isChecked={settings.isFocusMode} onChange={(e) => updateSettings({ isFocusMode: e.target.checked })} />
                        <SettingToggle label="Kode Warna Nga-logat" id="use-ngalogat-color-coding-toggle" isChecked={settings.useNgaLogatColorCoding} onChange={(e) => updateSettings({ useNgaLogatColorCoding: e.target.checked })} />
                    </div>

                    {/* Section: Opsi Tampil Semua */}
                    <div className="pt-2 border-t border-gray-100 dark:border-gray-700 space-y-3">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider my-3">Tampilkan Semua</h3>
                        <SettingToggle label="Semua Harakat" id="show-all-harakat-toggle" isChecked={settings.showAllHarakat} onChange={(e) => updateSettings({ showAllHarakat: e.target.checked })} />
                        <SettingToggle label="Semua Terjemah" id="show-all-translations-toggle" isChecked={settings.showAllTranslations} onChange={(e) => updateSettings({ showAllTranslations: e.target.checked })} />
                        <SettingToggle label="Semua Nga-logat" id="show-all-ngalogat-toggle" isChecked={settings.showAllNgaLogat} onChange={(e) => updateSettings({ showAllNgaLogat: e.target.checked })} />
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                        <button onClick={onReset} className="w-full py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 rounded-lg transition-colors border border-transparent">
                            Reset ke Default
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Backdrop for Mobile */}
            <div
                className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
                onClick={onClose}
            />

            {/* Container: Bottom Sheet on Mobile, Dropdown on Desktop */}
            <div
                ref={dropdownRef}
                className={`
                    fixed bottom-0 left-0 right-0 z-50 
                    bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-white/10 dark:border-slate-700/50
                    rounded-t-2xl shadow-2xl overflow-hidden flex flex-col
                    md:absolute md:top-full md:right-0 md:bottom-auto md:left-auto md:w-80 md:rounded-xl md:border md:dark:border-slate-700 md:max-h-[600px] md:h-auto
                    transition-all duration-300 ease-out transform
                `}
                style={{
                    height: window.innerWidth < 768 ? sheetHeight : 'auto',
                    maxHeight: window.innerWidth < 768 && sheetHeight === 'auto' ? '85vh' : undefined
                }}
            >
                {/* Drag Handle for Mobile */}
                <div
                    className="w-full py-3 flex justify-center items-center cursor-grab active:cursor-grabbing md:hidden bg-transparent"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                </div>

                <div className="px-6 pb-6 overflow-y-auto flex-1 h-full min-h-0" style={{ paddingBottom: '80px' }}>
                    {/* Mobile Header with Close Button */}
                    <div className="flex justify-between items-center mb-4 md:hidden">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Pengaturan Tampilan</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                            <Icons.Close />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Section: Tampilan Teks */}
                        <div>
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Tampilan Teks</h3>
                            <SettingSlider
                                label="Ukuran Teks Arab"
                                id="arabic-font-slider"
                                min="1.25" max="3" step="0.125"
                                value={settings.arabicSize}
                                onChange={(e) => updateSettings({ arabicSize: parseFloat(e.target.value) })}
                                icon={<Icons.TextSize />}
                            />
                            <SettingSlider
                                label="Ukuran Terjemahan"
                                id="tooltip-font-slider"
                                min="0.6" max="1.25" step="0.0625"
                                value={settings.tooltipSize}
                                onChange={(e) => updateSettings({ tooltipSize: parseFloat(e.target.value) })}
                            />
                            <SettingSlider
                                label="Ukuran I'rab"
                                id="irab-font-slider"
                                min="0.75" max="2" step="0.0625"
                                value={settings.irabSize}
                                onChange={(e) => updateSettings({ irabSize: parseFloat(e.target.value) })}
                            />
                        </div>


                        {/* Section: Preferensi */}
                        <div className="pt-2 border-t border-gray-100 dark:border-gray-700 space-y-3">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider my-3">Preferensi</h3>

                            <SettingToggle
                                label="Efek Suara"
                                id="sound-enabled-toggle"
                                isChecked={settings.isSoundEnabled}
                                onChange={(e) => updateSettings({ isSoundEnabled: e.target.checked })}
                            />
                            <SettingToggle
                                label="Mode Fokus"
                                id="focus-mode-toggle"
                                isChecked={settings.isFocusMode}
                                onChange={(e) => updateSettings({ isFocusMode: e.target.checked })}
                            />
                            <SettingToggle
                                label="Kode Warna Nga-logat"
                                id="use-ngalogat-color-coding-toggle"
                                isChecked={settings.useNgaLogatColorCoding}
                                onChange={(e) => updateSettings({ useNgaLogatColorCoding: e.target.checked })}
                            />
                        </div>

                        {/* Section: Opsi Tampil Semua */}
                        <div className="pt-2 border-t border-gray-100 dark:border-gray-700 space-y-3">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider my-3">Tampilkan Semua</h3>
                            <SettingToggle
                                label="Semua Harakat"
                                id="show-all-harakat-toggle"
                                isChecked={settings.showAllHarakat}
                                onChange={(e) => updateSettings({ showAllHarakat: e.target.checked })}
                            />
                            <SettingToggle
                                label="Semua Terjemah"
                                id="show-all-translations-toggle"
                                isChecked={settings.showAllTranslations}
                                onChange={(e) => updateSettings({ showAllTranslations: e.target.checked })}
                            />
                            <SettingToggle
                                label="Semua Nga-logat"
                                id="show-all-ngalogat-toggle"
                                isChecked={settings.showAllNgaLogat}
                                onChange={(e) => updateSettings({ showAllNgaLogat: e.target.checked })}
                            />
                        </div>

                        <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                            <button
                                onClick={onReset}
                                className="w-full py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 rounded-lg transition-colors border border-transparent"
                            >
                                Reset ke Default
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DisplaySettings;
