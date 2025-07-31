import React, { useState, useEffect } from 'react';
import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { jobCostService } from '@/services/api/jobCostService';
import { staffWorkdayService } from '@/services/api/staffWorkdayService';
import { projectService } from '@/services/api/projectService';
import { staffService } from '@/services/api/staffService';
import { scheduleService } from '@/services/api/scheduleService';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);
  const [staff, setStaff] = useState([]);
  const [jobCosts, setJobCosts] = useState([]);
  const [staffWorkdays, setStaffWorkdays] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedProject, setSelectedProject] = useState('all');

  useEffect(() => {
    loadDashboardData();
  }, [selectedPeriod]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [projectsData, staffData, jobCostsData, staffWorkdaysData, schedulesData] = await Promise.all([
        projectService.getAll(),
        staffService.getAll(),
        jobCostService.getAll(),
        staffWorkdayService.getAll(),
        scheduleService.getAll()
      ]);

      setProjects(projectsData);
      setStaff(staffData);
      setJobCosts(jobCostsData);
      setStaffWorkdays(staffWorkdaysData);
      setSchedules(schedulesData);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err.message);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const calculateProjectCosts = () => {
    const projectCostMap = new Map();
    
    // Initialize with projects
    projects.forEach(project => {
      projectCostMap.set(project.Id, {
        project,
        directCosts: 0,
        staffCosts: 0,
        totalDays: 0,
        staffCount: 0
      });
    });

    // Add direct job costs
    jobCosts.forEach(cost => {
      if (cost.projectid?.Id) {
        const existing = projectCostMap.get(cost.projectid.Id);
        if (existing) {
          existing.directCosts += parseFloat(cost.cost || 0);
        }
      }
    });

    // Calculate staff costs from schedules
    schedules.forEach(schedule => {
      if (schedule.projectId?.Id && schedule.staffId?.Id) {
        const existing = projectCostMap.get(schedule.projectId.Id);
        const staffMember = staff.find(s => s.Id === schedule.staffId.Id);
        
        if (existing && staffMember) {
          existing.staffCosts += parseFloat(staffMember.dailyRate || 0);
          existing.totalDays += 1;
          existing.staffCount += 1;
        }
      }
    });

    return Array.from(projectCostMap.values()).filter(item => 
      selectedProject === 'all' || item.project.Id === parseInt(selectedProject)
    );
  };

  const calculateStaffMetrics = () => {
    const staffMetricsMap = new Map();
    
    // Initialize with staff
    staff.forEach(staffMember => {
      staffMetricsMap.set(staffMember.Id, {
        staff: staffMember,
        totalDays: 0,
        totalEarnings: 0,
        projectsWorked: new Set(),
        workdays: []
      });
    });

    // Add scheduled days
    schedules.forEach(schedule => {
      if (schedule.staffId?.Id) {
        const existing = staffMetricsMap.get(schedule.staffId.Id);
        if (existing) {
          existing.totalDays += 1;
          existing.totalEarnings += parseFloat(existing.staff.dailyRate || 0);
          if (schedule.projectId?.Id) {
            existing.projectsWorked.add(schedule.projectId.Id);
          }
        }
      }
    });

    // Add staff workdays
    staffWorkdays.forEach(workday => {
      if (workday.staffid?.Id) {
        const existing = staffMetricsMap.get(workday.staffid.Id);
        if (existing) {
          existing.workdays.push(workday);
          existing.totalDays += parseFloat(workday.numberofdaysworked || 0);
        }
      }
    });

    return Array.from(staffMetricsMap.values());
  };

  const getTotalProjectCost = () => {
    return calculateProjectCosts().reduce((total, project) => 
      total + project.directCosts + project.staffCosts, 0
    );
  };

  const getTotalStaffCosts = () => {
    return calculateStaffMetrics().reduce((total, staff) => 
      total + staff.totalEarnings, 0
    );
  };

  const getTopCostlyProjects = () => {
    return calculateProjectCosts()
      .sort((a, b) => (b.directCosts + b.staffCosts) - (a.directCosts + a.staffCosts))
      .slice(0, 5);
  };

  const getMostActiveStaff = () => {
    return calculateStaffMetrics()
      .sort((a, b) => b.totalDays - a.totalDays)
      .slice(0, 5);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  const projectCosts = calculateProjectCosts();
  const staffMetrics = calculateStaffMetrics();
  const totalProjectCost = getTotalProjectCost();
  const totalStaffCosts = getTotalStaffCosts();
  const topProjects = getTopCostlyProjects();
  const activeStaff = getMostActiveStaff();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Project costs and staff utilization overview</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="input-field"
          >
            <option value="all">All Projects</option>
            {projects.map(project => (
              <option key={project.Id} value={project.Id}>
                {project.Name}
              </option>
            ))}
          </select>
          
          <Button onClick={loadDashboardData} variant="secondary">
            <ApperIcon name="RefreshCw" size={16} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Project Costs</p>
              <p className="text-2xl font-bold text-gray-900">
                £{totalProjectCost.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="DollarSign" size={24} className="text-primary-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Staff Costs</p>
              <p className="text-2xl font-bold text-gray-900">
                £{totalStaffCosts.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" size={24} className="text-accent-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Projects</p>
              <p className="text-2xl font-bold text-gray-900">
                {projects.filter(p => p.status === 'Active').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="FolderOpen" size={24} className="text-secondary-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Staff</p>
              <p className="text-2xl font-bold text-gray-900">
                {staff.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="UserCheck" size={24} className="text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Project Cost Breakdown */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Project Cost Breakdown</h2>
          <ApperIcon name="BarChart3" size={20} className="text-gray-600" />
        </div>
        
        {projectCosts.length === 0 ? (
          <Empty message="No project cost data available" />
        ) : (
          <div className="space-y-4">
            {projectCosts.map(({ project, directCosts, staffCosts, totalDays, staffCount }) => {
              const totalCost = directCosts + staffCosts;
              const maxCost = Math.max(...projectCosts.map(p => p.directCosts + p.staffCosts));
              const percentage = maxCost > 0 ? (totalCost / maxCost) * 100 : 0;
              
              return (
                <div key={project.Id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: project.color || '#3b82f6' }}
                      ></div>
                      <span className="font-medium text-gray-900">{project.Name}</span>
                      <span className="text-sm text-gray-500">
                        ({totalDays} days, {staffCount} assignments)
                      </span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      £{totalCost.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Direct: £{directCosts.toLocaleString()}</span>
                    <span>Staff: £{staffCosts.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Staff Breakdown */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Staff Utilization</h2>
          <ApperIcon name="Users" size={20} className="text-gray-600" />
        </div>
        
        {staffMetrics.length === 0 ? (
          <Empty message="No staff utilization data available" />
        ) : (
          <div className="space-y-4">
            {staffMetrics.map(({ staff: staffMember, totalDays, totalEarnings, projectsWorked }) => {
              const maxDays = Math.max(...staffMetrics.map(s => s.totalDays));
              const percentage = maxDays > 0 ? (totalDays / maxDays) * 100 : 0;
              
              return (
                <div key={staffMember.Id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {staffMember.Name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">{staffMember.Name}</span>
                        <div className="text-sm text-gray-500">
                          {staffMember.role} • £{staffMember.dailyRate}/day
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        {totalDays} days
                      </div>
                      <div className="text-sm text-gray-600">
                        £{totalEarnings.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-accent-500 to-secondary-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    Working on {projectsWorked.size} project{projectsWorked.size !== 1 ? 's' : ''}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;