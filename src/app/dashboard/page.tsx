"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  Coffee,
  Eye,
  Gift,
  Home,
  Package,
  Search,
  ShoppingCart,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/dialog";
import axios from "axios";
import { SERVER_URI, _retrieveData } from "@/lib/utils";
import { useToast } from '../ToastContext';

// Definición de tipos para los objetos que maneja el componente
interface Product {
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

interface DashboardStats {
  totalOrders: number;
  totalCoupons: number;
  totalCustomers: number;
  totalRevenue: number;
}

const statusColors = {
  pendiente: "bg-gray-200 text-gray-800",
  "en preparación": "bg-yellow-200 text-yellow-800",
  "en camino": "bg-blue-200 text-blue-800",
  cancelado: "bg-red-200 text-red-800",
  entregado: "bg-green-200 text-green-800",
};

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalCoupons, setTotalCoupons] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [totalCustomers, setTotalCustomers] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const toast = useToast();

  const showSuccess = (message: string) => {
    toast.current?.show({
      severity: "success",
      summary: "Éxito",
      detail: message,
      life: 3000,
    });
  };

  const showError = (message: string) => {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: message,
      life: 3000,
    });
  };

  const fetchTotalCoupons = async () => {
    try {
      const token = await _retrieveData({ key: "token" });
      const response = await axios.get(`${SERVER_URI}/coupons/total-coupons`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTotalCoupons(response.data);
    } catch (error) {
      console.error("Error al obtener el total de cupones:", error);
      showError("Error al obtener el total de cupones");
    }
  };

  const fetchTotalOrders = async () => {
    try {
      const token = await _retrieveData({ key: "token" });
      const response = await axios.get(`${SERVER_URI}/orders/total-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTotalOrders(response.data);
    } catch (error) {
      console.error("Error al obtener el total de órdenes:", error);
      showError("Error al obtener el total de órdenes");
    }
  };

  const fetchTotalCustomers = async () => {
    try {
      const token = await _retrieveData({ key: "token" });
      const response = await axios.get(`${SERVER_URI}/users/total-customers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTotalCustomers(response.data);
    } catch (error) {
      console.error("Error al obtener el total de clientes:", error);
      showError("Error al obtener el total de clientes");
    }
  };

  const fetchTotalRevenue = async () => {
    try {
      const token = await _retrieveData({ key: "token" });
      const response = await axios.get(`${SERVER_URI}/orders/total-revenue`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTotalRevenue(response.data);
    } catch (error) {
      console.error("Error al obtener los ingresos totales:", error);
      showError("Error al obtener los ingresos totales");
    }
  };

  const fetchOrders = async () => {
    try {
      const token = await _retrieveData({ key: "token" });
      const response = await axios.get(`${SERVER_URI}/orders/last-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error("Error al obtener las órdenes recientes:", error);
      showError("Error al obtener las órdenes recientes");
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchTotalCoupons();
    fetchTotalOrders();
    fetchTotalCustomers();
    fetchTotalRevenue();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: Order["status"]) => {
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
      showSuccess(`El estado de la orden se actualizó a ${newStatus}`);
    } catch (err) {
      console.error("Error al actualizar el estado de la orden:", err);
      showError("Error al actualizar el estado de la orden");
    }
  };

  return (
    <main className="w-full p-8 flex flex-col">
      {/* Encabezado */}
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tablero</h1>
          <p className="text-gray-600">Bienvenido de nuevo, Admin</p>
        </div>
      </header>
      {/* Cuadrícula del Tablero */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Órdenes Totales",
            value: totalOrders,
            icon: ShoppingCart,
            color: "bg-blue-500",
          },
          {
            title: "Clientes Activos",
            value: totalCustomers,
            icon: Users,
            color: "bg-green-500",
          },
          {
            title: "Cupones Totales",
            value: totalCoupons,
            icon: Gift,
            color: "bg-yellow-500",
          },
          {
            title: "Ingresos",
            value: totalRevenue.toLocaleString("es-MX", {
              style: "currency",
              currency: "MXN",
            }),
            icon: Coffee,
            color: "bg-purple-500",
          },
        ].map((item, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="border-b p-0">
              <div className={`${item.color} p-4`}>
                <item.icon className="h-8 w-8 text-white" />
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-sm font-medium text-gray-500">
                {item.title}
              </CardTitle>
              <p className="mt-2 text-2xl font-bold">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Órdenes Recientes */}
      <Card className="mt-8 flex-1">
        <CardHeader>
          <CardTitle>Órdenes Recientes</CardTitle>
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
                    <td className="py-4">{order.user.name}</td>
                    <td className="py-4">
                      {order.products
                        .map((product) => product.product.name)
                        .join(", ")}
                    </td>
                    <td className="py-4">${order.totalPrice.toFixed(2)}</td>
                    <td className="py-4">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="py-4">
                      <Select
                        onValueChange={(value) =>
                          handleStatusChange(order._id, value as Order["status"])
                        }
                        defaultValue={order.status}
                      >
                        <SelectTrigger
                          className={`w-[150px] ${statusColors[order.status]}`}
                        >
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
                    <td className="py-4">
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
                              <span className="col-span-3">
                                {order.user.name}
                              </span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-bold">Productos:</span>
                              <span className="col-span-3">
                                {order.products
                                  .map((product) => product.product.name)
                                  .join(", ")}
                              </span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-bold">Total:</span>
                              <span className="col-span-3">
                                ${order.totalPrice.toFixed(2)}
                              </span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-bold">Fecha:</span>
                              <span className="col-span-3">
                                {new Date(order.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-bold">Estado:</span>
                              <span className="col-span-3">
                                {order.status}
                              </span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-bold">Dirección:</span>
                              <span className="col-span-3">
                                {order.deliveryAddress}
                              </span>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
