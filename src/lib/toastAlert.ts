import toast from "react-hot-toast";
import { Messages } from "./config";

export const toastError = (err: any) => {
  const error = err.response?.data ?? err;
  const message = error?.message ?? Messages.error1;

  toast.error(message);
};

export const toastSuccess = (msg: string, duration: number = 2000) => {
  toast.success(msg, { duration });
};

export const toastComingSoon = (msg: string, duration: number = 2000) => {
  toast(msg, {
    icon: "⏳",
    duration,
    style: { minWidth: "180px", textAlign: "center" },
  });
};

export const toastSmallSuccess = (msg: string, duration: number = 2000) => {
  toast(msg, {
    icon: "✅",
    duration,
    style: { minWidth: "180px", textAlign: "center" },
  });
};

export const toastFailureProvider = (msg: string, forward_url: string = "") => {
  toast.error(msg, { duration: 3000 });
  if (forward_url !== "") {
    setTimeout(() => {
      window.location.replace(forward_url);
    }, 3000);
  }
};
