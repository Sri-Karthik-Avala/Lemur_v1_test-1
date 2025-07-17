import React, { useEffect, useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { Building2, Users, Calendar, Mail, Phone, Plus, Search, Filter, FileText, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ClientModal } from '../components/ClientModal';
import { Modal } from '../components/Modal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { cn } from '../utils/cn';
import { SEO } from '../components/SEO';
import { seoConfigs } from '../utils/seoConfig';
import { Client, ApiService } from '../services/api';

export const Clients: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // State for API data
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Fetch clients on component mount
  useEffect(() => {
    if (user) {
      fetchClients();
    }
  }, [user]);

  const fetchClients = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await ApiService.getMyClients();
      // Transform API response to match Client interface
      const transformedClients = (response.clients || [])
        .map((client: any) => {
          const rawId = client.client_id ?? client.id ?? client.clientId;
        const rawName = client.client_name ?? client.name ?? client.clientName;
        if (!rawId || !rawName) {
          console.warn('⚠️ Unrecognized client object shape', client);
          return null; // skip malformed
        }
        return {
          id: rawId.toString(),
          name: rawName,
        description: '',
        user_id: user?.id || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_active: client.is_active ?? true,
        }; }).filter(Boolean) as Client[];
      setClients(transformedClients);
    } catch (err) {
      setError('Failed to fetch clients. Please try again.');
      console.error('Error fetching clients:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter clients based on search
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (client.description && client.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const handleSaveClient = async (clientData: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: Implement API call to save client
      // For now, just close the modal
      setEditingClient(null);
      setIsModalOpen(false);
      
      // Refresh clients list
      await fetchClients();
    } catch (error) {
      console.error('Failed to save client:', error);
      setError('Failed to save client. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClient = async (client: Client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleDeleteClient = async (clientId: string) => {
    if (window.confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      setIsLoading(true);
      try {
        // TODO: Implement API call to delete client
        // For now, just refresh the list
        await fetchClients();
      } catch (error) {
        console.error('Failed to delete client:', error);
        setError('Failed to delete client. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <SEO {...seoConfigs.clients} />
      <Navbar />
      
      <main className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="animate-fade-in"
        >
          {/* Header */}
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-bold md:text-3xl" style={{ color: 'var(--text-primary)' }}>
                Clients
              </h1>
              <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>
                Manage your client relationships and project history
              </p>
            </div>

            <Button
              leftIcon={<Plus className="h-5 w-5" />}
              size="lg"
              onClick={() => setIsModalOpen(true)}
            >
              Add Client
            </Button>
          </div>

          {/* Filters */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 gap-4">
              <div className="flex-1 max-w-md">
                <Input
                  placeholder="Search clients by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={<Search className="h-4 w-4 text-gray-400" />}
                />
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-400">{error}</p>
              <button
                onClick={fetchClients}
                className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="mt-8 flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          )}

          {/* Clients Grid */}
          {!isLoading && (
            <motion.div
              className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {filteredClients.map((client) => (
                <motion.div
                  key={client.id}
                  className="card hover-lift cursor-pointer"
                  variants={fadeIn}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  onClick={() => navigate(`/clients/${client.id}`)}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                      <Building2 className="h-6 w-6 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                        {client.name}
                      </h3>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Created: {new Date(client.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {client.description && (
                    <p className="mt-3 text-sm line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                      {client.description}
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-4 pt-4 border-t flex gap-2" style={{ borderColor: 'var(--border-secondary)' }}>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClient(client);
                      }}
                      className="flex-1"
                    >
                      View Details
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Empty State */}
          {filteredClients.length === 0 && !isLoading && (
            <div className="mt-12 text-center">
              <Building2 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
                No clients found
              </h3>
              <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
                {searchTerm
                  ? 'Try adjusting your search criteria.'
                  : 'Get started by adding your first client.'
                }
              </p>
              {!searchTerm && (
                <Button
                  className="mt-4"
                  onClick={() => setIsModalOpen(true)}
                  leftIcon={<Plus className="h-5 w-5" />}
                >
                  Add Your First Client
                </Button>
              )}
            </div>
          )}
        </motion.div>
      </main>

      {/* Client Modal */}
      <ClientModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveClient}
        client={editingClient}
      />
    </div>
  );
};