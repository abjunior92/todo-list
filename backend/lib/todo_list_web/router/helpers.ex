defmodule TodoListWeb.Router.Helpers do
  @moduledoc """
  This module provides helper functions for generating routes.
  """
  use Phoenix.VerifiedRoutes,
    endpoint: TodoListWeb.Endpoint,
    router: TodoListWeb.Router,
    statics: TodoListWeb.static_paths()
end
