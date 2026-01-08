"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

// Force dynamic rendering since this page uses search params
export const dynamic = 'force-dynamic';

type Subcategory = {
  id: string;
  name: string;
  parent_id: string | null;
};

function SubcategoriesPage() {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('id');
  console.log(categoryId);
  const supabase = createClient();
  // shared dialog state
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");

  // form values
  const [name, setName] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  // Get Data
  async function LoadSubCategories(){
    const { data } = await supabase.from("subcategories").select("*").eq("category_id", categoryId);
    console.log(data);
    setSubcategories(data || []);
  }

  // Hook
  useEffect(() =>{
    LoadSubCategories();
  },[]);

  // CREATE or UPDATE — SAME BUTTON
  async function saveCategory() {
    if (!name.trim()) return;

    if (mode === "add") {
      // CREATE
      await supabase.from("subcategories").insert({ name, category_id: categoryId });
    } else if (mode === "edit" && editId) {
      // UPDATE
      await supabase.from("subcategories").update({ name }).eq("id", editId);
    }

    // reset
    setName("");
    setEditId(null);
    setOpen(false);

    LoadSubCategories();
  }

  // DELETE
  async function deleteCategory(id: string) {
    await supabase.from("subcategories").delete().eq("id", id);
    LoadSubCategories();
  }

  return (
    <div className="mx-auto p-4">
      <Card className="w-3/5 mx-auto p-4">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-2xl">Sub Categories</CardTitle>

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
                  {mode === "add" ? "Add Sub Category" : "Edit Sub Category"}
                </DialogTitle>
              </DialogHeader>

              <Input
                placeholder="Sub Category name"
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
              <TableHead className="border-r border-gray-300">Sub Category</TableHead>
              <TableHead className="border-r border-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {subcategories.map((cat) => (
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

export default function SubcategoriesPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SubcategoriesPage />
    </Suspense>
  );
}
