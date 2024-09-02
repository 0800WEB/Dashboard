'use client'
import React, { useState, useEffect } from 'react';
import { Bell, Coffee, Gift, Home, Package, Search, ShoppingCart, Users, Filter, Plus, Trash } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { SERVER_URI, _retrieveData } from "@/lib/utils";
import axios from 'axios';
import { useToast } from '@/app/ToastContext';

interface Category {
  _id: string;
  name: string;
}

interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Product>({
    name: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
    images: ['']
  });
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const toast = useToast();

  useEffect(() => {
    getCategories();
    getProducts();
  }, []);

  const getCategories = async () => {
    try {
      const response = await axios.get<Category[]>(`${SERVER_URI}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
    }
  };

  const getProducts = async () => {
    try {
      const token = await _retrieveData({ key: "token" });
      const response = await axios.get<{ products: Product[] }>(`${SERVER_URI}/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  const handleAddProduct = async () => {
    try {
      const token = await _retrieveData({ key: "token" });
      const response = await axios.post<{ product: Product }>(`${SERVER_URI}/products/create`, newProduct, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts([...products, response.data.product]);
      setNewProduct({name: '', description: '', price: 0, category: '', stock: 0, images: [''] });
      setIsAddProductDialogOpen(false);
      toast.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Producto agregado correctamente",
        life: 3000,
      });
    } catch (error) {
      console.error('Error al crear producto:', error.response.data.message);
      if(error.response.data.message){
        error.response.data.message.forEach(data=>{
          toast.current.show({
            severity: "warn",
            summary: "Advertencia",
            detail: data.message,
            life: 3000,
          });
        })
      }
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct({ ...product });
  };

  const handleSaveEdit = async () => {
    try {
      if (editingProduct) {
        const token = await _retrieveData({ key: "token" });
        const response = await axios.put<{ product: Product }>(`${SERVER_URI}/products/${editingProduct._id}`, editingProduct, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(products.map(p => p._id === editingProduct._id ? response.data.product : p));
        setEditingProduct(null);
        toast.current.show({
          severity: "success",
          summary: "Éxito",
          detail: "Producto actualizado correctamente",
          life: 3000,
        });
      }
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      if(error.response.data.message){
        error.response.data.message.forEach(data=>{
          toast.current.show({
            severity: "warn",
            summary: "Advertencia",
            detail: data.message,
            life: 3000,
          });
        })
      }

    }
  };

  const handleDelete = (product: Product) => {
    setDeletingProduct(product);
  };

  const handleConfirmDelete = async () => {
    try {
      if (deletingProduct) {
        const token = await _retrieveData({ key: "token" });
        await axios.delete(`${SERVER_URI}/products/${deletingProduct._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(products.filter(p => p._id !== deletingProduct._id));
        setDeletingProduct(null);
        toast.current.show({
          severity: "success",
          summary: "Éxito",
          detail: "Producto eliminado correctamente",
          life: 3000,
        });
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo eliminar el producto",
        life: 3000,
      });
    }
  };

  const handleAddImage = (productType: 'new' | 'edit') => {
    if (productType === 'new') {
      setNewProduct({ ...newProduct, images: [...newProduct.images, ''] });
    } else if (editingProduct) {
      setEditingProduct({ ...editingProduct, images: [...editingProduct.images, ''] });
    }
  };

  const handleImageChange = (index: number, value: string, productType: 'new' | 'edit') => {
    if (productType === 'new') {
      const newImages = [...newProduct.images];
      newImages[index] = value;
      setNewProduct({ ...newProduct, images: newImages });
    } else if (editingProduct) {
      const newImages = [...editingProduct.images];
      newImages[index] = value;
      setEditingProduct({ ...editingProduct, images: newImages });
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat._id === categoryId);
    return category ? category.name : 'Categoría desconocida';
  };

  // Filtrar productos por categoría y término de búsqueda
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (categoryFilter === 'Todas' || product.category === categoryFilter)
  );

  return (
    <div className="p-8 w-full">
      {/* Encabezado */}
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Productos</h1>
          <p className="text-gray-600">Administra tu inventario de productos</p>
        </div>
      </header>

      {/* Buscar y Filtrar */}
      <div className="mb-6 flex items-center space-x-4">
        <Dialog open={isAddProductDialogOpen} onOpenChange={setIsAddProductDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Agregar Producto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Producto</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Nombre</Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Descripción</Label>
                <Input
                  id="description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">Precio</Label>
                <Input
                  id="price"
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="stock" className="text-right">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">Categoría</Label>
                <Select
                  value={newProduct.category}
                  onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category._id} value={category._id}>{category.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Imágenes</Label>
                <div className="col-span-3 space-y-2">
                  {newProduct.images.map((image, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={image}
                        onChange={(e) => handleImageChange(index, e.target.value, 'new')}
                        placeholder="URL de la imagen"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setNewProduct({
                          ...newProduct,
                          images: newProduct.images.filter((_, i) => i !== index)
                        })}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button onClick={() => handleAddImage('new')} variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Imagen
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddProduct}>Crear Producto</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Buscar productos..."
            className="pl-10 pr-4 rounded-full bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" /> 
        </div>
        <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todas">Todas las Categorías</SelectItem>
            {categories.map(category => (
              <SelectItem key={category._id} value={category._id}>{category.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabla de Productos */}
      <div className="rounded-lg border shadow bg-white" style={{ backgroundColor: "#fff" }}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product._id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{getCategoryName(product.category)}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(product)}>Editar</Button>
                  <Button variant="destructive" size="sm" className="text-red-600" onClick={() => handleDelete(product)}>Eliminar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal para Editar Producto */}
      {editingProduct && (
        <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Producto</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Nombre</Label>
                <Input
                  id="name"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Descripción</Label>
                <Input
                  id="description"
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">Precio</Label>
                <Input
                  id="price"
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="stock" className="text-right">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">Categoría</Label>
                <Select
                  value={editingProduct.category}
                  onValueChange={(value) => setEditingProduct({ ...editingProduct, category: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category._id} value={category._id}>{category.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Imágenes</Label>
                <div className="col-span-3 space-y-2">
                  {editingProduct.images.map((image, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={image}
                        onChange={(e) => handleImageChange(index, e.target.value, 'edit')}
                        placeholder="URL de la imagen"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingProduct({
                          ...editingProduct,
                          images: editingProduct.images.filter((_, i) => i !== index)
                        })}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button onClick={() => handleAddImage('edit')} variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Imagen
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSaveEdit}>Guardar cambios</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal de Confirmación para Eliminar */}
      {deletingProduct && (
        <Dialog open={!!deletingProduct} onOpenChange={() => setDeletingProduct(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Eliminación</DialogTitle>
              <DialogDescription>
                ¿Estás seguro que deseas eliminar {deletingProduct.name}? Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeletingProduct(null)}>Cancelar</Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>Eliminar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
