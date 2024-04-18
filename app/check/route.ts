import { NextResponse } from "next/server";
import {
  walletQuery,
} from "../api";
import { init, fetchQuery } from "@airstack/node";
import { account, walletClient, publicClient } from "./config";
import ABI from "./abi.json";
import { URL, DEBUGGER_HUB_URL } from "./../../constants";
import { getFrameMessage } from "frames.js";

const contractAddress = "0xcfA132E353cB4E398080B9700609bb008eceB125";
const superTokenAddress = process.env.SUPER_TOKEN_ADDRESS as `0x${string}`;

init(process.env.AIRSTACK_KEY || "");

const didNotRecast = "https://i.imgur.com/i3jaR1I.png";
const noConnected = "https://i.imgur.com/tJvDy80.png";
const congrats = "https://i.imgur.com/fU2h3tn.gif";

const flowRate = 3272450500;

const _html = (img, msg, action, url) => `
<!DOCTYPE html>
<html>
  <head>
    <title>Frame</title>
    <mega property="og:image" content="${img}" />
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${img}" />
    <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
    <meta property="fc:frame:button:1" content="${msg}" />
    <meta property="fc:frame:button:1:action" content="${action}" />
    <meta property="fc:frame:button:1:target" content="${url}" />
    <meta property="fc:frame:post_url" content="${url}" />
  </head>
</html>
`;

async function setFlowrate(_to) {
  await walletClient.writeContract({
    address: contractAddress,
    abi: ABI,
    functionName: "setFlowrate",
    account,
    args: [superTokenAddress, _to, flowRate],
  });
}

export async function POST(req) {
  const data = await req.json();

  const frameMessage = await getFrameMessage(data, {
    hubHttpUrl: DEBUGGER_HUB_URL,
  });

  if (!frameMessage.recastedCast) {
    return new NextResponse(_html(didNotRecast, "Retry", "post", `${URL}/3`));
  }
  const fid = frameMessage.requesterFid;
  const _query2 = walletQuery(fid);
  const { data: results2 } = await fetchQuery(_query2, {
    id: fid,
  });
  const socials = results2.Socials.Social;
  const newAddress = socials[0].userAssociatedAddresses[1];

  if (!newAddress) {
    return new NextResponse(_html(noConnected, "Retry", "post", `${URL}/3`));
  }

  const receiverCurrentFlowRate = await publicClient.readContract({
    address: contractAddress,
    abi: ABI,
    functionName: "getFlowrate",
    args: [superTokenAddress, account.address, newAddress],
  });

  if (Number(receiverCurrentFlowRate) > 0) {
    return new NextResponse(
      _html(
        congrats,
        "See in Dashboard 🌊",
        "link",
        `https://app.superfluid.finance/?view=${newAddress}`
      )
    );
  } else {
    await setFlowrate(newAddress);
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    await delay(1000);
    return new NextResponse(
      _html(
        congrats,
        "See in Dashboard 🌊",
        "link",
        `https://app.superfluid.finance/?view=${newAddress}`
      )
    );
  }
}

export const dynamic = "force-dynamic";
