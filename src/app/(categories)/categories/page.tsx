"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCategoryStore } from "@/lib/store/categoryStore";
import {
  Table,
  TableBody,
  TableCaption,
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
import { createClient } from "@/supabase/client";
import { useAuth } from "@/lib/auth-context";

type Category = {
  id: string;
  name: string;
};

export default function CategoriesPage() {
  const supabase = createClient();
  const router = useRouter();
  const { user } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const { setSelectedCategory } = useCategoryStore();
  // shared dialog state
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");

  // form values
  const [name, setName] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  // READ
  async function loadCategories() {
    if (!user) return;

    const { data } = await supabase
      .from("categories")
      .select("*")
      .eq("user_email", user.email)
      .order("created_at", { ascending: false });

    setCategories(data || []);
  }

 useEffect(() => {
    if (user === null) {
      router.replace("/auth/login");
      return;
    }

    if (user) {
      loadCategories();
    }
  }, [user]);

  // CREATE or UPDATE — SAME BUTTON
  async function saveCategory() {
    if (!name.trim() || !user) return;

    if (mode === "add") {
      // CREATE
      await supabase.from("categories").insert({ name, user_email: user.email });
    } else if (mode === "edit" && editId) {
      // UPDATE
      await supabase.from("categories").update({ name }).eq("id", editId);
    }

    // reset
    setName("");
    setEditId(null);
    setOpen(false);

    loadCategories();
  }

  // DELETE
  async function deleteCategory(id: string) {
    await supabase.from("categories").delete().eq("id", id);
    loadCategories();
  }

  return (
    <div className="mx-auto p-4">
      <Card className="w-full mx-auto p-4">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-2xl">Categories</CardTitle>

          {/* ADD button opens dialog in add mode */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setMode("add");
                  setName("");
                  setEditId(null);
                }}
              >
                Add
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {mode === "add" ? "Add Category" : "Edit Category"}
                </DialogTitle>
              </DialogHeader>

              <Input
                placeholder="Category name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Button onClick={saveCategory}>
                {mode === "add" ? "Create" : "Update"}
              </Button>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <Table className="border-collapse border border-gray-300">
          {/* <TableCaption>A list of categories.</TableCaption> */}

          <TableHeader>
            <TableRow>
              <TableHead className="border-r border-gray-300">Category</TableHead>
              <TableHead className="border-r border-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell className="font-medium border-r border-gray-300">
                  {cat.name}
                </TableCell>

                <TableCell className="border-r border-gray-300 space-x-2">

                  {/* EDIT uses same dialog */}
                  <Button
                    variant="outline"
                    onClick={() => {
                      setMode("edit");
                      setName(cat.name);
                      setEditId(cat.id);
                      setOpen(true);
                    }}
                  >
                    Edit
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={() => deleteCategory(cat.id)}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/subcategories?id=${cat.id}`)}
                  >
                    Sub Category with Query params routing
                  </Button>
                  <Button
                    key={cat.id}
                    variant="outline"
                    onClick={() => {
                      setSelectedCategory(cat);
                      router.push('/products');
                    }}
                  >
                    Products (Without useing query params routing)
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
