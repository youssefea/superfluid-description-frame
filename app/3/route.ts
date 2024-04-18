import { NextResponse } from "next/server";

const imgURL="https://i.imgur.com/j301VqD.png"
import {URL} from "./../../constants"

const _html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Frame</title>
    <meta property="og:image" content="${imgURL}" />
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${imgURL}" />
    <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
    <meta property="fc:frame:button:1" content="←" />
    <meta property="fc:frame:button:1:action" content="post" />
    <meta property="fc:frame:button:1:post_url" content="${URL}/2" />
    <meta property="fc:frame:button:1:target" content="${URL}/2" />
    <meta property="fc:frame:button:2" content="Claim stream" />
    <meta property="fc:frame:button:2:action" content="post" />
    <meta property="fc:frame:button:2:target" content="${URL}/check" />
    <meta property="fc:frame:button:2:post_url" content="${URL}/check" />
  </head>
</html>
`;


export async function POST(req) {
  const data = await req.json();

  return new NextResponse(
    _html
  );
}

export const dynamic = "force-dynamic";
