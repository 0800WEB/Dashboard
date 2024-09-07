"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Coffee,
  Gift,
  Home,
  Package,
  Search,
  ShoppingCart,
  Users,
  Filter,
  Plus,
  Trash2,
  Edit,
} from "lucide-react";
import { Input } from "@/components/ui/input";
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
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { SERVER_URI, _retrieveData } from "@/lib/utils";
import axios from "axios";
import { useToast } from "@/app/ToastContext";
import { Category, NewCategory } from "./interfaces";
import Image from "next/image";
export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null
  );
  const [newCategory, setNewCategory] = useState<NewCategory>({
    name: "",
    description: "",
    image: "",
  });
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get<Category[]>(`${SERVER_URI}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  };

  const handleAddCategory = async () => {
    console.log(newCategory);
    try {
      const token = await _retrieveData({ key: "token" });
      const response = await axios.post<{ category: Category }>(
        `${SERVER_URI}/categories`,
        newCategory,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCategories([...categories, response.data.category]);
      setNewCategory({ name: "", description: "", image: "" });
      setIsAddCategoryDialogOpen(false);
      if (toast && toast.current) {
      toast.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Categoría creada con éxito.",
        life: 3000,
      });
    }
    } catch (error) {
      console.error("Error al crear la categoría:", error);
      if (toast && toast.current) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo crear la categoría. Intente nuevamente.",
        life: 3000,
      });
    }
    }
  };

  const handleEditCategory = async () => {
    try {
      if (editingCategory) {
        const token = await _retrieveData({ key: "token" });
        const response = await axios.put<{ category: Category }>(
          `${SERVER_URI}/categories/${editingCategory._id}`,
          editingCategory,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCategories(
          categories.map((c) =>
            c._id === editingCategory._id ? response.data.category : c
          )
        );
        setEditingCategory(null);
        if(toast && toast.current){
          toast.current.show({
            severity: "success",
            summary: "Éxito",
            detail: "Categoría actualizada con éxito.",
            life: 3000,
          });
        }
      }
    } catch (error) {
      console.error("Error al actualizar la categoría:", error);
      if(toast && toast.current){
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo actualizar la categoría. Intente nuevamente.",
        life: 3000,
      });
    }
    }
  };

  const handleDeleteCategory = async () => {
    try {
      if (deletingCategory) {
        const token = await _retrieveData({ key: "token" });
        await axios.delete(`${SERVER_URI}/categories/${deletingCategory._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategories(categories.filter((c) => c._id !== deletingCategory._id));
        setDeletingCategory(null);
      if(toast && toast.current){
        toast.current.show({
          severity: "success",
          summary: "Éxito",
          detail: "Categoría eliminada con éxito.",
          life: 3000,
        });
      }
      }
    } catch (error) {
      console.error("Error al eliminar la categoría:", error);
      if(toast && toast.current){
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo eliminar la categoría. Intente nuevamente.",
        life: 3000,
      });
    }
  }
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 w-full flex flex-col">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categorías</h1>
          <p className="text-gray-600">Administra tus categorías</p>
        </div>
      </header>

      {/* Search and Filter */}
      <div className="mb-6 flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={() => setIsAddCategoryDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Añadir Categoría
        </Button>
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Buscar categorías..."
            className="pl-10 pr-4 rounded-full bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Categories Table */}
      <div
        className="rounded-lg border shadow bg-white flex-1"
        style={{ backgroundColor: "#fff" }}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Imagen</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.map((category) => (
              <TableRow key={category._id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>
                  <Image
                    width={20}
                    height={20}
                    src={
                      category.image && category.image.includes("https")
                        ? category.image
                        : "/logo.png" // Fallback si la URL es incorrecta o falta
                    }
                    alt={category.name}
                    className="h-10 w-10 object-cover"
                  />
                </TableCell>
                <TableCell className="flex gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingCategory(category)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeletingCategory(category)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Create Category Modal */}
      <Dialog
        open={isAddCategoryDialogOpen}
        onOpenChange={setIsAddCategoryDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Añadir Categoría</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nombre
              </Label>
              <Input
                id="name"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Descripción
              </Label>
              <Input
                id="description"
                value={newCategory.description}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    description: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Imagen URL
              </Label>
              <Input
                id="image"
                value={newCategory.image}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, image: e.target.value })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddCategory}>Crear Categoría</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Modal */}
      {editingCategory && (
        <Dialog
          open={!!editingCategory}
          onOpenChange={() => setEditingCategory(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Categoría</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="edit-name"
                  value={editingCategory.name}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      name: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  Descripción
                </Label>
                <Input
                  id="edit-description"
                  value={editingCategory.description}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      description: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-image" className="text-right">
                  Imagen URL
                </Label>
                <Input
                  id="edit-image"
                  value={editingCategory.image}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      image: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleEditCategory}>Guardar Cambios</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Modal */}
      {deletingCategory && (
        <Dialog
          open={!!deletingCategory}
          onOpenChange={() => setDeletingCategory(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Eliminación</DialogTitle>
              <p>
                ¿Estás seguro de que deseas eliminar la categoría &quot;
                {deletingCategory.name}&quot;? Esta acción no se puede
                deshacer.
              </p>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeletingCategory(null)}
              >
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDeleteCategory}>
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
