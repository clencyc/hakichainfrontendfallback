import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import { Plus, MoreVertical, MapPin, Calendar, DollarSign, Users, Clock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Link } from 'react-router-dom';

interface Bounty {
  id: string;
  title: string;
  description: string;
  status: string;
  location: string;
  due_date: string;
  total_amount: number;
  raised_amount: number;
  milestones: {
    id: string;
    title: string;
    status: string;
  }[];
  assigned_lawyer?: {
    id: string;
    name: string;
  };
}

const columns = {
  open: {
    id: 'open',
    title: 'Open Bounties',
    color: 'bg-gray-100',
  },
  'in-progress': {
    id: 'in-progress',
    title: 'In Progress',
    color: 'bg-primary-50',
  },
  review: {
    id: 'review',
    title: 'In Review',
    color: 'bg-warning-50',
  },
  completed: {
    id: 'completed',
    title: 'Completed',
    color: 'bg-success-50',
  },
};

export const NGOProjectBoard = () => {
  const { user } = useAuth();
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBounties = async () => {
      try {
        const { data, error } = await supabase
          .from('bounties')
          .select(`
            *,
            milestones (
              id,
              title,
              status
            ),
            users!assigned_lawyer_id (
              id,
              name
            )
          `)
          .eq('ngo_id', user?.id);

        if (error) throw error;
        setBounties(data || []);
      } catch (err) {
        console.error('Error loading bounties:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      loadBounties();
    }
  }, [user]);

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Update bounty status in database
    try {
      const { error } = await supabase
        .from('bounties')
        .update({ status: destination.droppableId })
        .eq('id', draggableId);

      if (error) throw error;

      // Update local state
      const newBounties = [...bounties];
      const bounty = newBounties.find(b => b.id === draggableId);
      if (bounty) {
        bounty.status = destination.droppableId;
        setBounties(newBounties);
      }
    } catch (err) {
      console.error('Error updating bounty status:', err);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900">Project Board</h1>
              <p className="text-lg text-gray-600">Manage your bounties and track progress</p>
            </div>
            <Link to="/create-bounty" className="btn btn-primary">
              <Plus className="w-5 h-5 mr-2" />
              Create Bounty
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-4">
                  {Array.from({ length: 2 }).map((_, cardIndex) => (
                    <div key={cardIndex} className="bg-white rounded-lg p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.values(columns).map(column => (
                <div key={column.id} className="card">
                  <div className="p-4 border-b border-gray-200">
                    <h2 className="font-bold text-gray-900">{column.title}</h2>
                  </div>
                  
                  <Droppable droppableId={column.id}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="p-4 space-y-4 min-h-[200px]"
                      >
                        {bounties
                          .filter(bounty => bounty.status === column.id)
                          .map((bounty, index) => (
                            <Draggable
                              key={bounty.id}
                              draggableId={bounty.id}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`p-4 rounded-lg ${column.color} shadow-sm`}
                                >
                                  <div className="flex justify-between items-start">
                                    <Link 
                                      to={`/bounties/${bounty.id}`}
                                      className="font-medium hover:text-primary-600"
                                    >
                                      {bounty.title}
                                    </Link>
                                    <button className="text-gray-500 hover:text-gray-700">
                                      <MoreVertical className="w-4 h-4" />
                                    </button>
                                  </div>

                                  <div className="mt-2 space-y-2 text-sm text-gray-600">
                                    <div className="flex items-center">
                                      <MapPin className="w-4 h-4 mr-1" />
                                      <span>{bounty.location}</span>
                                    </div>
                                    
                                    <div className="flex items-center">
                                      <Calendar className="w-4 h-4 mr-1" />
                                      <span>Due: {new Date(bounty.due_date).toLocaleDateString()}</span>
                                    </div>

                                    <div className="flex items-center">
                                      <DollarSign className="w-4 h-4 mr-1" />
                                      <span>${bounty.raised_amount} / ${bounty.total_amount}</span>
                                    </div>

                                    {bounty.assigned_lawyer && (
                                      <div className="flex items-center">
                                        <Users className="w-4 h-4 mr-1" />
                                        <span>Lawyer: {bounty.assigned_lawyer.name}</span>
                                      </div>
                                    )}
                                  </div>

                                  <div className="mt-3">
                                    <div className="flex justify-between text-sm mb-1">
                                      <span>Progress</span>
                                      <span>
                                        {bounty.milestones.filter(m => m.status === 'completed').length} of {bounty.milestones.length} milestones
                                      </span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-primary-500"
                                        style={{ 
                                          width: `${(bounty.milestones.filter(m => m.status === 'completed').length / bounty.milestones.length) * 100}%` 
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </DragDropContext>
        )}
      </div>
    </DashboardLayout>
  );
};