# app/controllers/tasks_controller.rb

class TasksController < ApplicationController
  def index
    if params[:status] && params[:status] != "All"
      @tasks = Task.where(status: params[:status])
    else
      @tasks = Task.all
      #@tasks = Task.take(3)
    end
    render json: @tasks
  end

  def create
    total_tasks = Task.count
    todo_tasks = Task.where(status: "To Do").count

    if task_params[:status] == "To Do" && Task.todo_tasks(total_tasks, todo_tasks)
      render json: { error: "Cannot create new task" }, status: :unprocessable_entity
    else
      @task = Task.new(task_params)
      if @task.save
        render json: @task
      else
        render json: @task.errors, status: :unprocessable_entity
      end
    end
  end

  def update
    @task = Task.find(params[:id])
    if @task.update(task_params)
      render json: @task
    else
      render json: @task.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @task = Task.find(params[:id])
    @task.destroy
    head :no_content
  end

  private

  def task_params
    params.require(:task).permit(:title, :description, :status)
  end
end
