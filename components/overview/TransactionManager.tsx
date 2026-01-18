"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus, Save, Trash2, Wallet } from "lucide-react";
import { saveBulkTransactions, deleteTransaction } from "@/actions/actions";
import { toast } from "sonner";
import type {
  TransactionItem,
  TransactionType,
  CategoryType,
  TransactionFromDB,
} from "@/utils/types";
import { CATEGORIES, CATEGORY_LABELS } from "@/utils/data";

interface TransactionManagerProps {
  userId: string;
  dateStr: string;
  existingTransactions: TransactionFromDB[];
  dailyBudget: number;
}

export function TransactionManager({
  userId,
  dateStr,
  existingTransactions,
  dailyBudget,
}: TransactionManagerProps) {
  const router = useRouter();
  const [draftItems, setDraftItems] = useState<TransactionItem[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Form State
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<TransactionType>("EXPENSE");
  const [cat, setCat] = useState<CategoryType>("food");
  const [note, setNote] = useState("");

  // localStorage key for this specific date
  const storageKey = `draft_transactions_${dateStr}`;

  // Load draft items from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as TransactionItem[];
        setDraftItems(parsed);
      } catch {
        localStorage.removeItem(storageKey);
      }
    }
  }, [storageKey]);

  // Save draft items to localStorage whenever they change
  useEffect(() => {
    if (draftItems.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(draftItems));
    } else {
      localStorage.removeItem(storageKey);
    }
  }, [draftItems, storageKey]);

  const addItem = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("กรุณากรอกจำนวนเงินที่ถูกต้อง");
      return;
    }

    const newItem: TransactionItem = {
      id: crypto.randomUUID(),
      description: note || CATEGORY_LABELS[cat],
      amount: parseFloat(amount),
      type,
      category: cat,
      date: dateStr,
      note: note || null,
    };

    setDraftItems((prev) => [newItem, ...prev]);
    setAmount("");
    setNote("");
  };

  const removeDraftItem = (id: string) => {
    setDraftItems((prev) => prev.filter((item) => item.id !== id));
  };

  const onSave = () => {
    if (draftItems.length === 0) return;

    startTransition(async () => {
      const res = await saveBulkTransactions(draftItems, dailyBudget);
      if (res.success) {
        toast.success("บันทึกข้อมูลเรียบร้อย!");
        setDraftItems([]);
        localStorage.removeItem(storageKey);
        router.refresh(); // Refresh page to update data
      } else {
        toast.error(res.error || "เกิดข้อผิดพลาด");
      }
    });
  };

  const onDeleteExisting = async (transactionId: string) => {
    setIsDeleting(transactionId);
    try {
      const res = await deleteTransaction(transactionId, dateStr, dailyBudget);
      if (res.success) {
        toast.success("ลบรายการเรียบร้อย!");
        router.refresh(); // Refresh page to update data
      } else {
        toast.error(res.error || "เกิดข้อผิดพลาด");
      }
    } finally {
      setIsDeleting(null);
    }
  };

  // Calculate totals for draft items
  const draftExpense = draftItems.reduce(
    (acc, curr) => (curr.type === "EXPENSE" ? acc + curr.amount : acc),
    0
  );
  const draftIncome = draftItems.reduce(
    (acc, curr) => (curr.type === "INCOME" ? acc + curr.amount : acc),
    0
  );

  return (
    <div className="space-y-6">
      {/* Input Form (Glassmorphism) */}
      <Card className="border-white/20 bg-white/5 backdrop-blur-lg p-6 shadow-xl">
        <div className="space-y-4">
          {/* Row 1: Note */}
          <div>
            <Label htmlFor="note" className="text-sm font-medium mb-2 block">
              รายการ{" "}
              <span className="text-xs text-muted-foreground">(ไม่จำเป็น)</span>
            </Label>
            <Input
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="เช่น ค่าข้าว, โปรแกรม, เดินทาง..."
              className="bg-white/10"
            />
          </div>

          {/* Row 2: Amount, Category, Type */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="amount" className="text-sm font-medium mb-2 block">
                จำนวนเงิน
              </Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="bg-white/10 w-full"
                min="0"
                step="0.01"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex-1">
                <Label htmlFor="category" className="text-sm font-medium mb-2 block">
                  หมวดหมู่
                </Label>
                <Select value={cat} onValueChange={(v) => setCat(v as CategoryType)}>
                  <SelectTrigger id="category" className="bg-white/10 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label htmlFor="type" className="text-sm font-medium mb-2 block">
                  ประเภท
                </Label>
                <Select value={type} onValueChange={(v) => setType(v as TransactionType)}>
                  <SelectTrigger id="type" className="bg-white/10 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EXPENSE">รายจ่าย</SelectItem>
                    <SelectItem value="INCOME">รายรับ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Row 3: Add Button */}
          <Button onClick={addItem} variant="secondary" className="w-full">
            <Plus className="mr-2 h-4 w-4" /> เพิ่มรายการ
          </Button>
        </div>
      </Card>

      {/* Draft Items (not yet saved) */}
      {draftItems.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground px-2">
            รายการที่รอบันทึก ({draftItems.length} รายการ)
          </h4>
          {draftItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 backdrop-blur-sm animate-in fade-in slide-in-from-top-2"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`rounded-full p-2 ${item.type === "INCOME"
                    ? "bg-primary/20 text-primary"
                    : "bg-destructive/20 text-destructive"
                    }`}
                >
                  <Wallet size={18} />
                </div>
                <div>
                  <p className="font-semibold">{item.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {CATEGORY_LABELS[item.category] || item.category}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p
                  className={`text-lg font-bold ${item.type === "INCOME" ? "text-primary" : "text-destructive"
                    }`}
                >
                  {item.type === "INCOME" ? "+" : "-"}
                  {item.amount.toLocaleString()} ฿
                </p>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeDraftItem(item.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}

          {/* Save Button */}
          <Button
            onClick={onSave}
            disabled={isPending}
            className="w-full h-14 text-lg font-bold rounded-2xl shadow-2xl shadow-primary/20"
            size="lg"
          >
            <Save className="mr-2 h-5 w-5" />
            {isPending
              ? "กำลังบันทึก..."
              : `ยืนยันการบันทึก ${draftItems.length} รายการ`}
          </Button>
        </div>
      )}

      {/* Existing Transactions (already saved) */}
      {existingTransactions.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground px-2">
            รายการที่บันทึกแล้ว ({existingTransactions.length} รายการ)
          </h4>
          {existingTransactions.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`rounded-full p-2 ${item.type === "INCOME"
                    ? "bg-primary/20 text-primary"
                    : "bg-destructive/20 text-destructive"
                    }`}
                >
                  <Wallet size={18} />
                </div>
                <div>
                  <p className="font-semibold">
                    {item.note || CATEGORY_LABELS[item.category] || item.category}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {CATEGORY_LABELS[item.category] || item.category}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p
                  className={`text-lg font-bold ${item.type === "INCOME" ? "text-primary" : "text-destructive"
                    }`}
                >
                  {item.type === "INCOME" ? "+" : "-"}
                  {item.amount.toLocaleString()} ฿
                </p>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onDeleteExisting(item.id)}
                  disabled={isDeleting === item.id}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {draftItems.length === 0 && existingTransactions.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Wallet className="mx-auto h-12 w-12 mb-4 opacity-50" />
          <p>ยังไม่มีรายการในวันนี้</p>
          <p className="text-sm">เพิ่มรายการรายรับรายจ่ายได้เลย!</p>
        </div>
      )}
    </div>
  );
}