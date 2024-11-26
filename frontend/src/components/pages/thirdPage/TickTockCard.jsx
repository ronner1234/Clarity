import React from "react";
import {Card, CardHeader, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {FaRegHeart, FaRegComment, FaShareAlt, FaSyncAlt} from "react-icons/fa";
import {PiTiktokLogoBold, PiXLogoBold} from "react-icons/pi";

function TikTokCard() {
    const ticktock = {
        user: "EFahrer.de",
        handle: "@efahrer",
        caption: "Tesla just released their new car #ModelÜ #Car #Efahre. Learn more in or atical see efahrer.de/aka124",
        video: "http://localhost:8000/content/tiktok.mp4"
    };

    // Function to render styled hashtags in the caption
    const renderCaption = (content) => {
        const words = content.split(" ");
        return words.map((word, index) => {
            if (word.startsWith("#")) {
                return (
                    <span key={index} className="text-blue-500 cursor-pointer hover:underline">
                        {word}
                    </span>
                );
            }
            return <span key={index}> {word} </span>;
        });
    };

    return (
        <Card className="max-w-md w-full bg-black text-white rounded-lg shadow-lg overflow-hidden relative">
            {/* Video Section */}
            <div className="relative h-96 bg-gray-900">
                <video
                    src={ticktock.video}
                    className="w-full h-full object-cover"
                    controls
                    autoPlay
                    loop
                ></video>
                {/* Overlay Buttons */}
                <div className="absolute top-4 right-4 space-y-4">
                    <div className="flex flex-col items-center text-white">
                        <FaRegHeart className="h-8 w-8 cursor-pointer hover:text-pink-500"/>
                        <span>321k</span>
                    </div>
                    <div className="flex flex-col items-center text-white">
                        <FaRegComment className="h-8 w-8 cursor-pointer hover:text-blue-500"/>
                        <span>123k</span>
                    </div>
                    <div className="flex flex-col items-center text-white">
                        <FaShareAlt className="h-8 w-8 cursor-pointer hover:text-green-500"/>
                        <span>32k</span>
                    </div>
                </div>
            </div>

            {/* User Info */}
            <CardHeader className="p-4 flex flex-row items-center">
                <Avatar className="flex-shrink-0">
                        <AvatarImage src="http://localhost:8000/content/Efahrer.png"/>
                    <AvatarFallback>EF</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-end pl-2">
                    <div className="font-semibold">{ticktock.user}</div>
                    <div className="text-sm text-gray-400">{ticktock.handle}</div>
                </div>
            </CardHeader>


            {/* Caption */}
            <CardContent className="px-4 pb-4">
                <div className="text-base">{renderCaption(ticktock.caption)}</div>
            </CardContent>

            {/* Post Button */}
            <div className="p-4 flex justify-center">
                <Button className="mr-2"
                        variant="secondary">
                    <FaSyncAlt/>
                </Button>
                <Button
                    className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white font-semibold py-2 px-4 rounded-md hover:opacity-90 flex-grow"
                >
                    <span>Post on</span>
                    <PiTiktokLogoBold className="text-lg"/>
                </Button>
            </div>
        </Card>
    );
}

export default TikTokCard;
