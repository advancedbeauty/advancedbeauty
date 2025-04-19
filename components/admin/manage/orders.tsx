'use client';

import { useState, useEffect } from 'react';
import {
  Loader2,
  Eye,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  getOrdersAdmin,
  updateOrderAdmin,
  getOrder,
} from '@/actions/order.action';
import { format } from 'date-fns';
import Image from 'next/image';

interface OrderItem {
  id: string;
  name: string;
  category: string;
  price: number;
  listPrice: number;
  date: string | Date;
  time: string;
  image: string;
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  name: string;
  phone: string;
  email: string;
  address: string;
  address2?: string | null;
  city: string;
  country: string;
  postalCode: string;
  offerCode?: string | null;
  offerDiscount?: number | null;
  totalPrice: number;
  paymentMethod: string;
  isPaid: boolean;
  startDate: string;
  endDate?: string | null;
  isCompleted: boolean;
  isCancelled: boolean;
  isRefunded: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    name: string;
    email: string;
  };
}

export default function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [orderStatus, setOrderStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  useEffect(() => {
    fetchOrders();
  }, []);

  // Reset to first page when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, searchQuery]);

  const fetchOrders = async () => {
    setLoading(true);
    const result = await getOrdersAdmin();
    if (result.success && result.data) {
      const formattedOrders: Order[] = result.data.map((order: any) => ({
        ...order,
        createdAt: new Date(order.createdAt).toISOString(),
        updatedAt: new Date(order.updatedAt).toISOString(),
        startDate: order.startDate
          ? new Date(order.startDate).toISOString()
          : '',
        endDate: order.endDate
          ? new Date(order.endDate).toISOString()
          : undefined,
        items: Array.isArray(order.items) ? (order.items as OrderItem[]) : [],
      }));
      setOrders(formattedOrders);
    } else {
      toast.error(result.error || 'Failed to fetch orders');
    }
    setLoading(false);
  };

  const viewOrderDetails = async (orderId: string) => {
    setLoadingDetails(true);
    const result = await getOrder(orderId);
    if (result.success && result.data) {
      const rawOrder = result.data;
      const formattedOrder: Order = {
        ...rawOrder,
        createdAt: new Date(rawOrder.createdAt).toISOString(),
        updatedAt: new Date(rawOrder.updatedAt).toISOString(),
        startDate: rawOrder.startDate
          ? new Date(rawOrder.startDate).toISOString()
          : '',
        endDate: rawOrder.endDate
          ? new Date(rawOrder.endDate).toISOString()
          : undefined,
        items: Array.isArray(rawOrder.items)
          ? (rawOrder.items as unknown as OrderItem[])
          : [],
        // Ensure all required properties are present
        userId: rawOrder.userId || '',
        name: rawOrder.name || '',
        phone: rawOrder.phone || '',
        email: rawOrder.email || '',
        address: rawOrder.address || '',
        city: rawOrder.city || '',
        country: rawOrder.country || '',
        postalCode: rawOrder.postalCode || '',
        totalPrice: rawOrder.totalPrice || 0,
        paymentMethod: rawOrder.paymentMethod || 'online',
        isPaid: !!rawOrder.isPaid,
        isCompleted: !!rawOrder.isCompleted,
        isCancelled: !!rawOrder.isCancelled,
        isRefunded: !!rawOrder.isRefunded,
      };

      setOrderDetails(formattedOrder);
      setSelectedOrder(formattedOrder);
      setOrderStatus(getOrderStatusValue(formattedOrder));
      setPaymentStatus(formattedOrder.isPaid ? 'paid' : 'pending');
      setPaymentMethod(formattedOrder.paymentMethod);
    } else {
      toast.error(result.error || 'Failed to fetch order details');
    }
    setLoadingDetails(false);
  };

  const getOrderStatusValue = (order: Order): string => {
    if (order.isCancelled) return 'cancelled';
    if (order.isRefunded) return 'refunded';
    if (order.isCompleted) return 'completed';
    return 'processing';
  };

  const getStatusBadge = (order: Order) => {
    if (order.isCancelled) {
      return <Badge variant="destructive">Cancelled</Badge>;
    } else if (order.isRefunded) {
      return <Badge variant="outline">Refunded</Badge>;
    } else if (order.isCompleted) {
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Completed
        </Badge>
      );
    } else {
      return <Badge variant="secondary">Processing</Badge>;
    }
  };

  const getPaymentBadge = (isPaid: boolean) => {
    return isPaid ? (
      <Badge variant="secondary" className="bg-green-100 text-green-800">
        Paid
      </Badge>
    ) : (
      <Badge variant="secondary">Pending</Badge>
    );
  };

  const updateOrderStatus = async () => {
    if (!selectedOrder) return;

    const updateData: any = {
      isCompleted: false,
      isCancelled: false,
      isRefunded: false,
      isPaid: paymentStatus === 'paid',
      paymentMethod: paymentMethod,
    };

    // Set the appropriate status flag
    if (orderStatus === 'completed') updateData.isCompleted = true;
    if (orderStatus === 'cancelled') updateData.isCancelled = true;
    if (orderStatus === 'refunded') updateData.isRefunded = true;

    setLoading(true);
    const result = await updateOrderAdmin(selectedOrder.id, updateData);

    if (result.success) {
      toast.success('Order updated successfully');
      fetchOrders();
      setSelectedOrder(null);
    } else {
      toast.error(result.error || 'Failed to update order');
    }
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'PPP');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredAndSearchedOrders = orders
    .filter((order) => {
      // First apply status filter
      if (filterStatus === 'all') return true;
      if (filterStatus === 'completed') return order.isCompleted;
      if (filterStatus === 'cancelled') return order.isCancelled;
      if (filterStatus === 'refunded') return order.isRefunded;
      if (filterStatus === 'processing')
        return !order.isCompleted && !order.isCancelled && !order.isRefunded;
      if (filterStatus === 'paid') return order.isPaid;
      if (filterStatus === 'pending') return !order.isPaid;
      return true;
    })
    .filter((order) => {
      // Then apply search query if present
      if (!searchQuery) return true;

      const query = searchQuery.toLowerCase();
      return (
        order.id.toLowerCase().includes(query) ||
        order.name.toLowerCase().includes(query) ||
        order.email.toLowerCase().includes(query) ||
        order.phone.toLowerCase().includes(query) ||
        order.address.toLowerCase().includes(query) ||
        (order.address2 && order.address2.toLowerCase().includes(query)) ||
        order.city.toLowerCase().includes(query) ||
        order.country.toLowerCase().includes(query) ||
        order.postalCode.toLowerCase().includes(query)
      );
    });

  // Pagination calculations
  const totalPages = Math.ceil(
    filteredAndSearchedOrders.length / ordersPerPage,
  );
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredAndSearchedOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder,
  );

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="mx-auto px-4 py-8 space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="border-b pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">
              Orders Management
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="status-filter">Filter by:</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Orders</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Payment Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                onClick={fetchOrders}
                disabled={loading}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
                />
                Refresh
              </Button>
            </div>
          </div>

          {/* Search bar */}
          <div className="mt-4 flex items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, phone, order ID, or address..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table className="min-w-full">
                  <TableHeader className="bg-gray-100">
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentOrders.length > 0 ? (
                      currentOrders.map((order) => (
                        <TableRow key={order.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">
                            {order.id.substring(0, 8)}...
                          </TableCell>
                          <TableCell>{order.name}</TableCell>
                          <TableCell>
                            <div className="text-sm space-y-1">
                              <div>{order.phone}</div>
                              <div className="text-gray-500">{order.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(order.createdAt)}</TableCell>
                          <TableCell>
                            {formatCurrency(order.totalPrice)}
                          </TableCell>
                          <TableCell>{getPaymentBadge(order.isPaid)}</TableCell>
                          <TableCell>{getStatusBadge(order)}</TableCell>
                          <TableCell className="text-right">
                            <div className="px-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => viewOrderDetails(order.id)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="rounded !w-full !max-w-[1200px] max-h-[90vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>Order Details</DialogTitle>
                                    <DialogDescription>
                                      Order #{order.id}
                                    </DialogDescription>
                                  </DialogHeader>

                                  {loadingDetails ? (
                                    <div className="flex justify-center py-10">
                                      <Loader2 className="h-8 w-8 animate-spin" />
                                    </div>
                                  ) : orderDetails ? (
                                    <>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                        <div className="space-y-4">
                                          <div>
                                            <h3 className="font-semibold text-lg">
                                              Customer Information
                                            </h3>
                                            <div className="mt-2 space-y-1">
                                              <p>
                                                <span className="font-medium">
                                                  Name:
                                                </span>{' '}
                                                {orderDetails.name}
                                              </p>
                                              <p>
                                                <span className="font-medium">
                                                  Email:
                                                </span>{' '}
                                                {orderDetails.email}
                                              </p>
                                              <p>
                                                <span className="font-medium">
                                                  Phone:
                                                </span>{' '}
                                                {orderDetails.phone}
                                              </p>
                                            </div>
                                          </div>

                                          <div>
                                            <h3 className="font-semibold text-lg">
                                              Shipping Address
                                            </h3>
                                            <div className="mt-2 space-y-1">
                                              <p>{orderDetails.address}</p>
                                              {orderDetails.address2 && (
                                                <p>{orderDetails.address2}</p>
                                              )}
                                              <p>
                                                {orderDetails.city},{' '}
                                                {orderDetails.postalCode}
                                              </p>
                                              <p>{orderDetails.country}</p>
                                            </div>
                                          </div>

                                          <div>
                                            <h3 className="font-semibold text-lg">
                                              Order Summary
                                            </h3>
                                            <div className="mt-2 space-y-1">
                                              <p>
                                                <span className="font-medium">
                                                  Order Date:
                                                </span>{' '}
                                                {formatDate(
                                                  orderDetails.createdAt,
                                                )}
                                              </p>
                                              <p>
                                                <span className="font-medium">
                                                  Start Date:
                                                </span>{' '}
                                                {formatDate(
                                                  orderDetails.startDate,
                                                )}
                                              </p>
                                              {orderDetails.endDate && (
                                                <p>
                                                  <span className="font-medium">
                                                    End Date:
                                                  </span>{' '}
                                                  {formatDate(
                                                    orderDetails.endDate,
                                                  )}
                                                </p>
                                              )}
                                              <p>
                                                <span className="font-medium">
                                                  Payment Method:
                                                </span>{' '}
                                                {orderDetails.paymentMethod}
                                              </p>
                                              <p>
                                                <span className="font-medium">
                                                  Payment Status:
                                                </span>{' '}
                                                {orderDetails.isPaid
                                                  ? 'Paid'
                                                  : 'Pending'}
                                              </p>
                                              {orderDetails.offerCode && (
                                                <p>
                                                  <span className="font-medium">
                                                    Offer Code:
                                                  </span>{' '}
                                                  {orderDetails.offerCode}
                                                </p>
                                              )}
                                            </div>
                                          </div>
                                        </div>

                                        <div className="space-y-4">
                                          <div>
                                            <h3 className="font-semibold text-lg">
                                              Order Items
                                            </h3>
                                            <div className="mt-2 space-y-3">
                                              {orderDetails.items.map(
                                                (item, index) => (
                                                  <div
                                                    key={index}
                                                    className="flex gap-3 border-b pb-2"
                                                  >
                                                    <div className="w-16 h-16 relative overflow-hidden rounded">
                                                      <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover"
                                                      />
                                                    </div>
                                                    <div className="flex-1">
                                                      <p className="font-medium">
                                                        {item.name}
                                                      </p>
                                                      <p className="text-sm text-gray-600">
                                                        {item.category}
                                                      </p>
                                                      <div className="flex justify-between mt-1">
                                                        <p className="text-sm">
                                                          {typeof item.date ===
                                                          'string'
                                                            ? formatDate(
                                                                item.date,
                                                              )
                                                            : 'N/A'}{' '}
                                                          - {item.time}
                                                        </p>
                                                        <p className="font-medium">
                                                          {formatCurrency(
                                                            item.price,
                                                          )}
                                                        </p>
                                                      </div>
                                                    </div>
                                                  </div>
                                                ),
                                              )}
                                            </div>
                                          </div>

                                          <div className="border-t pt-3">
                                            <div className="flex justify-between">
                                              <p>Subtotal:</p>
                                              <p>
                                                {formatCurrency(
                                                  orderDetails.totalPrice +
                                                    (orderDetails.offerDiscount ||
                                                      0),
                                                )}
                                              </p>
                                            </div>
                                            {orderDetails.offerDiscount &&
                                              orderDetails.offerDiscount >
                                                0 && (
                                                <div className="flex justify-between text-green-600">
                                                  <p>
                                                    Discount (
                                                    {orderDetails.offerCode}):
                                                  </p>
                                                  <p>
                                                    -
                                                    {formatCurrency(
                                                      orderDetails.offerDiscount,
                                                    )}
                                                  </p>
                                                </div>
                                              )}
                                            <div className="flex justify-between font-bold text-lg mt-2">
                                              <p>Total:</p>
                                              <p>
                                                {formatCurrency(
                                                  orderDetails.totalPrice,
                                                )}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="border-t mt-6 pt-4">
                                        <h3 className="font-semibold text-lg">
                                          Update Order
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                                          <div className="space-y-2">
                                            <Label htmlFor="order-status">
                                              Order Status
                                            </Label>
                                            <Select
                                              value={orderStatus}
                                              onValueChange={setOrderStatus}
                                            >
                                              <SelectTrigger>
                                                <SelectValue placeholder="Order Status" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="processing">
                                                  Processing
                                                </SelectItem>
                                                <SelectItem value="completed">
                                                  Completed
                                                </SelectItem>
                                                <SelectItem value="cancelled">
                                                  Cancelled
                                                </SelectItem>
                                                <SelectItem value="refunded">
                                                  Refunded
                                                </SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>

                                          <div className="space-y-2">
                                            <Label htmlFor="payment-status">
                                              Payment Status
                                            </Label>
                                            <Select
                                              value={paymentStatus}
                                              onValueChange={setPaymentStatus}
                                            >
                                              <SelectTrigger>
                                                <SelectValue placeholder="Payment Status" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="pending">
                                                  Pending
                                                </SelectItem>
                                                <SelectItem value="paid">
                                                  Paid
                                                </SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>

                                          <div className="space-y-2">
                                            <Label htmlFor="payment-method">
                                              Payment Method
                                            </Label>
                                            <Select
                                              value={paymentMethod}
                                              onValueChange={setPaymentMethod}
                                            >
                                              <SelectTrigger>
                                                <SelectValue placeholder="Payment Method" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="online">
                                                  Online
                                                </SelectItem>
                                                <SelectItem value="cash">
                                                  Cash
                                                </SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                        </div>
                                      </div>

                                      <DialogFooter className="mt-6">
                                        <DialogClose asChild>
                                          <Button variant="outline">
                                            Cancel
                                          </Button>
                                        </DialogClose>
                                        <Button
                                          onClick={updateOrderStatus}
                                          disabled={loading}
                                        >
                                          {loading && (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                          )}
                                          Update Order
                                        </Button>
                                      </DialogFooter>
                                    </>
                                  ) : (
                                    <div className="text-center py-6">
                                      <p>Failed to load order details</p>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="text-center py-10 text-gray-500"
                        >
                          No orders found matching the current filter or search
                          query
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {filteredAndSearchedOrders.length > 0 && (
                <div className="flex items-center justify-between border-t pt-4 mt-4">
                  <div className="text-sm text-gray-500">
                    Showing{' '}
                    <span className="font-medium">{indexOfFirstOrder + 1}</span>{' '}
                    to{' '}
                    <span className="font-medium">
                      {Math.min(
                        indexOfLastOrder,
                        filteredAndSearchedOrders.length,
                      )}
                    </span>{' '}
                    of{' '}
                    <span className="font-medium">
                      {filteredAndSearchedOrders.length}
                    </span>{' '}
                    orders
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      // Show 5 page numbers at most
                      let pageNum;
                      if (totalPages <= 5) {
                        // If 5 or fewer pages, show all
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        // If near the start, show 1,2,3,4,5
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        // If near the end, show last 5 pages
                        pageNum = totalPages - 4 + i;
                      } else {
                        // Otherwise show currentPage-2, currentPage-1, currentPage, currentPage+1, currentPage+2
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={
                            currentPage === pageNum ? 'default' : 'outline'
                          }
                          size="sm"
                          onClick={() => paginate(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages || totalPages === 0}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
