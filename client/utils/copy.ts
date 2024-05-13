import { toast } from "sonner";

export function copyText(text: string, message: string, cb?: () => void) {
  navigator.clipboard.writeText(text).then(() => {
    toast.success(message);
    if (cb) {
      cb();
    }
  });
}
