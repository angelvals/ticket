use test;
drop table if exists tbl_ticketpeligro;
drop table if exists ticket;
drop table if exists tbl_observacion;
drop table if exists tbl_peligro;
create table tbl_observacion(
	id_observacion INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(150)
);
create table tbl_peligro(
	id_peligro INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(150)
);
create table ticket(
	id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(50),
    msg VARCHAR (255),
    id_observacion INT REFERENCES tbl_observacion(id_observacion)
);
create table tbl_ticketpeligro(
	id_ticketpeligro INT AUTO_INCREMENT PRIMARY KEY,
    id_peligro INT REFERENCES tbl_peligro(id_peligro),
    id_ticket INT REFERENCES ticket(id)
);
insert into tbl_observacion(descripcion) values('Acto Seguro');
insert into tbl_observacion(descripcion) values('Acto Inseguro');
insert into tbl_observacion(descripcion) values('Condición Insegura');
insert into tbl_observacion(descripcion) values('Incidente');

insert into tbl_peligro(descripcion) values('Corriente eléctrica');
insert into tbl_peligro(descripcion) values('Temp. Extrema');
insert into tbl_peligro(descripcion) values('Humo-neblina-vapor');
insert into tbl_peligro(descripcion) values('Proyección sólidos');
insert into tbl_peligro(descripcion) values('iluminación');
insert into tbl_peligro(descripcion) values('Punto de corte');
insert into tbl_peligro(descripcion) values('Punto de atrapamiento');
insert into tbl_peligro(descripcion) values('Orilla filosa');
insert into tbl_peligro(descripcion) values('Superficie resbalosa');
insert into tbl_peligro(descripcion) values('Espacio estrecho');
insert into tbl_peligro(descripcion) values('Obstáculos');
insert into tbl_peligro(descripcion) values('Golpear contra');
insert into tbl_peligro(descripcion) values('Ser golpeado por');
insert into tbl_peligro(descripcion) values('Postura inadecuada');
insert into tbl_peligro(descripcion) values('Material peligroso');
insert into tbl_peligro(descripcion) values('Fuerza/Frecuencia');
insert into tbl_peligro(descripcion) values('Prisa / Presión');
insert into tbl_peligro(descripcion) values('Fatiga');
insert into tbl_peligro(descripcion) values('Otro (describir).');

insert into ticket (name, email, msg, id_observacion)
values('Angel', 'angel.mtzp@gmail.com','Body test 2', 1);
insert into tbl_ticketpeligro (id_ticket, id_peligro)
values(@@identity, 1);
insert into tbl_ticketpeligro (id_ticket, id_peligro)
values(@@identity, 2);

select 
	id, name, email, msg, tk.id_observacion, tbl_ob.descripcion as "ob_descripcion", 
	(select GROUP_CONCAT(CONCAT('{"id_ticketpeligro": ',id_ticketpeligro, ', "id_peligro": '), CONCAT(id_peligro, "}") SEPARATOR ',') 
    from tbl_ticketpeligro where id_ticket=tk.id) as id_peligro
from 
	ticket tk
inner join tbl_observacion tbl_ob on tk.id_observacion = tbl_ob.id_observacion;

	select * from tbl_ticketpeligro;