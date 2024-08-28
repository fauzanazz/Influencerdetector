"use server"

import {User} from "@prisma/client";
import {db} from "@/lib/db";
import { getAllTweets } from "./tweet";

export const getAllUsers = async () => {
    try {
        const users = await db.user.findMany();
        return {status: "success", message: "Users found", data: users};
    } catch (error) {
        return {status: "error", message: "Failed to fetch users", data: null};
    }
}

// CRUD operations for users -------------------------------
export async function createUser(name: string) {
    try {
        const user = await db.user.create({
            data: {
                name,
            },
        });
        if (!user) {
            return {status: "error", message: "Failed to create user"};
        }
        return {status: "success", message: "User created"};
    } catch (error) {
        return {status: "error", message: "Failed to create user"};
    }
}



export async function updateUser(Users: User) {
    try {
        console.log(Users);
        const user = await db.user.update({
            where: {
                id: Users.id,
            },
            data: {
                name: Users.name,
                followers: Users.followers,
                joinDate: Users.joinDate
            },
        });
        if (!user) {
            return {status: "error", message: "Failed to update user"};
        }
        console.log(user)
        return {status: "success", message: "User updated"};
    } catch (error) {
        return {status: "error", message: "Failed to update user"};
    }
}


export async function deleteUser(id: string) {
    try {
        await db.tweet.deleteMany({
            where: {
                authorId: id,
            },
        });

        const user = await db.user.delete({
            where: {
                id: id,
            },
        });

        if (!user) {
            return {status: "error", message: "Failed to delete user"};
        }
        return {status: "success", message: "User deleted"};
    } catch (error) {
        return {status: "error", message: "Failed to delete user"};
    }
}

// ------------------ User Management Page ------------------
export const GetUserManagementData = async () => {
    try {
        const users = await getAllUsers();
        const tweets = await getAllTweets();

        if (users.status === "error" || tweets.status === "error" || !users.data || !tweets.data) {
            return {status: "error", message: "Failed to fetch user management data", data: null};
        }

        const data = users.data.map((user) => {
            const userTweets = tweets.data.filter((tweet) => tweet.userId === user.id);
            const tweetsData = userTweets.filter((tweet) => tweet.author.id === user.id).map((tweet) => {
                return {
                    id: tweet.id,
                    content: tweet.content,
                };
            });
            const retweetedTweets = userTweets.filter((tweet) => tweet.author.id !== user.id).map((tweet) => {
                return {
                    id: tweet.id,
                    content: tweet.content,
                };
            });
            return {
                id: user.id,
                name: user.name,
                followers: user.followers,
                joinDate: user.joinDate,
                tweets: userTweets.length,
                tweetsData: tweetsData,
                retweetedTweets: retweetedTweets,
            };
        });
        return {status: "success", message: "User management data found", data: data};
    } catch (error) {
        return {status: "error", message: "Failed to fetch user management data", data: null};
    }
}

export const batchCreateUsers = async (users: {name: string}[]) => {
    try {
        const transaction = await db.$transaction(users.map((user) => {
            return db.user.create({
                data: {
                    name: user.name,
                },
            });
        }));
        if (!transaction) {
            return {status: "error", message: "Failed to Batch Create users"};
        }
        return {status: "success", message: "Users created"};
    } catch (error) {
        return {status: "error", message: "Failed to Batch Create users"};
    }
}