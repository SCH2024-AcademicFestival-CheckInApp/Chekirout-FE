import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  control: Control<any>;
  name: string;
  label: string;
  disabled?: boolean;
}

export const TextField = ({
  control,
  name,
  label,
  disabled,
  ...props
}: TextFieldProps) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input {...field} disabled={disabled} className="w-full" {...props} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export const PasswordField = ({
  control,
  name,
  label,
  ...props
}: {
  control: Control<any>;
  name: string;
  label: string;
}) => (
  <TextField
    control={control}
    name={name}
    label={label}
    type="password"
    {...props}
  />
);
