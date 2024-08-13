// app/orders/page.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

const ProductsPage = () => {
  return (
    <main className="flex-1 p-4 md:p-6 min-h-screen">
    <Card>
      <CardHeader className="px-6 py-4">
        <CardTitle>All Products</CardTitle>
        <CardDescription>A list of all the products available in your store.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2">
            <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
              <span className="sr-only">View product</span>
            </Link>
            <img
              src="/placeholder.svg"
              alt="Product 1"
              width={500}
              height={400}
              className="h-48 w-full object-cover"
              style={{ aspectRatio: "500/400", objectFit: "cover" }}
            />
            <div className="p-4 bg-background">
              <h3 className="text-lg font-semibold">Product 1</h3>
              <p className="text-sm text-muted-foreground">Description of Product 1</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-semibold">$19.99</span>
                <Button variant="secondary" size="sm">
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2">
            <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
              <span className="sr-only">View product</span>
            </Link>
            <img
              src="/placeholder.svg"
              alt="Product 2"
              width={500}
              height={400}
              className="h-48 w-full object-cover"
              style={{ aspectRatio: "500/400", objectFit: "cover" }}
            />
            <div className="p-4 bg-background">
              <h3 className="text-lg font-semibold">Product 2</h3>
              <p className="text-sm text-muted-foreground">Description of Product 2</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-semibold">$24.99</span>
                <Button variant="secondary" size="sm">
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2">
            <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
              <span className="sr-only">View product</span>
            </Link>
            <img
              src="/placeholder.svg"
              alt="Product 3"
              width={500}
              height={400}
              className="h-48 w-full object-cover"
              style={{ aspectRatio: "500/400", objectFit: "cover" }}
            />
            <div className="p-4 bg-background">
              <h3 className="text-lg font-semibold">Product 3</h3>
              <p className="text-sm text-muted-foreground">Description of Product 3</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-semibold">$14.99</span>
                <Button variant="secondary" size="sm">
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2">
            <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
              <span className="sr-only">View product</span>
            </Link>
            <img
              src="/placeholder.svg"
              alt="Product 4"
              width={500}
              height={400}
              className="h-48 w-full object-cover"
              style={{ aspectRatio: "500/400", objectFit: "cover" }}
            />
            <div className="p-4 bg-background">
              <h3 className="text-lg font-semibold">Product 4</h3>
              <p className="text-sm text-muted-foreground">Description of Product 4</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-semibold">$29.99</span>
                <Button variant="secondary" size="sm">
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </main>
  );
};

export default ProductsPage;
