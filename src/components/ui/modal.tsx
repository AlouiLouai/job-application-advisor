"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className,
  showCloseButton = true,
}) => {
  React.useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      // backdrop-blur-sm
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fade-in animate-duration-300"
      onClick={onClose}
    >
      <div
        className={cn(
          "bg-card text-card-foreground rounded-xl border shadow-xl w-full max-w-lg mx-4 p-0 transform transition-all duration-300 ease-in-out animate-slide-in-up animate-duration-300",
          className
        )}
        onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing it
      >
        {title || showCloseButton ? (
          <div className="flex items-center justify-between border-b px-6 py-4">
            {title && (
              <h3 className="text-lg font-semibold text-foreground">
                {title}
              </h3>
            )}
            {showCloseButton && (
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto h-7 w-7 rounded-full"
                onClick={onClose}
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ) : null}

        <div className="p-6 text-sm">{children}</div>

        {footer && (
          <div className="border-t px-6 py-4 flex justify-end space-x-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export { Modal };
