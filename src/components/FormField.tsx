import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  control: Control<any>;
  name: string;
  label: string;
}

export const InputField = ({
  control,
  name,
  label,
  type = "text",
  ...props
}: InputFieldProps) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input {...field} type={type} className="w-full" {...props} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export const TextField = (props: InputFieldProps) => <InputField {...props} />;

export const PasswordField = (props: InputFieldProps) => (
  <InputField {...props} type="password" />
);
