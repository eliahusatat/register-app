import { useEffect, useState } from 'react';
import { Container, Title, Loader, SimpleGrid } from '@mantine/core';
import axios from 'axios';
import UserCard from '../components/UserCard';
import { showNotification } from '@mantine/notifications';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3001/api/user')
      .then((res) => {
        setUsers(res.data);
      })
      .catch(() => {
        showNotification({
          title: "Failure",
          message: "Failed to load users",
          color: "red",
          styles: {
          root: {
          maxWidth: 400
        }
      }
        });
      })
      .finally(() => setLoading(false));
  }, []);

  return (
  <Container size="md">
    <Title  order={2} mb="md">
      Registered Users
    </Title>
    {loading ? (
      <Loader />
    ) : users.length === 0 ? (
      <Title order={4} >
        No users found.
      </Title>
    ) : (
      <SimpleGrid cols={3} spacing="md" >
        {users.map((u) => (
          <UserCard
            key={u.id}
            firstName={u.firstName}
            lastName={u.lastName}
            email={u.email}
          />
        ))}
      </SimpleGrid>
    )}
  </Container>
);
}
