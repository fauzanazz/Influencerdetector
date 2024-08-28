"use client";

import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import React, {useTransition} from "react";
import {ComboboxForm} from "@/app/tweet-management/combo-box";
import MultiSelectRetweeted from "@/app/tweet-management/multi-form-retweeted";

const CreateTweetSchema = z.object({
    author: z.string().min(1),
    user: z.string().min(1),
    content: z.string().min(1),
    retweetedby: z.array(z.string()).optional(),
    replyto: z.number().optional(),
    likes: z.number().min(0),
})

interface CreateTweetFormProps {
    Users: { value: string; label: string }[]
    Tweets: { value: string; label: string }[]
}
export const CreateTweetForm: React.FC<CreateTweetFormProps> = ({ Users, Tweets }) => {
    const [isLoading, startTransition] = useTransition();

    const form = useForm({
        defaultValues: {
            author: "",
            user: "",
            content: "",
            retweetedby: [],
            replyto: undefined,
            likes: 0,
        },
        resolver: zodResolver(CreateTweetSchema),
    })
    const onSubmit = (data: z.infer<typeof CreateTweetSchema>) => {
        startTransition(() => {
            fetch(`http://localhost:3000/api/tweets`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }).then((res) => {
                if (res.status !== 200) {
                    alert(res.statusText);
                    return;
                }
                form.reset();
                window.location.reload();
            })
        })
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="user"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>User</FormLabel>
                            <FormControl>
                                <ComboboxForm field={field} form={form} values={Users} valueType="user" />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                <FormField
                    control={form.control}
                    name="author"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Author</FormLabel>
                            <FormControl>
                                <ComboboxForm field={field} form={form} values={Users} valueType="author"/>
                            </FormControl>
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
                                <Input placeholder="Hello World!" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                <FormField
                    control={form.control}
                    name="retweetedby"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Retweeted By</FormLabel>
                            <FormControl>
                                <MultiSelectRetweeted userList={Users} field={field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                <FormField
                    control={form.control}
                    name="replyto"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Reply To</FormLabel>
                            <FormControl>
                                <ComboboxForm field={field} form={form} values={Tweets} valueType="replyto" />
                            </FormControl>
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
                                <Input type="number" placeholder="0" {...field}
                                       onChange={event => field.onChange(+event.target.value)}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                <Button type="submit" className="w-full">Create User</Button>
            </form>
        </Form>
    )
}