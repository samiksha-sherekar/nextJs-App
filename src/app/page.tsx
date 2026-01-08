import CategoriesPage from "./categories/page";
import CategoriesStorePage from "./categoryusingstore/page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Category Management</h1>
      <Tabs defaultValue="direct" className="w-4/5 mx-auto p-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="direct">Direct Supabase</TabsTrigger>
          <TabsTrigger value="store">Using Store</TabsTrigger>
        </TabsList>

        <TabsContent value="direct" className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-blue-900 mb-2">Direct Supabase Implementation</h3>
            <p className="text-blue-800 text-sm">
              This component uses direct Supabase database calls for CRUD operations.
              Subcategories are accessed via routing navigation.

            </p>
          </div>
          <CategoriesPage />
        </TabsContent>

        <TabsContent value="store" className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-green-900 mb-2">Store-Based Implementation</h3>
            <p className="text-green-800 text-sm">
              This component uses Zustand store for state management. All category data is managed through the store with automatic state synchronization.
             
            </p>
          </div>
          <CategoriesStorePage />
        </TabsContent>
      </Tabs>
    </div>
  );
}
