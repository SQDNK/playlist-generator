import React, { useEffect, useState } from 'react';


const GetAuth = function() { 

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