import { getStream, stopStream } from "@/lib/internal/stream-manager";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log("GET stream for appId:", params.id);
  const currentStream = await getStream(params.id);

  if (!currentStream) {
    return new Response();
  }

  return currentStream.response();
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const appId = params.id;

  await stopStream(appId);

  return new Response(null, {
    status: 204,
    headers: {
      "Cache-Control": "no-cache",
      "Content-Type": "text/plain",
    },
  });
}
