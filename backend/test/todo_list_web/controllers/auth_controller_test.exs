defmodule TodoListWeb.AuthControllerTest do
  use TodoListWeb.ConnCase

  alias TodoList.Accounts.User
  alias TodoList.Repo

  describe "POST /api/auth/signup" do
    test "creates user with valid data", %{conn: conn} do
      user_params = %{
        "firstName" => "Mario",
        "lastName" => "Rossi",
        "email" => "mario.rossi@example.com",
        "password" => "password123"
      }

      conn = post(conn, "/api/auth/signup", user_params)
      assert json_response(conn, 201)["message"] == "User created successfully"
      assert json_response(conn, 201)["user"]["email"] == "mario.rossi@example.com"
      assert json_response(conn, 201)["user"]["first_name"] == "Mario"
      assert json_response(conn, 201)["user"]["last_name"] == "Rossi"
      assert Map.has_key?(json_response(conn, 201)["user"], "id")
    end

    test "returns error when email is missing", %{conn: conn} do
      user_params = %{
        "firstName" => "Mario",
        "lastName" => "Rossi",
        "password" => "password123"
      }

      conn = post(conn, "/api/auth/signup", user_params)
      assert json_response(conn, 422)["message"] == "Validation failed"
      assert Map.has_key?(json_response(conn, 422)["errors"], "email")
    end

    test "returns error when password is too short", %{conn: conn} do
      user_params = %{
        "firstName" => "Mario",
        "lastName" => "Rossi",
        "email" => "mario.rossi@example.com",
        "password" => "short"
      }

      conn = post(conn, "/api/auth/signup", user_params)
      assert json_response(conn, 422)["message"] == "Validation failed"
      assert Map.has_key?(json_response(conn, 422)["errors"], "password")
    end

    test "returns error when email is invalid", %{conn: conn} do
      user_params = %{
        "firstName" => "Mario",
        "lastName" => "Rossi",
        "email" => "invalid-email",
        "password" => "password123"
      }

      conn = post(conn, "/api/auth/signup", user_params)
      assert json_response(conn, 422)["message"] == "Validation failed"
      assert Map.has_key?(json_response(conn, 422)["errors"], "email")
    end

    test "returns error when email already exists", %{conn: conn} do
      # Create a user first
      %User{}
      |> User.changeset(%{
        first_name: "Existing",
        last_name: "User",
        email: "existing@example.com",
        password: "password123"
      })
      |> Repo.insert!()

      user_params = %{
        "firstName" => "Mario",
        "lastName" => "Rossi",
        "email" => "existing@example.com",
        "password" => "password123"
      }

      conn = post(conn, "/api/auth/signup", user_params)
      assert json_response(conn, 422)["message"] == "Validation failed"
      assert Map.has_key?(json_response(conn, 422)["errors"], "email")
    end

    test "returns error when first name is missing", %{conn: conn} do
      user_params = %{
        "lastName" => "Rossi",
        "email" => "mario.rossi@example.com",
        "password" => "password123"
      }

      conn = post(conn, "/api/auth/signup", user_params)
      assert json_response(conn, 422)["message"] == "Validation failed"
      assert Map.has_key?(json_response(conn, 422)["errors"], "first_name")
    end

    test "returns error when last name is missing", %{conn: conn} do
      user_params = %{
        "firstName" => "Mario",
        "email" => "mario.rossi@example.com",
        "password" => "password123"
      }

      conn = post(conn, "/api/auth/signup", user_params)
      assert json_response(conn, 422)["message"] == "Validation failed"
      assert Map.has_key?(json_response(conn, 422)["errors"], "last_name")
    end
  end

  describe "POST /api/auth/login" do
    test "returns unauthorized when credentials are missing", %{conn: conn} do
      conn = post(conn, "/api/auth/login", %{})
      assert json_response(conn, 401)["message"] == "Invalid email or password"
    end

    test "returns unauthorized when email is missing", %{conn: conn} do
      conn = post(conn, "/api/auth/login", %{"password" => "password123"})
      assert json_response(conn, 401)["message"] == "Invalid email or password"
    end

    test "returns unauthorized when password is missing", %{conn: conn} do
      conn = post(conn, "/api/auth/login", %{"email" => "test@example.com"})
      assert json_response(conn, 401)["message"] == "Invalid email or password"
    end

    test "returns unauthorized when user does not exist", %{conn: conn} do
      conn = post(conn, "/api/auth/login", %{
        "email" => "nonexistent@example.com",
        "password" => "password123"
      })
      assert json_response(conn, 401)["message"] == "Invalid email or password"
    end

    test "returns unauthorized when password is incorrect", %{conn: conn} do
      # Create a user first
      %User{}
      |> User.changeset(%{
        first_name: "Mario",
        last_name: "Rossi",
        email: "mario.rossi@example.com",
        password: "correctpassword"
      })
      |> Repo.insert!()

      conn = post(conn, "/api/auth/login", %{
        "email" => "mario.rossi@example.com",
        "password" => "wrongpassword"
      })
      assert json_response(conn, 401)["message"] == "Invalid email or password"
    end

    test "returns user data when credentials are valid", %{conn: conn} do
      # Create a user first
      user = %User{}
      |> User.changeset(%{
        first_name: "Mario",
        last_name: "Rossi",
        email: "mario.rossi@example.com",
        password: "password123"
      })
      |> Repo.insert!()

      conn = post(conn, "/api/auth/login", %{
        "email" => "mario.rossi@example.com",
        "password" => "password123"
      })

      response = json_response(conn, 200)
      assert response["message"] == "Login successful"
      assert response["user"]["id"] == user.id
      assert response["user"]["email"] == "mario.rossi@example.com"
      assert response["user"]["first_name"] == "Mario"
      assert response["user"]["last_name"] == "Rossi"
    end
  end

  describe "POST /api/auth/logout" do
    test "returns logout successful message", %{conn: conn} do
      conn = post(conn, "/api/auth/logout", %{})
      assert json_response(conn, 200)["message"] == "Logout successful"
    end

    test "clears session on logout", %{conn: conn} do
      # Create a user and login first
      user = %User{}
      |> User.changeset(%{
        first_name: "Mario",
        last_name: "Rossi",
        email: "mario.rossi@example.com",
        password: "password123"
      })
      |> Repo.insert!()

      # Login
      conn = conn
      |> Plug.Test.init_test_session(%{})
      |> put_session(:user_id, user.id)

      # Logout
      conn = post(conn, "/api/auth/logout", %{})
      assert json_response(conn, 200)["message"] == "Logout successful"

      # Verify session is cleared by checking /api/auth/me
      conn = get(conn, "/api/auth/me")
      assert json_response(conn, 401)["message"] == "Not authenticated"
    end
  end

  describe "GET /api/auth/me" do
    test "returns unauthorized when not authenticated", %{conn: conn} do
      conn = get(conn, "/api/auth/me")
      assert json_response(conn, 401)["message"] == "Not authenticated"
    end

    test "returns user data when authenticated", %{conn: conn} do
      # Create a user
      user = %User{}
      |> User.changeset(%{
        first_name: "Mario",
        last_name: "Rossi",
        email: "mario.rossi@example.com",
        password: "password123"
      })
      |> Repo.insert!()

      # Authenticate
      conn = conn
      |> Plug.Test.init_test_session(%{})
      |> put_session(:user_id, user.id)

      conn = get(conn, "/api/auth/me")
      response = json_response(conn, 200)
      assert response["user"]["id"] == user.id
      assert response["user"]["email"] == "mario.rossi@example.com"
      assert response["user"]["first_name"] == "Mario"
      assert response["user"]["last_name"] == "Rossi"
    end

    test "returns unauthorized when user does not exist", %{conn: conn} do
      # Authenticate with non-existent user ID
      conn = conn
      |> Plug.Test.init_test_session(%{})
      |> put_session(:user_id, 999999)

      conn = get(conn, "/api/auth/me")
      assert json_response(conn, 401)["message"] == "User not found"
    end
  end
end
