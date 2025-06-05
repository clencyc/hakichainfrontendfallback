import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import { Plus, MoreVertical } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

const columns = {
  todo: {
    id: 'todo',
    title: 'To Do',
    color: 'bg-gray-100',
  },
  inProgress: {
    id: 'inProgress',
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
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const { data, error } = await supabase
          .from('bounties')
          .select(`
            *,
            milestones (*)
          `)
          .eq('ngo_id', user?.id);

        if (error) throw error;
        setTasks(data || []);
      } catch (err) {
        console.error('Error loading tasks:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      loadTasks();
    }
  }, [user]);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Update task status in database
    try {
      const { error } = await supabase
        .from('bounties')
        .update({ status: destination.droppableId })
        .eq('id', draggableId);

      if (error) throw error;

      // Update local state
      const newTasks = [...tasks];
      const task = newTasks.find(t => t.id === draggableId);
      task.status = destination.droppableId;
      setTasks(newTasks);
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900">Project Board</h1>
          <p className="text-lg text-gray-600">Manage your bounties and track progress</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
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
                        {tasks
                          .filter(task => task.status === column.id)
                          .map((task, index) => (
                            <Draggable
                              key={task.id}
                              draggableId={task.id}
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
                                    <h3 className="font-medium">{task.title}</h3>
                                    <button className="text-gray-500 hover:text-gray-700">
                                      <MoreVertical className="w-4 h-4" />
                                    </button>
                                  </div>
                                  <p className="text-sm text-gray-600 mt-2">
                                    {task.description}
                                  </p>
                                  <div className="mt-4 flex justify-between items-center text-sm">
                                    <span className="text-gray-500">
                                      {task.milestones?.length || 0} milestones
                                    </span>
                                    <span className="text-primary-600 font-medium">
                                      ${task.total_amount}
                                    </span>
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