export const staffService = {
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
          { field: { Name: "role" }},
          { field: { Name: "dailyRate" }},
          { field: { Name: "CreatedOn" }}
        ]
      };

      const response = await apperClient.fetchRecords("staff", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching staff:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching staff:", error.message);
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
          { field: { Name: "role" }},
          { field: { Name: "dailyRate" }},
          { field: { Name: "CreatedOn" }}
        ]
      };

      const response = await apperClient.getRecordById("staff", parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching staff member with ID ${id}:`, error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error fetching staff member with ID ${id}:`, error.message);
        throw error;
      }
    }
  },

  async create(newStaff) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const staffData = {
        Name: newStaff.Name,
        role: newStaff.role,
        dailyRate: parseFloat(newStaff.dailyRate),
        createdAt: new Date().toISOString()
      };

      const params = {
        records: [staffData]
      };

      const response = await apperClient.createRecord("staff", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to create staff ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating staff member:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating staff member:", error.message);
        throw error;
      }
    }
  },

  async update(id, updatedStaff) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const staffData = {
        Id: parseInt(id),
        Name: updatedStaff.Name,
        role: updatedStaff.role,
        dailyRate: parseFloat(updatedStaff.dailyRate)
      };

      const params = {
        records: [staffData]
      };

      const response = await apperClient.updateRecord("staff", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to update staff ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error updating staff member:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating staff member:", error.message);
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

      const response = await apperClient.deleteRecord("staff", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to delete staff ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error deleting staff member:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting staff member:", error.message);
        throw error;
      }
    }
  }
};