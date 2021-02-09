function MyUrlParser(el, data) {
    if (!isElement(el)) {
        return;
    }
    this.sheetElement = el;
    this.data = data || {};
    this.submitButton = undefined;
    this.form = undefined;
    this.resultsTable = undefined;

    this.build = function () {
        this.submitButton = document.createElement("button");
        this.submitButton.classList.add("submit-button");
        this.submitButton.type = "submit";
        this.submitButton.innerText = "Обновить данные";

        this.addFieldButton = document.createElement("div");
        this.addFieldButton.classList.add("add-item-button");
        this.addFieldButton.innerText = " + ";
        this.addFieldButton.addEventListener("click", () => {
            this.createFormItem();
        });

        this.resultsTable = document.createElement("div");
        this.resultsTable.classList.add("results-table");

        this.form = document.createElement("form");
        this.form.classList.add("data-form");
        this.formInputs = document.createElement("div");
        this.formInputs.classList.add("form-inputs");

        const data = Object.values(this.data);
        if (data.length) {
            data.forEach((url, i) => {
                this.createFormItem(url, i);
            });
        }
        this.form.appendChild(this.formInputs);
        this.form.appendChild(this.addFieldButton);
        this.form.appendChild(this.submitButton);
        this.sheetElement.appendChild(this.form);
        this.sheetElement.appendChild(this.resultsTable);

        this.form.onsubmit = (e) => {
            e.preventDefault();
            this.resultsTable.innerHTML = "";
            const data = new FormData(this.form);
            data.forEach((v, key) => {
                if (v.length)
                    this.resultsTable.insertAdjacentHTML(
                        "beforeend",
                        new ResultField(this.parseUrlString(v), v, key).build()
                    );
            });
        };
    };

    this.createFormItem = function (url, i) {
        const Url = url || "";
        const I = i >= 0 ? i : this.formInputs.childElementCount;
        const input = new InputField("urlInput-" + I, this.formInputs, Url);
        input.build();
        this.formInputs
            .querySelector(`#${input.removeId}`)
            .addEventListener("click", () => {
                input.remove();
            });
    };

    this.parseUrlString = function (string = "") {
        const result = {
            type: { name: "Тип страницы", value: undefined },
            direct: { name: "Направление работы", value: undefined },
            filterParam: { name: "Параметры фильтра", value: undefined },
            project: { name: "Проект", value: undefined },
        };
        const splitedUrl = string.split("/").slice(4);
        if (splitedUrl.length >= 1) {
            if (splitedUrl[0] === "website") {
                result.direct.value = "Website";
            } else if (splitedUrl[0] === "vnedrenie-crm") {
                result.direct.value = "Crm";
            } else if (splitedUrl[0].length) {
                result.direct.value = "Unknown - " + splitedUrl[0];
            }

            if (splitedUrl.length >= 2) {
                if (!splitedUrl[1].length) {
                    result.type.value = "Index";
                } else if (splitedUrl[1] === "filter") {
                    result.type.value = "Filter";
                    let i = 2;
                    let filterString = "";
                    while (splitedUrl[i] != "apply") {
                        filterString += splitedUrl[i];
                        i++;
                    }
                    result.filterParam.value = filterString;
                } else if (splitedUrl[1].match(/PAGEN/)) {
                    result.type.value = "NextPage";
                } else if (splitedUrl[1].length && splitedUrl.length === 3) {
                    result.type.value = "Project";
                    result.project.value = splitedUrl[1];
                }
            }
        }

        return result;
    };

    return this;
}

function InputField(name, parentContainer, initValue) {
    if (!isElement(parentContainer)) {
        return;
    }
    this.parent = parentContainer;
    this.value = initValue;
    this.type = "text";
    this.name = name;
    this.removeId = `remove-id-${this.name}`;
    this.html = `
    <div class="input-text-field">
        <input id="id-${this.name}" name="${this.name}" type="${this.type}" value="${this.value}">
        <div id="${this.removeId}" class="remove-input-field"> - </div>
    </div>`;

    this.build = function () {
        parentContainer.insertAdjacentHTML("beforeend", this.html);
    };

    this.remove = function () {
        this.parent.querySelector(`#${this.removeId}`).parentElement.remove();
    };

    return this;
}

function ResultField(result, inputVal, name) {
    this.result = result;
    this.inputName = name;
    this.inputValue = inputVal;
    this.noParserResult = `
    <div class="result-item">
        <div class="bad">
            Извините, но я умею парсить только урл типа \"https://itrack.ru/portfolio/DATA/TO/PARSE\". По данному запросу у меня ничего нет.
        </div>
    </div>
    `;
    this.html = (content) => `
    <div class="result-field">
        <div class="result-header">Данные по запрошеному url --- \"${this.inputValue}\" ---</div>
        ${content}
    </div>`;
    this.param = function (key, value) {
        return value
            ? `
        <div class="result-item">
            <div>${key}</div>
            <div>${value}</div>
        </div>`
            : "";
    };

    this.build = function () {
        let params = "";
        Object.keys(this.result).forEach((key) => {
            params += this.param(this.result[key].name, this.result[key].value);
        });
        return params.length > 0
            ? this.html(params)
            : this.html(this.noParserResult);
    };

    return this;
}

function isElement(el) {
    try {
        if (!el || !el instanceof HTMLElement)
            throw new Error(
                "No target element argument in MyUrlParser constructor"
            );
        return true;
    } catch (e) {
        console.log(e.message);
        return false;
    }
}
