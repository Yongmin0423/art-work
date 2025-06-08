import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

export default function InputPair({
  label,
  description,
  textArea,
  defaultValue,
  ...rest
}: {
  label: string;
  description: string;
  textArea?: boolean;
  defaultValue?: string;
} & InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>) {
  return (
    <div className="space-y-2">
      <Label>
        {label}
        <small>{description}</small>
      </Label>
      {textArea ? (
        <Textarea rows={4} {...rest} defaultValue={defaultValue} />
      ) : (
        <Input {...rest} defaultValue={defaultValue} />
      )}
    </div>
  );
}
