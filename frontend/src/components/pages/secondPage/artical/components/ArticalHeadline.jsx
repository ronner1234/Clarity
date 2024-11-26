import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem} from "@/components/ui/dropdown-menu";
import {Edit2} from "lucide-react";
import {BsTrashFill} from "react-icons/bs";
import {Separator} from "@/components/ui/separator";

const articleTitleDefaultContent = {
    text: "This is a title",
    type: "title", // Possible values: "title", "subtitle", "heading"
};

function getTitleClassName(type) {
    switch (type) {
        case "title":
            return "text-2xl font-bold";
        case "subtitle":
            return "text-xl font-semibold";
        case "heading":
            return "text-lg font-medium";
        default:
            return "";
    }
}

function ArticleTitleEditor({content, onContentChange, onDelete}) {
    return (
        <form>
            <div className="grid w-full items-center gap-4">
                <div className="flex flex-row items-center space-x-2">
                    <Input
                        id="title"
                        value={content.text}
                        onChange={(e) =>
                            onContentChange({
                                ...content,
                                text: e.target.value,
                            })
                        }
                        placeholder="Title text"
                        className={getTitleClassName(content.type)}
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                className="w-[120px] max-h-fit flex items-center justify-center"
                                variant="outline"
                                aria-label="Select title type">
                                <Edit2 className="mr-2 h-4 w-4"/>
                                {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem
                                onClick={() =>
                                    onContentChange({
                                        ...content,
                                        type: "title",
                                    })
                                }
                            >
                                Title
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() =>
                                    onContentChange({
                                        ...content,
                                        type: "subtitle",
                                    })
                                }
                            >
                                Subtitle
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() =>
                                    onContentChange({
                                        ...content,
                                        type: "heading",
                                    })
                                }
                            >
                                Heading
                            </DropdownMenuItem>
                          <Separator/>
                           <DropdownMenuItem
                                onClick={onDelete}
                                className="text-destructive"
                            >
                                Delete
                                <BsTrashFill/>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </form>
    );
}

const ArticleTitleContainer = {
    Editor: ArticleTitleEditor,
    defaultContent: articleTitleDefaultContent,
};

export {ArticleTitleContainer};
