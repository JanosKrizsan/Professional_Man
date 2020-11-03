import connection


@connection.connection_handler
def get_latest_card_id(cursor):
    cursor.execute("""
        SELECT cards_id_seq.last_value FROM cards_id_seq    
    """)
    card_id = cursor.fetchone()
    for i, k in card_id.items():
        return k


@connection.connection_handler
def get_latest_board_id(cursor):
    cursor.execute("""
        SELECT boards_id_seq.last_value FROM boards_id_seq    
    """)
    boards_id = cursor.fetchone()
    for i, k in boards_id.items():
        return k


@connection.connection_handler
def get_card_status(cursor, status_id):
    cursor.execute("""
        SELECT title FROM statuses
        WHERE id = %(status_id)s;
    """, {"status_id": int(status_id)})
    return cursor.fetchone()


@connection.connection_handler
def get_boards(cursor, session_id):
    cursor.execute("""
        SELECT * FROM boards
        WHERE user_id = %(session_id)s
        ORDER BY id;
    """, {"session_id": session_id})
    return cursor.fetchall()


@connection.connection_handler
def get_cards_for_board(cursor, board_id):
    cursor.execute("""
        SELECT * FROM cards
        WHERE board_id = %(board_id)s
        ORDER BY card_order
    """, {"board_id": board_id})
    return cursor.fetchall()


@connection.connection_handler
def rename_board(cursor, board_data):
    cursor.execute("""
                    UPDATE boards
                    SET title = %(board_title)s
                    WHERE id = %(board_id)s;
                    """,
                   {"board_id": board_data['id'], "board_title": board_data['title']})


@connection.connection_handler
def get_statuses(cursor):
    cursor.execute("""
        SELECT * FROM statuses
    """)
    return cursor.fetchall()


@connection.connection_handler
def add_board(cursor, data, session):
    cursor.execute("""
        INSERT INTO boards (title, user_id)
        VALUES (%(title)s, %(user_id)s)
    """, {"title": data['title'], "user_id": session["id"]})


@connection.connection_handler
def add_status(cursor, data):
    cursor.execute("""
        INSERT INTO statuses
        VALUES (%(id)s, %(title)s)
    """, {"id": data['id'], "title": data['title']})


@connection.connection_handler
def add_card(cursor, data):
    cursor.execute("""
        INSERT INTO cards (board_id, title, status_id, card_order)
        VALUES ( 
                %(board_id)s, 
                %(title)s, 
                %(status_id)s, 
                %(card_order)s)
    """, {
        "board_id": data['board_id'],
        "title": data['title'],
        "status_id": data['status_id'],
        "card_order": data['card_order']
    })


@connection.connection_handler
def edit_card(cursor, data):
    if data['operation'] == "drop" and "board_id" in data.keys():
        cursor.execute("""
            UPDATE cards
            SET board_id = %(board_id)s , status_id = %(status_id)s, card_order = %(order_id)s
            WHERE id = %(id_)s;
        """, {"id_": data['id'], "board_id": data['board_id'], "status_id": data['status_id'],
              "order_id": data['order_id']})
    elif data['operation'] == "drop":
        cursor.execute("""
            UPDATE cards
            SET card_order = %(order_id)s
            WHERE id = %(id_)s
        """, {"id_": data['id'], "order_id": data['order_id']})
    elif data['operation'] == "rename":
        cursor.execute("""
            UPDATE cards
            SET title = %(card_title)s
            WHERE id = %(card_id)s;
            
        """, {"card_id": data['id'], "card_title": data['title']})


@connection.connection_handler
def delete_board(cursor, data):
    cursor.execute("""
        DELETE FROM boards
        WHERE id = %(id_)s
    """, {"id_": data['id']})


@connection.connection_handler
def delete_status(cursor, data):
    cursor.execute("""
        DELETE FROM statuses
        WHERE id = %(id_)s
    """, {"id_": data['id']})


@connection.connection_handler
def delete_card(cursor, data):
    cursor.execute("""
        DELETE FROM cards
        WHERE id = %(id_)s
    """, {"id_": data['id']})


@connection.connection_handler
def get_id_from_user_name(cursor, username):
    cursor.execute("""
                    SELECT id FROM users
                    WHERE %(username)s = username
    """, {"username": username})
    id_ = cursor.fetchall()
    return id_[0]['id']


@connection.connection_handler
def get_password_from_user_name(cursor, username):
    cursor.execute("""
                    SELECT password FROM users
                    WHERE %(username)s = username
    """, {"username": username})
    password = cursor.fetchall()
    return password


@connection.connection_handler
def registration(cursor, username, password):
    cursor.execute("""
                    INSERT INTO users (username, password) 
                    VALUES (%(username)s, %(password)s);
    """, {'username': username, 'password': password})
