defmodule TodoList.Application do
  use Application

  @impl true
  def start(_type, _args) do
    children = [
      TodoList.Repo,
      {DNSCluster, query: Application.get_env(:todo_list, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: TodoList.PubSub},
      {Finch, name: TodoList.Finch},
      TodoListWeb.Endpoint
    ]

    opts = [strategy: :one_for_one, name: TodoList.Supervisor]
    Supervisor.start_link(children, opts)
  end

  @impl true
  def config_change(changed, _new, removed) do
    TodoListWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
