import React, {Component} from 'react';
import Navbar from '../components/NavBar';
import {Link } from 'react-router-dom';
import axios  from 'axios';
import './Home.css';

class Home extends Component {

    state = {
        booksList : [],
        errorMsg : ''
    }

    componentDidMount = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://library-management-system-velocity.onrender.com/books', {
            headers: { Authorization: `Bearer ${token}` }
            });

            const shuffled = response.data.sort(() => Math.random() - 0.5);
            const randomFour = shuffled.slice(0, 4);

            this.setState({ booksList: randomFour });
        } catch (err) {
            this.setState({ errorMsg: err.message });
        }
    }

    render() {
        const {booksList, errorMsg} = this.state
        return (
            <div className="home">
                <Navbar />
                <div className="hero">
                    <h1>Find your next great read</h1>
                    <p>Borrow books, Track your reading, Manage your library all in one place.</p>
                    <Link to="/books" className="hero-btn">Browse Books</Link>
                </div>

                <div className="featured-section">
                    <h2>Featured Books</h2>
                    <h1>{errorMsg}</h1>
                    <div className="book-grid">
                    {booksList.map(each => (
                        <div className="book-card" key={each.id}>
                            <img src={each.cover_url} alt={each.title} />
                            <p className="book-title">{each.title}</p>
                        </div>
                    ))}
                    </div>
                </div>
            </div>
        );
    }
  
}

export default Home;
