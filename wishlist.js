
const coinsDataContainer= document.getElementsByClassName('coin-list-body')[0];
let wishlistData = null
if(JSON.parse(localStorage.getItem('wishlist-data')).length > 0){
    wishlistData = JSON.parse(localStorage.getItem('wishlist-data'));
}

if(wishlistData === null){
    document.getElementsByTagName('table')[0].style.display = 'none';
    const message = document.createElement('p');
    message.className = 'message'
    message.innerText = 'No wishlist data found!'
    document.getElementsByTagName('main')[0].appendChild(message)
}

console.log('wishlistData',wishlistData)

function renderCoins(coins){
    // console.log(coins)
    if(!coins)return;
    
    while(coinsDataContainer.firstChild ) coinsDataContainer.removeChild(coinsDataContainer.firstChild)
  
     coins.forEach((item,idx) => {
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

renderCoins(wishlistData)


  function handleWishlist(event,id,item){
       event.stopPropagation();
      const rankId = id.split('-')[2] 
      console.log(rankId)
    const filteredData =   wishlistData.filter(item => item.rank != rankId);
    console.log('filteredData',filteredData);
    
     localStorage.setItem('wishlist-data',JSON.stringify(filteredData))
     location.reload()
    
  }