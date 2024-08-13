import React from 'react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

const page = () => {
  return (
    <main className="flex-1 p-4 md:p-6 min-h-screen">
    <Card>
      <CardHeader className="px-6 py-4">
        <CardTitle>All Customers</CardTitle>
        <CardDescription>A list of all the customers in your store.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2">
            <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
              <span className="sr-only">View customer</span>
            </Link>
            <div className="h-48 w-full bg-primary/10 flex items-center justify-center">
              <UsersIcon className="h-12 w-12 text-primary" />
            </div>
            <div className="p-4 bg-background">
              <h3 className="text-lg font-semibold">John Doe</h3>
              <p className="text-sm text-muted-foreground">johndoe@example.com</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Total Orders: 15</span>
                <Button variant="secondary" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2">
            <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
              <span className="sr-only">View customer</span>
            </Link>
            <div className="h-48 w-full bg-primary/10 flex items-center justify-center">
              <UsersIcon className="h-12 w-12 text-primary" />
            </div>
            <div className="p-4 bg-background">
              <h3 className="text-lg font-semibold">Jane Smith</h3>
              <p className="text-sm text-muted-foreground">janesmith@example.com</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Total Orders: 8</span>
                <Button variant="secondary" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2">
            <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
              <span className="sr-only">View customer</span>
            </Link>
            <div className="h-48 w-full bg-primary/10 flex items-center justify-center">
              <UsersIcon className="h-12 w-12 text-primary" />
            </div>
            <div className="p-4 bg-background">
              <h3 className="text-lg font-semibold">Michael Johnson</h3>
              <p className="text-sm text-muted-foreground">mjohnson@example.com</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Total Orders: 23</span>
                <Button variant="secondary" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2">
            <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
              <span className="sr-only">View customer</span>
            </Link>
            <div className="h-48 w-full bg-primary/10 flex items-center justify-center">
              <UsersIcon className="h-12 w-12 text-primary" />
            </div>
            <div className="p-4 bg-background">
              <h3 className="text-lg font-semibold">Emily Davis</h3>
              <p className="text-sm text-muted-foreground">edavis@example.com</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Total Orders: 6</span>
                <Button variant="secondary" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </main>  )
}

function UsersIcon(props) {
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