import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, MapPin, Shield, Settings, Bell } from "lucide-react";

const Profile = () => {
  const userProfile = {
    name: "Peter Ndegwa",
    title: "Chief Executive Officer",
    email: "peter.ndegwa@safaricom.co.ke",
    phone: "+254 722 000 001",
    location: "Nairobi, Kenya",
    department: "Executive",
    clearanceLevel: "Executive",
    lastLogin: "Today at 09:15 AM",
    avatar: "/placeholder.svg"
  };

  const accessPermissions = [
    { name: "Executive Dashboard", level: "Full Access", status: "active" },
    { name: "Financial Reports", level: "Read/Write", status: "active" },
    { name: "HR Systems", level: "Read Only", status: "active" },
    { name: "SOC Operations", level: "Read Only", status: "active" },
    { name: "Network Management", level: "Read Only", status: "active" },
    { name: "Compliance Portal", level: "Full Access", status: "active" }
  ];

  const recentActivity = [
    { action: "Viewed Executive Dashboard", timestamp: "2 minutes ago" },
    { action: "Accessed Financial Reports", timestamp: "15 minutes ago" },
    { action: "Updated security settings", timestamp: "1 hour ago" },
    { action: "Reviewed SOC alerts", timestamp: "2 hours ago" },
    { action: "Joined board meeting", timestamp: "3 hours ago" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <User className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">Profile</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                <AvatarFallback className="text-lg">
                  {userProfile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">{userProfile.name}</h2>
                <p className="text-lg text-muted-foreground">{userProfile.title}</p>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="flex items-center space-x-1">
                    <Shield className="h-3 w-3" />
                    <span>{userProfile.clearanceLevel} Clearance</span>
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Email</div>
                    <div className="text-sm text-muted-foreground">{userProfile.email}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Phone</div>
                    <div className="text-sm text-muted-foreground">{userProfile.phone}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Location</div>
                    <div className="text-sm text-muted-foreground">{userProfile.location}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Department</div>
                    <div className="text-sm text-muted-foreground">{userProfile.department}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Last login: {userProfile.lastLogin}
              </div>
            </div>

            <div className="flex space-x-2">
              <Button>
                <Settings className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="outline">
                <Bell className="h-4 w-4 mr-2" />
                Notification Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start">
              <Settings className="h-4 w-4 mr-2" />
              Account Settings
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Shield className="h-4 w-4 mr-2" />
              Security Settings
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <User className="h-4 w-4 mr-2" />
              Privacy Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Access Permissions */}
        <Card>
          <CardHeader>
            <CardTitle>Access Permissions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {accessPermissions.map((permission, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <div className="font-medium text-sm">{permission.name}</div>
                  <div className="text-xs text-muted-foreground">{permission.level}</div>
                </div>
                <Badge variant="secondary">
                  {permission.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="text-sm">{activity.action}</div>
                <div className="text-xs text-muted-foreground">{activity.timestamp}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;