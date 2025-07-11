// --- Component Metadata ---
/**
 * @component Calendar
 * @description Responsive calendar component with month, week, and day views displaying meeting details. No backend integration.
 * @author Lemur
 * @lastModified 2024-06-09
 */

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, Users, Calendar as CalendarIcon } from 'lucide-react';
import { Meeting } from '../types';
import { cn } from '../utils/cn';

type CalendarView = 'month' | 'week' | 'day';

interface CalendarProps {
  meetings: Meeting[];
  view?: CalendarView;
  onDateSelect?: (date: Date) => void;
  onMeetingClick?: (meeting: Meeting) => void;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isCurrentWeek?: boolean;
  meetings: Meeting[];
}

export const Calendar: React.FC<CalendarProps> = ({
  meetings,
  view = 'month',
  onDateSelect,
  onMeetingClick,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();

  const navigate = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      switch (view) {
        case 'month':
          newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
          break;
        case 'week':
          newDate.setDate(prev.getDate() + (direction === 'next' ? 7 : -7));
          break;
        case 'day':
          newDate.setDate(prev.getDate() + (direction === 'next' ? 1 : -1));
          break;
      }
      return newDate;
    });
  };

  const handleDateClick = (date: Date) => {
    onDateSelect?.(date);
  };

  const handleMeetingClick = (meeting: Meeting, e: React.MouseEvent) => {
    e.stopPropagation();
    onMeetingClick?.(meeting);
  };

  const formatTime = (timeString: string) => {
    // Handle both full date strings and time-only strings like "08:00"
    if (timeString.includes(':') && !timeString.includes('T') && !timeString.includes(' ')) {
      // Time-only format like "08:00"
      const [hours, minutes] = timeString.split(':').map(Number);
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    } else {
      // Full date string
      const date = new Date(timeString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    }
  };

  const getMeetingColor = (meeting: Meeting) => {
    if (meeting.status === 'completed') return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700';
    if (meeting.status === 'in_progress') return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700';
    return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700';
  };

  const getHeaderTitle = () => {
    switch (view) {
      case 'month':
        return currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
      case 'week':
        const weekStart = getWeekStart(currentDate);
        const weekEnd = getWeekEnd(currentDate);
        if (weekStart.getMonth() === weekEnd.getMonth()) {
          return `${weekStart.toLocaleString('default', { month: 'long' })} ${weekStart.getDate()}-${weekEnd.getDate()}, ${weekStart.getFullYear()}`;
        } else {
          return `${weekStart.toLocaleString('default', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleString('default', { month: 'short', day: 'numeric' })}, ${weekStart.getFullYear()}`;
        }
      case 'day':
        return currentDate.toLocaleString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    }
  };

  const renderMonthView = () => {
    const calendarDays = generateMonthDays();
    
    return (
      <>
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 md:gap-2 mb-3">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-semibold text-gray-700 dark:text-gray-300 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day.charAt(0)}</span>
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 md:gap-2">
          {calendarDays.map((day, i) => (
            <div
              key={i}
              className={cn(
                'rounded-lg p-1 md:p-2 cursor-pointer transition-all duration-200 hover:shadow-sm border-[0.25px]',
                'min-h-[80px] md:min-h-[120px] flex flex-col',
                day.isCurrentMonth 
                  ? 'bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700' 
                  : 'bg-gray-50 dark:bg-black opacity-40 border-gray-100 dark:border-gray-900',
                day.isToday && 'ring-[0.5px] ring-blue-500 shadow-md border-blue-200 dark:border-blue-700',
                day.meetings.length > 0 && 'border-l-[1px] border-l-blue-400 dark:border-l-blue-500'
              )}
              onClick={() => handleDateClick(day.date)}
            >
              {/* Date Number */}
              <div className={cn(
                'text-sm md:text-base font-semibold mb-1',
                day.isCurrentMonth ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500',
                day.isToday && 'text-blue-600 dark:text-blue-400'
              )}>
                {day.date.getDate()}
              </div>

              {/* Meetings */}
              <div className="flex-1 space-y-1 overflow-hidden">
                {day.meetings.slice(0, 3).map((meeting, idx) => (
                  <div
                    key={meeting.id}
                    className={cn(
                      'text-xs p-1 md:p-1.5 rounded border cursor-pointer transition-all duration-200',
                      'hover:scale-105 hover:shadow-sm truncate',
                      getMeetingColor(meeting)
                    )}
                    title={`${meeting.title} - ${formatTime(meeting.startTime)} to ${formatTime(meeting.endTime)}`}
                    onClick={(e) => handleMeetingClick(meeting, e)}
                  >
                    <div className="font-medium truncate">
                      {meeting.title}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5 opacity-75">
                      <Clock className="h-2.5 w-2.5" />
                      <span className="text-[10px] md:text-xs">
                        {formatTime(meeting.startTime)}
                      </span>
                    </div>
                  </div>
                ))}
                
                {/* Show "more" indicator if there are additional meetings */}
                {day.meetings.length > 3 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium px-1">
                    +{day.meetings.length - 3} more
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  const renderWeekView = () => {
    const weekDays = generateWeekDays();
    
    return (
      <>
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {weekDays.map((day, i) => (
            <div key={i} className="text-center">
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                {day.date.toLocaleDateString('default', { weekday: 'short' })}
              </div>
              <div className={cn(
                'text-lg font-bold rounded-full w-8 h-8 mx-auto flex items-center justify-center',
                day.isToday 
                  ? 'bg-blue-500 dark:bg-blue-600 text-white' 
                  : 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700'
              )}>
                {day.date.getDate()}
              </div>
            </div>
          ))}
        </div>

        {/* Week Grid */}
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, i) => (
            <div
              key={i}
              className={cn(
                'rounded-lg p-2 cursor-pointer transition-all duration-200 hover:shadow-sm',
                'min-h-[200px] flex flex-col border-[0.25px] border-gray-200 dark:border-gray-700',
                'bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800',
                day.isToday && 'ring-[0.5px] ring-blue-500 shadow-md border-blue-200 dark:border-blue-700',
                day.meetings.length > 0 && 'border-l-[1px] border-l-blue-400 dark:border-l-blue-500'
              )}
              onClick={() => handleDateClick(day.date)}
            >
              {/* Meetings */}
              <div className="flex-1 space-y-2 overflow-hidden">
                {day.meetings.map((meeting, idx) => (
                  <div
                    key={meeting.id}
                    className={cn(
                      'text-xs p-2 rounded border cursor-pointer transition-all duration-200',
                      'hover:scale-105 hover:shadow-sm',
                      getMeetingColor(meeting)
                    )}
                    onClick={(e) => handleMeetingClick(meeting, e)}
                  >
                    <div className="font-medium mb-1 line-clamp-2">
                      {meeting.title}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] opacity-75">
                      <Clock className="h-3 w-3" />
                      <span>{formatTime(meeting.startTime)}</span>
                      <Users className="h-3 w-3 ml-1" />
                      <span>{meeting.attendees.length}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  const renderDayView = () => {
    const dayMeetings = getMeetingsForDate(currentDate, meetings);
    const timeSlots = generateTimeSlots();
    
    return (
      <div className="space-y-4">
        {/* Day Header */}
        <div className="text-center">
          <div className={cn(
            'text-2xl font-bold rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-2',
            isSameDay(currentDate, today) 
              ? 'bg-blue-500 dark:bg-blue-600 text-white' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
          )}>
            {currentDate.getDate()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {dayMeetings.length} meeting{dayMeetings.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Time Grid */}
        <div className="space-y-1 max-h-96 overflow-y-auto">
          {timeSlots.map((timeSlot) => {
            const slotMeetings = dayMeetings.filter(meeting => {
              const meetingHour = parseInt(meeting.startTime.split(':')[0]);
              return meetingHour === timeSlot.hour;
            });

            return (
              <div
                key={timeSlot.hour}
                className="flex border-b border-gray-200 dark:border-gray-700 py-2"
              >
                <div className="w-20 text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {timeSlot.label}
                </div>
                <div className="flex-1 space-y-2">
                  {slotMeetings.length > 0 ? (
                    slotMeetings.map((meeting) => (
                      <div
                        key={meeting.id}
                        className={cn(
                          'p-3 rounded-lg border cursor-pointer transition-all duration-200',
                          'hover:shadow-sm',
                          getMeetingColor(meeting)
                        )}
                        onClick={(e) => handleMeetingClick(meeting, e)}
                      >
                        <div className="font-semibold mb-1">{meeting.title}</div>
                        <div className="text-sm opacity-75 mb-2">
                          {formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Users className="h-3 w-3" />
                          <span>{meeting.attendees.length} attendees</span>
                          {meeting.platform && (
                            <>
                              <span>•</span>
                              <span className="uppercase">{meeting.platform}</span>
                            </>
                          )}
                        </div>
                        {meeting.description && (
                          <div className="text-xs mt-2 line-clamp-2 opacity-80">
                            {meeting.description}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400 dark:text-gray-500 text-sm italic">No meetings</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const generateMonthDays = (): CalendarDay[] => {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();
    const calendarDays: CalendarDay[] = [];

    // Previous month days
    const prevMonth = new Date(currentYear, currentMonth - 1, 0);
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - 1, prevMonth.getDate() - i);
      calendarDays.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        meetings: getMeetingsForDate(date, meetings),
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      calendarDays.push({
        date,
        isCurrentMonth: true,
        isToday: isSameDay(date, today),
        meetings: getMeetingsForDate(date, meetings),
      });
    }

    // Next month days to fill the grid
    const remainingDays = 42 - calendarDays.length; // 6 weeks * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(currentYear, currentMonth + 1, day);
      calendarDays.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        meetings: getMeetingsForDate(date, meetings),
      });
    }

    return calendarDays;
  };

  const generateWeekDays = (): CalendarDay[] => {
    const weekStart = getWeekStart(currentDate);
    const weekDays: CalendarDay[] = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      weekDays.push({
        date,
        isCurrentMonth: true,
        isToday: isSameDay(date, today),
        meetings: getMeetingsForDate(date, meetings),
      });
    }

    return weekDays;
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      slots.push({
        hour,
        label: new Date(0, 0, 0, hour).toLocaleTimeString([], { 
          hour: 'numeric', 
          hour12: true 
        })
      });
    }
    return slots;
  };

  return (
    <div className="rounded-xl bg-white dark:bg-gray-900 shadow-sm border-[0.25px] border-gray-200 dark:border-gray-800 p-4 md:p-6 w-full">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={() => navigate('prev')} 
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
          aria-label={`Previous ${view}`}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="font-bold text-xl md:text-2xl text-gray-900 dark:text-white text-center">
          {getHeaderTitle()}
        </div>
        <button 
          onClick={() => navigate('next')} 
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
          aria-label={`Next ${view}`}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Calendar Content */}
      {view === 'month' && renderMonthView()}
      {view === 'week' && renderWeekView()}
      {view === 'day' && renderDayView()}
    </div>
  );
};

// Helper functions
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function getMeetingsForDate(date: Date, meetings: Meeting[]): Meeting[] {
  return meetings.filter(m => {
    const meetingDate = new Date(m.date);
    return (
      meetingDate.getFullYear() === date.getFullYear() &&
      meetingDate.getMonth() === date.getMonth() &&
      meetingDate.getDate() === date.getDate()
    );
  });
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
}

function getWeekEnd(date: Date): Date {
  const weekStart = getWeekStart(date);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  return weekEnd;
}
