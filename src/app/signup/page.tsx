"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
// Tooltip 関連のインポート
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip"

// actions.ts から signup 関数をインポート
import { signup } from "@/app/login/actions"

type FormValues = {
  username: string
  email: string
  password: string
}

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<FormValues>()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // パスワード入力値を監視
  const passwordValue = watch("password")

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("username", data.username)
      formData.append("email", data.email)
      formData.append("password", data.password)

      // signup 関数を呼び出す
      const result = await signup(formData)

      // エラーが返ってきた場合は、react-hook-form の setError を使って表示する
      if (result && result.error) {
        // 必要に応じて password フィールドにもエラーを設定可能
        setError("password", { type: "server", message: result.error })
        return
      }
      // 正常時はサーバー側でリダイレクトされるため、ここには到達しない想定
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            アカウントを作成
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            {/* ユーザー名 */}
            <div className="space-y-2">
              <Label htmlFor="username">ユーザー名</Label>
              <Input
                id="username"
                {...register("username", {
                  required: "ユーザー名を入力してください",
                })}
                className="border-customGray"
              />
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username.message}</p>
              )}
            </div>

            {/* メールアドレス */}
            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                {...register("email", {
                  required: "メールアドレスを入力してください",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "有効なメールアドレスを入力してください",
                  },
                })}
                className="border-customGray"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* パスワード */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">パスワード</Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "パスワードを入力してください",
                  })}
                  className="border-customGray"
                />
                {/* パスワード入力がある場合のみアイコン表示 */}
                {passwordValue && (
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 top-2 text-customGray"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {showPassword ? "パスワードを非表示" : "パスワードを表示"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                </div>
                {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

            <Button
              type="submit"
              className="w-full bg-customBlue hover:bg-[#084a94]"
              disabled={isLoading}
            >
              {isLoading ? "作成中..." : "アカウントを作成"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              すでにアカウントをお持ちの場合は、{" "}
              <Link href="/login" className="text-customBlue hover:underline">
                ログインしてください
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}