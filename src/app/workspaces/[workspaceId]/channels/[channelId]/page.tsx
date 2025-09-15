"use client";

import { AlertHome } from "@/components/alertHome";
import { useGetChannelById } from "@/features/channels/api/useGetChannels";
import { useChannelId } from "@/hooks/useSearchParams";
import { Loader } from "lucide-react";
import { Header } from "./header";
import EditChannelModal from "@/features/channels/components/editChannelModal";
import { useState } from "react";
import { ChatInput } from "./chatInput";
import { useGetMessages } from "@/features/messages/api/useGetMessage";

const ChannelIdPage = () => {
  const channelId = useChannelId();
  const { results } = useGetMessages({ channelId });
  const [open, setOpen] = useState(false);
  const { data: channel, isLoading: channelLoading } = useGetChannelById({ id: channelId });
  console.log(results);

  if (channelLoading) {
    return (
      <div className="h-full flex flex-1 items-center justify-center flex-col gap-2">
        <Loader className="size-6 animate-spin text-muted-foreground" data-testid="loader" />
      </div>
    );
  }

  if (!channel) {
    return <AlertHome message="Channel not found" />;
  }

  return (
    <div className="flex flex-col h-full">
      <EditChannelModal open={open} setOpen={setOpen} initialChannelName={channel.name} channelId={channel._id} />
      <Header title={channel.name} onToggle={() => setOpen(!open)} />
      <div className="flex-1">{JSON.stringify(results)}</div>
      <ChatInput placeholder={`Message # ${channel.name} : What's on your mind?`} />
    </div>
  );
};

export default ChannelIdPage;
