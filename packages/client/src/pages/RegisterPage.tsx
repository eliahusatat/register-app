import { Container, Title } from "@mantine/core";
import RegisterForm from "../components/RegisterForm";
import { showNotification } from "@mantine/notifications";

export default function RegisterPage() {
  return (
    <Container size="xs">
      <Title mb="md">Register</Title>
      <RegisterForm onSuccess={() => {showNotification({ title: "Success", message: "User created!", color: "green" })}}/>
    </Container>
  );
}
