import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  getPaginationRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { Search, Filter, MapPin, Calendar, DollarSign, Clock, AlertCircle, CheckCircle, XCircle, Upload } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { LawyerDashboardLayout } from '../../components/layout/LawyerDashboardLayout';
import { cn } from '../../utils/cn';

interface Case {
  id: string;
  bounty: {
    id: string;
    title: string;
    category: string;
    location: string;
    due_date: string;
    total_amount: number;
    status: string;
    milestones: {
      id: string;
      title: string;
      description: string;
      amount: number;
      due_date: string;
      status: string;
      proof_required: string;
      proof_submitted?: {
        documentHash: string;
        timestamp: string;
        url: string;
      };
      documents?: {
        id: string;
        name: string;
        path: string;
        size: number;
        type: string;
        created_at: string;
        milestone_id: string;
      }[];
    }[];
  };
  status: string;
  priority: 'high' | 'medium' | 'low';
  billable_hours: number;
  last_activity: string;
}

const columnHelper = createColumnHelper<Case>();

export const LawyerCases = () => {
  const { user } = useAuth();
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  useEffect(() => {
    const loadCases = async () => {
      try {
        const { data: lawyerCases, error: casesError } = await supabase
          .from('lawyer_cases')
          .select(`
            *,
            bounties (
              id,
              title,
              category,
              location,
              due_date,
              total_amount,
              status,
              milestones (
                id,
                title,
                description,
                amount,
                due_date,
                status,
                proof_required,
                proof_submitted,
                documents (
                  id,
                  name,
                  path,
                  size,
                  type,
                  created_at,
                  milestone_id
                )
              )
            )
          `)
          .eq('lawyer_id', user?.id);

        if (casesError) throw casesError;

        // Transform the data
        const transformedCases: Case[] = (lawyerCases || []).map(c => ({
          id: c.id,
          bounty: {
            ...c.bounties,
            milestones: c.bounties.milestones.map((m: any) => ({
              ...m,
              documents: m.documents || []
            }))
          },
          status: c.status,
          priority: determinePriority(c.bounties.due_date),
          billable_hours: c.billable_hours,
          last_activity: new Date().toISOString(),
        }));

        // --- Inject fake bounties for demo/testing ---
        const fakeCases: Case[] = [
          {
            id: 'fake-1',
            bounty: {
              id: 'bounty-fake-1',
              title: 'Domestic Violence Protection',
              category: 'Family Law',
              location: 'Mombasa, Kenya',
              due_date: '2025-05-15T00:00:00.000Z',
              total_amount: 1800,
              status: 'active',
              milestones: [
                {
                  id: 'm1',
                  title: 'Protection Order Filing',
                  description: 'File for emergency protection order',
                  amount: 400,
                  due_date: '2025-04-20T00:00:00.000Z',
                  status: 'completed',
                  proof_required: 'Filed protection order documents',
                  proof_submitted: {
                    documentHash: 'xyz123',
                    timestamp: new Date().toISOString(),
                    url: '#',
                  },
                  documents: [],
                },
                {
                  id: 'm2',
                  title: 'Court Representation',
                  description: 'Represent client in protection order hearing',
                  amount: 500,
                  due_date: '2025-04-30T00:00:00.000Z',
                  status: 'pending',
                  proof_required: 'Court appearance record',
                  documents: [],
                },
                {
                  id: 'm3',
                  title: 'Legal Separation Filing',
                  description: 'Prepare and file legal separation documents',
                  amount: 600,
                  due_date: '2025-05-10T00:00:00.000Z',
                  status: 'pending',
                  proof_required: 'Filed separation documents',
                  documents: [],
                },
                {
                  id: 'm4',
                  title: 'Follow-up and Support',
                  description: 'Provide legal counseling and follow-up support',
                  amount: 300,
                  due_date: '2025-05-15T00:00:00.000Z',
                  status: 'pending',
                  proof_required: 'Counseling session notes and action plan',
                  documents: [],
                },
              ],
            },
            status: 'active',
            priority: 'medium',
            billable_hours: 12,
            last_activity: new Date().toISOString(),
          },
          {
            id: 'fake-2',
            bounty: {
              id: 'bounty-fake-2',
              title: 'Land Rights Dispute',
              category: 'Property Law',
              location: 'Kisumu, Kenya',
              due_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
              total_amount: 2500,
              status: 'active',
              milestones: [
                {
                  id: 'm1',
                  title: 'Evidence Gathering',
                  description: 'Collect all necessary documents',
                  amount: 1000,
                  due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
                  status: 'completed',
                  proof_required: 'Document List',
                  proof_submitted: {
                    documentHash: 'def456',
                    timestamp: new Date().toISOString(),
                    url: '#',
                  },
                  documents: [],
                },
                {
                  id: 'm2',
                  title: 'Negotiation',
                  description: 'Negotiate with opposing party',
                  amount: 1500,
                  due_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
                  status: 'pending',
                  proof_required: 'Negotiation Report',
                  documents: [],
                },
              ],
            },
            status: 'active',
            priority: 'low',
            billable_hours: 5,
            last_activity: new Date().toISOString(),
          },
        ];
        // --- End fake bounties ---

        setCases([...transformedCases, ...fakeCases]);
      } catch (error) {
        console.error('Error loading cases:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      loadCases();
    }
  }, [user]);

  const handleFileUpload = async (milestoneId: string, file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create document record
      const { error: docError } = await supabase
        .from('documents')
        .insert({
          name: file.name,
          path: filePath,
          uploaded_by: user?.id,
          milestone_id: milestoneId,
          size: file.size,
          type: file.type,
        });

      if (docError) throw docError;

      // Refresh case data
      const { data: updatedCase, error: refreshError } = await supabase
        .from('lawyer_cases')
        .select(`
          *,
          bounties (
            id,
            title,
            category,
            location,
            due_date,
            total_amount,
            status,
            milestones (
              id,
              title,
              description,
              amount,
              due_date,
              status,
              proof_required,
              proof_submitted,
              documents (
                id,
                name,
                path,
                size,
                type,
                created_at,
                milestone_id
              )
            )
          )
        `)
        .eq('id', cases[0].id)
        .single();

      if (refreshError) throw refreshError;

      // Update state with new data
      setCases(prev => prev.map(c => 
        c.id === updatedCase.id ? {
          ...c,
          bounty: {
            ...updatedCase.bounties,
            milestones: updatedCase.bounties.milestones.map((m: any) => ({
              ...m,
              documents: m.documents || []
            }))
          }
        } : c
      ));

      alert('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file');
    }
  };

  const determinePriority = (dueDate: string): 'high' | 'medium' | 'low' => {
    const due = new Date(dueDate);
    const today = new Date();
    const daysRemaining = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysRemaining <= 3) return 'high';
    if (daysRemaining <= 7) return 'medium';
    return 'low';
  };

  const columns = [
    columnHelper.accessor('bounty.title', {
      header: 'Case Title',
      cell: info => (
        <Link
          to={`/bounties/${info.row.original.bounty.id}`}
          className="font-medium text-primary-600 hover:text-primary-700"
        >
          {info.getValue()}
        </Link>
      ),
    }),
    columnHelper.accessor('bounty.category', {
      header: 'Type',
      cell: info => (
        <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => {
        const status = info.getValue();
        return (
          <span className={cn(
            "px-2 py-1 rounded-full text-sm font-medium",
            status === 'active' ? 'bg-primary-100 text-primary-700' :
            status === 'completed' ? 'bg-success-100 text-success-700' :
            'bg-gray-100 text-gray-700'
          )}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      },
    }),
    columnHelper.accessor('priority', {
      header: 'Priority',
      cell: info => {
        const priority = info.getValue();
        return (
          <span className={cn(
            "px-2 py-1 rounded-full text-sm font-medium",
            priority === 'high' ? 'bg-error-100 text-error-700' :
            priority === 'medium' ? 'bg-warning-100 text-warning-700' :
            'bg-success-100 text-success-700'
          )}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </span>
        );
      },
    }),
    columnHelper.accessor('bounty.milestones', {
      header: 'Progress',
      cell: info => {
        const milestones = info.getValue();
        const completed = milestones.filter(m => m.status === 'completed').length;
        const total = milestones.length;
        const percentage = (completed / total) * 100;
        
        return (
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>{completed}/{total} milestones</span>
              <span>{Math.round(percentage)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary-500"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        );
      },
    }),
    columnHelper.accessor('bounty.due_date', {
      header: 'Due Date',
      cell: info => {
        const dueDate = new Date(info.getValue());
        const today = new Date();
        const daysRemaining = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        return (
          <div className="flex items-center">
            <Clock className={cn(
              "w-4 h-4 mr-2",
              daysRemaining <= 3 ? 'text-error-500' :
              daysRemaining <= 7 ? 'text-warning-500' :
              'text-success-500'
            )} />
            <div>
              <div className="font-medium">
                {dueDate.toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-500">
                {daysRemaining} days left
              </div>
            </div>
          </div>
        );
      },
    }),
    columnHelper.accessor('billable_hours', {
      header: 'Hours',
      cell: info => (
        <span className="font-medium">{info.getValue()}</span>
      ),
    }),
  ];

  const table = useReactTable({
    data: cases,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <LawyerDashboardLayout>
      <div className="container mx-auto px-4 mt-20 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900">Active Cases</h1>
          <p className="text-lg text-gray-600">Manage and track your legal cases</p>
        </div>

        <div className="card">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search cases..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div className="relative w-full md:w-48">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              
              <div className="relative w-full md:w-48">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AlertCircle className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none bg-white"
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id} className="border-b border-gray-200">
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map(row => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {row.getVisibleCells().map(cell => (
                      <td
                        key={cell.id}
                        className="px-6 py-4 whitespace-nowrap"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {cases.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-600 mb-2">No cases found</h3>
                <p className="text-gray-500 mb-6">Start by browsing available bounties</p>
                <Link to="/bounties" className="btn btn-primary">
                  Browse Bounties
                </Link>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="btn btn-outline py-1 px-3 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="btn btn-outline py-1 px-3 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <span className="text-sm text-gray-600">
                Page {table.getState().pagination.pageIndex + 1} of{' '}
                {table.getPageCount()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </LawyerDashboardLayout>
  );
};