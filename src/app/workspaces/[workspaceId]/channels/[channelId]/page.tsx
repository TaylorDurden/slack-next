"use client";

import { useParams } from "next/navigation";

const ChannelPage = () => {
  const params = useParams();
  const { channelId } = params;

  return (
    <div>
      <h1>Channel Page</h1>
      <p>Channel ID: {channelId}</p>
    </div>
  );
};

export default ChannelPage;
