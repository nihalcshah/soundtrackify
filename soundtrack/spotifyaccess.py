from spotipy.oauth2 import SpotifyOAuth
import spotipy
import json


def getAuth(username):
    return SpotifyOAuth(
        client_id="1b1729a7071f451d83b004401423bb55",
        client_secret="1d0fc8a1f6dc442daa2cee02ca0bb960",
        redirect_uri= "http://127.0.0.1:8000/callback",
        scope="user-top-read",
        cache_path=".cache-"+username,
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
        
            
        # trackIDs.append['track.']