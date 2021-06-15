import React, {Component} from 'react';
import {NavLink} from "react-router-dom";
import {AlertFailure, AlertSuccess} from "../Misc/Alert";

export class Layout extends Component
{
    LOGINJSX = (
        <div>
            <li style={{float:'right'}}>
                <NavLink to={{pathname: "/login", logIn: this.setStateLoggedIn.bind(this)}}>Logowanie</NavLink>
            </li>
            <li style={{float:'right'}}>
                <NavLink to="/register">Rejestracja</NavLink>
            </li>
        </div>
    );
    LOGOUTJSX = (
        <div>
            <li style={{float:'right'}}>
                {/*eslint-disable-next-line*/}
                <a href="javascript:void(0);" onClick={this.logout.bind(this)}>Wyloguj się</a>
            </li>
            <li style={{float:'right'}}>
                <NavLink to="/my_account">Moje konto</NavLink>
            </li>
        </div>
    );
    ADMINJSX = (
        <div>
            <li>
                <NavLink to={{pathname: "/admin"}}>Panel admina</NavLink>
            </li>
        </div>
    );

    constructor(props)
    {
        super(props);
        this.state = {
            JSXLoggedIn: null,
            loggedAdmin: false,
            loaded: false
        }
    }

    setStateLoggedIn()
    {
        this.setState({JSXLoggedIn: this.LOGOUTJSX});
    }

    logout() {
        fetch('http://localhost:3000/users/logout', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        }).then(r=>r.json())
            .then(r=>{
                if(r.status === 'success') {
                    this.setState({JSXLoggedIn: this.LOGINJSX, loggedAdmin: false});
                    this.props.history.push('/');
                    AlertSuccess("Wylogowano pomyślnie");
                } else {
                    if(r.reason)
                        AlertFailure(r.reason);
                    else {
                        console.log("Logout error, response from serwer: " + JSON.stringify(r));
                        AlertFailure("Przeprszamy, nie udało się wylogować, więcej informacji w konsoli");
                    }
                }
            });

    }

    componentDidMount() {
        fetch('http://localhost:3000/users/status', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        }).then(r=>r.json()
            .then(r=>{
                if(r.logged_in && r.logged_in === 1) {
                    this.setState({JSXLoggedIn: this.LOGOUTJSX, loaded: true});
                }
                else if(r.logged_in && r.logged_in === -1) {
                    this.setState({JSXLoggedIn: this.ADMINJSX, loggedAdmin: true, loaded: true});
                }
                else {
                    this.setState({JSXLoggedIn: this.LOGINJSX, loaded: true});
                }
            }), (_) => this.serverNotAvailable());
    }

    serverNotAvailable()
    {
        AlertFailure("Nie udało się połączyć z serwerem zewnętrznym!");
        this.setState({loaded: true});
    }

    render()
    {
        var userInformation = '';
        if(!this.state.loaded)
            userInformation = 'Wczytuje dane...';
        else if(this.state.loggedAdmin)
            userInformation = 'Jesteś zalogowany jako admin';
        if(!userInformation)
            document.getElementById('userInformationP').style.display = 'none';


        return (
            <React.Fragment>
                <div id="menu">
                    <div className="top-menu">
                        <label htmlFor="show-menu" className="show-menu">Pokaż menu</label>
                        <input type="checkbox" id="show-menu" role="button"/>
                        <ul id="menu">
                            <li><NavLink to="/">Strona główna</NavLink></li>
                            {this.state.JSXLoggedIn}
                        </ul>
                    </div>
                </div>
                <p id='userInformationP' style={{textAlign: 'center', margin: '15px'}}>{userInformation}</p>
            </React.Fragment>
        );
    }
}

Layout.propTypes = {};