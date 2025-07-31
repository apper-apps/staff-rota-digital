import projectData from "@/services/mockData/projects.json";

let projects = [...projectData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const projectService = {
  async getAll() {
    await delay(300);
    return [...projects];
  },

  async getById(id) {
    await delay(200);
    const project = projects.find(p => p.Id === parseInt(id));
    if (!project) {
      throw new Error("Project not found");
    }
    return { ...project };
  },

  async create(newProject) {
    await delay(400);
    const maxId = projects.length > 0 ? Math.max(...projects.map(p => p.Id)) : 0;
    const project = {
      Id: maxId + 1,
      ...newProject,
      createdAt: new Date().toISOString()
    };
    projects.push(project);
    return { ...project };
  },

  async update(id, updatedProject) {
    await delay(350);
    const index = projects.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Project not found");
    }
    projects[index] = { ...projects[index], ...updatedProject };
    return { ...projects[index] };
  },

  async delete(id) {
    await delay(250);
    const index = projects.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Project not found");
    }
    projects.splice(index, 1);
    return true;
  }
};