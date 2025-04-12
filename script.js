let dogCard = document.querySelector('.dogFruit');
dogCard.addEventListener('click',function(){
    let dogProfile = document.getElementById('dogProfile');
    dogProfile.style.display = 'block';
});
let catCard = document.querySelector('.catsTower');
catCard.addEventListener('click',function(){
 let catProfile = document.getElementById('catProfile');
 catProfile.style.display = 'block';
document.querySelector('.catsTower').style.display = 'none';
});