import { ChevronLeft, ChevronRight, ListFilter, MoreVertical } from 'lucide-react'
import * as React from 'react'

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
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function OrdersPage() {
  return (
    <div className='flex min-h-screen w-full flex-col bg-muted/40'>
      <div className='flex flex-col sm:gap-4 sm:py-4 sm:pe-14'>
        <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3'>
          <div className='grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2'>
            <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4'>
              <Card>
                <CardHeader className='pb-2'>
                  <CardDescription>This Week</CardDescription>
                  <CardTitle className='text-4xl'>$1,329</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-xs text-muted-foreground'>
                    +25% from last week
                  </div>
                </CardContent>
                <CardFooter>
                  <Progress value={25} aria-label='25% increase' />
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className='pb-2'>
                  <CardDescription>This Month</CardDescription>
                  <CardTitle className='text-4xl'>$5,329</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-xs text-muted-foreground'>
                    +10% from last month
                  </div>
                </CardContent>
                <CardFooter>
                  <Progress value={12} aria-label='12% increase' />
                </CardFooter>
              </Card>
            </div>
            <Tabs defaultValue='week'>
              <div className='flex items-center'>
                <TabsList>
                  <TabsTrigger value='week'>Week</TabsTrigger>
                  <TabsTrigger value='month'>Month</TabsTrigger>
                  <TabsTrigger value='year'>Year</TabsTrigger>
                </TabsList>
                <div className='ms-auto flex items-center gap-2'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant='outline'
                        size='sm'
                        className='h-7 gap-1 text-sm'
                      >
                        <ListFilter className='size-3.5' />
                        <span className='sr-only sm:not-sr-only'>Filter</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem checked>
                        Fulfilled
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>Declined</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>Refunded</DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <TabsContent value='week'>
                <Card>
                  <CardHeader className='px-7'>
                    <CardTitle>Orders</CardTitle>
                    <CardDescription>Recent orders from your store.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Customer</TableHead>
                          <TableHead className='hidden sm:table-cell'>
                            Type
                          </TableHead>
                          <TableHead className='hidden sm:table-cell'>
                            Status
                          </TableHead>
                          <TableHead className='hidden md:table-cell'>
                            Date
                          </TableHead>
                          <TableHead className='text-right'>Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow className='bg-accent'>
                          <TableCell>
                            <div className='font-medium'>Liam Johnson</div>
                            <div className='hidden text-sm text-muted-foreground md:inline'>
                              liam@example.com
                            </div>
                          </TableCell>
                          <TableCell className='hidden sm:table-cell'>
                            Sale
                          </TableCell>
                          <TableCell className='hidden sm:table-cell'>
                            <Badge className='text-xs' variant='secondary'>
                              Fulfilled
                            </Badge>
                          </TableCell>
                          <TableCell className='hidden md:table-cell'>
                            2023-06-23
                          </TableCell>
                          <TableCell className='text-right'>$250.00</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <div className='font-medium'>Olivia Smith</div>
                            <div className='hidden text-sm text-muted-foreground md:inline'>
                              olivia@example.com
                            </div>
                          </TableCell>
                          <TableCell className='hidden sm:table-cell'>
                            Refund
                          </TableCell>
                          <TableCell className='hidden sm:table-cell'>
                            <Badge className='text-xs' variant='outline'>
                              Declined
                            </Badge>
                          </TableCell>
                          <TableCell className='hidden md:table-cell'>
                            2023-06-24
                          </TableCell>
                          <TableCell className='text-right'>$150.00</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          <div>
            <Card className='overflow-hidden'>
              <CardHeader className='flex flex-row items-start bg-muted/50'>
                <div className='grid gap-0.5'>
                  <CardTitle className='group flex items-center gap-2 text-lg'>
                    Order
                  </CardTitle>
                  <CardDescription>Date: November 23, 2023</CardDescription>
                </div>
                <div className='ms-auto flex items-center gap-1'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size='icon' variant='outline' className='size-8'>
                        <MoreVertical className='size-3.5' />
                        <span className='sr-only'>More</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Export</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Trash</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className='p-6 text-sm'>
                <div className='grid gap-3'>
                  <div className='font-semibold'>Order Details</div>
                  <ul className='grid gap-3'>
                    <li className='flex items-center justify-between'>
                      <span className='text-muted-foreground'>
                        Glimmer Lamps x <span>2</span>
                      </span>
                      <span>$250.00</span>
                    </li>
                    <li className='flex items-center justify-between'>
                      <span className='text-muted-foreground'>
                        Aqua Filters x <span>1</span>
                      </span>
                      <span>$49.00</span>
                    </li>
                  </ul>
                  <Separator className='my-2' />
                  <ul className='grid gap-3'>
                    <li className='flex items-center justify-between'>
                      <span className='text-muted-foreground'>Subtotal</span>
                      <span>$299.00</span>
                    </li>
                    <li className='flex items-center justify-between'>
                      <span className='text-muted-foreground'>Shipping</span>
                      <span>$5.00</span>
                    </li>
                    <li className='flex items-center justify-between font-semibold'>
                      <span className='text-muted-foreground'>Total</span>
                      <span>$329.00</span>
                    </li>
                  </ul>
                </div>
                <Separator className='my-4' />
                <div className='grid grid-cols-2 gap-4'>
                  <div className='grid gap-3'>
                    <div className='font-semibold'>Shipping Information</div>
                    <address className='grid gap-0.5 not-italic text-muted-foreground'>
                      <span>Liam Johnson</span>
                      <span>1234 Main St.</span>
                      <span>Anytown, CA 12345</span>
                    </address>
                  </div>
                </div>
                <Separator className='my-4' />
                <div className='grid gap-3'>
                  <div className='font-semibold'>Customer Information</div>
                  <dl className='grid gap-3'>
                    <div className='flex items-center justify-between'>
                      <dt className='text-muted-foreground'>Customer</dt>
                      <dd>Liam Johnson</dd>
                    </div>
                    <div className='flex items-center justify-between'>
                      <dt className='text-muted-foreground'>Phone</dt>
                      <dd>
                        <a href='tel:'>+1 234 567 890</a>
                      </dd>
                    </div>
                  </dl>
                </div>
                <Separator className='my-4' />
              </CardContent>
              <CardFooter className='flex flex-row items-center border-t bg-muted/50 px-6 py-3'>
                <Pagination className='me-0 ml-auto w-auto'>
                  <PaginationContent>
                    <PaginationItem>
                      <Button size='icon' variant='outline' className='size-6'>
                        <ChevronRight className='size-3.5' />
                        <span className='sr-only'>Previous Order</span>
                      </Button>
                    </PaginationItem>
                    <PaginationItem>
                      <Button size='icon' variant='outline' className='size-6'>
                        <ChevronLeft className='size-3.5' />
                        <span className='sr-only'>Next Order</span>
                      </Button>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
