import { CategoryType } from "./types";

export const CATEGORIES: { value: CategoryType; label: string }[] = [
    { value: "food", label: "อาหาร" },
    { value: "transport", label: "เดินทาง" },
    { value: "shopping", label: "ช้อปปิ้ง" },
    { value: "health", label: "สุขภาพ" },
    { value: "salary", label: "เงินเดือน" },
    { value: "other", label: "อื่นๆ" },
];

export const CATEGORY_LABELS: Record<string, string> = {
    food: "อาหาร",
    transport: "เดินทาง",
    shopping: "ช้อปปิ้ง",
    health: "สุขภาพ",
    salary: "เงินเดือน",
    other: "อื่นๆ",
};