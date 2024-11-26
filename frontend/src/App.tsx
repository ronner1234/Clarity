import './App.css'
import {Routes, Route, BrowserRouter as Router} from 'react-router-dom'
import TopicsOverviewPage from '@/components/pages/topickOverView/TopickOverViewPage'
import FirstPage from '@/components/pages/fiestPage/FirstPage'
import SecondPage from '@/components/pages/secondPage/SecondPage'
import NavBar from '@/components/pages/shared/NavBar'
import {cn} from "@/lib/utils.ts";
import {ThemeProvider} from "./components/theme-provider.tsx";

function App() {

    return (
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">

                <div className={cn(
                    "h-screen w-full pt-16", // Add padding-top to ensure content is not hidden behind the NavBar
                    "bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50"
                )}>
                    <Router>
                        <NavBar/>
                        <Routes>
                            <Route path="/" element={<TopicsOverviewPage/>}/>
                            <Route path="/first" element={<FirstPage/>}/>
                            <Route path="/second" element={<SecondPage/>}/>

                        </Routes>
                    </Router>
                </div>
            </ThemeProvider>
    )
}

export default App