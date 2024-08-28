export interface UserDB {
    id: number;
    name: string;
    followers: number;
    joinDate: string;
    tweets: number;
    retweetedTweets: TweetDB[];
}

export interface TweetDB {
    id: number;
    content: string;
    userId: string;
    createdAt: Date;
    likes: number;
    retweets: number;
    retweetedBy: {
        id: string
    }[];
    author: {
        id: string;
        name: string
    }
    _count: {
        replies: number;
    };
}

export interface TweetWithReplies extends TweetDB {
    replies: TweetDB[];
}

export interface UserManagementData {
    id: string;
    name: string;
    followers: number;
    joinDate: string;
    tweets: number;
    tweetsData: Tweet_UserManagement[] | null;
    retweetedTweets: Tweet_UserManagement[] | null;
}

export interface Tweet_UserManagement {
    id: number;
    content: string;
}

