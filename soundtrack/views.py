from django.shortcuts import render, redirect
import spotipy
import json
from .spotifyaccess import getAuth, evaluatePlaylistTracks, topPlaylistStats
from spotipy.oauth2 import SpotifyOAuth
spauth = 0
username = ''
validToken = False
sp = ''


# Create your views here.
def Home(request):
    return render(request, "home.html", context={})


def Track(request):
    global validToken, username
    spauth = getAuth(request)
    return redirect(spauth.get_authorize_url())

def Select(request):
    spauth = getAuth(request)
    code = request.GET.get("code", "")
    token = spauth.get_access_token(code)
    sp = spotipy.Spotify(token["access_token"])
    playlists = sp.current_user_playlists()
    print(playlists['items'])
    return render(request, 'playlists.html', context={"playlists":playlists['items']})
