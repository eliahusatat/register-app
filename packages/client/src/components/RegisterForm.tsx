import { useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Button,
  Stack,
} from "@mantine/core";
import axios from "../utils/api";
import { showNotification } from "@mantine/notifications";
import type { User } from "@register-app/shared";

interface RegisterFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
  initialData?: Partial<User> & { _id?: string };
}

export default function RegisterForm({ onSuccess, onClose ,initialData }: RegisterFormProps) {

  const isEditMode = !!initialData?._id;

  const form = useForm({
    initialValues: {
      firstName: initialData?.firstName ?? "",
      lastName: initialData?.lastName ?? "",
      email: initialData?.email ?? "",
      password: initialData?.password ?? "",
      phone: initialData?.phone ?? "",
    },
    validate: {
      email: (value) =>
        /^\S+@gmail\.com$/.test(value) ? null : "Email must be a valid @gmail.com address",
      phone: (value) =>{
        if (isEditMode && !value) return null;
        if (!/^05\d-\d{7}$/.test(value)) return "Phone must be in format 05x-xxxxxxx";
        return null;
      },
      password: (value) => {
        if (isEditMode && !value) return null;
        if (!/[A-Z]/.test(value)) return "Must include at least one uppercase letter";
        if (!/[a-z]/.test(value)) return "Must include at least one lowercase letter";
        if (!/[0-9]/.test(value)) return "Must include at least one digit";
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return "Must include at least one special character";
        return null;
      },
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      if (initialData?._id) {
        // Editing user
        await axios.put(`/user/${initialData._id}`, values);
        
      } else {
        // Creating user
        await axios.post("/user", values);
      }

      onSuccess?.();
      onClose?.();
      form.reset();
    } catch (error : any) {
      if (error.response?.status === 409) {
        showNotification({
          title: "Email already exists",
          message: error.response.data?.message,
          color: "red",
        });
      } else {
        showNotification({
          title: "Error",
          message: "Operation failed",
          color: "red",
        });
      }
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput label="First Name" {...form.getInputProps("firstName")} required />
        <TextInput label="Last Name" {...form.getInputProps("lastName")} required />
        <TextInput label="Email" {...form.getInputProps("email")} required />
        <PasswordInput label="Password" {...form.getInputProps("password")} required={!isEditMode} />
        <TextInput label="Phone" {...form.getInputProps("phone")} required={!isEditMode} placeholder="05x-xxxxxxx" />
        <Button type="submit" fullWidth mt="sm">Submit</Button>
      </Stack>
    </form>
  );
}
