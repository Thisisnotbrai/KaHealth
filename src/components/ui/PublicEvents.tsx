import { useEffect, useState, type JSX } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/supabase-client";
import { ChevronLeft, ChevronRight, Calendar, Heart } from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
}

// Date helper functions to replace date-fns
const startOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const endOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

const startOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
};

const endOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() + (6 - day);
  return new Date(d.setDate(diff));
};

const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const format = (date: Date, formatStr: string) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  if (formatStr === "yyyy-MM-dd") {
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }
  if (formatStr === "d") {
    return day.toString();
  }
  if (formatStr === "MMMM yyyy") {
    return `${monthNames[date.getMonth()]} ${year}`;
  }
  if (formatStr === "MMMM") {
    return monthNames[date.getMonth()];
  }
  return date.toDateString();
};

const isSameMonth = (date1: Date, date2: Date) => {
  return date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
};

const isSameDay = (date1: Date, date2: Date) => {
  return date1.getDate() === date2.getDate() && 
         date1.getMonth() === date2.getMonth() && 
         date1.getFullYear() === date2.getFullYear();
};

export default function PublicEvents() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [selectedDayEvents, setSelectedDayEvents] = useState<Event[]>([]);
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase.from("events").select("*");
      if (!error && data) {
        setEvents(data);
      }
    };
    fetchEvents();
  }, []);

  // Navigation functions
  const previousPeriod = () => {
    if (viewMode === 'month') {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    } else {
      setCurrentMonth(addDays(currentMonth, -7));
    }
  };

  const nextPeriod = () => {
    if (viewMode === 'month') {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    } else {
      setCurrentMonth(addDays(currentMonth, 7));
    }
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  // Modal functions
  const openModal = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(false);
  };

  // Day modal functions
  const openDayModal = (dayEvents: Event[], _date: Date) => {
    if (dayEvents.length > 0) {
      setSelectedDayEvents(dayEvents);
      setIsDayModalOpen(true);
    }
  };

  const closeDayModal = () => {
    setSelectedDayEvents([]);
    setIsDayModalOpen(false);
  };

  // Calendar helpers
  const today = new Date();
  
  const getDateRange = () => {
    if (viewMode === 'month') {
      const monthStart = startOfMonth(currentMonth);
      const monthEnd = endOfMonth(monthStart);
      return {
        startDate: startOfWeek(monthStart),
        endDate: endOfWeek(monthEnd),
        displayDate: monthStart
      };
    } else {
      const weekStart = startOfWeek(currentMonth);
      const weekEnd = endOfWeek(currentMonth);
      return {
        startDate: weekStart,
        endDate: weekEnd,
        displayDate: currentMonth
      };
    }
  };

  const { startDate, endDate, displayDate } = getDateRange();

  const renderCalendarGrid = () => {
    const rows = [];
    let day = startDate;
    const isWeekView = viewMode === 'week';

    while (day <= endDate) {
      const days: JSX.Element[] = [];
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, "yyyy-MM-dd");
        const dayEvents = events.filter((e) => e.date === formattedDate);
        const isToday = isSameDay(day, today);
        const isCurrentMonth = viewMode === 'month' ? isSameMonth(day, displayDate) : true;

        days.push(
          <Card
            key={day.toString()}
            className={`
              relative ${isWeekView ? 'h-32 sm:h-40 lg:h-48' : 'h-16 sm:h-20 md:h-24 lg:h-28'} 
              p-1 sm:p-2 lg:p-3 flex flex-col justify-between 
              transition-all duration-200 hover:shadow-sm cursor-pointer
              border hover:border-emerald-200
              ${!isCurrentMonth 
                ? "bg-gray-50/50 dark:bg-gray-900 opacity-50 text-gray-400 border-transparent" 
                : "bg-white dark:bg-gray-800 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/30 border-gray-100 dark:border-gray-700"
              }
              ${isToday 
                ? "border-emerald-300 bg-emerald-50/80 dark:bg-emerald-950/50 shadow-sm" 
                : ""
              }
            `}
            onClick={() => openDayModal(dayEvents, day)}
          >
            <div className={`
              text-xs sm:text-sm font-medium flex items-center justify-between
              ${isToday ? "text-emerald-700 dark:text-emerald-300 font-semibold" : isCurrentMonth ? "text-gray-700 dark:text-gray-300" : ""}
            `}>
              <span>{format(day, "d")}</span>
              {isToday && <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>}
              {dayEvents.length > 0 && (
                <div className="text-xs bg-emerald-500 text-white rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center">
                  {dayEvents.length}
                </div>
              )}
            </div>
            
            <CardContent className="p-0 overflow-hidden flex-1">
              {dayEvents.length > 0 && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="text-xs sm:text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      {dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Click to view
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );

        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-1 sm:gap-2">
          {days}
        </div>
      );
      
      // For week view, we only want one row
      if (isWeekView) break;
    }
    return rows;
  };

  const getDisplayTitle = () => {
    if (viewMode === 'month') {
      return format(displayDate, "MMMM yyyy");
    } else {
      const weekStart = startOfWeek(currentMonth);
      const weekEnd = endOfWeek(currentMonth);
      if (isSameMonth(weekStart, weekEnd)) {
        return format(weekStart, "MMMM yyyy");
      } else {
        return `${format(weekStart, "MMMM")} - ${format(weekEnd, "MMMM yyyy")}`;
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto p-2 sm:p-4 lg:p-8">
        
        {/* Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white">
                  Health Events Calendar
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                  Track your wellness journey
                </p>
              </div>
            </div>
            
            <div className="flex gap-2 self-start sm:self-auto">
              {/* View Toggle */}
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode('month')}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                    viewMode === 'month'
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  Month
                </button>
                <button
                  onClick={() => setViewMode('week')}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                    viewMode === 'week'
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  Week
                </button>
              </div>
              
              <button
                onClick={goToToday}
                className="
                  px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium
                  bg-emerald-600 text-white rounded-lg
                  hover:bg-emerald-700 transition-colors
                "
              >
                Today
              </button>
            </div>
          </div>

          {/* Period Navigation */}
          <div className="flex items-center justify-between sm:justify-center gap-4 sm:gap-8">
            <button
              onClick={previousPeriod}
              className="
                p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800
                text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200
                transition-colors
              "
              aria-label={`Previous ${viewMode}`}
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            
            <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 dark:text-white">
              {getDisplayTitle()}
            </h2>
            
            <button
              onClick={nextPeriod}
              className="
                p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800
                text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200
                transition-colors
              "
              aria-label={`Next ${viewMode}`}
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Calendar Container */}
        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-2 sm:p-4 lg:p-6">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-0.5 sm:gap-1 lg:gap-2 mb-2 sm:mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="
                  text-center font-medium py-2 sm:py-3
                  text-gray-600 dark:text-gray-400 text-xs sm:text-sm
                "
              >
                <span className="hidden xs:inline sm:hidden">{day.slice(0, 2)}</span>
                <span className="xs:hidden sm:inline">{day}</span>
                <span className="sm:hidden">{day.charAt(0)}</span>
              </div>
            ))}
          </div>
          
          {/* Calendar Grid */}
          <div className="space-y-0.5 sm:space-y-1 lg:space-y-2">
            {renderCalendarGrid()}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-4 sm:mt-6 lg:mt-8">
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1 sm:gap-2">
            <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-500 fill-current" />
            Stay healthy, stay happy
          </p>
        </div>
      </div>

      {/* Single Event Modal */}
      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-sm w-full mx-4 transform transition-all">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Event Details
                  </h3>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title
                  </label>
                  <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    {selectedEvent.title}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date
                  </label>
                  <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    {new Date(selectedEvent.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Day Events Modal */}
      {isDayModalOpen && selectedDayEvents.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4 max-h-96 flex flex-col">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Daily Events
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedDayEvents.length} event{selectedDayEvents.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeDayModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                {selectedDayEvents.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => {
                      closeDayModal();
                      openModal(event);
                    }}
                    className="
                      p-3 rounded-lg border border-emerald-200 dark:border-emerald-800
                      bg-emerald-50 dark:bg-emerald-900/30 cursor-pointer
                      hover:bg-emerald-100 dark:hover:bg-emerald-800/50
                      transition-colors duration-150
                    "
                  >
                    <h4 className="font-medium text-emerald-800 dark:text-emerald-200">
                      {event.title}
                    </h4>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={closeDayModal}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}