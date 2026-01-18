import { NextResponse } from "next/server";

const API_URL = process.env.ERPNEXT_URL;
const API_KEY = process.env.ERPNEXT_API_KEY;
const API_SECRET = process.env.ERPNEXT_API_SECRET;

const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `token ${API_KEY}:${API_SECRET}`,
});

export async function GET(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const taskId = params.id;

        // Fetch comments for the specific Task
        const response = await fetch(
            `${API_URL}/api/resource/Comment?fields=["name","content","owner","creation"]&filters=[["reference_name","=","${taskId}"],["reference_doctype","=","Task"]]&order_by=creation desc`,
            { method: "GET", headers: getHeaders() }
        );

        if (!response.ok) {
            return NextResponse.json({ error: "Error fetching comments" }, { status: response.status });
        }

        const data = await response.json();

        const comments = (data.data || []).map((comment: any) => ({
            id: comment.name,
            content: comment.content,
            author: comment.owner,
            createdAt: comment.creation
        }));

        return NextResponse.json({ comments });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const taskId = params.id;
        const body = await request.json();
        const { content } = body;

        if (!content) return NextResponse.json({ error: "Content required" }, { status: 400 });

        const commentData = {
            doctype: "Comment",
            comment_type: "Comment",
            reference_doctype: "Task",
            reference_name: taskId,
            content: content,
        };

        const response = await fetch(`${API_URL}/api/resource/Comment`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(commentData),
        });

        if (!response.ok) {
            return NextResponse.json({ error: "Error creating comment" }, { status: response.status });
        }

        const result = await response.json();
        return NextResponse.json({ success: true, comment: result.data });

    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
