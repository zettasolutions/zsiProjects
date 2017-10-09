
CREATE PROCEDURE [dbo].[load_aircraft_nomenclatures] 
   @user_id int
AS
BEGIN
SET NOCOUNT ON
update temp_aircraft_nomenclatures set remaining_time = replace(remaining_time,':','.')
delete from dbo.temp_aircraft_nomenclatures where ISNULL(part_no,'')='';
insert into items (	
    aircraft_info_id,
    item_code_id,
	serial_no,
	manufacturer_id,
--	dealer_id,
--	supply_source_id,
	remaining_time,
--	date_issued,
--	item_class_id,
	status_id,
	created_by,
	created_date) 
  select
    aircraft_id,
    item_code_id,
	serial_no,
	manufacturer_id,
--	dealer_id,
--	supply_source_id,
	cast(remaining_time as decimal(10,2)),
--	date_issued,
--	item_class_id,
	status_id,
    user_id,
	GETDATE()
	FROM temp_aircraft_nomenclatures_v
	WHERE user_id = 85
	and item_code_id IS NOT NULL
	order by id;

UPDATE a
       SET parent_item_id= dbo.getItemIdBySerial(b.parent_serial_no)
       FROM items a inner join temp_aircraft_nomenclatures b ON
	   a.serial_no=b.parent_serial_no

	delete from temp_aircraft_nomenclatures where user_id = @user_id;

END;	

--select top 1 convert(decimal(10,2), remaining_time) from temp_aircraft_nomenclatures



--Select * From temp_aircraft_nomenclatures Where IsNumeric(remaining_time) = 0