import React, { useState, useEffect } from "react";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  addWeeks,
  subWeeks,
  startOfDay
} from "date-fns";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Modal from "@/components/molecules/Modal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { scheduleService } from "@/services/api/scheduleService";
import { staffService } from "@/services/api/staffService";
import { projectService } from "@/services/api/projectService";

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month"); // "month" or "week"
  const [schedules, setSchedules] = useState([]);
  const [staff, setStaff] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
const [selectedStaffIds, setSelectedStaffIds] = useState([]);
  const [staffProjectMap, setStaffProjectMap] = useState({});
  const [draggedSchedule, setDraggedSchedule] = useState(null);
  const [dragOverDate, setDragOverDate] = useState(null);

  useEffect(() => {
    loadData();
  }, [currentDate, viewMode]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Load staff and projects
      const [staffData, projectsData] = await Promise.all([
        staffService.getAll(),
        projectService.getAll()
      ]);
      
      setStaff(staffData);
      setProjects(projectsData);

      // Load schedules for the current view
      const dateRange = getDateRange();
      const schedulesData = await scheduleService.getByDateRange(
        format(dateRange.start, "yyyy-MM-dd"),
        format(dateRange.end, "yyyy-MM-dd")
      );
      
      setSchedules(schedulesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getDateRange = () => {
    if (viewMode === "week") {
      return {
        start: startOfWeek(currentDate),
        end: endOfWeek(currentDate)
      };
    } else {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      return {
        start: startOfWeek(monthStart),
        end: endOfWeek(monthEnd)
      };
    }
  };

  const getDaysToRender = () => {
    const { start, end } = getDateRange();
    return eachDayOfInterval({ start, end });
  };

  const getSchedulesForDate = (date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return schedules.filter(s => s.date === dateStr);
  };

  const getDailyCost = (date) => {
    const daySchedules = getSchedulesForDate(date);
    return daySchedules.reduce((total, schedule) => {
      const staffMember = staff.find(s => s.Id === schedule.staffId);
      return total + (staffMember ? staffMember.dailyRate : 0);
    }, 0);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setSelectedStaffIds([]);
    setStaffProjectMap({});
    setShowScheduleModal(true);
  };

  const handleStaffSelect = (staffId, isSelected) => {
    if (isSelected) {
      setSelectedStaffIds(prev => [...prev, staffId]);
      // Set default project if available
      if (projects.length > 0) {
        setStaffProjectMap(prev => ({
          ...prev,
          [staffId]: projects[0].Id
        }));
      }
    } else {
      setSelectedStaffIds(prev => prev.filter(id => id !== staffId));
      setStaffProjectMap(prev => {
        const newMap = { ...prev };
        delete newMap[staffId];
        return newMap;
      });
    }
  };

  const handleProjectSelect = (staffId, projectId) => {
    setStaffProjectMap(prev => ({
      ...prev,
      [staffId]: parseInt(projectId)
    }));
  };

  const handleScheduleSubmit = async () => {
    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      
      // Clear existing schedules for this date
      await scheduleService.deleteByDate(dateStr);
      
      // Create new schedules
      const newSchedules = selectedStaffIds.map(staffId => ({
        date: dateStr,
        staffId: parseInt(staffId),
        projectId: staffProjectMap[staffId] || (projects.length > 0 ? projects[0].Id : null)
      }));

      if (newSchedules.length > 0) {
        await scheduleService.createBatch(newSchedules);
        toast.success("Schedule updated successfully!");
      } else {
        toast.success("Schedule cleared successfully!");
      }

      setShowScheduleModal(false);
      loadData();
    } catch (err) {
      toast.error(err.message);
    }
  };
const handleRemoveSchedule = async (scheduleId) => {
    try {
      await scheduleService.delete(scheduleId);
      await loadData();
      toast.success("Staff member removed from schedule");
    } catch (error) {
      console.error("Error removing schedule:", error);
      toast.error("Failed to remove staff member from schedule");
    }
  };

  const handleDragStart = (e, schedule) => {
    setDraggedSchedule(schedule);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedSchedule(null);
    setDragOverDate(null);
  };

  const handleDragOver = (e, date) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverDate(format(date, 'yyyy-MM-dd'));
  };

  const handleDragLeave = () => {
    setDragOverDate(null);
  };

  const handleDrop = async (e, targetDate) => {
    e.preventDefault();
    if (!draggedSchedule) return;

    const targetDateStr = format(targetDate, 'yyyy-MM-dd');
    if (draggedSchedule.date === targetDateStr) {
      setDraggedSchedule(null);
      setDragOverDate(null);
      return;
    }

    try {
      await scheduleService.update(draggedSchedule.Id, {
        ...draggedSchedule,
        date: targetDateStr
      });
      await loadData();
      toast.success("Staff member moved to new date");
    } catch (error) {
      console.error("Error moving schedule:", error);
      toast.error("Failed to move staff member");
    }

    setDraggedSchedule(null);
    setDragOverDate(null);
  };

  const navigatePrevious = () => {
    if (viewMode === "week") {
      setCurrentDate(subWeeks(currentDate, 1));
    } else {
      setCurrentDate(subMonths(currentDate, 1));
    }
  };

  const navigateNext = () => {
    if (viewMode === "week") {
      setCurrentDate(addWeeks(currentDate, 1));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };
  if (loading) return <Loading rows={4} />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const days = getDaysToRender();
  const today = new Date();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {viewMode === "week" ? "Weekly Schedule" : "Monthly Calendar"}
          </h1>
          <p className="text-gray-600 mt-1">
            {format(currentDate, viewMode === "week" ? "MMMM d, yyyy" : "MMMM yyyy")}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === "month" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("month")}
              className="px-3 py-1.5"
            >
              Month
            </Button>
            <Button
              variant={viewMode === "week" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("week")}
              className="px-3 py-1.5"
            >
              Week
            </Button>
          </div>
          
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" icon="ChevronLeft" onClick={navigatePrevious} />
            <Button variant="ghost" size="sm" onClick={goToToday}>Today</Button>
            <Button variant="ghost" size="sm" icon="ChevronRight" onClick={navigateNext} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Calendar Header */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="px-4 py-3 text-center text-sm font-medium text-gray-700">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {days.map((date, index) => {
            const daySchedules = getSchedulesForDate(date);
            const dailyCost = getDailyCost(date);
            const isToday = isSameDay(date, today);
            const isCurrentMonth = viewMode === "week" || isSameMonth(date, currentDate);

            return (
<div
                key={index}
                className={`min-h-[120px] p-3 border-r border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
                  !isCurrentMonth ? "bg-gray-50/50 text-gray-400" : ""
                } ${dragOverDate === format(date, 'yyyy-MM-dd') ? 'bg-blue-50 border-blue-300 border-2 drop-zone-active' : ''}`}
                onClick={() => handleDateClick(date)}
                onDragOver={(e) => handleDragOver(e, date)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, date)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-sm font-medium ${
                      isToday
                        ? "bg-primary-600 text-white w-6 h-6 rounded-full flex items-center justify-center"
                        : isCurrentMonth
                        ? "text-gray-900"
                        : "text-gray-400"
                    }`}
                  >
                    {format(date, "d")}
                  </span>
                  {dailyCost > 0 && (
                    <Badge variant="info" className="text-xs px-2 py-0.5">
                      ${dailyCost.toLocaleString()}
                    </Badge>
                  )}
                </div>

                <div className="space-y-1">
                  {daySchedules.map((schedule) => {
                    const staffMember = staff.find(s => s.Id === schedule.staffId);
                    const project = projects.find(p => p.Id === schedule.projectId);
                    
                    return (
<div
                        key={schedule.Id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, schedule)}
                        onDragEnd={handleDragEnd}
                        className="text-xs p-1.5 rounded text-white font-medium truncate cursor-move relative group draggable-schedule hover:shadow-lg transition-all duration-200"
                        style={{ backgroundColor: project?.color || "#6b7280" }}
                        title={`${staffMember?.name || "Unknown"} - ${project?.name || "No Project"}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="truncate">{staffMember?.name || "Unknown"}</div>
                            {project && (
                              <div className="truncate opacity-90">{project.name}</div>
                            )}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveSchedule(schedule.Id);
                            }}
                            className="ml-1 opacity-0 group-hover:opacity-100 hover:bg-white hover:bg-opacity-20 rounded p-0.5 transition-all duration-200"
                            title="Remove from schedule"
                          >
                            <ApperIcon name="X" size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Schedule Modal */}
      <Modal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        title={`Schedule for ${selectedDate ? format(selectedDate, "EEEE, MMMM d, yyyy") : ""}`}
        size="lg"
      >
        <div className="space-y-6">
          {staff.length === 0 ? (
            <Empty
              icon="Users"
              title="No staff members available"
              message="Add staff members to start scheduling."
            />
          ) : (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Select Staff Members</h3>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {staff.map((member) => {
                  const isSelected = selectedStaffIds.includes(member.Id);
                  
                  return (
                    <div key={member.Id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleStaffSelect(member.Id, e.target.checked)}
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{member.name}</div>
                          <div className="text-sm text-gray-500">{member.role} • ${member.dailyRate}/day</div>
                        </div>
                      </div>
                      
                      {isSelected && projects.length > 0 && (
                        <select
                          className="ml-4 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                          value={staffProjectMap[member.Id] || ""}
                          onChange={(e) => handleProjectSelect(member.Id, e.target.value)}
                        >
                          {projects.filter(p => p.status === "Active").map((project) => (
                            <option key={project.Id} value={project.Id}>
                              {project.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  );
                })}
              </div>

              {selectedStaffIds.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-blue-800">
                    <ApperIcon name="Calculator" size={16} />
                    <span className="font-medium">
                      Daily Total: ${selectedStaffIds.reduce((total, staffId) => {
                        const member = staff.find(s => s.Id === staffId);
                        return total + (member ? member.dailyRate : 0);
                      }, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <Button variant="secondary" onClick={() => setShowScheduleModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleScheduleSubmit}>
              Update Schedule
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CalendarPage;