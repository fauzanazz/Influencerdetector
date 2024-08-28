import type {NextApiRequest, NextApiResponse} from "next";
import {createTweet, deleteTweet, getAllTweets, getTweet, updateTweet} from "@/REST API/tweet";

type ResponseData = {
    message: string | undefined,
    tweetsData?: any,
    tweetData?: any
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
){
    if (req.method === 'GET') {
        if (req.query.id) {
            const result = await getTweet(+req.query.id);
            if (result.status === "success") {
                res.status(200).json({message: 'Tweet fetched successfully', tweetData: result.data});
            } else {
                res.status(500).json({message: 'Failed to fetch tweet'});
            }
            return;
        }
        const result = await getAllTweets();
        if (result.status === "success") {
            res.status(200).json({message: 'Tweets fetched successfully', tweetsData: result.data});
        }
        res.status(500).json({message: 'Failed to fetch tweets'});
    } else if (req.method === 'POST') {
        const data = req.body;
        if (!data) {
            res.status(400).json({message: 'Data is required'});
            return;
        }
        const result = await createTweet(data);
        if (result.status === "success") {
            res.status(200).json({message: 'Tweet created successfully'});
        } else {
            res.status(500).json({message: 'Failed to create tweet'});
        }
        return;
    } else if (req.method === 'PUT') {
        const data = req.body;
        if (!data) {
            res.status(400).json({message: 'Data is required'});
            return;
        }
        const result = await updateTweet(data);
        if (result.status === "success") {
            res.status(200).json({message: 'Tweet updated successfully'});
        } else {
            res.status(500).json({message: 'Failed to update tweet'});
        }
        return;
    } else if (req.method === 'DELETE') {
        if (!req.query.id) {
            res.status(400).json({message: 'Tweet id is required'});
            return;
        }
        const result = await deleteTweet(+req.query.id);
        if (result.status === "success") {
            res.status(200).json({message: 'Tweet deleted successfully'});
        } else {
            res.status(500).json({message: 'Failed to delete tweet'});
        }
        return;
    } else {
        res.status(405).json({message: 'Method not allowed'})
    }
}