// components/price-selector.tsx
import { useState } from 'react';
import { Label } from '~/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

export default function PriceSelector({
  name,
  required,
  label,
  description,
  placeholder,
  options,
  onSelectionChange,
}: {
  label: string;
  description: string;
  name: string;
  required?: boolean;
  placeholder: string;
  options: {
    label: string;
    value: string;
  }[];
  onSelectionChange?: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const handleValueChange = (value: string) => {
    if (onSelectionChange) {
      onSelectionChange(value);
    }
  };

  return (
    <div className="space-y-2 flex flex-col">
      <Label
        className="flex flex-col gap-1 font-bold"
        onClick={() => setOpen(true)}
      >
        {label}
        <small className="text-muted-foreground">{description}</small>
      </Label>
      <Select
        open={open}
        onOpenChange={setOpen}
        name={name}
        required={required}
        onValueChange={handleValueChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
