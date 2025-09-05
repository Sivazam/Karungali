"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  Edit,
  Eye,
  Download
} from "lucide-react";

// Mock order data - in real app, this would come from API
const mockOrders = [
  {
    id: "SS-2024-123456",
    date: "2024-01-15",
    status: "delivered",
    total: 3148.99,
    items: [
      { name: "Premium Karungali Mala - 108 Beads", quantity: 1, price: 2999 }
    ],
    trackingNumber: "SF1234567890",
    estimatedDelivery: "2024-01-20",
    actualDelivery: "2024-01-19"
  },
  {
    id: "SS-2024-123457",
    date: "2024-01-18",
    status: "shipped",
    total: 1899.00,
    items: [
      { name: "Rudraksha Mala - 5 Mukhi", quantity: 1, price: 1899 }
    ],
    trackingNumber: "SF1234567891",
    estimatedDelivery: "2024-01-23",
    actualDelivery: null
  },
  {
    id: "SS-2024-123458",
    date: "2024-01-20",
    status: "processing",
    total: 599.00,
    items: [
      { name: "Spiritual Incense Sticks Set", quantity: 2, price: 299.50 }
    ],
    trackingNumber: null,
    estimatedDelivery: "2024-01-25",
    actualDelivery: null
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "delivered":
      return <Badge className="bg-green-100 text-green-800">Delivered</Badge>;
    case "shipped":
      return <Badge className="bg-blue-100 text-blue-800">Shipped</Badge>;
    case "processing":
      return <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>;
    case "cancelled":
      return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "delivered":
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    case "shipped":
      return <Truck className="h-5 w-5 text-blue-600" />;
    case "processing":
      return <Clock className="h-5 w-5 text-yellow-600" />;
    default:
      return <Package className="h-5 w-5 text-gray-600" />;
  }
};

export default function OrdersPage() {
  const [orders, setOrders] = useState(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const trackOrder = (trackingNumber: string) => {
    // In real app, this would open tracking modal or redirect to tracking page
    alert(`Tracking order: ${trackingNumber}`);
  };

  const downloadInvoice = (orderId: string) => {
    // In real app, this would generate and download PDF invoice
    alert(`Downloading invoice for order: ${orderId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-muted-foreground">
          Track your spiritual items orders and view order history
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search orders by ID or product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background"
          >
            <option value="all">All Status</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No orders found</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your search or filter criteria"
                  : "You haven't placed any orders yet"
                }
              </p>
              {(searchTerm || statusFilter !== "all") && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  {/* Order Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                        <p className="text-sm text-muted-foreground">
                          Placed on {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>

                    {/* Order Items */}
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 text-sm">
                          <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                            <div className="text-lg">📿</div>
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-muted-foreground">
                              Qty: {item.quantity} × ₹{item.price}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Status & Tracking */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <span className="text-sm font-medium capitalize">
                          {order.status === "delivered" && "Delivered"}
                          {order.status === "shipped" && "Out for delivery"}
                          {order.status === "processing" && "Being prepared"}
                        </span>
                      </div>
                      
                      {order.trackingNumber && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Tracking:</span>
                          <span className="font-mono ml-1">{order.trackingNumber}</span>
                        </div>
                      )}
                    </div>

                    {/* Delivery Info */}
                    <div className="text-sm text-muted-foreground">
                      {order.status === "delivered" && order.actualDelivery && (
                        <p>Delivered on {new Date(order.actualDelivery).toLocaleDateString()}</p>
                      )}
                      {order.status === "shipped" && order.estimatedDelivery && (
                        <p>Estimated delivery by {new Date(order.estimatedDelivery).toLocaleDateString()}</p>
                      )}
                      {order.status === "processing" && order.estimatedDelivery && (
                        <p>Estimated delivery by {new Date(order.estimatedDelivery).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>

                  {/* Actions & Total */}
                  <div className="flex flex-col items-end gap-3">
                    <div className="text-right">
                      <div className="text-2xl font-bold">₹{order.total}</div>
                      <div className="text-sm text-muted-foreground">
                        {order.items.reduce((total, item) => total + item.quantity, 0)} items
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {order.trackingNumber && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => trackOrder(order.trackingNumber!)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Track
                        </Button>
                      )}
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => downloadInvoice(order.id)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Invoice
                      </Button>
                    </div>

                    {order.status === "delivered" && (
                      <Button size="sm" className="w-full">
                        Buy Again
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {orders.filter(o => o.status === "processing").length}
            </div>
            <div className="text-sm text-muted-foreground">Processing</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {orders.filter(o => o.status === "shipped").length}
            </div>
            <div className="text-sm text-muted-foreground">Shipped</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {orders.filter(o => o.status === "delivered").length}
            </div>
            <div className="text-sm text-muted-foreground">Delivered</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {orders.length}
            </div>
            <div className="text-sm text-muted-foreground">Total Orders</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}