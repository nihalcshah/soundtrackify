import React from "react";
import { useRef, useEffect, useState } from 'react';
import "./index.css"
import { useNavigate } from "react-router-dom";
import SpotifyWebApi from "spotify-web-api-js";
import { useCookies } from 'react-cookie';

const spotify = new SpotifyWebApi()

function getArtistString(artistArr) {
    let artistNames = ""
    for (let ind in artistArr) {
        artistNames += artistArr[ind]['name'] + ", "
    }
    return artistNames.slice(0, artistNames.length - 2);
}

const baseTrack = {
    "name": "",
    "album": {
        "href": "",
        "images": [
            "",
            "",
            ""
        ],
        "name": ""
    },
    "artists": [
        "",
        "",
        ""
    ],
}

const baseArtist = {
    "name": "",
    "genres": ["", ""],
    "images": [
        "",
        "",
        ""
    ],
    "popularity": 0
}

function play() {
    spotify.play().then(
        function (data) {
            console.log(data)
        }
    )
}

function pause() {
    spotify.pause().then(
        function (data) {
            console.log(data)
        }
    )
}

function skipToPrevious() {
    spotify.skipToPrevious().then(
        function (data) {
            console.log(data)
        }
    )
}

function skipToNext() {
    spotify.skipToNext().then(
        function (data) {
            console.log(data)
        }
    )
}


