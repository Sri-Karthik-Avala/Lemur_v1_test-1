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

// Mock data types
interface MockClient {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  industry?: string;
  contact_email?: string;
  contact_name?: string;
}

interface MockSubClient {
  id: string;
  client_id: string;
  name: string;
  description?: string;
  contact_email?: string;
  contact_name?: string;
  created_at: string;
}

interface MockFile {
  id: string;
  client_id: string;
  sub_client_id?: string;
  filename: string;
  file_size: number;
  file_type: string;
  uploaded_at: string;
  upload_status: 'completed' | 'processing' | 'failed';
}

// Comprehensive mock data
const mockClientsData: MockClient[] = [
  {
    id: 'client-1',
    name: 'TechCorp Industries',
    description: 'Leading technology company specializing in cloud infrastructure and AI solutions',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-12-08T14:22:00Z',
    industry: 'Technology',
    contact_email: 'sarah.johnson@techcorp.com',
    contact_name: 'Sarah Johnson'
  },
  {
    id: 'client-2',
    name: 'GreenEnergy Solutions',
    description: 'Renewable energy company focused on solar and wind power installations',
    created_at: '2024-02-20T08:15:00Z',
    updated_at: '2024-12-07T16:45:00Z',
    industry: 'Energy',
    contact_email: 'mike.chen@greenenergy.com',
    contact_name: 'Mike Chen'
  },
  {
    id: 'client-3',
    name: 'HealthFirst Medical',
    description: 'Healthcare provider network with 50+ locations across the region',
    created_at: '2024-03-10T11:20:00Z',
    updated_at: '2024-12-06T09:30:00Z',
    industry: 'Healthcare',
    contact_email: 'dr.williams@healthfirst.com',
    contact_name: 'Dr. Emily Williams'
  },
  {
    id: 'client-4',
    name: 'FinanceMax Group',
    description: 'Investment banking and financial services company',
    created_at: '2024-04-05T13:45:00Z',
    updated_at: '2024-12-05T11:15:00Z',
    industry: 'Finance',
    contact_email: 'robert.clark@financemax.com',
    contact_name: 'Robert Clark'
  },
  {
    id: 'client-5',
    name: 'EduTech Academy',
    description: 'Online education platform providing professional certification courses',
    created_at: '2024-05-12T09:00:00Z',
    updated_at: '2024-12-04T15:20:00Z',
    industry: 'Education',
    contact_email: 'lisa.martinez@edutech.com',
    contact_name: 'Lisa Martinez'
  },
  {
    id: 'client-6',
    name: 'RetailPlus Chain',
    description: 'Multi-brand retail chain with e-commerce and physical stores',
    created_at: '2024-06-18T14:30:00Z',
    updated_at: '2024-12-03T12:40:00Z',
    industry: 'Retail',
    contact_email: 'james.wilson@retailplus.com',
    contact_name: 'James Wilson'
  }
];

const mockSubClientsData: MockSubClient[] = [
  {
    id: 'sub-1',
    client_id: 'client-1',
    name: 'TechCorp - North Division',
    description: 'Northern regional office handling enterprise clients',
    contact_email: 'north@techcorp.com',
    contact_name: 'Alex Thompson',
    created_at: '2024-01-20T10:30:00Z'
  },
  {
    id: 'sub-2',
    client_id: 'client-1',
    name: 'TechCorp - South Division',
    description: 'Southern regional office focusing on startups',
    contact_email: 'south@techcorp.com',
    contact_name: 'Maria Rodriguez',
    created_at: '2024-01-25T14:15:00Z'
  },
  {
    id: 'sub-3',
    client_id: 'client-2',
    name: 'GreenEnergy - Solar Projects',
    description: 'Solar installation and maintenance division',
    contact_email: 'solar@greenenergy.com',
    contact_name: 'David Park',
    created_at: '2024-02-25T11:45:00Z'
  },
  {
    id: 'sub-4',
    client_id: 'client-3',
    name: 'HealthFirst - Emergency Services',
    description: 'Emergency care and trauma centers',
    contact_email: 'emergency@healthfirst.com',
    contact_name: 'Dr. Sarah Lee',
    created_at: '2024-03-15T16:20:00Z'
  },
  {
    id: 'sub-5',
    client_id: 'client-4',
    name: 'FinanceMax - Investment Division',
    description: 'Investment advisory and portfolio management',
    contact_email: 'investments@financemax.com',
    contact_name: 'Michael Brown',
    created_at: '2024-04-10T13:30:00Z'
  }
];

