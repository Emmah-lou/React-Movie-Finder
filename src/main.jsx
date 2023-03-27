class MovieFinder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      results: [],
      error: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

    handleChange(event) {
      this.setState({searchTerm: event.target.value});
    }
    handleSubmit(event) {
      event.preventDefault();
      let { searchTerm } = this.state;
      const apiKey = "73740781";
      searchTerm = searchTerm.trim();
      if(!searchTerm) {
        return;
      }
      const checkStatus = (response) => {
        if(response.ok) {
          return response;
        }
        throw new Error(response.statusText);
      }
      const json = (response) => response.json();

      fetch(`https://www.omdbapi.com/?s=${searchTerm}&apikey=${apiKey}`)
        .then(checkStatus)
        .then(json)
        .then(data => {
          if(data.Response === "False") {
            throw new Error(data.Error);
          }
          if(data.Response === "True" && data.Search) {
            console.log(data.Search);
            this.setState({results: data.Search});
          }
        })
        .catch(error => 
          console.log(error));
          this.setState({results: []});
      

    }
    

    render() {
      const { searchTerm, results, error } = this.state;
      return (
        <div className="container">
          <div className="row">
            <div className="col-12">
              <form onSubmit={this.handleSubmit} className="form-inline my-4">
                <input
                  type="text"
                  className="form-control mr-sm-2"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={this.handleChange}
                />
                <button type="submit" className="btn btn-primary">Submit</button>
              </form>
              {(() => {
                if(error) {
                  return error;
                }
                return results.map((movie) => {
                  return <Movie key={movie.imdbID} movie={movie} />  
                })
              })()}
            </div>
          </div>
        </div>
      )
    }
   
}


const Movie = (props) => {
  const { Title, Year, Poster, Type, imdbID } = props.movie;

  return (
    <div className="row">
      <div className="col-4 col-md-3 mb-3">
        <a href={`https://www.imdb.com/title/${imdbID}/`} target="_blank">
          <img src={Poster} className="img-fluid" />
        </a>
      </div>
      <div className="col-8 col-md-9 mb-3">
        <a href={`https://www.imdb.com/title/${imdbID}/`} target="_blank">
          <h4>{Title}</h4>
          <p>{Type} | {Year}</p>
        </a>
      </div>
    </div>
  )
}

ReactDOM.render(
  <MovieFinder />,
  document.getElementById('root')
);
