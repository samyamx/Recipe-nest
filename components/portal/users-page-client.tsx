"use client"

import { useState } from "react"
import { Search, MoreHorizontal, Trash2, Pencil, Shield } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"

type PortalUser = {
  createdAt: string
  email: string
  id: string
  joined: string
  name: string
  recipes: number
  role: "Admin" | "Chef"
  status: "Active" | "Inactive"
}

export function UsersPageClient({ initialUsers }: { initialUsers: PortalUser[] }) {
  const [search, setSearch] = useState("")
  const [users, setUsers] = useState(initialUsers)
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [roleDialog, setRoleDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<PortalUser | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  )

  async function handleDelete() {
    if (!selectedUser) return
    setIsUpdating(true)
    try {
      // In a real app, call DELETE /api/users/[id]
      setUsers(users.filter((u) => u.id !== selectedUser.id))
      toast.success(`User ${selectedUser.name} removed from the list`)
    } finally {
      setIsUpdating(false)
      setDeleteDialog(false)
    }
  }

  async function handleRoleChange(newRole: "Admin" | "Chef") {
    if (!selectedUser) return
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      })

      if (!response.ok) throw new Error("Failed to update role")

      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, role: newRole } : u))
      toast.success(`Role for ${selectedUser.name} updated to ${newRole}`)
    } catch (error) {
      toast.error("Could not update role")
    } finally {
      setIsUpdating(false)
      setRoleDialog(false)
    }
  }

  return (
    <div>
      <div>
        <h1 className="font-serif text-2xl text-foreground lg:text-3xl">User Management</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage platform users and their roles</p>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
      </div>

      <Card className="mt-6 border-border">
        <CardHeader>
          <CardTitle className="text-base font-medium">All Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 font-medium text-muted-foreground">Name</th>
                  <th className="pb-3 font-medium text-muted-foreground">Email</th>
                  <th className="pb-3 font-medium text-muted-foreground">Role</th>
                  <th className="pb-3 font-medium text-muted-foreground">Recipes</th>
                  <th className="pb-3 font-medium text-muted-foreground">Joined</th>
                  <th className="pb-3 font-medium text-muted-foreground">Status</th>
                  <th className="pb-3 text-right font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="py-3 font-medium text-foreground">{user.name}</td>
                    <td className="py-3 text-muted-foreground">{user.email}</td>
                    <td className="py-3">
                      <Badge variant={user.role === "Admin" ? "default" : "secondary"} className={user.role === "Admin" ? "bg-primary text-primary-foreground" : ""}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-3 text-muted-foreground">{user.recipes}</td>
                    <td className="py-3 text-muted-foreground">{user.joined}</td>
                    <td className="py-3">
                      <Badge variant={user.status === "Active" ? "outline" : "secondary"} className={user.status === "Active" ? "border-accent text-accent" : ""}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`Actions for ${user.name}`}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            className="gap-2 cursor-pointer"
                            onClick={() => {
                              setSelectedUser(user)
                              setRoleDialog(true)
                            }}
                          >
                            <Shield className="h-3.5 w-3.5" />
                            Change Role
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                            onClick={() => {
                              setSelectedUser(user)
                              setDeleteDialog(true)
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Role Dialog */}
      <Dialog open={roleDialog} onOpenChange={setRoleDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Assign a new role to {selectedUser?.name}. This will change their permissions immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-4">
            {(["Admin", "Chef"] as const).map((role) => (
              <Button
                key={role}
                variant={selectedUser?.role === role ? "default" : "outline"}
                className="justify-start gap-3 h-12"
                onClick={() => handleRoleChange(role)}
                disabled={isUpdating}
              >
                <Shield className={cn("h-4 w-4", selectedUser?.role === role ? "text-primary-foreground" : "text-muted-foreground")} />
                <div className="text-left">
                  <p className="font-medium">{role}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {role === "Admin" ? "Full access to management" : 
                     "Can create and manage recipes"}
                  </p>
                </div>
              </Button>
            ))}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRoleDialog(false)} disabled={isUpdating}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedUser?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteDialog(false)} disabled={isUpdating}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isUpdating}>
              {isUpdating ? "Deleting..." : "Delete User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

import { cn } from "@/lib/utils"
