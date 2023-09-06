import React from "react";
import { useRef, useEffect, useState } from 'react';
import "./index.css"
import Typewriter from 'typewriter-effect/dist/core';
import { useCookies } from 'react-cookie';
import { loginURI } from "./Spotify";

function Home() {
    const [cookies, setCookies] = useCookies(['token'])
    useEffect(() => {

        var typewriter = new Typewriter(document.getElementById("overlay-title"), { loop: false, delay: 75, skipAddStyles: false });
        typewriter.typeString("Soundtrackify").start();
        var typewriter = new Typewriter(document.getElementById("overlay-desc"), { loop: false, delay: 45, });
        typewriter.pauseFor(500).typeString("In-depth Spotify Analytics powered by AI algorithms.").pauseFor(300).start();

        const timerId = setTimeout(() => {
            const overlay = document.getElementById("overlay")
            overlay.classList.add("fade-out")
            document.getElementById("main").classList.remove("h-screen")
            overlay.addEventListener("animationend", (ev) => {
                if (ev.type === "animationend") {
                    overlay.style.display = "none";
                }
            }, false);
        }, 4700);
        return () => clearTimeout(timerId);
    }, []);




    return (
        <div className="relative w-screen overflow-hidden h-screen" id="main">
            <div className="w-screen h-screen absolute bg-white z-30 " id="overlay">
                <div className="p-24" id="overlayCallout ">
                    <h1 className="font-semibold text-8xl shadow-overlay" id="overlay-title"></h1>
                    <h1 className="mt-12 font-base text-4xl shadow-overlay" id="overlay-desc"></h1>
                </div>
            </div>

            <div className="flex basis-full flex-row  px-5 relative py-4 montserrat w-full">
                <img src="./soundtrackify.png" className="w-12 mr-4" />
                <h1 className="my-auto font-semibold text-2xl tracking-widest md:block hidden">SOUNDTRACKIFY</h1>
                <div className="text-black my-auto text-sm uppercase w-full flex justify-end">
                    <a href="" className="py-2 px-4 hover:text-emerald-400">Home</a>
                    <a href={cookies.token ? "/lab" : loginURI} className="py-2 px-4 hover:text-emerald-400">Lab</a>
                    <a href="" className="py-2 px-4 hover:text-emerald-400">About</a>
                </div>
            </div>
            <div className="w-full p-4 place-content-center flex font-bold bg-black text-white text-xl">
                <div>Powered by <span className="text-green-400">Spotify</span></div>
                <img src="./spotify.png" className="ml-2 w-5 h-5 my-auto" />
            </div>
            <div className="h-64 bg-center flex montserrat w-full" style={{ backgroundImage: `url('festival.jpg')` }}>
                <div className="absolute h-64 w-full opacity-90 bg-green-400 z-10 "></div>
                <div className="my-auto z-20 ml-16">
                    <h1 className="font-bold text-5xl  ">Soundtrackify</h1>
                    <h6 className="font-bold text-xl ml-1">Mix and Match Your Tastes</h6>
                    <a href={cookies.token ? "/lab" : loginURI} className="mt-2 text-white max-w-fit hover:bg-white hover:text-black flex bg-black rounded-xl p-3 rounded-xl object-center">
                        <div className="font-bold pr-2 my-auto">Get Started</div>
                        <svg className="w-4 h-4 my-auto mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                    </a>
                </div>
            </div>

            <div className="overflow-x-hidden md:flex ">
                <div className="p-12 montserrat">
                    <h1 className="text-3xl font-bold">Analyze</h1>
                    <h6 className="text-lg">Organize all your music by genres </h6>
                    <div className="grid grid-cols-3  p-3">
                        <div className="p-3 relative w-full">
                            <img src="./Genres/country.jpg" className="rounded-xl w-32 h-32 object-cover" />
                            <img src="./Genres/country.jpg" className="absolute top-1 left-5 opacity-20 rounded-xl w-32 h-32 object-cover" />
                            <h1 className="absolute w-32 h-32 -bottom-1/4 text-center font-bold text-white z-30 text-lg">Country</h1>
                            <div className="absolute w-32 h-32 bg-purple-700/70 rounded-xl z-20 top-3 left-3"></div>
                        </div>
                        <div className="p-3 relative">
                            <img src="./Genres/popmusic.jpg" className="rounded-xl w-32 h-32 object-cover" />
                            <img src="./Genres/popmusic.jpg" className="absolute top-1 left-5 opacity-20 rounded-xl w-32 h-32 object-cover" />
                            <h1 className="absolute w-32 h-32 -bottom-1/4 text-center font-bold text-white z-30 text-lg">Pop</h1>
                            <div className="absolute w-32 h-32 bg-blue-700/70 rounded-xl z-20 top-3 left-3"></div>
                        </div>
                        <div className="p-3 relative">
                            <img src="./Genres/alternativepop.jpg" className="rounded-xl w-32 h-32 object-cover" />
                            <img src="./Genres/alternativepop.jpg" className="absolute top-1 left-5 opacity-20 rounded-xl w-32 h-32 object-cover" />
                            <h1 className="absolute w-32 h-32 -bottom-1/4 text-center font-bold text-white z-30 text-lg">Alternative</h1>
                            <div className="absolute w-32 h-32 bg-violet-700/70 rounded-xl z-20 top-3 left-3"></div>
                        </div>
                        <div className="p-3 relative">
                            <img src="./Genres/rap.jpg" className="rounded-xl w-32 h-32 object-cover" />
                            <img src="./Genres/rap.jpg" className="absolute top-1 left-5 opacity-20 rounded-xl w-32 h-32 object-cover" />
                            <h1 className="absolute w-32 h-32 -bottom-1/4 text-center font-bold text-white z-30 text-lg">Rap</h1>
                            <div className="absolute w-32 h-32 bg-red-800/70 rounded-xl z-20 top-3 left-3"></div>
                        </div>
                        <div className="p-3 relative">
                            <img src="./Genres/edm.jpg" className="rounded-xl w-32 h-32 object-cover" />
                            <img src="./Genres/edm.jpg" className="absolute top-1 left-5 opacity-20 rounded-xl w-32 h-32 object-cover" />
                            <h1 className="absolute w-32 h-32 -bottom-1/4 text-center font-bold text-white z-30 text-lg">EDM</h1>
                            <div className="absolute w-32 h-32 bg-green-800/70 rounded-xl z-20 top-3 left-3"></div>
                        </div>
                        <div className="p-3 relative">
                            <img src="./Genres/rock.jpg" className="rounded-xl w-32 h-32 object-cover" />
                            <img src="./Genres/rock.jpg" className="absolute top-1 left-5 opacity-20 rounded-xl w-32 h-32 object-cover hover:scale-125" />
                            <h1 className="absolute w-32 h-32 -bottom-1/4 text-center font-bold text-white z-30 text-lg">Rock</h1>
                            <div className="absolute w-32 h-32 bg-orange-500/70 rounded-xl z-20 top-3 left-3"></div>
                        </div>
                    </div>
                </div>
                <div className="p-16 montserrat ">
                    <h1 className="text-3xl font-bold">Understand</h1>
                    <h6 className="text-lg">Find your unique taste profile </h6>
                    <div className="m-auto rounded-3xl border-black border-2 border-solid  p-2 mt-3">
                        <img src="./map.png" className="w-3/4 p-2 m-auto" />
                    </div>
                </div>

            </div>

        </div>
    );
}

export default Home;