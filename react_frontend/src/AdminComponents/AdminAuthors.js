import React, {Component, Fragment} from 'react';
import {AlertFailure, AlertSuccess} from "../Misc/Alert";
import {NavLink} from "react-router-dom";


export class AdminAuthors extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            loaded: false,
            authors: null,
            allowAccess: false
        }
    }

    name='';
    surname='';
    nationality='';
    birth_date='';


    onSurnameChange = (event) => {
        this.surname = event.target.value;
    };
    onNameChange = (event) => {
        this.name = event.target.value;
    };
    onNationalityChange = (event) => {
        this.nationality = event.target.value;
    };
    onBirthDateChange = (event) => {
        this.birth_date = event.target.value;
    };


    componentDidMount() {
        fetch('http://localhost:3000/authors', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        }).then(r=>r.json())
            .then(r=>{
                if(r.status === 'success') {
                    var id = 0;
                    let authors = r.data.map((author) => {
                        id += 1;
                        return (
                            <tr key={id}>
                                <td>{author.id}</td>
                                <td>{author.name}</td>
                                <td>{author.surname}</td>
                                <td>{author.nationality}</td>
                                <td>{author.birth_date}</td>
                                <td><NavLink to={"/admin/authors/edit/" + author.id}><button>Edytuj</button></NavLink></td>
                                <td><button onClick={this.deleteAuthor.bind(this, author.id)}>Usuń</button></td>
                            </tr>
                        );
                    });
                    this.setState({authors: authors, allowAccess: true, loaded: true});
                    document.getElementById("defaultTab").click();
                } else {
                    if(r.reason)
                        AlertFailure(r.reason);
                    else {
                        console.log("Author fetch error: " + JSON.stringify(r));
                        AlertFailure("Przeprszamy, nie udało się pobrać danych o autorze");
                    }
                }
                this.setState({loaded: true});
            });
    }

    deleteAuthor(id)
    {
        if(!window.confirm('Czy napewno chcesz usunąc tego autora?'))
            return;
        fetch('http://localhost:3000/admin/delete/author/' + id, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        }).then(r=>r.json()).then(r=>{
            if(r.status === 'failed') {
                AlertFailure(r.reason);
            } else {
                this.componentDidMount();
                AlertSuccess("Usunięto autora pomyślnie");
            }
        });
    }

    openTabLink(evt, name)
    {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++)
        {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++)
        {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        document.getElementById(name).style.display = "block";
        evt.currentTarget.className += " active";
    }

    validateForm(data)
    {
        if(!data.name)
        {
            AlertFailure("Podaj imię autora");
            return false;
        }
        if(!data.surname)
        {
            AlertFailure("Podaj nazwisko autora");
            return false;
        }
        if(!data.birth_date)
        {
            AlertFailure("Podaj datę urodzenia autora");
            return false;
        }
        if(!data.nationality)
        {
            AlertFailure("Podaj narodowość autora");
            return false;
        }
        return true;
    }

    onSubmit = (event) => {
        event.preventDefault();
        const data = { name: this.name, surname: this.surname, nationality: this.nationality, birth_date: this.birth_date };
        if(this.validateForm(data))
            this.postData(data);
    };

    postData(data)
    {
        fetch('http://localhost:3000/admin/add/author', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data)
        }).then(r=>r.json()).then(r=>{
            if(r.status === 'failed') {
                AlertFailure(r.reason);
            } else {
                this.componentDidMount();
                AlertSuccess("Utworzono autora pomyślnie");
            }
        });
    }

    render() {
        if(!this.state.loaded)
        {
            return (
                <Fragment>
                    <p style={{margin: '15px', textAlign: 'center'}}>Wczytuję dane o autorach...</p>
                </Fragment>
            );
        }
        if(this.state.allowAccess)
        {
            return (
                <Fragment>
                    <div>
                        <div className="tab">
                            <button className="tablinks" onClick={(evt) => this.openTabLink(evt, 'AllAuthors')} id="defaultTab">Lista autorów</button>
                            <button className="tablinks" onClick={(evt) => this.openTabLink(evt, 'AddAuthor')}>Dodaj autora</button>
                        </div>

                        <div id="AllAuthors" className="tabcontent">
                            <table className="table_style">
                                <thead>
                                <tr>
                                    <td>ID</td>
                                    <td>Imię</td>
                                    <td>Nazwisko</td>
                                    <td>Narodowość</td>
                                    <td>Data urodzenia</td>
                                    <td style={{width: '45px'}}>Edytuj</td>
                                    <td style={{width: '35px'}}>Usuń</td>
                                </tr>
                                </thead>
                                <tbody>
                                {this.state.authors}
                                </tbody>
                            </table>
                        </div>

                        <div id="AddAuthor" className="tabcontent">
                            <form onSubmit={this.onSubmit}>
                                <table className={"table_horizontal_style"}>
                                    <tbody>
                                    <tr>
                                        <td>Imię</td>
                                        <td><input type="text" name={"name"} onChange={this.onNameChange}/></td>
                                    </tr>
                                    <tr>
                                        <td>Nazwisko</td>
                                        <td><input type="text" name={"surname"} onChange={this.onSurnameChange}/></td>
                                    </tr>
                                    <tr>
                                        <td>Narodowość</td>
                                        <td><input type="text" name={"nationality"} onChange={this.onNationalityChange}/></td>
                                    </tr>
                                    <tr>
                                        <td>Data urodzenia (YYYY-MM-DD)</td>
                                        <td><input type="text" name={"date_birth"} onChange={this.onBirthDateChange}/></td>
                                    </tr>
                                    </tbody>
                                </table>
                                <div style={{textAlign: 'center'}}>
                                    <input type={"submit"} value={"Wyślij"} style={{margin: '10px', width: '100px', height: '30px'}}/>
                                </div>
                            </form>
                        </div>

                    </div>
                </Fragment>
            );
        } else {
            return (
                <Fragment>
                    <p style={{margin: '15px', textAlign: 'center'}}>Odmowa dostępu</p>
                </Fragment>
            );
        }

    }
}

AdminAuthors.propTypes = {};