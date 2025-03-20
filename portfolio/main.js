

const h1 = document.getElementById("h1"),
  banner = document.getElementById("banner"),
  polyst = document.getElementById("sidename"),
  button = document.getElementById("button");




const onScroll = (event) => {
  const scrollPosition = event.target.scrollingElement.scrollTop;
  if (scrollPosition > 75) {
    banner.style.backgroundSize = "100%";
    h1.style.opacity = 0;
    h1.style.translate = "0 -50px";
    h1.style.scale = "0.9";
    button.style.translate = "0 -50px";
    button.style.scale = "0.3";
    button.style.marginLeft = "-85vw";
    button.style.position = "fixed";
    button.style.marginTop = "-220px";
    polyst.style.display = "block";
    polyst.style.fontSize = "44px";
    polyst.style.transition = "font-size 0.5s ease-in-out";




  } else {
    banner.style.backgroundSize = "180%";
    h1.style.opacity = 1;
    h1.style.translate = 0;
    h1.style.scale = 1;
    button.style.translate = 0;
    button.style.scale = 1;
    button.style.marginLeft = "85vw";
    button.style.marginTop = "220px";
    button.style.marginRight = "50px";
    polyst.style.display = "none";



  }
};

document.addEventListener("scroll", onScroll);