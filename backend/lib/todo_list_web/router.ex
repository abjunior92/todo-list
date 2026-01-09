defmodule TodoListWeb.Router do
  use TodoListWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", TodoListWeb do
    pipe_through :api

    post "/auth/signup", AuthController, :signup
    post "/auth/login", AuthController, :login
    post "/auth/logout", AuthController, :logout
  end
end
