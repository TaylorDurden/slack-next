"use client";

import { AlertHome } from "@/components/alertHome";
import { useGetChannelById } from "@/features/channels/api/useGetChannels";
import { useChannelId } from "@/hooks/useSearchParams";
import { Loader } from "lucide-react";
import { Header } from "./header";
import EditChannelModal from "@/features/channels/components/EditChannelModal";
import { useState } from "react";

const ChannelIdPage = () => {
  const channelId = useChannelId();
  const [open, setOpen] = useState(false);
  const { data: channel, isLoading: channelLoading } = useGetChannelById({ id: channelId });

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
    <div>
      <EditChannelModal open={open} setOpen={setOpen} initialChannelName={channel.name} channelId={channel._id} />
      <Header title={channel.name} onToggle={() => setOpen(!open)} />
      <p>Channel ID: {channel._id}</p>
    </div>
  );
};

export default ChannelIdPage;
