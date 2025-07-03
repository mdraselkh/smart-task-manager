"use client";
import { useEffect, useState } from "react";
import { Task } from "./lib/types";
import toast from "react-hot-toast";
import { v4 as uuid } from "uuid";
import { TaskTable } from "./components/TaskTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TaskForm from "./components/TaskForm";

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTaskId, setLoadingTaskId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) {
      setTasks(JSON.parse(saved));
    }
  }, []);

  const handleAddTask = (data: any) => {
    const updatedTasks = editingTask
      ? tasks.map((t) => (t.id === editingTask.id ? { ...t, ...data } : t))
      : [...tasks, { id: uuid(), ...data, subtasks: [] }];

    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));

    toast.success(editingTask ? "Task updated!" : "Task added!");
    setEditingTask(null);
    setOpen(false);
  };

  const handleEdit = (task: Task) => {
    console.log(task);
    setEditingTask(task);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    const updated = tasks.filter((task) => task.id !== id);

    setTasks(updated);
    localStorage.setItem("tasks", JSON.stringify(updated));
    toast.success("Task deleted!");
  };

  const generateSubtasks = async (task: Task) => {
    const toastId = toast.loading("Generating subtasks...");
    setLoadingTaskId(task.id);

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskTitle: task.title,
          taskDescription: task.description,
        }),
      });

      const data = await res.json();
      const raw = data?.subtasks || "";

      const suggestions = raw
        .split(",")
        .map((s: string) => s.trim())
        .filter((s: any) => s.length > 0);

      if (!suggestions.length) throw new Error("No valid subtasks found");

      const updated = tasks.map((t) =>
        t.id === task.id ? { ...t, subtasks: suggestions } : t
      );

      setTasks(updated);
      localStorage.setItem("tasks", JSON.stringify(updated));
      toast.success("Subtasks generated!");
      toast.dismiss(toastId);
    } catch (err) {
      console.error(err);
      toast.dismiss(toastId);
      toast.error("Failed to generate subtasks.");
    } finally {
      setLoadingTaskId(null);
    }
  };

  return (
    <main className=" bg-black text-white min-h-screen">
      <div className="container mx-auto max-w-7xl px-6 py-8 md:p-10">
        <h1 className="text-2xl md:text-4xl font-bold mb-4">Smart Task Manager</h1>
        <TaskTable
          data={tasks}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSuggest={generateSubtasks}
          onAdd={handleAddTask}
          loading={loadingTaskId}
        />

        <Dialog
          open={open}
          onOpenChange={(val) => {
            setOpen(val);
            if (!val) setEditingTask(null);
          }}
        >
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>
                {editingTask ? "Update Task" : "Add New Task"}
              </DialogTitle>
            </DialogHeader>

            <TaskForm
              onSubmit={handleAddTask}
              onCancel={() => {
                setOpen(false);
                setEditingTask(null);
              }}
              defaultValues={editingTask} // 👈 pre-fill form
            />
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
