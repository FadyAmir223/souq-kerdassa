import { MoreHorizontal, PlusCircle } from 'lucide-react'
import Image from 'next/image'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ProductsPage() {
  const products = ['']

  if (products.length === 0)
    return (
      <main className='flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6'>
        <div className='flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm'>
          <div className='flex flex-col items-center gap-1 text-center'>
            <h3 className='text-2xl font-bold tracking-tight'>
              You have no products
            </h3>
            <p className='text-sm text-muted-foreground'>
              You can start selling as soon as you add a product.
            </p>
            <Button className='mt-4'>Add Product</Button>
          </div>
        </div>
      </main>
    )

  return (
    <div className='flex flex-col sm:gap-4 sm:py-4 sm:pl-14'>
      <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
        <h1 className='text-lg font-semibold md:text-2xl'>المنتجات</h1>

        <Tabs defaultValue='all'>
          <div className='flex items-center'>
            <TabsList>
              <TabsTrigger value='all'>All</TabsTrigger>
              <TabsTrigger value='active'>Active</TabsTrigger>
              <TabsTrigger value='draft'>Draft</TabsTrigger>
            </TabsList>
            <div className='ml-auto flex items-center gap-2'>
              <DropdownMenu>
                <DropdownMenuContent align='end'>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem checked>Active</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button size='sm' className='h-7 gap-1'>
                <PlusCircle className='size-3.5' />
                <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                  Add Product
                </span>
              </Button>
            </div>
          </div>
          <TabsContent value='all'>
            <Card>
              <CardHeader>
                <CardTitle>Products</CardTitle>
                <CardDescription>
                  Manage your products and view their sales performance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='hidden w-[100px] sm:table-cell'>
                        <span className='sr-only'>Image</span>
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className='hidden md:table-cell'>
                        Total Sales
                      </TableHead>
                      <TableHead className='hidden md:table-cell'>
                        Created at
                      </TableHead>
                      <TableHead>
                        <span className='sr-only'>Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className='hidden sm:table-cell'>
                        <Image
                          alt='Product image'
                          className='aspect-square rounded-md object-cover'
                          height='64'
                          src='/placeholder.svg'
                          width='64'
                        />
                      </TableCell>
                      <TableCell className='font-medium'>
                        Laser Lemonade Machine
                      </TableCell>
                      <TableCell>
                        <Badge variant='outline'>Draft</Badge>
                      </TableCell>
                      <TableCell>$499.99</TableCell>
                      <TableCell className='hidden md:table-cell'>25</TableCell>
                      <TableCell className='hidden md:table-cell'>
                        2023-07-12 10:42 AM
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup='true' size='icon' variant='ghost'>
                              <MoreHorizontal className='size-4' />
                              <span className='sr-only'>Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className='hidden sm:table-cell'>
                        <Image
                          alt='Product image'
                          className='aspect-square rounded-md object-cover'
                          height='64'
                          src='/placeholder.svg'
                          width='64'
                        />
                      </TableCell>
                      <TableCell className='font-medium'>
                        Hypernova Headphones
                      </TableCell>
                      <TableCell>
                        <Badge variant='outline'>Active</Badge>
                      </TableCell>
                      <TableCell>$129.99</TableCell>
                      <TableCell className='hidden md:table-cell'>100</TableCell>
                      <TableCell className='hidden md:table-cell'>
                        2023-10-18 03:21 PM
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup='true' size='icon' variant='ghost'>
                              <MoreHorizontal className='size-4' />
                              <span className='sr-only'>Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <div className='text-xs text-muted-foreground'>
                  Showing <strong>1-10</strong> of <strong>32</strong> products
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
