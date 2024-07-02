class Task < ApplicationRecord
  #   enum :status, { todo: "To Do", in_progress: "In Progress", done: "Done" }
  # enum status: { todo: "To Do", in_progress: "In Progress", done: "Done" }
  STATUS = { "todo"=>"To Do", "in_progress"=>"In Progress", "done"=>"Done" }
  after_initialize :set_default_status, if: :new_record?

  def self.todo_tasks(total_tasks, todo_tasks)
    todo_tasks >= (total_tasks / 2.0).ceil ? true : false
  end

  private

  def set_default_status
    self.status ||= "To Do"
  end
end
