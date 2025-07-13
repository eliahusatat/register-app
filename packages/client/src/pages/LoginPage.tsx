import { useForm } from '@mantine/form';
import { TextInput, PasswordInput, Button, Container, Title } from '@mantine/core';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { showNotification } from '@mantine/notifications';

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      email: '',
      password: ''
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      await axios.post('http://localhost:3001/api/login', values);
            showNotification({
            title: "Success",
            message: "Login successful!",
            color: "green",
            styles: {
            root: {
            maxWidth: 400
          }
  }
            });
      onLogin();
      navigate('/users');
    } catch (error) {
        showNotification({
          title: "Failure",
          message: "Invalid credentials",
          color: "red",
          styles: {
          root: {
          maxWidth: 400
        }
      }
        });
    }
  };

  return (
    <Container size="xs">
      <Title mb="md">Login</Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput label="Email" {...form.getInputProps('email')} required />
        <PasswordInput label="Password" {...form.getInputProps('password')} required />
        <Button type="submit" fullWidth mt="md">Login</Button>
      </form>
    </Container>
  );
}
