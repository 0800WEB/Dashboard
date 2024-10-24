"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
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
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { SERVER_URI, _retrieveData } from "@/lib/utils";
import axios from "axios";
import { useToast } from "@/app/ToastContext";
import Image from "next/image";

interface Banner {
  _id: string;
  name: string;
  image: string;
}

interface NewBanner {
  name: string;
  image: string;
}

export default function Banners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [deletingBanner, setDeletingBanner] = useState<Banner | null>(null);
  const [newBanner, setNewBanner] = useState<NewBanner>({
    name: "",
    image: "",
  });
  const [isAddBannerDialogOpen, setIsAddBannerDialogOpen] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await axios.get<Banner[]>(`${SERVER_URI}/banners`);
      setBanners(response.data);
    } catch (error) {
      console.error("Error al obtener los banners:", error);
    }
  };

  const handleAddBanner = async () => {
    try {
      const token = await _retrieveData({ key: "token" });
      const response = await axios.post<{ banner: Banner }>(
        `${SERVER_URI}/banners`,
        newBanner,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBanners([...banners, response.data.banner]);
      setNewBanner({ name: "", image: "" });
      setIsAddBannerDialogOpen(false);
      if (toast && toast.current) {
        toast.current.show({
          severity: "success",
          summary: "Éxito",
          detail: "Banner creado con éxito.",
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Error al crear el banner:", error);
      if (toast && toast.current) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "No se pudo crear el banner. Intente nuevamente.",
          life: 3000,
        });
      }
    }
  };

  const handleEditBanner = async () => {
    try {
      if (editingBanner) {
        const token = await _retrieveData({ key: "token" });
        console.log(token)
        const response = await axios.put<{ banner: Banner }>(
          `${SERVER_URI}/banners/${editingBanner._id}`,
          editingBanner,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBanners(
          banners.map((b) =>
            b._id === editingBanner._id ? response.data.banner : b
          )
        );
        setEditingBanner(null);
        if (toast && toast.current) {
          toast.current.show({
            severity: "success",
            summary: "Éxito",
            detail: "Banner actualizado con éxito.",
            life: 3000,
          });
        }
      }
    } catch (error) {
      console.error("Error al actualizar el banner:", error);
      if (toast && toast.current) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "No se pudo actualizar el banner. Intente nuevamente.",
          life: 3000,
        });
      }
    }
  };

  const handleDeleteBanner = async () => {
    try {
      if (deletingBanner) {
        const token = await _retrieveData({ key: "token" });
        await axios.delete(`${SERVER_URI}/banners/${deletingBanner._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBanners(banners.filter((b) => b._id !== deletingBanner._id));
        setDeletingBanner(null);
        if (toast && toast.current) {
          toast.current.show({
            severity: "success",
            summary: "Éxito",
            detail: "Banner eliminado con éxito.",
            life: 3000,
          });
        }
      }
    } catch (error) {
      console.error("Error al eliminar el banner:", error);
      if (toast && toast.current) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "No se pudo eliminar el banner. Intente nuevamente.",
          life: 3000,
        });
      }
    }
  };

  const filteredBanners = banners.filter((banner) =>
    banner.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 w-full flex flex-col">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Banners</h1>
          <p className="text-gray-600">Administra tus banners promocionales</p>
        </div>
      </header>

      {/* Search and Add */}
      <div className="mb-6 flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={() => setIsAddBannerDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Añadir Banner
        </Button>
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Buscar banners..."
            className="pl-10 pr-4 rounded-full bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Banners Table */}
      <div
        className="rounded-lg border shadow bg-white flex-1"
        style={{ backgroundColor: "#fff" }}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Imagen</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBanners.map((banner) => (
              <TableRow key={banner._id}>
                <TableCell className="font-medium">{banner.name}</TableCell>
                <TableCell>
                <img
  src={banner.image}
  alt={banner.name}
  width={200}
  height={100}
  className="h-20 w-40 object-cover"
/>

                </TableCell>
                <TableCell className="flex gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingBanner(banner)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeletingBanner(banner)}
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

      {/* Create Banner Modal */}
      <Dialog
        open={isAddBannerDialogOpen}
        onOpenChange={setIsAddBannerDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Añadir Banner</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nombre
              </Label>
              <Input
                id="name"
                value={newBanner.name}
                onChange={(e) =>
                  setNewBanner({ ...newBanner, name: e.target.value })
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
                value={newBanner.image}
                onChange={(e) =>
                  setNewBanner({ ...newBanner, image: e.target.value })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddBanner}>Crear Banner</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Banner Modal */}
      {editingBanner && (
        <Dialog
          open={!!editingBanner}
          onOpenChange={() => setEditingBanner(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Banner</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="edit-name"
                  value={editingBanner.name}
                  onChange={(e) =>
                    setEditingBanner({
                      ...editingBanner,
                      name: e.target.value,
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
                  value={editingBanner.image}
                  onChange={(e) =>
                    setEditingBanner({
                      ...editingBanner,
                      image: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleEditBanner}>Guardar Cambios</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Modal */}
      {deletingBanner && (
        <Dialog
          open={!!deletingBanner}
          onOpenChange={() => setDeletingBanner(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Eliminación</DialogTitle>
              <p>
                ¿Estás seguro de que deseas eliminar el banner &quot;
                {deletingBanner.name}&quot;? Esta acción no se puede deshacer.
              </p>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeletingBanner(null)}
              >
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDeleteBanner}>
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}