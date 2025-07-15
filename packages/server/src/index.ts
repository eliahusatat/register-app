import express, { Request, Response } from "express";
import { User } from "@register-app/shared";
import { z } from "zod";
import cors from "cors";

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

const users: User[] = [];

const userSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z
    .string()
    .email("Invalid email format")
    .regex(/^\S+@gmail\.com$/, "Email must be a valid @gmail.com address"),
  password: z
    .string()
    .refine((val) => /[A-Z]/.test(val), "Must include at least one uppercase letter")
    .refine((val) => /[a-z]/.test(val), "Must include at least one lowercase letter")
    .refine((val) => /[0-9]/.test(val), "Must include at least one digit")
    .refine(
      (val) => /[!@#$%^&*(),.?":{}|<>]/.test(val),
      "Must include at least one special character"
    ),
  phone: z.string().regex(/^05\d-\d{7}$/, "Phone must be in format 05x-xxxxxxx"),
});


app.post("/api/user", (req: Request, res: Response) => {
  const parseResult = userSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: parseResult.error.flatten().fieldErrors
    });
  }

  const { firstName, lastName, email, password, phone } = parseResult.data;

  const newUser: User = {
    firstName,
    lastName,
    email,
    password,
    phone
  };

  users.push(newUser);

  const { password: _, phone: __, ...safeUser } = newUser;
  res.status(201).json(safeUser);
});


app.get("/api/user", (req: Request, res: Response) => {
  const safeUsers = users.map(({password, phone, ...rest }) => rest);
  res.json(safeUsers);
});

app.post("/api/login", (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing email or password" });
  }

  const foundUser = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!foundUser) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({ message: "Login successful" });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

