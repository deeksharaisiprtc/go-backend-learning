import React, { useState } from "react";
import { useUserStore } from "@/lib/store";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, RefreshCcw, Search, UserX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Schema for User Form
const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

type UserFormValues = z.infer<typeof userSchema>;

export default function UsersPage() {
  const { users, createUser, updateUser, deleteUser, restoreUser, isLoading } = useUserStore();
  const [showDeleted, setShowDeleted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<number | null>(null);
  const { toast } = useToast();

  // Filter users based on search and soft-delete toggle
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    // If showDeleted is true, show ALL users (including deleted)
    // If showDeleted is false, show ONLY active users (deleted_at is null)
    const matchesDeleteStatus = showDeleted ? true : user.deleted_at === null;

    return matchesSearch && matchesDeleteStatus;
  });

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const onSubmit = (data: UserFormValues) => {
    if (editingUser) {
      updateUser(editingUser, data);
      toast({ title: "User updated", description: "The user details have been updated." });
      setEditingUser(null);
    } else {
      createUser(data);
      toast({ title: "User created", description: "A new user has been added to the system." });
    }
    setIsCreateOpen(false);
    form.reset();
  };

  const startEdit = (user: any) => {
    setEditingUser(user.id);
    form.reset({
      name: user.name,
      email: user.email,
    });
    setIsCreateOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteUser(id);
    toast({ 
      title: "User deleted", 
      description: "User has been soft-deleted.",
      variant: "destructive"
    });
  };

  const handleRestore = (id: number) => {
    restoreUser(id);
    toast({ 
      title: "User restored", 
      description: "User has been restored to active status."
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground mt-1">
            Manage your users and view their status.
          </p>
        </div>
        <Button onClick={() => { setEditingUser(null); form.reset(); setIsCreateOpen(true); }} className="shadow-sm">
          <Plus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-green-600">{users.filter(u => !u.deleted_at).length}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Soft Deleted</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-destructive">{users.filter(u => u.deleted_at).length}</div>
            </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-lg border shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-9 bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="show-deleted"
            checked={showDeleted}
            onCheckedChange={setShowDeleted}
          />
          <Label htmlFor="show-deleted" className="cursor-pointer">
            Show Deleted Users
          </Label>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-md border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Created At</TableHead>
              <TableHead className="hidden md:table-cell">Deleted At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className={user.deleted_at ? "bg-muted/30" : ""}>
                  <TableCell className="font-mono text-xs">{user.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className={cn("font-medium", user.deleted_at && "text-muted-foreground line-through decoration-destructive/50")}>
                        {user.name}
                      </span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.deleted_at ? (
                      <Badge variant="destructive" className="bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20">
                        Deleted
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-500/10 text-green-700 hover:bg-green-500/20 border-green-200">
                        Active
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                    {format(new Date(user.created_at), "PP")}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                    {user.deleted_at ? format(new Date(user.deleted_at), "PP p") : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {user.deleted_at ? (
                         <Button
                         variant="outline"
                         size="sm"
                         onClick={() => handleRestore(user.id)}
                         className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                       >
                         <RefreshCcw className="h-3.5 w-3.5 mr-1" /> Restore
                       </Button>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() => startEdit(user)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Soft Delete User?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will mark the user as deleted. They will not appear in standard lists
                                  but can be restored later. This simulates setting the <code className="bg-muted px-1 rounded">deleted_at</code> timestamp in the database.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  onClick={() => handleDelete(user.id)}
                                >
                                  Soft Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit User Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit User" : "Create User"}</DialogTitle>
            <DialogDescription>
              {editingUser
                ? "Update the user's details. These changes will be reflected in the system."
                : "Add a new user to the system. They will be active immediately."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john@example.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save User"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
