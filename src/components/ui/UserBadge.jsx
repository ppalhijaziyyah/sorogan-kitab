import React from 'react';

const UserBadge = ({ user }) => {
  const { name, avatar, amount, contributionCount, type, profileUrl } = user;

  const isSponsor = type === 'sponsor';

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value / 1000) + 'k';
  };

  return (
    <a 
      href={profileUrl} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="inline-flex items-center bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 rounded-full p-1 pr-3 hover:shadow-md hover:-translate-y-0.5 cursor-pointer transition-all duration-200 ease-in-out"
      title={`${name} - ${isSponsor ? `Donasi: ${formatCurrency(amount)}` : `Kontribusi: ${contributionCount} materi`}`}
    >
      <img src={avatar} alt={`Avatar of ${name}`} className="w-8 h-8 rounded-full object-cover" />
      <div className="ml-2 flex items-baseline gap-2">
        <p className="text-sm font-medium text-teal-600 dark:text-teal-400 whitespace-nowrap">{name}</p>
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
          {isSponsor ? formatCurrency(amount) : `${contributionCount} materi`}
        </span>
      </div>
    </a>
  );
};

export default UserBadge;
