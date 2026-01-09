defmodule TodoListWeb.AuthController do
  use TodoListWeb, :controller

  alias TodoList.Accounts.User
  alias TodoList.Repo

  def signup(conn, params) do
    # Map camelCase params from frontend to snake_case for the model
    user_params = %{
      "first_name" => params["firstName"],
      "last_name" => params["lastName"],
      "email" => params["email"],
      "password" => params["password"]
    }

    case create_user(user_params) do
      {:ok, user} ->
        conn
        |> put_status(:created)
        |> json(%{
          message: "User created successfully",
          user: %{
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email
          }
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

  def login(conn, _params) do
    # TODO: Implementare login
    json(conn, %{message: "Login endpoint"})
  end

  def logout(conn, _params) do
    # TODO: Implementare logout
    json(conn, %{message: "Logout endpoint"})
  end

  defp create_user(params) do
    %User{}
    |> User.changeset(params)
    |> Repo.insert()
  end

  defp translate_errors(changeset) do
    Ecto.Changeset.traverse_errors(changeset, fn {msg, opts} ->
      Enum.reduce(opts, msg, fn {key, value}, acc ->
        String.replace(acc, "%{#{key}}", to_string(value))
      end)
    end)
  end
end
