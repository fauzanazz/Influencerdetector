import type {NextApiRequest, NextApiResponse} from "next";
import axios from 'axios';

type ResponseData = {
    message: string | undefined,
    graphData?: any
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
){
    if (req.method === 'GET') {
        try {
            const response = await axios.get(`http://localhost:3000/api/data`)
            if (response.status === 200) {
                res.status(200).json({message: 'Data fetched successfully', graphData: response.data})
            }
            res.status(500).json({message: 'Internal server error'})
        } catch (error) {
            res.status(500).json({message: 'Internal server error'})
        }
    }
}