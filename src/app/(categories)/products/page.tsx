"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCategoryStore } from "@/lib/store/categoryStore";
import { useAuth } from "@/lib/auth-context";

export default function ProductsPage() {
  const router = useRouter();
  const { selectedCategory } = useCategoryStore();
    const { user } = useAuth();
  useEffect(() => {
    if (user === null) {
        router.replace("/auth/login");
        return;
      }
    if (!selectedCategory) {
      router.replace("/categoryusingstore");
      router.replace("/categories");
    }
  }, [selectedCategory]);

  if (!selectedCategory) return null;

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">
        Products of <span className="font-bold uppercase text-red-400">{selectedCategory.name}</span> Category.
      </h1>

      {/* Product list based on selectedCategory.id */}
    </div>
  );
}