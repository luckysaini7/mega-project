const coinContainer = document.querySelector('.coin-info-container');
const coinInfoLeftContainer = document.querySelector('.coin-info-left-container');
const coinInfoRightContainer = document.querySelector('.coin-info-right-container');

const telegramElement = '<i class="fa-brands fa-telegram"></i>';
const xElement = '<i class="fa-brands fa-x-twitter"></i>'
const redditElement = '<i class="fa-brands fa-reddit"></i>'
const globeElement = '<i class="fa-solid fa-globe"></i>'
const facebookElement = '<i class="fa-brands fa-facebook"></i>'
const instagramElement = '<i class="fa-brands fa-instagram"></i>'
const githubElement = '<i class="fa-brands fa-github"></i>'
const youtubeElement = '<i class="fa-brands fa-youtube"></i>'

const url = `https://coinranking1.p.rapidapi.com/coin/${localStorage.getItem('coin-id')}`;
const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': '6b6bc6ac2bmsh6aa16fb1ed047ccp13b9bajsnbea6005264a4',
		'x-rapidapi-host': 'coinranking1.p.rapidapi.com'
	}
};

(async function() {
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        const data = result.data.coin;
        console.log(data);
        document.title = data.name;
        renderCoinData(data)
        renderLeftDescData(data)
        renderRightDescData(data)
        document.querySelector('.loader-parent').classList.add('inactive')
    } catch (error) {
        console.error('Fetch error:', error);
    }
    
})();

function renderCoinData(data){
    console.log('coin',data);
    
  const box = document.createElement('div')
  box.className='coin_data'
  box.innerHTML=`
    <span class="rank"># ${data.rank}</span>
                <div class="coin">
                    <img src=${data.iconUrl} alt=${data.name+'-img'}>
                
                <div class="name-price">
                    <span class="name" style='color : ${data.color}'>${data.name}</span>
                    <span class="price">$ ${Number(data.price).toFixed(5)} <span class=${data.change[0] === '-' ? 'neg-change' : 'pos-change'}>${data.change[0]  === '-' ? data.change.slice(1) : data.change}% </span></span>
                </div>
                </div>
  `
  coinContainer.appendChild(box);
}

function handleLogo(type){
    switch(type){
        case 'telegram' : return telegramElement;

         case 'reddit' : return redditElement;
         
         case 'x' : return xElement;

         case 'instagram' : return instagramElement;

         case 'facebook' : return facebookElement;

         case 'github' : return githubElement

         case 'youtube' : return youtubeElement
         default : return globeElement
        
    }
}

function renderLeftDescData(data){
   const card = document.createElement('div');
   card.className = 'left-card'
   console.log(data.links)
   card.innerHTML = `<p>${data.description}</p>
                      <div>Website : <a href=${data.websiteUrl} target='_blank'>${data.websiteUrl}</a></div>
                      <div class='social-media-links'>
                      ${

                        data.links.map(item => `<a href = ${item.url} target='_blank'>${handleLogo(item.type)} <span>${item.name}</span></a>`).join('')
                
                        }
                      
                      </div>
   `
   

 
   coinInfoLeftContainer.appendChild(card);
}

function renderRightDescData(data){
    const card = document.createElement('div');
    card.className = 'right-card'
    card.innerHTML = `<p class='right-card-child'><span><strong>24h Volume : </strong></span><span>$${(data['24hVolume']/1000000000).toFixed(2)} <strong>B</strong></span></p>
                        <p class='right-card-child'><span><strong>All Time High : </strong></span><span>$${Number(data.allTimeHigh.price).toFixed(2)}<span></p>
                        <p class='right-card-child'><span><strong>Fully Diluted Market Cap : </strong></span><span>$${(data.fullyDilutedMarketCap/1000000000).toFixed(2)} <strong>B</strong><span></p>
                        <p class='right-card-child'><span><strong>Market Cap : </strong></span><span>$${(data.marketCap/1000000000).toFixed(2)} <strong>B</strong><span></p>
                        <p class='right-card-child'><span><strong>Circulating Supply : </strong></span><span>${(data.supply.circulating/1000000).toFixed(2)} <strong>M</strong><span></p>
                        <p class='right-card-child'><span><strong>Total Supply : </strong></span><span>${(data.supply.total/1000000).toFixed(2)} <strong>M</strong><span></p>

    `


    coinInfoRightContainer.appendChild(card);
}