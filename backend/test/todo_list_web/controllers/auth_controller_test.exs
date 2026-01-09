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
    test "returns login endpoint message", %{conn: conn} do
      conn = post(conn, "/api/auth/login", %{})
      assert json_response(conn, 200) == %{"message" => "Login endpoint"}
    end
  end

  describe "POST /api/auth/logout" do
    test "returns logout endpoint message", %{conn: conn} do
      conn = post(conn, "/api/auth/logout", %{})
      assert json_response(conn, 200) == %{"message" => "Logout endpoint"}
    end
  end
end
