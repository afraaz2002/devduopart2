create database devduo2;
create table users(username varchar(20),email varchar(30),password varchar(30));

CREATE TABLE sessions (
    session_id VARCHAR(128) NOT NULL PRIMARY KEY,
    expires INT(11) NOT NULL,
    data TEXT
);