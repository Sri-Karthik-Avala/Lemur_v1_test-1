import { Meeting } from '../types';

// Sample meeting data for the dashboard
export const upcomingMeetings: Meeting[] = [
  {
    id: 'm1',
    title: 'Tech stand up',
    description: 'Daily technical standup meeting to discuss progress, blockers, and upcoming tasks.',
    meetingLink: 'https://zoom.us/j/1234567890',
    date: '2025-06-25',
    startTime: '08:00',
    endTime: '08:30',
    attendees: [
      {
        id: 'a1',
        name: 'Aman Sanghi',
        email: 'amansanghi@synatechsolutions.com',
      },
      {
        id: 'a2',
        name: 'Demo User',
        email: 'demo@lemurai.com',
      }
    ],
    status: 'scheduled',
    summary: '📅 **Upcoming Meeting** - Please come back here after the meeting is completed to view the summary, transcript, and action items.',
    transcript: 'Transcript will be available after the meeting is completed. Our AI will automatically generate a detailed transcript once the meeting ends.',
    actionItems: [],
    joinUrl: '#',
    platform: 'zoom',
    meetingType: 'internal'
  },
  {
    id: 'm2',
    title: 'Client Project Kickoff',
    description: 'Initial project kickoff meeting with client to align on objectives, timeline, and deliverables.',
    meetingLink: 'https://teams.microsoft.com/l/meetup-join/19%3ameeting',
    date: '2025-06-25',
    startTime: '11:00',
    endTime: '12:00',
    attendees: [
      {
        id: 'a1',
        name: 'Aman Sanghi',
        email: 'amansanghi@synatechsolutions.com',
      },
      {
        id: 'a3',
        name: 'Aditi Sharma',
        email: 'aditi@synatechsolutions.com',
      },
      {
        id: 'a4',
        name: 'John Client',
        email: 'john@client.com',
        company: 'Client Co',
        role: 'Project Manager'
      },
      {
        id: 'a2',
        name: 'Demo User',
        email: 'demo@lemurai.com',
      }
    ],
    status: 'scheduled',
    summary: '📅 **Upcoming Meeting** - This client kickoff meeting will establish project foundations and alignment. Please return here after the meeting to access the full summary, transcript, and assigned action items.',
    transcript: 'Meeting transcript will be generated automatically after the session ends. Our AI will capture all important discussions and decisions made during the kickoff.',
    actionItems: [],
    joinUrl: '#',
    platform: 'teams',
    meetingType: 'external',
    clientId: 'client-2'
  },
  {
    id: 'm3',
    title: 'Weekly Team Sync',
    description: 'Weekly team synchronization meeting to review progress and plan upcoming work.',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    date: '2025-06-26',
    startTime: '10:00',
    endTime: '10:30',
    attendees: [
      {
        id: 'a1',
        name: 'Aman Sanghi',
        email: 'amansanghi@synatechsolutions.com',
      },
      {
        id: 'a3',
        name: 'Aditi Sharma',
        email: 'aditi@synatechsolutions.com',
      },
      {
        id: 'a5',
        name: 'Rahul Dev',
        email: 'rahul@synatechsolutions.com',
      },
      {
        id: 'a2',
        name: 'Demo User',
        email: 'demo@lemurai.com',
      }
    ],
    status: 'scheduled',
    summary: '📅 **Upcoming Meeting** - Weekly sync to align team efforts and address blockers. Meeting insights and action items will be available here once the session concludes.',
    transcript: 'Auto-generated transcript will appear here after the meeting. Our AI will organize the discussion by topics and highlight key decisions.',
    actionItems: [],
    joinUrl: '#',
    platform: 'meet',
    meetingType: 'internal'
  },
  // Additional June 2025 Meetings
  {
    id: 'm7',
    title: 'Q2 Strategy Review',
    description: 'Quarterly review of business strategy, performance metrics, and strategic initiatives for Q2 2025.',
    meetingLink: 'https://zoom.us/j/7890123456',
    date: '2025-06-27',
    startTime: '09:00',
    endTime: '10:30',
    attendees: [
      {
        id: 'a1',
        name: 'Aman Sanghi',
        email: 'amansanghi@synatechsolutions.com',
      },
      {
        id: 'a3',
        name: 'Aditi Sharma',
        email: 'aditi@synatechsolutions.com',
      },
      {
        id: 'a2',
        name: 'Demo User',
        email: 'demo@lemurai.com',
      },
      {
        id: 'a6',
        name: 'Sarah Johnson',
        email: 'sarah@synatechsolutions.com',
        role: 'Product Manager'
      }
    ],
    status: 'scheduled',
    summary: '📅 **Upcoming Meeting** - Quarterly strategy review to evaluate Q2 performance and plan Q3 initiatives. Detailed analysis and strategic recommendations will be available after the meeting.',
    transcript: 'Strategy discussion transcript will be generated post-meeting, including performance metrics review, strategic insights, and future planning discussions.',
    actionItems: [],
    joinUrl: '#',
    platform: 'zoom',
    meetingType: 'internal'
  },
  {
    id: 'm8',
    title: 'Client Onboarding - TechCorp',
    description: 'Comprehensive onboarding session for new client TechCorp, covering platform features and implementation roadmap.',
    meetingLink: 'https://teams.microsoft.com/l/meetup-join/19%3atechcorp',
    date: '2025-06-30',
    startTime: '14:00',
    endTime: '15:00',
    attendees: [
      {
        id: 'a1',
        name: 'Aman Sanghi',
        email: 'amansanghi@synatechsolutions.com',
      },
      {
        id: 'a2',
        name: 'Demo User',
        email: 'demo@lemurai.com',
      },
      {
        id: 'a7',
        name: 'Michael Chen',
        email: 'michael@techcorp.com',
        company: 'TechCorp',
        role: 'CTO'
      },
      {
        id: 'a8',
        name: 'Lisa Wang',
        email: 'lisa@techcorp.com',
        company: 'TechCorp',
        role: 'Engineering Manager'
      }
    ],
    status: 'scheduled',
    summary: '📅 **Upcoming Meeting** - TechCorp onboarding session to introduce platform capabilities and establish implementation timeline. Complete onboarding summary and next steps will be documented here after the session.',
    transcript: 'Onboarding session transcript will be automatically generated, capturing all technical discussions, platform demonstrations, and implementation planning details.',
    actionItems: [],
    joinUrl: '#',
    platform: 'teams',
    meetingType: 'external',
    clientId: 'client-1'
  },
  {
    id: 'm20',
    title: 'GreenEnergy - Solar Project Review',
    description: 'Review meeting for ongoing solar installation project with GreenEnergy Solutions.',
    meetingLink: 'https://zoom.us/j/solar2024',
    date: '2025-06-28',
    startTime: '15:00',
    endTime: '16:00',
    attendees: [
      {
        id: 'a1',
        name: 'Aman Sanghi',
        email: 'amansanghi@synatechsolutions.com',
      },
      {
        id: 'a2',
        name: 'Demo User',
        email: 'demo@lemurai.com',
      },
      {
        id: 'a9',
        name: 'Mike Chen',
        email: 'mike.chen@greenenergy.com',
        company: 'GreenEnergy Solutions',
        role: 'Project Director'
      }
    ],
    status: 'scheduled',
    summary: '📅 **Upcoming Meeting** - Solar project progress review with GreenEnergy Solutions. Project status, milestones, and next phase planning will be documented here after the meeting.',
    transcript: 'Project review transcript will be generated automatically, capturing technical discussions, progress updates, and future planning details.',
    actionItems: [],
    joinUrl: '#',
    platform: 'zoom',
    meetingType: 'external',
    clientId: 'client-2'
  },
  {
    id: 'm21',
    title: 'HealthFirst - System Integration Planning',
    description: 'Technical planning session for integrating our solutions with HealthFirst Medical systems.',
    meetingLink: 'https://teams.microsoft.com/l/meetup-join/19%3ahealthfirst',
    date: '2025-06-29',
    startTime: '13:00',
    endTime: '14:30',
    attendees: [
      {
        id: 'a1',
        name: 'Aman Sanghi',
        email: 'amansanghi@synatechsolutions.com',
      },
      {
        id: 'a3',
        name: 'Aditi Sharma',
        email: 'aditi@synatechsolutions.com',
      },
      {
        id: 'a10',
        name: 'Dr. Emily Williams',
        email: 'dr.williams@healthfirst.com',
        company: 'HealthFirst Medical',
        role: 'Chief Medical Officer'
      },
      {
        id: 'a11',
        name: 'Tom Rodriguez',
        email: 'tom@healthfirst.com',
        company: 'HealthFirst Medical',
        role: 'IT Director'
      }
    ],
    status: 'scheduled',
    summary: '📅 **Upcoming Meeting** - System integration planning with HealthFirst Medical. Technical requirements, security protocols, and implementation timeline will be finalized here.',
    transcript: 'Integration planning transcript will include technical specifications, security discussions, and detailed implementation roadmap.',
    actionItems: [],
    joinUrl: '#',
    platform: 'teams',
    meetingType: 'external',
    clientId: 'client-3'
  },
  {
    id: 'm9',
    title: 'Product Roadmap Planning',
    description: 'Strategic planning session for product roadmap development, feature prioritization, and timeline estimation.',
    meetingLink: 'https://zoom.us/j/9876543210',
    date: '2025-06-10',
    startTime: '10:00',
    endTime: '12:00',
    attendees: [
      {
        id: 'a2',
        name: 'Demo User',
        email: 'demo@lemurai.com',
      },
      {
        id: 'a6',
        name: 'Sarah Johnson',
        email: 'sarah@synatechsolutions.com',
        role: 'Product Manager'
      },
      {
        id: 'a3',
        name: 'Aditi Sharma',
        email: 'aditi@synatechsolutions.com',
      },
      {
        id: 'a5',
        name: 'Rahul Dev',
        email: 'rahul@synatechsolutions.com',
      }
    ],
    status: 'scheduled',
    summary: '📅 **Upcoming Meeting** - Product roadmap planning to define feature priorities and development timeline. Strategic planning insights and roadmap decisions will be captured here after the session.',
    transcript: 'Product planning discussion transcript will be available post-meeting, including feature analysis, prioritization criteria, and timeline discussions.',
    actionItems: [],
    joinUrl: '#',
    platform: 'zoom',
    meetingType: 'internal'
  },
  {
    id: 'm10',
    title: 'AI Implementation Workshop',
    description: 'Interactive workshop on AI implementation strategies, best practices, and emerging technologies.',
    meetingLink: 'https://meet.google.com/xyz-uvw-rst',
    date: '2025-06-15',
    startTime: '13:00',
    endTime: '16:00',
    attendees: [
      {
        id: 'a1',
        name: 'Aman Sanghi',
        email: 'amansanghi@synatechsolutions.com',
      },
      {
        id: 'a2',
        name: 'Demo User',
        email: 'demo@lemurai.com',
      },
      {
        id: 'a3',
        name: 'Aditi Sharma',
        email: 'aditi@synatechsolutions.com',
      },
      {
        id: 'a9',
        name: 'Dr. Emily Rodriguez',
        email: 'emily@airesearch.org',
        company: 'AI Research Institute',
        role: 'Lead AI Researcher'
      }
    ],
    status: 'scheduled',
    summary: '📅 **Upcoming Meeting** - AI implementation workshop featuring expert insights and hands-on learning. Workshop summary, key learnings, and implementation guidelines will be documented here afterward.',
    transcript: 'Workshop transcript will include all technical discussions, Q&A sessions, and implementation strategies covered during the 3-hour session.',
    actionItems: [],
    joinUrl: '#',
    platform: 'meet',
    meetingType: 'external'
  },
  {
    id: 'm11',
    title: 'Security Audit Review',
    description: 'Comprehensive security audit review covering system vulnerabilities, compliance, and remediation strategies.',
    meetingLink: 'https://teams.microsoft.com/l/meetup-join/19%3asecurity',
    date: '2025-06-20',
    startTime: '11:00',
    endTime: '12:30',
    attendees: [
      {
        id: 'a1',
        name: 'Aman Sanghi',
        email: 'amansanghi@synatechsolutions.com',
      },
      {
        id: 'a5',
        name: 'Rahul Dev',
        email: 'rahul@synatechsolutions.com',
      },
      {
        id: 'a10',
        name: 'Alex Thompson',
        email: 'alex@securitypro.com',
        company: 'SecurityPro Consulting',
        role: 'Security Consultant'
      }
    ],
    status: 'scheduled',
    summary: '📅 **Upcoming Meeting** - Security audit review to address vulnerabilities and ensure compliance. Detailed security assessment and remediation plan will be available here after the review.',
    transcript: 'Security audit discussion transcript will be generated, capturing all vulnerability assessments, compliance requirements, and remediation strategies.',
    actionItems: [],
    joinUrl: '#',
    platform: 'teams',
    meetingType: 'external'
  },
  {
    id: 'm12',
    title: 'Mid-Year Performance Reviews',
    description: 'Comprehensive mid-year performance review sessions for all team members, goal assessment, and development planning.',
    meetingLink: 'https://zoom.us/j/5555666677',
    date: '2025-06-25',
    startTime: '09:00',
    endTime: '17:00',
    attendees: [
      {
        id: 'a1',
        name: 'Aman Sanghi',
        email: 'amansanghi@synatechsolutions.com',
      },
      {
        id: 'a2',
        name: 'Demo User',
        email: 'demo@lemurai.com',
      },
      {
        id: 'a3',
        name: 'Aditi Sharma',
        email: 'aditi@synatechsolutions.com',
      },
      {
        id: 'a5',
        name: 'Rahul Dev',
        email: 'rahul@synatechsolutions.com',
      },
      {
        id: 'a6',
        name: 'Sarah Johnson',
        email: 'sarah@synatechsolutions.com',
        role: 'Product Manager'
      }
    ],
    status: 'scheduled',
    summary: '📅 **Upcoming Meeting** - Mid-year performance review sessions covering goal achievement, development planning, and career progression. Individual review summaries and development plans will be documented here after completion.',
    transcript: 'Performance review discussions will be transcribed with privacy considerations, focusing on professional development insights and goal setting.',
    actionItems: [],
    joinUrl: '#',
    platform: 'zoom',
    meetingType: 'internal'
  }
];

