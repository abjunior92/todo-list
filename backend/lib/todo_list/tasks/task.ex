defmodule TodoList.Tasks.Task do
  use Ecto.Schema
  import Ecto.Changeset

  schema "tasks" do
    belongs_to :user, TodoList.Accounts.User
    field :description, :string
    field :scheduled_at, :naive_datetime
    field :completed, :boolean, default: false

    timestamps()
  end

  @doc false
  def changeset(task, attrs) do
    task
    |> cast(attrs, [:description, :scheduled_at, :completed, :user_id])
    |> validate_required([:description, :scheduled_at, :user_id])
    |> validate_length(:description, min: 1)
    |> foreign_key_constraint(:user_id)
  end
end
