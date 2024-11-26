import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import ArticalEditColumn from "@/components/pages/secondPage/artical/ArticalEditColumn";
import {useLocation, useNavigate} from "react-router-dom";
import ThirdPage from "@/components/pages/thirdPage/ThirdPage";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {ScrollArea} from "@/components/ui/scroll-area";

function ArticalEditor() {
    const location = useLocation();
    const {topicData, media} = location.state || {};
    const [articalData, setArticalData] = useState({});
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const handleSourceSelection = () => {
        navigate("/");
    };

    if (!topicData) {
        return (
            <div className="flex flex-col h-full p-[30px]">
                <div className="flex flex-row h-full overflow-hidden">
                    <div className="flex flex-col items-center justify-center flex-grow">
                        <h1 className="text-3xl">No article data found!</h1>
                        <Button
                            onClick={() => (window.location.href = "/")}
                            variant="default">
                            Go Back
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    useEffect(() => {
        const fetchAtrical = async () => {
            setLoading(true); // Set loading state before fetching
            try {
                const response = await fetch("http://localhost:8000/get_text", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(topicData),
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch media data");
                }
                const data = await response.json();
                console.log("Data from server");
                console.log(data);
                setArticalData(data);
            } catch (error) {
                console.error("Error fetching media data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAtrical();
    }, []);

    return (
        <div className="flex flex-col h-full ">
            {/* Preview Column with Hardcoded Article */}
            <div className="flex flex-row h-full overflow-hidden px-[10%]">
                <ArticalEditColumn
                    artical={articalData}
                    setArtical={setArticalData}
                    media={media}
                    loading={loading}></ArticalEditColumn>
            </div>

            {/* Bottom Action Bar */}
            <div className="bg-secondary p-2 flex flex-row items-center justify-between">
                <div>
                    <Button
                        className="mr-auto"
                        variant="default"
                        onClick={handleSourceSelection}
                        disabled={loading}>
                        {"< Back"}
                    </Button>
                </div>
                <div
                    className="flex flex-row items-center justify-between space-x-2">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                className="bg-orange ml-auto"
                                disabled={loading}>
                                Publish
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="h-full w-full sm:max-w-md">
                            <SheetHeader>
                                <SheetTitle>Published Successfully</SheetTitle>
                                <SheetDescription>
                                    The article has been successfully published.
                                </SheetDescription>
                            </SheetHeader>
                            <ScrollArea className="h-full">
                                <ThirdPage articalData={articalData}/>
                                <div className="pb-10"></div>
                            </ScrollArea>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </div>
    );
}

export default ArticalEditor;
