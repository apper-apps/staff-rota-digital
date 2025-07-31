export const staffWorkdayService = {
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
          { field: { Name: "staffid" }},
          { field: { Name: "date" }},
          { field: { Name: "numberofdaysworked" }},
          { field: { Name: "details" }},
          { field: { Name: "CreatedOn" }}
        ]
      };

      const response = await apperClient.fetchRecords("staffworkday", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching staff workdays:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching staff workdays:", error.message);
        throw error;
      }
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" }},
          { field: { Name: "staffid" }},
          { field: { Name: "date" }},
          { field: { Name: "numberofdaysworked" }},
          { field: { Name: "details" }},
          { field: { Name: "CreatedOn" }}
        ]
      };

      const response = await apperClient.getRecordById("staffworkday", parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching staff workday with ID ${id}:`, error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error fetching staff workday with ID ${id}:`, error.message);
        throw error;
      }
    }
  },

  async getByStaff(staffId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" }},
          { field: { Name: "staffid" }},
          { field: { Name: "date" }},
          { field: { Name: "numberofdaysworked" }},
          { field: { Name: "details" }},
          { field: { Name: "CreatedOn" }}
        ],
        where: [
          {
            FieldName: "staffid",
            Operator: "EqualTo",
            Values: [parseInt(staffId)]
          }
        ]
      };

      const response = await apperClient.fetchRecords("staffworkday", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching staff workdays by staff:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching staff workdays by staff:", error.message);
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
          { field: { Name: "staffid" }},
          { field: { Name: "date" }},
          { field: { Name: "numberofdaysworked" }},
          { field: { Name: "details" }},
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

      const response = await apperClient.fetchRecords("staffworkday", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching staff workdays by date range:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching staff workdays by date range:", error.message);
        throw error;
      }
    }
  },

  async create(newStaffWorkday) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const staffWorkdayData = {
        Name: newStaffWorkday.Name || `Workday-${Date.now()}`,
        staffid: parseInt(newStaffWorkday.staffid),
        date: newStaffWorkday.date,
        numberofdaysworked: parseFloat(newStaffWorkday.numberofdaysworked || 1),
        details: newStaffWorkday.details || ''
      };

      const params = {
        records: [staffWorkdayData]
      };

      const response = await apperClient.createRecord("staffworkday", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to create staff workdays ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating staff workday:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating staff workday:", error.message);
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
      const staffWorkdayData = {
        Id: parseInt(id),
        ...(updateData.Name && { Name: updateData.Name }),
        ...(updateData.staffid && { staffid: parseInt(updateData.staffid) }),
        ...(updateData.date && { date: updateData.date }),
        ...(updateData.numberofdaysworked !== undefined && { numberofdaysworked: parseFloat(updateData.numberofdaysworked) }),
        ...(updateData.details !== undefined && { details: updateData.details })
      };

      const params = {
        records: [staffWorkdayData]
      };

      const response = await apperClient.updateRecord("staffworkday", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to update staff workdays ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error updating staff workday:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating staff workday:", error.message);
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

      const response = await apperClient.deleteRecord("staffworkday", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to delete staff workdays ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error deleting staff workday:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting staff workday:", error.message);
        throw error;
      }
    }
  }
};