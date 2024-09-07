"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import axios from "axios";
import { SERVER_URI } from "@/lib/utils";
import { _retrieveData } from "@/lib/utils";
import { useToast } from "@/app/ToastContext";

// Definición de interfaces
interface Product {
  _id: string;
  product: {
    name: string;
  };
  quantity: number;
}

interface Order {
  _id: string;
  user: {
    name: string;
  };
  products: Product[];
  totalPrice: number;
  status: keyof typeof statusColors;
  createdAt: string;
  deliveryAddress: string;
}

interface PaginatedOrders {
  orders: Order[];
  totalOrders: number;
}

const statusColors = {
  pendiente: "bg-gray-200 text-gray-800",
  "en preparación": "bg-yellow-200 text-yellow-800",
  "en camino": "bg-blue-200 text-blue-800",
  cancelado: "bg-red-200 text-red-800",
  entregado: "bg-green-200 text-green-800",
};

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null); // Estado para el modal de confirmación de eliminación
  const toast = useToast();
  
  // Controlador para eliminar todas las órdenes
  const handleDeleteAllOrders = async () => {
    try {
      const token = await _retrieveData({ key: "token" });
      await axios.delete(`${SERVER_URI}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders([]);

      toast.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Todas las órdenes se eliminaron correctamente",
        life: 3000,
      });
    } catch (err) {
      console.error("Error al eliminar todas las órdenes:", err);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron eliminar todas las órdenes",
        life: 3000,
      });
    } finally {
      setIsDeleteAllModalOpen(false);
    }
  };
  
  const getOrders = async (page = 1) => {
    try {
      const token = await _retrieveData({ key: "token" });
      const response = await axios.get<PaginatedOrders>(`${SERVER_URI}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: page,
          limit: 10,
        },
      });

      setOrders(response.data.orders);
      setCurrentPage(page);
      setTotalPages(Math.ceil(response.data.totalOrders / 10));
    } catch (err) {
      console.error("Error al obtener órdenes:", err);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo obtener las órdenes",
        life: 3000,
      });
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: keyof typeof statusColors) => {
    try {
      const token = await _retrieveData({ key: "token" });
      await axios.patch(
        `${SERVER_URI}/orders/${orderId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      toast.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "El estado de la orden se actualizó correctamente",
        life: 3000,
      });
    } catch (err) {
      console.error("Error al actualizar el estado de la orden:", err);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo actualizar el estado de la orden",
        life: 3000,
      });
    }
  };

  // Controlador para eliminar una orden específica
  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;

    try {
      const token = await _retrieveData({ key: "token" });
      await axios.delete(`${SERVER_URI}/orders/${orderToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderToDelete._id));
      setOrderToDelete(null); // Cerrar el modal

      toast.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "La orden se eliminó correctamente",
        life: 3000,
      });
    } catch (err) {
      console.error("Error al eliminar la orden:", err);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo eliminar la orden",
        life: 3000,
      });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      getOrders(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      getOrders(currentPage - 1);
    }
  };

  return (
    <main className="w-full p-8">
      {/* Encabezado */}
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Órdenes</h1>
          <p className="text-gray-600">Administra tus órdenes</p>
        </div>
        <Button variant="destructive" onClick={() => setIsDeleteAllModalOpen(true)}>
          Eliminar Todas las Órdenes
        </Button>
      </header>

      {/* Modal de Confirmación para Eliminar Todas las Órdenes */}
      <Dialog open={isDeleteAllModalOpen} onOpenChange={setIsDeleteAllModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Estás seguro?</DialogTitle>
          </DialogHeader>
          <p>Esta acción eliminará todas las órdenes. No se puede deshacer.</p>
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteAllModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteAllOrders}>
              Eliminar Todas las Órdenes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmación para Eliminar una Orden */}
      <Dialog open={!!orderToDelete} onOpenChange={() => setOrderToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Estás seguro?</DialogTitle>
          </DialogHeader>
          <p>Esta acción eliminará la orden <strong>{orderToDelete?.user?.name}</strong>. No se puede deshacer.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOrderToDelete(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteOrder}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Órdenes Recientes */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Lista de Órdenes</CardTitle>
          <CardDescription>Administra y ve detalles de tus clientes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 pt-6 font-medium">ID de la Orden</th>
                  <th className="pb-3 pt-6 font-medium">Cliente</th>
                  <th className="pb-3 pt-6 font-medium">Productos</th>
                  <th className="pb-3 pt-6 font-medium">Total</th>
                  <th className="pb-3 pt-6 font-medium">Fecha</th>
                  <th className="pb-3 pt-6 font-medium">Estado</th>
                  <th className="pb-3 pt-6 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b">
                    <td className="py-4">{order._id}</td>
                    <td className="py-4">{order.user?.name || "Usuario no encontrado"}</td>
                    <td className="py-4">
                      {order.products.length} {order.products.length === 1 ? "artículo" : "artículos"}
                    </td>
                    <td className="py-4">${order.totalPrice.toFixed(2)}</td>
                    <td className="py-4">
                      {new Date(order.createdAt).toLocaleDateString("es-MX", { timeZone: "UTC" })}
                    </td>
                    <td className="py-4">
                      <Select
                        onValueChange={(value) =>
                          handleStatusChange(order._id, value as keyof typeof statusColors)
                        }
                        defaultValue={order.status}
                      >
                        <SelectTrigger className={`w-[150px] ${statusColors[order.status]}`}>
                          <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(statusColors).map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-4 flex gap-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="mr-2 h-4 w-4" />
                            Ver
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Detalles de la Orden</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-bold">ID de la Orden:</span>
                              <span className="col-span-3">{order._id}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-bold">Cliente:</span>
                              <span className="col-span-3">{order.user.name}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-bold">Productos:</span>
                              <span className="col-span-3">
                                {order.products.map((item) => (
                                  <div key={item._id}>
                                    {item.product
                                      ? `${item.product.name} (Cant: ${item.quantity})`
                                      : "Producto no encontrado"}
                                  </div>
                                ))}
                              </span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-bold">Total:</span>
                              <span className="col-span-3">${order.totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-bold">Fecha:</span>
                              <span className="col-span-3">
                                {new Date(order.createdAt).toLocaleDateString("es-MX", {
                                  timeZone: "UTC",
                                })}
                              </span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-bold">Estado:</span>
                              <span className="col-span-3">{order.status}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-bold">Dirección:</span>
                              <span className="col-span-3">{order.deliveryAddress}</span>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setOrderToDelete(order)} // Establecer la orden que el usuario desea eliminar
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between items-center mt-4">
              <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
                Anterior
              </Button>
              <span>
                Página {currentPage} de {totalPages}
              </span>
              <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
                Siguiente
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default OrdersPage;
