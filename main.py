from flask import Flask, render_template, url_for, request, session, redirect
from util import json_response
from util import verify_password, hash_password

import data_handler

app = Flask(__name__)

app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    if 'username' in session:
        return render_template('index.html')
    elif 'username' not in session:
        return redirect(url_for('login'))


@app.route("/get-board/<int:board_id>")
@json_response
def get_board(board_id: int):
    """
    Get board by id
    """
    return data_handler.get_board(board_id)


@app.route("/get-boards")
@json_response
def get_boards():
    """
    All the boards
    """
    session_id = session["id"]
    return data_handler.get_boards(session_id)


@app.route("/get-cards/<int:board_id>")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return data_handler.get_cards_for_board(board_id)


@app.route("/get-statuses")
@json_response
def get_statuses():
    """
    Get all basic statuses
    """
    return data_handler.get_statuses()


@app.route("/rename-board/<int:board_id>", methods=['POST'])
@json_response
def rename_board(board_id: int):
    """
    Rename board
    """
    board_title = request.json['title']
    return data_handler.rename_board(board_id, board_title)


@app.route("/post-data", methods=['POST', 'PUT', 'DELETE'])
@json_response
def post_data():
    data = request.get_json()
    if request.method == "POST":
        if data['to'] == "boards":
            data_handler.add_board(data, session)
        elif data['to'] == "statuses":
            data_handler.add_status(data)
        elif data['to'] == "cards":
            data_handler.add_card(data)
    elif request.method == "PUT":
        if data['to'] == "boards":
            data_handler.rename_board(data)
        if data['to'] == "cards":
            data_handler.edit_card(data)
    elif request.method == "DELETE":
        if data['to'] == "boards":
            data_handler.delete_board(data)
        elif data['to'] == "statuses":
            data_handler.delete_status(data)
        elif data['to'] == "cards":
            data_handler.delete_card(data)
    else:
        print("fag, wrong stuff")


@app.route("/get-card-id")
@json_response
def get_card_data():
    return data_handler.get_latest_card_id()


@app.route("/get-board-id")
@json_response
def get_board_data():
    return data_handler.get_latest_board_id()


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "GET":
        return render_template("login.html")
    elif request.method == "POST":
        username = request.form['username']
        hashed_password = data_handler.get_password_from_user_name(username)
        try:
            result = verify_password(request.form['password'], hashed_password[0]['password'])
        except IndexError:
            return render_template("login.html")
        if result:
            session['username'] = request.form['username']
            session['id'] = data_handler.get_id_from_user_name(session['username'])
            return redirect(url_for('index'))
        else:
            return render_template("login.html")


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "GET":
        return render_template('register.html')
    elif request.method == "POST":
        username = request.form['username']
        password = hash_password(request.form['password'])
        data_handler.registration(username, password)
        return redirect('/')


@app.route("/logout")
def logout():
    session.pop('username', None)
    session.pop('id', None)
    return redirect(url_for('index'))


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
