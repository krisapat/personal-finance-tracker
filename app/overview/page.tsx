import { fetchBudget } from "@/actions/actions";
import CreateBudgetForm from "@/components/overviewPage/CreateBudgetForm";
import SignInBudgetPage from "@/components/overviewPage/SignInBudgetPage";
import { MonthlySummary } from "@/components/overviewPage/MonthlySummary";
import { auth } from "@clerk/nextjs/server";
import { Card } from "@/components/ui/card";

const Overview = async () => {
  const { userId } = await auth();
  if (!userId) {
    return (
      <section className="flex justify-center p-4">
        <Card className="p-6 w-full max-w-2xl">
          <SignInBudgetPage />
        </Card>
      </section>
    );
  }
  const budget = await fetchBudget(userId);

  return (
    <main className="min-h-screen p-4 md:p-6">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <header className="text-center space-y-2">
          <p className="text-xs sm:text-sm font-medium uppercase tracking-widest text-muted-foreground">
            ภาพรวม
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black">
            สรุปรายรับรายจ่าย
          </h1>
        </header>

        {/* Budget Section */}
        <Card className="p-4 sm:p-6 bg-white/10 dark:bg-black/20 backdrop-blur-md border-white/20">
          <div >
            <div className="flex flex-col items-center justify-center">
              <p className="text-sm text-muted-foreground">งบประมาณรายวัน</p>
              {budget ? (
                <p className="text-2xl sm:text-3xl font-bold text-primary">
                  {Number(budget.amount).toLocaleString()} ฿
                </p>
              ) : (
                <p className="text-muted-foreground italic">ยังไม่ได้ตั้งงบประมาณ</p>
              )}
            </div>
            <CreateBudgetForm />
          </div>
        </Card>

        {/* Monthly Summary Section */}
        <section>
          <MonthlySummary userId={userId} />
        </section>
      </div>
    </main>
  );
};

export default Overview;