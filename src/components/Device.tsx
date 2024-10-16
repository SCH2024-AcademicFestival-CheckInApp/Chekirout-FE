import { Control, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { PlusCircle, Trash2 } from "lucide-react";

interface DeviceProps {
  control: Control<any>;
}

export const Device = ({ control }: DeviceProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "devices",
  });

  return (
    <div className="w-[328px]">
      <FormLabel>등록된 디바이스</FormLabel>
      {fields.map((field, index) => (
        <FormField
          key={field.id}
          control={control}
          name={`devices.${index}`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center space-x-2 mb-2">
                  <Input
                    {...field}
                    className="w-full"
                    placeholder="디바이스 이름"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      ))}
      {fields.length < 2 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2 w-full mb-4"
          onClick={() => append("")}>
          <PlusCircle className="h-4 w-4 mr-2" />
          디바이스 추가
        </Button>
      )}
    </div>
  );
};
