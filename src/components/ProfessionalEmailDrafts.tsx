import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Copy, 
  Check, 
  Download, 
  Send, 
  Edit3,
  FileText,
  Users,
  Calendar
} from 'lucide-react';
import { Button } from './Button';
import { cn } from '../utils/cn';

interface EmailTemplate {
  id: string;
  type: 'follow_up' | 'summary' | 'action_items' | 'thank_you';
  subject: string;
  content: string;
  recipients: string[];
}

interface ProfessionalEmailDraftsProps {
  meetingTitle: string;
  meetingDate: string;
  attendees: string[];
  actionItems?: Array<{
    content: string;
    assignee?: string;
    dueDate?: string;
  }>;
  keyDecisions?: string[];
  nextMeetingDate?: string;
}

export const ProfessionalEmailDrafts: React.FC<ProfessionalEmailDraftsProps> = ({
  meetingTitle,
  meetingDate,
  attendees,
  actionItems = [],
  keyDecisions = [],
  nextMeetingDate
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyEmail = async (email: EmailTemplate) => {
    const fullEmail = `Subject: ${email.subject}\n\n${email.content}`;
    await navigator.clipboard.writeText(fullEmail);
    setCopiedId(email.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportEmails = () => {
    const allEmails = emailTemplates.map(email => 
      `Subject: ${email.subject}\n\n${email.content}\n\n${'='.repeat(50)}\n\n`
    ).join('');
    
    const blob = new Blob([allEmails], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meeting-emails-${meetingDate}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatAttendeesList = () => {
    if (attendees.length <= 2) return attendees.join(' and ');
    return attendees.slice(0, -1).join(', ') + ', and ' + attendees[attendees.length - 1];
  };

  const emailTemplates: EmailTemplate[] = [
    {
      id: 'follow_up',
      type: 'follow_up',
      subject: `Follow-up: ${meetingTitle}`,
      content: `Dear Team,

Thank you for your participation in today's meeting regarding ${meetingTitle.toLowerCase()}.

MEETING SUMMARY
Date: ${meetingDate}
Attendees: ${formatAttendeesList()}

KEY DECISIONS:
${keyDecisions.map((decision, index) => `${index + 1}. ${decision}`).join('\n')}

ACTION ITEMS:
${actionItems.map((item, index) => 
  `${index + 1}. ${item.content}${item.assignee ? ` (Assigned: ${item.assignee})` : ''}${item.dueDate ? ` (Due: ${item.dueDate})` : ''}`
).join('\n')}

${nextMeetingDate ? `NEXT MEETING:\nScheduled for ${nextMeetingDate}` : ''}

Please review the above items and confirm your understanding. If you have any questions or concerns, please don't hesitate to reach out.

Best regards,
[Your Name]`,
      recipients: attendees
    },
    {
      id: 'action_items',
      type: 'action_items',
      subject: `Action Items: ${meetingTitle}`,
      content: `Dear Team,

Following our meeting on ${meetingDate}, please find below the action items requiring attention:

${actionItems.map((item, index) => 
  `${index + 1}. ${item.content}
   ${item.assignee ? `Assigned to: ${item.assignee}` : 'Assignee: To be determined'}
   ${item.dueDate ? `Due Date: ${item.dueDate}` : 'Due Date: To be confirmed'}
`).join('\n')}

Please confirm receipt of this email and provide updates on your assigned items by the specified deadlines.

If you require any clarification or additional resources to complete your tasks, please contact me immediately.

Thank you for your continued cooperation.

Best regards,
[Your Name]`,
      recipients: attendees
    },
    {
      id: 'summary',
      type: 'summary',
      subject: `Meeting Summary: ${meetingTitle}`,
      content: `Subject: Meeting Summary - ${meetingTitle}

MEETING DOCUMENTATION

Meeting: ${meetingTitle}
Date: ${meetingDate}
Participants: ${formatAttendeesList()}

EXECUTIVE SUMMARY:
This meeting was convened to discuss and make decisions regarding ${meetingTitle.toLowerCase()}. The following key outcomes were achieved:

KEY DECISIONS:
${keyDecisions.map((decision, index) => `${index + 1}. ${decision}`).join('\n')}

NEXT STEPS:
${actionItems.slice(0, 3).map((item, index) => `${index + 1}. ${item.content}`).join('\n')}

This summary serves as the official record of our meeting proceedings. Please retain for your records and reference.

For questions regarding this summary or the meeting outcomes, please contact the meeting organizer.

Respectfully,
[Your Name]
[Your Title]`,
      recipients: attendees
    }
  ];

  const getTemplateIcon = (type: string) => {
    switch (type) {
      case 'follow_up':
        return <Mail className="h-4 w-4 text-blue-500" />;
      case 'action_items':
        return <FileText className="h-4 w-4 text-green-500" />;
      case 'summary':
        return <Users className="h-4 w-4 text-purple-500" />;
      default:
        return <Mail className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTemplateColor = (type: string) => {
    switch (type) {
      case 'follow_up':
        return 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10';
      case 'action_items':
        return 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10';
      case 'summary':
        return 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/10';
      default:
        return 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {emailTemplates.length} templates ready
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportEmails}
            leftIcon={<Download className="h-4 w-4" />}
          >
            Export All
          </Button>
        </div>
      </div>

      {/* Email Templates Grid */}
      <div className="grid gap-4">
        {emailTemplates.map((email, index) => (
          <motion.div
            key={email.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={cn(
              'rounded-lg border p-4 transition-all duration-200 hover:shadow-sm',
              getTemplateColor(email.type)
            )}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {getTemplateIcon(email.type)}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {email.subject}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    To: {email.recipients.join(', ')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyEmail(email)}
                  leftIcon={copiedId === email.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                >
                  {copiedId === email.id ? 'Copied' : 'Copy'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Edit3 className="h-4 w-4" />}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  leftIcon={<Send className="h-4 w-4" />}
                >
                  Send
                </Button>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="max-h-32 overflow-y-auto">
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {email.content.length > 300 
                    ? `${email.content.substring(0, 300)}...` 
                    : email.content
                  }
                </p>
              </div>
              
              {email.content.length > 300 && (
                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                  <Button variant="ghost" size="sm" className="text-xs">
                    View Full Content
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}; 