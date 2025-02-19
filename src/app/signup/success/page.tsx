"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignupSuccess() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            アカウント登録完了
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-4">
          以下をクリックしてログインしてください。
          </p>
          <Link href="/login">
            <Button className="w-full bg-customBlue hover:bg-[#084a94]">
              ログインページへ
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
