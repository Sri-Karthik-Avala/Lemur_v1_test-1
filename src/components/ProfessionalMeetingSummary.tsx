import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Copy, 
  Check,
  Lightbulb,
  Target,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import { Button } from './Button';
import { cn } from '../utils/cn';

interface MeetingInsight {
  type: 'decision' | 'risk' | 'opportunity' | 'next_step';
  content: string;
  priority?: 'low' | 'medium' | 'high';
}

interface ProfessionalMeetingSummaryProps {
  meetingTitle: string;
  meetingDate: string;
  summary: string;
  keyInsights: MeetingInsight[];
  keyDecisions?: string[];
  nextSteps?: string[];
  risks?: string[];
}

export const ProfessionalMeetingSummary: React.FC<ProfessionalMeetingSummaryProps> = ({
  meetingTitle,
  meetingDate,
  summary,
  keyInsights,
  keyDecisions = [],
  nextSteps = [],
  risks = []
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopySummary = async () => {
    const fullSummary = generateFullSummary();
    await navigator.clipboard.writeText(fullSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportSummary = () => {
    const report = generateFullSummary();
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meeting-summary-${meetingDate}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateFullSummary = () => {
    return `MEETING SUMMARY REPORT
Meeting: ${meetingTitle}
Date: ${meetingDate}
Generated: ${new Date().toLocaleDateString()}

========================================

EXECUTIVE SUMMARY
${summary}

========================================

KEY DECISIONS
${keyDecisions.length > 0 ? keyDecisions.map((decision, index) => `${index + 1}. ${decision}`).join('\n') : 'No key decisions recorded.'}

========================================

NEXT STEPS
${nextSteps.length > 0 ? nextSteps.map((step, index) => `${index + 1}. ${step}`).join('\n') : 'No next steps identified.'}

========================================

RISKS & CONSIDERATIONS
${risks.length > 0 ? risks.map((risk, index) => `${index + 1}. ${risk}`).join('\n') : 'No risks identified.'}

========================================

KEY INSIGHTS
${keyInsights.map((insight, index) => `${index + 1}. [${insight.type.toUpperCase()}] ${insight.content}`).join('\n')}
`;
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'decision':
        return <Target className="h-4 w-4 text-blue-500" />;
      case 'risk':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'opportunity':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'next_step':
        return <Lightbulb className="h-4 w-4 text-purple-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'decision':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'risk':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'opportunity':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'next_step':
        return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Generated on {new Date().toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopySummary}
            leftIcon={copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          >
            {copied ? 'Copied' : 'Copy'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportSummary}
            leftIcon={<Download className="h-4 w-4" />}
          >
            Export
          </Button>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <Target className="h-4 w-4 text-purple-500" />
          Executive Summary
        </h4>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {summary}
        </p>
      </div>

      {/* Key Decisions */}
      {keyDecisions.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Target className="h-4 w-4 text-blue-500" />
            Key Decisions
          </h4>
          <div className="space-y-2">
            {keyDecisions.map((decision, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </span>
                <p className="text-gray-700 dark:text-gray-300">{decision}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Steps */}
      {nextSteps.length > 0 && (
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-green-500" />
            Next Steps
          </h4>
          <div className="space-y-2">
            {nextSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </span>
                <p className="text-gray-700 dark:text-gray-300">{step}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risks */}
      {risks.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-700">
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            Risks & Considerations
          </h4>
          <div className="space-y-2">
            {risks.map((risk, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </span>
                <p className="text-gray-700 dark:text-gray-300">{risk}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Insights */}
      {keyInsights.length > 0 && (
        <div className="p-6">
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
            Additional Insights
          </h4>
          <div className="space-y-3">
            {keyInsights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={cn(
                  "p-4 rounded-lg border",
                  getInsightColor(insight.type)
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getInsightIcon(insight.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                        {insight.type.replace('_', ' ')}
                      </span>
                      {insight.priority && (
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          insight.priority === 'high' && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
                          insight.priority === 'medium' && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
                          insight.priority === 'low' && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        )}>
                          {insight.priority}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{insight.content}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}; 