"use client"

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import React, {JSX, SVGProps} from "react";
import {format} from "date-fns";
import {TweetDB} from "@/data/database";
import {useRouter} from "next/navigation";
import {cn} from "@/lib/utils";
import {GearIcon} from "@radix-ui/react-icons";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "./ui/dialog";
import {User} from "@prisma/client";
import {EditTweetForm} from "@/components/edit-tweet-form";
import {Button} from "@/components/ui/button";


interface TweetsProps {
    maintweets: TweetDB
    action?: boolean
    edit?: boolean
    User: User[],
    Tweets: { value: number, label: string }[]
}

export const Tweets: React.FC<TweetsProps> = ({ maintweets, User, Tweets, edit, action }) => {

    const { id, author, content, createdAt, likes, retweetedBy, _count, userId } = maintweets;
    const retweets = retweetedBy !== undefined ? retweetedBy.length : 0;
    const router = useRouter();
    const handleOpen = () => {
        if (action)
            router.push(`/tweet-management/${id}`);
    }

    const handleDelete = () => {
        fetch(`http://localhost:3000/api/tweets?id=${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        }).then((res) => {
            if (res.status !== 200) {
                alert(res.statusText);
                return;
            }
            router.push(`/tweet-management`);
        })
    }

    const avatarNameList = author.name.split(" ");
    const avatarFallBack = author.name.charAt(0).toUpperCase() + avatarNameList[avatarNameList.length - 1].charAt(0).toUpperCase();

    const mainTweet = {
        id,
        authorId: author.id,
        userId: userId,
        content,
        retweets: retweetedBy !== undefined ? retweetedBy.map((retweet) => retweet.id) : [],
        replyToId: undefined,
        likes
    }

    return (
        <div className={cn(
            "flex items-start gap-4 p-4 border-b border-1 border-gray-200 transition-all duration-300",
            action && "hover:bg-gray-100 cursor-pointer"
        )} onClick={handleOpen}>
            <Avatar className="w-12 h-12 select-none">
                <AvatarImage src="/placeholder-user.jpg" alt="@shadcn"/>
                <AvatarFallback>{avatarFallBack}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <div className="flex items-center gap-x-2 flex-wrap">
                    <div className="font-bold">{author.name}</div>
                    <div className="text-gray-500">@{author.id}</div>
                    <div className="text-gray-500">· {format(createdAt, "PPPp")}</div>
                </div>
                <p className="mt-2">
                    {content}
                </p>
                <div className="flex items-center gap-4 mt-2 select-none">
                    <div className="rounded-full gap-1 flex">
                        <MessageCircleIcon className="w-5 h-5 text-gray-600"/>
                        {_count.replies}
                    </div>
                    <div className="rounded-full gap-1 flex">
                        <RepeatIcon className="w-5 h-5 text-gray-600"/>
                        {retweets}
                    </div>
                    <div className="rounded-full gap-1 flex">
                        <HeartIcon className="w-5 h-5 text-gray-600"/>
                        {likes}
                    </div>
                </div>
            </div>
            {edit && (
                <div>
                    <Dialog>
                        <DialogTrigger asChild className="p-2 w-10 h-10 rounded-full hover:bg-gray-100">
                            <GearIcon
                                className="w-10 h-10 text-gray-600 hover:rotate-180 transition-all duration-300 cursor-pointer"/>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Tweet</DialogTitle>
                            </DialogHeader>
                            <EditTweetForm TweetData={mainTweet} User={User} TweetsData={Tweets}/>
                        </DialogContent>
                    </Dialog>
                    <Button onClick={handleDelete}>Delete</Button>
                </div>
            )}
        </div>
    )
}

function HeartIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path
                d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
        </svg>
    )
}

function RepeatIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m17 2 4 4-4 4"/>
            <path d="M3 11v-1a4 4 0 0 1 4-4h14"/>
            <path d="m7 22-4-4 4-4"/>
            <path d="M21 13v1a4 4 0 0 1-4 4H3"/>
        </svg>
    )
}

function MessageCircleIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
        </svg>
    )
}