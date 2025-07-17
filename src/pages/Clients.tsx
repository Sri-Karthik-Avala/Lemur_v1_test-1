import React, { useEffect, useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { Building2, Users, Calendar, Mail, Phone, Plus, Search, Filter, FileText, Upload, Trash2, Download } from 'lucide-react';
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

interface ClientDocument {
  id: string;
  filename: string;
  original_filename: string;
  file_type: string;
  file_size: number;
  created_at: string;
  processed: boolean;
}

interface ClientWithDocuments extends Client {
  documents?: ClientDocument[];
  documentsLoaded?: boolean;
}

export const Clients: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // State for API data
  const [clients, setClients] = useState<ClientWithDocuments[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());
  const [expandedClients, setExpandedClients] = useState<Set<string>>(new Set());

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
            documents: [],
            documentsLoaded: false,
          }; 
        }).filter(Boolean) as ClientWithDocuments[];
      setClients(transformedClients);
    } catch (err) {
      setError('Failed to fetch clients. Please try again.');
      console.error('Error fetching clients:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClientDocuments = async (clientId: string) => {
    try {
      const documents = await ApiService.getClientDocuments(clientId);
      setClients(prevClients => 
        prevClients.map(client => 
          client.id === clientId 
            ? { ...client, documents: documents.documents || [], documentsLoaded: true }
            : client
        )
      );
    } catch (err) {
      console.error('Error fetching client documents:', err);
      setError('Failed to fetch documents for this client.');
    }
  };

  // Filter clients based on search
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (client.description && client.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const handleCreateClient = async (clientData: { name: string; description?: string }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First validate/create client relationship
      await ApiService.createClientRelationship(clientData.name);
      
      // Refresh clients list to get the new client
      await fetchClients();
      
      setIsModalOpen(false);
    } catch (error: any) {
      console.error('Failed to create client:', error);
      setError(error.response?.data?.message || 'Failed to create client. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveClient = async (clientData: any) => {
    if (editingClient) {
      // Update existing client logic - would need additional API endpoint
      console.log('Update client functionality not yet implemented in API');
      setError('Client editing not yet available.');
    } else {
      // Create new client
      await handleCreateClient(clientData);
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
        // TODO: Implement delete client API endpoint
        console.log('Delete client functionality not yet implemented in API');
        setError('Client deletion not yet available.');
      } catch (error) {
        console.error('Failed to delete client:', error);
        setError('Failed to delete client. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleFileUpload = async (clientId: string, files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploadingFiles(prev => new Set([...prev, clientId]));
    setError(null);

    try {
      // Upload files one by one
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        await ApiService.uploadClientDocument(clientId, file);
      }

      // Refresh client documents
      await fetchClientDocuments(clientId);
      
    } catch (error: any) {
      console.error('Failed to upload files:', error);
      setError(error.response?.data?.message || 'Failed to upload files. Please try again.');
    } finally {
      setUploadingFiles(prev => {
        const updated = new Set(prev);
        updated.delete(clientId);
        return updated;
      });
    }
  };

  const handleDownloadDocument = async (documentId: string, filename: string) => {
    try {
      const response = await ApiService.getDocumentDownloadUrl(documentId);
      if (response.download_url) {
        // Create a temporary link and trigger download
        const link = document.createElement('a');
        link.href = response.download_url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error: any) {
      console.error('Failed to download document:', error);
      setError('Failed to download document. Please try again.');
    }
  };

  const handleDeleteDocument = async (documentId: string, clientId: string) => {
    if (window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      try {
        await ApiService.deleteDocument(documentId);
        // Refresh client documents
        await fetchClientDocuments(clientId);
      } catch (error: any) {
        console.error('Failed to delete document:', error);
        setError('Failed to delete document. Please try again.');
      }
    }
  };

  const handleToggleClientExpand = async (clientId: string) => {
    const isExpanded = expandedClients.has(clientId);
    
    if (isExpanded) {
      setExpandedClients(prev => {
        const updated = new Set(prev);
        updated.delete(clientId);
        return updated;
      });
    } else {
      setExpandedClients(prev => new Set([...prev, clientId]));
      
      // Load documents if not already loaded
      const client = clients.find(c => c.id === clientId);
      if (client && !client.documentsLoaded) {
        await fetchClientDocuments(clientId);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
                Manage your client relationships, documents, and project history
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
                onClick={() => setError(null)}
                className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 underline"
              >
                Dismiss
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
              {filteredClients.map((client) => {
                const isExpanded = expandedClients.has(client.id);
                const isUploading = uploadingFiles.has(client.id);
                
                return (
                  <motion.div
                    key={client.id}
                    className="card hover-lift"
                    variants={fadeIn}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                        <Building2 className="h-6 w-6 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 
                          className="font-semibold truncate cursor-pointer hover:text-blue-600" 
                          style={{ color: 'var(--text-primary)' }}
                          onClick={() => navigate(`/clients/${client.id}`)}
                        >
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
                        onClick={() => handleToggleClientExpand(client.id)}
                        className="flex-1"
                      >
                        {isExpanded ? 'Hide Documents' : 'View Documents'}
                      </Button>
                      
                      <label className="relative">
                        <input
                          type="file"
                          multiple
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={(e) => handleFileUpload(client.id, e.target.files)}
                          disabled={isUploading}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          leftIcon={isUploading ? <LoadingSpinner size="sm" /> : <Upload className="h-4 w-4" />}
                          disabled={isUploading}
                        >
                          {isUploading ? 'Uploading...' : 'Upload'}
                        </Button>
                      </label>
                    </div>

                    {/* Documents Section */}
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t"
                        style={{ borderColor: 'var(--border-secondary)' }}
                      >
                        <h4 className="text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
                          Documents ({client.documents?.length || 0})
                        </h4>
                        
                        {client.documentsLoaded ? (
                          client.documents && client.documents.length > 0 ? (
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                              {client.documents.map((doc) => (
                                <div
                                  key={doc.id}
                                  className="flex items-center justify-between p-2 rounded-md bg-gray-50 dark:bg-gray-800"
                                >
                                  <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <FileText className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                      <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                                        {doc.original_filename}
                                      </p>
                                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                        {formatFileSize(doc.file_size)} • {new Date(doc.created_at).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => handleDownloadDocument(doc.id, doc.original_filename)}
                                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                      title="Download"
                                    >
                                      <Download className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteDocument(doc.id, client.id)}
                                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                      title="Delete"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-center py-4" style={{ color: 'var(--text-secondary)' }}>
                              No documents uploaded yet
                            </p>
                          )
                        ) : (
                          <div className="flex justify-center py-4">
                            <LoadingSpinner size="sm" />
                          </div>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
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