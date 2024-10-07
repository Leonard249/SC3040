"use client";
import React, { useState } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

const ForgetPasswordCard = () => {
  const [email, setEmail] = useState();

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Forget Password?</CardTitle>
        <CardDescription>Please enter your registered email</CardDescription>
      </CardHeader>

      <CardContent className="space-y-5 px-0 pb-0">
        <form className="space-y-2.5">
          <Input
            disabled={false}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
          />
            <div className="flex space-x-5">
          <p className="text-xs text-muted-foreground">
            Remember your password?{" "}
            <span
              onClick={() => setState("signUp")}
              className="text-sky-700 hover:underline cursor-pointer"
            >
              Login
            </span>
          </p>
          <Button type="submit" className="" size="lg" disabled={false}>
            Get Verification Code
                      </Button>
                      </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ForgetPasswordCard;
