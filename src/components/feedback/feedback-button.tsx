"use client";

import * as React from "react";
import { MessageSquare, X, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/primitives/button";
import { Input } from "@/components/primitives/input";
import { Textarea } from "@/components/primitives/textarea";
import { Label } from "@/components/primitives/label";

export interface FeedbackButtonProps {
  /** Google Form URL for submission */
  formUrl?: string;
  /** Field entry IDs for the Google Form */
  formFields?: {
    url?: string;
    name?: string;
    email?: string;
    message?: string;
  };
  /** Current page path to include in feedback */
  currentPath?: string;
  /** Position of the floating button */
  position?: "bottom-right" | "bottom-left";
  /** Custom class for the button */
  className?: string;
}

export function FeedbackButton({
  formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdbuNmiZlSxl9WZfaeVTgZ_cQidM9ZRjP92GUA7DPA05UYV-w/formResponse",
  formFields = {
    url: "entry.1587308191",
    name: "entry.2077073325",
    email: "entry.527399120",
    message: "entry.449596912",
  },
  currentPath,
  position = "bottom-right",
  className,
}: FeedbackButtonProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const url = new URL(formUrl);
    if (formFields.url) {
      url.searchParams.set(
        formFields.url,
        typeof window !== "undefined" ? window.location.href : ""
      );
    }
    if (name && formFields.name) url.searchParams.set(formFields.name, name);
    if (email && formFields.email)
      url.searchParams.set(formFields.email, email);
    if (formFields.message) url.searchParams.set(formFields.message, message);

    // Submit via hidden iframe to avoid redirect
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url.toString();
    document.body.appendChild(iframe);
    setTimeout(() => iframe.remove(), 1000);

    setSubmitted(true);
    setTimeout(() => {
      setIsOpen(false);
      setSubmitted(false);
      setName("");
      setEmail("");
      setMessage("");
    }, 2000);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed p-3 bg-primary text-primary-foreground shadow-lg hover:opacity-90 transition-opacity z-50",
          position === "bottom-right" && "bottom-6 right-6",
          position === "bottom-left" && "bottom-6 left-6",
          className
        )}
        aria-label="Send feedback"
      >
        <MessageSquare className="h-5 w-5" />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-card border border-border rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-lg font-semibold text-foreground mb-1">
              Send Feedback
            </h2>
            {currentPath && (
              <p className="text-sm text-muted-foreground mb-4">
                Page: {currentPath}
              </p>
            )}

            {submitted ? (
              <div className="py-8 text-center">
                <p className="text-foreground font-medium">
                  Thanks for your feedback!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>
                    Name <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>
                    Email{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>
                    Feedback <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={4}
                    placeholder="What's on your mind?"
                    className="mt-1 resize-none"
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Send Feedback
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
