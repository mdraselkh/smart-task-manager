"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Task } from "../lib/types";
import toast from "react-hot-toast";

export default function TaskForm({
  onSubmit,
  onCancel,
  defaultValues

}: {
  onSubmit: (data: any) => void;
  onCancel: () => void;
   defaultValues?: any;
}) {
  const [formData, setFormData] = useState({
    title: defaultValues?.title || "",
    description: defaultValues?.description || "",
    dueDate: defaultValues?.dueDate || "",
    status: defaultValues?.status || "pending",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStatusChange = (value: string) => {
    setFormData({ ...formData, status: value as "pending" | "completed" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onCancel();
    setFormData({ title: "", description: "", dueDate: "", status: "pending" });
  };

  const today = new Date().toLocaleDateString("en-CA");

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          name="title"
          className="focus:outline-none focus:ring-0"
          id="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          name="description"
          className="focus:outline-none focus:ring-0"
          id="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dueDate">Due Date</Label>
        <Input
          type="date"
          name="dueDate"
          id="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          min={today}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Status</Label>
        <Select onValueChange={handleStatusChange} value={formData.status}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent className="bg-white text-black">
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="submit"
          className="bg-black cursor-pointer text-white hover:bg-gray-800"
        >
          Submit
        </Button>
        <Button
          type="button"
          className="cursor-pointer"
          variant="ghost"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
