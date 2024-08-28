"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    FormControl,
} from "@/components/ui/form"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {ControllerRenderProps, FieldValues, UseFormReturn} from "react-hook-form";
import React from "react";

export interface ComboBoxProps {
    field:  ControllerRenderProps<{
        author: string;
        user: string;
        content: string;
        retweetedby: never[];
        replyto: undefined;
        likes: number;},
    "content" | "author" | "user" | "retweetedby" | "replyto" | "likes">
    form: UseFormReturn<{
        author: string
        user: string
        content: string
        retweetedby: never[]
        replyto: undefined
        likes: number }, any, undefined>
    values: { value: string | number; label: string }[]
    valueType: "content" | "author" | "user" | "retweetedby" | "replyto" | "likes"
}

export const ComboboxForm : React.FC<ComboBoxProps> = ({valueType, field, form, values}) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <FormControl>
                    <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                        )}
                    >
                        {field.value
                            ? values.find(
                                (values) => values.value === field.value
                            )?.label
                            : "Select"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </FormControl>
            </PopoverTrigger>
            <PopoverContent className="min-w-full p-0">
                <Command>
                    <CommandInput placeholder="Search..." />
                    <CommandList>
                        <CommandEmpty>Not found.</CommandEmpty>
                        <CommandGroup>
                            {values.map((values) => (
                                <CommandItem
                                    value={values.label}
                                    key={values.value}
                                    onSelect={() => {
                                        form.setValue(valueType, values.value)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            values.value === field.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    {values.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
