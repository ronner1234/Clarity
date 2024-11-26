import React from 'react';
import TwitterCard from "@/components/pages/thirdPage/TwitterCard";
import TikTokCard from "@/components/pages/thirdPage/TickTockCard";
import PodcastCard from "@/components/pages/thirdPage/PodcarsCard";

function ThirdPage({articalData}) {
    return (
        <div className="flex flex-col items-center w-96 m-2">
            <div className="w-full m-2">
                <TwitterCard
                    articalData={articalData}
                />
            </div>
            <div className="w-full m-2">
                <PodcastCard
                    articalData={articalData}
                />
            </div>
            <div className="w-full m-2">
                <TikTokCard/>
            </div>
        </div>
    );
}

export default ThirdPage;