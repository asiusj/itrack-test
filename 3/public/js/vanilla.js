// $(function () {
//     $(".popup_open").on("click", function () {
//         var data = "url=" + $("#url").val();
//         var $form = $("#url").parents("form");
//         $.ajax({
//             url: $form.attr("action"),
//             data: data,
//             dataType: "JSON",
//             success: function (data) {
//                 $(".popup_open").addClass("open");
//                 $(".popup_inner").addClass("open");
//                 $(".popup_inner").text(data.text);
//                 $(".popup_inner").before("<h1>" + data.title + "</h1>");
//             },
//         });
//     });
// });

(function () {
    const popOpen = document.querySelector(".popup_open");
    const inputField = document.getElementById("url");
    const popInner = document.querySelector(".popup_inner");

    if (popOpen) {
        popOpen.addEventListener("click", () => {
            post(getUrl(), getData());
        });
    }

    function getData() {
        return inputField && inputField.value ? "url=" + inputField.value : "";
    }

    function getUrl() {
        return $(inputField).parent("form").get(0).getAttribute("action");
    }

    function showResultInPopUp(data) {
        $(popOpen).addClass("open");
        $(popInner)
            .addClass("open")
            .text(data.text)
            .before("<h1>" + data.title + "</h1>");
    }

    function post(url, data) {
        const req = new XMLHttpRequest();
        req.open("post", url);
        req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        req.send(JSON.stringify({ url: data }));
        req.onreadystatechange = function (e) {
            if (req.status === 200 && req.readyState === 4) {
                showResultInPopUp(JSON.parse(req.response));
            }
        };
    }
})();

function $(el) {
    return new n0tJQuery(el);
}

function n0tJQuery(el) {
    this.elements = [];
    if (el.length) {
        this.elements = el;
    } else {
        this.elements.push(el);
    }

    this.get = function (index) {
        if (index || index === 0) return this.elements[index];
        else return this.elements;
    };

    this.parent = function (selector) {
        const parents = [];
        this.elements.forEach((el) => {
            const elsParent = el.parentElement;
            const parent = function (el) {
                if (!el) return null;
                if (el.matches(selector)) return el;
                if (!el.parentElement) {
                    return null;
                } else return new n0tJQuery(el.parentElement).parent(selector);
            };
            const res = parent(elsParent);
            if (res) parents.push(res);
        });
        return new n0tJQuery(parents);
    };

    this.addClass = function (newClassName) {
        this.elements.forEach((el) => {
            el.classList.add(newClassName);
        });
        return this;
    };

    this.text = function (text) {
        this.elements.forEach((el) => {
            el.innerText = text;
        });
        return this;
    };

    this.before = function (newContent) {
        const args = [newContent];
        let fn = undefined;
        if (newContent.nodeName && newContent.nodeType === 1) {
            fn = Element.prototype.before;
        } else {
            fn = Element.prototype.insertAdjacentHTML;
            args.unshift("beforebegin");
        }

        this.elements.forEach((el) => {
            fn.call(el, ...args);
        });
        return this;
    };
}
