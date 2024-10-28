searchField = document.querySelector('.search-field')
searchResultModal = document.querySelector('#search-modal')
searchResultList = document.querySelector('#search-results')

searchField.addEventListener('input', async () => {
    const res = await fetch(`http://localhost:3001/api/search?query=${searchField.value}`)
    const data = await res.json()
    console.log(data);
    
    let content = ''
    if (data.length > 0) {
        data.forEach(item => {
            content += `
            <li> ${item.title} </li>
            `
        });
        searchResultList.innerHTML = content
        searchResultModal.style.display = 'flex'
    } else{
        console.log('no data');
        searchResultModal.style.display = 'none'
    }
})
