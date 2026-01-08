"use client";

import { useEffect, useState } from "react";
// import { useCategoryStore } from "@lib/store/categoryStore";
import { useCategoryStore } from "@/lib/store/categoryStore";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";


export default function CategoryusingstorePage() {
  const { categories, load, add, update, remove } = useCategoryStore();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function handleSave() {
    if (!name.trim()) return;

    if (editId) {
      await update(editId, name);
    } else {
      await add(name);
    }

    setName("");
    setEditId(null);
    setOpen(false);
  }

  return (
    <div className="mx-auto p-4">
      <Card className="w-full mx-auto p-4">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-2xl">Categories</CardTitle>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditId(null);
                  setName("");
                }}
              >
                Add Category
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editId ? "Edit Category" : "Add Category"}
                </DialogTitle>
              </DialogHeader>

              <Input
                placeholder="Category name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Button onClick={handleSave}>Save</Button>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {categories.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.name}</TableCell>

                <TableCell className="space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditId(c.id);
                      setName(c.name);
                      setOpen(true);
                    }}
                  >
                    Edit
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={() => remove(c.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
