// @ts-nocheck
"use client"

import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "./ui/form";
import {Input} from "./ui/input";
import {Button} from "./ui/button";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import React, {useTransition} from "react";
import {ComboboxForm} from "@/app/tweet-management/combo-box";
import MultiSelectRetweeted from "@/app/tweet-management/multi-form-retweeted";
import {User} from "@prisma/client";

const EditTweetSchema = z.object({
    user: z.string().min(1),
    author: z.string().min(1),
    content: z.string().min(1),
    retweetedby: z.array(z.string()).default([]),
    replyto: z.number().int().optional(),
    likes: z.number().int().default(0)
})

export interface EditTweetFormProps {
    TweetData: {
        id: number,
        authorId: string,
        userId: string,
        content: string,
        retweets: string[],
        replyToId: number | undefined,
        likes: number
    }
    User: User[],
    TweetsData: { value: number, label: string }[]
}

export const EditTweetForm: React.FC<EditTweetFormProps> = ({TweetData, User, TweetsData}) => {
    const [isLoading, startTransition] = useTransition();
    const form = useForm({
        resolver: zodResolver(EditTweetSchema),
        defaultValues: {
            author: TweetData.authorId,
            user: TweetData.userId,
            content: TweetData.content,
            retweetedby: TweetData.retweets,
            replyto: TweetData.replyToId,
            likes: TweetData.likes,
        },
    })

    const multiValuesUser = User.map((user) => {
        return {
            value: user.id,
            label: user.name,
        }
    });

    console.log(TweetsData)

    const multiValueTweets = TweetsData.map((tweet) => {
        return {
            value: tweet.id,
            label: tweet.content,
        }
    });

    const onEditTweet = (data: z.infer<typeof EditTweetSchema>) => {
        const dataWithId = {
            id: TweetData.id,
            ...data
        }
        startTransition(() => {
            fetch(`http://localhost:3000/api/tweets`,{
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dataWithId)
            }).then((res) => {
                if (res.status !== 200) {
                    res.body?.getReader().read().then(({value}) => {
                        alert(new TextDecoder().decode(value));
                    });
                    return;
                }
                form.reset();
                window.location.reload();
            })
        })
    }



    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onEditTweet)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="author"
                    render={
                        ({field}) => (
                            <FormItem>
                                <FormLabel>Author</FormLabel>
                                <ComboboxForm field={field} form={form} values={multiValuesUser} valueType={"author"}/>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                <FormField
                    control={form.control}
                    name="user"
                    render={
                        ({field}) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>User</FormLabel>
                                <ComboboxForm field={field} form={form} values={multiValuesUser} valueType={"user"}/>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                <FormField
                    control={form.control}
                    name="content"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                                <Input placeholder="Hello world" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                <FormField
                    control={form.control}
                    name="retweetedby"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Retweeted by</FormLabel>
                            <FormControl>
                                <MultiSelectRetweeted userList={multiValuesUser} field={field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                <FormField
                    control={form.control}
                    name="replyto"
                    render={
                        ({field}) => (
                            <FormItem>
                                <FormLabel>Reply to</FormLabel>
                                <ComboboxForm field={field} form={form} values={multiValueTweets} valueType={"replyto"}/>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                <FormField
                    control={form.control}
                    name="likes"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Likes</FormLabel>
                            <FormControl>
                                <Input type="number" {...field}
                                       onChange={event => field.onChange(+event.target.value)}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>

                <Button type="submit" disabled={isLoading}
                        className="w-full text-white rounded-md p-2 mt-4">Edit</Button>
            </form>
        </Form>
    )
}