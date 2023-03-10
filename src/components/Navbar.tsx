import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../base";
import "../css/navbar.css";
import { AuthContext } from '../context/AuthContext';
import simpleLogo from '../images/simple_logo.png';

const Navbar = () => {

    const user = useContext(AuthContext);

    const signOut = async () => {
        await auth.signOut();
    };

    return (
        <div className="navbar">
            <div className="navInfo">
                <Link to="/">
                    <img src={simpleLogo} alt="Logo" style={{width: '80px'}}/>
                </Link>
                {!user ?
                    <div>
                        <Link to="/login">
                            <button className="loginbutton">Logg inn / Registrer</button>
                        </Link>
                    </div>
                    :
                    <div>
                        <Link to="/profile">
                            <button className="loginbutton2">Profil</button>
                        </Link>
                        <button className="loginbutton2" onClick={signOut}>Logg ut</button>
                    </div>
                }

            </div>

        </div>
    );
};

export default Navbar;