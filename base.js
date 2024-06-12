let jsonObj = "";
let pageIndex = 1;

// 定義一個變數來防止重複請求和控制請求速率
let isRequestInProgress = false;
let requestTimeout = null;

// 加載訊息
let loadingMsg = document.getElementById("loadingMsg");

// 監聽滾動事件
window.addEventListener('scroll', function() {
    // 獲取滾動位置和頁面高度
    let scrollTop = window.scrollY;
    let windowHeight = window.innerHeight;
    let documentHeight = document.documentElement.scrollHeight;

    // 檢查是否滾動到底部，並且沒有其他請求在進行中
    if (scrollTop + windowHeight >= documentHeight - 100 && !isRequestInProgress) {
        loadingMsg.classList.remove("hide");
        loadingMsg.classList.add("show");
        isRequestInProgress = true; // 標記請求正在進行中
        pageIndex += 1;
        getPxmartProd(); // 發送請求
    }
});

// 請求全聯商品
function getPxmartProd() {
    if (requestTimeout) {
        clearTimeout(requestTimeout); // 清除之前的計時器
    }

    requestTimeout = setTimeout(() => {
        let xhr = new XMLHttpRequest();
        let api_url = `https://api-pxbox.es.pxmart.com.tw/app/1.0/spu/get_products?CategoryId=535&SortType=0&PageIndex=${pageIndex}&PageSize=200`;
        xhr.open("GET", api_url, true);
        xhr.send();
        xhr.addEventListener('load', () => {
            if (xhr.status == 200) { 
                let jsonResponse = xhr.responseText;
                jsonObj = JSON.parse(jsonResponse);
                let products = parseProduct(jsonObj);
                renderPage(products);
            } else {
                console.log("error");
            }
            isRequestInProgress = false;
        }, false);
        loadingMsg.classList.remove("show");
        loadingMsg.classList.add("hide");
    }, 500); // 設定500毫秒的延遲，避免過快的請求
}

// 解析json
function parseProduct(jsonObj) {
    let products = jsonObj['data']['products'];
    return products;
}

// 渲染頁面
function renderPage(products) {
    if (products != undefined && products != null) {
        let container = document.getElementById("container");
        let prod = null;
        let prodName = "";
        let prodPic = "";
        let prodPrice = 0;
        let htmlStr = "";
        for (let i = 0; i < products.length;i++) { 
            prod = products[i];
            prodName = prod['product_name'];
            prodPic = prod['picture'];
            prodPrice = prod['sale_price']
            
            htmlStr +=   '<div class="product">'+
                            '<div class="productImg">'+
                                `<img src="${prodPic}" alt="">`+
                            '</div>'+
                            '<div class="productName">'+
                                `${prodName}`+
                            '</div>'+
                            '<div class="productPrice">' +
                                `NT$ ${prodPrice}` +
                            '</div>' +
                          '</div>';
        }
        container.innerHTML += htmlStr;
    }
}

// 預載執行請求
getPxmartProd();
