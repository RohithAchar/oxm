import LogoutButton from "@/components/LogoutButton";
import { ProfileCardSkeleton } from "@/components/user/skeletons";
import { Button } from "@/components/ui/button";
import { ProfileCard } from "@/components/user/profile-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Suspense } from "react";
import {
  User,
  ShoppingBag,
  MapPin,
  MessageSquare,
  Bell,
  Store,
  Truck,
  Shield,
  HelpCircle,
  FileText,
  LogOut,
  Heart,
} from "lucide-react";

const AccountPage = async () => {
  return (
    <div className="py-4 space-y-6">
      {/* Profile Section */}
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">My Account</h1>
        <Suspense fallback={<ProfileCardSkeleton />}>
          <ProfileCard />
        </Suspense>
      </div>

      {/* Business Hub Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Business Hub
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              asChild
              variant="outline"
              className="h-auto p-4 flex flex-col items-start gap-2"
            >
              <Link href="/intro">
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4" />
                  <span className="font-medium">Supplier Hub</span>
                </div>
                <span className="text-sm text-muted-foreground text-left">
                  Start selling and manage your business
                </span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-auto p-4 flex flex-col items-start gap-2"
            >
              <Link href="/dropship">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  <span className="font-medium">Dropship Store</span>
                </div>
                <span className="text-sm text-muted-foreground text-left">
                  Create your dropshipping store
                </span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Management Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              asChild
              variant="ghost"
              className="w-full justify-start h-auto p-3"
            >
              <Link href="/account/profile">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4" />
                  <div className="text-left">
                    <div className="font-medium">Update Profile</div>
                    <div className="text-sm text-muted-foreground">
                      Edit your name and profile picture
                    </div>
                  </div>
                </div>
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="w-full justify-start h-auto p-3"
            >
              <Link href="/addresses">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4" />
                  <div className="text-left">
                    <div className="font-medium">Manage Addresses</div>
                    <div className="text-sm text-muted-foreground">
                      Add and edit your addresses
                    </div>
                  </div>
                </div>
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Orders & Shopping */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Orders & Shopping
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              asChild
              variant="ghost"
              className="w-full justify-start h-auto p-3"
            >
              <Link href="/orders">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="h-4 w-4" />
                  <div className="text-left">
                    <div className="font-medium">My Orders & Wishlist</div>
                    <div className="text-sm text-muted-foreground">
                      Track orders and manage wishlist
                    </div>
                  </div>
                </div>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Communication & Support */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Communication */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Communication
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              asChild
              variant="ghost"
              className="w-full justify-start h-auto p-3"
            >
              <Link href="/messages">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-4 w-4" />
                  <div className="text-left">
                    <div className="font-medium">Messages</div>
                    <div className="text-sm text-muted-foreground">
                      Chat with suppliers and support
                    </div>
                  </div>
                </div>
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="w-full justify-start h-auto p-3"
            >
              <Link href="/notifications">
                <div className="flex items-center gap-3">
                  <Bell className="h-4 w-4" />
                  <div className="text-left">
                    <div className="font-medium">Notifications</div>
                    <div className="text-sm text-muted-foreground">
                      Manage your notification preferences
                    </div>
                  </div>
                </div>
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="w-full justify-start h-auto p-3"
            >
              <Link href="/account/favorite-suppliers">
                <div className="flex items-center gap-3">
                  <Heart className="h-4 w-4" />
                  <div className="text-left">
                    <div className="font-medium">Favorite Suppliers</div>
                    <div className="text-sm text-muted-foreground">
                      Manage your saved suppliers
                    </div>
                  </div>
                </div>
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Support & Legal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Support & Legal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              asChild
              variant="ghost"
              className="w-full justify-start h-auto p-3"
            >
              <Link href="/support">
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-4 w-4" />
                  <div className="text-left">
                    <div className="font-medium">Support</div>
                    <div className="text-sm text-muted-foreground">
                      Get help and contact support
                    </div>
                  </div>
                </div>
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="w-full justify-start h-auto p-3"
            >
              <Link href="/buyer-protection-policy">
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4" />
                  <div className="text-left">
                    <div className="font-medium">Buyer Protection Policy</div>
                    <div className="text-sm text-muted-foreground">
                      Learn about your protection rights
                    </div>
                  </div>
                </div>
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="w-full justify-start h-auto p-3"
            >
              <Link href="/legal-policies">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4" />
                  <div className="text-left">
                    <div className="font-medium">Legal Policies</div>
                    <div className="text-sm text-muted-foreground">
                      Terms, privacy, and other policies
                    </div>
                  </div>
                </div>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Logout Section */}
      <div className="w-full mt-6">
        <LogoutButton
          className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 p-4 rounded-lg transition-colors border border-destructive/20 hover:border-destructive/40"
          variant="ghost"
        />
      </div>
    </div>
  );
};

export default AccountPage;
