
import { useMemo, useState } from 'react';
import { useTable, useSortBy, usePagination, useRowSelect, Column, TableState,CellProps } from 'react-table';
import 'tailwindcss/tailwind.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import EditUserModal from './Modal/EditUserModal';
import CreateUserModal from './Modal/CreateUserModal';

interface User {
  id: number;
  name: string;
  lastLogin: string;
  role: 'admin' | 'sales dealer' | 'sales rep';
  status: 'active' | 'invited' | 'inactive';
  actions?: string
}



const MyTable = ({ data }: { data: User[] }) => {
  const [selectedUser, setSelectedUser] = useState<User>();
  const [tableData, setTableData] = useState(data);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const columns: Column<User>[] = [
    {
      Header: 'ID',
      accessor: 'id',
      sortType: 'basic'
    },
    {
      Header: 'Name',
      accessor: 'name',
    },
    {
      Header: 'Last Login',
      accessor: 'lastLogin',
    },
    {
      Header: 'Role',
      accessor: 'role',
    },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ({ value }) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            value === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >   <span className={`h-2 w-2 rounded-full mr-2 ${value === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
          {value}
        </span>
      ),
    },
    {
      Header: 'Actions',
      accessor: 'actions',
      Cell: ({ row }: CellProps<User, string | undefined>) => (
        <div className='w-full flex justify-center'>
          <button className="mr-2" onClick={() => handleEdit(row)}>
            <FontAwesomeIcon icon={faPencil} /> </button>
          <button onClick={() => handleDelete(row)}>
            <FontAwesomeIcon icon={faTrashCan} /> </button>
        </div>
      ),
    },
  ];

  const memoizedColumns = useMemo(() => columns,[]);

  const tableInstance = useTable<User>(
    {
      columns: memoizedColumns,
      data: tableData,
      initialState: { pageIndex: 0, pageSize: 5 } as TableState<User>,
    },
    useSortBy,
    usePagination, useRowSelect
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    state: { pageIndex, pageSize },
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
  } = tableInstance;

  const handleEdit = (row: any) => {
    setSelectedUser(row.original);
    setIsModalOpen(true);
  };

  const handleDelete = (row: any) => {
    const newData = data.filter((user) => user.id !== row.original.id);
    setTableData(newData);
    localStorage.setItem('users', JSON.stringify(newData));
  };


  const handleSave = (updatedUser: User) => {
    const newData = tableData.map((user) =>
      user.id === updatedUser.id ? { ...user, name: updatedUser.name, role: updatedUser.role } : user
    );
    setTableData(newData);
    localStorage.setItem('users', JSON.stringify(newData));
    setIsModalOpen(false);
  };

  const handleSaveCreate = (newUser: User) => {
    setTableData(prev => [...prev, newUser]);
    localStorage.setItem('users', JSON.stringify(tableData));
    setIsCreateModalOpen(false);
  }

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  }

  const handleDownloadCSV = () => {
    const headerNames = tableInstance.columns.map((column) => column.Header);
    const csvData = [
      headerNames.join(','),
      ...tableData.map((row) => Object.values(row).join(',')),
    ].join('\n');

    const downloadLink = document.createElement('a');
    downloadLink.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvData);
    downloadLink.download = 'my-table-data.csv';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className='flex-col'>
      <div className='w-full p-5 gap-3 flex justify-end'>
        <button className='mr-1 border cursor-pointer hover:bg-slate-200 p-2 text-gray-700  rounded-3xl' onClick={handleDownloadCSV}>Download CSV</button>
        <button className='mr-1 border  cursor-pointer hover:bg-slate-200 p-2 text-gray-700  rounded-3xl' onClick={() => handleCreate()}>Add an user</button>
      </div>

      <table {...getTableProps()} className="table-auto w-full">
        <thead className="bg-white">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="p-2 font-bold uppercase text-xs text-gray-600 cursor-pointer"
                >
                  {column.render('Header')}
                  {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className='border h-20'>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} className="p-2">
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex justify-between p-2 w-full">
        <div className='w-1/2'>

          <button className="w-28 h-10 border mr-1 cursor-pointer hover:bg-slate-200 text-gray-700 rounded-3xl" onClick={() => previousPage()} disabled={!canPreviousPage}>
            Previous Page
          </button>
          <button className="w-28 h-10 border cursor-pointer hover:bg-slate-200 text-gray-700  rounded-3xl" onClick={() => nextPage()} disabled={!canNextPage}>
            Next Page
          </button>
        </div>
        <div className='h-10 underline decoration-slate-200'>
          Showing {pageIndex * pageSize + 1} - {pageIndex * pageSize + page.length} of {data.length} results
        </div>
      </div>
      {isModalOpen && selectedUser&& (
        <EditUserModal user={selectedUser} onSave={handleSave} onClose={() => setIsModalOpen(false)} />
      )}
      {
        isCreateModalOpen && (
          <CreateUserModal onSave={handleSaveCreate} onClose={() => setIsCreateModalOpen(false)} />
        )
      }
    </div>
  );
};


export default MyTable