const mockFilesData: MockFile[] = [
  {
    id: 'file-1',
    client_id: 'client-1',
    filename: 'TechCorp_Company_Overview.pdf',
    file_size: 2456789,
    file_type: 'application/pdf',
    uploaded_at: '2024-01-16T09:15:00Z',
    upload_status: 'completed'
  },
  {
    id: 'file-2',
    client_id: 'client-1',
    filename: 'Technical_Requirements_2024.docx',
    file_size: 1234567,
    file_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    uploaded_at: '2024-01-18T14:22:00Z',
    upload_status: 'completed'
  },
  {
    id: 'file-3',
    client_id: 'client-1',
    sub_client_id: 'sub-1',
    filename: 'North_Division_Strategy.pdf',
    file_size: 987654,
    file_type: 'application/pdf',
    uploaded_at: '2024-01-22T11:30:00Z',
    upload_status: 'completed'
  },
  {
    id: 'file-4',
    client_id: 'client-2',
    filename: 'Solar_Project_Specifications.pdf',
    file_size: 3456789,
    file_type: 'application/pdf',
    uploaded_at: '2024-02-22T10:45:00Z',
    upload_status: 'completed'
  },
  {
    id: 'file-5',
    client_id: 'client-2',
    filename: 'Environmental_Impact_Report.docx',
    file_size: 2987654,
    file_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    uploaded_at: '2024-02-28T15:18:00Z',
    upload_status: 'completed'
  },
  {
    id: 'file-6',
    client_id: 'client-3',
    filename: 'Medical_Protocols_Handbook.pdf',
    file_size: 4567890,
    file_type: 'application/pdf',
    uploaded_at: '2024-03-12T08:30:00Z',
    upload_status: 'completed'
  },
  {
    id: 'file-7',
    client_id: 'client-4',
    filename: 'Investment_Portfolio_Analysis.xlsx',
    file_size: 1876543,
    file_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    uploaded_at: '2024-04-07T13:45:00Z',
    upload_status: 'completed'
  },
  {
    id: 'file-8',
    client_id: 'client-5',
    filename: 'Course_Curriculum_Guide.pdf',
    file_size: 3234567,
    file_type: 'application/pdf',
    uploaded_at: '2024-05-15T16:20:00Z',
    upload_status: 'completed'
  }
];

