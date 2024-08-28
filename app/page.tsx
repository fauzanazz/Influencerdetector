"use server"

async function GetEigenvalue() {
    const res = await fetch(`http://localhost:3000/api/data`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        cache: "no-cache"
    });
    return res.json();
}

async function GetUserList() {
    const res = await fetch(`http://localhost:3000/api/users`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        cache: "no-cache"
    });
    return res.json();
}

export default async function Home() {

    const eigenvaluePromise = GetEigenvalue();
    const userPromise = GetUserList();

    const [eigenvalue, users] = await Promise.all([eigenvaluePromise, userPromise]);

    const sortedEigenvalue = eigenvalue
        .sort((a: { influence_score: number; }, b: { influence_score: number; }) => b.influence_score - a.influence_score)
        .slice(0, 10);

    return (
        <div className="flex flex-col h-screen">
            <div className="flex-1 overflow-y-auto">
                {users.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-gray-400">No users available</div>
                    </div>
                ) : (
                    <div>
                        {
                            sortedEigenvalue && sortedEigenvalue.map((user: { id:string, name: string; influence_score: number; }) => (
                                <div key={user.id} className="flex items-center justify-between p-4 border-b border-1 border-gray-200">
                                    <div className="flex items-center gap-4">
                                        <div className="font-bold">{user.name}</div>
                                        <div className="text-gray-500">Centrality: {user.influence_score}</div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                )
                }
            </div>
        </div>
    )
}