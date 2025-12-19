defmodule TodoListWeb.AuthController do
  use TodoListWeb, :controller

  def login(conn, _params) do
    # TODO: Implementare login
    json(conn, %{message: "Login endpoint"})
  end

  def logout(conn, _params) do
    # TODO: Implementare logout
    json(conn, %{message: "Logout endpoint"})
  end
end
