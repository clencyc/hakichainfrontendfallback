import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, Users, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CaseStudies = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    'Land Rights',
    'Human Rights',
    'Environmental Justice',
    'Family Law',
    'Corporate Accountability'
  ];

  const caseStudies = [
    {
      id: 1,
      title: 'Indigenous Community Land Rights Victory',
      excerpt: 'How legal representation helped secure ancestral lands for an indigenous community.',
      category: 'Land Rights',
      location: 'Eastern Province, Kenya',
      peopleImpacted: 200,
      duration: '8 months',
      image: 'https://images.pexels.com/photos/5469866/pexels-photo-5469866.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      id: 2,
      title: 'Environmental Justice for Coastal Community',
      excerpt: 'Successfully holding corporations accountable for environmental damage.',
      category: 'Environmental Justice',
      location: 'Mombasa, Kenya',
      peopleImpacted: 500,
      duration: '12 months',
      image: 'https://images.pexels.com/photos/2990650/pexels-photo-2990650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      id: 3,
      title: 'Domestic Violence Survivor Protection',
      excerpt: 'Securing legal protection and support for domestic violence survivors.',
      category: 'Family Law',
      location: 'Nairobi, Kenya',
      peopleImpacted: 5,
      duration: '3 months',
      image: 'https://images.pexels.com/photos/7662919/pexels-photo-7662919.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    }
  ];

  const filteredCases = caseStudies.filter(study => {
    const matchesSearch = study.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         study.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || study.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="bg-gradient-to-r from-primary-900 via-primary-800 to-secondary-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-serif font-bold mb-4">Case Studies</h1>
          <p className="text-xl text-gray-200 mb-8">
            Real stories of impact and justice achieved through HakiChain
          </p>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search case studies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !selectedCategory
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Categories
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCases.map((study, index) => (
            <motion.article
              key={study.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <img
                src={study.image}
                alt={study.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <span className="inline-block bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm mb-4">
                  {study.category}
                </span>
                
                <h2 className="text-xl font-bold mb-2">
                  {study.title}
                </h2>
                
                <p className="text-gray-600 mb-4">
                  {study.excerpt}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {study.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    {study.peopleImpacted} people impacted
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    {study.duration}
                  </div>
                </div>

                <Link
                  to={`/case-studies/${study.id}`}
                  className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
                >
                  Read Full Case Study
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
};