(function(){

  // the minimum version of jQuery we want
  const v = "1.3.2";
  // const IframeSrc = "https://wishbaby-new.bubbleapps.io/version-test/bookmarklet";
  const IframeSrc = "https://wishbaby.com/version-test/bookmarklet";
  const styles = Object.freeze({
    "modal_container": "z-index: 298934723984; width: 100%; height: 100%; position: fixed; top:0; background-color: rgb(0 0 0 / 40%); padding: 10%; right: 0; left: 0; margin: 0 auto;display: flex;align-items: center;overflow: auto;",
    "modal_main": "border-style: none; width: 740px; height: 600px; margin: 0 auto; position:relative; border-radius: 50px",
    "modal_button": "background-color: transparent; border: none;font-size: 20px;padding: 25px 30px;float: right;",
    "modal_header": "position: absolute; right: 0;",
    "modal_body": "border-radius: 30px; height:100%"
  });
  const AmazonImageRegExp = /\._([a-zA-Z0-9_])(.)*.\w+/gm;
  const TargetReferrer = Object.freeze({
    "Amazon": "www.amazon.com",
    "Target": "www.target.com",
    "Etsy": "www.etsy.com"
  });
  const DataSchema = {
    "TITLE": "title",
    "PRICE": "price",
    "PRODUCT_IMAGES": "productImages",
    "URL": "productUrl"
  };


  const NewDOMEl = (tag, prop) => Object.assign(document.createElement(tag), prop);
  var pageData=null;

  /**
    * Data scrap
    * @supports Amazon, Target, Etsy
    */

  function getCurrentURL () {
    return window.location.href
  }

  function getUri() {
    let url = getCurrentURL();
    let arr = url.split("/");
    return arr[2];
  }

  function sanitizeProductUrl(product_url) {
    let url = product_url.split('?')[0];
    return url;
  }
  /**
    * AMAZON DATA SCRAP
    * @elements url, title, price, images
    * @version 1
    */

  function getAmazonProductTitle() {
    const productTitle = document.getElementById("productTitle");
    if (productTitle === undefined || productTitle === null ) {
      return document.title;
    }
    return productTitle.innerText;
  }

  function elementExist( element ) {
    return document.body.contains( element );
  }

  function getAmazonProductPrice() {
    var price = "";
    var priceTagElem = document.querySelectorAll(".apexPriceToPay, .priceToPay")[0];

    if(elementExist(document.getElementById("outOfStock"))){
      price = null;
    }

    if ( elementExist( priceTagElem ) ) {
      price = priceTagElem.firstChild.innerText;
    }
    else if( elementExist( document.getElementById("price_inside_buybox") ) ) {
      price = priceTagElem.innerText;
    }

    return price;

  }

  function sourceIsThumbnail (source) {
    return source.match(AmazonImageRegExp);
  }

  function generateFullImage (source) {

    let imgSource = source;

    if (sourceIsThumbnail(imgSource) == null){
      return;
    }

    imgSource = imgSource.replace(AmazonImageRegExp, ".jpg");
    return imgSource;
  }

  function getAmazonProductImages() {
    const parent = document.getElementById("imageBlock_feature_div");
    const thumbnailNodeList = parent.getElementsByClassName("imageThumbnail");
    var productImageCollection = [];

    if (thumbnailNodeList == null ) {
      return;
    }

    for (const listEl of thumbnailNodeList) {
      let imgEl = listEl.getElementsByTagName('img')[0];
      let fullImage = generateFullImage(imgEl.src);
      if (fullImage) {
        productImageCollection.push(fullImage);
      }
    }

    return productImageCollection;
  }

  function scrapAmazonData() {
    return {
      [DataSchema.URL]: getCurrentURL(),
      [DataSchema.TITLE]: getAmazonProductTitle(),
      [DataSchema.PRICE]: getAmazonProductPrice(),
      [DataSchema.PRODUCT_IMAGES]: getAmazonProductImages()
    }
  }
  /*========== AMAZON DATA SCRAP ENDS =============*/

    /**
    * TARGET DATA SCRAP
    * @elements url, title, price, images
    * @version 1
    */

    function getTargetProductTitle() {
      const productTitle = document.querySelector("[data-test='product-title'] > span");
      if (productTitle === undefined) {
        return document.title;
      }
      return productTitle.innerText;
    }

    function getTargetProductPrice() {
      const priceTagEle = document.querySelector("[data-test='product-price']");
      if( priceTagEle === undefined ) {
        return null;
      }
      else {
        return priceTagEle.innerText;
      }
    }

    function getTargetProductImages() {
      const thumbnailNodeList = document.querySelectorAll(".styles__CarouselProductThumbnailWrapper-sc-1qcdgub-1 > button");
      let productImageCollection = [];
      if( thumbnailNodeList == null ) {
        return;
      }

      for (const listEl of thumbnailNodeList) {
        if( listEl.ariaLabel.includes("product image")) {
          let imgEle = listEl.getElementsByTagName('img')[0];
          productImageCollection.push( sanitizeProductUrl(imgEle.src) );
        }
      }
      return productImageCollection;
    }

    function scrapTargetData() {
      return {
        [DataSchema.URL]: sanitizeProductUrl(getCurrentURL()),
        [DataSchema.TITLE]: getTargetProductTitle(),
        [DataSchema.PRICE]: getTargetProductPrice(),
        [DataSchema.PRODUCT_IMAGES]: getTargetProductImages()
      }
    }


  /*=========== TARGET DATA SCRAP ENDS ===============*/

  /**
    * ETSY DATA SCRAP
    * @elements url, title, price, images
    * @version 1
    */

   function getEtsyProductTitle() {
    const productTitle = document.querySelector("[data-buy-box-listing-title='true']");
    if (productTitle === undefined) {
      return document.title;
    }
    return productTitle.innerText;
   }

   function getEtsyProductPrice() {
    const priceEleContainer = document.querySelector("[data-buy-box-region='price'] p");
    const spanElements = priceEleContainer.getElementsByTagName("span");
    const priceTagEle = spanElements[1];
    if( priceTagEle === undefined ) {
      if( priceEleContainer === undefined ) {
        return null;
      }
      else {
        return priceEleContainer.innerText;
      }
    }
    else {
      return priceTagEle.innerText;
    }
   }

   function getEtsyProductImages() {
    const imageListContainer = document.querySelector(".image-carousel-container");
    const imageEleParent = imageListContainer.getElementsByTagName("li");
    let productImageCollection = [];
    if( imageEleParent == null ) {
      return;
    }

    for (const listEl of imageEleParent) {
      let imgEle = listEl.getElementsByTagName('img')[0];
      if( imgEle === undefined ) {
        continue;
      }
      else {
        productImageCollection.push( sanitizeProductUrl(imgEle.src) );
      }
    }
    return productImageCollection;
   }


   function scrapEtsyData() {
    return {
      [DataSchema.URL]: getCurrentURL(),
      [DataSchema.TITLE]: getEtsyProductTitle(),
      [DataSchema.PRICE]: getEtsyProductPrice(),
      [DataSchema.PRODUCT_IMAGES]: getEtsyProductImages()
    }
   }

  /*=========== ETSY DATA SCRAP ENDS ===============*/

  var scrapDefaultData = () => {
    return {
      [DataSchema.URL]: getCurrentURL(),
      [DataSchema.TITLE]: document.title,
      [DataSchema.PRICE]: null,
      [DataSchema.PRODUCT_IMAGES]: null
    }
  }

  var InitWbBookmarklet = () => {
    pageData = ScarpPage();
    setTimeout(AddWbModal(), 2000);
  }

  var OnClickCloseEvent = () => {
      var elem = document.getElementById("modalcontainer");
      return elem.remove();
  }

  var CreateIframe = () => {
    const EL_Iframe = NewDOMEl("iframe", {
      style:"width:100%; height: 100%; border-radius: 30px",
      src:IframeWithParameters(),
      scrolling:"no",
      name:"wishbaby_iframe",
      frameBorder:"0"
    });

    return EL_Iframe;

  }

  var CreateModal = () => {
    const EL_btn = NewDOMEl("button", {
      textContent: "X",
      style: styles.modal_button,
      onclick() { OnClickCloseEvent() },
    });

    const Modal_header = NewDOMEl("header", {
        content: EL_btn,
        style: styles.modal_header
    });
    Modal_header.appendChild(EL_btn);

    const Modal_body = NewDOMEl("body", {
      style:styles.modal_body
    });

    var iFrame_instance = CreateIframe();
    Modal_body.appendChild(iFrame_instance);

    const Modal = NewDOMEl("section", {
      id:"wishbabymodal",
      style: styles.modal_main
    });

    Modal.appendChild(Modal_header);
    Modal.appendChild(Modal_body);

    const ModalContainer = NewDOMEl("wishbabymodal", {
      id:"modalcontainer",
      style: styles.modal_container
    });

    ModalContainer.appendChild(Modal);

    return ModalContainer

  }


  var ScarpPage = () => {
    let referrer = getUri();
    if( referrer.includes("amazon") ) {
      referrer = "www.amazon.com";
    }
    switch(referrer) {
      case TargetReferrer.Amazon:
        return scrapAmazonData();
        break;
      case TargetReferrer.Etsy:
        return scrapEtsyData();
        break;
      case TargetReferrer.Target:
        return scrapTargetData();
        break;
      default:
        return scrapDefaultData();
    }
  }

  var IframeWithParameters = () => {
    let urlWithParams = IframeSrc+"/?productUrl="+encodeURIComponent(pageData.productUrl)+"&title="+encodeURIComponent(pageData.title)+"&price="+pageData.price+"&productimages=";
    if (pageData.productImages !== null && pageData.productImages.length>0) {
      for (var i=0; i<pageData.productImages.length; i++) {
          urlWithParams = urlWithParams+pageData.productImages[i]+"%2C";
      }
    }
    return urlWithParams;

  }

  var AddWbModal = () => {
    let Modal = CreateModal();
    (window.wbBookmarklet = function() {
        document.body.appendChild(Modal);
    })();

  }

  // check prior inclusion and version
  var runShtick = () => {
    try{
      return InitWbBookmarklet();
    } catch(err) {
      console.log("Mute case error");
      console.log(err);
    }
  };

  runShtick();

})();
