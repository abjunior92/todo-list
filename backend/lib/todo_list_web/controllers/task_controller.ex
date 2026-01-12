defmodule TodoListWeb.TaskController do
  use TodoListWeb, :controller

  alias TodoList.Tasks.Task
  alias TodoList.Repo
  import Ecto.Query

  def index(conn, params) do
    conn = fetch_session(conn)
    user_id = get_session(conn, :user_id)

    case user_id do
      nil ->
        conn
        |> put_status(:unauthorized)
        |> json(%{message: "Not authenticated"})

      id ->
        query = from(t in Task, where: t.user_id == ^id)

        # Filtro per data se fornito
        query =
          case params["date"] do
            nil -> query
            date_str ->
              case Date.from_iso8601(date_str) do
                {:ok, date} ->
                  from(t in query,
                    where: fragment("DATE(?)", t.scheduled_at) == ^date
                  )
                _ -> query
              end
          end

        # Filtro per completed se fornito
        query =
          case params["completed"] do
            nil -> query
            "true" -> from(t in query, where: t.completed == true)
            "false" -> from(t in query, where: t.completed == false)
            _ -> query
          end

        # Ordinamento per scheduled_at
        query = from(t in query, order_by: [asc: t.scheduled_at])

        tasks = Repo.all(query)

        conn
        |> put_status(:ok)
        |> json(%{
          tasks: Enum.map(tasks, &format_task/1)
        })
    end
  end

  def show(conn, %{"id" => id}) do
    conn = fetch_session(conn)
    user_id = get_session(conn, :user_id)

    case user_id do
      nil ->
        conn
        |> put_status(:unauthorized)
        |> json(%{message: "Not authenticated"})

      uid ->
        case Repo.get_by(Task, id: id, user_id: uid) do
          nil ->
            conn
            |> put_status(:not_found)
            |> json(%{message: "Task not found"})

          task ->
            conn
            |> put_status(:ok)
            |> json(%{task: format_task(task)})
        end
    end
  end

  def create(conn, params) do
    conn = fetch_session(conn)
    user_id = get_session(conn, :user_id)

    case user_id do
      nil ->
        conn
        |> put_status(:unauthorized)
        |> json(%{message: "Not authenticated"})

      uid ->
        # Map camelCase params from frontend to snake_case for the model
        task_params = %{
          "description" => params["description"],
          "scheduled_at" => parse_datetime(params["scheduledAt"]),
          "completed" => params["completed"] || false,
          "user_id" => uid
        }

        case create_task(task_params) do
          {:ok, task} ->
            conn
            |> put_status(:created)
            |> json(%{
              message: "Task created successfully",
              task: format_task(task)
            })

          {:error, changeset} ->
            conn
            |> put_status(:unprocessable_entity)
            |> json(%{
              message: "Validation failed",
              errors: translate_errors(changeset)
            })
        end
    end
  end

  def update(conn, %{"id" => id} = params) do
    conn = fetch_session(conn)
    user_id = get_session(conn, :user_id)

    case user_id do
      nil ->
        conn
        |> put_status(:unauthorized)
        |> json(%{message: "Not authenticated"})

      uid ->
        case Repo.get_by(Task, id: id, user_id: uid) do
          nil ->
            conn
            |> put_status(:not_found)
            |> json(%{message: "Task not found"})

          task ->
            # Map camelCase params from frontend to snake_case for the model
            task_params =
              %{}
              |> maybe_put("description", params["description"])
              |> maybe_put("scheduled_at", parse_datetime(params["scheduledAt"]))
              |> maybe_put_if_key("completed", params, "completed")

            case update_task(task, task_params) do
              {:ok, updated_task} ->
                conn
                |> put_status(:ok)
                |> json(%{
                  message: "Task updated successfully",
                  task: format_task(updated_task)
                })

              {:error, changeset} ->
                conn
                |> put_status(:unprocessable_entity)
                |> json(%{
                  message: "Validation failed",
                  errors: translate_errors(changeset)
                })
            end
        end
    end
  end

  def delete(conn, %{"id" => id}) do
    conn = fetch_session(conn)
    user_id = get_session(conn, :user_id)

    case user_id do
      nil ->
        conn
        |> put_status(:unauthorized)
        |> json(%{message: "Not authenticated"})

      uid ->
        case Repo.get_by(Task, id: id, user_id: uid) do
          nil ->
            conn
            |> put_status(:not_found)
            |> json(%{message: "Task not found"})

          task ->
            case Repo.delete(task) do
              {:ok, _task} ->
                conn
                |> put_status(:ok)
                |> json(%{message: "Task deleted successfully"})

              {:error, changeset} ->
                conn
                |> put_status(:unprocessable_entity)
                |> json(%{
                  message: "Failed to delete task",
                  errors: translate_errors(changeset)
                })
            end
        end
    end
  end

  defp create_task(params) do
    %Task{}
    |> Task.changeset(params)
    |> Repo.insert()
  end

  defp update_task(task, params) do
    task
    |> Task.changeset(params)
    |> Repo.update()
  end

  defp format_task(task) do
    %{
      id: task.id,
      description: task.description,
      scheduledAt: NaiveDateTime.to_iso8601(task.scheduled_at),
      completed: task.completed,
      userId: task.user_id,
      insertedAt: NaiveDateTime.to_iso8601(task.inserted_at),
      updatedAt: NaiveDateTime.to_iso8601(task.updated_at)
    }
  end

  defp parse_datetime(nil), do: nil
  defp parse_datetime(datetime_str) when is_binary(datetime_str) do
    # Prova prima come NaiveDateTime (ISO8601 completo)
    case NaiveDateTime.from_iso8601(datetime_str) do
      {:ok, datetime} -> datetime
      _ ->
        # Se fallisce, prova come Date e converti in NaiveDateTime
        case Date.from_iso8601(datetime_str) do
          {:ok, date} -> NaiveDateTime.new!(date, ~T[00:00:00])
          _ -> nil
        end
    end
  end
  defp parse_datetime(_), do: nil

  defp maybe_put(map, _key, nil), do: map
  defp maybe_put(map, key, value), do: Map.put(map, key, value)

  defp maybe_put_if_key(map, key, params, param_key) do
    if Map.has_key?(params, param_key) do
      Map.put(map, key, params[param_key])
    else
      map
    end
  end

  defp translate_errors(changeset) do
    Ecto.Changeset.traverse_errors(changeset, fn {msg, opts} ->
      Enum.reduce(opts, msg, fn {key, value}, acc ->
        String.replace(acc, "%{#{key}}", to_string(value))
      end)
    end)
  end
end
