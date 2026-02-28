import React from 'react';
import { Link } from 'react-router-dom';
import UserBadge from '../components/ui/UserBadge';
import data from '../data/sponsors-contributors.json';

const SponsorsPage = () => {
  const sponsors = data.filter(user => user.type === 'sponsor').sort((a, b) => b.amount - a.amount);

  return (
    <div className="container mx-auto max-w-5xl">
      <header className="text-center mb-8">
        <Link to="/">
          <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-sky-500 mb-2 pb-2">Sorogan</h1>
        </Link>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">Belajar Membaca dan Memahami Teks Arab Gundul</p>
        <hr className="border-gray-300 dark:border-gray-700 max-w-md mx-auto" />
        <h2 className="text-2xl font-bold mt-4 text-teal-600 dark:text-teal-400">Para Sponsor</h2>
      </header>
      <div className="flex flex-wrap justify-center gap-4">
        {sponsors.map(user => (
          <UserBadge key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default SponsorsPage;
