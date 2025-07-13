import { useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Button,
  Container,
  Title
} from "@mantine/core";
import axios from "axios";
import { showNotification } from '@mantine/notifications';


export default function RegisterPage() {
  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: ""
    },
    validate: {
      email: (value) =>
        /^\S+@gmail\.com$/.test(value) ? null : "Email must be a valid @gmail.com address",
      phone: (value) =>
        /^05\d-\d{7}$/.test(value) ? null : "Phone must be in format 05x-xxxxxxx",
      password: (value) => {
        if (!/[A-Z]/.test(value)) return "Must include at least one uppercase letter";
        if (!/[a-z]/.test(value)) return "Must include at least one lowercase letter";
        if (!/[0-9]/.test(value)) return "Must include at least one digit";
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return "Must include at least one special character";
        return null;
      }
    }
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      await axios.post("http://localhost:3001/api/user", values);
      showNotification({
      title: "Success",
      message: "User registered successfully!",
      color: "green",
      styles: {
      root: {
      maxWidth: 400
    }
  }
      });
      form.reset();
    } catch (error) {
        showNotification({
          title: "Failure",
          message: "Registration failed!",
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
      <Title mb="md">
        Register
      </Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="First Name"
          {...form.getInputProps("firstName")}
          required
        />
        <TextInput
          label="Last Name"
          {...form.getInputProps("lastName")}
          required
        />
        <TextInput
          label="Email"
          {...form.getInputProps("email")}
          required
        />
        <PasswordInput
          label="Password"
          {...form.getInputProps("password")}
          required
        />
        <TextInput
          label="Phone"
          {...form.getInputProps("phone")}
          required
          placeholder="05x-xxxxxxx"
        />
        <Button type="submit" fullWidth mt="md">
          Register
        </Button>
      </form>
    </Container>
  );
}

