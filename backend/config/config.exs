import Config

# Configure Ecto repos
config :todo_list, ecto_repos: [TodoList.Repo]

# config/runtime.exs is executed for all environments, including
# during compilation. See config/runtime.exs for more information.

config :todo_list, TodoListWeb.Endpoint,
  url: [host: "localhost"],
  adapter: Phoenix.Endpoint.Cowboy2Adapter,
  render_errors: [
    formats: [json: TodoListWeb.ErrorJSON],
    layout: false
  ],
  pubsub_server: TodoList.PubSub,
  live_view: [signing_salt: "todo_list"]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{config_env()}.exs"
