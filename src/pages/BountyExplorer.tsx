import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Filter, MapPin, Clock, Tag } from 'lucide-react';
import { fetchBounties } from '../services/mockData';
import { Bounty } from '../types';
import { clarityService } from '../services/clarityService';

export const BountyExplorer = () => {
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [filteredBounties, setFilteredBounties] = useState<Bounty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  useEffect(() => {
    // Track page view
    clarityService.trackEvent('Page_View_BountyExplorer');
    
    const loadBounties = async () => {
      try {
        const data = await fetchBounties();
        setBounties(data);
        setFilteredBounties(data);
      } catch (error) {
        console.error('Failed to fetch bounties:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBounties();
  }, []);
  
  useEffect(() => {
    let result = bounties;
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(bounty => 
        bounty.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bounty.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory) {
      result = result.filter(bounty => bounty.category === selectedCategory);
    }
    
    setFilteredBounties(result);
  }, [searchTerm, selectedCategory, bounties]);
  
  // Extract unique categories
  const categories = [...new Set(bounties.map(bounty => bounty.category))];
  
  // Calculate days remaining
  const getDaysRemaining = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="pt-20 pb-12">
      <div className="bg-gradient-to-r from-primary-900 to-secondary-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">Explore Legal Bounties</h1>
          <p className="text-lg text-gray-200 mb-8">
            Browse through legal cases that need your expertise or support
          </p>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search bounties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-md bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
            
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="w-full pl-10 pr-4 py-3 rounded-md bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 appearance-none"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : filteredBounties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBounties.map((bounty, index) => (
              <motion.div
                key={bounty.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link 
                  to={`/bounties/${bounty.id}`} 
                  className="block card hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <div className="relative mb-4">
                    <div className="absolute top-0 right-0 bg-accent-500 text-white px-3 py-1 rounded-bl-lg font-medium">
                      ${bounty.totalAmount}
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary-500"
                        style={{ width: `${(bounty.raisedAmount / bounty.totalAmount) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>${bounty.raisedAmount} raised</span>
                      <span>${bounty.totalAmount - bounty.raisedAmount} needed</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">{bounty.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {bounty.description}
                  </p>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span>{bounty.location}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Clock className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span>{getDaysRemaining(bounty.dueDate)} days remaining</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {bounty.tags.slice(0, 2).map((tag) => (
                      <div key={tag} className="flex items-center px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </div>
                    ))}
                    {bounty.tags.length > 2 && (
                      <div className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">
                        +{bounty.tags.length - 2} more
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-600 mb-2">No bounties found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};