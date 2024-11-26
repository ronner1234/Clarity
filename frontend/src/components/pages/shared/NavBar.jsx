import {Link} from "react-router-dom";
import {cn} from "@/lib/utils";
import {ModeToggle} from "@/components/mode-toggle";
import {useTheme} from "@/components/theme-provider";


const NavBar = () => {
    const {theme} = useTheme();

    return (
        <div
            className={cn(
                "fixed top-0 left-0 right-0 z-10 flex items-center justify-between p-4 shadow-sm",
                "border-b border-neutral-200 dark:border-neutral-700",
                "bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50"
            )}>
            <div className="flex items-center gap-2">
                <Link to="/">
                    <img
                        src={theme === "dark" ? "/assets/Logo_dark.svg" : "/assets/Logo.svg"}
                        alt="ATZE EDIT Logo"
                        className="h20 w-40 pr-8 pl-4 object-contain"
                    />
                </Link>
                <div className="gap-0 flex">
                    <h3 className="text-sm gray mr-1">For</h3>
                    <h3 className="text-sm text-orange ml-0">E</h3>
                    <h3 className="text-sm gray">FAHRER.com</h3>
                </div>
            </div>
            <ModeToggle/>
        </div>
    );
};

export default NavBar;
