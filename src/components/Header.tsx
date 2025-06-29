import React, { useState } from 'react';

const Header: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'light' : 'dark');
    setIsDarkMode(!isDarkMode);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white p-4 shadow-lg sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold hover:text-blue-300 transition-colors duration-300">GitHub Analysis</h1>
        <ul className="flex space-x-6">
          <li><a href="#home" className="hover:text-blue-300 transition-colors duration-300" onClick={(e) => { e.preventDefault(); document.querySelector('#home')?.scrollIntoView({ behavior: 'smooth' }); }}>Home</a></li>
          <li><a href="#data" className="hover:text-blue-300 transition-colors duration-300" onClick={(e) => { e.preventDefault(); document.querySelector('#data')?.scrollIntoView({ behavior: 'smooth' }); }}>Data</a></li>
          <li><a href="#analysis" className="hover:text-blue-300 transition-colors duration-300" onClick={(e) => { e.preventDefault(); document.querySelector('#analysis')?.scrollIntoView({ behavior: 'smooth' }); }}>Analysis</a></li>
          <li><a href="#methodology" className="hover:text-blue-300 transition-colors duration-300" onClick={(e) => { e.preventDefault(); document.querySelector('#methodology')?.scrollIntoView({ behavior: 'smooth' }); }}>Methodology</a></li>
          <li><a href="#results" className="hover:text-blue-300 transition-colors duration-300" onClick={(e) => { e.preventDefault(); document.querySelector('#results')?.scrollIntoView({ behavior: 'smooth' }); }}>Results</a></li>
          <li>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors duration-300"
            >
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;