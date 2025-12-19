defmodule TodoList.PubSub do
  @moduledoc """
  PubSub module for the application.
  """
  use Phoenix.PubSub, otp_app: :todo_list
end
