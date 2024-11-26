import React from "react";
import {Card, CardHeader, CardContent, CardDescription} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {FaRegComment, FaRetweet, FaRegHeart, FaShareAlt, FaLink} from "react-icons/fa";
import {Separator} from "@/components/ui/separator";
import {PiXLogoBold} from "react-icons/pi";
import {FaSyncAlt} from "react-icons/fa";
import TwitterCardSkeleton from "@/components/pages/thirdPage/TwitterSceletion";

export const getCurrentTimestamp = () => {
    const now = new Date();
    const options = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    };
    return now.toLocaleString('en-US', options).replace(',', ' ·');
};

function TwitterCard({articalData}) {
    const [loading, setLoading] = React.useState(true);
    const [tweet, setTweet] = React.useState({});

    const loadTweet = async () => {
        console.log("Artical Data Twitter");
        console.log(JSON.stringify(articalData));
        setLoading(true);
        try {
            console.log("Artical Data");
            const response = await fetch(
                'http://localhost:8000/get_tweet',
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(articalData)
                }
            );
            if (!response.ok) {
                throw new Error("Failed to fetch media data");
            }
            const data = await response.json();
            const tweetBody = {
                user: "EFahrer.de",
                handle: "@efahrer",
                content: data.tweet,
                timestamp: getCurrentTimestamp(),
                link: "efahrer.chip.de/news"
            }
            setTweet(tweetBody);
        } catch
            (error) {
            console.error("Error fetching media data:", error);
        } finally {
            setLoading(false);
        }
    }

    React.useEffect(() => {
        loadTweet();
    }, []);

    // Function to render content with hashtags styled
    const renderContent = (content) => {
        const words = content.split(" ");
        return words.map((word, index) => {
            if (word.startsWith("#")) {
                return (
                    <span key={index} className="cursor-pointer hover:underline"
                          style={{color: "#3B82F6"}}
                    >
                        {word + " "}
                    </span>
                );
            }
            return <span key={index}> {word} </span>;
        });
    };
    if (loading) {
        return <TwitterCardSkeleton/>;
    }

    return (
        <Card className="max-w-xl w-full bg-white rounded-lg shadow-lg border">
            <CardHeader className="p-4 flex items-start">
                <div className="flex flex-row">
                    {/* Avatar */}
                    <Avatar>
                        <AvatarImage src="http://localhost:8000/content/Efahrer.png"/>
                        <AvatarFallback>EF</AvatarFallback>
                    </Avatar>
                    {/* User Info */}
                    <div className="pl-2">
                        <div className="font-semibold text-gray-900">{tweet.user}</div>
                        <div className="text-sm text-gray-500">{tweet.handle}</div>
                    </div>
                </div>
            </CardHeader>

            {/* Content */}
            <CardContent className="px-4 pb-4">
                <CardDescription className="text-gray-800 text-base">
                    {renderContent(tweet.content)}
                </CardDescription>
                <div className="text-sm text-gray-500 mt-2 flex items-center space-x-2">
                    <span>{tweet.timestamp}</span>
                    <a
                        href={`https://${tweet.link}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 flex items-center hover:underline">
                        <FaLink className="mr-1"/>
                        {tweet.link}
                    </a>
                </div>
            </CardContent>

            <Separator/>

            {/* Actions */}
            <div className="flex justify-between px-6 py-3 text-gray-500">
                <div className="flex space-x-8">
                        <span className="flex items-center space-x-2 cursor-pointer hover:text-blue-500">
                            <FaRegComment className="h-5 w-5"/>
                            <span>123k</span>
                        </span>
                    <span className="flex items-center space-x-2 cursor-pointer hover:text-blue-500">
                            <FaRetweet className="h-5 w-5"/>
                            <span>32k</span>
                        </span>
                    <span className="flex items-center space-x-2 cursor-pointer hover:text-blue-500">
                            <FaRegHeart className="h-5 w-5"/>
                            <span>321k</span>
                        </span>
                </div>
                <span className="cursor-pointer hover:text-blue-500">
                        <FaShareAlt className="h-5 w-5"/>
                    </span>
            </div>
            <div className="border-t border-gray-200 p-4 flex justify-between">
                <Button className="mr-2"
                        onClick={loadTweet}
                        variant="secondary">
                    <FaSyncAlt/>
                </Button>
                <Button
                    className="bg-black text-white font-semibold py-2 rounded-md hover:bg-gray-800 hover:text-gray-500 flex-grow">
                    Post on
                    <PiXLogoBold/>
                </Button>
            </div>
        </Card>
    );
}

export default TwitterCard;

