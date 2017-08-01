CREATE PROCEDURE [dbo].[load_item_codes] 
   @user_id int
AS
BEGIN
SET NOCOUNT ON

delete from temp_item_codes where part_no is null
insert into item_codes (	
    item_cat_id,
	part_no,
	national_stock_no,
	item_name,
	reorder_level,
	critical_level,
	unit_of_measure_id,
	monitoring_type_id,
	is_repairable,
	created_by,
	created_date) 
  select
    dbo.getItemCatIdByName(item_category) item_cat_id,
    part_no,
	national_stock_no,
	item_name,
	reorder_level,
	critical_level,
	dbo.getUnitOfMeasureId(uom),
	dbo.getMonitoringTypeId(monitoring_type),
	is_repairable,
	user_id,
	GETDATE()
	FROM temp_item_codes
	WHERE user_id = @user_id
	AND ISNULL(part_no,'')<>''
	AND ISNULL(item_name,'')<>''
	order by id

	delete from temp_item_codes WHERE part_no IN (SELECT part_no from item_codes)

END;	




