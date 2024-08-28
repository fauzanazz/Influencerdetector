"use client"

import React from 'react';
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {CreateTweetForm} from "@/app/tweet-management/CreateTweetForm";

interface TweetBatchComponentProps {
    Users: { value: string; label: string }[]
    Tweets: { value: string; label: string }[]
}
const TweetBatchComponent : React.FC<TweetBatchComponentProps> = ({ Users, Tweets }) => {

    const [openUpload, setOpenUpload] = React.useState(false);
    const [openAddNew, setOpenAddNew] = React.useState(false);
    const [batchFile, setBatchFile] = React.useState<File | null>(null);

    const handleBatchUpload = async () => {
        if (batchFile === null) {
            alert("Please select a file")
            return
        }

        const fileContent = await batchFile.text();
        const parsedData = JSON.parse(fileContent);

        if (!Array.isArray(parsedData)) {
            alert("Invalid JSON file")
            return
        }

        fetch(`http://localhost:3000/api/tweets?batch=true`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(parsedData)
        }).then((res) => {
            if (res.status !== 200) {
                alert("Failed to upload data")
                return
            }
            alert("Data uploaded successfully")
            setOpenUpload(false)
        })
    }

    return (
        <div className="flex gap-x-10">
            <Dialog open={openUpload} onOpenChange={setOpenUpload}>
                <DialogTrigger asChild>
                    <Button>Add Batch Tweet</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Batch Tweet</DialogTitle>
                    </DialogHeader>
                    <DialogContent>
                        <Label>Upload JSON file</Label>
                        <Input type="file" accept=".json" onChange={(e) => {
                            setBatchFile(e.target.files?.[0] ?? null)
                        }}/>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => {
                                setOpenUpload(false)
                            }}>Cancel</Button>
                            <Button onClick={handleBatchUpload}>Upload</Button>
                        </div>
                    </DialogContent>
                </DialogContent>
            </Dialog>
            <Dialog open={openAddNew} onOpenChange={setOpenAddNew}>
                <DialogTrigger asChild>
                    <Button>Add New Tweet</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Tweet</DialogTitle>
                    </DialogHeader>
                    <DialogContent>
                        <Label>Enter Tweet Data</Label>
                        <CreateTweetForm Tweets={Tweets} Users={Users}/>
                    </DialogContent>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TweetBatchComponent;