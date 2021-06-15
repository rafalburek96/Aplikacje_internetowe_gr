import React, {Component, Fragment} from 'react';
import {AlertFailure, AlertSuccess} from "../Misc/Alert";
import {NavLink} from "react-router-dom";


export class AdminLanguages extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            loaded: false,
            languages: null,
            allowAccess: false
        }
    }

    name='';
    onNameChange = (event) => {
        this.name = event.target.value;
    };


    componentDidMount() {
        fetch('http://localhost:3000/languages', {
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
                    let languages = r.data.map((language) => {
                        id += 1;
                        return (
                            <tr key={id}>
                                <td>{language.language}</td>
                                <td><NavLink to={"/admin/languages/edit/" + language.language}><button>Edytuj</button></NavLink></td>
                                <td><button onClick={this.deleteLanguage.bind(this, language.language)}>Usuń</button></td>
                            </tr>
                        );
                    });
                    this.setState({languages: languages, allowAccess: true, loaded: true});
                    document.getElementById("defaultTab").click();
                } else {
                    if(r.reason)
                        AlertFailure(r.reason);
                    else {
                        console.log("Language fetch error: " + JSON.stringify(r));
                        AlertFailure("Przeprszamy, nie udało się pobrać danych o języku");
                    }
                }
                this.setState({loaded: true});
            });
    }

    deleteLanguage(language)
    {
        if(!window.confirm('Czy napewno chcesz usunąc ten język?'))
            return;
        fetch('http://localhost:3000/admin/delete/language/' + language, {
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
                AlertSuccess("Usunięto język pomyślnie");
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
        if(!data.language)
        {
            AlertFailure("Podaj język");
            return false;
        }
        return true;
    }

    onSubmit = (event) => {
        event.preventDefault();
        const data = { language: this.name };
        if(this.validateForm(data))
            this.postData(data);
    };

    postData(data)
    {
        fetch('http://localhost:3000/admin/add/language', {
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
                AlertSuccess("Utworzono język pomyślnie");
            }
        });
    }

    render() {
        if(!this.state.loaded)
        {
            return (
                <Fragment>
                    <p style={{margin: '15px', textAlign: 'center'}}>Wczytuję dane o językach...</p>
                </Fragment>
            );
        }
        if(this.state.allowAccess)
        {
            return (
                <Fragment>
                    <div>
                        <div className="tab">
                            <button className="tablinks" onClick={(evt) => this.openTabLink(evt, 'AllLanguages')} id="defaultTab">Lista języków</button>
                            <button className="tablinks" onClick={(evt) => this.openTabLink(evt, 'AddLanguage')}>Dodaj język</button>
                        </div>

                        <div id="AllLanguages" className="tabcontent">
                            <table className="table_style">
                                <thead>
                                <tr>
                                    <td>Nazwa języka</td>
                                    <td style={{width: '45px'}}>Edytuj</td>
                                    <td style={{width: '35px'}}>Usuń</td>
                                </tr>
                                </thead>
                                <tbody>
                                {this.state.languages}
                                </tbody>
                            </table>
                        </div>

                        <div id="AddLanguage" className="tabcontent">
                            <form onSubmit={this.onSubmit}>
                                <table className={"table_horizontal_style"}>
                                    <tbody>
                                    <tr>
                                        <td>Nazwa języka</td>
                                        <td><input type="text" name={"language"} onChange={this.onNameChange}/></td>
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

AdminLanguages.propTypes = {};