import { useEffect, useState } from "react";
import { 
  Ban, 
  CheckCircle, 
  Trash2, 
  Undo2, 
  User, 
  Search, 
  Mail,
  Phone,
  Calendar,
  Shield,
  RefreshCw,
  Eye,
  Edit,
  X
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const API_URL = "http://localhost:4000/users";

  // Load users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const data = await response.json();
      setUsers(data);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || user.status === selectedStatus;
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesStatus && matchesRole;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  // User actions - FIXED
  const handleBlock = async (id) => {
    try {
      const user = users.find((u) => u.id === id);
      const updatedUser = { ...user, status: "blocked" };

      await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      setUsers(users.map((u) => (u.id === id ? updatedUser : u)));
      toast.success("User blocked successfully!");
    } catch {
      toast.error("Failed to block user");
    }
  };

  const handleUnblock = async (id) => {
    try {
      const user = users.find((u) => u.id === id);
      const updatedUser = { ...user, status: "active" };

      await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      setUsers(users.map((u) => (u.id === id ? updatedUser : u)));
      toast.success("User unblocked successfully!");
    } catch {
      toast.error("Failed to unblock user");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });
      setUsers(prev => prev.filter(u => u.id !== id));
      toast.success("User deleted successfully!");
    } catch {
      toast.error("Failed to delete user");
    }
  };

  // Role management - NEW
  const handleChangeRole = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    
    try {
      const user = users.find((u) => u.id === id);
      const updatedUser = { ...user, role: newRole };

      await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      setUsers(users.map((u) => (u.id === id ? updatedUser : u)));
      toast.success(`User role changed to ${newRole}!`);
    } catch {
      toast.error("Failed to change user role");
    }
  };

  const handleView = (user) => {
    setSelectedUser(user);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 border border-green-200";
      case "blocked": return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "inactive": return "bg-red-100 text-red-800 border border-red-200";
      default: return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin": return "bg-purple-100 text-purple-800 border border-purple-200";
      case "user": return "bg-blue-100 text-blue-800 border border-blue-200";
      default: return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active": return <CheckCircle className="text-green-500" size={16} />;
      case "blocked": return <Ban className="text-yellow-500" size={16} />;
      case "inactive": return <Trash2 className="text-red-500" size={16} />;
      default: return <User className="text-gray-500" size={16} />;
    }
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus, selectedRole]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="bg-gray-200 h-24 rounded-xl"></div>)}
          </div>
          <div className="bg-gray-200 h-64 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>
        <button 
          onClick={fetchUsers}
          className="mt-4 lg:mt-0 flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <RefreshCw size={20} />
          Refresh Data
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: users.length, color: "text-gray-900" },
          { label: "Active", value: users.filter(u => u.status === 'active').length, color: "text-green-600" },
          { label: "Blocked", value: users.filter(u => u.status === 'blocked').length, color: "text-yellow-600" },
          { label: "Admins", value: users.filter(u => u.role === 'admin').length, color: "text-purple-600" }
        ].map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
              <option value="inactive">Inactive</option>
            </select>

            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-white"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>

            <button 
              onClick={fetchUsers}
              className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-gray-900 font-semibold">User</th>
                <th className="px-6 py-4 text-left text-gray-900 font-semibold">Contact</th>
                <th className="px-6 py-4 text-left text-gray-900 font-semibold">Role</th>
                <th className="px-6 py-4 text-left text-gray-900 font-semibold">Status</th>
                <th className="px-6 py-4 text-right text-gray-900 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{user.name}</div>
                        <div className="text-gray-500 text-sm">
                          Joined {new Date(user.memberSince || user.createdAt || Date.now()).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-800">{user.email}</div>
                    <div className="text-gray-500 text-sm">{user.phone || "No phone"}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getRoleColor(user.role)}`}>
                      {user.role || "user"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(user.status)}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(user.status)}`}>
                        {user.status || "active"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleView(user)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>

                      {/* Role Toggle */}
                      <button 
                        onClick={() => handleChangeRole(user.id, user.role)}
                        className={`p-2 rounded-lg transition-colors ${
                          user.role === 'admin' 
                            ? 'text-purple-600 hover:bg-purple-50' 
                            : 'text-blue-600 hover:bg-blue-50'
                        }`}
                        title={user.role === 'admin' ? 'Make User' : 'Make Admin'}
                      >
                        <Shield size={16} />
                      </button>

                      {/* Block/Unblock */}
                      {user.status === "blocked" ? (
                        <button
                          onClick={() => handleUnblock(user.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Unblock User"
                        >
                          <Undo2 size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBlock(user.id)}
                          className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                          title="Block User"
                        >
                          <Ban size={16} />
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <User className="mx-auto text-gray-300 mb-4" size={48} />
            <div className="text-gray-500 text-lg">No users found</div>
            <div className="text-gray-400 mt-2">
              {searchTerm ? "Try adjusting your search terms" : "No users in the system"}
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages} • {filteredUsers.length} users
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-100 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-100 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">User Details</h2>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                  {selectedUser.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{selectedUser.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(selectedUser.status)}`}>
                    {selectedUser.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail size={16} />
                    <span className="font-medium">Email:</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone size={16} />
                    <span className="font-medium">Phone:</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Shield size={16} />
                    <span className="font-medium">Role:</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={16} />
                    <span className="font-medium">Joined:</span>
                  </div>
                </div>
                <div className="space-y-3 text-gray-800">
                  <div>{selectedUser.email}</div>
                  <div>{selectedUser.phone || "Not provided"}</div>
                  <div className="capitalize">{selectedUser.role || "user"}</div>
                  <div>{new Date(selectedUser.memberSince || selectedUser.createdAt || Date.now()).toLocaleDateString()}</div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}