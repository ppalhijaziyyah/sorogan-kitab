import React from 'react';

const SettingToggle = ({ label, id, isChecked, onChange }) => (
    <div className="flex items-center">
        <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <label className="relative inline-flex items-center cursor-pointer ml-auto">
            <input type="checkbox" id={id} className="sr-only peer" checked={isChecked} onChange={onChange} />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal-600"></div>
        </label>
    </div>
);

export default SettingToggle;