export const Clients: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Local state for mock data
  const [apiClients, setApiClients] = useState<MockClient[]>(mockClientsData);
  const [subClients, setSubClients] = useState<Record<string, MockSubClient[]>>({});
  const [clientFiles, setClientFiles] = useState<Record<string, MockFile[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<MockClient | null>(null);
  const [selectedClientForFiles, setSelectedClientForFiles] = useState<MockClient | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState(false);

  // Initialize mock data
  useEffect(() => {
    initializeMockData();
  }, []);

  const initializeMockData = () => {
    // Group sub-clients by client ID
    const groupedSubClients: Record<string, MockSubClient[]> = {};
    mockSubClientsData.forEach(subClient => {
      if (!groupedSubClients[subClient.client_id]) {
        groupedSubClients[subClient.client_id] = [];
      }
      groupedSubClients[subClient.client_id].push(subClient);
    });
    setSubClients(groupedSubClients);

    // Group files by client ID
    const groupedFiles: Record<string, MockFile[]> = {};
    mockFilesData.forEach(file => {
      if (!groupedFiles[file.client_id]) {
        groupedFiles[file.client_id] = [];
      }
      groupedFiles[file.client_id].push(file);
    });
    setClientFiles(groupedFiles);
  };

  // Filter clients based on search
  const filteredClients = apiClients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (client.description && client.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const handleSaveClient = async (clientData: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (editingClient) {
        // Update existing client
        const updatedClient: MockClient = {
          ...editingClient,
          name: clientData.name,
          description: clientData.description,
          updated_at: new Date().toISOString()
        };
        setApiClients(prev => prev.map(client => 
          client.id === editingClient.id ? updatedClient : client
        ));
      } else {
        // Create new client
        const newClient: MockClient = {
          id: `client-${Date.now()}`,
          name: clientData.name,
          description: clientData.description,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setApiClients(prev => [newClient, ...prev]);
      }
      
      setEditingClient(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save client:', error);
      setError('Failed to save client. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClient = async (client: MockClient) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleDeleteClient = async (clientId: string) => {
    if (window.confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      setIsLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setApiClients(prev => prev.filter(client => client.id !== clientId));
        
        // Remove associated sub-clients and files
        setSubClients(prev => {
          const newSubClients = { ...prev };
          delete newSubClients[clientId];
          return newSubClients;
        });
        
        setClientFiles(prev => {
          const newFiles = { ...prev };
          delete newFiles[clientId];
          return newFiles;
        });
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

  const handleFileUpload = async (files: FileList, clientId: string) => {
    setUploadingFiles(true);
    try {
      // Simulate file upload with delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newFiles: MockFile[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const newFile: MockFile = {
          id: `file-${Date.now()}-${i}`,
          client_id: clientId,
          filename: file.name,
          file_size: file.size,
          file_type: file.type,
          uploaded_at: new Date().toISOString(),
          upload_status: 'completed'
        };
        newFiles.push(newFile);
      }
      
      setClientFiles(prev => ({
        ...prev,
        [clientId]: [...(prev[clientId] || []), ...newFiles]
      }));
      
      setIsFileModalOpen(false);
    } catch (error) {
      console.error('Failed to upload files:', error);
      setError('Failed to upload files. Please try again.');
    } finally {
      setUploadingFiles(false);
    }
  };

  const handleOpenFileModal = (client: MockClient) => {
    setSelectedClientForFiles(client);
    setIsFileModalOpen(true);
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
                  placeholder="Search clients by name or description..."
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

                  <div className="mt-4 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                        <Users className="h-4 w-4" />
                        {subClients[client.id]?.length || 0} sub-clients
                      </span>
                      <span className="flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                        <FileText className="h-4 w-4" />
                        {clientFiles[client.id]?.length || 0} files
                      </span>
                    </div>
                  </div>

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
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenFileModal(client);
                      }}
                      leftIcon={<Upload className="h-4 w-4" />}
                    >
                      Upload Files
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

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

      {/* File Upload Modal */}
      <Modal
        isOpen={isFileModalOpen}
        onClose={() => setIsFileModalOpen(false)}
        title={`Upload Files - ${selectedClientForFiles?.name}`}
        size="lg"
      >
        <div className="space-y-6">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Upload documents to build the knowledge base for {selectedClientForFiles?.name}.
            Supported formats: PDF, DOC, DOCX, TXT, MD
          </div>

          {/* Current Files */}
          {selectedClientForFiles && clientFiles[selectedClientForFiles.id] && clientFiles[selectedClientForFiles.id].length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                Current Files ({clientFiles[selectedClientForFiles.id].length})
              </h4>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {clientFiles[selectedClientForFiles.id].map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">{file.filename}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatFileSize(file.file_size)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* File Upload Area */}
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.md"
              onChange={(e) => {
                if (e.target.files && selectedClientForFiles) {
                  handleFileUpload(e.target.files, selectedClientForFiles.id);
                }
              }}
              className="hidden"
              id="file-upload"
              disabled={uploadingFiles}
            />
            <label
              htmlFor="file-upload"
              className={`cursor-pointer flex flex-col items-center gap-4 ${uploadingFiles ? 'pointer-events-none opacity-50' : ''}`}
            >
              {uploadingFiles ? (
                <LoadingSpinner size="lg" />
              ) : (
                <Upload className="h-12 w-12 text-gray-400" />
              )}
              <div>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {uploadingFiles ? 'Uploading files...' : 'Click to upload files'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {uploadingFiles ? 'Please wait while files are being processed' : 'or drag and drop files here'}
                </p>
              </div>
            </label>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsFileModalOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
