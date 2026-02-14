import axios from "axios";
import type { LoginCredentials, User } from "../types";

export async function loginApi(credentials: LoginCredentials): Promise<User> {
  const { data } = await axios.post("/api/login", credentials);
  return { username: data.user.username, token: data.token };
}
