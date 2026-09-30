import { Monitor, Smartphone } from "lucide-react";

export default function SessionDeviceIcon({
  type,
}) {
  const Icon =
    type === "mobile"
      ? Smartphone
      : Monitor;

  return (
    <div
      className="
        flex
        h-10
        w-10
        shrink-0
        items-center
        justify-center
        rounded-xl
        bg-gray-50
        text-gray-600
      "
    >
      <Icon size={18} />
    </div>
  );
}