import React from 'react';

const Header = (props) => {
    return(
    <div>
        <h1 style={{color:'#FFF0FF', textAlign: 'center'}}>{props.text} <i>{props.name}</i></h1>
        <br/>
    </div>
    

);}

export default Header;