"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  ReceiptText,
  TriangleAlert,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api, ApiClientError } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Payment } from "@/lib/types";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id") || "";
  const { refetch } = useAuth();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [message, setMessage] = useState("");
  const [payment, setPayment] = useState<Payment | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function verify() {
      if (!sessionId) {
        setStatus("error");
        setMessage("Missing Stripe session id. Start the upgrade again from the pricing page.");
        return;
      }

      try {
        const response = await api.get<{
          plan: string;
          alreadyProcessed: boolean;
          payment: Payment;
        }>(`/api/payments/verify-session?session_id=${encodeURIComponent(sessionId)}`);

        if (cancelled) return;
        setPayment(response.payment);
        setStatus("success");
        await refetch();
        toast.success("Payment verified — welcome to Pro!");
      } catch (error) {
        if (cancelled) return;
        const text =
          error instanceof ApiClientError
            ? error.message
            : "We could not verify this payment.";
        setMessage(text);
        setStatus("error");
        toast.error("Payment verification failed", { description: text });
      }
    }

    void verify();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <Card className="w-full max-w-lg">
        <CardContent className="space-y-5 p-8 text-center">
          {status === "verifying" ? (
            <>
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Loader2 className="size-7 animate-spin" />
              </div>
              <div className="space-y-2">
                <h1 className="font-heading text-2xl font-semibold">Verifying your payment</h1>
                <p className="text-sm text-muted-foreground">
                  Please wait while we confirm the Stripe session and upgrade your account.
                </p>
              </div>
            </>
          ) : null}

          {status === "success" ? (
            <>
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                <CheckCircle2 className="size-7" />
              </div>
              <div className="space-y-2">
                <h1 className="font-heading text-2xl font-semibold">You are now Pro</h1>
                <p className="text-sm text-muted-foreground">
                  Your payment was verified successfully and your plan has been upgraded.
                </p>
              </div>

              {payment ? (
                <div className="rounded-lg border bg-muted/40 p-4 text-left text-sm">
                  <div className="mb-3 flex items-center gap-2 font-semibold">
                    <ReceiptText className="size-4 text-primary" /> Payment receipt
                  </div>
                  <dl className="space-y-1.5 text-xs">
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Amount</dt>
                      <dd className="font-medium">
                        {formatCurrency(payment.amount, payment.currency)}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Plan</dt>
                      <dd className="font-medium capitalize">{payment.planName}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Transaction</dt>
                      <dd className="max-w-[60%] truncate font-mono text-[0.65rem]">
                        {payment.transactionId}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Date</dt>
                      <dd className="font-medium">{formatDate(payment.paidAt)}</dd>
                    </div>
                  </dl>
                </div>
              ) : null}

              <div className="flex flex-col gap-2 sm:flex-row">
                <Button render={<Link href="/dashboard" />} className="flex-1">
                  Go to dashboard <ArrowRight className="size-4" />
                </Button>
                <Button render={<Link href="/tuitions" />} variant="outline" className="flex-1">
                  Browse tuitions
                </Button>
              </div>
            </>
          ) : null}

          {status === "error" ? (
            <>
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <TriangleAlert className="size-7" />
              </div>
              <div className="space-y-2">
                <h1 className="font-heading text-2xl font-semibold">Payment not verified</h1>
                <p className="text-sm text-muted-foreground">{message}</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button render={<Link href="/pricing" />} className="flex-1">
                  Back to pricing
                </Button>
                <Button render={<Link href="/dashboard" />} variant="outline" className="flex-1">
                  Go to dashboard
                </Button>
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
