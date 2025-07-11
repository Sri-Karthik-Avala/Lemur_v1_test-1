import React, { useState } from 'react';
import { Clock, User, Copy, Download, Search, PlayCircle } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../utils/cn';
import { TranscriptSegment, TranscriptWord, TranscriptParticipant } from '../services/api';

interface TranscriptViewerProps {
  transcript: TranscriptSegment[] | string;
  className?: string;
}

export const TranscriptViewer: React.FC<TranscriptViewerProps> = ({ 
  transcript, 
  className 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSegments, setExpandedSegments] = useState<Set<number>>(new Set());
  const [showTimestamps, setShowTimestamps] = useState(true);

  // Parse transcript if it's a string
  const parsedTranscript = React.useMemo(() => {
    if (typeof transcript === 'string') {
      try {
        return JSON.parse(transcript) as TranscriptSegment[];
      } catch {
        // If it's not JSON, treat as plain text
        return null;
      }
    }
    return transcript;
  }, [transcript]);

  // Format timestamp for display
  const formatTimestamp = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Format absolute timestamp
  const formatAbsoluteTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  // Get full text for a segment
  const getSegmentText = (segment: TranscriptSegment) => {
    return segment.words.map(word => word.text).join(' ');
  };

  // Copy transcript to clipboard
  const handleCopyTranscript = () => {
    if (!parsedTranscript) return;
    
    const fullText = parsedTranscript.map(segment => {
      const timestamp = formatTimestamp(segment.words[0]?.start_timestamp.relative || 0);
      const text = getSegmentText(segment);
      return `[${timestamp}] ${segment.participant.name}: ${text}`;
    }).join('\n\n');
    
    navigator.clipboard.writeText(fullText);
  };

  // Filter segments based on search
  const filteredSegments = React.useMemo(() => {
    if (!parsedTranscript || !searchQuery) return parsedTranscript;
    
    return parsedTranscript.filter(segment => {
      const text = getSegmentText(segment).toLowerCase();
      const participantName = segment.participant.name.toLowerCase();
      return text.includes(searchQuery.toLowerCase()) || 
             participantName.includes(searchQuery.toLowerCase());
    });
  }, [parsedTranscript, searchQuery]);

  // Toggle segment expansion
  const toggleSegment = (index: number) => {
    setExpandedSegments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  // Get unique participants
  const participants = React.useMemo(() => {
    if (!parsedTranscript) return [];
    const uniqueParticipants = new Map();
    parsedTranscript.forEach(segment => {
      if (!uniqueParticipants.has(segment.participant.id)) {
        uniqueParticipants.set(segment.participant.id, segment.participant);
      }
    });
    return Array.from(uniqueParticipants.values());
  }, [parsedTranscript]);

  // If not structured transcript, show as plain text
  if (!parsedTranscript) {
    return (
      <div className={cn("transcript-viewer bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700", className)}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Meeting Transcript</h3>
        </div>
        <div className="p-6">
          <div className="prose dark:prose-invert max-w-none">
            <pre className="whitespace-pre-wrap text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              {typeof transcript === 'string' ? transcript : 'No transcript available'}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("transcript-viewer bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700", className)}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Meeting Transcript</h3>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowTimestamps(!showTimestamps)}
              className="text-xs"
            >
              <Clock className="h-3 w-3 mr-1" />
              {showTimestamps ? 'Hide' : 'Show'} Times
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopyTranscript}
              leftIcon={<Copy className="h-3 w-3" />}
              className="text-xs"
            >
              Copy All
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search transcript..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Participants */}
        <div className="mt-4 flex flex-wrap gap-2">
          {participants.map(participant => (
            <div
              key={participant.id}
              className="flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-xs"
            >
              <User className="h-3 w-3" />
              <span>{participant.name}</span>
              {participant.is_host && (
                <span className="px-1 py-0.5 bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded text-xs">Host</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Transcript Content */}
      <div className="max-h-96 overflow-y-auto">
        {filteredSegments?.map((segment, index) => {
          const isExpanded = expandedSegments.has(index);
          const segmentText = getSegmentText(segment);
          const startTime = segment.words[0]?.start_timestamp;
          const endTime = segment.words[segment.words.length - 1]?.end_timestamp;

          return (
            <div 
              key={`${segment.participant.id}-${index}`}
              className="border-b border-gray-100 dark:border-gray-800 last:border-b-0"
            >
              <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex items-start gap-3">
                  {/* Participant Avatar */}
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {segment.participant.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Participant Info */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-gray-900 dark:text-white text-sm">
                        {segment.participant.name}
                      </span>
                      {segment.participant.is_host && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded text-xs">
                          Host
                        </span>
                      )}
                      {showTimestamps && startTime && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTimestamp(startTime.relative)} - {formatTimestamp(endTime?.relative || startTime.relative)}
                        </span>
                      )}
                    </div>

                    {/* Transcript Text */}
                    <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      {segmentText}
                    </div>

                    {/* Detailed Word-by-Word View */}
                    {isExpanded && (
                      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Word-by-word breakdown:</div>
                        <div className="space-y-1">
                          {segment.words.map((word, wordIndex) => (
                            <div key={wordIndex} className="flex items-center gap-4 text-xs">
                              <span className="font-mono text-gray-500 dark:text-gray-400 w-16">
                                {formatTimestamp(word.start_timestamp.relative)}
                              </span>
                              <span className="text-gray-700 dark:text-gray-300">
                                {word.text}
                              </span>
                              {showTimestamps && (
                                <span className="text-gray-400 dark:text-gray-500 text-xs">
                                  {formatAbsoluteTime(word.start_timestamp.absolute)}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Expand/Collapse Button */}
                    <button
                      onClick={() => toggleSegment(index)}
                      className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      {isExpanded ? 'Hide details' : 'Show word-by-word'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      {filteredSegments && filteredSegments.length > 0 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>
              {filteredSegments.length} segments • {participants.length} participants
            </span>
            <span>
              Duration: {formatTimestamp(filteredSegments[filteredSegments.length - 1]?.words[filteredSegments[filteredSegments.length - 1]?.words.length - 1]?.end_timestamp.relative || 0)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}; 