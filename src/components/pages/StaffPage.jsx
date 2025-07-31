import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import FormField from "@/components/molecules/FormField";
import Modal from "@/components/molecules/Modal";
import ConfirmDialog from "@/components/molecules/ConfirmDialog";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { staffService } from "@/services/api/staffService";

const StaffPage = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    dailyRate: ""
  });

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await staffService.getAll();
      setStaff(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const staffData = {
        ...formData,
        dailyRate: parseFloat(formData.dailyRate)
      };

      if (editingStaff) {
        await staffService.update(editingStaff.Id, staffData);
        toast.success("Staff member updated successfully!");
      } else {
        await staffService.create(staffData);
        toast.success("Staff member added successfully!");
      }

      setShowModal(false);
      setEditingStaff(null);
      setFormData({ name: "", role: "", dailyRate: "" });
      loadStaff();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEdit = (staffMember) => {
    setEditingStaff(staffMember);
    setFormData({
      name: staffMember.name,
      role: staffMember.role,
      dailyRate: staffMember.dailyRate.toString()
    });
    setShowModal(true);
  };

  const handleDelete = async (staffMember) => {
    try {
      await staffService.delete(staffMember.Id);
      toast.success("Staff member deleted successfully!");
      setDeleteConfirm(null);
      loadStaff();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const openAddModal = () => {
    setEditingStaff(null);
    setFormData({ name: "", role: "", dailyRate: "" });
    setShowModal(true);
  };

  if (loading) return <Loading rows={5} />;
  if (error) return <Error message={error} onRetry={loadStaff} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600 mt-1">Manage your team members and their daily rates</p>
        </div>
        <Button onClick={openAddModal} icon="Plus">
          Add Staff Member
        </Button>
      </div>

      {staff.length === 0 ? (
        <Empty
          icon="Users"
          title="No staff members found"
          message="Add your first team member to start scheduling and cost tracking."
          actionLabel="Add Staff Member"
          onAction={openAddModal}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name & Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Daily Rate
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {staff.map((member) => (
                  <tr key={member.Id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {member.name.split(" ").map(n => n[0]).join("")}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{member.name}</div>
                          <div className="text-sm text-gray-500">{member.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        ${member.dailyRate.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">per day</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Edit"
                          onClick={() => handleEdit(member)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Trash2"
                          onClick={() => setDeleteConfirm(member)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingStaff ? "Edit Staff Member" : "Add New Staff Member"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Full Name" required>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter full name"
              required
            />
          </FormField>

          <FormField label="Role" required>
            <Input
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="e.g., Senior Developer, Project Manager"
              required
            />
          </FormField>

          <FormField label="Daily Rate ($)" required>
            <Input
              type="number"
              value={formData.dailyRate}
              onChange={(e) => setFormData({ ...formData, dailyRate: e.target.value })}
              placeholder="Enter daily rate"
              min="0"
              step="0.01"
              required
            />
          </FormField>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingStaff ? "Update Staff Member" : "Add Staff Member"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => handleDelete(deleteConfirm)}
        title="Delete Staff Member"
        message={`Are you sure you want to delete ${deleteConfirm?.name}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};

export default StaffPage;