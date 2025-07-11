import React, { useState } from 'react';
import { Upload, FileText, Trash2, Eye, Tag, Plus, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './Button';
import { Input } from './Input';
import { cn } from '../utils/cn';

interface KnowledgeFile {
  id: string;
  filename: string;
  source: string;
  dateAdded: Date;
  tags: string[];
  fileSize: number;
  processed: boolean;
}

interface KnowledgeVaultProps {
  className?: string;
}

export const KnowledgeVault: React.FC<KnowledgeVaultProps> = ({ className }) => {
  const [files, setFiles] = useState<KnowledgeFile[]>([
    {
      id: '1',
      filename: 'Company_Handbook_2024.pdf',
      source: 'Manual Upload',
      dateAdded: new Date('2024-01-15'),
      tags: ['handbook', 'policies'],
      fileSize: 2048576,
      processed: true
    },
    {
      id: '2',
      filename: 'Product_Documentation.md',
      source: 'Notion Export',
      dateAdded: new Date('2024-01-10'),
      tags: ['product', 'documentation'],
      fileSize: 1024000,
      processed: true
    },
    {
      id: '3',
      filename: 'Meeting_Minutes_Q1.docx',
      source: 'Manual Upload',
      dateAdded: new Date('2024-01-05'),
      tags: ['meetings', 'Q1'],
      fileSize: 512000,
      processed: false
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Get all unique tags
  const allTags = Array.from(new Set(files.flatMap(file => file.tags)));

  // Filter files based on search and tags
  const filteredFiles = files.filter(file => {
    const matchesSearch = file.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => file.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  const handleFileUpload = async (uploadedFiles: FileList) => {
    setIsUploading(true);
    
    // Simulate file upload and processing
    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      const newFile: KnowledgeFile = {
        id: Date.now().toString() + i,
        filename: file.name,
        source: 'Manual Upload',
        dateAdded: new Date(),
        tags: ['new'],
        fileSize: file.size,
        processed: false
      };
      
      setFiles(prev => [...prev, newFile]);
      
      // Simulate processing delay
      setTimeout(() => {
        setFiles(prev => prev.map(f => 
          f.id === newFile.id ? { ...f, processed: true } : f
        ));
      }, 2000 + i * 1000);
    }
    
    setIsUploading(false);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleDeleteFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div>
        <h3 
          className="text-lg font-semibold"
          style={{ color: 'var(--text-primary)' }}
        >
          Knowledge Vault
        </h3>
        <p 
          className="text-sm mt-1"
          style={{ color: 'var(--text-secondary)' }}
        >
          Upload and manage documents to enrich the Company Brain. Supports PDF, DOCX, CSV, and Markdown files.
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={cn(
          'border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200',
          dragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept=".pdf,.docx,.csv,.md,.txt"
          onChange={(e) => {
            if (e.target.files) {
              handleFileUpload(e.target.files);
            }
          }}
          className="hidden"
          id="knowledge-upload"
        />
        
        <label htmlFor="knowledge-upload" className="cursor-pointer">
          <Upload 
            className={cn(
              'h-12 w-12 mx-auto mb-4',
              dragActive ? 'text-blue-500' : 'text-gray-400'
            )} 
          />
          <p 
            className="text-lg font-medium mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            Upload Knowledge Files
          </p>
          <p 
            className="text-sm"
            style={{ color: 'var(--text-secondary)' }}
          >
            Drop files here or click to browse. Supports PDF, DOCX, CSV, MD, and TXT files.
          </p>
        </label>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search files by name or source..."
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={cn(
                'px-3 py-1.5 text-xs rounded-full border transition-all duration-200',
                'hover:scale-105',
                selectedTags.includes(tag)
                  ? 'bg-blue-100 border-blue-300 text-blue-700 dark:bg-blue-900/30 dark:border-blue-600 dark:text-blue-300'
                  : 'bg-gray-100 border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Files List */}
      <div className="space-y-3">
        {filteredFiles.map((file, index) => (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="rounded-lg p-4 border hover:shadow-sm transition-all duration-200"
            style={{
              background: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)'
            }}
          >
            <div className="flex items-start gap-4">
              <div 
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ background: 'rgba(59, 130, 246, 0.1)' }}
              >
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 
                      className="font-medium truncate"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {file.filename}
                    </h4>
                    <div className="flex items-center gap-4 mt-1 text-sm">
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {file.source}
                      </span>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {file.dateAdded.toLocaleDateString()}
                      </span>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {formatFileSize(file.fileSize)}
                      </span>
                      <span 
                        className={cn(
                          'px-2 py-0.5 text-xs rounded-full',
                          file.processed 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                        )}
                      >
                        {file.processed ? 'Processed' : 'Processing...'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {/* TODO: Preview file */}}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteFile(file.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Tags */}
                {file.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {file.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        
        {filteredFiles.length === 0 && (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p 
              className="text-lg font-medium mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              No files found
            </p>
            <p 
              className="text-sm"
              style={{ color: 'var(--text-secondary)' }}
            >
              {searchTerm || selectedTags.length > 0 
                ? 'Try adjusting your search criteria or clear filters.'
                : 'Upload your first knowledge file to get started.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Upload Status */}
      {isUploading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 rounded-lg"
          style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.2)'
          }}
        >
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span 
            className="text-sm font-medium"
            style={{ color: 'var(--text-primary)' }}
          >
            Uploading and processing files...
          </span>
        </motion.div>
      )}
    </div>
  );
}; 