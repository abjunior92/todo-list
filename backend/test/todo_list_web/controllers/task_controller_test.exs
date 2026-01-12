defmodule TodoListWeb.TaskControllerTest do
  use TodoListWeb.ConnCase, async: true

  alias TodoList.Accounts.User
  alias TodoList.Tasks.Task
  alias TodoList.Repo

  defp create_user(attrs \\ %{}) do
    default_attrs = %{
      first_name: "Mario",
      last_name: "Rossi",
      email: "mario.rossi@example.com",
      password: "password123"
    }

    %User{}
    |> User.changeset(Map.merge(default_attrs, attrs))
    |> Repo.insert!()
  end

  defp create_task(user, attrs \\ %{}) do
    default_attrs = %{
      description: "Test task",
      scheduled_at: ~N[2024-01-15 10:00:00],
      completed: false,
      user_id: user.id
    }

    %Task{}
    |> Task.changeset(Map.merge(default_attrs, attrs))
    |> Repo.insert!()
  end

  defp authenticated_conn(conn, user) do
    conn
    |> Plug.Test.init_test_session(%{})
    |> put_session(:user_id, user.id)
  end

  describe "GET /api/tasks" do
    test "returns unauthorized when not authenticated", %{conn: conn} do
      conn = get(conn, "/api/tasks")
      assert json_response(conn, 401)["message"] == "Not authenticated"
    end

    test "returns empty list when user has no tasks", %{conn: conn} do
      user = create_user()
      conn = authenticated_conn(conn, user)

      conn = get(conn, "/api/tasks")
      assert json_response(conn, 200)["tasks"] == []
    end

    test "returns only tasks belonging to authenticated user", %{conn: conn} do
      user1 = create_user(%{email: "user1@example.com"})
      user2 = create_user(%{email: "user2@example.com"})

      task1 = create_task(user1, %{description: "Task 1"})
      task2 = create_task(user1, %{description: "Task 2"})
      task3 = create_task(user2, %{description: "Task 3"})

      conn = authenticated_conn(conn, user1)
      conn = get(conn, "/api/tasks")

      response = json_response(conn, 200)
      assert length(response["tasks"]) == 2

      task_ids = Enum.map(response["tasks"], & &1["id"])
      assert task1.id in task_ids
      assert task2.id in task_ids
      refute task3.id in task_ids
    end

    test "returns tasks ordered by scheduled_at ascending", %{conn: conn} do
      user = create_user()

      task1 = create_task(user, %{
        description: "Task 1",
        scheduled_at: ~N[2024-01-15 12:00:00]
      })
      task2 = create_task(user, %{
        description: "Task 2",
        scheduled_at: ~N[2024-01-15 10:00:00]
      })
      task3 = create_task(user, %{
        description: "Task 3",
        scheduled_at: ~N[2024-01-15 11:00:00]
      })

      conn = authenticated_conn(conn, user)
      conn = get(conn, "/api/tasks")

      response = json_response(conn, 200)
      tasks = response["tasks"]
      assert length(tasks) == 3
      assert Enum.at(tasks, 0)["id"] == task2.id
      assert Enum.at(tasks, 1)["id"] == task3.id
      assert Enum.at(tasks, 2)["id"] == task1.id
    end

    test "filters tasks by date", %{conn: conn} do
      user = create_user()

      task1 = create_task(user, %{
        description: "Task 1",
        scheduled_at: ~N[2024-01-15 10:00:00]
      })
      _task2 = create_task(user, %{
        description: "Task 2",
        scheduled_at: ~N[2024-01-16 10:00:00]
      })
      task3 = create_task(user, %{
        description: "Task 3",
        scheduled_at: ~N[2024-01-15 14:00:00]
      })

      conn = authenticated_conn(conn, user)
      conn = get(conn, "/api/tasks", %{"date" => "2024-01-15"})

      response = json_response(conn, 200)
      tasks = response["tasks"]
      assert length(tasks) == 2

      task_ids = Enum.map(tasks, & &1["id"])
      assert task1.id in task_ids
      assert task3.id in task_ids
    end

    test "filters tasks by completed status", %{conn: conn} do
      user = create_user()

      task1 = create_task(user, %{description: "Task 1", completed: true})
      task2 = create_task(user, %{description: "Task 2", completed: false})
      task3 = create_task(user, %{description: "Task 3", completed: true})

      conn = authenticated_conn(conn, user)
      conn = get(conn, "/api/tasks", %{"completed" => "true"})

      response = json_response(conn, 200)
      tasks = response["tasks"]
      assert length(tasks) == 2

      task_ids = Enum.map(tasks, & &1["id"])
      assert task1.id in task_ids
      assert task3.id in task_ids
      refute task2.id in task_ids
    end

    test "filters tasks by completed false", %{conn: conn} do
      user = create_user()

      task1 = create_task(user, %{description: "Task 1", completed: true})
      task2 = create_task(user, %{description: "Task 2", completed: false})

      conn = authenticated_conn(conn, user)
      conn = get(conn, "/api/tasks", %{"completed" => "false"})

      response = json_response(conn, 200)
      tasks = response["tasks"]
      assert length(tasks) == 1
      assert Enum.at(tasks, 0)["id"] == task2.id
      refute task1.id in Enum.map(tasks, & &1["id"])
    end

    test "filters tasks by both date and completed", %{conn: conn} do
      user = create_user()

      task1 = create_task(user, %{
        description: "Task 1",
        scheduled_at: ~N[2024-01-15 10:00:00],
        completed: true
      })
      _task2 = create_task(user, %{
        description: "Task 2",
        scheduled_at: ~N[2024-01-15 11:00:00],
        completed: false
      })
      _task3 = create_task(user, %{
        description: "Task 3",
        scheduled_at: ~N[2024-01-16 10:00:00],
        completed: true
      })

      conn = authenticated_conn(conn, user)
      conn = get(conn, "/api/tasks", %{"date" => "2024-01-15", "completed" => "true"})

      response = json_response(conn, 200)
      tasks = response["tasks"]
      assert length(tasks) == 1
      assert Enum.at(tasks, 0)["id"] == task1.id
    end
  end

  describe "GET /api/tasks/:id" do
    test "returns task when authenticated and task exists", %{conn: conn} do
      user = create_user()
      task = create_task(user, %{description: "My task"})

      conn = authenticated_conn(conn, user)
      conn = get(conn, "/api/tasks/#{task.id}")

      response = json_response(conn, 200)
      assert response["task"]["id"] == task.id
      assert response["task"]["description"] == "My task"
      assert response["task"]["completed"] == false
      assert response["task"]["userId"] == user.id
    end

    test "returns unauthorized when not authenticated", %{conn: conn} do
      user = create_user()
      task = create_task(user)

      conn = get(conn, "/api/tasks/#{task.id}")
      assert json_response(conn, 401)["message"] == "Not authenticated"
    end

    test "returns not found when task does not exist", %{conn: conn} do
      user = create_user()

      conn = authenticated_conn(conn, user)
      conn = get(conn, "/api/tasks/999999")

      assert json_response(conn, 404)["message"] == "Task not found"
    end

    test "returns not found when task belongs to another user", %{conn: conn} do
      user1 = create_user(%{email: "user1@example.com"})
      user2 = create_user(%{email: "user2@example.com"})
      task = create_task(user2)

      conn = authenticated_conn(conn, user1)
      conn = get(conn, "/api/tasks/#{task.id}")

      assert json_response(conn, 404)["message"] == "Task not found"
    end
  end

  describe "POST /api/tasks" do
    test "creates task with valid data", %{conn: conn} do
      user = create_user()

      task_params = %{
        "description" => "New task",
        "scheduledAt" => "2024-01-15T10:00:00",
        "completed" => false
      }

      conn = authenticated_conn(conn, user)
      conn = post(conn, "/api/tasks", task_params)

      response = json_response(conn, 201)
      assert response["message"] == "Task created successfully"
      assert response["task"]["description"] == "New task"
      assert response["task"]["completed"] == false
      assert response["task"]["userId"] == user.id
      assert Map.has_key?(response["task"], "id")
    end

    test "creates task with completed defaulting to false", %{conn: conn} do
      user = create_user()

      task_params = %{
        "description" => "New task",
        "scheduledAt" => "2024-01-15T10:00:00"
      }

      conn = authenticated_conn(conn, user)
      conn = post(conn, "/api/tasks", task_params)

      response = json_response(conn, 201)
      assert response["task"]["completed"] == false
    end

    test "returns unauthorized when not authenticated", %{conn: conn} do
      task_params = %{
        "description" => "New task",
        "scheduledAt" => "2024-01-15T10:00:00"
      }

      conn = post(conn, "/api/tasks", task_params)
      assert json_response(conn, 401)["message"] == "Not authenticated"
    end

    test "returns error when description is missing", %{conn: conn} do
      user = create_user()

      task_params = %{
        "scheduledAt" => "2024-01-15T10:00:00"
      }

      conn = authenticated_conn(conn, user)
      conn = post(conn, "/api/tasks", task_params)

      response = json_response(conn, 422)
      assert response["message"] == "Validation failed"
      assert Map.has_key?(response["errors"], "description")
    end

    test "returns error when scheduled_at is missing", %{conn: conn} do
      user = create_user()

      task_params = %{
        "description" => "New task"
      }

      conn = authenticated_conn(conn, user)
      conn = post(conn, "/api/tasks", task_params)

      response = json_response(conn, 422)
      assert response["message"] == "Validation failed"
      assert Map.has_key?(response["errors"], "scheduled_at")
    end

    test "returns error when description is empty", %{conn: conn} do
      user = create_user()

      task_params = %{
        "description" => "",
        "scheduledAt" => "2024-01-15T10:00:00"
      }

      conn = authenticated_conn(conn, user)
      conn = post(conn, "/api/tasks", task_params)

      response = json_response(conn, 422)
      assert response["message"] == "Validation failed"
      assert Map.has_key?(response["errors"], "description")
    end

    test "accepts date format without time", %{conn: conn} do
      user = create_user()

      task_params = %{
        "description" => "New task",
        "scheduledAt" => "2024-01-15"
      }

      conn = authenticated_conn(conn, user)
      conn = post(conn, "/api/tasks", task_params)

      response = json_response(conn, 201)
      assert response["message"] == "Task created successfully"
    end
  end

  describe "PUT /api/tasks/:id" do
    test "updates task with valid data", %{conn: conn} do
      user = create_user()
      task = create_task(user, %{description: "Old description"})

      update_params = %{
        "description" => "Updated description",
        "scheduledAt" => "2024-01-20T15:00:00",
        "completed" => true
      }

      conn = authenticated_conn(conn, user)
      conn = put(conn, "/api/tasks/#{task.id}", update_params)

      response = json_response(conn, 200)
      assert response["message"] == "Task updated successfully"
      assert response["task"]["description"] == "Updated description"
      assert response["task"]["completed"] == true
    end

    test "updates task with partial data", %{conn: conn} do
      user = create_user()
      task = create_task(user, %{
        description: "Original description",
        completed: false
      })

      update_params = %{
        "description" => "Updated description"
      }

      conn = authenticated_conn(conn, user)
      conn = put(conn, "/api/tasks/#{task.id}", update_params)

      response = json_response(conn, 200)
      assert response["task"]["description"] == "Updated description"
      assert response["task"]["completed"] == false
    end

    test "updates only completed status", %{conn: conn} do
      user = create_user()
      task = create_task(user, %{
        description: "Original description",
        completed: false
      })

      update_params = %{
        "completed" => true
      }

      conn = authenticated_conn(conn, user)
      conn = put(conn, "/api/tasks/#{task.id}", update_params)

      response = json_response(conn, 200)
      assert response["task"]["description"] == "Original description"
      assert response["task"]["completed"] == true
    end

    test "returns unauthorized when not authenticated", %{conn: conn} do
      user = create_user()
      task = create_task(user)

      update_params = %{
        "description" => "Updated description"
      }

      conn = put(conn, "/api/tasks/#{task.id}", update_params)
      assert json_response(conn, 401)["message"] == "Not authenticated"
    end

    test "returns not found when task does not exist", %{conn: conn} do
      user = create_user()

      update_params = %{
        "description" => "Updated description"
      }

      conn = authenticated_conn(conn, user)
      conn = put(conn, "/api/tasks/999999", update_params)

      assert json_response(conn, 404)["message"] == "Task not found"
    end

    test "returns not found when task belongs to another user", %{conn: conn} do
      user1 = create_user(%{email: "user1@example.com"})
      user2 = create_user(%{email: "user2@example.com"})
      task = create_task(user2)

      update_params = %{
        "description" => "Updated description"
      }

      conn = authenticated_conn(conn, user1)
      conn = put(conn, "/api/tasks/#{task.id}", update_params)

      assert json_response(conn, 404)["message"] == "Task not found"
    end

    test "returns error when description is empty", %{conn: conn} do
      user = create_user()
      task = create_task(user)

      update_params = %{
        "description" => ""
      }

      conn = authenticated_conn(conn, user)
      conn = put(conn, "/api/tasks/#{task.id}", update_params)

      response = json_response(conn, 422)
      assert response["message"] == "Validation failed"
      assert Map.has_key?(response["errors"], "description")
    end
  end

  describe "DELETE /api/tasks/:id" do
    test "deletes task when authenticated and task exists", %{conn: conn} do
      user = create_user()
      task = create_task(user)

      conn = authenticated_conn(conn, user)
      conn = delete(conn, "/api/tasks/#{task.id}")

      response = json_response(conn, 200)
      assert response["message"] == "Task deleted successfully"

      # Verify task is actually deleted
      assert Repo.get(Task, task.id) == nil
    end

    test "returns unauthorized when not authenticated", %{conn: conn} do
      user = create_user()
      task = create_task(user)

      conn = delete(conn, "/api/tasks/#{task.id}")
      assert json_response(conn, 401)["message"] == "Not authenticated"

      # Verify task still exists
      assert Repo.get(Task, task.id) != nil
    end

    test "returns not found when task does not exist", %{conn: conn} do
      user = create_user()

      conn = authenticated_conn(conn, user)
      conn = delete(conn, "/api/tasks/999999")

      assert json_response(conn, 404)["message"] == "Task not found"
    end

    test "returns not found when task belongs to another user", %{conn: conn} do
      user1 = create_user(%{email: "user1@example.com"})
      user2 = create_user(%{email: "user2@example.com"})
      task = create_task(user2)

      conn = authenticated_conn(conn, user1)
      conn = delete(conn, "/api/tasks/#{task.id}")

      assert json_response(conn, 404)["message"] == "Task not found"

      # Verify task still exists
      assert Repo.get(Task, task.id) != nil
    end
  end
end
