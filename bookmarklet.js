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
    element.src = "https://res.cloudinary.com/nickelcdn/raw/upload/v1670272210/WishBaby/add-to-site_yugvfm.js";

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
