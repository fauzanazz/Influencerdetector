"use client"

import {useState, useMemo, SetStateAction} from "react"
import {Input} from "@/components/ui/input"
import {DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem} from "@/components/ui/dropdown-menu"
import {Button} from "@/components/ui/button"
import {Table, TableHeader, TableRow, TableHead, TableBody, TableCell} from "@/components/ui/table"
import {Label} from "@/components/ui/label"
import {UserManagementData} from "@/data/database"
import {deleteUser, GetUserManagementData, updateUser} from "@/REST API/User";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CreateUserForm } from "./create-user-form"
import Link from "next/link";

interface UserManagementCompProps {
    usersData: UserManagementData[]
}
export const UserManagementComp: React.FC<UserManagementCompProps> = ({ usersData }) => {
    const [users, setUsers] = useState<UserManagementData[]>(usersData)
    const [selectedUser, setSelectedUser] = useState<UserManagementData | null>(null)
    const [sortBy, setSortBy] = useState("name")
    const [sortOrder, setSortOrder] = useState("asc")
    const [filterText, setFilterText] = useState("")
    const [openUpload, setOpenUpload] = useState(false)
    const [batchFile, setBatchFile] = useState<File | null>(null)

    const sortedUsers = useMemo(() => {
        const sortedArray = [...users].sort((a, b) => {
            if (sortBy === "name" || sortBy === "joinDate") {
                // Sort by string
                if (a[sortBy] < b[sortBy]) return sortOrder === "asc" ? -1 : 1
                if (a[sortBy] > b[sortBy]) return sortOrder === "asc" ? 1 : -1
            } else if (sortBy === "followers" || sortBy === "tweets") {
                // Sort by number
                if (a.followers < b[sortBy]) return sortOrder === "asc" ? 1 : -1
                if (a[sortBy] > b[sortBy]) return sortOrder === "asc" ? -1 : 1
            }
            return 0
        });
        return sortedArray;
    }, [users, sortBy, sortOrder]);

    const filteredUsers = useMemo(() => {
        return sortedUsers.filter((user) => user.name.toLowerCase().includes(filterText.toLowerCase()))
    }, [sortedUsers, filterText])

    const handleSort = (key: SetStateAction<string>) => {
        if (sortBy === key) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
        } else {
            setSortBy(key)
            setSortOrder("asc")
        }
    }

    const handleFilter = (e: { target: { value: SetStateAction<string> } }) => {
        setFilterText(e.target.value)
    }
    const handleEdit = (user: SetStateAction<UserManagementData | null>) => {
        setSelectedUser(user)
    }
    const handleSaveEdit = () => {
        if (!selectedUser) return
        const {joinDate, tweetsData, tweets, ...rest} = selectedUser
        if (joinDate === null || new Date(joinDate) > new Date()) {
            alert("Invalid Date");
            return;
        }
        const data = {
            ...rest,
            joinDate: new Date(joinDate),
        }
        updateUser(data).then((res) => {
            if (res.status) {
                alert(res.status)
                return
            }
            const updatedUsers = users.map((user) => {
                if (user.id === selectedUser.id) {
                    return selectedUser
                }
                return user
            })
            setUsers(updatedUsers)
            setSelectedUser(null)
        })
    }

    const handleDelete = async (userId: string) => {
        deleteUser(userId)
        setUsers(users.filter((user) => user.id !== userId))
    }
    const handleBatchUpload = () => {
        if (!batchFile) alert("No file selected")
        console.log(batchFile);
    }

    return (
        <div className="flex flex-col h-screen">
            <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                <div className="bg-background rounded-lg shadow-md p-4">
                    <div className="flex items-center justify-between mb-4 gap-2">
                        <h2 className="text-xl font-bold min-w-fit">User List</h2>
                        <div className="flex items-center gap-2 flex-wrap">
                            <Input placeholder="Filter by name" value={filterText} onChange={handleFilter} />
                            <Dialog open={openUpload} onOpenChange={setOpenUpload}>
                                <DialogTrigger asChild>
                                    <Button>Batch Upload</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Batch Upload</DialogTitle>
                                    </DialogHeader>
                                    <DialogContent>
                                        <Label>Upload JSON file</Label>
                                        <Input type="file" accept=".json" onChange={(e) => {setBatchFile(e.target.files?.[0] ?? null)}}/>
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" onClick={() => {setOpenUpload(false)}}>Cancel</Button>
                                            <Button onClick={handleBatchUpload}>Upload</Button>
                                        </div>
                                    </DialogContent>
                                </DialogContent>
                            </Dialog>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button>Add new user</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Add New User</DialogTitle>
                                    </DialogHeader>
                                    <CreateUserForm />
                                </DialogContent>
                            </Dialog>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">
                                        Sort by {sortBy} ({sortOrder})
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => handleSort("name")}>Name</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleSort("followers")}>Followers</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleSort("joinDate")}>Join Date</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleSort("tweets")}>Tweets</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Followers</TableHead>
                                <TableHead>Join Date</TableHead>
                                <TableHead>Tweets</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <Button variant="link" onClick={() => setSelectedUser(user)}>
                                            {user.name}
                                        </Button>
                                    </TableCell>
                                    <TableCell>{user.followers}</TableCell>
                                    <TableCell>{user.joinDate}</TableCell>
                                    <TableCell>{user.tweets}</TableCell>
                                    <TableCell>
                                        <Button variant="outline" size="sm" onClick={() => handleEdit(user)}>
                                            Edit
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => handleDelete(user.id)}>
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                {selectedUser && (
                    <div className="bg-background rounded-lg shadow-md p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">User Details</h2>
                            <Button variant="outline" size="sm" onClick={() => setSelectedUser(null)}>
                                Close
                            </Button>
                        </div>
                        <div className="grid gap-4">
                            <div>
                                <Label>Name</Label>
                                <Input
                                    value={selectedUser.name}
                                    onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <Label>Followers</Label>
                                <Input
                                    type="number"
                                    value={selectedUser.followers}
                                    onChange={(e) =>
                                        setSelectedUser({
                                            ...selectedUser,
                                            followers: parseInt(e.target.value),
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <Label>Join Date</Label>
                                <Input
                                    type="date"
                                    value={selectedUser.joinDate}
                                    onChange={(e) => setSelectedUser({
                                            ...selectedUser,
                                            joinDate: e.target.value
                                        }
                                    )}
                                    max={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                            <div>
                                <Label>Tweets</Label>
                                <div className="grid gap-2">
                                    {selectedUser.tweetsData !== null && selectedUser.tweetsData.map((tweet) => (
                                        <Link href={`/tweet-management/${tweet.id}`} key={tweet.id}>
                                            <Button variant="outline" key={tweet.id}>
                                                {tweet.content}
                                            </Button>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <Label>Retweets</Label>
                                <div className="grid gap-2">
                                    {selectedUser.tweetsData !== null && selectedUser.tweetsData.map((tweet) => (
                                        <div key={tweet.id} className="bg-muted p-2 rounded select-none">
                                            {tweet.content}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setSelectedUser(null)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSaveEdit}>Save</Button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}