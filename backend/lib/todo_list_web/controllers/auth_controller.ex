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

  def login(conn, params) do
    email = params["email"]
    password = params["password"]

    case authenticate_user(email, password) do
      {:ok, user} ->
        conn
        |> fetch_session()
        |> put_session(:user_id, user.id)
        |> put_status(:ok)
        |> json(%{
          message: "Login successful",
          user: %{
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email
          }
        })

      {:error, :invalid_credentials} ->
        conn
        |> put_status(:unauthorized)
        |> json(%{
          message: "Invalid email or password"
        })
    end
  end

  def me(conn, _params) do
    conn = fetch_session(conn)
    user_id = get_session(conn, :user_id)

    case user_id do
      nil ->
        conn
        |> put_status(:unauthorized)
        |> json(%{message: "Not authenticated"})

      id ->
        case Repo.get(User, id) do
          nil ->
            conn
            |> put_status(:unauthorized)
            |> json(%{message: "User not found"})

          user ->
            conn
            |> put_status(:ok)
            |> json(%{
              user: %{
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email
              }
            })
        end
    end
  end

  def logout(conn, _params) do
    conn
    |> fetch_session()
    |> clear_session()
    |> put_status(:ok)
    |> json(%{message: "Logout successful"})
  end

  defp create_user(params) do
    %User{}
    |> User.changeset(params)
    |> Repo.insert()
  end

  defp authenticate_user(email, password) when is_binary(email) and is_binary(password) do
    case Repo.get_by(User, email: email) do
      nil ->
        # Simula il tempo di verifica per prevenire timing attacks
        Bcrypt.no_user_verify()
        {:error, :invalid_credentials}

      user ->
        if Bcrypt.verify_pass(password, user.password_hash) do
          {:ok, user}
        else
          {:error, :invalid_credentials}
        end
    end
  end

  defp authenticate_user(_, _), do: {:error, :invalid_credentials}

  defp translate_errors(changeset) do
    Ecto.Changeset.traverse_errors(changeset, fn {msg, opts} ->
      Enum.reduce(opts, msg, fn {key, value}, acc ->
        String.replace(acc, "%{#{key}}", to_string(value))
      end)
    end)
  end
end
