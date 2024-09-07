"use client";
// app/coupons/page.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { SERVER_URI, _retrieveData } from "@/lib/utils";
import { useToast } from "@/app/ToastContext";

// Tipos e interfaces
interface Coupon {
  _id: string;
  title: string;
  code: string;
  discountPercentage: number;
  discountAmount: number;
  expiryDate: string;
  usageLimit: number;
}

interface NewCoupon {
  title: string;
  code: string;
  discountType: "percentage" | "amount";
  discountValue: number;
  expiryDate: string;
  usageLimit: number;
}

const CouponsPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [deletingCoupon, setDeletingCoupon] = useState<Coupon | null>(null);
  const [newCoupon, setNewCoupon] = useState<NewCoupon>({
    title: "",
    code: "",
    discountType: "percentage",
    discountValue: 0,
    expiryDate: "",
    usageLimit: 1,
  });
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const toast = useToast();

  const fetchCoupons = async () => {
    try {
      const token = await _retrieveData({ key: "token" });
      const response = await axios.get(`${SERVER_URI}/coupons/all-coupons`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCoupons(response.data.coupons);
    } catch (error) {
      console.error("Error al obtener los cupones:", error);
      if(toast && toast.current){
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron obtener los cupones",
        life: 3000,
      });
    }
  }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const validateCoupon = (coupon: NewCoupon): boolean => {
    if (!coupon.title.trim()) {
      if(toast && toast.current){
      toast.current.show({
        severity: "warn",
        summary: "Advertencia",
        detail: "El título no puede estar vacío",
        life: 3000,
      });
    }
      return false;
    }
    if (!coupon.code.trim()) {
      if(toast && toast.current){
      toast.current.show({
        severity: "warn",
        summary: "Advertencia",
        detail: "El código no puede estar vacío",
        life: 3000,
      });
    }
      return false;
    }
    if (
      coupon.discountType === "percentage" &&
      (coupon.discountValue <= 0 || coupon.discountValue > 100)
    ) {
      if(toast && toast.current){
      toast.current.show({
        severity: "warn",
        summary: "Advertencia",
        detail: "El porcentaje de descuento debe estar entre 1 y 100",
        life: 3000,
      });
    }
      return false;
    }
    if (!coupon.expiryDate) {
      if(toast && toast.current){
      toast.current.show({
        severity: "warn",
        summary: "Advertencia",
        detail: "La fecha de expiración no puede estar vacía",
        life: 3000,
      });
    }
      return false;
    }
    if (coupon.usageLimit < 0) {
      if(toast && toast.current){
      toast.current.show({
        severity: "warn",
        summary: "Advertencia",
        detail: "El límite de uso no puede ser negativo",
        life: 3000,
      });
    }
      return false;
    }
    return true;
  };

  const handleCreateCoupon = async () => {
    if (!validateCoupon(newCoupon)) return;

    try {
      const token = await _retrieveData({ key: "token" });
      const response = await axios.post(
        `${SERVER_URI}/coupons/`,
        {
          title: newCoupon.title,
          code: newCoupon.code,
          discountPercentage:
            newCoupon.discountType === "percentage"
              ? Number(newCoupon.discountValue)
              : 0,
          discountAmount:
            newCoupon.discountType === "amount"
              ? Number(newCoupon.discountValue)
              : 0,
          expiryDate: newCoupon.expiryDate,
          usageLimit: Number(newCoupon.usageLimit),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCoupons([...coupons, response.data.coupon]);
      setIsCreating(false);
      setNewCoupon({
        title: "",
        code: "",
        discountType: "percentage",
        discountValue: 0,
        expiryDate: "",
        usageLimit: 1,
      });
      if(toast && toast.current){
      toast.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Cupón creado con éxito",
        life: 3000,
      });
    }
    } catch (error) {
      console.error("Error al crear el cupón:", error);
      if(toast && toast.current){
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Hubo un error al crear el cupón. Por favor, inténtalo de nuevo.",
        life: 3000,
      });
    }
    }
  };

  const handleEditCoupon = async () => {
    if (!editingCoupon) return;

    // Convertir editingCoupon a NewCoupon
    const newCoupon: NewCoupon = {
        title: editingCoupon.title,
        code: editingCoupon.code,
        discountType: editingCoupon.discountPercentage > 0 ? "percentage" : "amount",
        discountValue: editingCoupon.discountPercentage > 0 ? editingCoupon.discountPercentage : editingCoupon.discountAmount,
        expiryDate: editingCoupon.expiryDate,
        usageLimit: editingCoupon.usageLimit,
    };

    // Validar el nuevo cupón
    if (!validateCoupon(newCoupon)) return;

    try {
        const token = await _retrieveData({ key: "token" });
        const response = await axios.patch(
            `${SERVER_URI}/coupons/${editingCoupon._id}`,
            editingCoupon,  // Puedes mantener la estructura original aquí si el servidor no requiere cambios
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        setCoupons(
            coupons.map((c) =>
                c._id === editingCoupon._id ? response.data.coupon : c
            )
        );
        setEditingCoupon(null);
        if (toast && toast.current) {
            toast.current.show({
                severity: "success",
                summary: "Éxito",
                detail: "Cupón actualizado con éxito",
                life: 3000,
            });
        }
    } catch (error) {
        console.error("Error al editar el cupón:", error);
        if (toast && toast.current) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Hubo un error al editar el cupón. Por favor, inténtalo de nuevo.",
                life: 3000,
            });
        }
    }
};
  const handleDeleteCoupon = async () => {
    try {
      const token = await _retrieveData({ key: "token" });
      await axios.delete(`${SERVER_URI}/coupons/${deletingCoupon?._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCoupons(coupons.filter((c) => c._id !== deletingCoupon?._id));
      setDeletingCoupon(null);
      if(toast && toast.current){
      toast.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Cupón eliminado con éxito",
        life: 3000,
      });
      }
    } catch (error) {
      console.error("Error al eliminar el cupón:", error);
      if(toast && toast.current){
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Hubo un error al eliminar el cupón. Por favor, inténtalo de nuevo.",
        life: 3000,
      });
    }
    }
  };

  const filteredCoupons = coupons.filter(
    (coupon:any) =>
      coupon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="p-8 w-full">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cupones</h1>
          <p className="text-gray-600">Gestiona tus cupones de descuento</p>
        </div>
      </header>

      {/* Buscar y Añadir Cupón */}
      <div className="mb-6 flex items-center space-x-4">
        <Button variant="outline" onClick={() => setIsCreating(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Añadir Cupón
        </Button>
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Buscar cupones..."
            className="pl-10 pr-4 rounded-full bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Tabla de Cupones */}
      <Card>
        <CardHeader className="px-6 py-4">
          <CardTitle>Lista de Cupones</CardTitle>
          <CardDescription>Una lista de los cupones.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Descuento</TableHead>
                <TableHead>Fecha de Expiración</TableHead>
                <TableHead>Límite de Uso</TableHead>
                <TableHead>
                  <span className="sr-only">Acciones</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCoupons?.map((coupon) => (
                <TableRow key={coupon?._id}>
                  <TableCell className="font-medium">{coupon?.title}</TableCell>
                  <TableCell>{coupon?.code}</TableCell>
                  <TableCell>
                    {coupon?.discountPercentage > 0
                      ? `${coupon?.discountPercentage}%`
                      : `$${coupon?.discountAmount}`}
                  </TableCell>
                  <TableCell>
                    {new Date(coupon?.expiryDate).toLocaleDateString("es-ES", {
                      timeZone: "UTC",
                    })}
                  </TableCell>
                  <TableCell>{coupon?.usageLimit}</TableCell>
                  <TableCell className='flex gap-4'>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingCoupon(coupon)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeletingCoupon(coupon)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Crear Cupón */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Cupón</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="title" className="text-right">
                Título
              </label>
              <Input
                id="title"
                value={newCoupon.title}
                onChange={(e) =>
                  setNewCoupon({ ...newCoupon, title: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="code" className="text-right">
                Código
              </label>
              <Input
                id="code"
                value={newCoupon.code}
                onChange={(e) =>
                  setNewCoupon({ ...newCoupon, code: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="discountType" className="text-right">
                Tipo de Descuento
              </label>
              <select
                id="discountType"
                value={newCoupon.discountType}
                onChange={(e:any) =>
                  setNewCoupon({ ...newCoupon, discountType: e.target.value })
                }
                className="col-span-3"
              >
                <option value="percentage">Porcentaje</option>
                <option value="amount">Monto Fijo</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="discountValue" className="text-right">
                Valor del Descuento
              </label>
              <Input
                id="discountValue"
                type="number"
                value={newCoupon.discountValue}
                onChange={(e) =>
                  setNewCoupon({
                    ...newCoupon,
                    discountValue: Number(e.target.value),
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="expiryDate" className="text-right">
                Fecha de Expiración
              </label>
              <Input
                id="expiryDate"
                type="date"
                value={newCoupon.expiryDate}
                onChange={(e) =>
                  setNewCoupon({ ...newCoupon, expiryDate: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="usageLimit" className="text-right">
                Límite de Uso
              </label>
              <Input
                id="usageLimit"
                type="number"
                value={newCoupon.usageLimit}
                onChange={(e) =>
                  setNewCoupon({ ...newCoupon, usageLimit: Number(e.target.value) })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreateCoupon}>Crear Cupón</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Editar Cupón */}
      <Dialog
        open={!!editingCoupon}
        onOpenChange={() => setEditingCoupon(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Cupón</DialogTitle>
          </DialogHeader>
          {editingCoupon && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-title" className="text-right">
                  Título
                </label>
                <Input
                  id="edit-title"
                  value={editingCoupon.title}
                  onChange={(e) =>
                    setEditingCoupon({
                      ...editingCoupon,
                      title: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-code" className="text-right">
                  Código
                </label>
                <Input
                  id="edit-code"
                  value={editingCoupon.code}
                  onChange={(e) =>
                    setEditingCoupon({
                      ...editingCoupon,
                      code: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-discountType" className="text-right">
                  Tipo de Descuento
                </label>
                <select
                  id="edit-discountType"
                  value={
                    editingCoupon.discountPercentage > 0
                      ? "percentage"
                      : "amount"
                  }
                  onChange={(e) => {
                    if (e.target.value === "percentage") {
                      setEditingCoupon({
                        ...editingCoupon,
                        discountPercentage: editingCoupon.discountAmount,
                        discountAmount: 0,
                      });
                    } else {
                      setEditingCoupon({
                        ...editingCoupon,
                        discountAmount: editingCoupon.discountPercentage,
                        discountPercentage: 0,
                      });
                    }
                  }}
                  className="col-span-3"
                >
                  <option value="percentage">Porcentaje</option>
                  <option value="amount">Monto Fijo</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-discountValue" className="text-right">
                  Valor del Descuento
                </label>
                <Input
                  id="edit-discountValue"
                  type="number"
                  value={
                    editingCoupon.discountPercentage > 0
                      ? editingCoupon.discountPercentage
                      : editingCoupon.discountAmount
                  }
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (editingCoupon.discountPercentage > 0) {
                      setEditingCoupon({
                        ...editingCoupon,
                        discountPercentage: value,
                      });
                    } else {
                      setEditingCoupon({
                        ...editingCoupon,
                        discountAmount: value,
                      });
                    }
                  }}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-expiryDate" className="text-right">
                  Fecha de Expiración
                </label>
                <Input
                  id="edit-expiryDate"
                  type="date"
                  value={editingCoupon.expiryDate}
                  onChange={(e) =>
                    setEditingCoupon({
                      ...editingCoupon,
                      expiryDate: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-usageLimit" className="text-right">
                  Límite de Uso
                </label>
                <Input
                  id="edit-usageLimit"
                  type="number"
                  value={editingCoupon.usageLimit}
                  onChange={(e) =>
                    setEditingCoupon({
                      ...editingCoupon,
                      usageLimit: Number(e.target.value),
                    })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleEditCoupon}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Confirmar Eliminación */}
      <Dialog
        open={!!deletingCoupon}
        onOpenChange={() => setDeletingCoupon(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <p>
              ¿Estás seguro de que quieres eliminar el cupón &quot;
              {deletingCoupon?.title}&quot;? Esta acción no se puede deshacer.
            </p>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingCoupon(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteCoupon}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default CouponsPage;
