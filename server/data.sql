CREATE DATABASE keeperapp;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    hashed_password VARCHAR(255)
); 

CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    content VARCHAR(255),
    users_id INTEGER REFERENCES users(id)
);

INSERT INTO users (email, hashed_password) 
VALUES ('sample@gmail.com', 'sample');

INSERT INTO notes (title, content, users_id)
VALUES ('Sample', 'sample', 1);