import { useQuery } from 'react-query';
import './App.css'
import MyTable from './Mytable';


interface User {
  id: number;
  name: string;
  lastLogin: string;
  role: 'admin' | 'sales dealer' | 'sales rep';
  status: 'active' | 'invited';
}
const getRandomDate = (): string => {
  const start = new Date(2015, 0, 1);
  const end = new Date();
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return randomDate.toLocaleString();
};

const getRandomRole = (): User['role'] => {
  const roles: User['role'][] = ['admin', 'sales dealer', 'sales rep'];
  return roles[Math.floor(Math.random() * roles.length)];
};

const getRandomStatus = (): User['status'] => {
  const statuses: User['status'][] = ['active', 'invited'];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

const getUsers = async (): Promise<User[]> => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  const data = await response.json();
  return data.map((user: User) => ({
    id: user.id,
    name: user.name,
    lastLogin: getRandomDate(),
    role:getRandomRole(),
    status: getRandomStatus(), 
  }));
};


function App() {
  const { data, isLoading, error } = useQuery<User[]>('users', getUsers, {
    initialData: JSON.parse(localStorage.getItem('users') || '[]'),
    onSuccess: (data) => {
      localStorage.setItem('users', JSON.stringify(data));
    },
  });


  if (isLoading) {
    return <div>Loading...</div>;
  }


  if (error instanceof Error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {
      data&& <MyTable data={data}/>
      }
    </div>
  );
}

export default App