// It uses data_handler.js to visualize elements
import {dataHandler} from "./data_handler.js";

export let dom = {
    init: function () {
        // This function should run once, when the page is loaded.
    },
    clearBoardContainer: function () {
        const boardContainer = document.querySelector('#boards');
        boardContainer.innerHTML = '';
    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function (boards) {
            dom.clearBoardContainer();
            dom.showBoards(boards);
        });
    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also

        let boardList = '';
        for (let board of boards) {
            boardList += `
                <section class="board" data-id-num="${board.id}">
                <div class="board-header"><span class="board-title">${board.title}</span>
                    <button class="board-add card-add">Add Card</button>
                    <button class="board-delete"><img class="icon" src="/static/images/trashboard.png" alt="remove board"></button>
                    <button data-toggle="" class="board-toggle"><i class="fas fa-chevron-down"><img class="icon" src="/static/images/close.png" alt="close" ></i></button>
                </div>
                <div id="board-${board.id}" class="board-columns">
                </div>
                </section>
            `;
        }

        const outerHtml = `
            <div class="board-container">
                        <div><button id="add-board" class="board-add">Add Board</button></div>

                ${boardList}
            </div>
        `;

        const boardContainer = document.querySelector("#boards");
        boardContainer.insertAdjacentHTML('beforeend', outerHtml);


        const boardTitles = document.querySelectorAll('.board-title');
        for (let boardTitle of boardTitles) {
            let parentElement = boardTitle.parentElement;
            let boardId = parentElement.nextElementSibling.getAttribute('id');
            dom.changeElementIntoFormWhenClicked(boardTitle, parentElement, boardId);
        }

        const toggleButtons = document.querySelectorAll('.board-toggle');
        for (let button of toggleButtons) {
            button.addEventListener('click', function (event) {
                dom.toggleBoard(event);
            })
        }
        dom.addBoard();
        let deleteButtons = document.querySelectorAll(".board-delete");
        for (let button of deleteButtons) {
            button.addEventListener('click', function(event) {dom.deleteBoard(event)})
        }

    },
    loadCards: function (boardId) {
        // retrieves cards and makes showCards called

        dataHandler.getCardsByBoardId(boardId, function (cards) {
            dom.showCards(cards, boardId)
        })
    },
    showCards: function (cards, boardId) {
        // shows the cards of a board
        // it adds necessary event listeners also
        const parentBoard = document.getElementById(boardId),
            statuses = parentBoard.children;
        for (const card of cards) {
            for (let status of statuses) {
                if (parseInt(status.dataset.statusId) === card.status_id)
                    status.lastElementChild.innerHTML += `
                        <div id="${card.id}" class="card" draggable="true" data-order="${card.card_order}" data-board-id="${card.board_id}" data-status-id="${card.status_id}">
                          <div class="card-remove"><button><img class="icon" src="/static/images/delete.png" alt="remove card"></button></div>
                          <div class="card-title">${card.title}</div>
                          <div id="${card.id}" class="card-content"</div>
                        </div>`;
            }
        }
        let cardsExisting = parentBoard.querySelectorAll(".card");
        for (let card of cardsExisting) {
            card.addEventListener("dragstart", function (event) {dom.dragStartHandler(event)});
        }
        let deleteButtons = parentBoard.querySelectorAll(".card-remove button");
        for (let button of deleteButtons) {
            button.addEventListener('click', function () {
                dom.deleteCard()
            })
        }

    },
    clearStatusContainer: function (boardId) {
        const statusContainer = document.getElementById(boardId);
        statusContainer.innerHTML = '';

    },
    loadStatuses: function (boardId) {
        dataHandler.getStatuses(function (statuses) {
            dom.clearStatusContainer(boardId);
            dom.showStatuses(statuses, boardId);
            dom.loadCards(boardId)
        });
    },
    showStatuses: function (statuses, boardId) {
        const statusContainer = document.getElementById(boardId);
        let statusList = '';
        for (let status of statuses) {
            statusList += `
                <div data-status-id="${status.id}" class="board-column drop-zone" draggable="false">
                    <div class="board-column-title">${status.title}</div>
                    <div data-status-id="${status.id}" class="board-column-content "></div>
                </div>     
            `;
            statusContainer.innerHTML = statusList;
        }
        let currentStatuses = statusContainer.querySelectorAll(".drop-zone");
        for (let status of currentStatuses) {
            status.addEventListener("drop", function (event) {dom.dropHandler(event)});
            status.addEventListener("dragover", function (event) {dom.dragOverHandler(event)})
        }
    },
    deleteBoard: function (event) {
        const board = event.currentTarget.closest("section");
        let boardId = board.dataset.idNum;
        dataHandler.deleteBoard({"id": `${boardId}`, "to": "boards"});
        board.remove();
    },
    toggleBoard: function (event) {
        const button = event.currentTarget,
            boardId = button.closest("section").lastElementChild.id;
        if (button.dataset.toggle === "visible") {
            button.dataset.toggle = "not-visible";
            button.innerHTML = `<img class="icon" src="/static/images/close.png" alt="close" >`;
            dom.clearStatusContainer(boardId);
            let cardAddButton = button.closest("section").querySelector(".card-add");
            cardAddButton.removeEventListener('click', dom.addCard);
        } else {
            button.dataset.toggle = "visible";
            button.innerHTML = `<img class="icon" src="/static/images/view.png" alt="view" >`;
            dom.loadStatuses(boardId);
            let cardAddButton = button.closest("section").querySelector(".card-add");
            cardAddButton.addEventListener('click', dom.addCard);}
    },
    addBoard: function () {
        const addButton = document.querySelector('#add-board');
        addButton.addEventListener('click', function () {
            const boardNumber = document.querySelectorAll('.board').length + 1;
            let newSection = document.createElement('section');
                dataHandler._api_get('/get-board-id', function (response) {
                    let boardId = response + 1
                    newSection.classList.add('board');
                    newSection.setAttribute("data-id-num", `${boardId}`);
                    newSection.innerHTML = `<div class="board-header"><span class="board-title">Board ${boardNumber}</span>
                            <button class="board-add card-add">Add Card</button>
                            <button class="board-delete"><img class="icon" src="/static/images/trashboard.png" alt="remove board"></button>
                            <button class="board-toggle"><i class="fas fa-chevron-down"><img class="icon" src="/static/images/close.png" alt="close" ></i></button>
                        </div>
                        <div id="board-${boardId}" class="board-columns">
                        </div>`;
                    document.querySelector('.board-container').appendChild(newSection);
                    dataHandler.createNewBoard({"title": `Board ${boardNumber}`, "to": "boards"});
                    let lastToggleButton = document.querySelector('.board:last-child .board-toggle');
                    lastToggleButton.addEventListener('click', function (event) {dom.toggleBoard(event)});

                    const boardTitle = newSection.querySelector('.board-title');
                    const parentElement = boardTitle.parentElement;

                    dom.changeElementIntoFormWhenClicked(boardTitle, parentElement, boardId);
                    let deleteButton = newSection.querySelector(".board-delete");
                    deleteButton.addEventListener('click', function (event) {dom.deleteBoard(event)})
                });

        });
    },
    deleteCard: function (cardId) {
        let deleteButton = event.currentTarget,
            card = deleteButton.closest("div").parentElement,
            cardContent = card.querySelector(".card-content");
        cardId === null ? cardId = null : cardId = cardContent.id;
        dataHandler.deleteCard({"id": `${cardId}`, "to": "cards"});
        card.remove()
    },
    dragStartHandler: function(ev) {
        ev.stopImmediatePropagation();
        ev.dataTransfer.setData("id", ev.target.id);
    },
    dragOverHandler: function(ev) {
        ev.preventDefault();
        if (ev.target.getAttribute("draggable") === true) {
            ev.dataTransfer.dropEffect = "none"
        } else {
            ev.dataTransfer.dropEffect = "all"
        }
    },
    dropHandler: function(ev) {
        ev.preventDefault();
        let id = ev.dataTransfer.getData("id"),
            card = document.getElementById(id);
        let dropTarget = ev.currentTarget,
            dropTargetCL = dropTarget.classList;
        if (dropTargetCL.contains("drop-zone")) {
            dropTarget.querySelector(".board-column-content").appendChild(card);
            let newBoard = card.closest('section'),
                newStatus = card.closest('div').parentElement,
                siblingList = Array.from(newStatus.querySelectorAll(".card")).slice(1, -1),
                newOrderId = card.parentElement.childElementCount -1,
                newBoardId = newBoard.lastElementChild.id.replace(/\D/g,''),
                newStatusId = newStatus.dataset.statusId;
            for (let sibling of siblingList) {
                sibling.dataset.order = sibling.previousSibling.className === "card" ? parseInt(sibling.previousSibling.dataset.order) + 1: 1 ;
                dataHandler.dropCard({"id": sibling.id, "order_id": sibling.dataset.order, "to": "cards", "operation": "drop"})
            }
            dataHandler.dropCard({"id": card.id, "board_id": newBoardId, "status_id": newStatusId, "order_id": newOrderId, "to": "cards", "operation": "drop"});
            card.dataset.order = newOrderId;
            card.dataset.boardId = newBoardId;
            card.dataset.statusId = newStatusId;
        } else { alert("You can't do that!")}

    },
    addCard: function () {
        const thisBoard = this.closest('section');
        const boardColumn = thisBoard.querySelector('.board-columns');
        const newColumn = boardColumn.querySelector('.board-column');
        let boardId = thisBoard.dataset.idNum;
        let numberOfCards = newColumn.querySelectorAll('.card').length + 1;
        dataHandler.createNewCard({
            "board_id": boardId,
            "title": `New Card ${numberOfCards}`,
            "status_id": "0",
            "card_order": `${numberOfCards - 1}`,
            "to": "cards"
        });
        dataHandler._api_get('/get-card-id', function (response) {
            let cardId = parseInt(response) + 1;
            let card = document.createElement("div");
            card.classList.add("card", "draggable");
            card.setAttribute("draggable", "true");
            card.setAttribute("data-order", `${numberOfCards - 1}`);
            card.setAttribute("data-board-id", `${boardId}`);
            card.setAttribute("data-status-id", "0");
            card.setAttribute("id", `${cardId}`);
            card.innerHTML = `
                  <div class="card-remove"><button><img class="icon" src="/static/images/delete.png" alt="remove card"></button></div>
                  <div class="card-title">New Card ${numberOfCards}</div>
                  <div id="${cardId}" class="card-content"</div>`;
            card.addEventListener("dragstart", function (event) {dom.dragStartHandler(event)});
            newColumn.querySelector('.board-column-content').appendChild(card);
            let removeButtons = thisBoard.querySelectorAll(".card-remove button");
            for (let button of removeButtons) {
                button.addEventListener('click', function (cardId) {
                    dom.deleteCard(cardId)
                })
            }
        });
    },
    replaceTag: function (tagToChange, tagToPutIn) {
        tagToChange.parentElement.replaceChild(tagToPutIn, tagToChange);
    },
    createForm: function (boardId) {
        const form = document.createElement('form');
        form.setAttribute('id', 'postData');
        form.setAttribute('method', 'post');

        const input = document.createElement('input');
        input.setAttribute('class', 'board-title');
        input.setAttribute('id', 'title-input');
        input.setAttribute('data-board-id', boardId);
        form.appendChild(input);


        input.addEventListener('keydown', function (event) {
            if (event.isComposing || event.key === 13) {
                form.submit();
            }
        });

        form.addEventListener('submit', dom.postDataForBoard);

        return form;
    },
    postDataForBoard: function (event) {
        event.preventDefault();

        const title = document.querySelector('#title-input');

        dataHandler.renameBoard(title.dataset.boardId, title.value);

        const form = document.querySelector('#postData');
        const parentElement = form.parentElement;
        const boardId = parentElement.nextElementSibling.getAttribute('id');

        parentElement.insertAdjacentHTML('afterbegin', `<span class="board-title">${title.value}</span>`);
        form.remove();

        dom.changeElementIntoFormWhenClicked(parentElement.firstElementChild, parentElement, boardId);
    },
    checkIfQueryExists: function (query) {
        return document.querySelector(query);
    },
    changeElementIntoFormWhenClicked: function (element, parentElement, boardId) {
        const currentName = element.textContent;

        element.addEventListener('click', function () {
            if (dom.checkIfQueryExists('#title-input') === null) {
                dom.replaceTag(element, dom.createForm(boardId));

                const createdElement = document.querySelector('#title-input');
                createdElement.focus();
                createdElement.addEventListener('blur', function () {
                    createdElement.parentElement.insertAdjacentHTML('afterbegin', `<span class="board-title">${currentName}</span>`);
                    createdElement.remove();

                    dom.changeElementIntoFormWhenClicked(parentElement.firstElementChild, parentElement, boardId);
                })
            }
        });
    },
};