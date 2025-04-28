create database farm;
use farm;
select * from users;


create table users (
	username varchar(50) primary key,
    password varchar(200)
);

create table crops (
	crop_name varchar (40) primary key,    
    price double,
    seeds_per_plot int,
    growth_time_weeks int,
    seed_url varchar (200),
    crop_url varchar(200)
);

create table farm_house (
		farm_house_name varchar(40) primary key,
        animal_type varchar(40),
        product_type varchar(40),
        daily_profit double,
        prince double,
        farm_house_url varchar(200),
        animal_url varchar(200),
        product_url varchar (200)
);


create table items (
	item_name varchar(50) primary key,
    price double,
    item_type varchar(50),
    item_url varchar(200)
);

CREATE TABLE user_stats (
    username varchar(50) primary key references users(username),
    level int default 1,                             
    xp bigint default 0,                                
    money bigint default 100000,
    no_of_plots int
);

create table user_inventory ();

create table user_crops ();

create table user_farms();

create table user_friends();

create table trades ();

create table  mailbox();