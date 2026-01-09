defmodule TodoListWeb.Router do
  use TodoListWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
    plug CORSPlug,
      origin: ["http://localhost:3000", "http://frontend:3000"],
      credentials: true
  end

  scope "/api", TodoListWeb do
    pipe_through :api

    post "/auth/signup", AuthController, :signup
    post "/auth/login", AuthController, :login
    post "/auth/logout", AuthController, :logout
  end
end
