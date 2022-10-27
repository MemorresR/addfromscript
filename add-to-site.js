(function(){

    // the minimum version of jQuery we want
    const v = "1.3.2";
    const IframeSrc = "https://wishbaby-new.bubbleapps.io/version-test/bookmarklet";
    const styles = Object.freeze({
      "modal_container": "z-index: 298934723984; width: 100%; height: 100%; position: fixed; top:0; background-color: rgb(0 0 0 / 40%); padding: 10%; right: 0; left: 0; margin: 0 auto;",
      "modal_main": "border-style: none; width: 740px; height: 570px; margin: 0 auto; position:relative; border-radius: 50px",
      "modal_button": "background-color: transparent; border: none;font-size: 20px;padding: 25px 30px;float: right;",
      "modal_header": "position: absolute; right: 0;",
      "modal_body": "border-radius: 30px; height:100%"
    });
    const AmazonImageRegExp = /\._([a-zA-Z0-9_])(.)*.\w+/gm;

    const NewDOMEl = (tag, prop) => Object.assign(document.createElement(tag), prop);

    // check prior inclusion and version
    if (window.jQuery === undefined || window.jQuery.fn.jquery < v) {
        var done = false;
        var script = document.createElement("script");
        script.src = "https://ajax.googleapis.com/ajax/libs/jquery/" + v + "/jquery.min.js";
        script.onload = script.onreadystatechange = function(){
            if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
                done = true;
                initWbBookmarklet();
            }
        };
        document.getElementsByTagName("head")[0].appendChild(script);
    } else {
        initWbBookmarklet();
    }

    /**
      * Data scrap
      * @supports Amazon, Target, Etsy
      */

    function getCurrentURL () {
      return window.location.href
    }

    function scrapProductTitle(referrer) {

      const productTitle = document.getElementById("productTitle");
      if (productTitle === undefined) {
          return document.title;
      }
      return productTitle.innerText;

    }

    function scrapProductPrice() {
      const collection = document.getElementById("buybox");
      // const collection = document.getElementById("corePrice_feature_div");
      var priceTagElem = collection.getElementsByClassName("a-price")[0];
      var finalPrice = null;

      if (priceTagElem === undefined) {
        priceTagElem = document.getElementById("price_inside_buybox");
        finalPrice = priceTagElem.innerText;
      } else {
        finalPrice = priceTagElem.firstChild.innerText;
      }

      return finalPrice;

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

    function scrapProductImages() {
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

      console.log(productImageCollection);
      return productImageCollection;

    }

    function initWbBookmarklet() {
      scrapPage();
      setTimeout(addWbModal(), 2000);
    }

    function onClickCloseEvent() {
        var elem = document.getElementById("modalcontainer");
        return elem.remove();
    }

    function CreateIframe() {

      const EL_Iframe = NewDOMEl("iframe", {
        style:"width:100%; height: 100%; border-radius: 30px",
        src:IframeWithParameters(),
        scrolling:"no",
        name:"wishbaby_iframe",
        frameBorder:"0"
      });

      return EL_Iframe;

    }

    function createModal() {

      const EL_btn = NewDOMEl("button", {
        textContent: "X",
        style: styles.modal_button,
        onclick() { onClickCloseEvent() },
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

    function scrapPage (){

      let referrer = getCurrentURL();
      let productTitle = scrapProductTitle(referrer);
      let productPrice = scrapProductPrice();
      let productImages = scrapProductImages();

      return {
        "title": productTitle,
        "price": productPrice,
        "productImages": productImages
      }

    }

    function IframeWithParameters() {

      let getPageData = scrapPage();
      let urlWithParams = IframeSrc+"/?title="+getPageData.title+"&price="+getPageData.price+"&productimages=";
      for (var i=0; i<getPageData.productImages.length; i++) {
          urlWithParams = urlWithParams+getPageData.productImages[i]+"%2C";
      }

      console.log(urlWithParams);
      return urlWithParams;

    }

    function addWbModal() {

      let Modal = createModal();

      (window.wbBookmarklet = function() {
          document.body.appendChild(Modal);
      })();

    }

})();
