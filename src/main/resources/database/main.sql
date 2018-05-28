-- init database connection
CREATE DATABASE IF NOT EXISTS dispatcher;
-- use database
use dispatcher;

-- create user table
CREATE TABLE users(
user_id bigint NOT NULL AUTO_INCREMENT COMMENT 'userid',
name varchar(50) NOT NULL COMMENT 'user name',
create_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'create time',
password varchar(50) NOT NULL COMMENT 'user`s password',
PRIMARY KEY (user_id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='user table';

-- create site_type table
CREATE TABLE site_type(
site_type_id int NOT NULL AUTO_INCREMENT COMMENT 'site_type id',
name varchar(50) NOT NULL COMMENT 'site_type name',
PRIMARY KEY (site_type_id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='site type';

-- create site table
CREATE TABLE site(
site_id bigint NOT NULL AUTO_INCREMENT COMMENT 'siteid',
name varchar(50) NOT NULL COMMENT 'site name',
create_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'create time',
site_type int NOT NULL COMMENT 'site type',
longitude varchar(20) NOT NULL COMMENT 'longitude of the point to the site',
latitude varchar(20) NOT NULL COMMENT 'latitude of the point to the site',
phone varchar(20) COMMENT 'phone number',
address varchar(50) COMMENT 'address description',
users bigint NOT NULL COMMENT 'master user id',
PRIMARY KEY (site_id),
FOREIGN KEY (users) REFERENCES users(user_id) ON DELETE CASCADE,
FOREIGN KEY (site_type) REFERENCES site_type(site_type_id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='site table';

-- create orders_state table
CREATE TABLE orders_state(
orders_state_id int NOT NULL AUTO_INCREMENT COMMENT 'orders_state id',
name varchar(50) NOT NULL COMMENT 'orders_state name',
PRIMARY KEY (orders_state_id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='orders_state type';

-- create order table
CREATE TABLE orders(
order_id bigint NOT NULL AUTO_INCREMENT COMMENT 'orderid',
create_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'create time',
orders_state int NOT NULL COMMENT 'orders state',
memo varchar(100) COMMENT 'orders memo',
users bigint  NOT NULL COMMENT 'order user id',
PRIMARY KEY (order_id),
FOREIGN KEY (users) REFERENCES users(user_id) ON DELETE CASCADE,
FOREIGN KEY (orders_state) REFERENCES orders_state(orders_state_id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='order table';

-- create weight_type table
CREATE TABLE weight_type(
weight_type_id int NOT NULL AUTO_INCREMENT COMMENT 'weight_type id',
weight_type_name varchar(5) NOT NULL  COMMENT 'weight type,ton,kg,g',
PRIMARY KEY (weight_type_id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='weight_type table';

-- create cargo_type table
CREATE TABLE cargo_type(
cargo_type_id int NOT NULL AUTO_INCREMENT COMMENT 'cargo_type id',
cargo_type_name varchar(5) NOT NULL  COMMENT 'cargo type',
PRIMARY KEY (cargo_type_id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='cargo_type table';

-- create cargo table
CREATE TABLE cargo(
cargo_id bigint NOT NULL AUTO_INCREMENT COMMENT 'cargoid',
create_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'create time',
name varchar(50) NOT NULL COMMENT 'cargo name',
cargo_type int NOT NULL COMMENT 'cargo type ',
weight_type int NOT NULL COMMENT 'cargo type ',
length double NOT NULL COMMENT 'cargo length range 1m,0.1m,0.01m',
width double NOT NULL COMMENT 'cargo width  range 1m,0.1m,0.01m',
height double NOT NULL COMMENT 'cargo height  range 1m,0.1m,0.01m',
load_time int NOT NULL COMMENT 'seconds, load and unload are the same',
memo varchar(100) COMMENT 'cargo memo',
PRIMARY KEY (cargo_id),
FOREIGN KEY (cargo_type) REFERENCES cargo_type(cargo_type_id),
FOREIGN KEY (weight_type) REFERENCES weight_type(weight_type_id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='cargo table';

-- create cargoList table
CREATE TABLE cargo_list(
cargo_list_id bigint NOT NULL AUTO_INCREMENT COMMENT 'cargo_list id',
create_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'create time',
cargo_name varchar(50) NOT NULL COMMENT 'cargo name',
cargo_count int NOT NULL COMMENT 'cargo name',
site bigint NOT NULL COMMENT 'site id',
cargo bigint NOT NULL COMMENT 'cargo id',
PRIMARY KEY (cargo_list_id),
FOREIGN KEY (site) REFERENCES site(site_id)  ON DELETE CASCADE,
FOREIGN KEY (cargo) REFERENCES cargo(cargo_id)  ON DELETE CASCADE
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='cargo_list table,list items in a site';

-- create order_detail table
CREATE TABLE orders_detail(
orders_detail_id bigint NOT NULL AUTO_INCREMENT COMMENT 'order detail id',
create_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'create time',
cargo_name varchar(50) NOT NULL COMMENT 'cargo name',
cargo_count int NOT NULL COMMENT 'each cargo number',
start_site bigint NOT NULL COMMENT 'start site',
end_site bigint NOT NULL COMMENT 'end site',
orders bigint NOT NULL COMMENT 'the order it belongs to',
cargo bigint NOT NULL COMMENT 'cargo id',
PRIMARY KEY (orders_detail_id),
FOREIGN KEY (start_site) REFERENCES site(site_id),
FOREIGN KEY (end_site) REFERENCES site(site_id),
FOREIGN KEY (orders) REFERENCES orders(order_id),
FOREIGN KEY (cargo) REFERENCES cargo(cargo_id) 
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='order_detail table';

-- create repairer table
CREATE TABLE repairer(
repairer_id int NOT NULL AUTO_INCREMENT COMMENT 'repairer id',
create_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'create time',
repairer_name varchar(50) NOT NULL COMMENT 'repairer name',
PRIMARY KEY (repairer_id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='repairer table';

-- create car_state table
CREATE TABLE car_state(
car_state_id int NOT NULL AUTO_INCREMENT COMMENT 'car_state id',
create_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'create time',
car_state_name varchar(50) NOT NULL COMMENT 'car_state name',
PRIMARY KEY (car_state_id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='car_state table';

-- create car_type table
CREATE TABLE car_type(
car_type_id int NOT NULL AUTO_INCREMENT COMMENT 'car_type id',
create_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'create time',
car_type_name varchar(50) NOT NULL COMMENT 'car_type name',
PRIMARY KEY (car_type_id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='car_type table';

-- create car table
CREATE TABLE car(
car_id bigint NOT NULL AUTO_INCREMENT COMMENT 'car id',
create_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'create time',
car_name varchar(50) NOT NULL COMMENT 'car name',
car_type int NOT NULL COMMENT 'car type',
car_state int NOT NULL COMMENT 'car state',
length double NOT NULL COMMENT 'car length unit meter',
width double NOT NULL COMMENT 'car width ',
height double NOT NULL COMMENT 'car height',
max_weight int NOT NULL COMMENT 'car max hold weight,unit kg',
repairer int COMMENT 'repared id',
PRIMARY KEY (car_id),
FOREIGN KEY (repairer) REFERENCES repairer(repairer_id),
FOREIGN KEY (car_type) REFERENCES car_type(car_type_id),
FOREIGN KEY (car_state) REFERENCES car_state(car_state_id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='car table';

-- create task table
CREATE TABLE task(
task_id bigint NOT NULL AUTO_INCREMENT COMMENT 'task id',
create_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'create time',
cargo_name varchar(50) NOT NULL COMMENT 'cargo name',
cargo_count int NOT NULL COMMENT 'each cargo number',
task_state int NOT NULL COMMENT 'task_state',
start_site bigint NOT NULL COMMENT 'start site',
end_site bigint NOT NULL COMMENT 'end site',
orders_detail bigint NOT NULL COMMENT 'the order details of it',
car bigint COMMENT 'car id',
PRIMARY KEY (task_id),
FOREIGN KEY (task_state) REFERENCES orders_state(orders_state_id),
FOREIGN KEY (start_site) REFERENCES site(site_id),
FOREIGN KEY (end_site) REFERENCES site(site_id),
FOREIGN KEY (orders_detail) REFERENCES orders_detail(orders_detail_id),
FOREIGN KEY (car) REFERENCES car(car_id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='task table';


-- create car_cargo table
CREATE TABLE car_cargo(
car_cargo_id int NOT NULL AUTO_INCREMENT COMMENT 'car_cargo id',
create_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'create time',
car_type int NOT NULL COMMENT 'car type',
cargo_type int NOT NULL COMMENT 'cargo type ',
PRIMARY KEY (car_cargo_id),
FOREIGN KEY (car_type) REFERENCES car_type(car_type_id),
FOREIGN KEY (cargo_type) REFERENCES cargo_type(cargo_type_id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='car_cargo compatible table';