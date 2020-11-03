# Professional Man

![Todo](https://i.imgur.com/q3yq82u.png)

## What is this?

A simple task manager somewhat similar to Trello, with drag and drop features, where tasks can be grouped and freely edited as well.

## Tech Used

- Python with Flask & Jinja
- PostgreSQL
- JavaScript
- HTML & CSS

## Features

- User handling and authentication
- Toggle boards to be visible or hidden
- Create, edit and delete boards and cards
- Create, edit and delete tags within their respective boards
- Drag and drop cards, even between boards or tags

## Code Example

Toggling a board for viewing or hiding.
```
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
```

## Contributors

[Alex Alpek](https://github.com/alexalpek)<br>
[Barnabas Matrai](https://github.com/barnabasMatrai)<br>
[Janos Krizsan](https://github.com/JanosKrizsan)
