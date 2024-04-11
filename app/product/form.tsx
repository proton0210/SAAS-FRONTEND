"use client";

import { useFormState } from "react-dom";
import { uploadFileWrapper } from "@/lib/actions/image.action";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type uploadFormProps = {
  ClerkID: string;
  credits: number;
};
const initialState = { status: "", message: "" };

export function UploadForm({ ClerkID, credits }: uploadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [state, formAction] = useFormState(uploadFileWrapper, initialState);
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("file", e.currentTarget.file.files![0]);

    try {
      await formAction({ formData, ClerkID });
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        router.refresh();
      }, 7000);
    }
  };

  return (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit}>
        <div className="grid w-full max-w-sm items-center gap-1.5 font-sans mb-4">
          <Label htmlFor="file">File</Label>
          <Input type="file" id="file" name="file" accept="images/*" />
        </div>
        <div className="flex justify-end">
          <Button
            type="submit"
            className="primary-gradient w-[120px] h-10 font-semibold font-sans text-white rounded-md hover:shadow-md cursor-pointer hover:shadow-indigo-500/50"
            disabled={isSubmitting || credits === 0}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
        {state?.status && (
          <div className={`state-message ${state?.status}`}>
            {state?.message}
          </div>
        )}
      </form>
      {credits === 0 ? (
        <div className="text-red-300 font-sans">You have no credits left</div>
      ) : null}
    </div>
  );
}
