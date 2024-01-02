//uri
//require('dotenv').config();
const uri = "https://3.144.222.38:5000"
//process.env.SERVER_URI||
const api_key=""

const getSongs = async(song_query)=>{
    const uriGet = uri+'/music/songs'
    fetch(uriGet).then(async response=>await response.json()).catch(resp => {throw(resp)});
};
const getAllSongs = async()=>{
    const uriGet = uri+'/music/songs'
    return fetch(uriGet).then(async response=>await response.json());
};
/*adds a new song given title and soundtrack/metadata indexes and returns the _song_index
  assumes song has an soundtrack and meta description
  assumes admin inputted song name correctly
*/
const addNewSongTitleSimple = async (song_title, _soundtrack_id, meta_data, sourcesArray, api_key) => {
    const uriPosts = uri + '/music/songs';
  
    try {
      const response = await fetch(uriPosts, {
        method: "POST",
        headers: {
          'content-type': 'application/json',
          'api_key': api_key
        },
        body: JSON.stringify({ title: song_title, soundtrack_id: _soundtrack_id, meta_data: meta_data, sources: sourcesArray })
      });
      return response.json();
    } catch (errors) {
      console.error('Error in addNewSongTitleSimple:', errors);
      return {errors:"Failed to Connect With Server"}; // Propagate the error for further handling, if needed
    }
  };
  

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

const addNewSongURL= async(url, _song_index, source_type, intensity, official_title)=>{
    const uriPosts = uri+'/music/songs/'+_song_index+'/sources'
    return fetch(uriPosts, {
        method: "POST",
        headers:{
            'content-type': 'application/json',
        },
        body: JSON.stringify({url:url, songIndex:_song_index, source_type:source_type, intensity:intensity, official_title:official_title})
    });
};

const addNewSoundtrack = async(title, releaseDate, game, apiKey) => {
  const response = fetch(uri + '/music/soundtracks', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'api_key' : apiKey
    },
    body: JSON.stringify({title: title, game: game, release_date: releaseDate})
  }).then(res => res.json());
  return response;
}
const getAllSoundtracks = async()=>{
  const uriGet = uri+'/music/soundtracks'
  return fetch(uriGet).then(async response=>await response.json());
};

const deleteSongRequest = async (itemId, apiKey) => {
  fetch(`${uri}/music/songs/${itemId}`, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
      'api_key' : apiKey
    }
  }).then(res => res.json())
}

const deleteSoundtrackRequest = async (itemId, apiKey) => {
  fetch(`${uri}/music/soundtracks/${itemId}`, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
      'api_key' : apiKey
    }
  }).then(res => res.json())
}

//this is a simple call for frontend
//const newSong=addNewSongTitleSimple("test5","12313123",{lead_composer:'mozart', game:2, release_year: 1000})
//addNewSongURL("https://www.youtube.com/watch?v=lzYg5d2KDF0",newSong,"Youtube","Ambient","Thirsty_Bois")
//console.log(newSong.body)
//getAllSongs()
//addNewSongTitleSimple(0,null,{lead_composer:0, game:0, release_year:0},[],0)
export { getSongs, getAllSongs, addNewSongTitleSimple, addNewSongURL, addNewSoundtrack,getAllSoundtracks, 
         deleteSongRequest, deleteSoundtrackRequest };