'use client'
import React, { useState, useEffect } from 'react';
import { Search, Eye, Trash, UserCheck, UserX } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import axios from 'axios';
import { SERVER_URI, _retrieveData } from "@/lib/utils";
import { Client } from './interfaces';
import { useToast } from '@/app/ToastContext'; // Asumiendo que tienes un ToastContext personalizado

export default function Clientes() {
  const [clientes, setClientes] = useState<Client[]>([]);
  const [terminoBusqueda, setTerminoBusqueda] = useState<string>('');
  const [clienteAEliminar, setClienteAEliminar] = useState<Client | null>(null);
  const [clienteAVer, setClienteAVer] = useState<Client | null>(null);
  const [eliminandoTodos, setEliminandoTodos] = useState<boolean>(false);
  const toast = useToast(); // Usando tu hook de toast personalizado

  useEffect(() => {
    const obtenerClientes = async () => {
      try {
        const token = await _retrieveData({ key: "token" });
        const response = await axios.get<{ response: Client[] }>(`${SERVER_URI}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClientes(response.data.response);
      } catch (err) {
        console.log("Error obteniendo clientes:", err);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "No se pudieron obtener los clientes.",
          life: 3000,
        });
      }
    };
    obtenerClientes();
  }, []);

  const handleEliminar = (cliente: Client) => {
    if (cliente.role === 1) {
      toast.current.show({
        severity: "error",
        summary: "Acción Denegada",
        detail: "No puedes eliminar un administrador.",
        life: 3000,
      });
      return;
    }
    setClienteAEliminar(cliente);
  };

  const handleConfirmarEliminar = async () => {
    if (!clienteAEliminar) return;

    try {
      const token = await _retrieveData({ key: "token" });
      await axios.delete(`${SERVER_URI}/users/${clienteAEliminar._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setClientes(clientes.filter(c => c._id !== clienteAEliminar._id));
      setClienteAEliminar(null);
      toast.current.show({
        severity: "success",
        summary: "Éxito",
        detail: `Cliente ${clienteAEliminar.name} eliminado con éxito.`,
        life: 3000,
      });
    } catch (err) {
      console.log("Error eliminando cliente:", err);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo eliminar el cliente.",
        life: 3000,
      });
    }
  };

  const handleEliminarTodosLosUsuarios = async () => {
    try {
      const token = await _retrieveData({ key: "token" });
      const usuarioActual = await axios.get<{ data: Client }>(`${SERVER_URI}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await axios.delete(`${SERVER_URI}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setClientes([usuarioActual.data]);
      setEliminandoTodos(false);

      toast.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Todos los usuarios eliminados, excepto el administrador actual.",
        life: 3000,
      });
    } catch (err) {
      console.log("Error eliminando todos los usuarios:", err);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron eliminar todos los usuarios.",
        life: 3000,
      });
    }
  };

  const handleToggleRole = async (cliente: Client) => {
    try {
      const token = await _retrieveData({ key: "token" });
      const response = await axios.post<{ user: Client }>(`${SERVER_URI}/users/${cliente._id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setClientes(clientes.map(c => c._id === cliente._id ? response.data.user : c));

      toast.current.show({
        severity: "success",
        summary: "Éxito",
        detail: `Cliente ${cliente.name} ${cliente.role === 1 ? "degradado a Cliente" : "ascendido a Administrador"}.`,
        life: 3000,
      });
    } catch (err) {
      console.log("Error cambiando rol del cliente:", err);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: `No se pudo ${cliente.role === 1 ? "degradar" : "ascender"} al cliente.`,
        life: 3000,
      });
    }
  };

  const handleVerDetalles = (cliente: Client) => {
    setClienteAVer(cliente);
  };

  const clientesFiltrados = clientes.filter(cliente =>
    cliente.name.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
    cliente.email.toLowerCase().includes(terminoBusqueda.toLowerCase())
  );

  return (
    <main className="w-full p-8">
      {/* Encabezado */}
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clientes</h1>
          <p className="text-gray-600">Gestiona tu base de clientes</p>
        </div>
      </header>

      {/* Búsqueda y Eliminar Todos los Usuarios */}
      <div className="mb-6 flex items-center space-x-4">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Buscar clientes..."
            className="pl-10 pr-4 rounded-full bg-white"
            value={terminoBusqueda}
            onChange={(e) => setTerminoBusqueda(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        </div>
        <Button 
          variant="destructive" 
          onClick={() => setEliminandoTodos(true)}
        >
          Eliminar Todos los Usuarios
        </Button>
      </div>

      {/* Tabla de Clientes */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>Gestiona y ve los detalles de tus clientes</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Fecha de Registro</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientesFiltrados.map((cliente) => (
                <TableRow key={cliente._id}>
                  <TableCell className="font-medium">{cliente.name}</TableCell>
                  <TableCell>{cliente.email}</TableCell>
                  <TableCell>{cliente.role === 1 ? "Administrador" : "Cliente"}</TableCell>
                  <TableCell>{new Date(cliente.createdAt).toLocaleDateString('es-GB', { timeZone: 'UTC' })}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => handleVerDetalles(cliente)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Ver
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleEliminar(cliente)}>
                      <Trash className="mr-2 h-4 w-4" />
                      Eliminar
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={cliente.role === 1 ? "text-blue-600" : "text-green-600"}
                      onClick={() => handleToggleRole(cliente)}
                    >
                      {cliente.role === 1 ? (
                        <>
                          <UserX className="mr-2 h-4 w-4" />
                          Degradar
                        </>
                      ) : (
                        <>
                          <UserCheck className="mr-2 h-4 w-4" />
                          Ascender
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal de Confirmación de Eliminación */}
      {clienteAEliminar && (
        <Dialog open={!!clienteAEliminar} onOpenChange={() => setClienteAEliminar(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Eliminación</DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que deseas eliminar al cliente {clienteAEliminar.name}? Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setClienteAEliminar(null)}>Cancelar</Button>
              <Button variant="destructive" onClick={handleConfirmarEliminar}>Eliminar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal de Confirmación de Eliminación de Todos los Usuarios */}
      {eliminandoTodos && (
        <Dialog open={!!eliminandoTodos} onOpenChange={() => setEliminandoTodos(false)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Eliminación de Todos los Usuarios</DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que deseas eliminar a todos los usuarios? Esta acción no se puede deshacer y eliminará a todos los usuarios excepto al administrador actual.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEliminandoTodos(false)}>Cancelar</Button>
              <Button variant="destructive" onClick={handleEliminarTodosLosUsuarios}>Eliminar Todos</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal de Detalles del Cliente */}
      {clienteAVer && (
        <Dialog open={!!clienteAVer} onOpenChange={() => setClienteAVer(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detalles del Cliente</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-bold">Nombre:</span>
                <span className="col-span-3">{clienteAVer.name}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-bold">Email:</span>
                <span className="col-span-3">{clienteAVer.email}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-bold">Rol:</span>
                <span className="col-span-3">{clienteAVer.role === 1 ? "Administrador" : "Cliente"}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-bold">Fecha de Registro:</span>
                <span className="col-span-3">{new Date(clienteAVer.createdAt).toLocaleDateString('es-GB', { timeZone: 'UTC' })}</span>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setClienteAVer(null)}>Cerrar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
}
