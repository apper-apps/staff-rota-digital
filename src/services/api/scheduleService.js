import scheduleData from "@/services/mockData/schedules.json";

let schedules = [...scheduleData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const scheduleService = {
  async getAll() {
    await delay(300);
    return [...schedules];
  },

  async getByDate(date) {
    await delay(200);
    return schedules.filter(s => s.date === date);
  },

  async getByDateRange(startDate, endDate) {
    await delay(250);
    return schedules.filter(s => s.date >= startDate && s.date <= endDate);
  },

  async create(newSchedule) {
    await delay(400);
    const maxId = schedules.length > 0 ? Math.max(...schedules.map(s => s.Id)) : 0;
    const schedule = {
      Id: maxId + 1,
      ...newSchedule,
      createdAt: new Date().toISOString()
    };
    schedules.push(schedule);
    return { ...schedule };
  },

  async createBatch(newSchedules) {
    await delay(500);
    const results = [];
    let maxId = schedules.length > 0 ? Math.max(...schedules.map(s => s.Id)) : 0;
    
    for (const schedule of newSchedules) {
      maxId += 1;
      const newSchedule = {
        Id: maxId,
        ...schedule,
        createdAt: new Date().toISOString()
      };
      schedules.push(newSchedule);
      results.push({ ...newSchedule });
    }
    
    return results;
  },

async update(id, updateData) {
    await delay(300);
    const index = schedules.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Schedule not found");
    }
    schedules[index] = {
      ...schedules[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    return { ...schedules[index] };
  },

  async delete(id) {
    await delay(250);
    const index = schedules.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Schedule not found");
    }
    schedules.splice(index, 1);
    return true;
  },

  async deleteByDate(date) {
    await delay(300);
    schedules = schedules.filter(s => s.date !== date);
    return true;
  }
};