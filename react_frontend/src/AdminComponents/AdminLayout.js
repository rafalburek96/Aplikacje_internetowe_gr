import React, {Component} from 'react';
import {NavLink} from "react-router-dom";
import {AlertFailure, AlertSuccess} from "../Misc/Alert";

export default class AdminLayout extends Component
{
    LOGIN = (
        <div>
            <li style={{float:'right'}}>
                <NavLink to={{pathname: "/admin/login", logIn: this.setStateLoggedIn.bind(this)}}>Logowanie</NavLink>
            </li>
        </div>
    );
    LOGOUT = (
        <div>
            <li><NavLink to={{pathname: "/admin/authors"}}>Autorzy</NavLink></li>
            <li><NavLink to={{pathname: "/admin/categories"}}>Kategorie</NavLink></li>
            <li><NavLink to={{pathname: "/admin/publishers"}}>Wydawnictwa</NavLink></li>
            <li><NavLink to={{pathname: "/admin/languages"}}>Języki</NavLink></li>
            <li><NavLink to={{pathname: "/admin/books"}}>Książki</NavLink></li>


            {/* eslint-disable-next-line*/}
            <li style={{float:'right'}}><a href="javascript:void(0);" onClick={this.logout.bind(this)}>Wyloguj się</a></li>
            <li style={{float:'right'}}><NavLink to={{pathname: "/admin/orders"}}>Wypożyczenia</NavLink></li>
        </div>
    );

    constructor(props)
    {
        super(props);
        this.state = {
            JSXLoggedIn: null,
            loaded: false
        }
    }

    setStateLoggedIn()
    {
        this.setState({loaded: true, JSXLoggedIn: this.LOGOUT});
    }

    logout() {
        fetch('http://localhost:3000/admin/logout', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        }).then(r=>r.json())
            .then(r=>{
                if(r.status === 'success') {
                    this.setState({JSXLoggedIn: this.LOGIN, loaded: true});
                    this.props.history.push('/admin');
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
        fetch('http://localhost:3000/admin/status', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        }).then(r=>r.json()
            .then(r=> {
                if(r.admin && r.admin === true) {
                    this.setState({JSXLoggedIn: this.LOGOUT, loaded: true});
                }
                else {
                    this.setState({JSXLoggedIn: this.LOGIN, loaded: true});
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
        var loading = '';
        if(!this.state.loaded)
            loading = 'Wczytuję dane...';

        return (
            <React.Fragment>
                <div id="menu">
                    <div className="top-menu">
                        <label htmlFor="show-menu" className="show-menu">Pokaż menu</label>
                        <input type="checkbox" id="show-menu" role="button"/>
                        <ul id="menu">
                            <li><NavLink to="/admin">Panel główny</NavLink></li>
                            {this.state.JSXLoggedIn}
                        </ul>
                    </div>
                </div>
                <p style={{margin: '15px'}}>{loading}</p>
            </React.Fragment>
        );
    }
}


AdminLayout.propTypes = {};