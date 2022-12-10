javascript:(function(){
  if(window.WishBabyBookmarklet!==undefined){

    WishBabyBookmarklet();

  } else {

    const locationSrc="https://wishbaby.com/bookmarklet";

    var getCurrentURL = () => {
      return window.location.href;
    };

    var getProductTitle = () => {
      return document.title;
    };


    var element = document.createElement("script");
    element.src = "https://res.cloudinary.com/ddo6legmx/raw/upload/v1670650567/Wishbaby/add-to-site_w0tl0v.js";

    element.onerror = (error) => {
      window.location = locationSrc+"/?referred=true&productUrl="+getCurrentURL()+"&title="+getProductTitle();
    };

    var windowErrorHandler = (event) =>{
        event.preventDefault();
        var error = event.error;
    };

    window.addEventListener('error', windowErrorHandler);

    var body = document.body;
    body.appendChild(element);
}
})();
