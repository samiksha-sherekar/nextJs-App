import { create } from "zustand";
import { createClient } from "@/supabase/client";

type Category = {
  id: string;
  name: string;
};

type CategoryState = {
  categories: Category[];
  loading: boolean;

  load: (userId?: string) => Promise<void>;
  add: (name: string, userId?: string) => Promise<void>;
  update: (id: string, name: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
};

export const useCategoryStore = create<CategoryState>((set, get) => {
  const supabase = createClient();

  return {
    categories: [],
    loading: false,

    // READ
    load: async (userEmail?: string) => {
      set({ loading: true });

      let query = supabase
        .from("categories")
        .select("*")
        .order("created_at", { ascending: false });

      if (userEmail) {
        query = query.eq("user_email", userEmail);
      }

      const { data } = await query;

      set({ categories: data || [], loading: false });
    },

    // CREATE
    add: async (name, userEmail?: string) => {
      const insertData: any = { name };
      if (userEmail) {
        insertData.user_email = userEmail;
      }

      const { data } = await supabase
        .from("categories")
        .insert(insertData)
        .select()
        .single();

      if (data) {
        set({ categories: [data, ...get().categories] });
      }
    },

    // UPDATE
    update: async (id, name) => {
      await supabase.from("categories").update({ name }).eq("id", id);

      set({
        categories: get().categories.map((c) =>
          c.id === id ? { ...c, name } : c
        ),
      });
    },

    // DELETE
    remove: async (id) => {
      await supabase.from("categories").delete().eq("id", id);

      set({
        categories: get().categories.filter((c) => c.id !== id),
      });
    },
  };
});
