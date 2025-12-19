defmodule TodoListWeb.AuthControllerTest do
  use TodoListWeb.ConnCase

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
