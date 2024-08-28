import type {NextApiRequest, NextApiResponse} from "next";
import {createUser, deleteUser, getAllUsers, GetUserManagementData, updateUser} from "@/REST API/User";

type ResponseData = {
    message: string | undefined,
    usersData?: any,
}
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
){
    if (req.method === 'GET') {
        if (req.query.management) {
            const result = await GetUserManagementData();
            if (result.status === "success") {
                res.status(200).json({message: 'Users fetched successfully', usersData: result.data});
            } else {
                res.status(500).json({message: 'Failed to fetch tweet'});
            }
            return;
        }
        const result = await getAllUsers();
        if (result.status === "success") {
            res.status(200).json({message: 'Users fetched successfully', usersData: result.data});
        }
        res.status(500).json({message: 'Failed to fetch tweets'});
    } else if (req.method === 'POST') {
        const data = req.body;
        if (!data) {
            res.status(400).json({message: 'Data is required'});
            return;
        }
        const result = await createUser(data.name);
        if (result.status === "success") {
            res.status(201).json({message: 'User created successfully'});
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
        const result = await updateUser(data);
        if (result.status === "success") {
            res.status(200).json({message: 'User updated successfully'});
        } else {
            res.status(500).json({message: 'Failed to update tweet'});
        }
        return;
    } else if (req.method === 'DELETE') {
        if (!req.query.id) {
            res.status(400).json({message: 'User id is required'});
            return;
        }
        const result = await deleteUser(req.query.id[0]);
        if (result.status === "success") {
            res.status(200).json({message: 'User deleted successfully'});
        } else {
            res.status(500).json({message: 'Failed to delete tweet'});
        }
        return;
    } else {
        res.status(405).json({message: 'Method not allowed'})
    }
}