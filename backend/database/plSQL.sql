delimiter //
create procedure water_crop(
    in p_username varchar(50),
    in p_plot_no int
)
begin
    declare v_crop_price double;
    declare v_growth_days int;
    declare v_days_unwatered int;
    
    select c.price, c.growth_time_weeks * 7, 
           timestampdiff(hour, uf.last_watered, now())
    into v_crop_price, v_growth_days, v_days_unwatered
    from user_farms uf
    join crops c on uf.crop_name = c.crop_name
    where uf.username = p_username and uf.plot_no = p_plot_no;
    
    if v_days_unwatered > 8 then
        update user_farms
        set last_watered = now(),
            price_deduct = price_deduct + 
                         ((v_crop_price / v_growth_days) * (v_days_unwatered - 8))
        where username = p_username and plot_no = p_plot_no;
    else
        update user_farms
        set last_watered = now()
        where username = p_username and plot_no = p_plot_no;
    end if;
end//
delimiter ;

call water_crop(?, ?);



delimiter //
create trigger after_insert_on_users after insert on users for each row
begin 
	insert into user_stats (username) values (new.username);
    insert into user_farms (username, plot_no) values(new.username, 1);
end //
delimiter ;



delimiter //
create procedure reduce_user_inventory(
    in p_username varchar(50),
    in p_item_name varchar(50)
)
begin
    declare current_qty int;
    
    select quantity into current_qty
    from user_inventory
    where username = p_username and item_name = p_item_name;
    
    if current_qty > 1 then
        update user_inventory 
        set quantity = quantity - 1
        where username = p_username and item_name = p_item_name;
    else
        delete from user_inventory
        where username = p_username and item_name = p_item_name;
    end if;
end//
delimiter ;