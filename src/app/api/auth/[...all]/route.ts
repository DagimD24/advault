import { handler } from "@/lib/auth-server";

export async function GET(request: Request) {
    console.log("Auth GET request:", request.url);
    console.log("Handler type:", typeof handler);
    console.log("Handler keys:", Object.keys(handler || {}));
    if (typeof (handler as any).GET === 'function') {
        return (handler as any).GET(request);
    }
    return new Response("Auth handler GET not found", { status: 500 });
}

export async function POST(request: Request) {
    console.log("Auth POST request:", request.url);
    if (typeof (handler as any).POST === 'function') {
        return (handler as any).POST(request);
    }
    return new Response("Auth handler POST not found", { status: 500 });
}