import {ScrollArea} from "@/components/ui/scroll-area";
import {Skeleton} from '@/components/ui/skeleton';
import ArticalContent from "@/components/pages/secondPage/artical/BigCompunent";
import {Button} from "@/components/ui/button";
import {Edit2} from "lucide-react";
import {
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenu,
    DropdownMenuSeparator,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent
} from "@/components/ui/dropdown-menu";
import React from "react";


function ArticalEditColumn({
                               artical, media, setArtical, loading,
                           }) {

    const [selectedMedia, setSelectedMedia] = React.useState(
        media[Math.floor(Math.random() * media.length)]
    );

    if (loading) {
        return (<div className="w-full rounded-md border m-2">
            {/* Image Skeleton */}
            <div className="relative w-full h-48 overflow-hidden">
                <Skeleton className="object-cover w-full h-full"/>
            </div>

            {/* Title Skeleton */}
            <div className="p-4">
                <Skeleton className="w-full h-8 mb-2"/>
            </div>

            {/* Components Skeleton */}
            <div className="p-4 space-y-4">
                {Array.from({length: 3}).map((_, idx) => (<div key={idx} className="mb-2 space-y-2">
                    <Skeleton className="h-6 w-3/4"/>
                    <Skeleton className="h-4 w-full"/>
                    <Skeleton className="h-4 w-5/6"/>
                </div>))}
            </div>
        </div>);
    }

    return (<ScrollArea className="w-full rounded-md border m-2">
        <div className="relative w-full h-48 overflow-hidden">
            <img
                src={selectedMedia.url}
                alt="Main"
                className="object-cover w-full h-full"
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        className="absolute top-4 right-4"
                        onClick={() => alert('Edit button clicked')}
                    >
                        <Edit2/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <span>Select Image</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                {/* media list */}
                                {media.map((mediaItem) => (
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
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
        <div className="p-4">
            <input
                type="text"
                value={artical.title}
                onChange={(e) => setArtical({...artical, title: e.target.value})}
                className="w-full p-2 text-2xl font-bold border-b-2 focus:outline-none bg-background"
                placeholder="Enter title here"
            />
        </div>
        <div className="p-4">
            {artical.content.map((component) => (<ArticalContent
                content={component}
                media={media}
            />))}
        </div>
    </ScrollArea>);
}

export default ArticalEditColumn;