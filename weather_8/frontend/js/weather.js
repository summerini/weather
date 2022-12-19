const designedCode = {
    T1H: "℃",//기온
    RN1: "mm",//1시간 강수량
    UUU: "동서바람성분(m/s)",//
    VVV: "남북바람성분(m/s)",//
    REH: "%",//습도
    PTY: "강수형태",
    VEC: "풍향(deg)",//
    WSD: "m/s",//풍속
}

const designedRTY = {
    0: "맑음",
    1: "비",
    2: "비/눈",
    3: "눈",
    5: "빗방울",
    6: "빗방울눈날림",
    7: "눈날림"
}

const timeStandard = document.querySelector("#time-standard");
const search = document.querySelector("#search");

const main = document.querySelector("#main");
const temperature = document.querySelector("#temperature");
const wet = document.querySelector("#wet");
const wind = document.querySelector("#wind");

let isSearched = false;

search.addEventListener("keydown", (event) => {
    if (search.value != "" && event.key == "Enter") {
        let xhr = new XMLHttpRequest();
        let today = new Today();

        temperature.classList.remove("back");
        temperature.innerHTML = "";
        wet.classList.remove("back");
        wet.innerHTML = "";
        wind.classList.remove("back");
        wind.innerHTML = "";

        main.classList.remove("back");
        main.childNodes[0].classList.add("loading");
        main.childNodes[0].innerHTML = "로딩중...";
        main.style["background-image"] = '';

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    isSearched = true;
                    let responseData = JSON.parse(xhr.responseText).response.body.items.item;
                    timeStandard.innerHTML = "기준시각 : " + today.changeForm() + " 오전 6시";
                    main.classList.remove("loading");

                    for (let item of responseData) {
                        switch (item.category) {
                            case "T1H":
                                temperature.innerHTML = (item.obsrValue + designedCode[item.category]);
                                temperature.classList.add("back");
                                break;

                            case "REH":
                                wet.innerHTML = (item.obsrValue + designedCode[item.category]);
                                wet.classList.add("back");
                                break;

                            case "WSD":
                                wind.innerHTML = (item.obsrValue + designedCode[item.category]);
                                wind.classList.add("back");
                                break;

                            case "PTY":
                                main.childNodes[0].classList.remove("loading");
                                main.childNodes[0].innerHTML = (designedRTY[item.obsrValue]);
                                main.classList.add("back");
                                switch (parseInt(item.obsrValue)) {
                                    case 0:
                                        main.style["background-image"] = 'url("./resources/sun.png")';
                                        break;
                                    case 1:
                                        main.style["background-image"] = 'url("./resources/rain.png")';
                                        break;
                                    case 3:
                                        main.style["background-image"] = 'url("./resources/snow.png")';
                                        break;
                                    default:
                                        return false;
                                }
                                break;
                        }
                    }
                } else {
                    main.childNodes[0].classList.remove("loading");
                    main.childNodes[0].innerHTML = "";
                    main.style["background-image"] = '';

                    if (xhr.status == 400) {
                        alert("잘못된 도시명을 입력하였습니다. \n" +
                            "ex) 서울특별시 or 강남구");
                    } else {
                        alert("요청 서버 확인을 부탁 드립니다.");
                    }
                }
            }
        }
        xhr.open("GET", "http://127.0.0.1:3000/proxy?search=" + encodeURIComponent(search.value) + "&today=" + today.get, true);
        xhr.send();
    }
});


function Today() {
    let date = new Date();
    if (date.getHours() < 7) {
        date.setDate(date.getDate() - 1);
    }

    this.year = date.getFullYear();
    this.month = date.getMonth() + 1;
    this.day = date.getDate();

    function checkzero(num) {
        if (num < 10) {
            return '0' + num;
        } else {
            return num.toString();
        }
    }

    this.get = (this.year + checkzero(this.month) + checkzero(this.day)),

        this.changeForm = function () {
            return this.year + "년 " +
                this.month + "월 " +
                this.day + "일";
        }
};

let beforeWidth = window.innerWidth;
let detailBackPadRate = 80 / 800;
let detailPadRate = 150 / 800;
window.onresize = function () {

    if (isSearched) {
        const detailBacks = document.querySelectorAll("#detail > div");

        for (let detail of detailBacks) {
            detail.style["background-position-x"] = `${main.clientWidth * detailBackPadRate}px`;
            detail.style["padding-left"] = `${main.clientWidth * detailPadRate}px`;
        }
    }
    beforeWidth = window.innerWidth;
};
