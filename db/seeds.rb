# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end
Task.destroy_all
ActiveRecord::Base.connection.reset_pk_sequence!('tasks')

# Create sample tasks
tasks = [
  { title: 'Task 1', description: 'Description for Task 1', status: Task::STATUS["todo"] },
  { title: 'Task 2', description: 'Description for Task 2', status: Task::STATUS["todo"] },
  { title: 'Task 3', description: 'Description for Task 3', status: Task::STATUS["in_progress"] },
  { title: 'Task 4', description: 'Description for Task 4', status: Task::STATUS["in_progress"] },
  { title: 'Task 5', description: 'Description for Task 5', status: Task::STATUS["done"] }
  # Add more tasks as needed
]
# tasks = [
#   { title: 'Task 1', description: 'Description for Task 1', status: Task.statuses["todo"] },
#   { title: 'Task 2', description: 'Description for Task 2', status: Task.statuses["todo"] },
#   { title: 'Task 3', description: 'Description for Task 3', status: Task.statuses["in_progress"] },
#   { title: 'Task 4', description: 'Description for Task 4', status: Task.statuses["in_progress"] },
#   { title: 'Task 5', description: 'Description for Task 5', status: Task.statuses["done"] }
#   # Add more tasks as needed
# ]

# Create tasks in the database
tasks.each do |task_params|
  Task.create!(title: task_params[:title], description: task_params[:description], status: task_params[:status])
end
