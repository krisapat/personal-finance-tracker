import AnimatedCard from "@/components/animations/AnimatedCard"
import FadeUpWhenVisible from "@/components/animations/FadeUpWhenVisible"
import DarkmodeSection from "@/components/settings/DarkmodeSection"
import LoginSection from "@/components/settings/LoginSection"
import { currentUser } from "@clerk/nextjs/server"
import { Metadata } from "next"
export const metadata: Metadata = {
    title: "Krisapat Portfolio | Setting",
    description: "Krisapat Portfolio Setting Page",
};
const SettingPage = async () => {
    return (
        <main>
            <FadeUpWhenVisible>
                <h1 className="font-extrabold text-xl md:text-3xl text-center text-primary">
                    ตั้งค่า
                </h1>
            </FadeUpWhenVisible>
            <div className="flex flex-col w-full max-w-3xl mx-auto space-y-5 mt-5">
                {[
                    <LoginSection />,
                    <DarkmodeSection />,
                ].map((item, index) => (
                    <AnimatedCard key={index} index={index}>
                        {item}
                    </AnimatedCard>
                ))}
            </div>
        </main>
    )
}
export default SettingPage