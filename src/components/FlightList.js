import React, { Component } from "react";
import axios from "axios";

const Flights = (props) => {
    const { flight = {} } = props;
    return (
        <div className="flight">
            <div className="row">
                <div>{flight.departure}</div>
                <div>{flight.arrival}</div>
                <div>{flight.price}</div>
            </div>
            <div className="row">
                <div>{flight.seatAvaible}</div>
                <div>{flight.duration}</div>
                <div>{flight.fName}</div>
            </div>
        </div>
    )
}
const Loader = () => {
    return (
        <div className="spinner-border m-4" role="status">
            <span className="sr-only">Loading...</span>
        </div>
    )
}
export default class FlightList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            flights: [],
            source: "",
            destination: "",
            index: 0,
            fetching: false,
            loadMore: true
        }
    }
    componentDidMount() {
        window.addEventListener('scroll', (e) => {
            this.handleScroll(e);
        });
    }
    handleScroll = (e) => {
        if ((window.innerHeight + window.pageYOffset < document.body.offsetHeight) || !this.state.loadMore) return;
        console.log("Fetching More items...");
        if (this.state.fetching) {
            return;
        }

        this.setState(prevState => ({
            fetching: true
        }), () => {
            this.loadData(e);
        });



    }

    loadData = (e) => {
        e.preventDefault();
        const { source, destination, index, flights } = this.state;
        if (source && destination) {
            const url = `http://localhost:8080/searchFlights?source=${source}&destination=${destination}&index=${index}`;
            axios.get(url).then(res => {
                const { data: { result = [] } } = res;
                console.log("result", result)

                if (result.length) {
                    this.setState(prevState => ({
                        flights: [...flights, ...result],
                        fetching: false,
                        index: prevState.index + result.length
                    }))
                } else {
                    this.setState({
                        fetching: false,
                        loadMore: false
                    })
                }



            }).catch(err => {
                console.log("error", err);
            });

        }

    }
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    swapInput = (e) => {
        this.setState({
            source: this.state.destination,
            destination: this.state.source,
            flights: [],
            loadMore: true,
            index: 0
        }, () => {
            this.loadData(e);
        });

    }
    handleSearch = (e) => {
        e.preventDefault();
        this.setState({
            flights: [],
            loadMore: true,
            index: 0
        }, () => {
            this.loadData(e);
        })
    }
    render() {
        return (
            <div className="container">
                <div className="search-box">
                    <form onSubmit={this.handleSearch}>
                        <div className="form-group row">
                            <div className="col-xs-2">
                                <label htmlFor="source">From</label>
                                <input onChange={this.handleChange} value={this.state.source} name="source" className="form-control" id="source" type="text" />
                            </div>
                            <div onClick={this.swapInput} className="arrow-conatiner">
                                <span className="arrow left-arrow">
                                </span>
                                <span className="arrow right-arrow">
                                </span>
                            </div>
                            <div className="col-xs-2">
                                <label htmlFor="destination">To</label>
                                <input onChange={this.handleChange} value={this.state.destination} name="destination" className="form-control" id="destination" type="text" />
                            </div>
                            <div className="col-xs-2 search-btn">
                                <input value="Search" className="btn btn-primary" type="submit" />
                            </div>
                        </div>
                    </form>
                </div>
                <header>
                    <div className="heading">
                        <h5>Departure</h5>
                        <h5>Arrival</h5>
                        <h5>Price</h5>
                    </div>
                    <div className="heading">
                        <h5>Seat Available</h5>
                        <h5>Duration</h5>
                        <h5>Flight Name</h5>
                    </div>
                </header>
                <section>
                    {this.state.flights.map((el, i) => {

                        return <Flights flight={el} key={el.fNumner} />
                    })}
                </section>
                {this.state.fetching && <Loader />}
            </div>
        )
    }
}