import { Card, Text, Group } from "@mantine/core";

interface UserCardProps {
  firstName: string;
  lastName: string;
  email: string;
}

export default function UserCard({ firstName, lastName, email }: UserCardProps) {
  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      <Group  mb="xs">
        <Text>
          {firstName} {lastName}
        </Text>
      </Group>
      <Text size="sm" color="dimmed">
        {email}
      </Text>
    </Card>
  );
}
