import { ThemeProvider } from "@/components/darkmode/theme-provider"
import Navbar from "@/components/nav/Navbar"
import { Toaster } from "@/components/ui/sonner"

const Providers = async ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <Navbar />
                {children}
                <Toaster toastOptions={{
                    className: "kanitFont",
                }} />
                
            </ThemeProvider>
        </>
    )
}
export default Providers