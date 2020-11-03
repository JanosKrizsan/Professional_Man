ALTER TABLE IF EXISTS ONLY public.cards
    DROP CONSTRAINT IF EXISTS fk_card_board_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.cards
    DROP CONSTRAINT IF EXISTS fk_card_status_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.boards
    DROP CONSTRAINT IF EXISTS fk_boards_user_id CASCADE;


DROP TABLE IF EXISTS public.boards;
DROP SEQUENCE IF EXISTS public.boards_id_seq CASCADE;
DROP TABLE IF EXISTS public.cards;
DROP SEQUENCE IF EXISTS public.cards_id_seq CASCADE;
DROP TABLE IF EXISTS public.statuses;
DROP SEQUENCE IF EXISTS public.statuses_id_seq CASCADE;
DROP TABLE IF EXISTS public.users;
DROP SEQUENCE IF EXISTS public.users_id_seq CASCADE;

CREATE TABLE users
(
    id       serial PRIMARY KEY,
    username text,
    password text
);

CREATE TABLE boards
(
    id      serial PRIMARY KEY,
    title   text,
    user_id integer
);


CREATE TABLE cards
(
    id         serial PRIMARY KEY,
    board_id   integer,
    title      text,
    status_id  integer,
    card_order integer
);

CREATE TABLE statuses
(
    id    serial PRIMARY KEY,
    title text
);



INSERT INTO boards
VALUES (1, 'Board 1', 1);
INSERT INTO boards
VALUES (2, 'Board 2', 2);
SELECT pg_catalog.setval('boards_id_seq', 2, true);

INSERT INTO statuses
VALUES (0, 'new');
INSERT INTO statuses
VALUES (1, 'in progress');
INSERT INTO statuses
VALUES (2, 'testing');
INSERT INTO statuses
VALUES (3, 'done');
SELECT pg_catalog.setval('statuses_id_seq', 3, true);

INSERT INTO cards
VALUES (1, 1, 'new card 1', 0, 0);
INSERT INTO cards
VALUES (2, 1, 'new card 2', 0, 1);
INSERT INTO cards
VALUES (3, 1, 'in progress card', 1, 0);
INSERT INTO cards
VALUES (4, 1, 'planning', 2, 0);
INSERT INTO cards
VALUES (5, 1, 'done card 1', 3, 0);
INSERT INTO cards
VALUES (6, 1, 'done card 1', 3, 1);
INSERT INTO cards
VALUES (7, 2, 'new card 1', 0, 0);
INSERT INTO cards
VALUES (8, 2, 'new card 2', 0, 1);
INSERT INTO cards
VALUES (9, 2, 'in progress card', 1, 0);
INSERT INTO cards
VALUES (10, 2, 'planning', 2, 0);
INSERT INTO cards
VALUES (11, 2, 'done card 1', 3, 0);
INSERT INTO cards
VALUES (12, 2, 'done card 1', 3, 1);
SELECT pg_catalog.setval('cards_id_seq', 12, true);

INSERT INTO users
VALUES (1, 'Alex', '$2b$12$xkyCOyI8YZvqgbP5SUv31eAB1VV4O.K8X1lu/C4YNTOoR0Q6S594u');
INSERT INTO users
VALUES (2, 'Jani', '$2b$12$kw7tqo8M5AYdJ/tW4HIVEeLWj3iEN/tc0VTeXV2R5SKwAomfYZk5i');
SELECT pg_catalog.setval('users_id_seq', 2, true);


ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_card_status_id FOREIGN KEY (status_id) REFERENCES statuses (id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_card_board_id FOREIGN KEY (board_id) REFERENCES boards (id) ON DELETE CASCADE;
ALTER TABLE ONLY boards
    ADD CONSTRAINT fk_boards_user_id FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;
