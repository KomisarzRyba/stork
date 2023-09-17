import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReloadIcon } from "@radix-ui/react-icons";
import { FC } from "react";

interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean;
}

export const LoadingButton: FC<LoadingButtonProps> = ({
  isLoading = false,
  children,
  ...props
}) => {
  return (
    <Button disabled={isLoading} {...props}>
      <>
        {isLoading && <ReloadIcon className="absolute h-4 w-4 animate-spin" />}
        <div className={cn(isLoading && "invisible")}>{children}</div>
      </>
    </Button>
  );
};
