"use client";

import React, { useState, useMemo } from "react";
import {
  CreditCard,
  CheckCircle,
  Download,
  Search,
  Filter,
  Bell,
  PlusCircle,
  Building2,
  FileSpreadsheet,
  AlertTriangle,
  Send,
  UserCheck,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { AppShell } from "@/components/shell/app-shell";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { StudentFeeRecord } from "@/lib/database.types";

export default function FeesPage() {
  const {
    feeRecords,
    payFee,
    recordOfflineFeePayment,
    sendFeeReminder,
    currentUser,
  } = useApp();

  const [paymentNotice, setPaymentNotice] = useState<string | null>(null);

  // Admin / Principal states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [feeTypeFilter, setFeeTypeFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");

  // Offline payment modal
  const [offlineModalOpen, setOfflineModalOpen] = useState(false);
  const [selectedFeeId, setSelectedFeeId] = useState<string>("");
  const [offlineMethod, setOfflineMethod] = useState("Bank Demand Draft");
  const [offlineRef, setOfflineRef] = useState("");

  const isStaffOrAdmin = currentUser.role === "admin" || currentUser.role === "principal";

  // For Student view: only their own fees
  const studentFees = feeRecords.filter((f) => f.student_id === currentUser.id);

  // For Admin / Principal: filtered across all records
  const filteredLedger = useMemo(() => {
    return feeRecords.filter((record) => {
      const matchesSearch =
        searchQuery === "" ||
        (record.student_name && record.student_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        record.student_roll_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.fee_type.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "all" || record.status === statusFilter;
      const matchesType = feeTypeFilter === "all" || record.fee_type === feeTypeFilter;
      const matchesDept =
        departmentFilter === "all" ||
        (record.department && record.department.toLowerCase().includes(departmentFilter.toLowerCase()));

      return matchesSearch && matchesStatus && matchesType && matchesDept;
    });
  }, [feeRecords, searchQuery, statusFilter, feeTypeFilter, departmentFilter]);

  // Treasury Stats (Admin/Principal)
  const totalAssessed = feeRecords.reduce((acc, curr) => acc + curr.amount, 0);
  const totalCollected = feeRecords
    .filter((f) => f.status === "paid")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const totalOutstanding = feeRecords
    .filter((f) => f.status !== "paid")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const overdueCount = feeRecords.filter((f) => f.status === "overdue").length;
  const collectionRate = totalAssessed > 0 ? Math.round((totalCollected / totalAssessed) * 100) : 0;

  // Student specific stats
  const studentTotal = studentFees.reduce((acc, curr) => acc + curr.amount, 0);
  const studentPaid = studentFees
    .filter((f) => f.status === "paid")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const studentPending = studentFees
    .filter((f) => f.status !== "paid")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const handlePayStudent = (fee: StudentFeeRecord) => {
    payFee(fee.id);
    setPaymentNotice(`Payment successful for ${fee.fee_type} fee. Official university receipt generated.`);
    setTimeout(() => setPaymentNotice(null), 4000);
  };

  const handleDownloadReceipt = (fee: StudentFeeRecord) => {
    const studentName = fee.student_name || currentUser.full_name;
    const receiptContent = `VINOBA BHAVE UNIVERSITY, HAZARIBAGH
OFFICIAL UNIVERSITY FEE RECEIPT

Receipt Number: ${fee.receipt_number || "REC-PENDING"}
Student Name: ${studentName}
Roll Number: ${fee.student_roll_no}
Department: ${fee.department || "Engineering & Sciences"}
Academic Year: ${fee.academic_year}
Semester: Semester ${fee.semester}

Fee Description: ${fee.fee_type.toUpperCase()} FEE
Amount Paid: INR ${fee.amount.toLocaleString()}
Payment Date: ${fee.paid_at || new Date().toISOString().slice(0, 10)}
Payment Mode: ${fee.payment_method || "University Online Student Portal"}
Verification: APPROVED & SEALED BY COMPTROLLER OF EXAMINATIONS`;

    const blob = new Blob([receiptContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Receipt_${fee.receipt_number || fee.student_roll_no}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRecordOfflineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFeeId) return;
    recordOfflineFeePayment(selectedFeeId, offlineMethod, offlineRef);
    setOfflineModalOpen(false);
    setSelectedFeeId("");
    setOfflineRef("");
    setPaymentNotice("Offline payment recorded successfully. Receipt generated.");
    setTimeout(() => setPaymentNotice(null), 4000);
  };

  const handleSendReminder = (fee: StudentFeeRecord) => {
    sendFeeReminder(fee.id);
    setPaymentNotice(`Fee due reminder notification sent to ${fee.student_name || fee.student_roll_no}.`);
    setTimeout(() => setPaymentNotice(null), 4000);
  };

  const handleBulkReminders = () => {
    const unpaid = feeRecords.filter((f) => f.status !== "paid");
    unpaid.forEach((f) => sendFeeReminder(f.id));
    setPaymentNotice(`Sent fee due notices to all ${unpaid.length} students with pending or overdue fees.`);
    setTimeout(() => setPaymentNotice(null), 4000);
  };

  const handleExportCSV = () => {
    const header = "Student Name,Roll Number,Department,Semester,Academic Year,Fee Type,Amount,Status,Due Date,Receipt Number,Paid At,Payment Mode\n";
    const rows = filteredLedger
      .map(
        (f) =>
          `"${f.student_name || ""}","${f.student_roll_no}","${f.department || ""}","${f.semester}","${f.academic_year}","${f.fee_type}","${f.amount}","${f.status}","${f.due_date}","${f.receipt_number || ""}","${f.paid_at || ""}","${f.payment_method || ""}"`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `VBU_Fee_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-6xl">
        {/* Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-surface border border-line rounded-card">
          <div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-accent" />
              <h1 className="text-xl font-heading font-bold text-ink">
                {isStaffOrAdmin ? "University Fee Treasury & Student Ledger" : "Student Fee Management"}
              </h1>
            </div>
            <p className="text-xs text-muted mt-1">
              {isStaffOrAdmin
                ? "Vinoba Bhave University financial collection oversight, offline reconciliation, and student fee ledger."
                : "Semester tuition, hostel charges, examination fees, and downloadable payment receipts."}
            </p>
          </div>

          <div className="text-xs text-muted text-right">
            <span>Signed in as: </span>
            <strong className="text-ink">
              {currentUser.full_name} ({currentUser.role})
            </strong>
          </div>
        </div>

        {paymentNotice && (
          <div className="p-4 bg-[#F0F5EE] border border-line rounded-card flex items-center gap-2 text-xs font-semibold text-ink">
            <CheckCircle className="w-4 h-4 text-accent" />
            <span>{paymentNotice}</span>
          </div>
        )}

        {/* ADMIN & PRINCIPAL VIEW */}
        {isStaffOrAdmin ? (
          <div className="space-y-6">
            {/* University Treasury Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Total fees assessed"
                value={`₹${totalAssessed.toLocaleString()}`}
                sublabel={`${feeRecords.length} student records for 2025-26`}
              />
              <StatCard
                label="Total fees collected"
                value={`₹${totalCollected.toLocaleString()}`}
                sublabel={`${collectionRate}% overall collection rate`}
              />
              <StatCard
                label="Outstanding dues"
                value={`₹${totalOutstanding.toLocaleString()}`}
                sublabel="Pending or overdue fees"
              />
              <StatCard
                label="Overdue accounts"
                value={`${overdueCount} students`}
                sublabel="Action required for exam admit"
              />
            </div>

            {/* Admin Toolbar & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-surface border border-line rounded-card">
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    const firstUnpaid = feeRecords.find((f) => f.status !== "paid");
                    if (firstUnpaid) setSelectedFeeId(firstUnpaid.id);
                    setOfflineModalOpen(true);
                  }}
                  className="gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Record offline payment</span>
                </Button>

                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleBulkReminders}
                  className="gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send reminders to all pending</span>
                </Button>

                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleExportCSV}
                  className="gap-1.5"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Export ledger CSV</span>
                </Button>
              </div>

              <span className="text-xs text-muted tabular-nums">
                Showing {filteredLedger.length} of {feeRecords.length} student records
              </span>
            </div>

            {/* Filters */}
            <Card className="p-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">Search student</label>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Name, roll number, fee..."
                      className="w-full text-xs pl-8 pr-3 py-2 rounded-input border border-line bg-paper text-text focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">Department</label>
                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-input border border-line bg-paper text-text focus:outline-none focus:border-accent"
                  >
                    <option value="all">All departments</option>
                    <option value="Computer Science">Computer Science & Eng.</option>
                    <option value="Electronics">Electronics & Comm.</option>
                    <option value="Mechanical">Mechanical Engineering</option>
                    <option value="Civil">Civil Engineering</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">Payment status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-input border border-line bg-paper text-text focus:outline-none focus:border-accent"
                  >
                    <option value="all">All statuses</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">Fee category</label>
                  <select
                    value={feeTypeFilter}
                    onChange={(e) => setFeeTypeFilter(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-input border border-line bg-paper text-text focus:outline-none focus:border-accent"
                  >
                    <option value="all">All fee categories</option>
                    <option value="tuition">Tuition fee</option>
                    <option value="hostel">Hostel & Mess</option>
                    <option value="examination">Examination fee</option>
                    <option value="library">Library fee</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* University Fee Ledger Table */}
            <div className="bg-surface border border-line rounded-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-paper border-b border-line text-muted uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Department & Sem</th>
                      <th className="py-3 px-4">Fee category</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Due date</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Receipt / Mode</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {filteredLedger.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-muted">
                          No student fee records match your search criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredLedger.map((fee) => {
                        const isPaid = fee.status === "paid";
                        const isOverdue = fee.status === "overdue";
                        return (
                          <tr key={fee.id} className="hover:bg-paper transition-colors">
                            <td className="py-3 px-4">
                              <p className="font-semibold text-ink">{fee.student_name || "Enrolled Student"}</p>
                              <p className="text-[11px] font-mono text-muted">{fee.student_roll_no}</p>
                            </td>
                            <td className="py-3 px-4">
                              <p className="text-ink font-medium truncate max-w-[150px]">{fee.department || "Engineering"}</p>
                              <p className="text-[11px] text-muted">Sem {fee.semester} • {fee.academic_year}</p>
                            </td>
                            <td className="py-3 px-4 capitalize font-semibold text-ink">
                              {fee.fee_type}
                            </td>
                            <td className="py-3 px-4 font-bold text-ink tabular-nums">
                              ₹{fee.amount.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-muted tabular-nums">
                              {fee.due_date}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                                  isPaid
                                    ? "bg-[#E6F4EA] text-[#137333]"
                                    : isOverdue
                                    ? "bg-[#FCE8E6] text-emergency"
                                    : "bg-[#FEF7E0] text-[#B06000]"
                                }`}
                              >
                                {isPaid ? "Paid" : isOverdue ? "Overdue" : "Pending"}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-muted">
                              {fee.receipt_number ? (
                                <div>
                                  <span className="font-mono text-ink font-semibold">{fee.receipt_number}</span>
                                  {fee.payment_method && (
                                    <p className="text-[10px] text-muted truncate max-w-[140px]">{fee.payment_method}</p>
                                  )}
                                </div>
                              ) : (
                                <span className="text-muted italic">Awaiting clearance</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {isPaid ? (
                                  <button
                                    onClick={() => handleDownloadReceipt(fee)}
                                    className="px-2 py-1 rounded border border-line bg-surface text-ink hover:bg-paper font-semibold text-[11px] flex items-center gap-1"
                                    title="Download voucher"
                                  >
                                    <Download className="w-3 h-3" />
                                    <span>Receipt</span>
                                  </button>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => {
                                        setSelectedFeeId(fee.id);
                                        setOfflineModalOpen(true);
                                      }}
                                      className="px-2 py-1 rounded bg-ink text-surface hover:bg-opacity-95 font-semibold text-[11px]"
                                    >
                                      Record pay
                                    </button>
                                    <button
                                      onClick={() => handleSendReminder(fee)}
                                      className="px-2 py-1 rounded border border-line bg-surface text-muted hover:text-ink hover:bg-paper text-[11px]"
                                      title="Send reminder notice"
                                    >
                                      Remind
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* STUDENT VIEW: Individual Fee Details & Online Payment */
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                label="Total annual dues"
                value={`₹${studentTotal.toLocaleString()}`}
                sublabel="Academic year 2025-26"
              />
              <StatCard
                label="Amount paid"
                value={`₹${studentPaid.toLocaleString()}`}
                sublabel="Verified by accounts section"
              />
              <StatCard
                label="Pending balance"
                value={`₹${studentPending.toLocaleString()}`}
                sublabel={studentPending === 0 ? "All fees cleared" : "Due before next exam date"}
              />
            </div>

            <div className="space-y-4">
              <h2 className="text-base font-heading font-bold text-ink">Fee breakdown by item</h2>

              <div className="space-y-3">
                {studentFees.map((fee) => {
                  const isPaid = fee.status === "paid";
                  return (
                    <Card
                      key={fee.id}
                      className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
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
                              Receipt:{" "}
                              <strong className="font-mono text-ink">{fee.receipt_number}</strong>
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
                          <Button size="sm" onClick={() => handlePayStudent(fee)}>
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
        )}

        {/* Modal: Record Offline Payment (Admin & Principal) */}
        <Modal
          isOpen={offlineModalOpen}
          onClose={() => setOfflineModalOpen(false)}
          title="Record Offline Fee Settlement"
        >
          <form onSubmit={handleRecordOfflineSubmit} className="space-y-4">
            <p className="text-xs text-muted">
              Record a fee payment made through university counter, bank demand draft, or bank challan.
            </p>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                Select student fee item
              </label>
              <select
                value={selectedFeeId}
                onChange={(e) => setSelectedFeeId(e.target.value)}
                required
                className="w-full text-xs px-3 py-2 rounded-input border border-line bg-paper text-text focus:outline-none focus:border-accent"
              >
                <option value="">-- Choose student fee record --</option>
                {feeRecords
                  .filter((f) => f.status !== "paid")
                  .map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.student_name || f.student_roll_no} — {f.fee_type.toUpperCase()} (₹{f.amount})
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                Payment settlement mode
              </label>
              <select
                value={offlineMethod}
                onChange={(e) => setOfflineMethod(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-input border border-line bg-paper text-text focus:outline-none focus:border-accent"
              >
                <option value="Bank Demand Draft">Bank Demand Draft (DD)</option>
                <option value="Campus Bank Cash Challan">Campus Bank Cash Challan</option>
                <option value="Direct NEFT / RTGS Transfer">Direct NEFT / RTGS Transfer</option>
                <option value="State Scholarship Credit">State Welfare Scholarship Credit</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                Transaction / DD Reference number
              </label>
              <Input
                value={offlineRef}
                onChange={(e) => setOfflineRef(e.target.value)}
                placeholder="e.g. SBI-DD-89312 or CHAL-2026-99"
                required
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-line">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setOfflineModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Record payment & issue receipt
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AppShell>
  );
}
