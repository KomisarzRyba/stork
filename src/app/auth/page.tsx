import { buttonVariants } from "@/components/ui/button";
import { FC } from "react";

const AuthPage: FC = () => {
  return (
    <main>
      <a href="/api/auth/login" className={buttonVariants()}>
        Login
      </a>
    </main>
  );
};

export default AuthPage;
