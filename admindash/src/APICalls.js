import { getAPIKeyFromURL } from "./util";

//uri
//require('dotenv').config();
const uri = "https://3.144.222.38:5000";
//process.env.SERVER_URI||
const url_api_key = getAPIKeyFromURL();

const ytApiKey = "AIzaSyDRizHQVubn1TT7etyYzOQvJwvyUmQuWx4";

const getSongs = async (song_query) => {
    const uriGet = uri + '/music/songs'
    fetch(uriGet).then(async response => await response.json()).catch(resp => { throw (resp) });
};
const getAllSongs = async () => {
    const uriGet = uri + '/music/songs'
    return fetch(uriGet).then(async response => await response.json());
};
const getSong = async (_id) => {
    const uriGet = uri + '/music/songs/' + _id;
    const rval = await fetch(uriGet).then(response => response.json());
    return rval;
}
/*adds a new song given title and soundtrack/metadata indexes and returns the _song_index
  assumes song has an soundtrack and meta description
  assumes admin inputted song name correctly
*/
const addNewSongTitleSimple = async (song_title, meta_data, sourcesArray, api_key=url_api_key) => {
    const uriPosts = uri + '/music/songs';

    try {
        const response = await fetch(uriPosts, {
            method: "POST",
            headers: {
                'content-type': 'application/json',
                'api_key': api_key
            },
            body: JSON.stringify({ title: song_title, meta_data: meta_data, sources: sourcesArray })
        });
        return response.json();
    } catch (errors) {
        console.error('Error in addNewSongTitleSimple:', errors);
        return { errors: "Failed to Connect With Server" }; // Propagate the error for further handling, if needed
    }
};

const editSong = async (_id, songTitle, meta_data, sourcesArray, api_key=url_api_key) => {
    //console.log(api_key)
    const uriPatch = uri + '/music/songs/' + _id;

    try {

        const response = await fetch(uriPatch, {
            method: "PATCH",
            headers: {
                'content-type': 'application/json',
                'api_key': api_key
            },
            body: JSON.stringify({ title: songTitle, meta_data: meta_data, sources: sourcesArray })
        });
        return response.json();
    } catch (e) {
        console.error('Error patching song', e);
        return { errors: "Failed to connect with server" };
    }
}
const editSoundtrack = async (_id, soundtrackTitle, game, releaseYear, apiKey=url_api_key) => {
    const uriPatch = uri + '/music/soundtracks/' + _id;
    try {
        const response = await fetch(uriPatch, {
            method: "PATCH",
            headers: {
                'content-type': 'application/json',
                'api_key': apiKey
            },
            body: JSON.stringify({ title: soundtrackTitle, game: game, release_date: releaseYear })
        });
        return response.json();
    } catch (e) {
        console.error('Error patching song', e);
        return { errors: "Failed to connect with server" };
    }

}


/*adds to sources database new url and alt theme and returns the _sources_index
  assumes got the ObjectID from addNewSongTitleSimple to get _song_index
  assumes this is being called multiple times
  params:
  url=hyperlink of the song
  _song_index = ObjectID from addNewSongTitleSimple
  source_type = youtube,spotify,etc
  alt_theme = the differing versions of a song
  special_title = 
  */

const addNewSongURL = async (url, _song_index, source_type, intensity, official_title) => {
    const uriPosts = uri + '/music/songs/' + _song_index + '/sources'
    return fetch(uriPosts, {
        method: "POST",
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({ url: url, songIndex: _song_index, source_type: source_type, intensity: intensity, official_title: official_title })
    });
};

const addNewSoundtrack = async (title, releaseDate, game, apiKey=url_api_key) => {
    const response = fetch(uri + '/music/soundtracks', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'api_key': apiKey
        },
        body: JSON.stringify({ title: title, game: game, release_date: releaseDate })
    }).then(res => res.json());
    return response;
}
const getAllSoundtracks = async () => {
    const uriGet = uri + '/music/soundtracks'
    return fetch(uriGet).then(async response => await response.json());
};

const getSoundtrack = async (_id) => {
    const uriGet = uri + '/music/soundtracks/' + _id;
    return await fetch(uriGet).then(async response => await response.json());
};

const deleteSongRequest = async (itemId, apiKey=url_api_key) => {
    return fetch(`${uri}/music/songs/${itemId}`, {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json',
            'api_key': apiKey
        }
    }).then(res => res.json())
}

const deleteSoundtrackRequest = async (itemId, apiKey=url_api_key) => {
    return fetch(`${uri}/music/soundtracks/${itemId}`, {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json',
            'api_key': apiKey
        }
    }).then(res => res.json())
}

const getVideoDuration = async (videoId) => {
    console.log("video id:", videoId);
    const uri = "https://www.googleapis.com/youtube/v3/videos?id=" + videoId + "&part=contentDetails&key=" + ytApiKey;
    const contentDetails = await fetch(uri).then(async (resp) => await resp.json());
    console.log(contentDetails);
    if (contentDetails !== undefined && contentDetails.items && contentDetails.items[0]) {
        const rawDuration = contentDetails.items[0].contentDetails.duration;
        const reg = /PT([0-9]*M)?([0-9]*S)?/;
        const match = rawDuration.match(reg);
        console.log('regex:', match);
        let duration = 0;
        for (let i = 1; i < match.length; i++){
            //Ensure that it isn't undefined
            if (!match[i]){
                continue;
            }
            
            let lastIndex = match[i].length - 1;
            if (match[i][lastIndex] === 'M'){
                duration += parseInt(match[i].substring(0, lastIndex)) * 60;
            }
            if (match[i][lastIndex] === 'S'){
                duration += parseInt(match[i].substring(0, lastIndex));
            }
            console.log("duration:", duration);
        }

        return duration;
    } else {
        return { error: "Invalid video id, not on youtube!" };
    }

}

const getParsedTags = async () => {
    const uriGet = uri + "/tags";
    const result = await fetch(uriGet).then(async (resp) => await resp.json());
    const tags = [];
    for(let tag of result) {
        delete tag._id;
        const newTag = {
            value: tag.tag,
            label: tag.tag
        }
        tags.push(newTag);
    }
    return tags;
}

//this is a simple call for frontend
//const newSong=addNewSongTitleSimple("test5","12313123",{lead_composer:'mozart', game:2, release_year: 1000})
//addNewSongURL("https://www.youtube.com/watch?v=lzYg5d2KDF0",newSong,"Youtube","Ambient","Thirsty_Bois")
//console.log(newSong.body)
//getAllSongs()
//addNewSongTitleSimple(0,null,{lead_composer:0, game:0, release_year:0},[],0)
export {
    getSongs, getSong, getAllSongs, editSong, addNewSongTitleSimple, addNewSongURL, addNewSoundtrack, getAllSoundtracks,
    getSoundtrack, editSoundtrack, deleteSongRequest, deleteSoundtrackRequest, getVideoDuration, getParsedTags
};
