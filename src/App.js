import './App.css';
import React from 'react';
import Header from './Heading';


function App() {
  return (
        <MyComponent/>
    );
 }

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      results: [],
      limit: "25",
      searchInput: ""
    };
  }

  componentDidMount() {
    fetch("http://localhost:8080/search/" + this.searchInput)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  handleChange = (e) =>{
      this.setState({
          searchInput: e.target.value,
          results: []
      })
  }

  handleChangeLimit = (e) => {
      const input = parseInt(e.target.value);
      if(input >= 5 && input <= 50){
          this.setState({
              limit: input
          })
      }
      else if(input > 50){
          this.setState({
              limit: "50"
          })
      }
      else if(input < 5){
          this.setState({
              limit: "5"
          })
      }
  }

  handleClick = (e) =>{
      fetch("http://localhost:8080/search/" + this.state.searchInput+"&limit="+this.state.limit)
          .then(res => res.json())
          .then(
              (result) => {
                  this.setState({
                      results: jsonSorter(result)
                  });
              },
              (error) => {
                  this.setState({
                      isLoaded: true,
                      error
                  });
              }
          )
}

  limitUp = () =>{
      if(parseInt(this.state.limit) < 50){
          this.setState({
              limit: (parseInt(this.state.limit)+1).toString()
          })}
  }

  limitDown = () =>{
      if(parseInt(this.state.limit) > 5){
          this.setState({
              limit: (parseInt(this.state.limit)-1).toString()
          })
      }
  }

  setIsPressedTrue = ()=> {
    this.handleClick();
    this.setState({
        ...this.state,
        showResults: true
    });
  }
  render() {
    const { error, isLoaded,results } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div className='centered'>Loading...</div>;
    } else {
      return (
          <div className='centered'>
              <LimitChanger change={this.handleChangeLimit} up={this.limitUp} down={this.limitDown} limit={this.state.limit} />

            <h3>Search for Songs Here</h3>
              <input type='text' onChange={this.handleChange}/>
            <br/>
            {this.state && <ResultsButton showResults={this.setIsPressedTrue}/>}
            {this.state.showResults && <Results input={this.state.searchInput} results = {results}/>}
          </div>
      );
    }
  }
}

const Results = (props) =>{
  return (
      <div>
        <Header text = "Results for " name = {props.input}/>
        <ul>
          {props.results.map(index => <ListItem name={index.name} artists ={index.artists} image = {index.image} preview ={index.preview}/>)}
        </ul>
      </div>
  );
}

const ResultsButton = (props) =>{
  return <button onClick = {props.showResults}>Test Me Out!</button>
}

const jsonSorter = (json) =>{
    let trackNames = [];
    let trackArtists = [];
    let results = [];
    let itemsInfo = json.tracks.items;
    for(let i = 0; i < itemsInfo.length; i++) {
        trackNames = "";
       trackArtists = [];
       trackNames = (itemsInfo[i].name)
        for(let j = 0; j < itemsInfo[i].artists.length;j++){
            let placeHolder = itemsInfo[i].artists.length > 1 &&  j !== itemsInfo[i].artists.length-1 ? " & " : "";
            trackArtists.push(itemsInfo[i].artists[j].name + placeHolder)
        }
        let image = itemsInfo[i].album.images[0].url;
        let preview = itemsInfo[i].preview_url;
        results.push({"name": trackNames, 'artists' : trackArtists, 'image': image, "preview": preview});
    }
    return results;
}

const ListItem = (props) => {
    return(
      <div>
          <img className="centeredImg" src = {props.image} alt={""}/>
          <p className='centered'>{props.name}: {props.artists}</p>
          <ShowAudio preview = {props.preview}/>
      </div>
)}

const ShowAudio = (props) => {
    return( props.preview != null ?
        <div>
    <audio controls id="centeredImg">
        <source
            src={props.preview}
            type="audio/mpeg"
        />
    </audio>
        </div>:
            <h3>No Preview Available</h3>
    );
}

const LimitChanger = (props) =>{
    return(
        <div>
            <div id={"Number"}>
                <h4 id={'numberText'}>How many results do you want? (5-20) </h4>
                <input onChange={props.change} value={props.limit} id={"NumberInput"} maxLength={2} type={'text'}/>
            <button onClick={props.down} className={'upDown'} >-1</button>
            <button onClick={props.up} className={'upDown'} >+1</button>
            </div>
        </div>
    );
}

export default App;