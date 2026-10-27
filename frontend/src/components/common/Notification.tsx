"use client";
import React, { useEffect } from "react";

interface NotificationProps {
  message: string;
  type?: "error" | "success" | "info";
  onClose: () => void;
  duration?: number;
}

export const Notification = ({
  message,
  type = "info",
  onClose,
  duration = 3000
}: NotificationProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose, message]);

  const styles = {
    error: "bg-alarm text-ink",
    success: "bg-signal text-ink",
    info: "bg-ink text-paper"
  }[type];

  return (
    <div
      role={type === "error" ? "alert" : "status"}
      className={`fixed left-4 right-4 top-[4.5rem] z-50 sm:bottom-4 sm:top-auto flex items-stretch border-rule border-ink sm:left-auto sm:max-w-md ${styles}`}
    >
      <span className="flex-1 px-4 py-3 font-bold leading-6">{message}</span>
      <button
        onClick={onClose}
        className="border-l-rule border-current px-4 font-bold hover:bg-ink hover:text-paper"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
};
