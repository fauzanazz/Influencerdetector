"use client";

import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useTransition} from "react";

const CreateUserSchema = z.object({
    name: z.string().min(3),
})

export const CreateUserForm = () => {
    const [isLoading, startTransition] = useTransition();

    const form = useForm({
        defaultValues: {
            name: "",
        },
        resolver: zodResolver(CreateUserSchema),
    })
    const onSubmit = (data: z.infer<typeof CreateUserSchema>) => {
        startTransition(() => {
            fetch(`http://localhost:3000/api/users`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }).then((res) => {
                if (res.status !== 201) {
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
                    name="name"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                <Button type="submit" className="w-full">Create User</Button>
            </form>
        </Form>
    )
}