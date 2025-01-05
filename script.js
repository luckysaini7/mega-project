
const globalStatsContainer = document.getElementsByClassName('global-overview-container')[0];
const coinsDataContainer= document.getElementsByClassName('coin-list-body')[0];
const searchInput = document.getElementById('search-input')
const  paginationContainer = document.querySelector('.pagination-container')
let coinsData = null;
let wishlistData = [];
if(JSON.parse(localStorage.getItem('wishlist-data'))) wishlistData = JSON.parse(localStorage.getItem('wishlist-data'));
let searchValue = '';
 
console.log(wishlistData)
  searchInput.addEventListener('input',() => {
    searchValue = searchInput.value;

     handleSearch(searchValue)
    
  })
  
  function  handleSearch(searchValue){ 
  const filteredData =  coinsData.filter((item) => item.name.toLowerCase().includes(searchValue.trim().toLowerCase()));
    // console.log('filteredData',filteredData)
    renderCoins(filteredData)
  }
  

const baseUrl = 'https://coinranking1.p.rapidapi.com';
const globalStatsUrl = baseUrl+'/stats'
const coinsListUrl = baseUrl+'/coins?limit=500' 
const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': '6b6bc6ac2bmsh6aa16fb1ed047ccp13b9bajsnbea6005264a4',
		'x-rapidapi-host': 'coinranking1.p.rapidapi.com'
	}
};

// Fetching GlobalStats
try {
   ( async () => {
       const response = await fetch(globalStatsUrl, options);
       const result = await response.json();
       const data = result.data;
       const globalSubContainer = document.createElement('div');
       globalSubContainer.classList = 'global-sub-container';
       globalSubContainer.innerHTML = ` <div><strong>Total Market Cap : </strong>$${(data.totalMarketCap/1000000000000).toFixed(2)} Trillion </div>
                <div><strong>Total 24h Volume : </strong>$${(data.total24hVolume/1000000000).toFixed(2)} Billion</div>
                <div><strong>Total Exchanges : </strong>${data.totalExchanges}</div>
                <div><strong>Total Coins : </strong>${data.totalCoins}</div>
                <div><strong>BTC Dominance : </strong>${(data.btcDominance).toFixed(2)}</div>`
          globalStatsContainer.appendChild(globalSubContainer)  
           
              document.querySelector('.loader-parent').classList.add('inactive')
            
       
    })()
} catch (error) {
  console.error(error);
}

// Fetching CoinsList
try{
  ( async () => {
    const response = await fetch(coinsListUrl, options);
    const result = await response.json();
    const coinsListData = result.data.coins
    coinsData = coinsListData;
    // console.log('result',coinsData)
    renderCoins(coinsListData)
    pagination(coinsData)
  })()
}
catch(error){
  console.log(error)
}

  function handleWishlist(name){
     console.log('name',name);
     
  }

  let pageCount = 1;
  if(!localStorage.getItem('page-count')){
   
    localStorage.setItem('page-count',JSON.stringify(pageCount))
  }
   


function renderCoins(coins){
  // console.log(coins)
  while(coinsDataContainer.firstChild ) coinsDataContainer.removeChild(coinsDataContainer.firstChild)
     const pageCount =JSON.parse(localStorage.getItem('page-count'))
   coins.slice((pageCount-1)*50,(pageCount*50)).forEach((item,idx) => {
    const row = document.createElement('tr')
      row.id = item.uuid
    let isIconFilled = false;
     //for loop
     wishlistData.forEach(i => {
      if(i.rank === item.rank){
        isIconFilled = true;
        return;
      }
     })
    row.innerHTML = `
                      <td class='rank-cell'> 
                      <span  class = 'wishlist-icon'>
                      <i onclick='handleWishlist(event,"wishlist-icon-${item.rank}",${JSON.stringify(item)})' 
                      id=${'wishlist-icon-'+ item.rank} 
                      class="${isIconFilled ? "fa-star fa-solid" : "fa-star fa-regular"}"></i></span>
                      <span>${item.rank}</span>
                      </td>
                      <td class='coin-name-icon'>
                      <img src=${item.iconUrl} alt=${item.name+'-logo'}/>
                      <span>${item.name}</span>
                      </td>   
                      <td><i class="fa-solid fa-dollar-sign"></i>${Number(item.price).toFixed(5)}</td>
                      <td class=${item.change[0] === '-' ? 'neg-change' : 'pos-change'}>
                      ${item.change[0]  === '-' ? item.change.slice(1) : item.change}
                      %
                      </td>
                      <td><i class="fa-solid fa-dollar-sign"></i>${(Number(item.marketCap)/100000000).toFixed(2)} B</td>
    `
    coinsDataContainer.appendChild(row)
      row.addEventListener('click',() => {
          localStorage.setItem('coin-id',row.id)
        location.href = 'coinPage.html'
      })
   })

   document.getElementsByClassName('loader-parent')[1].classList.add('inactive')
}


const wishlistIcons = document.querySelectorAll('.wishlist-icon');

function handleWishlist(event,id,item){
  event.stopPropagation()
  
  if(document.getElementById(id).className === 'fa-star fa-regular'){
    document.getElementById(id).classList.remove('fa-regular')
    document.getElementById(id).classList.add('fa-solid')
    wishlistData.push(item)
    localStorage.setItem('wishlist-data',JSON.stringify(wishlistData))
    location.reload()
  }
  else{
    document.getElementById(id).classList.add('fa-regular')
    document.getElementById(id).classList.remove('fa-solid')
    const rankId = id.split('-')[2] 
    console.log(rankId)
  const filteredData =   wishlistData.filter(item => item.rank != rankId);
  console.log('filteredData',filteredData);
  
   localStorage.setItem('wishlist-data',JSON.stringify(filteredData))
   location.reload()
  }

}

function pagination(coinsData){
  const numberOfBoxes = coinsData.length/50;
  for(let i = 0; i < numberOfBoxes;i++){
    const box = document.createElement('div');
    box.className = 'page-box'
    box.id = `page-box-${i+1}`
    box.innerText = i+1;
    paginationContainer.appendChild(box)
    
    if(JSON.parse(localStorage.getItem('page-count'))-1 === i){
       box.classList.add('active')
      }

    box.addEventListener('click',(e) => {
      pageCount = e.target.id.split('-')[2];
     for(let box of document.getElementsByClassName('page-box')){
        if(box.className === 'page-box active'){
          box.classList.remove('active')
     }
      }
      box.classList.add('active')
      localStorage.setItem('page-count',JSON.stringify(pageCount))

      renderCoins(coinsData)
    })
  }
}




