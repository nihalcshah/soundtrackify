
export const authEndpoint = "https://accounts.spotify.com/authorize"

// const redirectUri = "http://localhost:3000/lab"
const redirectUri = "https://www.soundtrackify.cjshah.org/lab"

const scopes = [
    "user-top-read",
    "user-read-currently-playing",
    "user-read-recently-played",
    "user-read-playback-state",
    "user-modify-playback-state"

]

const clientId = "1b1729a7071f451d83b004401423bb55"

export const loginURI = `${authEndpoint}?
client_id=${clientId}
&redirect_uri=${redirectUri}
&scope=${scopes.join("%20")}
&response_type=token
&show_dialog=true`

