function activate(){
  new Juniper({
    repo: 'napsternxg/SocialMediaDownloader',
    useStorage: true
  });

    // listen to status updates
    document.addEventListener('juniper', ev =>
                              console.log('Status:', ev.detail.status))
}

function parseOutput(){
  const outputNode = document.querySelector('body > div.juniper-cell > div.juniper-output > div > div > div.p-Widget.jp-RenderedText.jp-mod-trusted.jp-OutputArea-output > pre');
  localStorage.setItem("sctg_data", outputNode.textContent);
}

function getData(){
  const data = JSON.parse(localStorage.getItem("sctg_data"));
  const dataStatusNode = d3.select("#dataStatus");
  const search_query = localStorage.getItem("sctg_query");
  var status = "No data in localStorage."
  if(data){
    console.log(data);
    status = `Found ${data.length} tweets for ${search_query}`;
  } 
  dataStatusNode.html(status);
}

function getCredentials(){
  const credentials = {
    consumer_key: d3.select("#consumer_key").property("value"),
    consumer_secret: d3.select("#consumer_secret").property("value"),
    access_token_key: d3.select("#access_token_key").property("value"),
    access_token_secret: d3.select("#access_token_secret").property("value"),
  }
  
  if(
    credentials.consumer_key 
    && credentials.consumer_secret
    && credentials.access_token_key
    && credentials.access_token_secret
  ){
    console.log("Saving in local storage");
    localStorage.setItem("twitter_credentials", JSON.stringify(credentials));
  }  
  return credentials;
}

function updateCode(){
  const credentials = getCredentials();
  const search_query = d3.select("#search_query").property("value");
  localStorage.setItem("sctg_query", search_query);
  const code_block = document.querySelector("pre");
  code_block.textContent = `
from twarc import Twarc
import json
credentials = \{
  "consumer_key": "${credentials.consumer_key}",
  "consumer_secret": "${credentials.consumer_secret}",
  "access_token": "${credentials.access_token_key}",
  "access_token_secret": "${credentials.access_token_secret}"
\}
twarc_obj = Twarc(**credentials)
data = []
for t in twarc_obj.search("${search_query}", max_pages=5):
  data.append(t)
print(json.dumps(data))
  `;
  activate();
}

(() => {
  const credentials = JSON.parse(localStorage.getItem("twitter_credentials"));
  if(credentials){
    d3.select("#consumer_key").property("value", credentials.consumer_key);
    d3.select("#consumer_secret").property("value", credentials.consumer_secret);
    d3.select("#access_token_key").property("value", credentials.access_token_key);
    d3.select("#access_token_secret").property("value", credentials.access_token_secret);
  }
  getData();
})();