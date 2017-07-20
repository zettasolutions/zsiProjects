
CREATE PROCEDURE [dbo].[load_aircraft_type_nomenclatures] 
   @user_id int
AS
BEGIN
SET NOCOUNT ON

insert into aircraft_type_nomenclatures (	
    aircraft_type_id,
    item_code_id,
	created_by,
	created_date) 
  select
    dbo.getAircraftTypeId(aircraft_type) aircraft_type_id,
    dbo.getItemCodeId(part_no) item_code_id,
    user_id,
	GETDATE()
	FROM temp_aircraft_type_nomenclatures
	WHERE user_id = @user_id
	AND ISNULL(part_no,'')<>''
	order by id;

UPDATE a
       SET aircraft_type_nomenclature_pid= dbo.getAircraftTypeNomenclatureId(b.parent_part_no,dbo.getAircraftTypeId(b.aircraft_type))
       FROM aircraft_type_nomenclatures a inner join temp_aircraft_type_nomenclatures b ON
	   a.aircraft_type_id=dbo.getAircraftTypeId(b.aircraft_type)
	   and a.item_code_id=dbo.getItemCodeId(b.part_no)

	delete from temp_aircraft_type_item_codes where user_id = @user_id;

END;	




