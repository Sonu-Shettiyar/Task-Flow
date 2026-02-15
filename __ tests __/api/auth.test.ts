import axios from "axios";
import { loginApi } from "../../src/api/auth";
import type { LoginCredentials } from "../../src/types";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("api/auth", () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    describe("loginApi", () => {
        const credentials: LoginCredentials = {
            username: "test",
            password: "test123",
        };

        it("should send POST request to /api/login with credentials & return a User object with username and token on success", async () => {
            mockedAxios.post.mockResolvedValueOnce({
                data: {
                    user: { username: "test" },
                    token: "fake-jwt-token",
                },
            });


            const result = await loginApi(credentials);

            expect(result).toEqual({
                username: "test",
                token: "fake-jwt-token",
            });

            expect(mockedAxios.post).toHaveBeenCalledTimes(1);
            expect(mockedAxios.post).toHaveBeenCalledWith("/api/login", {
                username: "test",
                password: "test123",
            });
        });

        it("should throw when axios rejects with a 401 error", async () => {
            const error = {
                response: { status: 401, data: { message: "Invalid credentials" } },
                message: "Request failed with status code 401",
            };
            mockedAxios.post.mockRejectedValueOnce(error);

            await expect(loginApi(credentials)).rejects.toEqual(error);
        });

        it("should throw when axios rejects with a 500 error", async () => {
            const error = {
                response: { status: 500, data: { message: "Internal Server Error" } },
                message: "Request failed with status code 500",
            };
            mockedAxios.post.mockRejectedValueOnce(error);

            await expect(loginApi(credentials)).rejects.toEqual(error);
        });
    });
});