import { Card, Text, Group, ActionIcon } from "@mantine/core";
import type { PublicUser } from "@register-app/shared";
import { IconPencil } from "@tabler/icons-react"; 

interface UserCardProps {
  user : PublicUser;
  canEdit?: boolean;
  onEdit: () => void;
}

export default function UserCard({ user, canEdit ,onEdit}: UserCardProps) {
  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      <Group  mb="xs">
        <Text>
          {user.firstName} {user.lastName}
        </Text>
        {canEdit && (<ActionIcon onClick={onEdit} variant="light" color="blue">
          <IconPencil size={18} />
        </ActionIcon>)
     }
      </Group>
      <Text size="sm" color="dimmed">
        {user.email}
      </Text>
    </Card>
  );
}
