create database farm;
use farm;
select * from users;
select * from user_stats;
select * from user_inventory;
select * from user_crops;
select * from user_farms;
select * from crops;
select * from items;

update user_farms set crop_name = null, cultivation_date = null, status = 'empty', yield_collected = 1 where username = 'mukesh' and plot_no = 3; 

create table users (
	username varchar(50) primary key,
    password varchar(200)
);


insert into seeds values ( 'Wheat Kernal', 6750, 'wheatKernal.jpg' ), 
						 ( 'rice seed', 4400, 'riceSeed.jpeg' ), 
                         ( 'sorghum', 3360, 'sorghum.jpg' ), 
                         ( 'pearl millet', 920, 'pearlMillet.webp'),
                         ( 'moong bean', 3450, 'moongBeans.jpeg'),
                         ('cotton seed', 1200, 'cottonSeeds.jpeg'),
                         ( 'cumin seed', 6300, 'cuminSeeds.jpg'),
                         ( 'cluster bean', 4240, 'clusterBeans.webp'),
                         ('sesame seed', 1320, 'sesameSeeds.jpg'),
                         ('moath beans',2200, 'mothSeeds.webp');

 
create table seeds ( 
	seed_name varchar(50) primary key,
    price double,
	seed_url varchar (30)
);


create table crops (
	crop_name varchar (40) primary key,    
    price double,
    season enum ('rabi', 'kharif'),
    growth_time_weeks int,
    crop_url varchar(30),
    field_url varchar(30),
    seed_name varchar(50), 
    foreign key (seed_name) references seeds(seed_name) 
);

insert into crops values ('wheat', 100000, 'rabi', 17, 'wheat.webp', 'wheatCrop.jpg','Wheat Kernal'),
						 ('rice', 160000, 'kharif', 15, 'rice.jpg', 'riceCrop.jpg','rice seed'),
                         ('jowar', 104000, 'kharif', 14, 'jowar.jpg','jowarCrop.webp','sorghum'),
                         ('bajra',84000,'kharif',11,'bajra.jpeg', 'bajraCrop.webp','pearl millet'),
                         ('green gram',189000,'kharif',10,'greenGram.jpeg','greenGramCrop.webp','moong bean'),
                         ('cotton',240000,'kharif',21,'cotton.jpeg','cottonCrop.jpg','cotton seed'),
                         ('cumin',254000,'rabi',17,'cumin.jpg', 'cuminCrop.webp','cumin seed'),
                         ('cluster',159000, 'kharif',13, 'cluster.webp','clusterCrop.webp', 'cluster bean'),
                         ('sesame',200000,'kharif',13,'sesame.jpeg','sesameCrop.jpeg','sesame seed'),
                         ('moath',80000,'kharif',9,'moth.jpeg','mothCrop.jpg','moath bean' );




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
    no_of_plots int default 1
);






create table user_inventory (
	username varchar(50), foreign key (username) references users(username),
    item_name varchar(50),
    quantity int,
    unique(username, item_name)
);


create table user_crops (
	username varchar(50), foreign key (username) references users(username),
    crop_name varchar(40), foreign key (crop_name) references crops(crop_name),
    quantity double
);



create table user_farms (
    username varchar(50),
    plot_no int check (plot_no between 1 and 16),
    crop_name varchar(40) default null,
    cultivation_date datetime default null,
    last_watered datetime default null,
    status enum('empty', 'growing', 'harvested', 'withered') default 'empty',
    yield_collected boolean default true,
    price_deduct double default 0,
    foreign key (username) references users(username),
    foreign key (crop_name) references crops(crop_name),
    primary key (username, plot_no)
);


select * from user_farms;

create table user_friends();

create table trades ();

create table  mailbox();