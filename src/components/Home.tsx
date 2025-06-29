import React from 'react';

const Home: React.FC = () => {
  return (
    <section id="home" className="py-12">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-6 text-indigo-200 hover:text-indigo-100 transition-colors duration-300">Welcome to GitHub Analysis</h2>
        <p className="text-lg text-gray-300 mb-6">Explore insights from 1,052 GitHub repositories.</p>
      </div>
    </section>
  );
};

export default Home;