import Link from "next/link";
import { ArrowLeft, CreditCard, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Payment Cancelled" };

export default function PaymentCancelPage() {
  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <Card className="w-full max-w-lg">
        <CardContent className="space-y-5 p-8 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-600">
            <CreditCard className="size-7" />
          </div>
          <div className="space-y-2">
            <h1 className="font-heading text-2xl font-semibold">Checkout cancelled</h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              No payment was taken and your plan has not changed. You can return to
              pricing whenever you are ready.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button render={<Link href="/pricing" />} className="flex-1">
              <RotateCcw className="size-4" /> Try again
            </Button>
            <Button render={<Link href="/" />} variant="outline" className="flex-1">
              <ArrowLeft className="size-4" /> Back home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
