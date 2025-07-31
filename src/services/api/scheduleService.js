export const scheduleService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" }},
          { field: { Name: "date" }},
          { field: { Name: "staffId" }},
          { field: { Name: "projectId" }},
          { field: { Name: "CreatedOn" }}
        ]
      };

      const response = await apperClient.fetchRecords("schedule", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching schedules:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching schedules:", error.message);
        throw error;
      }
    }
  },

  async getByDate(date) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" }},
          { field: { Name: "date" }},
          { field: { Name: "staffId" }},
          { field: { Name: "projectId" }},
          { field: { Name: "CreatedOn" }}
        ],
        where: [
          {
            FieldName: "date",
            Operator: "EqualTo",
            Values: [date]
          }
        ]
      };

      const response = await apperClient.fetchRecords("schedule", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching schedules by date:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching schedules by date:", error.message);
        throw error;
      }
    }
  },

  async getByDateRange(startDate, endDate) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" }},
          { field: { Name: "date" }},
          { field: { Name: "staffId" }},
          { field: { Name: "projectId" }},
          { field: { Name: "CreatedOn" }}
        ],
        where: [
          {
            FieldName: "date",
            Operator: "GreaterThanOrEqualTo",
            Values: [startDate]
          },
          {
            FieldName: "date",
            Operator: "LessThanOrEqualTo",
            Values: [endDate]
          }
        ]
      };

      const response = await apperClient.fetchRecords("schedule", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching schedules by date range:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching schedules by date range:", error.message);
        throw error;
      }
    }
  },

  async create(newSchedule) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const scheduleData = {
        Name: newSchedule.Name || `Schedule-${Date.now()}`,
        date: newSchedule.date,
        staffId: parseInt(newSchedule.staffId),
        projectId: parseInt(newSchedule.projectId),
        createdAt: new Date().toISOString()
      };

      const params = {
        records: [scheduleData]
      };

      const response = await apperClient.createRecord("schedule", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to create schedules ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating schedule:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating schedule:", error.message);
        throw error;
      }
    }
  },

  async createBatch(newSchedules) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields for each schedule
      const schedulesData = newSchedules.map(schedule => ({
        Name: schedule.Name || `Schedule-${Date.now()}`,
        date: schedule.date,
        staffId: parseInt(schedule.staffId),
        projectId: parseInt(schedule.projectId),
        createdAt: new Date().toISOString()
      }));

      const params = {
        records: schedulesData
      };

      const response = await apperClient.createRecord("schedule", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to create schedules ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords.map(result => result.data);
      }

      return [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating batch schedules:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating batch schedules:", error.message);
        throw error;
      }
    }
  },

  async update(id, updateData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const scheduleData = {
        Id: parseInt(id),
        ...(updateData.Name && { Name: updateData.Name }),
        ...(updateData.date && { date: updateData.date }),
        ...(updateData.staffId && { staffId: parseInt(updateData.staffId) }),
        ...(updateData.projectId && { projectId: parseInt(updateData.projectId) })
      };

      const params = {
        records: [scheduleData]
      };

      const response = await apperClient.updateRecord("schedule", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to update schedules ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating schedule:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating schedule:", error.message);
        throw error;
      }
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord("schedule", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to delete schedules ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords.length > 0;
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting schedule:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting schedule:", error.message);
        throw error;
      }
    }
  },

  async deleteByDate(date) {
    try {
      // First get all schedules for the date
      const schedulesToDelete = await this.getByDate(date);
      
      if (schedulesToDelete.length === 0) {
        return true;
      }

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: schedulesToDelete.map(s => parseInt(s.Id))
      };

      const response = await apperClient.deleteRecord("schedule", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to delete schedules by date ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords.length === schedulesToDelete.length;
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting schedules by date:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting schedules by date:", error.message);
        throw error;
      }
    }
  }
};