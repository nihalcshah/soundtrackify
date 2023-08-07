import React from "react";
import { useRef, useEffect, useState } from 'react';
import "./index.css"
import {useNavigate } from "react-router-dom";
import SpotifyWebApi from "spotify-web-api-js";
import { useCookies } from 'react-cookie';


export const getTokenFromUrl = () => {
    return window.location.hash
        .substring (1)
        .split('&')
        .reduce((initial, item)=>{
            //#accessToken=mysecretkey&name=somerandomname
            let parts = item.split("=");
            initial[parts[0]]= decodeURIComponent(parts[1])
            return initial
        }, {});
}  

const spotify = new SpotifyWebApi()

function Lab(){
    const [spotifyToken, setSpotifyToken] = useState("")
    const [user, setUser] = useState("")
    const [cookies, setCookies] = useCookies(['token'])
    const navigate = useNavigate()
    useEffect(() => {
        
        const token = getTokenFromUrl().access_token;
        window.location.hash = "";
        if (token){
            setCookies("token", token, {secure: true, maxAge: 3600})
            setSpotifyToken(token)
            spotify.setAccessToken(token)
            spotify.getMe().then((spuser) => {
                setUser(spuser)
            });
        }
        else if(cookies.token){
            setSpotifyToken(cookies.token)
            spotify.setAccessToken(cookies.token)
            spotify.getMe().then((spuser) => {
                setUser(spuser)
            });
        }else{
            navigate("/")
        }
    }, []);
    
    // console.log(user)

    return(
        <div className="h-screen relative montserrat">
            <div className="flex w-full p-5 ">
                <div className="flex flex-none rounded-full p-2 bg-neutral-800 text-white">
                    <img className="w-16 h-16 rounded-full my-auto mr-1" src={user && user['images'][1]['url']} />
                    <div className=" p-2 tracking-widest">
                        <h1 className="font-bold text-xl">Welcome</h1>
                        <h1 className="font-light text-sm">{user && user['display_name']}</h1>
                    </div>
                </div>
                <div className="my-auto uppercase flex w-full justify-end ">
                    <a className="p-3" href="./">Home</a>
                    <a className="p-3 text-emerald-400" href="./lab">Lab</a>
                    <a className="p-3" href="./about">About</a>
                </div>
            </div>
            <div className="grid my-auto grid-cols-3 place-content-center p-16 gap-x-12 ">
                <div className="p-4 rounded-xl shadow-xl bg-green-400 text-white">
                    <div className="h-5/6">
                        <h1 className="font-bold text-2xl">Your Stats</h1>
                        <div className="p-3 ">
                            <div className="flex py-1">
                                <h1 className="font-bold my-auto mr-4">1</h1>
                                <img src="./artists/swift.png" className="w-10 h-10 rounded-full object-cover my-auto mr-2" />
                                <div className="leading-1">
                                    <h1 className="font-bold text-lg leading-tight">Taylor Swift</h1>
                                    <h1 className="text-xs leading-tight font-semibold">Singer</h1>
                                </div>
                            </div>
                            <div className="flex py-1 opacity-80">
                                <h1 className="font-bold my-auto mr-3">2</h1>
                                <img src="./artists/weeknd.png" className="w-10 h-10 rounded-full object-cover my-auto mr-2" />
                                <div className="leading-1">
                                    <h1 className="font-bold text-lg leading-tight">The Weeknd</h1>
                                    <h1 className="text-xs leading-tight font-semibold">Alternative Pop</h1>
                                </div>
                            </div>
                            <div className="flex py-1 opacity-60">
                                <h1 className="font-bold my-auto mr-3">3</h1>
                                <img src="./artists/drake.png" className="w-10 h-10 rounded-full object-cover my-auto mr-2" />
                                <div className="leading-1">
                                    <h1 className="font-bold text-lg leading-tight">Drake</h1>
                                    <h1 className="text-xs leading-tight font-semibold">Rapper</h1>
                                </div>
                            </div>
                            <div className="flex py-1 opacity-40">
                                <h1 className="font-bold my-auto mr-3">4</h1>
                                <img src="./artists/neighborhood.png" className="w-10 h-10 rounded-full object-cover my-auto mr-2" />
                                <div className="leading-1">
                                    <h1 className="font-bold text-lg leading-tight ">The Neighborhood</h1>
                                    <h1 className="text-xs leading-tight font-semibold">Singer</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex">
                        <a href="./stats" className="mx-auto text-center p-2 mt-2 font-bold outline-white rounded-xl hover:bg-white hover:text-black border-4 border border-white">Explore</a>
                    </div>
                </div>
                <div className="p-5 rounded-xl shadow-xl bg-neutral-700 text-white relative">
                    <div className="h-5/6">
                        <h1 className="font-bold text-2xl">Your Taste</h1>
                        <div className="mt-1">
                            <div className="text-md">Identify the values that make up your music taste.</div>
                            <div className="grid grid-cols-3 align-content-center h-full place-content-center p-4">
                                <div className="mx-auto">
                                    <div className=" rounded-full w-10 h-10 inline-flex items-center justify-center m-auto outline outline-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="text-white w-6 aspect-square" fill="currentColor" height="48"  viewBox="0 -960 960 960" width="48"><path d="m187-551 106 45q18-36 38.5-71t43.5-67l-79-16-109 109Zm154 81 133 133q57-26 107-59t81-64q81-81 119-166t41-192q-107 3-192 41T464-658q-31 31-64 81t-59 107Zm229-96q-20-20-20-49.5t20-49.5q20-20 49.5-20t49.5 20q20 20 20 49.5T669-566q-20 20-49.5 20T570-566Zm-15 383 109-109-16-79q-32 23-67 43.5T510-289l45 106Zm326-694q9 136-34 248T705-418l-2 2-2 2 22 110q3 15-1.5 29T706-250L535-78l-85-198-170-170-198-85 172-171q11-11 25-15.5t29-1.5l110 22q1-1 2-1.5t2-1.5q99-99 211-142.5T881-877ZM149-325q35-35 85.5-35.5T320-326q35 35 34.5 85.5T319-155q-26 26-80.5 43T75-80q15-109 31.5-164t42.5-81Zm42 43q-14 15-25 47t-19 82q50-8 82-19t47-25q19-17 19.5-42.5T278-284q-19-18-44.5-17.5T191-282Z"/></svg>
                                    </div>
                                    <div className="text-center font-semibold">18%</div>
                                </div>
                                <div className="mx-auto">
                                    <div className=" rounded-full w-10 h-10 inline-flex items-center justify-center m-auto outline outline-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="48" className="text-white w-6 aspect-square" fill="currentColor" viewBox="0 -960 960 960" width="48"><path d="M177-160v-60h84v-204L40-760h502L321-424v204h84v60H177Zm23-454h182l55-86H145l55 86Zm435 454q-50 0-82.5-32.5T520-275q0-50 32.5-82.5T635-390q15 0 28.5 3t26.5 8v-381h190v99H750v386q0 50-32.5 82.5T635-160Z"/></svg>
                                    </div>
                                    <div className="text-center font-semibold">27%</div>
                                </div>
                                <div className="mx-auto">
                                    <div className=" rounded-full w-10 h-10 inline-flex items-center justify-center m-auto outline outline-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="48" className="text-white w-6 aspect-square" fill="currentColor" viewBox="0 -960 960 960" width="48"><path d="M450-770v-150h60v150h-60Zm256 106-42-42 106-107 42 43-106 106Zm64 214v-60h150v60H770ZM450-40v-150h60v150h-60ZM253-665 148-770l42-42 106 106-43 41Zm518 517L664-254l41-41 108 104-42 43ZM40-450v-60h150v60H40Zm151 302-43-42 105-105 22 20 22 21-106 106Zm289-92q-100 0-170-70t-70-170q0-100 70-170t170-70q100 0 170 70t70 170q0 100-70 170t-170 70Zm0-60q75 0 127.5-52.5T660-480q0-75-52.5-127.5T480-660q-75 0-127.5 52.5T300-480q0 75 52.5 127.5T480-300Zm0-180Z"/></svg>
                                    </div>
                                    <div className="text-center font-semibold">43%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex">
                        <a href="./taste" className="mx-auto text-center p-2 mt-2 font-bold outline-white rounded-xl hover:bg-white hover:text-black border-4 border border-white">Discover</a>
                    </div>
                </div>
                <div className="p-5 rounded-xl shadow-xl bg-neutral-900 text-white relative">
                    <div className="h-5/6">
                        <h1 className="font-bold text-2xl">Your Designs</h1>
                        <div className="mt-1 flex flex-col h-full">
                            <div className="text-md">Design and Create Playlists and Custom Images Based on your Taste</div>
                            <div className="flex h-3/6 top-1/2 content-center flex-wrap text-base">
                                <div className="columns-2 my-auto gap-x-1 w-7/8 mx-auto">
                                    <li>Pop</li>
                                    <li>Bollywood</li>
                                    <li>Rap</li>
                                    <li>K-Pop</li>
                                    <li>UK Drill</li>
                                    <li>Summer</li>
                                    <li>Work-Out</li>
                                    <li>EDM</li>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                    <div className="flex">
                        <a href="./taste" className="mx-auto text-center p-2 mt-2 font-bold outline-white rounded-xl hover:bg-white hover:text-black border-4 border border-white">Discover</a>
                    </div>
                </div>

            </div>
            
        </div>
        
    );
}

export default Lab;