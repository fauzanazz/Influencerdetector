"use server"

import { UserManagementComp } from "@/app/user-management/userManagementComp";

export default async function UserManagement() {

    const users = await fetch(`http://localhost:3000/api/users?management=true`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        cache: "no-store"
    }).then((res) => res.json()).then((data) => data.usersData);

    const formattedData = users.map((user: { joinDate: string | number | Date; }) => ({
        ...user,
        joinDate: new Date(user.joinDate).toISOString().split('T')[0],
    }))

    return (
        <div>
            <UserManagementComp usersData={formattedData}/>
        </div>
    )
}