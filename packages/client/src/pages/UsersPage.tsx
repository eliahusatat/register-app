import { useEffect, useState } from 'react';
import { Container, Title, Loader, SimpleGrid } from '@mantine/core';
import axios from '../utils/api';
import UserCard from '../components/UserCard';
import { showNotification } from '@mantine/notifications';
import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import RegisterForm from "../components/RegisterForm";
import type { PublicUser, User } from '@register-app/shared';


export default function UsersPage() {
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [opened, { open, close }] = useDisclosure(false);
  const [editingUser, setEditingUser] = useState<Partial<User> & { _id: string } | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);



  const fetchUsers = async () => {
  setLoading(true);
  try {
    const res = await axios.get("/user");
    setUsers(res.data);
  } catch {
    showNotification({
      title: "Failure",
      message: "Failed to load users",
      color: "red",
      styles: { root: { maxWidth: 400 } },
    });
  } finally {
    setLoading(false);
  }
};


  const onSuccess = async () => {
    showNotification({
      title: "Success", 
      message: editingUser ? "User updated!" : "User created!",
      color: "green"}); 
    setEditingUser(null); 
    await fetchUsers();
  };

  useEffect(() => {
     fetchUsers();
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserId(parsedUser._id || parsedUser.id);
        setIsAdmin(parsedUser.role === "admin");
      } catch (err) {
        console.error("Failed to parse user from localStorage", err);
      }
    }
  }, []);

  return (
  <Container size="md">
    <Title  order={2} mb="md">
      Registered Users
    </Title>
    {isAdmin && (<Button onClick={() => {
        setEditingUser(null); // means "Add" mode
        open();
      }} mb="md">
      Add User
    </Button>)}
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
            key={u._id}
            user={u}
            canEdit={isAdmin || u._id === userId}
              onEdit={() => {
              setEditingUser(u);
              open();
            }}
          />
        ))}
      </SimpleGrid>
    )}
    <Modal opened={opened} onClose={close} title={editingUser ? "Edit User" : "Add User"}>
  <RegisterForm
    initialData={editingUser ?? undefined}
    onSuccess={onSuccess}
    onClose={close}
  />
</Modal>
  </Container>
);
}
