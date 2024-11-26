import React, {useEffect} from "react";
import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuPortal, DropdownMenuSubContent
} from "@/components/ui/dropdown-menu";
import {BsTrashFill} from "react-icons/bs";
import {Separator} from "@/components/ui/separator";

const articleImageDefaultContent = {
    uploadedFile: undefined,
    altText: "",
    style: "square", // Possible values: "square", "full"
};

function ArticleImageEditor({content, onContentChange, onDelete}) {
    useEffect(() => {
        if (!content.style) {
            onContentChange({
                ...content,
                style: "full",
            });
        }
    }, [content, onContentChange]);

    const onStyleChange = (newStyle) => {
        onContentChange({
            ...content,
            style: newStyle,
        });
    };

    const setSelectedMedia = (mediaItem) => {
        onContentChange({
            ...content,
            fileUrl: mediaItem.url,
            altText: mediaItem.source,
        });
    }

    if (!content.style) {
        // return a gray screen if the style is not set
        return (
            <div
                className="flex flex-col items-center justify-center bg-gray-200 rounded-xl shadow-sm w-[250px] h-[250px]">
                <span className="text-gray-500">...</span>
            </div>
        );
    }

    return (
        <form>
            <div className="grid w-full items-center gap-4">
                {content.fileUrl && (
                    <div className="flex flex-col items-center justify-center relative overflow-hidden">
                        <img
                            className={`rounded-xl shadow-sm object-cover ${
                                content.style === "full" ? "w-full h-[150px]" : "w-[250px] h-[250px]"
                            }`}
                            alt={content.altText}
                            src={content.fileUrl}
                        />
                    </div>
                )}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            className="w-[120px] max-h-fit flex items-center justify-center ml-auto"
                            variant="outline"
                            aria-label="Select image style"
                        >
                            Style: {content.style.charAt(0).toUpperCase() + content.style.slice(1)}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => onStyleChange("square")}>
                            Square
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onStyleChange("full")}>
                            Full Width
                        </DropdownMenuItem>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                <span>Select Image</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    {/* media list */}
                                    {content.exchangeMedia.map((mediaItem) => (
                                        <DropdownMenuItem onClick={() => setSelectedMedia(mediaItem)}>
                                            <img
                                                src={mediaItem.url}
                                                alt={mediaItem.source}
                                                className="object-cover w-8 h-8"
                                            />
                                            <span>{mediaItem.source}</span>
                                        </DropdownMenuItem>))}
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <Separator/>
                        <DropdownMenuItem onClick={onDelete} className="text-destructive">
                            <BsTrashFill className="mr-2 h-4 w-4"/>
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </form>
    );
}

const ArticleImageContainer = {
    Editor: ArticleImageEditor,
    defaultContent: articleImageDefaultContent,
};

export {ArticleImageContainer};