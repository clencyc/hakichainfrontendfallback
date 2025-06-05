import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Trash2, AlertCircle } from 'lucide-react';

interface MilestoneInput {
  title: string;
  description: string;
  amount: string;
  dueDate: string;
  proofRequired: string;
}

export const CreateBounty = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    dueDate: '',
    tags: '',
    impact: '',
    totalAmount: '',
  });
  const [milestones, setMilestones] = useState<MilestoneInput[]>([
    {
      title: '',
      description: '',
      amount: '',
      dueDate: '',
      proofRequired: '',
    },
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleMilestoneChange = (index: number, field: keyof MilestoneInput, value: string) => {
    const updatedMilestones = [...milestones];
    updatedMilestones[index][field] = value;
    setMilestones(updatedMilestones);
    
    // Clear error for this milestone field if it exists
    const errorKey = `milestones.${index}.${field}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const addMilestone = () => {
    setMilestones([
      ...milestones,
      {
        title: '',
        description: '',
        amount: '',
        dueDate: '',
        proofRequired: '',
      },
    ]);
  };

  const removeMilestone = (index: number) => {
    if (milestones.length > 1) {
      const updatedMilestones = [...milestones];
      updatedMilestones.splice(index, 1);
      setMilestones(updatedMilestones);
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors['title'] = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors['description'] = 'Description is required';
    }
    
    if (!formData.category.trim()) {
      newErrors['category'] = 'Category is required';
    }
    
    if (!formData.location.trim()) {
      newErrors['location'] = 'Location is required';
    }
    
    if (!formData.dueDate) {
      newErrors['dueDate'] = 'Due date is required';
    } else {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      if (selectedDate <= today) {
        newErrors['dueDate'] = 'Due date must be in the future';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    let totalMilestoneAmount = 0;
    
    milestones.forEach((milestone, index) => {
      if (!milestone.title.trim()) {
        newErrors[`milestones.${index}.title`] = 'Title is required';
      }
      
      if (!milestone.description.trim()) {
        newErrors[`milestones.${index}.description`] = 'Description is required';
      }
      
      if (!milestone.amount.trim()) {
        newErrors[`milestones.${index}.amount`] = 'Amount is required';
      } else if (isNaN(parseFloat(milestone.amount)) || parseFloat(milestone.amount) <= 0) {
        newErrors[`milestones.${index}.amount`] = 'Amount must be a positive number';
      } else {
        totalMilestoneAmount += parseFloat(milestone.amount);
      }
      
      if (!milestone.dueDate) {
        newErrors[`milestones.${index}.dueDate`] = 'Due date is required';
      } else {
        const selectedDate = new Date(milestone.dueDate);
        const bountyDueDate = new Date(formData.dueDate);
        if (selectedDate > bountyDueDate) {
          newErrors[`milestones.${index}.dueDate`] = 'Milestone due date must be before bounty due date';
        }
      }
      
      if (!milestone.proofRequired.trim()) {
        newErrors[`milestones.${index}.proofRequired`] = 'Required proof is required';
      }
    });
    
    if (formData.totalAmount.trim() === '') {
      newErrors['totalAmount'] = 'Total amount is required';
    } else if (isNaN(parseFloat(formData.totalAmount)) || parseFloat(formData.totalAmount) <= 0) {
      newErrors['totalAmount'] = 'Total amount must be a positive number';
    } else if (totalMilestoneAmount !== parseFloat(formData.totalAmount)) {
      newErrors['totalAmount'] = `Total amount must equal sum of milestone amounts (${totalMilestoneAmount})`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 3) {
      // In a real application, this would create the bounty on the blockchain
      alert('Bounty created successfully!');
      navigate('/bounties');
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card"
        >
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Create New Bounty</h1>
            <p className="text-gray-600">
              Create a legal bounty to find legal representation for your cause
            </p>
          </div>
          
          <div className="mb-8">
            <div className="flex justify-between items-center relative">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full ${
                    s < step ? 'bg-primary-500 text-white' :
                    s === step ? 'bg-primary-500 text-white' :
                    'bg-gray-200 text-gray-500'
                  }`}
                >
                  {s}
                </div>
              ))}
              
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10 transform -translate-y-1/2">
                <div 
                  className="h-full bg-primary-500 transition-all duration-300"
                  style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
                ></div>
              </div>
            </div>
            
            <div className="flex justify-between mt-2 text-sm">
              <span className={step >= 1 ? 'text-primary-600 font-medium' : 'text-gray-500'}>Bounty Details</span>
              <span className={step >= 2 ? 'text-primary-600 font-medium' : 'text-gray-500'}>Milestones</span>
              <span className={step >= 3 ? 'text-primary-600 font-medium' : 'text-gray-500'}>Review</span>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            {/* Step 1: Bounty Details */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="label">Bounty Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`input ${errors.title ? 'border-error-500 focus:ring-error-500' : ''}`}
                    placeholder="e.g., Land Rights Case for Indigenous Community"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-error-600">{errors.title}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="description" className="label">Detailed Description *</label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    className={`input ${errors.description ? 'border-error-500 focus:ring-error-500' : ''}`}
                    placeholder="Describe the legal case in detail, including background information and what kind of legal help is needed."
                  ></textarea>
                  {errors.description && (
                    <p className="mt-1 text-sm text-error-600">{errors.description}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="category" className="label">Category *</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={`input ${errors.category ? 'border-error-500 focus:ring-error-500' : ''}`}
                    >
                      <option value="">Select a category</option>
                      <option value="Land Rights">Land Rights</option>
                      <option value="Family Law">Family Law</option>
                      <option value="Human Rights">Human Rights</option>
                      <option value="Environmental Law">Environmental Law</option>
                      <option value="Criminal Law">Criminal Law</option>
                      <option value="Corporate Law">Corporate Law</option>
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-error-600">{errors.category}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="location" className="label">Location *</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className={`input ${errors.location ? 'border-error-500 focus:ring-error-500' : ''}`}
                      placeholder="e.g., Nairobi, Kenya"
                    />
                    {errors.location && (
                      <p className="mt-1 text-sm text-error-600">{errors.location}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="dueDate" className="label">Due Date *</label>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    className={`input ${errors.dueDate ? 'border-error-500 focus:ring-error-500' : ''}`}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {errors.dueDate && (
                    <p className="mt-1 text-sm text-error-600">{errors.dueDate}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="tags" className="label">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="e.g., Land Rights, Indigenous, Corporate Accountability"
                  />
                </div>
                
                <div>
                  <label htmlFor="impact" className="label">Impact Description</label>
                  <textarea
                    id="impact"
                    name="impact"
                    rows={3}
                    value={formData.impact}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Describe the social impact this case will have if successful."
                  ></textarea>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="btn btn-primary py-2.5 px-6"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
            
            {/* Step 2: Milestones */}
            {step === 2 && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Milestones</h2>
                  <div>
                    <label htmlFor="totalAmount" className="label">Total Bounty Amount ($) *</label>
                    <input
                      type="number"
                      id="totalAmount"
                      name="totalAmount"
                      value={formData.totalAmount}
                      onChange={handleInputChange}
                      className={`input ${errors.totalAmount ? 'border-error-500 focus:ring-error-500' : ''}`}
                      placeholder="e.g., 2500"
                      min="1"
                      step="1"
                    />
                    {errors.totalAmount && (
                      <p className="mt-1 text-sm text-error-600">{errors.totalAmount}</p>
                    )}
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="p-4 bg-primary-50 border-l-4 border-primary-500 rounded-md flex items-start">
                    <AlertCircle className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0" />
                    <p className="text-sm text-primary-700">
                      Break down your bounty into specific milestones. Each milestone should have clear deliverables
                      and a portion of the total bounty amount. The sum of all milestone amounts should equal your total bounty amount.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-8">
                  {milestones.map((milestone, index) => (
                    <div key={index} className="p-5 border border-gray-200 rounded-lg relative">
                      {milestones.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMilestone(index)}
                          className="absolute -top-3 -right-3 bg-error-100 hover:bg-error-200 text-error-600 p-1.5 rounded-full transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      
                      <h3 className="text-lg font-medium mb-4">Milestone {index + 1}</h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="label">Title *</label>
                          <input
                            type="text"
                            value={milestone.title}
                            onChange={(e) => handleMilestoneChange(index, 'title', e.target.value)}
                            className={`input ${errors[`milestones.${index}.title`] ? 'border-error-500 focus:ring-error-500' : ''}`}
                            placeholder="e.g., Initial Documentation"
                          />
                          {errors[`milestones.${index}.title`] && (
                            <p className="mt-1 text-sm text-error-600">{errors[`milestones.${index}.title`]}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="label">Amount ($) *</label>
                          <input
                            type="number"
                            value={milestone.amount}
                            onChange={(e) => handleMilestoneChange(index, 'amount', e.target.value)}
                            className={`input ${errors[`milestones.${index}.amount`] ? 'border-error-500 focus:ring-error-500' : ''}`}
                            placeholder="e.g., 500"
                            min="1"
                            step="1"
                          />
                          {errors[`milestones.${index}.amount`] && (
                            <p className="mt-1 text-sm text-error-600">{errors[`milestones.${index}.amount`]}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label className="label">Description *</label>
                        <textarea
                          value={milestone.description}
                          onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)}
                          className={`input ${errors[`milestones.${index}.description`] ? 'border-error-500 focus:ring-error-500' : ''}`}
                          placeholder="Describe what needs to be accomplished in this milestone"
                          rows={2}
                        ></textarea>
                        {errors[`milestones.${index}.description`] && (
                          <p className="mt-1 text-sm text-error-600">{errors[`milestones.${index}.description`]}</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="label">Due Date *</label>
                          <input
                            type="date"
                            value={milestone.dueDate}
                            onChange={(e) => handleMilestoneChange(index, 'dueDate', e.target.value)}
                            className={`input ${errors[`milestones.${index}.dueDate`] ? 'border-error-500 focus:ring-error-500' : ''}`}
                            min={new Date().toISOString().split('T')[0]}
                            max={formData.dueDate}
                          />
                          {errors[`milestones.${index}.dueDate`] && (
                            <p className="mt-1 text-sm text-error-600">{errors[`milestones.${index}.dueDate`]}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="label">Required Proof *</label>
                          <input
                            type="text"
                            value={milestone.proofRequired}
                            onChange={(e) => handleMilestoneChange(index, 'proofRequired', e.target.value)}
                            className={`input ${errors[`milestones.${index}.proofRequired`] ? 'border-error-500 focus:ring-error-500' : ''}`}
                            placeholder="e.g., Court filing receipt"
                          />
                          {errors[`milestones.${index}.proofRequired`] && (
                            <p className="mt-1 text-sm text-error-600">{errors[`milestones.${index}.proofRequired`]}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={addMilestone}
                    className="flex items-center justify-center w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-500 hover:text-primary-500 transition-colors"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    <span>Add Another Milestone</span>
                  </button>
                </div>
                
                <div className="pt-6 flex justify-between">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="btn btn-outline py-2.5 px-6"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="btn btn-primary py-2.5 px-6"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
            
            {/* Step 3: Review */}
            {step === 3 && (
              <div>
                <div className="p-4 bg-primary-50 border-l-4 border-primary-500 rounded-md mb-6 flex items-start">
                  <AlertCircle className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0" />
                  <p className="text-sm text-primary-700">
                    Please review your bounty details. Once published, you won't be able to edit certain fields.
                    You will need to connect your wallet to post this bounty on the blockchain.
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Bounty Details</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Title</p>
                          <p className="font-medium">{formData.title}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500">Category</p>
                          <p className="font-medium">{formData.category}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-medium">{formData.location}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500">Due Date</p>
                          <p className="font-medium">{new Date(formData.dueDate).toLocaleDateString()}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500">Total Amount</p>
                          <p className="font-medium">${formData.totalAmount}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500">Tags</p>
                          <p className="font-medium">{formData.tags || 'None'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Description & Impact</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Description</p>
                          <p className="text-sm">{formData.description}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500">Impact</p>
                          <p className="text-sm">{formData.impact || 'None specified'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Milestones</h3>
                    <div className="space-y-3">
                      {milestones.map((milestone, index) => (
                        <div key={index} className="p-3 border border-gray-200 rounded">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium">{milestone.title}</h4>
                            <span className="text-accent-600">${milestone.amount}</span>
                          </div>
                          <p className="text-sm text-gray-600 my-1">{milestone.description}</p>
                          <div className="text-sm">
                            <span className="text-gray-500">Due: </span>
                            <span>{new Date(milestone.dueDate).toLocaleDateString()}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">Proof: </span>
                            <span>{milestone.proofRequired}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 flex justify-between">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="btn btn-outline py-2.5 px-6"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary py-2.5 px-6"
                  >
                    Publish Bounty
                  </button>
                </div>
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
};