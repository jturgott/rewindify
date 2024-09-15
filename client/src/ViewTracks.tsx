
import React from 'react';

function ViewTracks(){
    return <h1> {localStorage.getItem('spotifyAccessToken')}</h1>;
}

export default ViewTracks;