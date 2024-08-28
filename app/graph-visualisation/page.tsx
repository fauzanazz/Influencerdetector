"use server"


import GraphComponent from "@/app/graph-visualisation/GraphComponent";

export default async function GraphVisualisation() {

    const graphData = await fetch(`http://localhost:3000/api/graph-visualisation`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        cache: "no-cache",
    }).then(res => res.json()).then((data) => data.graphData);

    return (
        <div className="flex flex-col h-screen">
            <div className="flex-1 overflow-y-auto">
                <div className="p-4">
                    <h1 className="text-2xl font-semibold">Graph Visualisation</h1>
                    <p className="text-sm text-gray-600">Visualisation of graph data</p>
                </div>
                <div className="p-4">
                    <GraphComponent graphData={graphData} />
                </div>
            </div>
        </div>
    );
}