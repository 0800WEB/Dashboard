"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const page = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Obtener el token desde las cookies
    const token = Cookies.get("token");

    // Realiza la solicitud para obtener los usuarios
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data.response);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);
  return (
    <main className="flex-1 p-4 md:p-6 min-h-screen">
    <Card>
      <CardHeader className="px-6 py-4">
        <CardTitle>All Customers</CardTitle>
        <CardDescription>A list of all the customers in your store.</CardDescription>
      </CardHeader>
      <CardContent>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {users.length > 0 ? (
              users.map((user) => (
                <div
                  key={user._id}
                  className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2"
                >
                  <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
                    <span className="sr-only">View customer</span>
                  </Link>
                  <div className="h-48 w-full bg-primary/10 flex items-center justify-center">
                    <UsersIcon className="h-12 w-12 text-primary" />
                  </div>
                  <div className="p-4 bg-background">
                    <h3 className="text-lg font-semibold">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        Total Orders: {user.totalOrders || "N/A"}
                      </span>
                      <Button variant="secondary" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No customers found.</p>
            )}
          </div>
        </CardContent>
    </Card>
  </main>  )
}

function UsersIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
export default page