export const recentMeetings: Meeting[] = [
  {
    id: 'm4',
    title: 'Tech stand up',
    description: 'Daily technical standup meeting to discuss progress, blockers, and upcoming tasks.',
    meetingLink: 'https://zoom.us/j/1234567890',
    date: '2025-06-23',
    startTime: '08:00',
    endTime: '08:30',
    attendees: [
      {
        id: 'a1',
        name: 'Aman Sanghi',
        email: 'amansanghi@synatechsolutions.com',
      },
      {
        id: 'a2',
        name: 'Demo User',
        email: 'demo@lemurai.com',
      }
    ],
    status: 'completed',
    summary: `**Meeting Summary - Daily Standup (June 23, 2025)**

The team discussed current sprint progress and identified key technical challenges. Main focus areas included API integration improvements, client data privacy enhancements, and backend optimization for better performance.

**Key Discussion Points:**
• API integration is progressing well but needs review for edge cases
• Client privacy concerns require immediate attention and documentation
• Backend performance improvements showing positive results
• Summary feature development is on track for next milestone
• MVP deployment timeline confirmed for end of sprint

**Decisions Made:**
• Prioritize privacy documentation before client meetings
• Schedule additional API review session this week
• Continue current development velocity
• Plan demo preparation for upcoming client presentation

**Next Steps:**
• Complete privacy documentation by Wednesday
• Conduct API integration review
• Prepare MVP demo materials
• Schedule follow-up with client on privacy requirements`,

    transcript: `[08:00:15] Aman Sanghi: Good morning everyone, let's get started with our daily standup. Demo User, would you like to share your updates first?

[08:00:30] Demo User: Sure! Yesterday I worked on the API integration and made good progress. I've completed about 80% of the core functionality, but I noticed some edge cases that we might need to review together.

[08:01:00] Aman Sanghi: That sounds great. What kind of edge cases are you thinking about?

[08:01:15] Demo User: Mainly around data validation and error handling when external APIs return unexpected responses. I think we should have a session to review the implementation approach.

[08:02:00] Aman Sanghi: Absolutely, let's schedule that for Wednesday. Any blockers on your end?

[08:02:15] Demo User: No blockers currently, but I'd like to get feedback on the privacy documentation approach before proceeding further.

[08:02:45] Aman Sanghi: Perfect timing - I've been working on the client privacy documentation. The client has some specific concerns about data handling that we need to address comprehensively.

[08:03:30] Demo User: That's exactly what I was hoping to align on. Should we prioritize getting that documentation complete before any client interactions?

[08:04:00] Aman Sanghi: Yes, definitely. I'll have the initial draft ready by tomorrow, and we can review it together. From my side, I've been focusing on the backend development and the summary feature.

[08:04:45] Aman Sanghi: The backend optimizations are showing good results - we've improved response times by about 30%. The summary feature is coming along well and should be ready for testing by Friday.

[08:05:30] Demo User: Excellent! That ties in well with the MVP timeline we discussed. Are we still on track for the end-of-sprint deployment?

[08:06:00] Aman Sanghi: Yes, we're on track. The main components are coming together nicely. Once we resolve the API edge cases and complete the privacy documentation, we should be in good shape.

[08:06:45] Demo User: Great. Should we plan a demo session for the client once the MVP is ready?

[08:07:15] Aman Sanghi: That's a good idea. Let's aim for early next week once we have everything polished. We can showcase the API integration, privacy features, and the summary functionality.

[08:07:45] Demo User: Perfect. I'll start preparing demo materials alongside the development work.

[08:08:00] Aman Sanghi: Sounds like a plan. Any other items for today?

[08:08:15] Demo User: Nothing else from my side. The API work should continue smoothly today.

[08:08:30] Aman Sanghi: Alright, great session everyone. Let's reconvene tomorrow at the same time. Have a productive day!

[08:08:45] Demo User: Thanks, see you tomorrow!

[END OF TRANSCRIPT]`,

    actionItems: [
      {
        id: 'ai1',
        content: 'Review API integration approach for edge cases',
        assignee: 'Demo User',
        status: 'pending',
        priority: 'high',
        dueDate: '2025-06-26'
      },
      {
        id: 'ai2',
        content: 'Prepare client privacy documentation',
        assignee: 'Aman Sanghi',
        dueDate: '2025-06-26',
        status: 'pending',
        priority: 'medium'
      },
      {
        id: 'ai3',
        content: 'Schedule API integration review session',
        assignee: 'Aman Sanghi',
        dueDate: '2025-06-25',
        status: 'pending',
        priority: 'high'
      },
      {
        id: 'ai4',
        content: 'Prepare MVP demo materials',
        assignee: 'Demo User',
        dueDate: '2025-06-30',
        status: 'pending',
        priority: 'medium'
      }
    ],
    platform: 'zoom',
    meetingType: 'internal'
  },
  {
    id: 'm5',
    title: 'aditi@synatechsolutions.com - Untitled',
    description: 'Informal discussion session covering various technical and operational topics.',
    meetingLink: 'https://teams.microsoft.com/l/meetup-join/19%3aaditi',
    date: '2025-06-22',
    startTime: '09:35',
    endTime: '10:30',
    attendees: [
      {
        id: 'a3',
        name: 'Aditi Sharma',
        email: 'aditi@synatechsolutions.com',
      },
      {
        id: 'a2',
        name: 'Demo User',
        email: 'demo@lemurai.com',
      }
    ],
    status: 'completed',
    summary: `**Meeting Summary - Technical Discussion (June 22, 2025)**

Aditi and Demo User conducted an informal technical discussion covering bot integration, data latency optimization, and UI verification protocols. The conversation provided valuable insights into current system performance and areas for improvement.

**Key Topics Discussed:**
• Bot integration testing and verification procedures
• Data latency issues affecting user experience
• UI verification protocols for quality assurance
• Training requirements for verification processes
• System performance optimization strategies

**Technical Insights:**
• Current bot integration checks are working but need standardization
• Data latency can be reduced through better caching strategies
• UI verification needs formal documentation and training
• Team members require additional training on verification protocols

**Immediate Actions Identified:**
• Create comprehensive UI verification protocol documentation
• Schedule team training session for verification processes
• Implement improved data caching mechanisms
• Establish standardized bot integration testing procedures

**Follow-up Items:**
• Documentation review session planned for next week
• Training session to be scheduled within two weeks
• Performance optimization testing to begin immediately`,

    transcript: `[09:35:12] Aditi Sharma: Hi Demo User! Thanks for joining this impromptu session. I wanted to discuss a few technical items that came up during this week's development.

[09:35:30] Demo User: Of course! I'm glad we could find time to sync up. What's on your mind?

[09:35:45] Aditi Sharma: Well, I've been looking into the bot integration checks, and I think we might need to standardize our verification process. Have you noticed any inconsistencies?

[09:36:15] Demo User: Actually, yes. I've seen some variations in how different team members are running the checks. Some are more thorough than others.

[09:36:45] Aditi Sharma: Exactly what I was thinking. I believe we need a formal protocol document that everyone can follow. It would ensure consistency and improve our overall quality.

[09:37:30] Demo User: That makes a lot of sense. While we're on the topic of verification, I've also noticed some data latency issues that might be affecting the verification results.

[09:38:00] Aditi Sharma: Interesting. Can you elaborate on the latency issues? Are they consistent or intermittent?

[09:38:30] Demo User: They seem to be more noticeable during peak usage times. I suspect it might be related to our current caching strategy, or lack thereof in some areas.

[09:39:15] Aditi Sharma: That's a good observation. Data latency can definitely impact user experience and verification accuracy. We should prioritize addressing this.

[09:40:00] Demo User: Agreed. I think implementing better caching mechanisms could help significantly. Have you had a chance to look at the UI verification side of things?

[09:40:30] Aditi Sharma: Yes, and that's another area where I think we need improvement. Our UI verification process is somewhat ad-hoc right now.

[09:41:00] Demo User: I've noticed that too. Different people are checking different things, and we don't have a standardized checklist or procedure.

[09:41:45] Aditi Sharma: Exactly. I think creating a comprehensive UI verification protocol would be really valuable. It should cover all the critical checkpoints and be easy to follow.

[09:42:30] Demo User: That would be incredibly helpful. Would you be able to take the lead on creating that documentation?

[09:43:00] Aditi Sharma: Absolutely! I can start working on it this week. I think we should also plan some training sessions once the documentation is ready.

[09:43:45] Demo User: Training sessions are a great idea. It would ensure everyone is on the same page and following the same standards.

[09:44:30] Aditi Sharma: I'm thinking we could schedule a team training session in about two weeks, once I have the documentation complete and reviewed.

[09:45:15] Demo User: That timeline sounds perfect. It gives enough time to create comprehensive materials and for everyone to prepare.

[09:46:00] Aditi Sharma: Great! I'll start working on both the UI verification protocol and the bot integration standardization documentation.

[09:46:45] Demo User: Excellent. I can help with the technical implementation side once we have the protocols defined.

[09:47:30] Aditi Sharma: That would be wonderful. Your technical perspective will be really valuable for making sure the protocols are practical and implementable.

[09:48:15] Demo User: I'm also thinking we should start looking into the data latency optimization sooner rather than later. It might take some time to implement properly.

[09:49:00] Aditi Sharma: You're absolutely right. Performance issues can compound over time if we don't address them promptly.

[09:49:45] Demo User: I can start researching caching solutions and performance optimization strategies this week while you work on the documentation.

[09:50:30] Aditi Sharma: Perfect division of work! This feels like a really productive discussion.

[09:51:00] Demo User: Definitely! I feel like we've identified some key areas for improvement and have a clear plan moving forward.

[09:51:30] Aditi Sharma: I'll send out a summary email later today with our action items and timelines so we can track progress.

[09:52:00] Demo User: That would be great. I appreciate you taking the initiative on organizing this.

[09:52:30] Aditi Sharma: Of course! Good collaboration is what makes these improvements possible.

[09:53:00] Demo User: Agreed. Thanks for setting up this session, Aditi. I'm looking forward to working on these improvements together.

[09:53:30] Aditi Sharma: Likewise! Let's plan to sync up again next week to review progress.

[09:54:00] Demo User: Sounds perfect. Have a great rest of your day!

[09:54:15] Aditi Sharma: You too! Talk soon.

[END OF TRANSCRIPT]`,

    actionItems: [
      {
        id: 'ai3',
        content: 'Create UI verification protocol document',
        assignee: 'Demo User',
        dueDate: '2025-06-25',
        status: 'pending',
        priority: 'high'
      },
      {
        id: 'ai4',
        content: 'Schedule team training session',
        assignee: 'Aditi Sharma',
        dueDate: '2025-06-27',
        status: 'pending',
        priority: 'medium'
      },
      {
        id: 'ai5',
        content: 'Research data caching optimization solutions',
        assignee: 'Demo User',
        dueDate: '2025-06-25',
        status: 'pending',
        priority: 'high'
      },
      {
        id: 'ai6',
        content: 'Standardize bot integration testing procedures',
        assignee: 'Aditi Sharma',
        dueDate: '2025-06-28',
        status: 'pending',
        priority: 'medium'
      }
    ],
    platform: 'teams',
    meetingType: 'internal'
  },
  {
    id: 'm6',
    title: 'Trial',
    description: 'Trial meeting to test new features and gather feedback on system performance.',
    meetingLink: 'https://zoom.us/j/9999888877',
    date: '2025-06-22',
    startTime: '13:16',
    endTime: '14:00',
    attendees: [
      {
        id: 'a3',
        name: 'Aditi Sharma',
        email: 'aditi@synatechsolutions.com',
      },
      {
        id: 'a2',
        name: 'Demo User',
        email: 'demo@lemurai.com',
      }
    ],
    status: 'completed',
    summary: `**Meeting Summary - Trial Session (June 22, 2025)**

This trial meeting served as a comprehensive testing session for new features and market analysis. The team evaluated API integration capabilities, conducted competitive pricing analysis, and explored cost optimization strategies.

**Primary Objectives Achieved:**
• Tested API integration for transcription services
• Analyzed competitor pricing structures (including Otter.ai comparison)
• Identified potential cost-saving opportunities
• Evaluated student discount implementation feasibility

**Key Findings:**
• API integration for transcription is performing within expected parameters
• Competitive pricing analysis reveals opportunities for strategic positioning
• Cost-saving measures could improve overall service profitability
• Student discount programs could expand market reach

**Technical Performance:**
• Transcription API response times are acceptable (avg 2.3 seconds)
• Integration stability is high with 99.2% uptime during testing
• Feature compatibility across platforms is strong
• User experience remains smooth throughout testing

**Strategic Insights:**
• Pricing strategy needs refinement based on competitor analysis
• Cost optimization can be achieved through improved API usage
• Student market represents significant growth opportunity
• Feature differentiation is key for competitive advantage`,

    transcript: `[13:16:20] Aditi Sharma: Alright, let's start this trial session. Demo User, are you ready to test the new features?

[13:16:35] Demo User: Yes, I'm ready! I have the test scenarios prepared. Should we start with the API integration for transcription?

[13:16:50] Aditi Sharma: Perfect. That's exactly what I was thinking. Let's see how the transcription API is performing today.

[13:17:15] Demo User: Initiating the API call now... The response time looks good so far. I'm seeing about 2.3 seconds average response time.

[13:17:45] Aditi Sharma: That's within our target range. How's the accuracy looking?

[13:18:00] Demo User: The accuracy seems quite high. I'm running through different audio samples to test various scenarios.

[13:18:30] Aditi Sharma: Excellent. While you continue testing, I wanted to discuss the pricing analysis I've been working on.

[13:19:00] Demo User: Great timing! I'm curious to hear what you've found, especially regarding competitor pricing.

[13:19:30] Aditi Sharma: So I've been comparing our pricing structure with competitors like Otter, and there are some interesting insights.

[13:20:00] Demo User: Otter is definitely a major player in this space. What did you discover?

[13:20:15] Aditi Sharma: They have a tiered pricing model that's quite competitive, but I think we have opportunities to differentiate ourselves.

[13:20:45] Demo User: That's encouraging. Are there specific areas where we can offer better value?

[13:21:15] Aditi Sharma: Yes, particularly in the enterprise features and API integration capabilities. Our technology stack gives us some advantages.

[13:21:45] Demo User: That makes sense. Speaking of costs, have you considered implementing student discounts? That could help us capture the education market.

[13:22:30] Aditi Sharma: Actually, that's a brilliant idea! Student discounts could be a great way to build early adoption and brand loyalty.

[13:23:00] Demo User: Exactly. Students today become professionals tomorrow, so early exposure to our platform could pay dividends long-term.

[13:23:45] Aditi Sharma: I love that perspective. What kind of discount percentage were you thinking?

[13:24:15] Demo User: Maybe 40-50% for verified students? That's competitive with other software providers in the education space.

[13:24:45] Aditi Sharma: That sounds reasonable. We'd need to implement student verification, but that's definitely doable.

[13:25:30] Demo User: For verification, we could partner with services like SheerID or UNiDAYS. They handle student verification for lots of companies.

[13:26:00] Aditi Sharma: Good thinking! That would streamline the process and ensure accuracy. Back to the API testing - how are the third-party integrations looking?

[13:26:45] Demo User: They're performing well overall. I've tested integration with several third-party APIs and the stability is strong.

[13:27:30] Aditi Sharma: Any particular APIs that are performing better than others?

[13:28:00] Demo User: The Google Speech-to-Text and AWS Transcribe integrations are both excellent. Azure is also performing well but with slightly higher latency.

[13:28:45] Aditi Sharma: That's valuable data. We might want to prioritize the better-performing APIs for our premium features.

[13:29:30] Demo User: Agreed. Cost optimization is another factor - some APIs are more cost-effective than others for high-volume usage.

[13:30:15] Aditi Sharma: Speaking of costs, I've been analyzing our current usage patterns and I think there are opportunities for optimization.

[13:30:45] Demo User: What kind of optimizations are you thinking about?

[13:31:15] Aditi Sharma: Mainly around API call efficiency and caching strategies. We could reduce redundant calls and implement smarter caching.

[13:31:45] Demo User: That could definitely help with both performance and costs. Have you estimated potential savings?

[13:32:30] Aditi Sharma: Preliminary estimates suggest we could reduce API costs by 20-30% with proper optimization.

[13:33:00] Demo User: That's significant! Those savings could help us offer more competitive pricing to customers.

[13:33:30] Aditi Sharma: Exactly. It creates a positive cycle - lower costs enable better pricing, which drives more adoption.

[13:34:15] Demo User: This trial session is really productive. We're getting good technical validation and strategic insights.

[13:34:45] Aditi Sharma: I agree! The combination of technical testing and market analysis is giving us a comprehensive view.

[13:35:30] Demo User: Should we document all these findings for the team?

[13:36:00] Aditi Sharma: Absolutely. I'll compile the pricing analysis and optimization recommendations into a report.

[13:36:30] Demo User: And I'll document the technical testing results and API performance metrics.

[13:37:15] Aditi Sharma: Perfect. This information will be valuable for our upcoming strategy discussions.

[13:37:45] Demo User: Definitely. The student discount idea alone could open up a whole new market segment for us.

[13:38:30] Aditi Sharma: And the cost optimization strategies could improve our margins significantly.

[13:39:00] Demo User: It feels like we're building a strong foundation for growth. Both technical capabilities and market positioning are improving.

[13:39:45] Aditi Sharma: I couldn't agree more. This trial session has been incredibly valuable.

[13:40:15] Demo User: Should we schedule a follow-up session to dive deeper into implementation planning?

[13:40:45] Aditi Sharma: Great idea. Let's plan for next week once we've both had time to compile our findings.

[13:41:15] Demo User: Perfect. I'm excited to see how these insights translate into actionable improvements.

[13:41:45] Aditi Sharma: Me too! Thanks for such a productive trial session, Demo User.

[13:42:00] Demo User: Thank you, Aditi! This collaboration is exactly what we need to move forward effectively.

[END OF TRANSCRIPT]`,

    actionItems: [
      {
        id: 'ai5',
        content: 'Compile competitor pricing analysis',
        assignee: 'Demo User',
        dueDate: '2025-06-28',
        status: 'pending',
        priority: 'medium'
      },
      {
        id: 'ai6',
        content: 'Investigate third-party API options',
        assignee: 'Aditi Sharma',
        dueDate: '2025-06-25',
        status: 'completed',
        priority: 'high'
      },
      {
        id: 'ai7',
        content: 'Research student verification services (SheerID, UNiDAYS)',
        assignee: 'Demo User',
        dueDate: '2025-06-27',
        status: 'pending',
        priority: 'medium'
      },
      {
        id: 'ai8',
        content: 'Develop cost optimization implementation plan',
        assignee: 'Aditi Sharma',
        dueDate: '2025-06-30',
        status: 'pending',
        priority: 'high'
      }
    ],
    platform: 'zoom',
    meetingType: 'external'
  },
  {
    id: 'm22',
    title: 'TechCorp - Implementation Planning',
    description: 'Technical implementation planning session with TechCorp Industries to finalize system architecture.',
    meetingLink: 'https://teams.microsoft.com/l/meetup-join/19%3atechcorp-impl',
    date: '2025-06-20',
    startTime: '14:00',
    endTime: '15:30',
    attendees: [
      {
        id: 'a1',
        name: 'Aman Sanghi',
        email: 'amansanghi@synatechsolutions.com',
      },
      {
        id: 'a2',
        name: 'Demo User',
        email: 'demo@lemurai.com',
      },
      {
        id: 'a7',
        name: 'Michael Chen',
        email: 'michael@techcorp.com',
        company: 'TechCorp',
        role: 'CTO'
      },
      {
        id: 'a8',
        name: 'Lisa Wang',
        email: 'lisa@techcorp.com',
        company: 'TechCorp',
        role: 'Engineering Manager'
      }
    ],
    status: 'completed',
    summary: `**Meeting Summary - TechCorp Implementation Planning (June 20, 2025)**

Successful implementation planning session with TechCorp Industries covering system architecture, security requirements, and deployment timeline. The meeting established clear technical foundations and integration strategies for the upcoming project.

**Key Decisions Made:**
• Microservices architecture approved for scalability and flexibility
• AWS cloud infrastructure selected for hosting and deployment
• API-first approach confirmed for seamless integration
• Security protocols aligned with TechCorp's enterprise standards
• Three-phase rollout strategy agreed upon

**Technical Requirements Finalized:**
• RESTful API design with GraphQL for complex queries
• OAuth 2.0 + JWT for authentication and authorization
• Redis for caching and session management
• PostgreSQL for primary data storage
• Docker containerization for consistent deployments

**Implementation Timeline:**
• Phase 1: Core infrastructure setup (2 weeks)
• Phase 2: API development and testing (4 weeks)
• Phase 3: Frontend integration and deployment (3 weeks)
• Total project duration: 9 weeks with 1-week buffer

**Security & Compliance:**
• SOC 2 Type II compliance requirements confirmed
• Data encryption at rest and in transit
• Regular security audits and penetration testing
• GDPR compliance for international data handling

**Next Steps:**
• Technical documentation delivery by June 25th
• Development environment setup by June 27th
• Weekly progress review meetings scheduled
• Stakeholder communication plan established`,

    transcript: `[14:00:15] Aman Sanghi: Good afternoon everyone, thank you for joining this implementation planning session. Michael, Lisa, we're excited to move forward with the TechCorp project.

[14:00:45] Michael Chen: Thank you, Aman. We're equally excited about this partnership. Lisa and I have prepared our technical requirements and constraints to share with your team.

[14:01:15] Demo User: That's perfect. We've also prepared some architecture proposals based on our initial discussions. Should we start with the high-level architecture overview?

[14:01:45] Lisa Wang: That sounds great. We're particularly interested in understanding how the system will scale as our user base grows.

[14:02:15] Aman Sanghi: Excellent question. We're proposing a microservices architecture that will allow horizontal scaling of individual components based on demand. This approach provides both flexibility and cost efficiency.

[14:03:00] Michael Chen: Microservices make sense for our use case. What about the technology stack? We have some preferences based on our internal expertise.

[14:03:30] Demo User: We'd love to hear your preferences. Our recommendation includes Node.js with Express for the backend, React for the frontend, and PostgreSQL for data persistence. How does that align with your tech stack?

[14:04:15] Lisa Wang: That aligns perfectly with our current infrastructure. We're already using React and PostgreSQL extensively, and our DevOps team is familiar with Node.js deployments.

[14:05:00] Aman Sanghi: That's great news. For hosting and deployment, we recommend AWS with Docker containerization. This will ensure consistency across development, staging, and production environments.

[14:05:45] Michael Chen: AWS is our preferred cloud provider, so that works well. What about security considerations? We need to maintain SOC 2 Type II compliance.

[14:06:30] Demo User: Security is definitely a priority. We'll implement OAuth 2.0 with JWT tokens for authentication, ensure all data is encrypted both at rest and in transit, and we can support your SOC 2 compliance requirements.

[14:07:15] Lisa Wang: That's reassuring. What about API design? We'll need to integrate this system with several existing applications.

[14:07:45] Aman Sanghi: We're proposing an API-first approach using RESTful endpoints with GraphQL for more complex query scenarios. This will provide maximum flexibility for your integration needs.

[14:08:30] Michael Chen: GraphQL could be very useful for our mobile applications. How do you handle caching and performance optimization?

[14:09:00] Demo User: We'll implement Redis for caching frequently accessed data and session management. Combined with database query optimization and CDN usage, this should provide excellent performance.

[14:09:45] Lisa Wang: What about the deployment timeline? We're hoping to have this system live by the end of Q3.

[14:10:15] Aman Sanghi: Based on the scope we've discussed, I believe we can complete the implementation in about 9 weeks. We'd like to propose a three-phase rollout approach.

[14:10:45] Michael Chen: Tell us more about these phases.

[14:11:00] Demo User: Phase 1 would be core infrastructure setup, taking about 2 weeks. Phase 2 covers API development and testing, which we estimate at 4 weeks. Phase 3 is frontend integration and final deployment, approximately 3 weeks.

[14:11:45] Lisa Wang: That timeline works well for us. We'd also like to build in some buffer time for testing and validation.

[14:12:15] Aman Sanghi: Absolutely. We typically recommend a 1-week buffer, which would bring the total to 10 weeks. This allows for thorough testing and any unexpected challenges.

[14:12:45] Michael Chen: Perfect. What about ongoing communication and progress tracking?

[14:13:15] Demo User: We propose weekly progress review meetings, daily standups within our development team, and milestone-based demos for your stakeholders. We'll also provide access to our project management dashboard.

[14:14:00] Lisa Wang: That level of transparency is exactly what we need. What deliverables can we expect at each phase?

[14:14:30] Aman Sanghi: Phase 1 deliverables include infrastructure setup documentation, security configuration, and development environment access. Phase 2 provides complete API documentation, testing reports, and sandbox environment for integration testing.

[14:15:15] Michael Chen: And Phase 3?

[14:15:30] Demo User: Phase 3 delivers the complete system with user documentation, deployment guides, training materials, and handover to your operations team.

[14:16:00] Lisa Wang: This all sounds very comprehensive. What do you need from our side to get started?

[14:16:30] Aman Sanghi: We'll need access to your development environment specifications, any existing API documentation for systems we'll integrate with, and designated technical contacts for each integration point.

[14:17:00] Michael Chen: We can provide all of that. When can we expect the technical documentation you mentioned?

[14:17:30] Demo User: We'll have detailed technical documentation ready by June 25th, which will include architecture diagrams, API specifications, and security protocols.

[14:18:00] Lisa Wang: Excellent. We'll review that documentation and provide feedback by June 27th.

[14:18:30] Aman Sanghi: Perfect. Should we schedule our next meeting for June 28th to discuss any feedback and kick off development?

[14:19:00] Michael Chen: That works for us. We're looking forward to seeing this project come to life.

[14:19:30] Demo User: Thank you both for such a productive session. We're excited to build something great together.

[14:19:45] Lisa Wang: Thank you, and we'll talk soon!

[END OF TRANSCRIPT]`,

    actionItems: [
      {
        id: 'ai_tc1',
        content: 'Prepare detailed technical documentation including architecture diagrams',
        assignee: 'Demo User',
        status: 'completed',
        priority: 'high',
        dueDate: '2025-06-25'
      },
      {
        id: 'ai_tc2',
        content: 'Set up development environment with AWS infrastructure',
        assignee: 'Aman Sanghi',
        dueDate: '2025-06-27',
        status: 'completed',
        priority: 'high'
      },
      {
        id: 'ai_tc3',
        content: 'Provide access to TechCorp development environment',
        assignee: 'Lisa Wang',
        dueDate: '2025-06-27',
        status: 'completed',
        priority: 'medium'
      },
      {
        id: 'ai_tc4',
        content: 'Review technical documentation and provide feedback',
        assignee: 'Michael Chen',
        dueDate: '2025-06-27',
        status: 'completed',
        priority: 'medium'
      }
    ],
    platform: 'teams',
    meetingType: 'external',
    clientId: 'client-1'
  }
];

// Combine for all meetings
export const allMeetings = [...recentMeetings, ...upcomingMeetings];

// Get meeting by ID
export function getMeetingById(id: string): Meeting | undefined {
  return allMeetings.find(meeting => meeting.id === id);
}

// Get meetings by client ID
export function getMeetingsByClientId(clientId: string): Meeting[] {
  return allMeetings.filter(meeting => meeting.clientId === clientId);
}