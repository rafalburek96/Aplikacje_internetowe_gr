import React, {Component, Fragment} from 'react';
import {AlertFailure, AlertSuccess} from "../Misc/Alert";


export class AdminBooksOrders extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            loaded: false,
            orders: null,
            allowAccess: false
        }
    }

    componentDidMount() {
        fetch('http://localhost:3000/admin/orders', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        }).then(r=>r.json())
            .then(r=>{
                if(r.status === 'success') {
                    console.log(r);
                    var id = 0;
                    let orders = r.data.map((order) => {
                        id += 1;
                        var link = '../book/' + order.book_id;
                        var status = "Zarezerwowane";
                        if(order.status === 1)
                            status = "Wypożyczone";
                        else if(order.status === 2)
                            status = "Oddane";
                        return (
                            <tr key={id}>
                                <td><a className="link" href={link}>{order.id}</a></td>
                                <td><a className="link" href={link}>{order.user_email}</a></td>
                                <td><a className="link" href={link}>{order.book_id}</a></td>
                                <td><a className="link" href={link}>{status}</a></td>
                            </tr>
                        );
                    });
                    this.setState({orders: orders, allowAccess: true, loaded: true});
                } else {
                    if(r.reason)
                        AlertFailure(r.reason);
                    else {
                        console.log("Orders fetch error: " + JSON.stringify(r));
                        AlertFailure("Przeprszamy, nie udało się pobrać rezerwacji");
                    }
                }
                this.setState({loaded: true});
            });
    }

    deleteOrder(id)
    {
        if(!window.confirm('Czy napewno chcesz zatwierdzić to zamówienie?'))
            return;
        fetch('http://localhost:3000/admin/orders/confirm/' + id, {
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

    confirmOrder(id)
    {
        fetch('http://localhost:3000/admin/orders/delete/' + id, {
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

    render() {
        if(!this.state.loaded)
        {
            return (
                <Fragment>
                    <p style={{margin: '15px', textAlign: 'center'}}>Wczytuję dane o rezerwacjach...</p>
                </Fragment>
            );
        }
        if(this.state.allowAccess)
        {
            return (
                <Fragment>
                    <table className="table_style">
                        <thead>
                        <tr>
                            <td>Rezerwacja id</td>
                            <td>E-mail użytkownika</td>
                            <td>ID książki</td>
                            <td>Status</td>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.orders}
                        </tbody>
                    </table>
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

AdminBooksOrders.propTypes = {};