// this object contains the functions which handle the data and its reading/writing
// feel free to extend and change to fit your needs

// (watch out: when you would like to use a property/function of an object from the
// object itself then you must use the 'this' keyword before. For example: 'this._data' below)
export let dataHandler = {
    _data: {}, // it contains the boards and their cards and statuses. It is not called from outside.
    _api_get: function (url, callback) {
        // it is not called from outside
        // loads data from API, parses it and calls the callback with it

        fetch(url, {
            method: 'GET',
            credentials: 'same-origin'
        })
        .then(response => response.json())  // parse the response as JSON
        .then(json_response => callback(json_response));  // Call the `callback` with the returned object
    },
    _api_send: function (url,method, data) {
        // it is not called from outside
        // sends the data to the API, and calls callback function

        fetch(url, {
            method: method,
            credentials: 'same-origin',
            headers: {'content-Type': 'application/json'},
            body: JSON.stringify(data)
        })
            .then(response => response.json());
    },
    init: function () {
    },
    getBoards: function (callback) {
        // the boards are retrieved and then the callback function is called with the boards

        // Here we use an arrow function to keep the value of 'this' on dataHandler.
        //    if we would use function(){...} here, the value of 'this' would change.
        this._api_get('/get-boards', (response) => {
            this._data = response;
            callback(response);
        });
    },
    getBoard: function (boardId, callback) {
        // the board is retrieved and then the callback function is called with the board
        this._api_get('/get-boards', (response) => {
            this._data = response;
            for (let board of response) {
                if (board.id === boardId) {
                    callback(board);
                }
            }
        });
    },
    renameBoard: function (boardId, boardTitle) {
        this._api_send('/post-data','PUT', {"id": boardId.replace(/\D/g,''), "title": boardTitle, "to": "boards"})
    },
    getStatuses: function (callback) {
        // the statuses are retrieved and then the callback function is called with the statuses
        this._api_get('/get-statuses', (response) => {
            this._data = response;
            callback(response)
        })
    },
    getCardsByBoardId: function (boardId, callback) {
        // the cards are retrieved and then the callback function is called with the cards
        this._api_get(`/get-cards/${boardId.replace(/\D/g,'')}`, (response) => {
            this._data = response;
            callback(response)
        })
    },
    dropCard: function (cardData) {
        this._api_send('/post-data', 'PUT', cardData)
    },
    createNewBoard: function (boardData) {
        // creates new board, saves it and calls the callback function with its data
        this._api_send('/post-data', 'POST', boardData)
    },
    deleteBoard: function (boardData) {
        // creates new board, saves it and calls the callback function with its data
        this._api_send('/post-data', 'DELETE', boardData)
    },
    renameCard: function (cardData) {
        this._api_send('/post-data', 'PUT', cardData)
    },
    deleteCard: function (cardData) {
        // creates new board, saves it and calls the callback function with its data
        this._api_send('/post-data', 'DELETE', cardData)
    },
    createNewCard: function (cardData) {
        // creates new card, saves it and calls the callback function with its data
        this._api_send('/post-data', 'POST', cardData)
    }
};
