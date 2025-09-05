"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/hooks/use-auth";
import { 
  User, 
  Package, 
  MapPin, 
  CreditCard,
  Heart,
  Settings,
  Bell,
  Shield,
  Edit,
  Save,
  Plus,
  Trash2,
  ChevronRight
} from "lucide-react";

// Mock user data
const userData = {
  fullName: "Rajesh Kumar",
  email: "rajesh.kumar@email.com",
  phone: "+91 98765 43210",
  joinDate: "2023-06-15",
  totalOrders: 12,
  totalSpent: 45678.50
};

// Mock addresses
const addresses = [
  {
    id: "1",
    type: "Home",
    fullName: "Rajesh Kumar",
    phone: "+91 98765 43210",
    address: "123, Spiritual Street",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    isDefault: true
  },
  {
    id: "2", 
    type: "Work",
    fullName: "Rajesh Kumar",
    phone: "+91 98765 43210",
    address: "456, Office Complex",
    city: "Mumbai",
    state: "Maharashtra", 
    pincode: "400051",
    isDefault: false
  }
];

export default function AccountPage() {
  const { user, userProfile, isAuthenticated } = useAuth();
  
  // Use userProfile from Firestore if available, otherwise fall back to mock data
  const displayUserData = userProfile ? {
    ...userData,
    fullName: userProfile.fullName || userData.fullName,
    email: userProfile.email || userData.email,
    phone: userProfile.phoneNumber || userData.phone,
    joinDate: userProfile.createdAt?.toDate().toISOString().split('T')[0] || userData.joinDate,
    totalOrders: userProfile.totalOrders || userData.totalOrders,
    totalSpent: userProfile.totalSpent || userData.totalSpent,
  } : userData;

  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(displayUserData);

  const handleSaveProfile = () => {
    // In real app, this would save to backend
    console.log("Saving profile:", editedUser);
    setIsEditing(false);
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Account</h1>
          <p className="text-muted-foreground">
            Manage your profile, orders, and preferences
          </p>
        </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                <Button
                  variant={activeTab === "overview" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("overview")}
                >
                  <User className="mr-2 h-4 w-4" />
                  Overview
                </Button>
                
                <Link href="/account/orders">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                  >
                    <Package className="mr-2 h-4 w-4" />
                    My Orders
                    <ChevronRight className="ml-auto h-4 w-4" />
                  </Button>
                </Link>
                
                <Button
                  variant={activeTab === "addresses" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("addresses")}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Addresses
                </Button>
                
                <Button
                  variant={activeTab === "payment" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("payment")}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Payment Methods
                </Button>
                
                <Button
                  variant={activeTab === "wishlist" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("wishlist")}
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Wishlist
                </Button>
                
                <Button
                  variant={activeTab === "notifications" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("notifications")}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </Button>
                
                <Button
                  variant={activeTab === "security" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("security")}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Security
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Profile Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Profile Information</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      {isEditing ? "Cancel" : "Edit"}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input
                            id="fullName"
                            value={editedUser.fullName}
                            onChange={(e) => setEditedUser({...editedUser, fullName: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={editedUser.email}
                            onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={editedUser.phone}
                            onChange={(e) => setEditedUser({...editedUser, phone: e.target.value})}
                          />
                        </div>
                      </div>
                      <Button onClick={handleSaveProfile}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-muted-foreground">Full Name</Label>
                        <div className="font-medium">{displayUserData.fullName}</div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Email</Label>
                        <div className="font-medium">{displayUserData.email}</div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Phone</Label>
                        <div className="font-medium">{displayUserData.phone}</div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Member Since</Label>
                        <div className="font-medium">{new Date(displayUserData.joinDate).toLocaleDateString()}</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Account Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-primary">{displayUserData.totalOrders}</div>
                    <div className="text-sm text-muted-foreground">Total Orders</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-green-600">₹{displayUserData.totalSpent.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Total Spent</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {Math.floor((Date.now() - new Date(displayUserData.joinDate).getTime()) / (1000 * 60 * 60 * 24))}
                    </div>
                    <div className="text-sm text-muted-foreground">Days Member</div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link href="/account/orders">
                      <Button variant="outline" className="w-full justify-start">
                        <Package className="mr-2 h-4 w-4" />
                        View All Orders
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full justify-start">
                      <Heart className="mr-2 h-4 w-4" />
                      My Wishlist
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <MapPin className="mr-2 h-4 w-4" />
                      Manage Addresses
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Payment Methods
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === "addresses" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Saved Addresses</span>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Address
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div key={address.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">{address.type}</span>
                            {address.isDefault && (
                              <Badge variant="secondary">Default</Badge>
                            )}
                          </div>
                          <div className="text-sm space-y-1">
                            <div>{address.fullName}</div>
                            <div>{address.phone}</div>
                            <div>{address.address}</div>
                            <div>{address.city}, {address.state} - {address.pincode}</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          {!address.isDefault && (
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Methods Tab */}
          {activeTab === "payment" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Payment Methods</span>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Payment Method
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <CreditCard className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Payment Methods</h3>
                  <p className="text-muted-foreground mb-6">
                    Add a payment method for faster checkout
                  </p>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Payment Method
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Wishlist Tab */}
          {activeTab === "wishlist" && (
            <Card>
              <CardHeader>
                <CardTitle>My Wishlist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Your Wishlist is Empty</h3>
                  <p className="text-muted-foreground mb-6">
                    Save your favorite spiritual items for later
                  </p>
                  <Link href="/products">
                    <Button>Browse Products</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Order Updates</div>
                      <div className="text-sm text-muted-foreground">
                        Get notified about your order status
                      </div>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Promotional Offers</div>
                      <div className="text-sm text-muted-foreground">
                        Receive exclusive deals and discounts
                      </div>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">New Products</div>
                      <div className="text-sm text-muted-foreground">
                        Be the first to know about new spiritual items
                      </div>
                    </div>
                    <input type="checkbox" className="rounded" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Spiritual Content</div>
                      <div className="text-sm text-muted-foreground">
                        Receive wisdom and meditation tips
                      </div>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-4">Password</h4>
                    <Button variant="outline">Change Password</Button>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-4">Two-Factor Authentication</h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm">Add an extra layer of security</div>
                        <div className="text-xs text-muted-foreground">
                          Not enabled
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Enable</Button>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-4">Login Activity</h4>
                    <div className="text-sm text-muted-foreground">
                      Last login: Today at 2:30 PM from Mumbai, India
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <Button variant="destructive" size="sm">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      </div>
    </ProtectedRoute>
  );
}