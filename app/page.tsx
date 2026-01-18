import { fetchProfile } from "@/actions/actions";
import { BackgroundDecor } from "@/components/home/BackgroundDecor";
import CalendarPageWrapper from "@/components/home/CalendarPageWrapper";
import FadeUpWhenVisible from "@/components/animations/FadeUpWhenVisible";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "หน้าหลัก | บัญชีหนังหมา",
  description: "บันทึกรายรับรายจ่าย",
};

export default async function Home() {
  const profile = await fetchProfile();
  const welcomeText = profile?.userName
    ? `ยินดีต้อนรับ ${profile.userName}`
    : "ยินดีต้อนรับ";

  return (
    <section>
      <div className="relative isolate min-h-screen">
        <BackgroundDecor />
        <div className="mx-auto max-w-4xl">
          {/* แสดงข้อความต้อนรับ */}
          <FadeUpWhenVisible>
            <h1 className="text-2xl text-center mb-4">{welcomeText}</h1>
          </FadeUpWhenVisible>
          <FadeUpWhenVisible className="delay-100">
            <p className="text-2xl text-center font-semibold mb-6 ">เลือกวันที่ต้องการบันทึก</p>
          </FadeUpWhenVisible>
          <CalendarPageWrapper />
        </div>
      </div>
    </section>
  );
}