function Stats() {
    const navigate = useNavigate()
    const [user, setUser] = useState("")
    const [spotifyConst, setSpotify] = useState("")
    const [cookies, setCookies] = useCookies(['token'])
    const [recentlyPlayed, setRecentlyPlayed] = useState([
        { "track": baseTrack },
        { "track": baseTrack },
        { "track": baseTrack }
    ])
    const [currentlyPlaying, setCurrentlyPlaying] = useState({
        "item": baseTrack,
        "is_playing": ""
    })
    const [topArtists, setTopArtists] = useState({
        "items": [baseArtist, baseArtist, baseArtist]
    })
    const [weeksTopArtists, setWeekTopArtists] = useState({
        "items": [baseArtist, baseArtist, baseArtist]
    })
    const [monthsTopArtists, setMonthsTopArtists] = useState({
        "items": [baseArtist, baseArtist, baseArtist]
    })
    const [yearTopArtists, setYearsTopArtists] = useState({
        "items": [baseArtist, baseArtist, baseArtist]
    })
    const [weekTopTracks, setWeekTopTracks] = useState({
        "items": [baseTrack, baseTrack, baseTrack]
    })
    const [monthsTopTrack, setMonthsTopTracks] = useState({
        "items": [baseTrack, baseTrack, baseTrack]
    })
    const [yearsTopTrack, setYearsTopTracks] = useState({
        "items": [baseTrack, baseTrack, baseTrack]
    })

    if (!cookies.token) {
        navigate("/")
    }
    useEffect(() => {
        if (cookies.token) {
            spotify.setAccessToken(cookies.token)
            spotify.getMe().then((spuser) => {
                setUser(spuser)
            });
            spotify.getMyRecentlyPlayedTracks().then(
                function (data) {
                    setRecentlyPlayed(data['items'].slice(0, 6))
                    console.log(data['items'])
                }
            )
            spotify.getMyTopArtists().then(
                function (data) {
                    setTopArtists(data)
                }
            )
            spotify.getMyTopArtists({ "time_range": "short_term" }).then(
                function (data) {
                    setWeekTopArtists(data)
                }
            )
            spotify.getMyTopArtists({ "time_range": "medium_term" }).then(
                function (data) {
                    setMonthsTopArtists(data)
                }
            )
            spotify.getMyTopArtists({ "time_range": "long_term" }).then(
                function (data) {
                    setYearsTopArtists(data)
                }
            )
            spotify.getMyTopTracks({ "time_range": "short_term" }).then(
                function (data) {
                    setWeekTopTracks(data)
                }
            )
            spotify.getMyTopTracks({ "time_range": "medium_term" }).then(
                function (data) {
                    setMonthsTopTracks(data)
                }
            )
            spotify.getMyTopTracks({ "time_range": "long_term" }).then(
                function (data) {
                    
                    for(let i = 0; i<data['items'].length; i++){
                        console.log(data['items'][i])
                        if(data['items'][i]['name']==""){
                            data['items'].splice(i,1)
                        }
                    }
                    console.log("time",data)
                    setYearsTopTracks(data)
                }
            )
            // console.log(sp)
            spotify.getMyCurrentPlayingTrack().then(
                function (data) {
                    setCurrentlyPlaying(data)
                    console.log(data)
                }
            )
            const interval = setInterval(() => {
                spotify.getMyCurrentPlayingTrack().then(
                    function (data) {
                        setCurrentlyPlaying(data)
                    }
                )
                spotify.getMyRecentlyPlayedTracks().then(
                    function (data) {
                        setRecentlyPlayed(data['items'].slice(0, 6))
                    }
                )
                if(!cookies['token']){
                    navigate("/")
                }
            }, 1000);

            //Clearing the interval
            return () => clearInterval(interval);

        } else {
            navigate("/")
        }
    }, []);
    return (
        <div className="h-screen relative montserrat">
            <div id="artist-modal" tabindex="-1" class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
                <div class="relative w-full max-w-2xl max-h-full">
                    <div class="relative bg-white rounded-lg shadow">
                        <div class="flex items-center justify-between p-5 border-b rounded-t dark:border-gray-600">
                            <ul className="flex font-medium uppercase font-bold" id="myTab" data-tabs-toggle="#myTabContent" role="tablist">
                                <li className=" rounded-xl font-bold w-full" role="presentation">
                                    <button className="inline-block p-4 w-full rounded-t-lg uppercase tab" id="weeks-tab" data-tabs-target="#weeks" type="button" role="tab" aria-controls="weeks" aria-selected="true">Last 4 Weeks</button>
                                </li>
                                <li className="font-bold w-full" role="presentation">
                                    <button className="inline-block p-4 w-full rounded-t-lg uppercase tab " id="months-tab" data-tabs-target="#months" type="button" role="tab" aria-controls="months" aria-selected="false">Last 6 Months</button>
                                </li>
                                <li className="font-bold w-full" role="presentation">
                                    <button className="inline-block p-4 w-full rounded-t-lg uppercase tab my-auto align-items-center" id="years-tab" data-tabs-target="#years" type="button" role="tab" aria-controls="years" aria-selected="false">All Time</button>
                                </li>
                            </ul>
                            <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="artist-modal">
                                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span class="sr-only">Close modal</span>
                            </button>
                        </div>
                        <div class="p-6 ">
                            <div className="hidden space-y-6 h-64 overflow-y-scroll p-2" id="weeks" role="tabpanel" aria-labelledby="weeks-tab">
                                {
                                    weeksTopArtists["items"].map((artistObject, ind) =>
                                        <div className="p-1 pt-0 m-2 flex rounded-xl shadow-xl">
                                            <div className="mx-4 my-auto text-lg font-bold">{ind}</div>
                                            <div className="my-auto shrink-0">
                                                <img className="w-8 block aspect-square rounded-xl" src={artistObject["images"][0]['url']} />
                                            </div>
                                            <div className="my-auto p-2">
                                                <h1 className="font-semibold text-ellipsis line-clamp-1">{artistObject["name"]}</h1>
                                                <h1 className="font text-sm text-clip line-clamp-1">{artistObject["genres"][0]}</h1>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                            <div className="hidden space-y-6 h-64 overflow-y-scroll p-2" id="months" role="tabpanel" aria-labelledby="months-tab">
                                {
                                    monthsTopArtists["items"].map((artistObject, ind) =>
                                        <div className="p-1 pt-0 m-2 flex rounded-xl shadow-xl">
                                            <div className="mx-4 my-auto text-lg font-bold">{ind}</div>
                                            <div className="my-auto shrink-0">
                                                <img className="w-8 block aspect-square rounded-xl" src={artistObject["images"][0]['url']} />
                                            </div>
                                            <div className="my-auto p-2">
                                                <h1 className="font-semibold text-ellipsis line-clamp-1">{artistObject["name"]}</h1>
                                                <h1 className="font text-sm text-clip line-clamp-1">{artistObject["genres"][0]}</h1>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                            <div className="hidden space-y-6 h-64 overflow-y-scroll p-2" id="years" role="tabpanel" aria-labelledby="years-tab">
                                {
                                    yearTopArtists["items"].map((artistObject, ind) =>
                                        <div className="p-1 pt-0 m-2 flex rounded-xl shadow-xl">
                                            <div className="mx-4 my-auto text-lg font-bold">{ind}</div>
                                            <div className="my-auto shrink-0">
                                                <img className="w-8 block aspect-square rounded-xl" src={artistObject["images"][0]['url']} />
                                            </div>
                                            <div className="my-auto p-2">
                                                <h1 className="font-semibold text-ellipsis line-clamp-1">{artistObject["name"]}</h1>
                                                <h1 className="font text-sm text-clip line-clamp-1">{artistObject["genres"][0]}</h1>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="track-modal" tabindex="-1" class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
                <div class="relative w-full max-w-2xl max-h-full">
                    <div class="relative bg-white rounded-lg shadow">
                        <div class="flex items-center justify-between p-5 border-b rounded-t dark:border-gray-600">
                            <ul className="flex font-medium uppercase font-bold" id="myTab" data-tabs-toggle="#myTabContent" role="tablist">
                                <li className=" rounded-xl font-bold w-full" role="presentation">
                                    <button className="inline-block p-4 w-full rounded-t-lg uppercase tab" id="weeks-track-tab" data-tabs-target="#weeks-track" type="button" role="tab" aria-controls="weeks-track" aria-selected="true">Last 4 Weeks</button>
                                </li>
                                <li className="font-bold w-full" role="presentation">
                                    <button className="inline-block p-4 w-full rounded-t-lg uppercase tab " id="months-track-tab" data-tabs-target="#months-track" type="button" role="tab" aria-controls="months-track" aria-selected="false">Last 6 Months</button>
                                </li>
                                <li className="font-bold w-full" role="presentation">
                                    <button className="inline-block p-4 w-full rounded-t-lg uppercase tab my-auto align-items-center" id="years-track-tab" data-tabs-target="#years-track" type="button" role="tab" aria-controls="years-track" aria-selected="false">All Time</button>
                                </li>
                            </ul>
                            <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="track-modal">
                                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span class="sr-only">Close modal</span>
                            </button>
                        </div>
                        <div class="p-6 ">
                            <div className="hidden space-y-6 h-64 overflow-y-scroll p-2" id="weeks-track" role="tabpanel" aria-labelledby="weeks-track-tab">
                                {
                                    weekTopTracks['items'].map((trackObject, ind) =>
                                        <div className="p-1 pt-0 m-2 flex rounded-xl shadow-xl">
                                            <div className="mx-4 my-auto text-lg font-bold">{ind + 1}</div>
                                            <div className="my-auto shrink-0">
                                                <img className="w-8 block aspect-square rounded-xl" src={trackObject['album']['images'][0]['url']} />
                                            </div>
                                            <div className="my-auto p-2">
                                                <h1 className="font-semibold text-ellipsis line-clamp-1">{trackObject["name"]}</h1>
                                                <h1 className="font text-sm text-clip line-clamp-1">{trackObject['artists'][0]['name']}</h1>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                            <div className="hidden space-y-6 h-64 overflow-y-scroll p-2" id="months-track" role="tabpanel" aria-labelledby="months-track-tab">
                                {
                                    monthsTopTrack['items'].map((trackObject, ind) =>
                                        <div className="p-1 pt-0 m-2 flex rounded-xl shadow-xl">
                                            <div className="mx-4 my-auto text-lg font-bold">{ind + 1}</div>
                                            <div className="my-auto shrink-0">
                                                <img className="w-8 block aspect-square rounded-xl" src={trackObject['album']['images'][0]['url']} />
                                            </div>
                                            <div className="my-auto p-2">
                                                <h1 className="font-semibold text-ellipsis line-clamp-1">{trackObject["name"]}</h1>
                                                <h1 className="font text-sm text-clip line-clamp-1">{trackObject['artists'][0]['name']}</h1>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                            <div className="hidden space-y-6 h-64 overflow-y-scroll p-2" id="years-track" role="tabpanel" aria-labelledby="years-track-tab">
                                {
                                    yearsTopTrack['items'].map((trackObject, ind) =>
                                    <div className="p-1 pt-0 m-2 flex rounded-xl shadow-xl">
                                        <div className="mx-4 my-auto text-lg font-bold">{ind + 1}</div>
                                        <div className="my-auto shrink-0">
                                            <img className="w-8 block aspect-square rounded-xl" src={trackObject['album']['images'][0]['url']} />
                                        </div>
                                        <div className="my-auto p-2">
                                            <h1 className="font-semibold text-ellipsis line-clamp-1">{trackObject["name"]}</h1>
                                            <h1 className="font text-sm text-clip line-clamp-1">{trackObject['artists'][0]['name']}</h1>
                                        </div>
                                    </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex w-full p-5 ">
                <div className="flex">
                    <img className="w-12 h-12 aspect-square" src="./soundtrackify.png" />
                </div>
                <div className="my-auto uppercase flex text-center w-full justify-end font-semibold ">
                    <a className="p-3" href="./">Home</a>
                    <div className="p-3 pb-1" href="./lab">
                        <a className="flex" id="dropdownHoverButton" data-dropdown-toggle="dropdownHover" data-dropdown-trigger="hover" >
                            Lab
                            <svg xmlns="http://www.w3.org/2000/svg" className="my-auto px-1" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                            </svg>
                        </a>
                        <div id="dropdownHover" className="divide-y-2 grid divide-black hidden text-center" aria-labelledby="dropdownHoverButton">
                            <a className="p-2 flex my-auto hover:bg-black hover:text-white" href="./lab">Lab</a>
                            <a className="p-2 flex my-auto hover:bg-black hover:text-white" href="./stats">Stats</a>
                            <a className="p-2 flex my-auto hover:bg-black hover:text-white" href="./">Taste</a>
                            <a className="p-2 flex my-auto hover:bg-black hover:text-white" href="">Design</a>
                        </div>
                    </div>
                    <a className="p-3" href="./about">About</a>

                </div>
            </div>
            <div className="grid grid-cols-2 gap-x-8 px-12 py-6 pt-3">
                <div className="">
                    <h1 className="font-bold text-7xl mb-2">Your Stats</h1>
                    <h4 className="font-medium text-2xl">Discover the World of Music through Statistics catered to your personal taste</h4>
                    <div className="mt-8 p-4 shadow-xl rounded-xl">
                        <h1 className="font-bold text-2xl">Recently Played</h1>
                        <div className="py-3 columns-2">
                            {
                                recentlyPlayed.map((trackObject, ind) =>
                                    <div className="p-2 flex rounded-xl shadow-xl">
                                        <div className="my-auto shrink-0">
                                            {
                                                trackObject['track']['album']['images'] ?
                                                    <img className="w-12 block aspect-square rounded-xl" src={trackObject['track']['album']['images'][0]['url']} />
                                                    :
                                                    <div className="w-12 aspect-square rounded-xl"></div>
                                            }
                                        </div>
                                        <div className="p-2">
                                            <h1 className="font-semibold text-ellipsis line-clamp-1">{trackObject['track']['name']}</h1>
                                            <h1 className="font text-sm text-clip line-clamp-1">{getArtistString(trackObject['track']['artists'])}</h1>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
                <div>
                    <div className="">
                        {
                            currentlyPlaying['item'] ?
                                <div className="flex p-2 rounded-xl bg-neutral-700 text-white w-2/3">
                                    <img className="my-auto p-1 w-24 shrink-0 rounded-xl" src={currentlyPlaying['item']['album']['images'][2]['url']} />
                                    <div className="p-3">
                                        <h1 className="text-xl font-bold line-clamp-1">{currentlyPlaying['item']['name']}</h1>
                                        <div className="flex w-full">
                                            <h1 className="text-lg font-semibold italic line-clamp-1 mr-3">{getArtistString(currentlyPlaying['item']['artists'])}</h1>
                                            <h1 className="text-lg font-semibold italic line-clamp-1">{currentlyPlaying['item']['album']['name']}</h1>
                                        </div>
                                        <div className="pt-2 grid grid-cols-3 gap-x-6 w-1/3">
                                            <button className="" onClick={skipToPrevious}>
                                                <div className="w-8 hover:bg-white object-contain aspect-square bg-neutral-200 rounded-lg p-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="text-black rotate-180" viewBox="0 -960 960 960"><path d="M104-240v-480l346 240-346 240Zm407 0v-480l346 240-346 240Z" /></svg>
                                                </div>
                                            </button>
                                            {currentlyPlaying['is_playing'] ?
                                                <button className="" onClick={pause}>
                                                    <div className="w-8 hover:bg-white object-contain aspect-square bg-neutral-200 rounded-lg p-1">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="text-black rotate-180" viewBox="0 -960 960 960"><path d="M555-200v-560h175v560H555Zm-325 0v-560h175v560H230Z" /></svg>
                                                    </div>
                                                </button> :
                                                <button className="" onClick={play}>
                                                    <div className="w-8 hover:bg-white object-contain aspect-square bg-neutral-200 rounded-lg p-1">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="text-black" viewBox="0 -960 960 960"><path d="M320-203v-560l440 280-440 280Z" /></svg>
                                                    </div>
                                                </button>
                                            }
                                            <button className="" onClick={skipToNext}>
                                                <div className="w-8 hover:bg-white object-contain aspect-square bg-neutral-200 rounded-lg p-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="text-black " viewBox="0 -960 960 960"><path d="M104-240v-480l346 240-346 240Zm407 0v-480l346 240-346 240Z" /></svg>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className="flex p-2 rounded-xl bg-neutral-700 text-white w-2/3">
                                    <img className="my-auto p-1 w-24 shrink-0 rounded-xl" src={recentlyPlayed[0]['track']['album']['images'][0]['url']} />
                                    <div className="p-3">
                                        <h1 className="text-xl font-bold line-clamp-1">{recentlyPlayed[0]['track']['name']}</h1>
                                        <div className="flex w-full">
                                            <h1 className="text-lg font-semibold italic line-clamp-1 mr-3">{getArtistString(recentlyPlayed[0]['track']['artists'])}</h1>
                                            <h1 className="text-lg font-semibold italic line-clamp-1">{recentlyPlayed[0]['track']['album']['name']}</h1>
                                        </div>
                                        <div className="pt-2 grid grid-cols-3 gap-x-6 w-2/3">
                                            <button className="" onClick={skipToPrevious}>
                                                <div className="w-8 hover:bg-white object-contain aspect-square bg-neutral-200 rounded-lg p-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="text-black rotate-180" viewBox="0 -960 960 960"><path d="M104-240v-480l346 240-346 240Zm407 0v-480l346 240-346 240Z" /></svg>
                                                </div>
                                            </button>
                                            <button className="" onClick={play}>
                                                <div className="w-8 hover:bg-white object-contain aspect-square bg-neutral-200 rounded-lg p-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="text-black" viewBox="0 -960 960 960"><path d="M320-203v-560l440 280-440 280Z" /></svg>
                                                </div>
                                            </button>
                                            <button className="" onClick={skipToNext}>
                                                <div className="w-8 hover:bg-white object-contain aspect-square bg-neutral-200 rounded-lg p-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="text-black " viewBox="0 -960 960 960"><path d="M104-240v-480l346 240-346 240Zm407 0v-480l346 240-346 240Z" /></svg>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                        }


                    </div>
                    <div className="rounded-xl shadow-xl mt-12 ">
                        <div className="mb-4 bg-neutral-800 rounded-t-xl">
                            <ul className="flex  font-medium text-center uppercase w-full columns-2" id="myTab" data-tabs-toggle="#myTabContent" role="tablist">
                                <li className=" rounded-xl font-bold w-full" role="presentation">
                                    <button className="inline-block p-4 w-full rounded-t-lg uppercase tab" id="profile-tab" data-tabs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="true">Artists</button>
                                </li>
                                <li className="font-bold w-full" role="presentation">
                                    <button className="inline-block p-4 w-full rounded-t-lg uppercase tab " id="dashboard-tab" data-tabs-target="#dashboard" type="button" role="tab" aria-controls="dashboard" aria-selected="false">Songs</button>
                                </li>
                            </ul>
                        </div>
                        <div id="myTabContent" className="p-4 w-full">
                            <div className="hidden p-2 flex" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                                <div className="grid grid-cols-2 gap-x-5 my-auto">
                                    <div className=" w-52 rounded-xl shadow-xl aspect-square">
                                        <img src={topArtists['items'][0]["images"][0]['url']} className="rounded-t-xl w-full h-3/4 object-cover aspect-square overflow-hidden" />
                                        <div className="font-bold p-2 px-4 my-auto w-full text-3xl flex">
                                            <div className="text-3xl my-auto mr-3">1</div>
                                            <div className="text-right w-full">
                                                <div className="text-sm ">{topArtists['items'][0]["name"]}</div>
                                                <div className="text-xs font-light">{topArtists['items'][0]["genres"][0]}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="m-auto w-full">
                                        {
                                            topArtists['items'].slice(1, 3).map((artistObject, ind) =>
                                                <div className="p-1 pt-0 m-2 flex rounded-xl shadow-xl">
                                                    <div className="mx-4 my-auto text-lg font-bold">{ind + 2}</div>
                                                    <div className="my-auto shrink-0">
                                                        <img className="w-8 block aspect-square rounded-xl" src={artistObject["images"][0]['url']} />
                                                    </div>
                                                    <div className="my-auto p-2">
                                                        <h1 className="font-semibold text-ellipsis line-clamp-1">{artistObject["name"]}</h1>
                                                        <h1 className="font text-sm text-clip line-clamp-1">{artistObject["genres"][0]}</h1>
                                                    </div>
                                                </div>

                                            )
                                        }
                                        <button data-modal-target="artist-modal" data-modal-toggle="artist-modal" className="w-full rounded-xl p-2 m-2 mt-3 flex text-center bg-black text-lime-50 hover:bg-neutral-700 ">
                                            <h1 className="text-center w-full font-bold ">View More</h1>
                                        </button>

                                    </div>
                                </div>
                            </div>
                            <div className="hidden p-2 flex" id="dashboard" role="tabpanel" aria-labelledby="dashboard-tab">
                                <div className="grid grid-cols-2 gap-x-5 my-auto">
                                    <div className=" w-52 rounded-xl shadow-xl aspect-square">
                                        <img src={weekTopTracks['items'][0]['album']['images'][0]['url']} className="rounded-t-xl w-full h-3/4 object-cover aspect-square overflow-hidden" />
                                        <div className="font-bold p-2 px-4 my-auto w-full text-3xl flex">
                                            <div className="text-3xl my-auto mr-3">1</div>
                                            <div className="text-right w-full">
                                                <div className="text-sm ">{weekTopTracks['items'][0]["name"]}</div>
                                                <div className="text-xs font-light">{weekTopTracks['items'][0]['artists'][0]['name']}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="m-auto w-full">
                                        {
                                            weekTopTracks['items'].slice(1, 3).map((trackObject, ind) =>
                                                <div className="p-1 pt-0 m-2 flex rounded-xl shadow-xl">
                                                    <div className="mx-4 my-auto text-lg font-bold">{ind + 2}</div>
                                                    <div className="my-auto shrink-0">
                                                        <img className="w-8 block aspect-square rounded-xl" src={trackObject['album']['images'][0]['url']} />
                                                    </div>
                                                    <div className="my-auto p-2">
                                                        <h1 className="font-semibold text-ellipsis line-clamp-1">{trackObject["name"]}</h1>
                                                        <h1 className="font text-sm text-clip line-clamp-1">{trackObject['artists'][0]['name']}</h1>
                                                    </div>
                                                </div>

                                            )
                                        }
                                        <button data-modal-target="track-modal" data-modal-toggle="track-modal" className="w-full rounded-xl p-2 m-2 mt-3 flex text-center bg-black text-lime-50 hover:bg-neutral-700 ">
                                            <h1 className="text-center w-full font-bold ">View More</h1>
                                        </button>

                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>

    );
}
export default Stats;