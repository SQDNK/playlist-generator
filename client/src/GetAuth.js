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
            <button onClick={fetchToken}
                    className="bg-npink hover:bg-pink-300 rounded-lg p-2">
                get token without logging in
            </button>
            <button onClick={fetchDataFromExpress}
                    className="bg-npink hover:bg-pink-300 rounded-lg p-2">
                Login
            </button>
            <div>
                {data}
            </div>

        </>
    );
};

export default GetAuth;