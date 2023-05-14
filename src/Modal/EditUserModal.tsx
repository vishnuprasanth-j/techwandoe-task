import { useState } from "react";

interface User {
  id: number;
  name: string;
  lastLogin: string;
  role: 'admin' | 'sales dealer' | 'sales rep';
  status: 'active' | 'invited'|'inactive';
  actions?: string
}

const EditUserModal = ({ user, onSave, onClose }: { user: User; onSave: (user: User) => void; onClose: () => void }) => {
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role);

  const handleSave = () => {
    onSave({ ...user, name, role });
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:mb-0">
                <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                  Edit User
                </h3>
                <div className="mt-2">
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="role" className="block text-gray-700 font-bold mb-2">
                      Role
                    </label>
                    <select
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value as User['role'])}
                      className="shadow appearance-none border rounded w-full py-
                      2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      >
                        <option value="admin">Admin</option>
                        <option value="sales dealer">Sales Dealer</option>
                        <option value="sales rep">Sales Rep</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                onClick={handleSave}
                type="button"
                className="  rounded-3xl w-full inline-flex justify-center  border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700  sm:ml-3 sm:w-auto sm:text-sm"
              >
                Save
              </button>
              <button
                onClick={onClose}
                type="button"
                className=" rounded-3xl mt-3 w-full inline-flex justify-center border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500  sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
);
};

export default EditUserModal;      