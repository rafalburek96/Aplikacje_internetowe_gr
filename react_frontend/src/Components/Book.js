import React, {Component, Fragment} from 'react';
import {AlertFailure, AlertSuccess} from "../Misc/Alert";

export class Book extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            id: null,
            title: null,
            lang: null,
            cat: null,
            publ: null,
            auth: null,
            opt: null,
            user: null,
            status: 2,
            owner: null,
            end: null,
        }
    }
    
    componentDidMount()
    {
        var status = 2;
        var owner = null;
        var end = null;
        
        ////////////////////////////////////////////////////    GET Data
        fetch('http://localhost:3000/book/' + this.props.match.params.id, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        }).then(r=>{
            console.log("DEBUG=" + r);
            return r.json()
        })
            .then(r=>{
                console.log(r);
                if(r.status === 'failed') {
                    AlertFailure(r.reason);
                } else {
                    this.setState({title: r[0].title});
                    this.setState({lang: r[0].language});
                    this.setState({cat: r[0].category});
                    this.setState({publ: r[0].publisher});
                    this.setState({auth: r[0].name + " " + r[0].surname});
                }
            });
            
        
        ////////////////////////////////////////////////////    GET Status
        fetch('http://localhost:3000/book/status/' + this.props.match.params.id, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        }).then(r=>{
            console.log("DEBUG=" + r);
            return r.json()
        })
        .then(r=>{
            console.log(r);
            if(r.status === 'failed') {
                AlertFailure(r.reason);
            } else {
                if(r[0]){
                    this.setState({status: r[0].status});
                    this.setState({owner: r[0].user_email});
                    this.setState({end: r[0].end});
                    status = r[0].status;
                    owner = r[0].user_email;
                    end = r[0].end;
                }
                
                ////////////////////////////////////////////////////    GET LOGGED IN
                fetch('http://localhost:3000/users/status', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                }).then(r=>{
                    console.log("DEBUG=" + r);
                    return r.json()
                })
                    .then(r=>{
                        console.log(r);
                        if(r.status === 'failed') {
                            AlertFailure(r.reason);
                        } else {
                            
                            var text = "Książka nie jest obecnie zerezerwowana";
                            
                            
                            if(status < 2) text = "Książka jest obecnie wypożyczona do " + end;
                            
                            if(r.logged_in===0){
                                this.setState({opt: (
                                    <div>
                                        <br/><br/>
                                        <center>
                                            Zaloguj się aby zarezerwować książkę
                                        </center>
                                    </div>
                                )});} else {
                            if(r.logged_in===1)
                            if(status === null){
                                text = "Książka jest obecnie zerezerwowana";
                                this.setState({opt: (
                                    <div>
                                        <br/><br/>
                                        <center>
                                            {text} <br/> <br/>
                                        </center>
                                    </div>
                                )});
                            } else {
                                if(r.email===owner){
                                    this.setState({opt: (
                                        <div>
                                            <br/><br/>
                                            <center>
                                                {text} <br/> <br/>
                                                <button onClick={this.PrelongBook}>Prelonguj</button>
                                            </center>
                                        </div>
                                    )});
                                } else {
                                    this.setState({opt: (
                                        <div>
                                            <br/><br/>
                                            <center>
                                                {text} <br/> <br/>
                                                <button onClick={this.OrderBook}>Zarezerwuj</button>
                                            </center>
                                        </div>
                                    )});
                                }
                            }
                            if(r.logged_in===-1){
                                if(status > 0 && status < 2){
                                    text = "Książka jest obecnie wypożyczona przez użytkownika " + owner + " do " + end;
                                    this.setState({opt: (
                                        <div>
                                            <br/><br/>
                                            <center>
                                                {text} <br/> <br/>
                                                <button onClick={this.ReturnBook}>Oddaj</button>
                                                <button>Edytuj</button>
                                                <button>Usuń</button>
                                            </center>
                                        </div>
                                    )});
                                } else {
                                    if(status === null) text = "Książka jest obecnie zerezerwowana przez użytkownika " + owner;
                                    this.setState({opt: (
                                        <div>
                                            <br/><br/>
                                            <center>
                                                {text} <br/> <br/>
                                                <table width="100%">
                                                    <tbody>
                                                        <tr>
                                                            <td width="100">Adres e-mail:</td>
                                                            <td><input type="email" name={"user"} onChange={this.onUserChange}/></td>
                                                            <td width="100"><button onClick={this.BorrowBook}>Wypożycz</button></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <br/>
                                                <button>Edytuj</button>
                                                <button>Usuń</button>
                                            </center>
                                        </div>
                                    )});
                                }
                            }
                        }}
                    });
            }
        });
        
        
        
    }
    
    onUserChange = (event) => {
        this.user = event.target.value;
    }
    
    OrderBook = (event) =>
    {
        if(event) event.preventDefault();
        let data = {
            id: this.id,
            user: this.user,
        };
        fetch('http://localhost:3000/users/order/' + this.props.match.params.id, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data)
        }).then(r=>{
            console.log("DEBUG=" + r);
            return r.json()
        })
            .then(r=>{
                console.log(r);
                if(r.status === 'failed') {
                    AlertFailure(r.reason);
                } else {
                    window.location.reload();
                    AlertSuccess("Zarezerwowano pomyślnie");
                }
            });
    }
    
    PrelongBook = (event) =>
    {
        if(event) event.preventDefault();
        let data = {
            id: this.id,
            user: this.user,
        };
        fetch('http://localhost:3000/users/prelong/' + this.props.match.params.id, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data)
        }).then(r=>{
            console.log("DEBUG=" + r);
            return r.json()
        })
            .then(r=>{
                console.log(r);
                if(r.status === 'failed') {
                    AlertFailure(r.reason);
                } else {
                    window.location.reload();
                    AlertSuccess("Przedłużono okres wypożyczenia");
                }
            });
    }
    
    BorrowBook = (event) =>
    {
        if(event) event.preventDefault();
        let data = {
            id: this.id,
            user: this.user,
        };
        fetch('http://localhost:3000/admin/order/' + this.props.match.params.id, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data)
        }).then(r=>{
            console.log("DEBUG=" + r);
            return r.json()
        })
            .then(r=>{
                console.log(r);
                if(r.status === 'failed') {
                    AlertFailure(r.reason);
                } else {
                    window.location.reload();
                    AlertSuccess("Wypożyczono pomyślnie");
                }
            });
    }
    
    ReturnBook = (event) =>
    {
        if(event) event.preventDefault();
        let data = {
            id: this.id,
            user: this.user,
        };
        fetch('http://localhost:3000/admin/return/' + this.props.match.params.id, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data)
        }).then(r=>{
            console.log("DEBUG=" + r);
            return r.json()
        })
            .then(r=>{
                console.log(r);
                if(r.status === 'failed') {
                    AlertFailure(r.reason);
                } else {
                    window.location.reload();
                    AlertSuccess("Oddano pomyślnie");
                }
            });
    }
    
    render() {
        return (
            <Fragment>
            <h1>Karta książki</h1>
            <table className={"table_horizontal_style"}>
                <tbody>
                <tr>
                    <th>Tytuł</th>
                    <td>{this.state.title}</td>
                </tr>
                <tr>
                    <th>Język</th>
                    <td>{this.state.lang}</td>
                </tr>
                <tr>
                    <th>Gatunek</th>
                    <td>{this.state.cat}</td>
                </tr>
                <tr>
                    <th>Wydawnictwo</th>
                    <td>{this.state.publ}</td>
                </tr>
                <tr>
                    <th>Autor</th>
                    <td>{this.state.auth}</td>
                </tr>
                </tbody>
            </table>
            {this.state.opt}
        </Fragment>
        );
    }
}

Book.propTypes = {};
