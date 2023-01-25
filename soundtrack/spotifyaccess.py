from spotipy.oauth2 import SpotifyOAuth

import spotipy
import json
from PIL import Image
import requests
from io import BytesIO
import random


def getAuth(request):
    return SpotifyOAuth(
        client_id="1b1729a7071f451d83b004401423bb55",
        client_secret="1d0fc8a1f6dc442daa2cee02ca0bb960",
        redirect_uri= "http://127.0.0.1:8000/connect",
        scope="user-top-read",
        cache_handler=spotipy.DjangoSessionCacheHandler(request),
        show_dialog=True
    )

def evaluatePlaylistTracks(sp, playlist, auth_feature, features_list, trackIDs = []):
    tracks = playlist['tracks']['items']

    for track in tracks:
        track = track['track']
        # track = sp.track(track['uri'])
        specFeatures = sp.audio_features(track['uri'])[0]
        k_score = 0
        for feature in features_list:
            k_score+=(auth_feature[feature]-specFeatures[feature])**2
        k_score = k_score**(1/2)
        for i in range(len(trackIDs)):
            if trackIDs[i][1] > k_score:
                trackIDs.insert(i, (track['uri'], k_score))
                break
        trackIDs.append((track['uri'], k_score))
    return trackIDs
        
def topPlaylistStats(sp, playlisturi):
    playlist = sp.playlist(playlisturi)
    tracks = playlist['tracks']['items']
    albumdict = {}
    artistdict = {}
    genredict = {}
    k =True
    for track in tracks:
        track = track['track']
        trackuri = track['uri']
        albumname = track['album']['name']
        # album = sp.album(track['album']['uri'])
        album = track['album']['images'][0]['url']
        artist = sp.artist(track['artists'][0]['uri'])
        # artistname = artist['name']
        if album in albumdict:
            albumdict[album] += 1
        else:
            albumdict[album] = 0
        if k:
            k = False
        for artist in track['artists']:
            gendata = sp.artist(artist['uri'])
            if gendata['images']:
                artistinfo = gendata['images'][1]['url']
                if artistinfo in artistdict:
                    artistdict[artistinfo] += 1
                else:
                    artistdict[artistinfo] = 0
    albumfrequencies = [k for k, v in sorted(albumdict.items(), key=lambda item: item[1])]
    artistfrequencies = [k for k, v in sorted(artistdict.items(), key=lambda item: item[1])]
    createImage(albumfrequencies, artistfrequencies)
    pass

# def fillImage():

def createImage(albumfrequencies, artistfrequencies):
    print('started creation')
    background = Image.new('RGBA', (1440, 1440), (255, 255, 255, 255))
    bg_w, bg_h = background.size
    for albumimage in albumfrequencies:
        response = requests.get(albumimage)
        img = Image.open(BytesIO(response.content))
        offset = (random.randint(0,1439),random.randint(0,1439))
        background.paste(img, offset)
        # background.show()
        # break
    print('finished')
    background.show()