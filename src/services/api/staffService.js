import staffData from "@/services/mockData/staff.json";

let staff = [...staffData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const staffService = {
  async getAll() {
    await delay(300);
    return [...staff];
  },

  async getById(id) {
    await delay(200);
    const staffMember = staff.find(s => s.Id === parseInt(id));
    if (!staffMember) {
      throw new Error("Staff member not found");
    }
    return { ...staffMember };
  },

  async create(newStaff) {
    await delay(400);
    const maxId = staff.length > 0 ? Math.max(...staff.map(s => s.Id)) : 0;
    const staffMember = {
      Id: maxId + 1,
      ...newStaff,
      createdAt: new Date().toISOString()
    };
    staff.push(staffMember);
    return { ...staffMember };
  },

  async update(id, updatedStaff) {
    await delay(350);
    const index = staff.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Staff member not found");
    }
    staff[index] = { ...staff[index], ...updatedStaff };
    return { ...staff[index] };
  },

  async delete(id) {
    await delay(250);
    const index = staff.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Staff member not found");
    }
    staff.splice(index, 1);
    return true;
  }
};