import { useState, useEffect, useMemo } from 'react';
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
import { Search, Filter, MapPin, Calendar, DollarSign, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
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
  };
  status: string;
  priority: 'high' | 'medium' | 'low';
  billable_hours: number;
  milestones_completed: number;
  total_milestones: number;
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

  const columns = useMemo(
    () => [
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
      columnHelper.accessor(row => `${row.milestones_completed}/${row.total_milestones}`, {
        id: 'progress',
        header: 'Progress',
        cell: info => {
          const [completed, total] = info.getValue().split('/').map(Number);
          const percentage = (completed / total) * 100;
          return (
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>{info.getValue()} milestones</span>
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
    ],
    []
  );

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
              status
            )
          `)
          .eq('lawyer_id', user?.id);

        if (casesError) throw casesError;

        // Transform the data
        const transformedCases: Case[] = (lawyerCases || []).map(c => ({
          id: c.id,
          bounty: c.bounties,
          status: c.status,
          priority: determinePriority(c.bounties.due_date),
          billable_hours: c.billable_hours,
          milestones_completed: 2, // Mock data
          total_milestones: 4, // Mock data
          last_activity: new Date().toISOString(),
        }));

        setCases(transformedCases);
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

  const determinePriority = (dueDate: string): 'high' | 'medium' | 'low' => {
    const due = new Date(dueDate);
    const today = new Date();
    const daysRemaining = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysRemaining <= 3) return 'high';
    if (daysRemaining <= 7) return 'medium';
    return 'low';
  };

  return (
    <LawyerDashboardLayout>
      <div className="space-y-6">
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