import Config

config :todo_list, TodoListWeb.Endpoint,
  http: [
    ip: {0, 0, 0, 0, 0, 0, 0, 0},
    port: String.to_integer(System.get_env("PORT") || "4000")
  ],
  secret_key_base: System.get_env("SECRET_KEY_BASE")

config :todo_list, TodoList.Repo,
  username: System.get_env("DATABASE_USER") || "postgres",
  password: System.get_env("DATABASE_PASSWORD") || "postgres",
  hostname: System.get_env("DATABASE_HOST") || "db",
  database: System.get_env("DATABASE_NAME") || "todo_list_prod",
  pool_size: String.to_integer(System.get_env("POOL_SIZE") || "10")
