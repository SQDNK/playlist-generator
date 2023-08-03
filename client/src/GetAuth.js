import React, { useEffect, useState } from 'react';


const GetAuth = function() { 

    //**TODO: success note? */
    // no promise returned b/c no res 
    const fetchToken = async function() {
        await fetch("/get_token", { 
            method: "GET", 
            });
    }

    const [data, setData] = useState(null);
    const fetchDataFromExpress = function() {
        fetch("/login")
        .then(res => res.json())
        .then(data => 
            
                {console.log("hello");
                 console.log(data);
                 setData(data);}
            );
    };

    return (
        <>
            <button onClick={fetchToken}>
                get token without logging in
            </button>
            <button onClick={fetchDataFromExpress}>
                Login
            </button>
            <div>
                {data}
            </div>

        </>
    );
};

export default GetAuth;