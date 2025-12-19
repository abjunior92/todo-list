defmodule TodoList.DataCase do
  @moduledoc """
  This module defines the setup for tests requiring
  access to the application's data layer.

  You may define functions here to be used as helpers in
  your tests.
  """

  use ExUnit.CaseTemplate

  using do
    quote do
      alias TodoList.Repo

      import Ecto
      import Ecto.Changeset
      import Ecto.Query
      import TodoList.DataCase
    end
  end

  setup tags do
    TodoList.DataCase.setup_sandbox(tags)
    :ok
  end

  @doc """
  Sets up the sandbox and allows concurrent tests.
  """
  def setup_sandbox(tags) do
    pid = Ecto.Adapters.SQL.Sandbox.start_owner!(TodoList.Repo, shared: not tags[:async])
    on_exit(fn -> Ecto.Adapters.SQL.Sandbox.stop_owner(pid) end)
  end
end
