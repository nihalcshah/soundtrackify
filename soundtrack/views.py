from django.shortcuts import render, redirect
import spotipy
import json
from .spotifyaccess import getAuth, evaluatePlaylistTracks
from spotipy.oauth2 import SpotifyOAuth
spauth = 0
username = ''
validToken = False


# Create your views here.
def Home(request):
    return render(request, "home.html", context={})


def Track(request):
    global validToken, username
    if validToken:
        return redirect('connect')
    if request.method == "POST":
        username = request.POST.get('username')
        print(username)
        sp_auth = getAuth(username)
        token = sp_auth.get_cached_token()
        if token:
            validToken = True
            return redirect('connect')
        redirect_url = sp_auth.get_authorize_url() # Note: You should parse this somehow. It may not be in a pretty format.
        print(redirect_url)
        return redirect(redirect_url)
    return render(request, "extractuser.html", context={})

def Connect(request):
    global validToken, sp, songname

    token = 'http://127.0.0.1:8000/connect/?{}'.format(request.GET.urlencode())
    sp_auth = getAuth(username)
    code = sp_auth.parse_response_code(token)
    token_info = sp_auth.get_access_token(code)
    sp = spotipy.Spotify(auth=token_info['access_token'])
    validToken = True
    playlists = sp.current_user_playlists(limit=5)
    songname = ""
    if request.method =='POST':
        print("posted")
        if "songname" in request.POST:
            songname = request.POST.get('songname')
            song_list = sp.search(q=songname, limit=3, type="track")
            # print(song_list[])
            # print(song_list['tracks'])
            newlist = []
            for i in song_list['tracks']['items']:
                newlist.append((i['name'], i['artists'][0]['name'], i['uri']))
            return render(request, "searchsong.html", context={"playlists": playlists['items'], "songlist":newlist, "searchingsong": False, "foundsongs": True})


        # return render(request, "searchsong.html", context={"playlists": playlists['items'], "searchingsong": False, "foundsongs": False})



    return render(request, "searchsong.html", context={"playlists": playlists['items'], "searchingsong": True})

from django.http import JsonResponse

def Sortsongs(request):
    print("hit")
    if request.method == 'POST':
        trackuri = request.POST.get('songuri')
        maintrack = sp.track(trackuri)
        # print(maintrack)
        song_playlists = sp.search(f"{songname} {maintrack['artists'][0]['name']}",limit=3, type="playlist")
        main_features = sp.audio_features(trackuri)[0]
        audio_features = ["danceability", "energy", "key", "loudness", "speechiness", "acousticness", "instrumentalness", "liveness", "valence", "tempo"]
        
        trackIDs = []
        for playlist in song_playlists['playlists']['items']:
            playlist = sp.playlist(playlist['uri'])
            trackIDs = evaluatePlaylistTracks(sp, playlist, main_features, audio_features, trackIDs)
        print(trackIDs)
        tracks = []
        for i in trackIDs:
            if i[1] == 0:
                continue
            tracks.append(i[0])
        sp.user_playlist_create(sp.current_user()['id'], "Songs like "+ songname, True, False, description="Created by Soundtrackify")
        return JsonResponse({"playlistmade": True}, safe=False)
        
        #return render(request, 'success.html', {})
        
    else:
        #return render(request, 'workingcontat.html', {})
        return render(request, 'sort.html', {})