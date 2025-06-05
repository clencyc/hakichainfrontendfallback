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
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Clock,
  CheckCircle,
  FileText,
  MoreVertical,
  Calendar,
  MapPin,
  Flag,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { LawyerDashboardLayout } from '../../components/layout/LawyerDashboardLayout';
import { format } from 'date-fns';

interface Case {
  id: string;
  bounty: {
    id: string;
    title: string;
    category: string;
    location: string;
    due_date: string;
    total_amount: number;
  };
  status: string;
  priority: 'high' | 'medium' | 'low';
  billable_hours: number;
  next_deadline?: string;
  progress: number;
}

const columnHelper = createColumnHelper<Case>();

const priorityColors = {
  high: 'bg-error-100 text-error-700',
  medium: 'bg-warning-100 text-warning-700',
  low: 'bg-success-100 text-success-700',
};

export const LawyerCases = () => {
  const { user } = useAuth();
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const columns = useMemo(
    () => [
      columnHelper.accessor('bounty.title', {
        header: 'Case',
        cell: (info) => (
          <div>
            <Link
              to={`/bounties/${info.row.original.bounty.id}`}
              className="font-medium text-gray-900 hover:text-primary-600"
            >
              {info.getValue()}
            </Link>
            <div className="text-sm text-gray-500">{info.row.original.bounty.category}</div>
          </div>
        ),
      }),
      columnHelper.accessor('priority', {
        header: 'Priority',
        cell: (info) => (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              priorityColors[info.getValue()]
            }`}
          >
            <Flag className="w-3 h-3 mr-1" />
            {info.getValue().charAt(0).toUpperCase() + info.getValue().slice(1)}
          </span>
        ),
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              info.getValue() === 'completed'
                ? 'bg-success-100 text-success-700'
                : info.getValue() === 'in-progress'
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {info.getValue() === 'completed' ? (
              <CheckCircle className="w-3 h-3 mr-1" />
            ) : (
              <Clock className="w-3 h-3 mr-1" />
            )}
            {info.getValue().charAt(0).toUpperCase() + info.getValue().slice(1)}
          </span>
        ),
      }),
      columnHelper.accessor('progress', {
        header: 'Progress',
        cell: (info) => (
          <div className="w-full">
            <div className="flex justify-between text-xs mb-1">
              <span>{info.getValue()}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500 rounded-full"
                style={{ width: `${info.getValue()}%` }}
              ></div>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor('bounty.location', {
        header: 'Location',
        cell: (info) => (
          <div className="flex items-center text-gray-500">
            <MapPin className="w-4 h-4 mr-1" />
            {info.getValue()}
          </div>
        ),
      }),
      columnHelper.accessor('bounty.due_date', {
        header: 'Due Date',
        cell: (info) => (
          <div className="flex items-center text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            {format(new Date(info.getValue()), 'MMM d, yyyy')}
          </div>
        ),
      }),
      columnHelper.accessor('billable_hours', {
        header: 'Hours',
        cell: (info) => (
          <div className="text-gray-900">{info.getValue()} hrs</div>
        ),
      }),
      columnHelper.display({
        id: 'actions',
        cell: () => (
          <button className="text-gray-400 hover:text-gray-600">
            <MoreVertical className="w-5 h-5" />
          </button>
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
      globalFilter,
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
            bounty:bounties (
              id,
              title,
              category,
              location,
              due_date,
              total_amount
            )
          `)
          .eq('lawyer_id', user?.id);

        if (casesError) throw casesError;

        // Transform the data
        const transformedCases = (lawyerCases || []).map((c) => ({
          id: c.id,
          bounty: c.bounty,
          status: c.status,
          priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low',
          billable_hours: c.billable_hours,
          progress: Math.floor(Math.random() * 100),
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

  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || c.priority === priorityFilter;
      return matchesStatus && matchesPriority;
    });
  }, [cases, statusFilter, priorityFilter]);

  if (isLoading) {
    return (
      <LawyerDashboardLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </LawyerDashboardLayout>
    );
  }

  return (
    <LawyerDashboardLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Filter className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none bg-white"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Flag className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none bg-white"
                  >
                    <option value="all">All Priority</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            className={`flex items-center ${
                              header.column.getCanSort() ? 'cursor-pointer select-none' : ''
                            }`}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: <ChevronUp className="w-4 h-4 ml-1" />,
                              desc: <ChevronDown className="w-4 h-4 ml-1" />,
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {cases.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No cases found</h3>
                <p className="text-gray-500">Start by browsing available bounties</p>
                <Link to="/bounties" className="btn btn-primary mt-4">
                  Browse Bounties
                </Link>
              </div>
            )}
          </div>

          {cases.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
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
                  <span className="text-sm text-gray-600">
                    Page {table.getState().pagination.pageIndex + 1} of{' '}
                    {table.getPageCount()}
                  </span>
                </div>
                <select
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => table.setPageSize(Number(e.target.value))}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                >
                  {[10, 25, 50].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      Show {pageSize}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </LawyerDashboardLayout>
  );
};