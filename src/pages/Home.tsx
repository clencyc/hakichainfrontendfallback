import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Scale, Landmark, BarChart3, Users, FileCheck, DollarSign, Clock, TrendingUp } from 'lucide-react';
import { Footer } from '../components/layout/Footer';

export const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="pt-20 pb-12 md:pt-32 md:pb-24 bg-gradient-to-br from-primary-950 via-primary-900 to-secondary-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Centered Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center text-center"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold font-serif leading-tight mb-6 tracking-tight drop-shadow-lg">
              Professional <span className="text-primary-400">Legal Tools</span> for Modern Lawyers
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto font-medium">
              Manage cases, connect with clients, and access funding through our <span className="text-primary-300 font-semibold">blockchain-powered platform</span>.<br />
              Everything you need to run a successful legal practice.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              <Link to="/lawyer/dashboard" className="btn btn-primary text-lg px-10 py-4 rounded-full shadow-lg bg-primary-500 hover:bg-primary-400 transform hover:scale-105 transition-all duration-200">
                Access Lawyer Dashboard
              </Link>
              <Link to="/bounties" className="btn border-2 border-primary-300 bg-transparent hover:bg-primary-500/20 text-white text-base px-8 py-3 rounded-full shadow-lg">
                Explore Bounties
              </Link>
            </div>
            <div className="flex flex-col items-center gap-2 mt-4">
              <span className="uppercase tracking-widest text-xs text-primary-200 font-semibold">Trusted by Legal Professionals</span>
              <span className="h-1 w-16 bg-primary-400 rounded-full"></span>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Lawyer Tools Showcase */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Complete Legal Practice Management</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to run a modern legal practice, from case management to client acquisition and payment processing.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="card p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Case Management Dashboard</h3>
              <p className="text-gray-600 mb-4">
                Track cases, deadlines, and milestones with comprehensive analytics and automated reminders.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Case timeline tracking</li>
                <li>• Deadline management</li>
                <li>• Progress analytics</li>
              </ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="card p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-secondary-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Client Matching System</h3>
              <p className="text-gray-600 mb-4">
                AI-powered system connects you with verified clients who need your specific expertise.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Specialty-based matching</li>
                <li>• Verified client profiles</li>
                <li>• Smart recommendations</li>
              </ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="card p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-accent-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Bounty Marketplace</h3>
              <p className="text-gray-600 mb-4">
                Access funded legal cases with transparent payment terms and milestone-based compensation.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Guaranteed payments</li>
                <li>• Milestone tracking</li>
                <li>• Transparent funding</li>
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="card p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <FileCheck className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Document Verification</h3>
              <p className="text-gray-600 mb-4">
                Blockchain-secured document verification and smart contract automation for legal processes.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Blockchain verification</li>
                <li>• Smart contracts</li>
                <li>• Tamper-proof records</li>
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
              className="card p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-secondary-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Payment & Escrow</h3>
              <p className="text-gray-600 mb-4">
                Secure blockchain-based payment processing with automated escrow for client protection.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Automated escrow</li>
                <li>• Secure payments</li>
                <li>• Client protection</li>
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
              className="card p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-accent-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Analytics & Reporting</h3>
              <p className="text-gray-600 mb-4">
                Comprehensive performance analytics and automated reporting for better practice management.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Performance metrics</li>
                <li>• Financial reporting</li>
                <li>• Practice insights</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Lawyer Benefits */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Why Legal Professionals Choose HakiChain</h2>
              
              <div className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="flex items-start"
                >
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">Save 40% of Administrative Time</h3>
                    <p className="text-gray-600">Automated case tracking, deadline management, and client communication reduce administrative overhead significantly.</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start"
                >
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                    <DollarSign className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">Guaranteed Payment Security</h3>
                    <p className="text-gray-600">Blockchain-secured escrow ensures you get paid for completed work with transparent milestone-based payments.</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="flex items-start"
                >
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">Access to Quality Clients</h3>
                    <p className="text-gray-600">Connect with verified NGOs and clients who have pre-funded legal cases that match your expertise.</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="flex items-start"
                >
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">Build Professional Reputation</h3>
                    <p className="text-gray-600">Transparent performance tracking and client reviews help you build a verified professional reputation on-chain.</p>
                  </div>
                </motion.div>
              </div>

              <div className="mt-8">
                <Link to="/lawyer/dashboard" className="btn btn-primary text-base px-6 py-3 inline-flex items-center gap-2">
                  Start Using Tools
                  <Scale className="w-4 h-4" />
                </Link>
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
                alt="Legal professionals working with modern tools" 
                className="w-full h-auto object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="py-16 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Trusted by Legal Professionals</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join a growing network of lawyers who are transforming their practice with HakiChain's tools.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">150+</div>
              <div className="text-gray-600">Verified Lawyers</div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">500+</div>
              <div className="text-gray-600">Cases Managed</div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">98%</div>
              <div className="text-gray-600">Payment Success</div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">40%</div>
              <div className="text-gray-600">Time Saved</div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Ready to Transform Your Legal Practice?</h2>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Join HakiChain today and access the tools you need to manage cases efficiently, connect with quality clients, and grow your practice.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/lawyer/dashboard" className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-4 rounded-full transform hover:scale-105 transition-all duration-200">
              Access Lawyer Dashboard
            </Link>
            <Link to="/register" className="btn border-2 border-white bg-transparent hover:bg-white/10 text-white text-base px-6 py-3 rounded-full">
              Register as Lawyer
            </Link>
          </div>
          <div className="mt-8 text-white/80 text-sm">
            <p>Already have an account? <Link to="/login" className="text-white underline hover:text-primary-200">Sign in here</Link></p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};