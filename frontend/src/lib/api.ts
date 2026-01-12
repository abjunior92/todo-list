const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  message: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface MeResponse {
  user: User;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    const error: ApiError = {
      message: data.message || "Si è verificato un errore",
      errors: data.errors,
    };
    throw error;
  }

  return data;
}

export async function signup(data: SignupRequest): Promise<SignupResponse> {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include", // Includi i cookie per le sessioni
  });

  return handleResponse<SignupResponse>(response);
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include", // Includi i cookie per le sessioni
  });

  return handleResponse<LoginResponse>(response);
}

export async function getCurrentUser(): Promise<MeResponse> {
  const response = await fetch(`${API_URL}/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Includi i cookie per le sessioni
  });

  return handleResponse<MeResponse>(response);
}

export async function logout(): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Includi i cookie per le sessioni
  });

  return handleResponse<{ message: string }>(response);
}

// Task interfaces
export interface Task {
  id: number;
  description: string;
  scheduledAt: string; // ISO8601
  completed: boolean;
  userId: number;
  insertedAt: string;
  updatedAt: string;
}

export interface GetTasksParams {
  date?: string; // ISO8601 date (YYYY-MM-DD)
  completed?: boolean;
}

export interface GetTasksResponse {
  tasks: Task[];
}

export interface CreateTaskRequest {
  description: string;
  scheduledAt: string; // ISO8601
  completed?: boolean;
}

export interface CreateTaskResponse {
  message: string;
  task: Task;
}

export interface UpdateTaskRequest {
  description?: string;
  scheduledAt?: string; // ISO8601
  completed?: boolean;
}

export interface UpdateTaskResponse {
  message: string;
  task: Task;
}

export interface GetTaskResponse {
  task: Task;
}

// Task API functions
export async function getTasks(
  params?: GetTasksParams
): Promise<GetTasksResponse> {
  const queryParams = new URLSearchParams();
  if (params?.date) {
    queryParams.append("date", params.date);
  }
  if (params?.completed !== undefined) {
    queryParams.append("completed", params.completed.toString());
  }

  const url = `${API_URL}/tasks${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  return handleResponse<GetTasksResponse>(response);
}

export async function getTask(id: number): Promise<GetTaskResponse> {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  return handleResponse<GetTaskResponse>(response);
}

export async function createTask(
  data: CreateTaskRequest
): Promise<CreateTaskResponse> {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });

  return handleResponse<CreateTaskResponse>(response);
}

export async function updateTask(
  id: number,
  data: UpdateTaskRequest
): Promise<UpdateTaskResponse> {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });

  return handleResponse<UpdateTaskResponse>(response);
}

export async function deleteTask(id: number): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  return handleResponse<{ message: string }>(response);
}
