"use client";

import {
    MultiSelector,
    MultiSelectorContent,
    MultiSelectorInput,
    MultiSelectorItem,
    MultiSelectorList,
    MultiSelectorTrigger,
} from "@/components/ui/multi-select";
import React, { useState } from "react";
import {ControllerRenderProps} from "react-hook-form";

interface MultiSelectRetweetedProps {
    userList: { value: string; label: string }[];
    field:  ControllerRenderProps<{
        author: string;
        user: string;
        content: string;
        retweetedby: never[];
        replyto: undefined;
        likes: number;},
        "content" | "author" | "user" | "retweetedby" | "replyto" | "likes">
}

const MultiSelectRetweeted: React.FC<MultiSelectRetweetedProps> = ({userList, field}) => {
    const [value, setValue] = useState<string[]>([]);

    const changeHandler = (values: string[]) => {
        setValue(values);
        const parsedValues = values.map((value) => {
            return userList.find((user) => user.label === value)?.value;
        });
        field.onChange(parsedValues);
    }

    return (
        <MultiSelector values={value} onValuesChange={changeHandler}>
            <MultiSelectorTrigger>
                <MultiSelectorInput placeholder={value.length > 0 ? "" : "Select Retweet"} />
            </MultiSelectorTrigger>
            <MultiSelectorContent>
                <MultiSelectorList>
                    {userList.map((user) => (
                        <MultiSelectorItem key={user.value} value={user.label}>
                            {user.label}
                        </MultiSelectorItem>
                    ))}
                </MultiSelectorList>
            </MultiSelectorContent>
        </MultiSelector>
    );
};

export default MultiSelectRetweeted;
