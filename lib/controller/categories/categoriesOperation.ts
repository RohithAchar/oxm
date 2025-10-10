"use server";

import { createClient } from "@/utils/supabase/server";

export const getCategories = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
};

export const getCategoriesWithChildren = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    throw error;
  }

  // Organize categories into parent-child structure
  const parentCategories = data.filter((cat) => cat.parent_id === null);
  const childCategories = data.filter((cat) => cat.parent_id !== null);

  const categoriesWithChildren = parentCategories.map((parent) => ({
    ...parent,
    children: childCategories.filter((child) => child.parent_id === parent.id),
  }));

  return categoriesWithChildren;
};
