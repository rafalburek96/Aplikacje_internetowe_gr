import React, {Component, Fragment} from 'react';
import {AlertFailure} from "../Misc/Alert";

export class Search extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            books: null,
            lang: null,
            gern: null,
            publ: null,
        }
    }
    
    
    componentDidMount()
    {
        ////////////////////////////////////////////////////    GET LANGUAGES
        fetch('http://localhost:3000/languages', {
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
                    let id = 0;
                    let lang = r.data.map((lang) => {
                        id += 1;
                        return (
                            <option key={id} value={lang.language}>{lang.language}</option>
                        );
                    });
                    this.setState({lang: lang});
                }
            });
        
        ////////////////////////////////////////////////////    GET CATEGORIES
        fetch('http://localhost:3000/categories', {
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
                    let id = 0;
                    let gern = r.data.map((gern) => {
                        id += 1;
                        return (
                            <option key={id} value={gern.name}>{gern.name}</option>
                        );
                    });
                    this.setState({gern: gern});
                }
            });
        
        ////////////////////////////////////////////////////    GET PUBLISHERS
        fetch('http://localhost:3000/publishers', {
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
                    let id = 0;
                    let publ = r.data.map((publ) => {
                        id += 1;
                        return (
                            <option key={id} value={publ.name}>{publ.name}</option>
                        );
                    });
                    this.setState({publ: publ});
                }
            });
        
        this.postData()
    }

    query = '';
    lang = '';
    authorN = '';
    authorS = '';
    gern = '';
    publ = '';
    
    onQueryChange = (event) => {
        this.query = event.target.value;
    }
    onLangChange = (event) => {
        this.lang = event.target.value;
    }
    onAuthorNChange = (event) => {
        this.authorN = event.target.value;
    }
    onAuthorSChange = (event) => {
        this.authorS = event.target.value;
    }
    onGernChange = (event) => {
        this.gern = event.target.value;
    }
    onPublChange = (event) => {
        this.publ = event.target.value;
    };

    postData = (event) =>
    {
        if(event) event.preventDefault();
        let data = {
            query: this.query,
            lang: this.lang,
            authorN: this.authorN,
            authorS: this.authorS,
            gern: this.gern,
            publ: this.publ,
        };
        fetch('http://localhost:3000/search', {
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
                    let id = 0;
                    let books = r.map((books) => {
                        id += 1;
                        let link = 'book/' +  books.id;
                        return (
                            <tr key={id}>
                                <td><a className="link" href={link}>{books.title}</a></td>
                                <td><a className="link"  href={link}>{books.language}</a></td>
                                <td><a className="link"  href={link}>{books.category}</a></td>
                                <td><a className="link"  href={link}>{books.publisher}</a></td>
                                <td><a className="link"  href={link}>{books.name} {books.away}</a></td>
                            </tr>
                        );
                    });
                    this.setState({books: books});
                }
            });
    }

    render() {
        return (
            <Fragment>
            <form onSubmit={this.postData}>
                <div>
                    <h2>Wyszukiwanie książek</h2>
                        <table width="100%">
                            <tbody>
                            <tr>
                                <td width="100"><h3>Szukaj:</h3></td>
                                <td><input type="text" name={"query"} onChange={this.onQueryChange}/></td>
                                <td width="100"><input type={"submit"} value={"Szukaj"} style={{margin: '10px', width: '100px', height: '30px'}}/></td>
                            </tr>
                            </tbody>
                        </table>
                </div>
                <br/>
                <div>
                    <table width="100%">
                        <tbody>
                            <tr>
                                <td valign="top" width="300">
                                    <h3>Filtry wyszukiwania</h3>
                                    <table width="100%">
                                        <tbody>
                                            <tr>
                                                <td><b>Język:</b></td>
                                                <td><select name={"lang"} onChange={this.onLangChange}>
                                                <option value="">Wszystkie</option>
                                                {this.state.lang}
                                                </select></td>
                                            </tr>
                                            <tr>
                                                <td><b>Autor:</b></td>
                                            </tr>
                                            <tr>
                                                <td>Imię:</td>
                                                <td><input type="text" name={"authorN"} onChange={this.onAuthorNChange}/></td>
                                            </tr>
                                            <tr>
                                                <td>Nazwisko:</td>
                                                <td><input type="text" name={"authorS"} onChange={this.onAuthorSChange}/></td>
                                            </tr>
                                            <tr>
                                                <td><b>Gatunek:</b></td>
                                                <td><select name={"gern"} onChange={this.onGernChange}>
                                                <option value="">Wszystkie</option>
                                                {this.state.gern}
                                                </select></td>
                                            </tr>
                                            <tr>
                                                <td><b>Wydawnictwo:</b></td>
                                                <td><select name={"publ"} onChange={this.onPublChange}>
                                                <option value="">Wszystkie</option>
                                                {this.state.publ}
                                                </select></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <center>
                                    <input type={"submit"} value={"Zastosuj"} style={{margin: '10px', width: '100px', height: '30px'}}/>
                                    </center>
                                </td>
                                <td valign="top">
                                <h3>Wyniki wyszukiwania</h3>
                                <table className={"table_horizontal_style"}>
                                    <thead>
                                        <tr>
                                            <th>Tytuł</th>
                                            <th>Język</th>
                                            <th>Gatunek</th>
                                            <th>Wydawnictwo</th>
                                            <th>Autor</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.books}
                                    </tbody>
                                </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </form>
            </Fragment>
        );
    }
}

Search.propTypes = {};
