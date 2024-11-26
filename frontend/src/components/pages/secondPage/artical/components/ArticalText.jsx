import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem} from "@/components/ui/dropdown-menu";
import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group";
import {Bold, Italic, Underline} from "lucide-react";
import {Edit2} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {BsTrashFill} from "react-icons/bs";

const COLORS = {
    red: "red",
    blue: "blue",
    orange: "orange",
    black: "black",
};

function getTextClassName(style) {
    let classes = "text-base";
    if (!style) return classes;

    if (style.color && COLORS[style.color]) {
        classes += ` text-${COLORS[style.color]}`;
    }
    if (style.bold) {
        classes += " font-bold";
    }
    if (style.italic) {
        classes += " italic";
    }
    if (style.underline) {
        classes += " underline";
    }
    return classes;
}


function ArticleTextEditor({content, onContentChange, onDelete}) {
    const handleStyleChange = (styleKey, value) => {
        console.log("Setting style", styleKey, "to", value); // Add this line for debugging
        onContentChange({
            ...content,
            style: {
                ...content.style,
                [styleKey]: value,
            },
        });
    };

    return (
        <form>
            <div className="grid w-full items-center gap-4">
                <div className="flex flex-row items-center space-x-2">
                    <Textarea
                        className={`${getTextClassName(content.style)} h-32 w-full`}
                        id="text"
                        placeholder="Type your text here."
                        value={content.text}
                        onChange={(e) =>
                            onContentChange({...content, text: e.target.value})
                        }
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                className="w-[120px] max-h-fit flex items-center justify-center"
                                variant="outline"
                                aria-label="Edit text style">

                                <Edit2 className="mr-2 h-4 w-4"/>
                                Edit Style
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <div className="px-4 py-2">
                                <Label className="mb-2 block text-sm font-medium">Formatting</Label>
                                <ToggleGroup
                                    type="multiple"
                                    value={Object.entries(content.style || {})
                                        .filter(([key, value]) => value === true)
                                        .map(([key]) => key)}
                                    onValueChange={(selected) => {
                                        const updatedStyle = {
                                            ...content.style, // Retain other styles like `color`
                                            bold: selected.includes("bold"),
                                            italic: selected.includes("italic"),
                                            underline: selected.includes("underline"),
                                        };

                                        onContentChange({
                                            ...content,
                                            style: updatedStyle,
                                        });
                                    }}
                                >
                                    <ToggleGroupItem value="bold" aria-label="Toggle bold">
                                        <Bold className="h-4 w-4"/>
                                    </ToggleGroupItem>
                                    <ToggleGroupItem value="italic" aria-label="Toggle italic">
                                        <Italic className="h-4 w-4"/>
                                    </ToggleGroupItem>
                                    <ToggleGroupItem value="underline" aria-label="Toggle underline">
                                        <Underline className="h-4 w-4"/>
                                    </ToggleGroupItem>
                                </ToggleGroup>
                            </div>
                            <div className="px-4 py-2">
                                <Label className="mb-2 block text-sm font-medium">Text Color</Label>
                                <div className="flex flex-wrap gap-2">
                                    {Object.keys(COLORS).map((color) => (
                                        <Button
                                            key={color}
                                            className={`h-6 w-6 rounded-full`}
                                            style={{backgroundColor: COLORS[color]}}
                                            onClick={() => handleStyleChange("color", color)}
                                            aria-label={`Set color to ${color}`}
                                        />
                                    ))}
                                </div>
                            </div>
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

const articleTextDefaultContent = {
    text: "This is a text",
    style: {
        color: "black", // Default color
        bold: false,
        italic: false,
        underline: false,
    },
};

const ArticleTextContainer = {
    Editor: ArticleTextEditor,
    Display: ({content}) => (
        <p className={getTextClassName(content.style)}>{content.text}</p>
    ),
    defaultContent: articleTextDefaultContent,
};

export {ArticleTextContainer};
