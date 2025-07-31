import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import FormField from "@/components/molecules/FormField";
import Modal from "@/components/molecules/Modal";
import ConfirmDialog from "@/components/molecules/ConfirmDialog";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { projectService } from "@/services/api/projectService";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Active",
    color: "#3b82f6"
  });

  const statusOptions = [
    { value: "Active", label: "Active", variant: "active" },
    { value: "On-Hold", label: "On-Hold", variant: "onhold" },
    { value: "Completed", label: "Completed", variant: "completed" }
  ];

  const colorOptions = [
    "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", 
    "#06b6d4", "#84cc16", "#f97316", "#ec4899", "#6b7280"
  ];

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await projectService.getAll();
      setProjects(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await projectService.update(editingProject.Id, formData);
        toast.success("Project updated successfully!");
      } else {
        await projectService.create(formData);
        toast.success("Project created successfully!");
      }

      setShowModal(false);
      setEditingProject(null);
      setFormData({ name: "", description: "", status: "Active", color: "#3b82f6" });
      loadProjects();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      status: project.status,
      color: project.color
    });
    setShowModal(true);
  };

  const handleDelete = async (project) => {
    try {
      await projectService.delete(project.Id);
      toast.success("Project deleted successfully!");
      setDeleteConfirm(null);
      loadProjects();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const openAddModal = () => {
    setEditingProject(null);
    setFormData({ name: "", description: "", status: "Active", color: "#3b82f6" });
    setShowModal(true);
  };

  const getStatusVariant = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.variant : "default";
  };

  if (loading) return <Loading rows={4} />;
  if (error) return <Error message={error} onRetry={loadProjects} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">Manage your active and completed projects</p>
        </div>
        <Button onClick={openAddModal} icon="Plus">
          Add Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <Empty
          icon="FolderOpen"
          title="No projects found"
          message="Create your first project to start organizing your team's work."
          actionLabel="Add Project"
          onAction={openAddModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.Id} className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: project.color }}
                  />
                  <h3 className="font-semibold text-gray-900 text-lg">{project.name}</h3>
                </div>
                <Badge variant={getStatusVariant(project.status)}>
                  {project.status}
                </Badge>
              </div>

              <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                {project.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Created {new Date(project.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Edit"
                    onClick={() => handleEdit(project)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Trash2"
                    onClick={() => setDeleteConfirm(project)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingProject ? "Edit Project" : "Create New Project"}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Project Name" required>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter project name"
              required
            />
          </FormField>

          <FormField label="Description" required>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the project..."
              required
            />
          </FormField>

          <FormField label="Status" required>
            <Select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              required
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Project Color">
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-md border border-gray-300"
                style={{ backgroundColor: formData.color }}
              />
              <div className="grid grid-cols-5 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform duration-200"
                    style={{ backgroundColor: color }}
                    onClick={() => setFormData({ ...formData, color })}
                  />
                ))}
              </div>
            </div>
          </FormField>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingProject ? "Update Project" : "Create Project"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => handleDelete(deleteConfirm)}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteConfirm?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};

export default ProjectsPage;