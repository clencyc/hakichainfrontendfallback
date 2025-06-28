import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Scale, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

type WaitlistFormData = {
  full_name: string;
  lskNumber: string;
  email: string;
  legalSpecialty: string;
  phoneNumber: string;
  message?: string;
};

export const Waitlist = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WaitlistFormData>();

  const onSubmit = async (data: WaitlistFormData) => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      // Submit to Supabase
      const { error } = await supabase
        .from('lawyer_waitlist')
        .insert([data]);

      if (error) throw error;
      
      setSubmitStatus('success');
      reset(); // Clear the form
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-12">
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <Scale className="w-8 h-8 text-primary-600" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">Join Our Lawyer Network</h1>
            <p className="text-lg text-gray-600">
              Be part of our mission to make justice accessible to all. Join our waitlist and we'll notify you when we're ready to onboard new legal professionals.
            </p>
          </div>

          {submitStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 flex items-start"
            >
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-green-800 font-medium">Thank you for joining our waitlist!</h3>
                <p className="text-green-700 text-sm">
                  We've received your information and will reach out to you soon when we launch. 
                  Together, we'll make legal services more accessible.
                </p>
              </div>
            </motion.div>
          )}

          {submitStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 flex items-start"
            >
              <XCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-red-800 font-medium">Something went wrong</h3>
                <p className="text-red-700 text-sm">
                  We couldn't process your submission. Please try again or contact support if the problem persists.
                </p>
              </div>
            </motion.div>
          )}

          <div className="bg-white shadow-xl rounded-xl overflow-hidden">
            <div className="p-6 md:p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    id="full_name"
                    type="text"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.full_name ? 'border-red-300' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    placeholder="John Doe"
                    {...register('full_name', { required: 'Full name is required' })}
                  />
                  {errors.full_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.full_name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lskNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    LSK Number *
                  </label>
                  <input
                    id="lskNumber"
                    type="text"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.lskNumber ? 'border-red-300' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    placeholder="P/12345/2023"
                    {...register('lskNumber', { required: 'LSK number is required' })}
                  />
                  {errors.lskNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.lskNumber.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    placeholder="johndoe@example.com"
                    {...register('email', { 
                      required: 'Email is required', 
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      }
                    })}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="legalSpecialty" className="block text-sm font-medium text-gray-700 mb-1">
                    Legal Specialty *
                  </label>
                  <select
                    id="legalSpecialty"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.legalSpecialty ? 'border-red-300' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    {...register('legalSpecialty', { required: 'Legal specialty is required' })}
                  >
                    <option value="">Select your specialty</option>
                    <option value="Human Rights">Human Rights</option>
                    <option value="Family Law">Family Law</option>
                    <option value="Land Disputes">Land Disputes</option>
                    <option value="Criminal Law">Criminal Law</option>
                    <option value="Constitutional Law">Constitutional Law</option>
                    <option value="Environmental Law">Environmental Law</option>
                    <option value="Corporate Law">Corporate Law</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.legalSpecialty && (
                    <p className="mt-1 text-sm text-red-600">{errors.legalSpecialty.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    id="phoneNumber"
                    type="tel"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.phoneNumber ? 'border-red-300' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    placeholder="+254 712 345 678"
                    {...register('phoneNumber', { required: 'Phone number is required' })}
                  />
                  {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Message <span className="text-gray-400">(Optional)</span>
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Tell us about your experience and why you're interested in joining the HakiChain network..."
                    {...register('message')}
                  ></textarea>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-lg font-medium transition duration-200 flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      'Join Waitlist'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              Already registered? <a href="/login" className="text-primary-600 hover:text-primary-500">Sign in</a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Waitlist;
