import React from "react"
import { useState } from "react"
import { Table, Button, Input, Space, Select, Tag } from "antd"
import { ReloadOutlined } from "@ant-design/icons"
import SongFormButton from "./SongForm"
import { getAllSongs, deleteSongRequest, getAllSoundtracks, getParsedTags } from "./APICalls"

let soundtrackData = await getAllSoundtracks();
let data = processSongData(await getAllSongs());
let tags = await getParsedTags();

function processSongData(data) {
    for (let i = 0; i < data.length; i++) {
        let e = data[i];
        e.soundtrack = '';
        let visited = new Set();

        for (let source of e.sources) {
            const soundtrackTitle = soundtrackData.find((soundtrack) => soundtrack._id === source.soundtrack_id).title;
            if (!visited.has(soundtrackTitle)) {
                visited.add(soundtrackTitle);
                if (e.soundtrack.length > 0) {
                    e.soundtrack += ', ';
                }
                e.soundtrack += soundtrackTitle;
            }
        }
    }
    return data;
}

function getSongObject(_id) {
    for (let i = 0; i < data.length; i++) {
        if (data[i]._id === _id) {
            return data[i];
        }
    }
}

function sortStringKey(key) {
    return function (a, b) {
        if (
            a[key] === null ||
            a[key] === undefined ||
            b[key] === null ||
            b[key] === undefined
        ) return '';

        let strA = a[key].toString(),
            strB = b[key].toString();

        return strA.localeCompare(strB);
    }
}

function sortStringMetaKey(key) {
    return function (a, b) {
        if (
            a['meta_data'][key] === null ||
            a['meta_data'][key] === undefined ||
            b['meta_data'][key] === null ||
            b['meta_data'][key] === undefined
        ) return '';

        let strA = a['meta_data'][key].toString(),
            strB = b['meta_data'][key].toString();

        return strA.localeCompare(strB);
    }
}

async function deleteSong(_id, dataCopy, refreshFunction) {
    console.log('delete song, id:', _id)
    let apiKey = prompt("Please enter the api key to confirm song deletion", "")
    if (apiKey == null) {
        console.log(`user cancelled deletion of id ${_id}`)
    } else {
        let res = await deleteSongRequest(_id, apiKey)
        if (res.errors)
            console.log('incorrect api key. please check and try again')
        else {
            refreshFunction();
        }
    }
}

function SongDataTable() {
    let [filteredData, setFilteredData] = useState(data);
    let [filterString, setStringFilter] = useState('');
    const refreshDataTable = async () => {
        data = processSongData(await getAllSongs());
        filterDataTable();
    };

    let cols = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            sorter: sortStringKey('title'),
            defaultSortOrder: 'ascend',
        },
        {
            title: 'Lead Composer',
            dataIndex: ['meta_data', 'lead_composer'],
            key: 'lead_composer',
            sorter: sortStringMetaKey('lead_composer')
        },
        {
            title: 'Soundtrack',
            dataIndex: ['soundtrack'],
            key: 'soundtrack',
            sorter: sortStringKey('soundtrack')
        },
        {
            title: 'Game',
            dataIndex: ['meta_data', 'game'],
            key: 'game',
            sorter: sortStringMetaKey('game')
        },
        {
            title: 'Release Year',
            dataIndex: ['meta_data', 'release_year'],
            key: 'release_year',
            sorter: sortStringMetaKey('release_year')
        },
        {
            title: 'Tags',
            dataIndex: ['meta_data', 'tags'],
            key: 'tags',
            render: (_, songItem) => {

                let songTags = songItem.meta_data.tags;

                if (songTags) {

                    let labelDivs = [];

                    for (let tag of songTags) {
                        labelDivs.push(
                            <Tag>{tag}</Tag>
                        );
                    }

                    return (
                        <>{labelDivs}</>
                    );
                }
            },
        },
        {
            title: 'Action',
            dataIndex: '',
            key: 'action',
            render: (text, record, index) => (
                <Space size='middle'>

                    <SongFormButton
                        edit_id={record._id}
                        soundtrackData={[...soundtrackData]}
                        refreshFunction={refreshDataTable}
                        songObject={getSongObject(record._id)}
                    />

                    <Button onClick={() => { deleteSong(record._id, filteredData, refreshDataTable) }}>
                        delete
                    </Button>

                </Space>
            ),
        },
    ];

    function filterDataTable(value = undefined) {
        let currFilter = filterString;
        if (value !== undefined) {
            setStringFilter(value);
            currFilter = value;
        }
        filteredData = data.filter((song) => {
            if (
                /*
                    ADD MORE FILTERS HERE IF NEEDED
                */
                song.title.toLowerCase().includes(currFilter.toLowerCase()) ||
                song.meta_data.lead_composer?.toLowerCase().includes(currFilter.toLowerCase()) ||
                song.soundtrack.toLowerCase().includes(currFilter.toLowerCase())
            ) return true;

            return false;
        })
        setFilteredData(filteredData);
    }

    function tagFilterDataTable(tagValues = undefined) {

        /*
            FIGURE THIS OUT
        */



        // if (tagValues.length === 0) {
        //     console.log("## no tag filters ##");
        //     setFilteredData(filteredData);
        // } else {
        //     console.log('## TAGVALUES ##', tagValues);
        //     // let filteredWithTags = { ...filteredData };
        //     let filteredWithTags = filteredData.filter((song) => {


        //         for (let tag of tagValues) {

        //         }

        //         return song.meta_data.tags?.includes();
        //     });
        //     setFilteredData(filteredWithTags);
        // }
    }

    return (
        <>
            <div style={{ textAlign: 'center', margin: '2em' }}>
                <h2 style={{ textAlign: 'left' }}>Songs:</h2>

                <div style={{ display: 'block', margin: '1rem' }}>
                    <div style={{ display: 'inline-block', width: '50%', textAlign: 'left' }}>
                        <SongFormButton soundtrackData={[...soundtrackData]} refreshFunction={refreshDataTable} />
                    </div>
                    <div style={{ display: 'inline-block', width: '50%', textAlign: 'right' }}>
                        <Button icon={<ReloadOutlined />} onClick={refreshDataTable} />
                    </div>
                </div>

                <div style={{ display: 'block' }}>
                    <div style={{ display: 'inline-block', width: '50%' }}>
                        <Input
                            style={{ textAlign: 'center' }}
                            placeholder="Filter by title, lead composer, soundtrack"
                            onChange={(evt) => filterDataTable(evt.target.value)}
                        />
                    </div>

                    {/* <div style={{ display: 'inline-block' }}>
                    </div> */}

                    <div style={{ display: 'inline-block', width: '50%' }}>
                        <Select
                            style={{ width: '100%' }}
                            mode="multiple"
                            placeholder="Filter by tags"
                            tokenSeparators={[',']}
                            options={tags}
                            onChange={tagFilterDataTable}
                        />
                    </div>
                </div>

                <Table
                    bordered
                    pagination={false}
                    virtual
                    scroll={{ x: 1, y: 500 }}
                    dataSource={[...filteredData]}
                    columns={cols}
                    rowKey="_id"
                />
            </div>
        </>
    )
}

export default SongDataTable;