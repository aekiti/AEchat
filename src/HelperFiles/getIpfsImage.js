const getImage=(result)=> {
  const req = new XMLHttpRequest();
  req.responseType = "text/html";

  req.onload = function(e) {
    this.setState({imageUrl:req.response});
  }.bind(this);

  req.open('GET',`https://ipfs.io/ipfs/${result}`, true);
  req.send();
}

export default  getImage;