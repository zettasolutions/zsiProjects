
CREATE PROCEDURE [dbo].[load_items_inv] 
   @warehouse_id int
   ,@user_id int null
AS
BEGIN
SET NOCOUNT ON

delete from dbo.temp_items_inv where part_no is null OR item_name is null
insert into dbo.items_inv (	
    item_code_id,
	warehouse_id,
	created_by,
	created_date) 
  select
    dbo.getItemCodeId(part_no),
	@warehouse_id,
	user_id,
	GETDATE()
	FROM dbo.temp_items_inv
	WHERE user_id = @user_id
	order by id

insert into dbo.item_status_quantity (
    item_inv_id,
	status_id,
	stock_qty)
  SELECT 
    dbo.getItemInvid(dbo.getItemCodeId(part_no),@warehouse_id),
 	dbo.getStatusid(status),
	quantity
  FROM dbo.temp_items_inv
	WHERE user_id = @user_id
	order by id

DELETE FROM temp_items_inv where user_id=@user_id;

END;	

