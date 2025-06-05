import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const categories = [
    'General',
    'For NGOs',
    'For Lawyers',
    'For Donors',
    'Technical',
    'Legal'
  ];

  const faqs: FAQItem[] = [
    {
      question: 'What is HakiChain?',
      answer: 'HakiChain is a blockchain-based platform that connects NGOs, lawyers, and donors to facilitate legal aid through bounties and smart contracts. It aims to make legal justice more accessible and transparent.',
      category: 'General'
    },
    {
      question: 'How do I create a legal bounty?',
      answer: 'As an NGO, you can create a legal bounty by clicking the "Create Bounty" button in your dashboard. You\'ll need to provide details about the case, set milestones, and specify the required funding amount.',
      category: 'For NGOs'
    },
    {
      question: 'How are lawyers verified?',
      answer: 'Lawyers must provide their LSK (Law Society of Kenya) number and other credentials during registration. Our team verifies these credentials before lawyers can accept bounties.',
      category: 'For Lawyers'
    },
    {
      question: 'How are donations handled?',
      answer: 'Donations are processed through smart contracts on the blockchain. Funds are held in escrow and released to lawyers upon completion of verified milestones.',
      category: 'For Donors'
    },
    {
      question: 'What blockchain does HakiChain use?',
      answer: 'HakiChain uses the Ethereum blockchain for its smart contracts and transactions, ensuring transparency and security.',
      category: 'Technical'
    },
    {
      question: 'Is my donation tax-deductible?',
      answer: 'Yes, donations made through HakiChain are generally tax-deductible. We provide annual tax documentation for all donors.',
      category: 'For Donors'
    },
    {
      question: 'How are milestone completions verified?',
      answer: 'NGOs verify milestone completions by reviewing submitted proof and documentation. Smart contracts automatically release payments upon verification.',
      category: 'For NGOs'
    },
    {
      question: 'What happens if a case is not completed?',
      answer: 'If a case cannot be completed, remaining funds are returned to donors according to our smart contract terms.',
      category: 'Legal'
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="bg-gradient-to-r from-primary-900 via-primary-800 to-secondary-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-serif font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-200 mb-8">
            Find answers to common questions about HakiChain
          </p>

          <div className="max-w-2xl">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search questions..."
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

        <div className="max-w-3xl mx-auto space-y-4">
          {filteredFAQs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setExpandedId(expandedId === index ? null : index)}
                className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium">{faq.question}</span>
                {expandedId === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              
              <AnimatePresence>
                {expandedId === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-gray-200"
                  >
                    <div className="p-4 bg-gray-50">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}

          {filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-600 mb-2">No matching questions found</h3>
              <p className="text-gray-500">Try adjusting your search terms</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};