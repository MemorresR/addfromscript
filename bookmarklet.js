javascript:(function(){
  if(window.WishBabyBookmarklet!==undefined){

    WishBabyBookmarklet();

  } else {

    const locationSrc="https://wishbaby.com/version-test/bookmarklet";

    var getCurrentURL = () => {
      return window.location.href;
    };

    var getProductTitle = () => {
      return document.title;
    };


    var element = document.createElement("script");
    element.src = "https://res.cloudinary.com/ddo6legmx/raw/upload/v1670532702/Wishbaby/add-to-site_rb6smu.js";

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
}})();
