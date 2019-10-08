import React from "react";
import { Query, Mutation } from "react-apollo";
import { Link } from "react-router-dom";
import Mutations from "../../graphql/mutations"
import Queries from "../../graphql/queries";
const { FETCH_HOME, FETCH_BIDS, FETCH_HOME_BIDS } = Queries;
const { CREATE_BID } = Mutations;

class HomeDetail extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      homeId: this.props.match.params.id,
      amount: "",
      message: ""
    }
  }

  update(field){
    return (e) => {
      this.setState({ [field]: e.target.value })
    }
  }

  updateCache(cache, { data }) {
    let bids;
    try {

      bids = cache.readQuery({ query: FETCH_BIDS });
    } catch (err) {
      return;
    }
    // if we had previously fetched homes we'll add our new home to our cache
    if (bids) {
      let bidsArray = bids.bids;
      let createBid = data.createBid;
      cache.writeQuery({
        query: FETCH_BIDS,
        data: { bids: bidsArray.concat(createBid) }
      });
    }
  }

  handleSubmit(e, func){
    e.preventDefault();
    func({
      variables: {
      homeId: this.state.homeId,
      amount: parseInt(this.state.amount),
      }
    }).then(() => this.setState({ amount: ""}))
  }
  
  render() {

    return (
      <Query query={FETCH_HOME} variables={{ id: this.props.match.params.id }}>
        {({ loading, error, data }) => {
          if (loading) return <div className="loading">Loading...</div>;
          if (error) return `Error! ${error.message}`;
            debugger
          let allBids = data.home.bids.map(bid => {
            return (
              <div className="show-bid-item">
                <h4>{bid.user.username}:</h4>
                <h3>${bid.amount}</h3>
              </div>
            )
          })
          return (
            <div className="home-show-container">
             
              <div className="home-show">
                <div className="show-pics-col">
                  <div className="show-photo">
                  Photo
                  </div>
                  <h2>Bids on this listing:</h2>
                 <div className="show-high-bid">
                    {allBids}
                 </div>
                  {/* <Query query={FETCH_HOME_BIDS} variables={{ _homeId: this.props.match.params.id }}>
                    {({ loading, error, data }) => {
                      if (loading) return <div className="loading">Loading...</div>;
                      if (error) return `Error! ${error.message}`;

                      let bidLis = data.homeBids.map(bid => (
                        <li key={bid._id}>{bid.amount}&nbsp;by&nbsp;{bid.user.username}</li>
                      ))
                      return (
                        <div className="show-high-bid">
                          <ul>
                          {bidLis}
                          </ul>
                        </div>
                      )}}
                  </Query> */}
                </div>
                <div className="show-info-col">
                  <div className="show-bidding-box">
                    <Mutation
                      mutation={CREATE_BID}
                      onError={err => this.setState({ message: err.message })}
                     
                      update={(cache, data) => this.updateCache(cache, data)}
        
                      onCompleted={data => {
                        // const { amount } = data.createBid;
                        this.setState({
                          message: `Bid placed successfully`
                        });
                      }}
                    >
                      {(createBid, { data }) => (
                        <div className="bid-form-container">
                          <form className="bid-form" onSubmit={e => this.handleSubmit(e, createBid)}>
                            <h3>Enter a bid for this home:</h3>
                            <input className="bid-input" type="number" value={this.state.amount} onChange={this.update('amount')}/>
                            <input className="bid-submit" type="submit" value="Bid Now"/>
                          </form>
                          <div className="bid-success">
                            <h5>{this.state.message}</h5>
                          </div>
                        </div>
                      )}
                    </Mutation>
                  </div>
                  <div className="show-info-box" key={data.home._id}>
                    <h1 className="show-info-text">{data.home.name}</h1>
                    <h2 className="show-info-text">{data.home.description}</h2>
                    <h5 className="show-info-text">Year built: {data.home.yearBuilt}</h5>
                    <h5 className="show-info-text">{data.home.streetAddress}</h5>
                    <h5 className="show-info-text">{data.home.city}</h5>
                    <h5 className="show-info-text">{data.home.state}</h5>
                    <h5 className="show-info-text">{data.home.zipcode}</h5>
                    <h5 className="show-info-text">{data.home.sqft} sqft.</h5>
                    <h5 className="show-info-text">{data.home.stories} stories</h5>
                    <h5 className="show-info-text">{data.home.bathrooms}  bathrooms</h5>
                    <h5 className="show-info-text">{data.home.bedrooms} bedrooms</h5>
                  
                  </div>
                </div>
              </div>
               <Link className="back-to-home-link" to="/">Back to home</Link>
            </div>
          );
        }}
      </Query>
    );
  };
}
export default HomeDetail;