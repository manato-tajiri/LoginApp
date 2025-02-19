"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip"
import { login } from "@/app/login/actions"

type FormValues = {
  email: string
  password: string
  rememberDevice: boolean
}

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    setError,
    watch,
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
      formData.append("email", data.email)
      formData.append("password", data.password)

      // サーバーアクション login を呼び出す
      const result = await login(formData)

      // エラーがあれば、react-hook-form の setError を使って各入力欄にエラーを表示
      if (result && result.error) {
        setError("password", { type: "server", message: result.error })
        return
      }

      // 成功時はサーバーアクション内で redirect されるので、ここには来ないはず
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
            アカウントにログイン
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
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
              {isLoading ? "ログイン中..." : "ログイン"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}