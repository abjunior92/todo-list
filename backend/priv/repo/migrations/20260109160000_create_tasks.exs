defmodule TodoList.Repo.Migrations.CreateTasks do
  use Ecto.Migration

  def change do
    create table(:tasks) do
      add :user_id, references(:users, on_delete: :delete_all), null: false
      add :description, :text, null: false
      add :scheduled_at, :naive_datetime, null: false
      add :completed, :boolean, default: false, null: false

      timestamps()
    end

    create index(:tasks, [:user_id])
    create index(:tasks, [:scheduled_at])
    create index(:tasks, [:completed])
  end
end
