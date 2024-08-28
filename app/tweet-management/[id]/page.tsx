import { Tweets } from "@/components/tweets";
import { Separator } from "@/components/ui/separator";
import { TweetDB } from "@/data/database";
import { JSX } from "react";

async function getMainTweet(id: number) {
    const res = await fetch(`http://localhost:3000/api/tweets?id=${id}`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        cache: "no-cache",
    });
    return res.json().then((data) => data.tweetData);
}

async function getTweets(){
    const res = await fetch(`http://localhost:3000/api/tweets`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        cache: "no-cache",
    });
    return res.json().then((data) => data.tweetsData);
}

async function getUser(){
    const res = await fetch(`http://localhost:3000/api/users`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        cache: "no-cache",
    });
    return res.json().then((data) => data.usersData);
}



export default async function TweetDetail({params}:{params: {id: number}}) {

    const mainTweetPromise = getMainTweet(params.id);
    const tweetsPromise = getTweets();
    const userPromise = getUser();

    const [mainTweet, tweets, user] = await Promise.all([mainTweetPromise, tweetsPromise, userPromise]);

    const [formattedTweet, ...replies] = tweets;

    return (
        <div className="flex flex-col">
            <div className="select-none h-10 border bg-gray-200 flex items-center justify-center">
                <h2 className="text-xl font-bold text-center">Tweet</h2>
            </div>
            <Tweets maintweets={mainTweet} User={user} Tweets={tweets} edit />
            <div className="select-none h-10 border bg-gray-200 flex items-center justify-center">
                <h2 className="text-xl font-bold text-center">Replies</h2>
            </div>
            <div className="">
                {replies.map((reply: JSX.IntrinsicAttributes & TweetDB & { action?: boolean; }) => (
                    <>
                        <Tweets key={reply.id} maintweets={reply} User={user} Tweets={tweets} action />
                        <Separator className="bg-gray-200"/>
                    </>
                ))}
            </div>
        </div>
    );
}