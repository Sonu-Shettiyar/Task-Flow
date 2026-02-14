import axios, { AxiosHeaders } from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { getTasks, saveTasks, VALID_USER, FAKE_JWT } from "./data";

import type { Task } from "../types";
import { delay } from "../lib/utils";


export function setupMockApi() {
    axios.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
        const url = config.url || "";
        const method = (config.method || "get").toLowerCase();

        // POST /api/login
        if (url === "/api/login" && method === "post") {
            await delay(500);
            const body = typeof config.data === "string" ? JSON.parse(config.data) : config.data;
            if (body.username === VALID_USER.username && body.password === VALID_USER.password) {
                const response = {
                    data: { token: FAKE_JWT, user: { username: body.username } },
                    status: 200,
                    statusText: "OK",
                    headers: {},
                    config,
                };
                return Promise.reject({ __mock: true, response });
            }
            return Promise.reject({
                __mock: true,
                response: { data: { message: "Invalid username or password" }, status: 401, statusText: "Unauthorized", headers: {}, config },
            });
        }

        // Auth check for task endpoints
        if (url.startsWith("/api/tasks")) {
            const auth = (config.headers as AxiosHeaders)?.get?.("Authorization") as string | undefined;
            if (!auth || !auth.startsWith("Bearer ")) {
                return Promise.reject({
                    __mock: true,
                    response: { data: { message: "Unauthorized" }, status: 401, statusText: "Unauthorized", headers: {}, config },
                });
            }
        }

        // GET /api/tasks
        if (url === "/api/tasks" && method === "get") {
            await delay(300);
            return Promise.reject({
                __mock: true,
                response: { data: getTasks(), status: 200, statusText: "OK", headers: {}, config },
            });
        }

        // POST /api/tasks
        if (url === "/api/tasks" && method === "post") {
            await delay(300);
            const body = typeof config.data === "string" ? JSON.parse(config.data) : config.data;
            const tasks = getTasks();
            const newTask: Task = {
                id: Date.now().toString(),
                title: body.title || "",
                description: body.description || "",
                status: body.status || "todo",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            tasks.push(newTask);
            saveTasks(tasks);
            return Promise.reject({
                __mock: true,
                response: { data: newTask, status: 201, statusText: "Created", headers: {}, config },
            });
        }

        // PUT /api/tasks/:id
        const putMatch = url.match(/^\/api\/tasks\/(.+)$/);
        if (putMatch && method === "put") {
            await delay(300);
            const id = putMatch[1];
            const body = typeof config.data === "string" ? JSON.parse(config.data) : config.data;
            const tasks = getTasks();
            const index = tasks.findIndex((t) => t.id === id);
            if (index === -1) {
                return Promise.reject({
                    __mock: true,
                    response: { data: { message: "Task not found" }, status: 404, statusText: "Not Found", headers: {}, config },
                });
            }
            tasks[index] = { ...tasks[index], ...body, id: tasks[index].id, createdAt: tasks[index].createdAt, updatedAt: new Date().toISOString() };
            saveTasks(tasks);
            return Promise.reject({
                __mock: true,
                response: { data: tasks[index], status: 200, statusText: "OK", headers: {}, config },
            });
        }

        // DELETE /api/tasks/:id
        const delMatch = url.match(/^\/api\/tasks\/(.+)$/);
        if (delMatch && method === "delete") {
            await delay(300);
            const id = delMatch[1];
            const tasks = getTasks();
            const index = tasks.findIndex((t) => t.id === id);
            if (index === -1) {
                return Promise.reject({
                    __mock: true,
                    response: { data: { message: "Task not found" }, status: 404, statusText: "Not Found", headers: {}, config },
                });
            }
            tasks.splice(index, 1);
            saveTasks(tasks);
            return Promise.reject({
                __mock: true,
                response: { data: { message: "Deleted" }, status: 200, statusText: "OK", headers: {}, config },
            });
        }

        return config;
    });

    // Intercept mock rejections and turn them into resolved responses
    axios.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error?.__mock && error.response) {
                return Promise.resolve(error.response);
            }
            return Promise.reject(error);
        }
    );
}
