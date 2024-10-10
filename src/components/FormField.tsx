import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Control } from "react-hook-form";

interface InputFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const InputField = ({
  control,
  name,
  label,
  type = "text",
  disabled,
  ...props
}: InputFieldProps) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input
            {...field}
            type={type}
            className="w-full"
            {...props}
            disabled={disabled}
          />
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

interface SelectFieldProps {
  label: string;
  name: string;
  control: Control<any>;
  options: { value: string; label: string }[];
  placeholder?: string;
  disabled?: boolean;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  control,
  options,
  placeholder,
  disabled,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={disabled}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
