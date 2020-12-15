import React from "react";
import axios from "axios";
import "./JokeList.css";
import Joke from "./Joke";
import uuid from "uuid/dist/v4";
const JOKE_API = "https://icanhazdadjoke.com/";
class JokeList extends React.Component {
  static defaultProps = {
    numofJokes: 10,
  };
  constructor(props) {
    super(props);

    this.state = {
      jokes: JSON.parse(window.localStorage.getItem("jokes") || "[]"),
      loading: false,
    };
    this.alreadyJokes = new Set(this.state.jokes.map((j) => j.joke));

    this.handleClick = this.handleClick.bind(this);
  }
  async getJokes() {
    let array = [];
    while (array.length < this.props.numofJokes) {
      let res = await axios.get(JOKE_API, {
        headers: { accept: "application/json" },
      });

      let newJoke = res.data.joke;
      if (!this.alreadyJokes.has(newJoke)) {
        array.push({ id: uuid(), joke: newJoke, votes: 0 });
      } else {
        console.log("duplicate found!");
        console.log(newJoke);
      }
    }
    this.setState(
      { loading: false, jokes: [...this.state.jokes, ...array] },
      () =>
        window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
    );
  }
  componentDidMount() {
    if (this.state.jokes.length === 0) {
      this.getJokes();
    }
  }
  handleVote(id, value) {
    this.setState(
      {
        jokes: this.state.jokes.map((v) =>
          v.id === id ? { ...v, votes: v.votes + value } : v
        ),
      },
      () =>
        window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
    );
  }
  handleClick() {
    this.setState({ loading: true }, this.getJokes);
  }
  render() {
    if (this.state.loading) {
      return (
        <div className="JokeList-spinner">
          <i className="far fa-8x  em em-smiley fa-spin" />
          <h1 className="JokeList-title">Loading......</h1>
        </div>
      );
    }
    let jokes = this.state.jokes.sort((a, b) => b.votes - a.votes);
    return (
      <div className="JokeList">
        <div className="JokeList-sidebar">
          <h1 className="JokeList-title">
            <span>DAD</span> JOKES
          </h1>
          <img src="https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg" />
          <button className="JokeList-getmore" onClick={this.handleClick}>
            Want to get new jokes?
          </button>
        </div>

        <div className="JokeList-jokes">
          {jokes.map((j) => (
            <Joke
              key={j.id}
              joke={j.joke}
              votes={j.votes}
              Voting={() => this.handleVote(j.id, 1)}
              downVoting={() => this.handleVote(j.id, -1)}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default JokeList;
