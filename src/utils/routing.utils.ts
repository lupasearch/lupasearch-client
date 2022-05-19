import { LUPA_ROUTING_EVENT } from "@/constants/global.const";

export const emitRoutingEvent = (url: string): void => {
  const event = new CustomEvent(LUPA_ROUTING_EVENT, { detail: url });
  window.dispatchEvent(event);
};

export const handleRoutingEvent = (
  link: string,
  event?: Event,
  hasEventRouting = false
): void => {
  if (!hasEventRouting) {
    return;
  }
  event?.preventDefault();
  emitRoutingEvent(link);
};
