import React, {Component, Fragment} from 'react';
import {AlertFailure, AlertSuccess} from "../Misc/Alert";
import {NavLink} from "react-router-dom";


export class AdminPublishers extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            loaded: false,
            publishers: null,
            allowAccess: false
        }
    }

    name='';
    onNameChange = (event) => {
        this.name = event.target.value;
    };


    componentDidMount() {
        fetch('http://localhost:3000/publishers', {
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
                    let publishers = r.data.map((publisher) => {
                        id += 1;
                        return (
                            <tr key={id}>
                                <td>{publisher.name}</td>
                                <td><NavLink to={"/admin/publishers/edit/" + publisher.name}><button>Edytuj</button></NavLink></td>
                                <td><button onClick={this.deletePublisher.bind(this, publisher.name)}>Usuń</button></td>
                            </tr>
                        );
                    });
                    this.setState({publishers: publishers, allowAccess: true, loaded: true});
                    document.getElementById("defaultTab").click();
                } else {
                    if(r.reason)
                        AlertFailure(r.reason);
                    else {
                        console.log("Publisher fetch error: " + JSON.stringify(r));
                        AlertFailure("Przeprszamy, nie udało się pobrać danych o wydawnictwie");
                    }
                }
                this.setState({loaded: true});
            });
    }

    deletePublisher(name)
    {
        if(!window.confirm('Czy napewno chcesz usunąc to wydawnictwo?'))
            return;
        fetch('http://localhost:3000/admin/delete/publisher/' + name, {
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
                AlertSuccess("Usunięto wydawnictwo pomyślnie");
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
            AlertFailure("Podaj nazwę wydawnictwa");
            return false;
        }
        return true;
    }

    onSubmit = (event) => {
        event.preventDefault();
        const data = { name: this.name };
        if(this.validateForm(data))
            this.postData(data);
    };

    postData(data)
    {
        fetch('http://localhost:3000/admin/add/publisher', {
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
                AlertSuccess("Utworzono wydawnictwo pomyślnie");
            }
        });
    }

    render() {
        if(!this.state.loaded)
        {
            return (
                <Fragment>
                    <p style={{margin: '15px', textAlign: 'center'}}>Wczytuję dane o kategoriach...</p>
                </Fragment>
            );
        }
        if(this.state.allowAccess)
        {
            return (
                <Fragment>
                    <div>
                        <div className="tab">
                            <button className="tablinks" onClick={(evt) => this.openTabLink(evt, 'AllPublishers')} id="defaultTab">Lista kategorii</button>
                            <button className="tablinks" onClick={(evt) => this.openTabLink(evt, 'AddPublisher')}>Dodaj kategorię</button>
                        </div>

                        <div id="AllPublishers" className="tabcontent">
                            <table className="table_style">
                                <thead>
                                <tr>
                                    <td>Nazwa kategorii</td>
                                    <td style={{width: '45px'}}>Edytuj</td>
                                    <td style={{width: '35px'}}>Usuń</td>
                                </tr>
                                </thead>
                                <tbody>
                                {this.state.publishers}
                                </tbody>
                            </table>
                        </div>

                        <div id="AddPublisher" className="tabcontent">
                            <form onSubmit={this.onSubmit}>
                                <table className={"table_horizontal_style"}>
                                    <tbody>
                                    <tr>
                                        <td>Nazwa kategorii</td>
                                        <td><input type="text" name={"name"} onChange={this.onNameChange}/></td>
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

AdminPublishers.propTypes = {};