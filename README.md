# TaskFlow – Task Management App

A modern task management application built with React, TypeScript, and Ant Design.

**Preview**: [Open App](https://task-flow-sonushettiyar.netlify.app/)

---

## Tech Stack

| Layer      | Technology                   |
| ---------- | ---------------------------- |
| Framework  | React 18 + Vite              |
| Language   | TypeScript                   |
| UI Library | Ant Design 6                 |
| Styling    | Tailwind CSS                 |
| State      | Context API                  |
| HTTP       | Axios                        |
| Forms      | Formik + Yup                 |
| Testing    | Jest + React Testing Library |
| Mocking    | Axios interceptors           |

## How Mocking Works

The app uses **Axios interceptors** to simulate a REST API entirely in the browser — no backend server required.

1. `setupMockApi()` in `src/mocks/interceptors.ts` registers request/response interceptors on Axios.
2. Outgoing requests to `/api/*` are intercepted before reaching the network.
3. The interceptor matches the URL and method, then returns a mock response using data stored in `localStorage`.
4. Supported endpoints:
   - `POST /api/login` — authenticate with `test` / `test123`
   - `GET /api/tasks` — list all tasks (requires `Authorization` header)
   - `POST /api/tasks` — create a task
   - `PUT /api/tasks/:id` — update a task
   - `DELETE /api/tasks/:id` — delete a task
5. Mock data persists across page reloads via `localStorage`.

---

## Running the App

```bash
npm install
npm run dev
```

**Default credentials:** `test` / `test123`

---

## Running Tests

```bash
npm run test              # Run all tests once
npm run test:coverage     # Run with coverage report
npm run type-check        # Run type check
npm run lint              # Run lint check
```

Tests are co-located with source files using `*.test.ts(x)` naming. The project targets **100% unit test coverage** with zero lint errors.

---

## Features

- **Authentication** — login/logout with session persistence
- **Task CRUD** — create, edit, delete tasks with Formik + Yup validation
- **Search & Filter** — filter tasks by status, search by title/description
- **Sort** — sort by date or title
- **Dark Mode** — toggle available on all routes, persisted to localStorage
- **Empty & Error States** — dedicated components for empty lists and API errors
- **Responsive** — mobile-first layout using Tailwind CSS + Ant Design grid
