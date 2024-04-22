import { toast } from "sonner";

export function createError(error: unknown) {
  if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error("Unknown error occured");
  }
  console.error(error);
}
