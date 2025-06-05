import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Shield, Scale, Landmark } from 'lucide-react';

export const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="pt-20 pb-12 md:pt-32 md:pb-24 bg-gradient-to-br from-primary-950 via-primary-900 to-secondary-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6">
                Justice Made <span className="text-primary-400">Accessible</span> Through Blockchain
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8">
                Connecting NGOs, donors, and lawyers to bring legal justice to those who need it most. Powered by transparent blockchain technology.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/bounties" className="btn btn-primary text-base px-6 py-3">
                  Explore Bounties
                </Link>
                <Link to="/register" className="btn btn-outline border-white text-white hover:bg-white/10 text-base px-6 py-3">
                  Join the Network
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 bg-gradient-to-br from-primary-800 to-secondary-800 rounded-xl p-8 shadow-2xl">
                <div className="absolute inset-0 bg-white/5 rounded-xl"></div>
                <h3 className="text-xl font-semibold mb-4">Latest Active Bounty</h3>
                
                <div className="bg-white/10 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">Land Rights Dispute</h4>
                    <span className="bg-accent-500 text-white text-xs px-2 py-1 rounded-full">$2,500</span>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">
                    Representing indigenous community in Eastern Province fighting illegal land grabbing.
                  </p>
                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>Nairobi, Kenya</span>
                    <span>7 days left</span>
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">Domestic Violence Case</h4>
                    <span className="bg-accent-500 text-white text-xs px-2 py-1 rounded-full">$1,800</span>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">
                    Legal protection and representation for victim of domestic violence.
                  </p>
                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>Mombasa, Kenya</span>
                    <span>3 days left</span>
                  </div>
                </div>
                
                <Link 
                  to="/bounties" 
                  className="flex items-center text-sm font-medium text-primary-300 hover:text-primary-200 transition-colors"
                >
                  <span>View All Bounties</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              {/* Network animation in background */}
              <div className="absolute -top-4 -left-4 -right-4 -bottom-4 z-0">
                <div className="network-node absolute top-1/4 left-1/4 w-3 h-3 bg-primary-500 rounded-full"></div>
                <div className="network-node absolute top-3/4 left-1/2 w-3 h-3 bg-primary-500 rounded-full"></div>
                <div className="network-node absolute top-1/3 right-1/4 w-3 h-3 bg-primary-500 rounded-full"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">How HakiChain Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform connects the dots between those who need legal help, those who can provide it, and those who can fund it.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="card flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <Landmark className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">NGOs Create Bounties</h3>
              <p className="text-gray-600">
                NGOs create bounties for legal cases, setting milestones and required deliverables for each stage of the legal process.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="card flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mb-6">
                <Scale className="w-8 h-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Lawyers Apply & Execute</h3>
              <p className="text-gray-600">
                Verified lawyers apply for bounties, get matched using our AI system, and complete legal work according to the milestones.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="card flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-accent-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure & Transparent</h3>
              <p className="text-gray-600">
                All transactions and documents are secured on the blockchain, ensuring transparency, accountability and trust.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Features That Make a Difference</h2>
              
              <div className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="flex"
                >
                  <CheckCircle className="w-6 h-6 text-primary-500 flex-shrink-0 mr-3" />
                  <div>
                    <h3 className="text-lg font-bold mb-1">AI-Powered Matching System</h3>
                    <p className="text-gray-600">Intelligent algorithm matches the right lawyer with the right case based on expertise, location, and history.</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="flex"
                >
                  <CheckCircle className="w-6 h-6 text-primary-500 flex-shrink-0 mr-3" />
                  <div>
                    <h3 className="text-lg font-bold mb-1">Blockchain-Verified Documents</h3>
                    <p className="text-gray-600">All legal documents are hashed and timestamped on the blockchain, ensuring their authenticity and preventing tampering.</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="flex"
                >
                  <CheckCircle className="w-6 h-6 text-primary-500 flex-shrink-0 mr-3" />
                  <div>
                    <h3 className="text-lg font-bold mb-1">Milestone-Based Payments</h3>
                    <p className="text-gray-600">Lawyers receive payments as they complete verified milestones, ensuring accountability and quality work.</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="flex"
                >
                  <CheckCircle className="w-6 h-6 text-primary-500 flex-shrink-0 mr-3" />
                  <div>
                    <h3 className="text-lg font-bold mb-1">Transparent Impact Tracking</h3>
                    <p className="text-gray-600">Donors can see exactly how their contributions are making a difference with real-time case progress updates.</p>
                  </div>
                </motion.div>
              </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="rounded-xl overflow-hidden shadow-xl"
            >
              <img 
                src="https://images.pexels.com/photos/5668859/pexels-photo-5668859.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Legal professionals working together" 
                className="w-full h-auto object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Ready to Make Justice Accessible?</h2>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Join our platform today and be part of the movement to make legal assistance available to those who need it most.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn bg-white text-primary-600 hover:bg-gray-100 text-base px-6 py-3">
              Register as NGO/Lawyer
            </Link>
            <Link to="/bounties" className="btn border border-white bg-transparent hover:bg-white/10 text-white text-base px-6 py-3">
              Browse Bounties
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};