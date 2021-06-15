import React, {Component, Fragment} from 'react';
import {AlertFailure, AlertSuccess} from "../Misc/Alert";
import {NavLink} from "react-router-dom";


export class AdminCategories extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            loaded: false,
            categories: null,
            allowAccess: false
        }
    }

    name='';
    onNameChange = (event) => {
        this.name = event.target.value;
    };


    componentDidMount() {
        fetch('http://localhost:3000/categories', {
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
                    let categories = r.data.map((category) => {
                        id += 1;
                        return (
                            <tr key={id}>
                                <td>{category.name}</td>
                                <td><NavLink to={"/admin/categories/edit/" + category.name}><button>Edytuj</button></NavLink></td>
                                <td><button onClick={this.deleteCategory.bind(this, category.name)}>Usuń</button></td>
                            </tr>
                        );
                    });
                    this.setState({categories: categories, allowAccess: true, loaded: true});
                    document.getElementById("defaultTab").click();
                } else {
                    if(r.reason)
                        AlertFailure(r.reason);
                    else {
                        console.log("Category fetch error: " + JSON.stringify(r));
                        AlertFailure("Przeprszamy, nie udało się pobrać danych o kategorii");
                    }
                }
                this.setState({loaded: true});
            });
    }

    deleteCategory(name)
    {
        if(!window.confirm('Czy napewno chcesz usunąc tą kategorię?'))
            return;
        fetch('http://localhost:3000/admin/delete/category/' + name, {
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
                AlertSuccess("Usunięto kategorię pomyślnie");
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
            AlertFailure("Podaj nazwę kategorii");
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
        fetch('http://localhost:3000/admin/add/category', {
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
                AlertSuccess("Utworzono kategorię pomyślnie");
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
                            <button className="tablinks" onClick={(evt) => this.openTabLink(evt, 'AllCategories')} id="defaultTab">Lista kategorii</button>
                            <button className="tablinks" onClick={(evt) => this.openTabLink(evt, 'AddCategory')}>Dodaj kategorię</button>
                        </div>

                        <div id="AllCategories" className="tabcontent">
                            <table className="table_style">
                                <thead>
                                <tr>
                                    <td>Nazwa kategorii</td>
                                    <td style={{width: '45px'}}>Edytuj</td>
                                    <td style={{width: '35px'}}>Usuń</td>
                                </tr>
                                </thead>
                                <tbody>
                                {this.state.categories}
                                </tbody>
                            </table>
                        </div>

                        <div id="AddCategory" className="tabcontent">
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

AdminCategories.propTypes = {};