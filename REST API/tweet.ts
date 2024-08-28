"use server"

import {db} from "@/lib/db";

// GET ----------
export const getAllTweets = async () => {
    try {
        const tweets = await db.tweet.findMany({
            select: {
                id: true,
                content: true,
                userId: true,
                createdAt: true,
                likes: true,
                retweets: true,
                retweetedBy: {
                    select: {
                        id: true,
                    },
                },
                _count: {
                    select: {
                        replies: true,
                    },
                },
                author: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            }
        });
        return {status:"success", message:"Tweets found", data: tweets};
    } catch (error) {
        return {status:"error", message:"Failed to fetch tweets", data: null};
    }
}

// CRUD operations for tweets -------------------------------

export interface createTweetData {
    author: string,
    user: string,
    content: string,
    retweetedby: string[]
    replyto?: number,
    likes: number,
}

// POST -------------
export async function createTweet(data: createTweetData) {
    try {
        if (data.retweetedby.includes(data.author)) {
            return {status:"error", message:"User cannot retweet their own tweet"};
        }

        if (data.replyto) {
            const isExistTweet = await db.tweet.findFirst({
                where: {
                    id: data.replyto,
                },
            });

            if (!isExistTweet) {
                return {status:"error", message:"Tweet not found"};
            }
        }

        const retweetedByIds = data.retweetedby.map(userId => ({ id: userId }));

        const tweet = await db.tweet.create({
            data: {
                content: data.content,
                userId: data.user,
                authorId: data.author,
                likes: data.likes,
                replyToId: data.replyto,
                retweetedBy: {
                    connect: retweetedByIds,
                },
            },
        });

        if (!tweet) {
            return {status:"error", message:"Failed to create tweet"};
        }
        return {status:"success", message:"Tweet created successfully"};
    } catch (error) {
        return {status:"error", message:"Failed to create tweet server problem"};
    }
}

// GET ------------
export async function getTweet(id: number) {
    try {
        const tweet = await db.tweet.findUnique({
            where: {
                id: id,
            },
            select: {
                id: true,
                content: true,
                userId: true,
                createdAt: true,
                likes: true,
                retweets: true,
                retweetedBy: {
                    select: {
                        id: true,
                    },
                },
                _count: {
                    select: {
                        replies: true,
                    },
                },
                author: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                replies: {
                    select: {
                        id: true,
                        content: true,
                        createdAt: true,
                        likes: true,
                        retweets: true,
                        author: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        _count: {
                            select: {
                                replies: true,
                            },
                        },
                    },
                },
            }
        });
        if (!tweet) {
            return {status:"error", message:"Tweet not found", data: null};
        }
        return {status:"success", message:"Tweet found", data: tweet};
    } catch (error) {
        return {status:"error", message:"Failed to fetch tweet", data: null};
    }
}


interface updateTweetData {
    id: number,
    author: string,
    user: string,
    content: string,
    retweetedby: string[],
    replyto: number | undefined,
    likes: number
}

// PUT------------
export async function updateTweet(tweet: updateTweetData) {
    try {
        if (tweet.id === tweet.replyto){
            return {status:"error", message:"Tweet cannot be a reply to itself"};
        }

        if (tweet.retweetedby && tweet.retweetedby.includes(tweet.author)) {
            return {status:"error", message:"User cannot retweet their own tweet"};
        }

        const updatedTweet = await db.tweet.update({
            where: {
                id: tweet.id,
            },
            data: {
                content: tweet.content,
                userId: tweet.user,
                authorId: tweet.author,
                likes: tweet.likes,
                replyToId: tweet.replyto,
                retweetedBy: {
                    set: tweet.retweetedby.map(userId => ({ id: userId })),
                },
            },
        });

        if (!updatedTweet) {
            return {status:"error", message:"Failed to update tweet"};
        }
        return {status:"success", message:"Tweet updated successfully"};
    } catch (error) {
        console.log(error)
        return {status:"error", message:"Failed to update tweet server problem"};
    }
}

// DELETE ------------
export async function deleteTweet(id: number) {
    try {
        await db.tweet.deleteMany({
            where: {
                replyToId: id,
            },
        });

        const tweet = await db.tweet.delete({
            where: {
                id: id,
            },
        });

        if (!tweet) {
            return {status: "error", message: "Failed to delete tweet"};
        }
        return {status: "success", message: "Tweet deleted"};
    } catch (error) {
        return {status: "error", message: "Failed to delete tweet"};
    }
}

// Batch operations for tweets -------------------------------
export async function batchUploadJson(data: any[]) {
    try {
        const transaction = await db.$transaction(data.map((tweet) => {
            return db.tweet.create({
                data: {
                    content: tweet.content,
                    userId: tweet.userId,
                    authorId: tweet.authorId,
                    likes: tweet.likes,
                    replyToId: tweet.replyToId,
                    retweetedBy: {
                        connect: tweet.retweetedBy.map((userId: any) => ({ id: userId })),
                    },
                },
            });
        }));

        if (!transaction) {
            return {status:"error", message:"Failed to batch upload tweets"};
        }

        return {status:"success", message:"Tweets batch uploaded successfully"};

    } catch (error) {
        return {status:"error", message:"Failed to batch upload tweets", data: null};
    }
}