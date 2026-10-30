"use client";

import React, { useState } from "react";
import {
  CreditCard,
  CheckCircle,
  Clock,
  Download,
  AlertCircle,
  FileCheck,
  Receipt,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { AppShell } from "@/components/shell/app-shell";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { StudentFeeRecord } from "@/lib/database.types";

export default function FeesPage() {
  const { feeRecords, payFee, currentUser } = useApp();
  const [paymentNotice, setPaymentNotice] = useState<string | null>(null);

  const isStaffOrAdmin = currentUser.role === "admin" || currentUser.role === "principal";

  const myFees = isStaffOrAdmin
    ? feeRecords
    : feeRecords.filter((f) => f.student_id === currentUser.id);

  const totalAmount = myFees.reduce((acc, curr) => acc + curr.amount, 0);
  const totalPaid = myFees
    .filter((f) => f.status === "paid")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const totalPending = myFees
    .filter((f) => f.status !== "paid")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const handlePay = (fee: StudentFeeRecord) => {
    payFee(fee.id);
    setPaymentNotice(`Payment successful for ${fee.fee_type} fee. Receipt generated.`);
    setTimeout(() => setPaymentNotice(null), 4000);
  };

  const handleDownloadReceipt = (fee: StudentFeeRecord) => {
    const receiptContent = `VINOBA BHAVE UNIVERSITY, HAZARIBAGH
OFFICIAL FEE PAYMENT RECEIPT

Receipt Number: ${fee.receipt_number || "REC-PENDING"}
Student Name: ${currentUser.full_name}
Roll Number: ${fee.student_roll_no}
Academic Year: ${fee.academic_year}
Semester: Semester ${fee.semester}

Fee Description: ${fee.fee_type.toUpperCase()} FEE
Amount Paid: INR ${fee.amount.toLocaleString()}
Payment Date: ${fee.paid_at || new Date().toISOString().slice(0, 10)}
Payment Mode: University Online Student Portal
Status: PAID & VERIFIED`;

    const blob = new Blob([receiptContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Receipt_${fee.receipt_number || "fee"}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-surface border border-line rounded-card">
          <div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-accent" />
              <h1 className="text-xl font-heading font-bold text-ink">
                Student Fee Management
              </h1>
            </div>
            <p className="text-xs text-muted mt-1">
              Semester tuition, hostel charges, examination fees, and downloadable payment receipts.
            </p>
          </div>

          <div className="text-xs text-muted text-right">
            <span>Roll Number: </span>
            <strong className="text-ink">{currentUser.roll_no || "Faculty / Admin"}</strong>
          </div>
        </div>

        {paymentNotice && (
          <div className="p-4 bg-[#F0F5EE] border border-line rounded-card flex items-center gap-2 text-xs font-semibold text-ink">
            <CheckCircle className="w-4 h-4 text-accent" />
            <span>{paymentNotice}</span>
          </div>
        )}

        {/* Fee Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Total annual dues"
            value={`₹${totalAmount.toLocaleString()}`}
            sublabel="Academic year 2025-26"
          />
          <StatCard
            label="Amount paid"
            value={`₹${totalPaid.toLocaleString()}`}
            sublabel="Verified by accounts section"
          />
          <StatCard
            label="Pending balance"
            value={`₹${totalPending.toLocaleString()}`}
            sublabel={totalPending === 0 ? "All fees cleared" : "Due before next exam date"}
          />
        </div>

        {/* Fee Breakdown List */}
        <div className="space-y-4">
          <h2 className="text-base font-heading font-bold text-ink">Fee breakdown by item</h2>

          <div className="space-y-3">
            {myFees.map((fee) => {
              const isPaid = fee.status === "paid";
              return (
                <Card key={fee.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-paper border border-line text-muted">
                        Semester {fee.semester} • {fee.academic_year}
                      </span>
                      <StatusBadge
                        status={isPaid ? "resolved" : "failed"}
                        label={isPaid ? "Paid" : "Pending"}
                      />
                    </div>

                    <h3 className="text-base font-heading font-bold text-ink capitalize">
                      {fee.fee_type} Fee
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
                      <span>
                        Due date: <strong>{fee.due_date}</strong>
                      </span>
                      {fee.receipt_number && (
                        <span>
                          Receipt: <strong className="font-mono text-ink">{fee.receipt_number}</strong>
                        </span>
                      )}
                      {fee.paid_at && (
                        <span>
                          Paid on: <strong>{fee.paid_at}</strong>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-3">
                    <span className="text-xl font-heading font-bold text-ink tabular-nums">
                      ₹{fee.amount.toLocaleString()}
                    </span>

                    {isPaid ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleDownloadReceipt(fee)}
                        className="gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download receipt</span>
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => handlePay(fee)}>
                        Pay online now
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
