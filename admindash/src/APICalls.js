//uri
//require('dotenv').config();
const uri = "http://localhost:5000"
//process.env.SERVER_URI||
//const api_key=process.env.REACT_APP_API_KEY||""

const getSongs = async(song_query)=>{
    const uriGet = uri+'/music/songs'
    fetch(uriGet).then(async response=>console.log(await response.json()));
};
const getAllSongs = async()=>{
    const uriGet = uri+'/music/songs'
    fetch(uriGet).then(async response=>console.log(await response.json()));
};
/*adds a new song given title and soundtrack/metadata indexes and returns the _song_index
  assumes song has an soundtrack and meta description
  assumes admin inputted song name correctly
*/
const addNewSongTitleSimple = async (song_title, _soundtrack_id, meta_data)=>{
    const uriPosts = uri+'/music/songs'
    return await fetch(uriPosts, {
        method: "POST",
        headers:{
            'content-type': 'application/json',
            //'api_key':api_key
        },
        body: JSON.stringify({title:song_title, soundtrack_id:_soundtrack_id, meta_data: meta_data})
    }).then(async resp=>{await resp.json()
    console.log("addNewSong is it working?",resp)});
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

const addNewSongURL= async(url, _song_index, source_type, alt_theme, official_title)=>{
    const uriPosts = uri+'/music/songs/'+_song_index+'/sources'
    return fetch(uriPosts, {
        method: "POST",
        headers:{
            'content-type': 'application/json'
        },
        body: JSON.stringify({url:url, songIndex:_song_index, source_type:source_type, alt_theme:alt_theme, official_title:official_title})
    });
};
//this is a simple call for frontend
//const newSong=addNewSongTitleSimple("test5","12313123",{lead_composer:'mozart', game:2, release_year: 1000})
//addNewSongURL("https://www.youtube.com/watch?v=lzYg5d2KDF0",newSong,"Youtube","Ambient","Thirsty_Bois")
//console.log(newSong.body)
//getAllSongs()
export { getSongs, getAllSongs, addNewSongTitleSimple, addNewSongURL };