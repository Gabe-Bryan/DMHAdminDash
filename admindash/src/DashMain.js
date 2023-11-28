import './DashMain.css'
// import {Table, Button, Layout, Input, Space} from "antd";
// const { Header, Sider, Content } = Layout

// let cols = [
//     {
//         title: 'Index',
//         dataIndex: 'key',
//         key: 'key'
//     },
//     {
//         title: 'Title',
//         dataIndex: 'title',
//         key: 'title'
//     },
//     {
//         title: 'Game',
//         dataIndex: 'game',
//         key: 'game'
//     }
// ]

let fakeData = []

// Generate fake test data
for (let i = 1; i < 100; i++) {
    fakeData.push({
        key: `${i}`,
        title: `Song ${i}`,
        game: `Destiny ${i%2===0?'1':'2'}`
    })
}

/*
let uriGet = 'https://localhost:5500/music/songs',
    apiData = fetch(uriGet).then(async response=>console.log(await response.json()));
*/

function populateDataTable(data) {
    let table = document.querySelector("table");


    function addCell(tr, text) {
        let td = tr.insertCell()
        td.textContent = text
        return td
    }

    data.forEach(item => {
        let row = table.insertRow()
        addCell(row, item.key)
        addCell(row, item.title)
        addCell(row, item.game)
    })
}


function DashMain() {
    
    return (
        <div id='container'>
            <h1>Admin dashboard</h1>
            <div id='dataAndFilter'>
                <input type='search' id='filter' placeholder='filter'></input>
                <div className='tableFixHead'>
                    <table >
                        <thead>
                            <th>Index</th>
                            <th>Title</th>
                            <th>Game</th>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>
            <div id='buttons'>
                <button id='btnAddSong' disabled>Add song</button>
                <button id='btnEditSong' disabled>Edit song</button>
            </div>
        </div>
    )
}

export default DashMain