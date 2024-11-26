import React from "react";
import {Card, CardHeader, CardContent, CardDescription} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {FaSyncAlt} from "react-icons/fa";
import {Separator} from "@/components/ui/separator";
import {PiApplePodcastsLogoFill} from "react-icons/pi";
import PodcastSceletion from "@/components/pages/thirdPage/PodcastSceletion";
import {getCurrentTimestamp} from "@/components/pages/thirdPage/TwitterCard";

function PodcastCard({articalData}) {
    const [loading, setLoading] = React.useState(true);
    const [podcasts, setPodcasts] = React.useState({});

    const loadPodcast = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                'http://localhost:8000/get_podcast',
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(articalData)
                });
            if (!response.ok) {
                throw new Error("Failed to fetch media data");
            }
            const data = await response.json();
            console.log("Podcast Data");
            console.log(data);
            const podcastBody = {
                podcastsName: "E-Mobility whispers",
                podcastImage: "http://localhost:8000/content/PodCast.png",
                mp3: data.mp3_link,
                title: data.title,
                timestamp: getCurrentTimestamp(),
            }
            setPodcasts(podcastBody);
        } catch
            (error) {
            console.error("Error fetching media data:", error);
        } finally {
            setLoading(false);
        }
    }

    React.useEffect(() => {
        loadPodcast();
    }, []);

    if (loading) {
        return <PodcastSceletion/>;
    }

    return (
        <Card className="max-w-xl w-full bg-white rounded-lg shadow-lg border overflow-hidden">
            {/* Background image as cover */}
            <div
                className="w-full h-64 bg-cover bg-center rounded-t-lg"
                style={{backgroundImage: `url(${podcasts.podcastImage})`}}
            />

            <CardHeader className="p-4 flex items-start bg-white bg-opacity-80">
                <div className="pl-2">
                    <div className="font-semibold text-gray-900">{podcasts.title}</div>
                    <div className="text-sm text-gray-500">{podcasts.podcastsName}</div>
                </div>
            </CardHeader>

            {/* MP3 Audio player */}
            <CardContent className="p-4">
                <audio controls className="w-full rounded-md">
                    <source src={podcasts.mp3} type="audio/mp3"/>
                    Your browser does not support the audio element.
                </audio>
            </CardContent>

            <Separator/>

            {/* Bottom Action (Apple Podcasts Purple) */}
            <div className="p-4 flex justify-center">
                <Button
                    onClick={loadPodcast}
                    className="mr-2"
                    variant="secondary">
                    <FaSyncAlt/>
                </Button>
                <Button
                    className="bg-[#9b59b6] text-white font-semibold py-2 px-4 rounded-md hover:opacity-90 flex-grow">
                    <span>Drop Podcast</span>
                    <PiApplePodcastsLogoFill className="text-lg"/>
                </Button>
            </div>
        </Card>
    );
}

export default PodcastCard;
