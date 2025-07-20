import { useEffect, useState, type SetStateAction } from "react";
import { Container, Table, Title, Loader } from "@mantine/core";
import axios from '../utils/api';
import dayjs from "dayjs";

interface SessionLog {
  _id: string;
  email: string;
  loginTime: string;
  logoutTime?: string;
}

export default function ConnectionLogsPage() {
  const [logs, setLogs] = useState<SessionLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/sessions")
      .then((res: { data: SetStateAction<SessionLog[]>; }) => setLogs(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

    const getLogoutStatus = (log: SessionLog) => {
    if (log.logoutTime) {
      return dayjs(log.logoutTime).format("YYYY-MM-DD HH:mm:ss");
    }

    const loginMoment = dayjs(log.loginTime);
    const now = dayjs();
    const diffInHours = now.diff(loginMoment, "hour", true);

    if (diffInHours < 2) {
      return "Still Active";
    } else {
      return "Session Expired";
    }
  };

  return (
    <Container>
      <Title mb="md">Connection Logs</Title>
      {loading ? (
        <Loader />
      ) : (
        <Table striped highlightOnHover>
          <Table.Thead style={{ userSelect: "none" }}>
            <Table.Tr>
              <Table.Th>Email</Table.Th>
              <Table.Th>Login Time</Table.Th>
              <Table.Th>Logout Time</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <tbody>
            {logs.map((log) => (
              <Table.Tr key={log._id}>
                <Table.Td>{log.email}</Table.Td>
                <Table.Td>{dayjs(log.loginTime).format("YYYY-MM-DD HH:mm:ss")}</Table.Td>
                <Table.Td>{getLogoutStatus(log)}</Table.Td>
              </Table.Tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
